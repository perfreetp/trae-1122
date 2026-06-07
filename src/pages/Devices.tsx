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
  Download,
  Clock,
  User,
  FileText,
} from 'lucide-react';
import { useStore } from '@/store';
import {
  cn,
  getDeviceTypeName,
  getDeviceStatusName,
  getDeviceStatusColor,
  formatDate,
  formatDateTime,
} from '@/utils';
import type { Device } from '@/types';

const maintenanceRecords = [
  { id: '1', date: '2024-01-15', type: '例行保养', operator: '张工', content: '清洁滤网，检查风扇', result: '正常' },
  { id: '2', date: '2024-02-20', type: '故障维修', operator: '李工', content: '更换电源模块', result: '已修复' },
  { id: '3', date: '2024-03-10', type: '固件升级', operator: '王工', content: '升级BIOS到最新版本', result: '成功' },
];

const operationHistory = [
  { id: '1', time: '2024-03-15 08:00', event: '设备启动', operator: '系统', detail: '正常启动' },
  { id: '2', time: '2024-03-15 10:30', event: '配置变更', operator: '张工', detail: '修改网络配置' },
  { id: '3', time: '2024-03-15 14:20', event: '告警触发', operator: '系统', detail: '温度超过阈值' },
  { id: '4', time: '2024-03-15 14:25', event: '告警恢复', operator: '系统', detail: '温度恢复正常' },
];

export default function Devices() {
  const { devices, setSelectedDevice, selectedDeviceId, addDevice, currentUser } = useStore();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    name: '',
    type: 'server',
    assetNo: '',
    cabinetId: 'cab001',
    cabinetName: 'A01',
    uPosition: 1,
    uHeight: 2,
    status: 'online',
    installDate: new Date().toISOString().split('T')[0],
    warrantyExpire: '',
    manufacturer: '',
    model: '',
    sn: '',
    power: 300,
    params: {},
  });

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

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.assetNo) return;
    addDevice(newDevice as Omit<Device, 'id'>);
    setShowAddModal(false);
    setNewDevice({
      name: '',
      type: 'server',
      assetNo: '',
      cabinetId: 'cab001',
      cabinetName: 'A01',
      uPosition: 1,
      uHeight: 2,
      status: 'online',
      installDate: new Date().toISOString().split('T')[0],
      warrantyExpire: '',
      manufacturer: '',
      model: '',
      sn: '',
      power: 300,
      params: {},
    });
  };

  const handlePrintLabel = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">设备台账</h1>
          <p className="mt-1 text-sm text-gray-500">全生命周期设备资产管理</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => selectedDevice && setShowLabelModal(true)}
            disabled={!selectedDevice}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg transition-colors',
              selectedDevice
                ? 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
                : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
            )}
          >
            <Printer className="h-4 w-4" />
            打印标签
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
          >
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
                  <button
                    onClick={() => setShowMaintenanceModal(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Wrench className="h-4 w-4" />
                    维保记录
                  </button>
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <History className="h-4 w-4" />
                    运行历史
                  </button>
                  <button
                    onClick={() => setShowLabelModal(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
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

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">新增设备</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">设备名称</label>
                  <input
                    type="text"
                    value={newDevice.name}
                    onChange={e => setNewDevice({ ...newDevice, name: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="请输入设备名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">资产编号</label>
                  <input
                    type="text"
                    value={newDevice.assetNo}
                    onChange={e => setNewDevice({ ...newDevice, assetNo: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="自动生成或手动输入"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">设备类型</label>
                  <select
                    value={newDevice.type}
                    onChange={e => setNewDevice({ ...newDevice, type: e.target.value as Device['type'] })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    {deviceTypes.filter(t => t.value !== 'all').map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所在机柜</label>
                  <select
                    value={newDevice.cabinetId}
                    onChange={e => {
                      const cabinet = useStore.getState().cabinets.find(c => c.id === e.target.value);
                      setNewDevice({
                        ...newDevice,
                        cabinetId: e.target.value,
                        cabinetName: cabinet?.name || 'A01'
                      });
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    {useStore.getState().cabinets.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">品牌</label>
                  <input
                    type="text"
                    value={newDevice.manufacturer}
                    onChange={e => setNewDevice({ ...newDevice, manufacturer: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="品牌名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">型号</label>
                  <input
                    type="text"
                    value={newDevice.model}
                    onChange={e => setNewDevice({ ...newDevice, model: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="设备型号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">序列号</label>
                  <input
                    type="text"
                    value={newDevice.sn}
                    onChange={e => setNewDevice({ ...newDevice, sn: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="设备序列号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">额定功率(W)</label>
                  <input
                    type="number"
                    value={newDevice.power}
                    onChange={e => setNewDevice({ ...newDevice, power: Number(e.target.value) })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">U位位置</label>
                  <input
                    type="number"
                    value={newDevice.uPosition}
                    onChange={e => setNewDevice({ ...newDevice, uPosition: Number(e.target.value) })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">U位高度</label>
                  <input
                    type="number"
                    value={newDevice.uHeight}
                    onChange={e => setNewDevice({ ...newDevice, uHeight: Number(e.target.value) })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">安装日期</label>
                  <input
                    type="date"
                    value={newDevice.installDate}
                    onChange={e => setNewDevice({ ...newDevice, installDate: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">质保到期</label>
                  <input
                    type="date"
                    value={newDevice.warrantyExpire}
                    onChange={e => setNewDevice({ ...newDevice, warrantyExpire: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddDevice}
                className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      {showLabelModal && selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">资产标签预览</h3>
              <button onClick={() => setShowLabelModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white print:border-none">
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-gray-900">数据中心资产标签</div>
                  <div className="text-xs text-gray-500">DCIM Asset Tag</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">资产编号</span>
                    <span className="text-sm font-mono font-semibold text-gray-900">{selectedDevice.assetNo}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">设备名称</span>
                    <span className="text-sm font-medium text-gray-900">{selectedDevice.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">设备类型</span>
                    <span className="text-sm text-gray-900">{getDeviceTypeName(selectedDevice.type)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">机柜位置</span>
                    <span className="text-sm font-medium text-gray-900">{selectedDevice.cabinetName} U{selectedDevice.uPosition}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">品牌型号</span>
                    <span className="text-sm text-gray-900">{selectedDevice.manufacturer} {selectedDevice.model}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500">安装日期</span>
                    <span className="text-sm text-gray-900">{formatDate(selectedDevice.installDate)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <div className="text-xs text-gray-400">█ ██ ███ ████ █ ██ ███</div>
                  <div className="text-xs text-gray-400 mt-1">条形码</div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowLabelModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={handlePrintLabel}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                打印标签
              </button>
            </div>
          </div>
        </div>
      )}

      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">维保记录</h3>
              <button onClick={() => setShowMaintenanceModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {selectedDevice ? (
                <div className="space-y-4">
                  <div className="bg-cyan-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-cyan-900">{selectedDevice.name}</div>
                    <div className="text-xs text-cyan-600">{selectedDevice.assetNo}</div>
                  </div>
                  <div className="space-y-3">
                    {maintenanceRecords.map(record => (
                      <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{record.type}</span>
                          </div>
                          <span className="text-xs text-gray-500">{record.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{record.content}</p>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-gray-500">
                            <User className="h-3 w-3" />
                            {record.operator}
                          </div>
                          <span className={cn(
                            'px-2 py-0.5 rounded-full',
                            record.result === '正常' || record.result === '已修复' || record.result === '成功'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          )}>
                            {record.result}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  请先选择设备
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end flex-shrink-0">
              <button
                onClick={() => setShowMaintenanceModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">运行历史</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {selectedDevice ? (
                <div className="space-y-4">
                  <div className="bg-cyan-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-cyan-900">{selectedDevice.name}</div>
                    <div className="text-xs text-cyan-600">{selectedDevice.assetNo}</div>
                  </div>
                  <div className="relative pl-4">
                    <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-gray-200" />
                    {operationHistory.map((record, index) => (
                      <div key={record.id} className="relative pb-4 last:pb-0">
                        <div className="absolute -left-4 top-1 h-3 w-3 rounded-full bg-cyan-500 border-2 border-white" />
                        <div className="ml-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{record.event}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {record.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{record.detail}</p>
                          <p className="text-xs text-gray-400 mt-1">操作人: {record.operator}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  请先选择设备
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end flex-shrink-0">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
