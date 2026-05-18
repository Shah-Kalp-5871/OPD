import { io as ClientIo } from 'socket.io-client';
import axios from 'axios';

/**
 * MedFlow Enterprise Stress & Load Testing Harness
 * 
 * Simulates:
 * 1. WebSocket Reconnection Storms (1000+ simultaneous connections)
 * 2. High-Frequency Webhook Queue Floods (Stripe/Razorpay payloads)
 * 3. Redis adapter synchronization pressure
 */

const BACKEND_URL = 'http://localhost:3000';
const WS_URL = 'http://localhost:3000/telemedicine';

interface StressTestOptions {
  wsConnections: number;
  webhookBursts: number;
  durationMs: number;
}

export async function runStressTest(options: StressTestOptions) {
  console.log(`\n=== MedFlow Production Stress Test Initialized ===`);
  console.log(`Simulating:`);
  console.log(`- WebSocket connections: ${options.wsConnections}`);
  console.log(`- Webhook payload burst frequency: ${options.webhookBursts}`);
  console.log(`- Run duration: ${options.durationMs}ms\n`);

  const sockets: any[] = [];
  let successfulConnections = 0;
  let connectionFailures = 0;

  // 1. Simulate WebSocket Reconnection Storm
  console.log(`[WebSocket Storm] Spawning ${options.wsConnections} concurrent clients...`);
  const wsStartTime = Date.now();

  for (let i = 0; i < options.wsConnections; i++) {
    const socket = ClientIo(WS_URL, {
      transports: ['websocket'],
      forceNew: true,
      auth: {
        token: `Bearer stress_test_token_client_${i}`,
      },
    });

    socket.on('connect', () => {
      successfulConnections++;
    });

    socket.on('connect_error', () => {
      connectionFailures++;
    });

    sockets.push(socket);
  }

  // 2. Simulate High-Frequency Queue Webhook Flood
  console.log(`[Queue Flood] Triggering ${options.webhookBursts} mock Stripe webhook events...`);
  const webhookPromises: Promise<any>[] = [];
  const webhookStartTime = Date.now();

  for (let i = 0; i < options.webhookBursts; i++) {
    webhookPromises.push(
      axios
        .post(
          `${BACKEND_URL}/api/v2/webhooks/stripe`,
          {
            id: `stress_evt_${i}_${Date.now()}`,
            type: 'payment_intent.succeeded',
            data: { object: { id: `stress_pi_${i}` } },
          },
          {
            headers: {
              'stripe-signature': 'mock_stress_signature_key',
              'Content-Type': 'application/json',
            },
          },
        )
        .catch((err) => {
          // Swallow connection refused errors in testing environment
          return { status: err.response?.status || 500 };
        }),
    );
  }

  const webhookResults = await Promise.all(webhookPromises);
  const webhookDuration = Date.now() - webhookStartTime;
  const successfulWebhooks = webhookResults.filter((r) => r.status === 200 || r.status === 201).length;

  // Wait for the duration of the stress test run
  await new Promise((resolve) => setTimeout(resolve, options.durationMs));

  // Cleanup connections
  console.log(`[Cleanup] Terminating active WebSocket streams...`);
  sockets.forEach((s) => s.close());

  const wsDuration = Date.now() - wsStartTime;

  console.log(`\n=== Load & Stress Test Results ===`);
  console.log(`[WebSocket Storm Metrics]`);
  console.log(`- Connection attempts: ${options.wsConnections}`);
  console.log(`- Successful handshakes (simulated): ${successfulConnections}`);
  console.log(`- Connection failures (auth-blocked): ${connectionFailures}`);
  console.log(`- Connection flood elapsed duration: ${wsDuration}ms`);
  console.log(`\n[Queue Flood Metrics]`);
  console.log(`- Event bursts dispatched: ${options.webhookBursts}`);
  console.log(`- Total throughput elapsed: ${webhookDuration}ms`);
  console.log(`- Successful webhook queue ingestion: ${successfulWebhooks}/${options.webhookBursts}`);
  console.log(`==================================\n`);

  return {
    successfulConnections,
    connectionFailures,
    successfulWebhooks,
  };
}

if (require.main === module) {
  runStressTest({
    wsConnections: 100, // Safe local sandbox limit
    webhookBursts: 250,
    durationMs: 3000,
  }).catch((err) => console.error('Stress test failed:', err));
}
