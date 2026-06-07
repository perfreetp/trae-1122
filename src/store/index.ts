import { create } from 'zustand';
import type {
  Device,
  Cabinet,
  Alarm,
  InspectionTask,
  ChangeOrder,
  User,
} from '@/types';
import {
  devices as mockDevices,
  cabinets as mockCabinets,
  alarms as mockAlarms,
  inspectionTasks as mockInspectionTasks,
  changeOrders as mockChangeOrders,
  users as mockUsers,
} from '@/mock/data';

interface AppState {
  devices: Device[];
  cabinets: Cabinet[];
  alarms: Alarm[];
  inspectionTasks: InspectionTask[];
  changeOrders: ChangeOrder[];
  users: User[];
  selectedCabinetId: string | null;
  selectedDeviceId: string | null;
  sidebarCollapsed: boolean;
  currentUser: User;
  
  setSelectedCabinet: (id: string | null) => void;
  setSelectedDevice: (id: string | null) => void;
  toggleSidebar: () => void;
  updateAlarmStatus: (alarmId: string, status: Alarm['status'], handlerName?: string) => void;
  dispatchAlarm: (alarmId: string, handlerName: string) => void;
  resolveAlarm: (alarmId: string, note: string) => void;
  completeInspectionPoint: (taskId: string, pointId: string, remark?: string, abnormal?: boolean) => void;
  addChangeOrder: (order: Omit<ChangeOrder, 'id' | 'createdAt'>) => void;
  approveChangeOrder: (orderId: string, opinion: string, approve: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  devices: mockDevices,
  cabinets: mockCabinets,
  alarms: mockAlarms,
  inspectionTasks: mockInspectionTasks,
  changeOrders: mockChangeOrders,
  users: mockUsers,
  selectedCabinetId: null,
  selectedDeviceId: null,
  sidebarCollapsed: false,
  currentUser: mockUsers[0],
  
  setSelectedCabinet: (id) => set({ selectedCabinetId: id }),
  setSelectedDevice: (id) => set({ selectedDeviceId: id }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  updateAlarmStatus: (alarmId, status, handlerName) =>
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === alarmId
          ? {
              ...a,
              status,
              handlerName: handlerName || a.handlerName,
              history: [
                ...(a.history || []),
                {
                  time: new Date().toISOString(),
                  action: `状态变更为: ${status}`,
                  operator: state.currentUser.name,
                },
              ],
            }
          : a
      ),
    })),
    
  dispatchAlarm: (alarmId, handlerName) =>
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === alarmId
          ? {
              ...a,
              status: 'dispatched',
              handlerName,
              dispatchTime: new Date().toISOString(),
              history: [
                ...(a.history || []),
                {
                  time: new Date().toISOString(),
                  action: `分派给: ${handlerName}`,
                  operator: state.currentUser.name,
                },
              ],
            }
          : a
      ),
    })),
    
  resolveAlarm: (alarmId, note) =>
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === alarmId
          ? {
              ...a,
              status: 'resolved',
              resolveNote: note,
              resolveTime: new Date().toISOString(),
              history: [
                ...(a.history || []),
                {
                  time: new Date().toISOString(),
                  action: '告警解决',
                  operator: state.currentUser.name,
                  note,
                },
              ],
            }
          : a
      ),
    })),
    
  completeInspectionPoint: (taskId, pointId, remark, abnormal) =>
    set((state) => ({
      inspectionTasks: state.inspectionTasks.map((task) => {
        if (task.id !== taskId) return task;
        const updatedPoints = task.points.map((p) =>
          p.id === pointId
            ? {
                ...p,
                checked: true,
                checkTime: new Date().toISOString(),
                remark: remark || p.remark,
                abnormal: abnormal ?? p.abnormal,
              }
            : p
        );
        const completedCount = updatedPoints.filter((p) => p.checked).length;
        return {
          ...task,
          points: updatedPoints,
          completedCount,
          status: completedCount === task.pointCount ? 'completed' : 'in_progress',
        };
      }),
    })),
    
  addChangeOrder: (order) =>
    set((state) => ({
      changeOrders: [
        {
          ...order,
          id: `chg${String(state.changeOrders.length + 1).padStart(5, '0')}`,
          createdAt: new Date().toISOString(),
        },
        ...state.changeOrders,
      ],
    })),
    
  approveChangeOrder: (orderId, opinion, approve) =>
    set((state) => ({
      changeOrders: state.changeOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: approve ? 'approved' : 'rejected',
              approverId: state.currentUser.id,
              approverName: state.currentUser.name,
              approvalOpinion: opinion,
            }
          : o
      ),
    })),
}));
