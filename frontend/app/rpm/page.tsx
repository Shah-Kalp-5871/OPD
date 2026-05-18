'use client';
import { useState, useEffect } from 'react';

const DEVICE_ICONS: Record<string, string> = {
  BP_MONITOR: '🩺', PULSE_OX: '💓', GLUCOMETER: '🩸', ECG: '📈', THERMOMETER: '🌡️', WEARABLE: '⌚',
};

export default function RpmPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [readings, setReadings] = useState<any[]>([]);

  const mockDevices = [
    { id: '1', deviceType: 'BP_MONITOR', patientId: 'P-001', serialNumber: 'BP-2024-001', isActive: true, lastSeenAt: new Date().toISOString() },
    { id: '2', deviceType: 'PULSE_OX', patientId: 'P-002', serialNumber: 'PO-2024-002', isActive: true, lastSeenAt: new Date().toISOString() },
    { id: '3', deviceType: 'GLUCOMETER', patientId: 'P-003', serialNumber: 'GL-2024-003', isActive: true, lastSeenAt: new Date().toISOString() },
    { id: '4', deviceType: 'WEARABLE', patientId: 'P-001', serialNumber: 'WB-2024-004', isActive: false, lastSeenAt: null },
  ];

  const mockAlerts = [
    { id: '1', alertType: 'LOW_SPO2', severity: 'CRITICAL', patientId: 'P-002', message: 'SpO2 dropped to 88%', createdAt: new Date().toISOString() },
    { id: '2', alertType: 'HIGH_GLUCOSE', severity: 'WARNING', patientId: 'P-003', message: 'Glucose: 210 mg/dL', createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
  ];

  const mockReadings = [
    { type: 'BP', value: { systolic: 132, diastolic: 85 }, unit: 'mmHg', isAbnormal: false, recordedAt: new Date().toISOString() },
    { type: 'SPO2', value: 88, unit: '%', isAbnormal: true, recordedAt: new Date().toISOString() },
    { type: 'GLUCOSE', value: 210, unit: 'mg/dL', isAbnormal: true, recordedAt: new Date().toISOString() },
    { type: 'HR', value: 92, unit: 'bpm', isAbnormal: false, recordedAt: new Date().toISOString() },
  ];

  useEffect(() => {
    setDevices(mockDevices);
    setAlerts(mockAlerts);
    setReadings(mockReadings);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-8 py-4">
        <h1 className="text-2xl font-bold text-green-400">Remote Patient Monitoring</h1>
        <p className="text-sm text-gray-400">IoT Health Device Platform — Live Vitals Dashboard</p>
      </header>

      <div className="p-8 space-y-6">
        {/* Alert Banner */}
        {alerts.length > 0 && (
          <div className="bg-red-950/50 border border-red-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-400 text-lg">⚠️</span>
              <h2 className="font-bold text-red-400">Active Alerts ({alerts.length})</h2>
            </div>
            <div className="space-y-2">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between bg-red-900/20 rounded-xl p-3">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full mr-2 font-semibold ${
                      alert.severity === 'CRITICAL' ? 'bg-red-700 text-red-200' : 'bg-yellow-800 text-yellow-200'
                    }`}>{alert.severity}</span>
                    <span className="text-gray-200 text-sm">{alert.message}</span>
                  </div>
                  <span className="text-gray-500 text-xs">Patient {alert.patientId}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Vitals Grid */}
        <div>
          <h2 className="font-semibold text-gray-300 mb-4">Live Vitals</h2>
          <div className="grid grid-cols-4 gap-4">
            {mockReadings.map((r, i) => (
              <div key={i} className={`rounded-2xl p-5 border ${r.isAbnormal ? 'bg-red-950/30 border-red-800' : 'bg-gray-900 border-gray-800'}`}>
                <p className="text-xs text-gray-500 uppercase mb-1">{r.type}</p>
                <p className={`text-3xl font-bold ${r.isAbnormal ? 'text-red-400' : 'text-white'}`}>
                  {typeof r.value === 'object' ? `${(r.value as any).systolic}/${(r.value as any).diastolic}` : r.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{r.unit}</p>
                {r.isAbnormal && <span className="text-xs text-red-400 mt-2 block">⚠ Abnormal</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Device Registry */}
        <div>
          <h2 className="font-semibold text-gray-300 mb-4">Registered Devices</h2>
          <div className="grid grid-cols-2 gap-4">
            {devices.map(device => (
              <div key={device.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl">
                  {DEVICE_ICONS[device.deviceType] || '📱'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-200">{device.deviceType.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">S/N: {device.serialNumber}</p>
                  <p className="text-xs text-gray-500">Patient: {device.patientId}</p>
                </div>
                <span className={`w-2 h-2 rounded-full ${device.isActive ? 'bg-green-400' : 'bg-gray-600'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
