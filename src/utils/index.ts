import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'yyyy-MM-dd', { locale: zhCN });
}

export function formatTime(date: string | Date) {
  return format(new Date(date), 'HH:mm:ss', { locale: zhCN });
}

export function getDeviceTypeName(type: string) {
  const names: Record<string, string> = {
    server: '服务器',
    switch: '交换机',
    ups: 'UPS',
    aircon: '精密空调',
    power: '配电柜',
    fire: '消防设备',
  };
  return names[type] || type;
}

export function getDeviceStatusName(status: string) {
  const names: Record<string, string> = {
    online: '在线',
    offline: '离线',
    warning: '告警',
    fault: '故障',
    maintenance: '维护中',
  };
  return names[status] || status;
}

export function getDeviceStatusColor(status: string) {
  const colors: Record<string, string> = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-500',
    warning: 'bg-amber-500',
    fault: 'bg-red-500',
    maintenance: 'bg-blue-500',
  };
  return colors[status] || 'bg-gray-500';
}

export function getAlarmLevelName(level: string) {
  const names: Record<string, string> = {
    critical: '紧急',
    major: '重要',
    minor: '一般',
    info: '提示',
  };
  return names[level] || level;
}

export function getAlarmLevelColor(level: string) {
  const colors: Record<string, string> = {
    critical: 'bg-red-500 text-white',
    major: 'bg-orange-500 text-white',
    minor: 'bg-amber-500 text-white',
    info: 'bg-sky-500 text-white',
  };
  return colors[level] || 'bg-gray-500 text-white';
}

export function getAlarmStatusName(status: string) {
  const names: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    dispatched: '已分派',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭',
  };
  return names[status] || status;
}

export function getInspectionStatusName(status: string) {
  const names: Record<string, string> = {
    pending: '待执行',
    in_progress: '进行中',
    completed: '已完成',
    overdue: '已逾期',
  };
  return names[status] || status;
}

export function getInspectionStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-sky-100 text-sky-700',
    completed: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getChangeStatusName(status: string) {
  const names: Record<string, string> = {
    draft: '草稿',
    pending_approval: '待审批',
    approved: '已批准',
    rejected: '已驳回',
    implementing: '执行中',
    completed: '已完成',
    rolled_back: '已回滚',
  };
  return names[status] || status;
}

export function getChangeStatusColor(status: string) {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending_approval: 'bg-amber-100 text-amber-700',
    approved: 'bg-sky-100 text-sky-700',
    rejected: 'bg-red-100 text-red-700',
    implementing: 'bg-indigo-100 text-indigo-700',
    completed: 'bg-emerald-100 text-emerald-700',
    rolled_back: 'bg-orange-100 text-orange-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getChangeTypeName(type: string) {
  const names: Record<string, string> = {
    hardware: '硬件变更',
    software: '软件变更',
    network: '网络变更',
    power: '电力变更',
    aircon: '空调变更',
    other: '其他变更',
  };
  return names[type] || type;
}

export function getRoleName(role: string) {
  const names: Record<string, string> = {
    engineer: '运维工程师',
    supervisor: '运维主管',
    manager: '数据中心经理',
  };
  return names[role] || role;
}
