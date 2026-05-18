import { Injectable } from '@nestjs/common';

@Injectable()
export class TelemetryService {
  // Counters and Gauges as thread-safe in-memory variables (for individual pod scraping)
  private failedAuthTotal = new Map<string, number>();
  private websocketActiveConnections = 0;
  private telemedicineAuthFailuresTotal = 0;
  private webhookJobsTotal = new Map<string, number>();
  private webhookFailuresTotal = new Map<string, number>();
  private webhookProcessingDurations: number[] = [];
  private turnCredentialRequestsTotal = 0;
  private turnFailuresTotal = 0;
  private socketDisconnectTotal = 0;
  private iceReconnectTotal = 0;
  private webrtcSignalsTotal = 0;
  private publicApiRequestsTotal = new Map<string, number>();
  private publicApiRateLimitedTotal = 0;

  // Interop Platform Metrics
  private fhirRequestsTotal = 0;
  private fhirValidationFailuresTotal = 0;
  private hl7MessagesParsedTotal = 0;
  private hl7DeadLetterQueueTotal = 0;
  private bulkExportDurations: number[] = [];

  incrementFhirRequests() {
    this.fhirRequestsTotal++;
  }

  incrementFhirValidationFailures() {
    this.fhirValidationFailuresTotal++;
  }

  incrementHl7MessagesParsed() {
    this.hl7MessagesParsedTotal++;
  }

  incrementHl7DeadLetterQueue() {
    this.hl7DeadLetterQueueTotal++;
  }

  recordBulkExportDuration(durationMs: number) {
    this.bulkExportDurations.push(durationMs);
    if (this.bulkExportDurations.length > 50) {
      this.bulkExportDurations.shift();
    }
  }

  incrementPublicApiRequests(endpoint: string) {
    const key = endpoint || 'unknown';
    this.publicApiRequestsTotal.set(key, (this.publicApiRequestsTotal.get(key) || 0) + 1);
  }

  incrementPublicApiRateLimited() {
    this.publicApiRateLimitedTotal++;
  }

  incrementFailedAuth(role: string) {
    const key = role || 'unknown';
    this.failedAuthTotal.set(key, (this.failedAuthTotal.get(key) || 0) + 1);
  }

  setWebsocketActiveConnections(count: number) {
    this.websocketActiveConnections = count >= 0 ? count : 0;
  }

  incrementWebsocketActiveConnections() {
    this.websocketActiveConnections++;
  }

  decrementWebsocketActiveConnections() {
    if (this.websocketActiveConnections > 0) {
      this.websocketActiveConnections--;
    }
  }

  incrementActiveSockets() {
    this.incrementWebsocketActiveConnections();
  }

  decrementActiveSockets() {
    this.decrementWebsocketActiveConnections();
  }

  incrementTelemedicineAuthFailures() {
    this.telemedicineAuthFailuresTotal++;
  }

  incrementWebRtcSignals() {
    this.webrtcSignalsTotal++;
  }


  incrementWebhookJobs(provider: string, type: string) {
    const key = `${provider}_${type}`;
    this.webhookJobsTotal.set(key, (this.webhookJobsTotal.get(key) || 0) + 1);
  }

  incrementWebhookFailures(provider: string) {
    const key = provider || 'unknown';
    this.webhookFailuresTotal.set(key, (this.webhookFailuresTotal.get(key) || 0) + 1);
  }

  recordWebhookDuration(provider: string, durationMs: number) {
    this.webhookProcessingDurations.push(durationMs);
    // Keep a sliding window of the last 1000 durations to prevent memory exhaustion
    if (this.webhookProcessingDurations.length > 1000) {
      this.webhookProcessingDurations.shift();
    }
  }

  incrementTurnRequests() {
    this.turnCredentialRequestsTotal++;
  }

  incrementTurnFailures() {
    this.turnFailuresTotal++;
  }

  incrementSocketDisconnect() {
    this.socketDisconnectTotal++;
  }

  incrementIceReconnect() {
    this.iceReconnectTotal++;
  }

  getMetricsText(): string {
    const avgDuration = this.webhookProcessingDurations.length > 0
      ? this.webhookProcessingDurations.reduce((a, b) => a + b, 0) / this.webhookProcessingDurations.length
      : 0;

    const lines: string[] = [];

    // Webwsocket Active Connections
    lines.push('# HELP medflow_websocket_active_connections Current active WebSocket connections.');
    lines.push('# TYPE medflow_websocket_active_connections gauge');
    lines.push(`medflow_websocket_active_connections ${this.websocketActiveConnections}`);
    lines.push('');

    // Failed Auth
    lines.push('# HELP medflow_failed_auth_total Total failed authentication attempts by role.');
    lines.push('# TYPE medflow_failed_auth_total counter');
    if (this.failedAuthTotal.size === 0) {
      lines.push('medflow_failed_auth_total{role="all"} 0');
    } else {
      for (const [role, count] of this.failedAuthTotal.entries()) {
        lines.push(`medflow_failed_auth_total{role="${role}"} ${count}`);
      }
    }
    lines.push('');

    // Telemedicine Auth Failures
    lines.push('# HELP medflow_telemedicine_auth_failures_total Cumulative failed room joining authorization attempts.');
    lines.push('# TYPE medflow_telemedicine_auth_failures_total counter');
    lines.push(`medflow_telemedicine_auth_failures_total ${this.telemedicineAuthFailuresTotal}`);
    lines.push('');

    // Webhook Jobs Total
    lines.push('# HELP medflow_webhook_jobs_total Cumulative webhook jobs received and queued.');
    lines.push('# TYPE medflow_webhook_jobs_total counter');
    if (this.webhookJobsTotal.size === 0) {
      lines.push('medflow_webhook_jobs_total{provider="all",type="all"} 0');
    } else {
      for (const [key, count] of this.webhookJobsTotal.entries()) {
        const [provider, type] = key.split('_');
        lines.push(`medflow_webhook_jobs_total{provider="${provider}",type="${type}"} ${count}`);
      }
    }
    lines.push('');

    // Webhook Failures Total
    lines.push('# HELP medflow_webhook_failures_total Cumulative failed webhook executions.');
    lines.push('# TYPE medflow_webhook_failures_total counter');
    if (this.webhookFailuresTotal.size === 0) {
      lines.push('medflow_webhook_failures_total{provider="all"} 0');
    } else {
      for (const [provider, count] of this.webhookFailuresTotal.entries()) {
        lines.push(`medflow_webhook_failures_total{provider="${provider}"} ${count}`);
      }
    }
    lines.push('');

    // Webhook Processing Duration
    lines.push('# HELP medflow_webhook_processing_duration_seconds Average processing duration of webhook in seconds.');
    lines.push('# TYPE medflow_webhook_processing_duration_seconds gauge');
    lines.push(`medflow_webhook_processing_duration_seconds ${avgDuration / 1000}`);
    lines.push('');

    // TURN Credential Requests
    lines.push('# HELP medflow_turn_credential_requests_total Cumulative TURN REST API credential requests.');
    lines.push('# TYPE medflow_turn_credential_requests_total counter');
    lines.push(`medflow_turn_credential_requests_total ${this.turnCredentialRequestsTotal}`);
    lines.push('');

    // TURN Failures
    lines.push('# HELP medflow_turn_failures_total Cumulative TURN credential failures.');
    lines.push('# TYPE medflow_turn_failures_total counter');
    lines.push(`medflow_turn_failures_total ${this.turnFailuresTotal}`);
    lines.push('');

    // Socket Disconnect Total
    lines.push('# HELP medflow_socket_disconnect_total Cumulative socket disconnections.');
    lines.push('# TYPE medflow_socket_disconnect_total counter');
    lines.push(`medflow_socket_disconnect_total ${this.socketDisconnectTotal}`);
    lines.push('');

    // ICE Reconnect Total
    lines.push('# HELP medflow_ice_reconnect_total Cumulative ICE connection restructures.');
    lines.push('# TYPE medflow_ice_reconnect_total counter');
    lines.push(`medflow_ice_reconnect_total ${this.iceReconnectTotal}`);
    lines.push('');

    // WebRTC Signals Total
    lines.push('# HELP medflow_webrtc_signals_total Cumulative WebRTC signaling messages dispatched.');
    lines.push('# TYPE medflow_webrtc_signals_total counter');
    lines.push(`medflow_webrtc_signals_total ${this.webrtcSignalsTotal}`);
    lines.push('');

    // Public API Requests
    lines.push('# HELP medflow_public_api_requests_total Cumulative public API requests by endpoint.');
    lines.push('# TYPE medflow_public_api_requests_total counter');
    if (this.publicApiRequestsTotal.size === 0) {
      lines.push('medflow_public_api_requests_total{endpoint="all"} 0');
    } else {
      for (const [endpoint, count] of this.publicApiRequestsTotal.entries()) {
        lines.push(`medflow_public_api_requests_total{endpoint="${endpoint}"} ${count}`);
      }
    }
    lines.push('');

    // Public API Rate Limited
    lines.push('# HELP medflow_public_api_rate_limited_total Cumulative total of rate limited public API requests.');
    lines.push('# TYPE medflow_public_api_rate_limited_total counter');
    lines.push(`medflow_public_api_rate_limited_total ${this.publicApiRateLimitedTotal}`);
    lines.push('');

    // FHIR Requests Total
    lines.push('# HELP fhir_requests_total Cumulative total of SMART-on-FHIR incoming queries.');
    lines.push('# TYPE fhir_requests_total counter');
    lines.push(`fhir_requests_total ${this.fhirRequestsTotal}`);
    lines.push('');

    // FHIR Validation Failures Total
    lines.push('# HELP fhir_validation_failures_total Cumulative total of FHIR validation payload schema errors.');
    lines.push('# TYPE fhir_validation_failures_total counter');
    lines.push(`fhir_validation_failures_total ${this.fhirValidationFailuresTotal}`);
    lines.push('');

    // HL7 Messages Parsed Total
    lines.push('# HELP hl7_messages_parsed_total Cumulative total of HL7 v2 parsed messages.');
    lines.push('# TYPE hl7_messages_parsed_total counter');
    lines.push(`hl7_messages_parsed_total ${this.hl7MessagesParsedTotal}`);
    lines.push('');

    // HL7 Dead Letter Queue Total
    lines.push('# HELP hl7_dead_letter_queue_total Cumulative total of HL7 v2 packets relocated to the dead-letter-queue.');
    lines.push('# TYPE hl7_dead_letter_queue_total counter');
    lines.push(`hl7_dead_letter_queue_total ${this.hl7DeadLetterQueueTotal}`);
    lines.push('');

    // Bulk Export Duration
    const avgBulkExportSec = this.bulkExportDurations.length > 0
      ? (this.bulkExportDurations.reduce((a, b) => a + b, 0) / this.bulkExportDurations.length) / 1000
      : 0;
    lines.push('# HELP bulk_export_duration_seconds Average processing duration of FHIR bulk exports in seconds.');
    lines.push('# TYPE bulk_export_duration_seconds gauge');
    lines.push(`bulk_export_duration_seconds ${avgBulkExportSec}`);
    lines.push('');

    return lines.join('\n');
  }

  getTelemetryJson() {
    const avgDuration = this.webhookProcessingDurations.length > 0
      ? this.webhookProcessingDurations.reduce((a, b) => a + b, 0) / this.webhookProcessingDurations.length
      : 0;

    const avgBulkExportSec = this.bulkExportDurations.length > 0
      ? (this.bulkExportDurations.reduce((a, b) => a + b, 0) / this.bulkExportDurations.length) / 1000
      : 0;

    const hl7SuccessRate = this.hl7MessagesParsedTotal > 0
      ? ((this.hl7MessagesParsedTotal - this.hl7DeadLetterQueueTotal) / this.hl7MessagesParsedTotal) * 100
      : 100;

    return {
      fhirRequestsTotal: this.fhirRequestsTotal,
      fhirValidationFailuresTotal: this.fhirValidationFailuresTotal,
      hl7MessagesParsedTotal: this.hl7MessagesParsedTotal,
      hl7DeadLetterQueueTotal: this.hl7DeadLetterQueueTotal,
      hl7SuccessRate: Math.max(0, Math.min(100, hl7SuccessRate)),
      avgBulkExportDurationSeconds: avgBulkExportSec,
      websocketActiveConnections: this.websocketActiveConnections,
      telemedicineAuthFailuresTotal: this.telemedicineAuthFailuresTotal,
      publicApiRequestsTotal: Array.from(this.publicApiRequestsTotal.entries()).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
      publicApiRateLimitedTotal: this.publicApiRateLimitedTotal,
    };
  }
}

