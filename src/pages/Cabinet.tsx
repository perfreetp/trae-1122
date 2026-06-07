import { useState } from 'react';
import { Server, Thermometer, Zap, Box, Layers, MapPin } from 'lucide-react';
import { useStore } from '@/store';
import { cn, getDeviceStatusColor } from '@/utils';
import { devices } from '@/mock/data';

export default function Cabinet() {
  const { cabinets, setSelectedCabinet, selectedCabinetId } = useStore();
  const [selectedRoom] = useState('room001');

  const selectedCabinet = cabinets.find(c => c.id === selectedCabinetId);
  const cabinetDevices = selectedCabinet
    ? devices.filter(d => d.cabinetId === selectedCabinet.id)
    : [];

  const rows = Array.from(new Set(cabinets.map(c => c.row))).sort();
  const columns = Array.from(new Set(cabinets.map(c => c.column))).sort();

  const getCabinetStatusColor = (cabinet: any) => {
    if (cabinet.temperature > 28) return 'bg-red-500';
    if (cabinet.temperature > 26) return 'bg-amber-500';
    if (cabinet.powerUsed / cabinet.powerCapacity > 0.8) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">机柜视图</h1>
        <p className="mt-1 text-sm text-gray-500">可视化机柜布局与设备分布</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-gray-900">一号机房布局</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-gray-600">正常</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-gray-600">预警</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-gray-600">告警</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex mb-2">
                <div className="w-12" />
                {columns.map(col => (
                  <div key={col} className="w-16 text-center text-xs text-gray-500 font-medium">
                    {col}列
                  </div>
                ))}
              </div>

              {rows.map(row => (
                <div key={row} className="flex items-center mb-2">
                  <div className="w-12 text-xs text-gray-500 font-medium">{row}排</div>
                  {columns.map(col => {
                    const cabinet = cabinets.find(c => c.row === row && c.column === col);
                    if (!cabinet) return <div key={col} className="w-14 h-16 mx-1" />;
                    return (
                      <button
                        key={cabinet.id}
                        onClick={() => setSelectedCabinet(selectedCabinetId === cabinet.id ? null : cabinet.id)}
                        className={cn(
                          'w-14 h-16 mx-1 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105',
                          selectedCabinetId === cabinet.id
                            ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/20'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        )}
                      >
                        <span className={cn('h-2 w-2 rounded-full', getCabinetStatusColor(cabinet))} />
                        <span className="text-xs font-medium text-gray-700">{cabinet.name}</span>
                        <span className="text-[10px] text-gray-500">{cabinet.deviceCount}台</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{cabinets.length}</div>
              <div className="text-xs text-gray-500 mt-1">机柜总数</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {cabinets.filter(c => getCabinetStatusColor(c) === 'bg-emerald-500').length}
              </div>
              <div className="text-xs text-gray-500 mt-1">正常运行</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {cabinets.filter(c => getCabinetStatusColor(c) === 'bg-amber-500').length}
              </div>
              <div className="text-xs text-gray-500 mt-1">预警状态</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {cabinets.filter(c => getCabinetStatusColor(c) === 'bg-red-500').length}
              </div>
              <div className="text-xs text-gray-500 mt-1">告警状态</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">机柜详情</h3>

          {selectedCabinet ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{selectedCabinet.name}</div>
                  <div className="text-xs text-gray-500">{selectedCabinet.roomName}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Thermometer className="h-3.5 w-3.5" />
                    温度
                  </div>
                  <div className={cn(
                    'text-lg font-bold',
                    selectedCabinet.temperature > 28 ? 'text-red-600' : selectedCabinet.temperature > 26 ? 'text-amber-600' : 'text-emerald-600'
                  )}>
                    {selectedCabinet.temperature}°C
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Zap className="h-3.5 w-3.5" />
                    电力
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {(selectedCabinet.powerUsed / 1000).toFixed(1)}kW
                  </div>
                  <div className="text-xs text-gray-500">
                    / {(selectedCabinet.powerCapacity / 1000).toFixed(0)}kW
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Layers className="h-3.5 w-3.5" />
                    U位使用
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {selectedCabinet.uUsed}/{selectedCabinet.uTotal}
                  </div>
                  <div className="text-xs text-gray-500">
                    使用率 {Math.round(selectedCabinet.uUsed / selectedCabinet.uTotal * 100)}%
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Box className="h-3.5 w-3.5" />
                    设备数量
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {cabinetDevices.length}
                  </div>
                  <div className="text-xs text-gray-500">台设备</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">U位分布</h4>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
                  {Array.from({ length: selectedCabinet.uTotal }, (_, i) => {
                    const uPosition = selectedCabinet.uTotal - i;
                    const device = cabinetDevices.find(
                      d => uPosition >= d.uPosition && uPosition < d.uPosition + d.uHeight
                    );
                    const isTop = device && uPosition === device.uPosition + device.uHeight - 1;
                    return (
                      <div
                        key={uPosition}
                        className={cn(
                          'flex items-center gap-2 h-6 px-2 rounded text-xs',
                          device
                            ? isTop
                              ? 'bg-cyan-100 border-t-2 border-cyan-500'
                              : 'bg-cyan-50'
                            : 'bg-gray-50'
                        )}
                      >
                        <span className="w-8 text-gray-500 font-mono">U{uPosition}</span>
                        {isTop && (
                          <>
                            <span className={cn('h-2 w-2 rounded-full', getDeviceStatusColor(device.status))} />
                            <span className="flex-1 truncate text-gray-700 font-medium">{device.name}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <MapPin className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">点击左侧机柜查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
