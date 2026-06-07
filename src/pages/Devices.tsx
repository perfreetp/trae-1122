import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Printer,
  Package,
  Wrench,
  History,
  Tag,
  X,
} from 'lucide-react';
import { useStore } from '@/store';
import {
  cn,
  getDeviceTypeName,
  getDeviceStatusName,
  getDeviceStatusColor,
  formatDate,
} from '@/utils';

export default function Devices() {
  const { devices, setSelectedDevice, selectedDeviceId } = useStore();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDevices = devices.filter(d => {
    const matchSearch =
      d.name.toLowerCase().includes(searchText.toLowerCase()) ||
      d.assetNo.toLowerCase().includes(searchText.toLowerCase()) ||
      d.sn.toLowerCase().includes(searchText.toLowerCase());
    const matchType = typeFilter === 'all' || d.type === typeFilter;
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  const deviceTypes = [
    { value: 'all', label: '全部类型' },
    { value: 'server', label: '服务器' },
    { value: 'switch', label: '交换机' },
    { value: 'ups', label: 'UPS' },
    { value: 'aircon', label: '精密空调' },
    { value: 'power', label: '配电柜' },
    { value: 'fire', label: '消防设备' },
  ];

  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: 'online', label: '在线' },
    { value: 'offline', label: '离线' },
    { value: 'warning', label: '告警' },
    { value: 'fault', label: '故障' },
    { value: 'maintenance', label: '维护中' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">设备台账</h1>
          <p className="mt-1 text-sm text-gray-500">全生命周期设备资产管理</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Printer className="h-4 w-4" />
            打印标签
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">
            <Plus className="h-4 w-4" />
            新增设备
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索设备名称、资产编号、序列号..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  {deviceTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  {statusOptions.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    设备名称
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    资产编号
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    所在机柜
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    质保到期
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDevices.map(device => (
                  <tr
                    key={device.id}
                    onClick={() => setSelectedDevice(selectedDeviceId === device.id ? null : device.id)}
                    className={cn(
                      'cursor-pointer hover:bg-gray-50 transition-colors',
                      selectedDeviceId === device.id && 'bg-cyan-50'
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', getDeviceStatusColor(device.status))} />
                        <span className="text-sm font-medium text-gray-900">{device.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getDeviceTypeName(device.type)}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{device.assetNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{device.cabinetName}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                        device.status === 'online' ? 'bg-emerald-100 text-emerald-700' :
                        device.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                        device.status === 'fault' ? 'bg-red-100 text-red-700' :
                        device.status === 'maintenance' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      )}>
                        {getDeviceStatusName(device.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(device.warrantyExpire)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">共 {filteredDevices.length} 条记录</span>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">设备详情</h3>
            {selectedDevice && (
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {selectedDevice ? (
            <div className="p-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedDevice.name}</div>
                  <div className="text-xs text-gray-500">{getDeviceTypeName(selectedDevice.type)}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">资产编号</div>
                    <div className="text-sm font-mono text-gray-900">{selectedDevice.assetNo}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">序列号</div>
                    <div className="text-sm font-mono text-gray-900">{selectedDevice.sn}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">品牌型号</div>
                    <div className="text-sm text-gray-900">{selectedDevice.manufacturer} {selectedDevice.model}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">安装日期</div>
                    <div className="text-sm text-gray-900">{formatDate(selectedDevice.installDate)}</div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-2">设备配置</div>
                  <div className="space-y-1">
                    {Object.entries(selectedDevice.params).filter(([_, v]) => v).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {k === 'cpu' ? 'CPU' : k === 'memory' ? '内存' : k === 'capacity' ? '容量' : k === 'cooling' ? '制冷量' : k === 'ports' ? '端口' : k}
                        </span>
                        <span className="font-medium text-gray-900">{String(v)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">额定功率</span>
                      <span className="font-medium text-gray-900">{selectedDevice.power}W</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">安装位置</span>
                      <span className="font-medium text-gray-900">{selectedDevice.cabinetName} U{selectedDevice.uPosition}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Wrench className="h-4 w-4" />
                    维保记录
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <History className="h-4 w-4" />
                    运行历史
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Tag className="h-4 w-4" />
                    打印标签
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Package className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">点击左侧设备查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
