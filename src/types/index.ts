export type DeviceType = 'server' | 'switch' | 'ups' | 'aircon' | 'power' | 'fire';
export type DeviceStatus = 'online' | 'offline' | 'warning' | 'fault' | 'maintenance';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  assetNo: string;
  cabinetId: string;
  cabinetName: string;
  uPosition: number;
  uHeight: number;
  status: DeviceStatus;
  installDate: string;
  warrantyExpire: string;
  manufacturer: string;
  model: string;
  sn: string;
  power: number;
  params: Record<string, any>;
}

export type AlarmLevel = 'critical' | 'major' | 'minor' | 'info';
export type AlarmStatus = 'pending' | 'confirmed' | 'dispatched' | 'processing' | 'resolved' | 'closed';

export interface Alarm {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  level: AlarmLevel;
  content: string;
  occurTime: string;
  status: AlarmStatus;
  handlerId?: string;
  handlerName?: string;
  dispatchTime?: string;
  resolveTime?: string;
  resolveNote?: string;
  history?: {
    time: string;
    action: string;
    operator: string;
    note?: string;
  }[];
}

export interface Cabinet {
  id: string;
  name: string;
  roomId: string;
  roomName: string;
  row: number;
  column: number;
  uTotal: number;
  uUsed: number;
  powerCapacity: number;
  powerUsed: number;
  temperature: number;
  humidity: number;
  deviceCount: number;
}

export type InspectionStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface InspectionTask {
  id: string;
  name: string;
  assigneeId: string;
  assigneeName: string;
  planDate: string;
  status: InspectionStatus;
  pointCount: number;
  completedCount: number;
  points: InspectionPoint[];
}

export interface InspectionPoint {
  id: string;
  name: string;
  deviceId: string;
  deviceName: string;
  location: string;
  checked: boolean;
  checkTime?: string;
  remark?: string;
  abnormal: boolean;
  photos: string[];
}

export type ChangeStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'implementing' | 'completed' | 'rolled_back';
export type ChangeType = 'hardware' | 'software' | 'network' | 'power' | 'aircon' | 'other';

export interface ChangeOrder {
  id: string;
  title: string;
  type: ChangeType;
  applicantId: string;
  applicantName: string;
  approverId?: string;
  approverName?: string;
  status: ChangeStatus;
  planTime: string;
  actualTime?: string;
  impactScope: string;
  description: string;
  rollbackPlan: string;
  approvalOpinion?: string;
  createdAt: string;
}

export interface CapacityData {
  space: {
    total: number;
    used: number;
    rate: number;
  };
  power: {
    total: number;
    used: number;
    rate: number;
  };
  cooling: {
    total: number;
    used: number;
    rate: number;
  };
}

export interface ReportData {
  sla: {
    uptime: number;
    target: number;
    actual: number;
  };
  alarms: {
    total: number;
    resolved: number;
    resolutionRate: number;
    avgResolutionTime: number;
  };
  inspection: {
    total: number;
    completed: number;
    completionRate: number;
    abnormalCount: number;
  };
}

export interface User {
  id: string;
  name: string;
  role: 'engineer' | 'supervisor' | 'manager';
  phone: string;
  email: string;
  avatar?: string;
}

export interface TrendDataPoint {
  time: string;
  value: number;
}

export interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  onlineRate: number;
  activeAlarms: number;
  criticalAlarms: number;
  pue: number;
  avgTemperature: number;
  avgHumidity: number;
  todayInspections: number;
  completedInspections: number;
}
