import { Bell, Search, User, Settings, Maximize2 } from 'lucide-react';
import { useStore } from '@/store';
import { formatDateTime } from '@/utils';
import { useState, useEffect } from 'react';

export function Header() {
  const { sidebarCollapsed, currentUser, alarms } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlarms = alarms.filter(a => a.status !== 'resolved' && a.status !== 'closed').length;
  const criticalAlarms = alarms.filter(a => a.level === 'critical' && a.status !== 'resolved' && a.status !== 'closed').length;

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'left-16' : 'left-60'
      }`}
    >
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索设备、告警、工单..."
              className="h-9 w-80 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600 font-mono">
            {formatDateTime(currentTime)}
          </div>

          <button
            onClick={() => document.documentElement.requestFullscreen?.()}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Maximize2 className="h-5 w-5 text-gray-500" />
          </button>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-500" />
            {activeAlarms > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {criticalAlarms > 0 ? criticalAlarms : activeAlarms}
              </span>
            )}
          </button>

          <button className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
              <div className="text-xs text-gray-500">
                {currentUser.role === 'supervisor' ? '运维主管' : currentUser.role === 'manager' ? '数据中心经理' : '运维工程师'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
