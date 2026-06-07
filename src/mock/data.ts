import type {
  Device,
  Cabinet,
  Alarm,
  InspectionTask,
  ChangeOrder,
  CapacityData,
  ReportData,
  DashboardStats,
  TrendDataPoint,
  User,
} from '@/types';

export const users: User[] = [
  {
    id: 'u001',
    name: '张工',
    role: 'supervisor',
    phone: '138****1234',
    email: 'zhang.gong@datacenter.com',
  },
  {
    id: 'u002',
    name: '李工',
    role: 'engineer',
    phone: '139****5678',
    email: 'li.gong@datacenter.com',
  },
  {
    id: 'u003',
    name: '王工',
    role: 'engineer',
    phone: '137****9012',
    email: 'wang.gong@datacenter.com',
  },
  {
    id: 'u004',
    name: '赵经理',
    role: 'manager',
    phone: '136****3456',
    email: 'zhao.manager@datacenter.com',
  },
];

export const cabinets: Cabinet[] = Array.from({ length: 40 }, (_, i) => ({
  id: `cab${String(i + 1).padStart(3, '0')}`,
  name: `A${String(Math.floor(i / 10) + 1)}-${String((i % 10) + 1).padStart(2, '0')}`,
  roomId: 'room001',
  roomName: '一号机房',
  row: Math.floor(i / 10) + 1,
  column: (i % 10) + 1,
  uTotal: 42,
  uUsed: Math.floor(Math.random() * 25) + 15,
  powerCapacity: 5000,
  powerUsed: Math.floor(Math.random() * 3000) + 1500,
  temperature: Math.floor(Math.random() * 8) + 22,
  humidity: Math.floor(Math.random() * 20) + 40,
  deviceCount: Math.floor(Math.random() * 8) + 3,
}));

const deviceTypes: Device['type'][] = ['server', 'switch', 'ups', 'aircon', 'power', 'fire'];
const deviceStatuses: Device['status'][] = ['online', 'online', 'online', 'online', 'warning', 'offline', 'maintenance'];
const manufacturers = ['华为', '中兴', '戴尔', '惠普', 'IBM', '施耐德', '艾默生', 'APC'];

export const devices: Device[] = Array.from({ length: 120 }, (_, i) => {
  const type = deviceTypes[i % deviceTypes.length];
  const cabinet = cabinets[Math.floor(Math.random() * cabinets.length)];
  return {
    id: `dev${String(i + 1).padStart(5, '0')}`,
    name: `${type === 'server' ? '服务器' : type === 'switch' ? '交换机' : type === 'ups' ? 'UPS' : type === 'aircon' ? '精密空调' : type === 'power' ? '配电柜' : '消防设备'}-${String(i + 1).padStart(3, '0')}`,
    type,
    assetNo: `DC-${String(new Date().getFullYear())}-${String(i + 1).padStart(6, '0')}`,
    cabinetId: cabinet.id,
    cabinetName: cabinet.name,
    uPosition: Math.floor(Math.random() * 30) + 1,
    uHeight: type === 'server' ? 2 : type === 'ups' ? 4 : 1,
    status: deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)],
    installDate: `202${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    warrantyExpire: `202${Math.floor(Math.random() * 3) + 5}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
    model: `${type.toUpperCase()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    sn: `SN${String(Date.now() + i).slice(-10)}`,
    power: Math.floor(Math.random() * 500) + 100,
    params: {
      cpu: type === 'server' ? `${Math.floor(Math.random() * 2) + 1} × Intel Xeon` : undefined,
      memory: type === 'server' ? `${Math.floor(Math.random() * 8) + 1} × 32GB` : undefined,
      capacity: type === 'ups' ? `${Math.floor(Math.random() * 50) + 20}kVA` : undefined,
      cooling: type === 'aircon' ? `${Math.floor(Math.random() * 30) + 10}kW` : undefined,
      ports: type === 'switch' ? `${Math.floor(Math.random() * 24) + 24}口` : undefined,
    },
  };
});

const alarmLevels: Alarm['level'][] = ['critical', 'major', 'minor', 'info'];
const alarmStatuses: Alarm['status'][] = ['pending', 'confirmed', 'dispatched', 'processing', 'resolved', 'closed'];

export const alarms: Alarm[] = Array.from({ length: 50 }, (_, i) => {
  const device = devices[Math.floor(Math.random() * devices.length)];
  const level = alarmLevels[i % alarmLevels.length];
  return {
    id: `alm${String(i + 1).padStart(5, '0')}`,
    deviceId: device.id,
    deviceName: device.name,
    deviceType: device.type,
    level,
    content: level === 'critical' 
      ? `${device.name} 温度过高，超过阈值` 
      : level === 'major'
      ? `${device.name} 负载超过80%`
      : level === 'minor'
      ? `${device.name} 风扇转速异常`
      : `${device.name} 配置变更通知`,
    occurTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: i < 10 ? alarmStatuses[Math.floor(Math.random() * 4)] : 'resolved',
    handlerId: i < 10 ? users[Math.floor(Math.random() * users.length)].id : undefined,
    handlerName: i < 10 ? users[Math.floor(Math.random() * users.length)].name : undefined,
    history: [
      {
        time: new Date(Date.now() - Math.random() * 5 * 60 * 60 * 1000).toISOString(),
        action: '告警产生',
        operator: '系统',
      },
    ],
  };
});

export const inspectionTasks: InspectionTask[] = [
  {
    id: 'task001',
    name: '日常巡检-一号机房',
    assigneeId: 'u002',
    assigneeName: '李工',
    planDate: new Date().toISOString().split('T')[0],
    status: 'in_progress',
    pointCount: 8,
    completedCount: 3,
    points: Array.from({ length: 8 }, (_, i) => ({
      id: `pt${i + 1}`,
      name: `巡检点-${String.fromCharCode(65 + i)}`,
      deviceId: devices[i].id,
      deviceName: devices[i].name,
      location: `A${Math.floor(i / 4) + 1}区`,
      checked: i < 3,
      checkTime: i < 3 ? new Date(Date.now() - (3 - i) * 30 * 60 * 1000).toISOString() : undefined,
      abnormal: i === 1,
      remark: i === 1 ? '发现轻微噪音' : undefined,
      photos: [],
    })),
  },
  {
    id: 'task002',
    name: 'UPS专项检查',
    assigneeId: 'u003',
    assigneeName: '王工',
    planDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    pointCount: 4,
    completedCount: 0,
    points: Array.from({ length: 4 }, (_, i) => ({
      id: `pt${i + 10}`,
      name: `UPS-${i + 1}`,
      deviceId: devices.filter(d => d.type === 'ups')[i]?.id || 'dev00001',
      deviceName: devices.filter(d => d.type === 'ups')[i]?.name || 'UPS-001',
      location: '配电室',
      checked: false,
      abnormal: false,
      photos: [],
    })),
  },
  {
    id: 'task003',
    name: '周度巡检-空调系统',
    assigneeId: 'u002',
    assigneeName: '李工',
    planDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'overdue',
    pointCount: 6,
    completedCount: 2,
    points: Array.from({ length: 6 }, () => ({
      id: `pt${Math.random()}`,
      name: `空调检查点`,
      deviceId: 'dev00001',
      deviceName: '精密空调-001',
      location: '机房',
      checked: false,
      abnormal: false,
      photos: [],
    })),
  },
  {
    id: 'task004',
    name: '消防设备月度检查',
    assigneeId: 'u003',
    assigneeName: '王工',
    planDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'completed',
    pointCount: 10,
    completedCount: 10,
    points: Array.from({ length: 10 }, () => ({
      id: `pt${Math.random()}`,
      name: `消防检查点`,
      deviceId: 'dev00001',
      deviceName: '消防设备-001',
      location: '机房',
      checked: true,
      abnormal: false,
      photos: [],
    })),
  },
];

const changeTypes: ChangeOrder['type'][] = ['hardware', 'software', 'network', 'power', 'aircon', 'other'];
const changeStatuses: ChangeOrder['status'][] = ['pending_approval', 'approved', 'implementing', 'completed', 'rejected'];

export const changeOrders: ChangeOrder[] = Array.from({ length: 20 }, (_, i) => {
  const type = changeTypes[i % changeTypes.length];
  const status = changeStatuses[i % changeStatuses.length];
  return {
    id: `chg${String(i + 1).padStart(5, '0')}`,
    title: `${type === 'hardware' ? '硬件' : type === 'software' ? '软件' : type === 'network' ? '网络' : type === 'power' ? '电力' : type === 'aircon' ? '空调' : '其他'}变更-${String(i + 1).padStart(3, '0')}`,
    type,
    applicantId: users[Math.floor(Math.random() * users.length)].id,
    applicantName: users[Math.floor(Math.random() * users.length)].name,
    approverId: status !== 'draft' && status !== 'pending_approval' ? 'u001' : undefined,
    approverName: status !== 'draft' && status !== 'pending_approval' ? '张工' : undefined,
    status,
    planTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    actualTime: status === 'completed' ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() : undefined,
    impactScope: `影响 ${Math.floor(Math.random() * 5) + 1} 个机柜，${Math.floor(Math.random() * 10) + 5} 台设备`,
    description: '对相关设备进行升级维护，优化系统性能。预计耗时2小时。',
    rollbackPlan: '如遇问题，立即恢复至变更前状态，切换至备用设备。',
    approvalOpinion: status === 'rejected' ? '时机不合适，建议延后至周末窗口' : status !== 'draft' && status !== 'pending_approval' ? '同意，请按计划执行' : undefined,
    createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

export const capacityData: CapacityData = {
  space: {
    total: 40 * 42,
    used: Math.floor(40 * 42 * 0.68),
    rate: 68,
  },
  power: {
    total: 40 * 5,
    used: Math.floor(40 * 5 * 0.62),
    rate: 62,
  },
  cooling: {
    total: 200,
    used: Math.floor(200 * 0.58),
    rate: 58,
  },
};

export const reportData: ReportData = {
  sla: {
    uptime: 99.98,
    target: 99.95,
    actual: 99.98,
  },
  alarms: {
    total: 156,
    resolved: 148,
    resolutionRate: 94.9,
    avgResolutionTime: 45,
  },
  inspection: {
    total: 120,
    completed: 115,
    completionRate: 95.8,
    abnormalCount: 8,
  },
};

export const dashboardStats: DashboardStats = {
  totalDevices: devices.length,
  onlineDevices: devices.filter(d => d.status === 'online').length,
  onlineRate: Math.round(devices.filter(d => d.status === 'online').length / devices.length * 100),
  activeAlarms: alarms.filter(a => a.status !== 'resolved' && a.status !== 'closed').length,
  criticalAlarms: alarms.filter(a => a.level === 'critical' && a.status !== 'resolved' && a.status !== 'closed').length,
  pue: 1.42,
  avgTemperature: 24.5,
  avgHumidity: 48,
  todayInspections: inspectionTasks.filter(t => t.planDate === new Date().toISOString().split('T')[0]).length,
  completedInspections: inspectionTasks.filter(t => t.planDate === new Date().toISOString().split('T')[0] && t.status === 'completed').length,
};

export const temperatureTrend: TrendDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  value: 22 + Math.sin(i / 24 * Math.PI * 2) * 3 + Math.random() * 1,
}));

export const humidityTrend: TrendDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  value: 45 + Math.sin(i / 24 * Math.PI * 2 + 1) * 8 + Math.random() * 3,
}));

export const powerTrend: TrendDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  value: 80 + Math.sin(i / 24 * Math.PI * 2 - 0.5) * 20 + Math.random() * 5,
}));

export const alarmTrend: TrendDataPoint[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
  return {
    time: `${date.getMonth() + 1}/${date.getDate()}`,
    value: Math.floor(Math.random() * 15) + 5,
  };
});
