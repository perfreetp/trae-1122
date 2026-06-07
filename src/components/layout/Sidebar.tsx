import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Server,
  ClipboardList,
  AlertTriangle,
  CheckSquare,
  BarChart3,
  GitBranch,
  FileBarChart,
  Menu,
  Zap,
} from 'lucide-react';
import { useStore } from '@/store';
import { cn } from '@/utils';

const menuItems = [
  { path: '/', label: '机房总览', icon: LayoutDashboard },
  { path: '/cabinet', label: '机柜视图', icon: Server },
  { path: '/devices', label: '设备台账', icon: ClipboardList },
  { path: '/alarms', label: '告警处置', icon: AlertTriangle },
  { path: '/inspection', label: '巡检任务', icon: CheckSquare },
  { path: '/capacity', label: '容量规划', icon: BarChart3 },
  { path: '/changes', label: '变更记录', icon: GitBranch },
  { path: '/reports', label: '报表中心', icon: FileBarChart },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, alarms } = useStore();
  const activeAlarms = alarms.filter(a => a.status !== 'resolved' && a.status !== 'closed').length;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-cyan-500">
              <Zap className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-wide">DCIM</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-700 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-4 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'group relative mb-1 flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-all',
                  isActive
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              {!sidebarCollapsed && item.path === '/alarms' && activeAlarms > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold">
                  {activeAlarms}
                </span>
              )}
              {sidebarCollapsed && item.path === '/alarms' && activeAlarms > 0 && (
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-4">
          <div className="text-xs text-slate-400">数据中心运维管理平台</div>
          <div className="text-xs text-slate-500 mt-1">v1.0.0</div>
        </div>
      )}
    </aside>
  );
}
