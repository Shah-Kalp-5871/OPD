import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { LiveAnalyticsService } from '../live-analytics/live-analytics.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'live-analytics',
})
export class RealtimeMetricsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeMetricsGateway.name);
  private activeClients = new Set<any>();

  @WebSocketServer()
  server: any;

  constructor(
    private readonly liveAnalytics: LiveAnalyticsService,
    private readonly tenantContext: TenantContextService,
  ) {
    // Periodically broadcast live metrics to connected clients
    setInterval(async () => {
      await this.broadcastLiveMetrics();
    }, 5000);
  }

  handleConnection(client: any) {
    this.activeClients.add(client);
    this.logger.log(`Client connected: ${client.id || 'unknown'}`);
  }

  handleDisconnect(client: any) {
    this.activeClients.delete(client);
    this.logger.log(`Client disconnected: ${client.id || 'unknown'}`);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(client: any, payload: { tenantId: string; branchId?: string }) {
    if (!payload || !payload.tenantId) {
      return { status: 'error', message: 'Missing tenantId' };
    }
    
    // Dynamically join client to tenant room
    const roomName = `tenant:${payload.tenantId}:${payload.branchId || 'all'}`;
    if (client.join) {
      client.join(roomName);
    }
    
    this.logger.log(`Client ${client.id} joined room: ${roomName}`);
    
    // Send initial snapshot immediately
    this.tenantContext.setTenant(payload.tenantId, 'default');
    const kpis = await this.liveAnalytics.getLiveKpis(payload.branchId);
    return { status: 'success', data: kpis };
  }

  private async broadcastLiveMetrics() {
    if (this.activeClients.size === 0) return;

    // Broadcast to all rooms
    try {
      if (this.server && this.server.emit) {
        // We broadcast global default updates defensively, or room-specific if socket.io is fully initialized
        const kpis = await this.liveAnalytics.getLiveKpis();
        this.server.emit('live_kpi_update', kpis);
      }
    } catch (err) {
      this.logger.error(`Failed to broadcast live metrics: ${err.message}`);
    }
  }
}
