import {
  Server,
  AlertTriangle,
  Thermometer,
  Droplets,
  Gauge,
  Activity,
  CheckSquare,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useStore } from '@/store';
import { dashboardStats, temperatureTrend, humidityTrend, powerTrend, alarmTrend } from '@/mock/data';
import { cn, getAlarmLevelColor } from '@/utils';
import { Link } from 'react-router-dom';

const quickActions = [
  { label: '机柜视图', icon: Server, path: '/cabinet', color: 'from-blue-500 to-cyan-500' },
  { label: '设备台账', icon: Activity, path: '/devices', color: 'from-emerald-500 to-teal-500' },
  { label: '告警处置', icon: AlertTriangle, path: '/alarms', color: 'from-red-500 to-orange-500' },
  { label: '巡检任务', icon: CheckSquare, path: '/inspection', color: 'from-violet-500 to-purple-500' },
  { label: '容量规划', icon: Gauge, path: '/capacity', color: 'from-amber-500 to-yellow-500' },
  { label: '变更记录', icon: TrendingUp, path: '/changes', color: 'from-pink-500 to-rose-500' },
  { label: '报表中心', icon: Activity, path: '/reports', color: 'from-indigo-500 to-blue-500' },
  { label: '设备定位', icon: Zap, path: '/cabinet', color: 'from-cyan-500 to-sky-500' },
];

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
            {unit && <span className="text-lg font-normal text-gray-500 ml-1">{unit}</span>}
          </p>
          {trend !== undefined && (
            <p className={cn(
              'mt-2 text-xs font-medium flex items-center gap-1',
              trend >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}>
              <TrendingUp className={cn('h-3 w-3', trend < 0 && 'rotate-180')} />
              {Math.abs(trend)}% 较昨日
            </p>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg',
          color
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { alarms, inspectionTasks } = useStore();

  const recentAlarms = alarms
    .filter(a => a.status !== 'resolved' && a.status !== 'closed')
    .slice(0, 5);

  const todayTasks = inspectionTasks.filter(
    t => t.planDate === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">机房总览</h1>
        <p className="mt-1 text-sm text-gray-500">数据中心实时运行状态监控</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Server}
          label="设备总数"
          value={dashboardStats.totalDevices}
          unit="台"
          trend={2.3}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Activity}
          label="在线率"
          value={dashboardStats.onlineRate}
          unit="%"
          trend={0.5}
          color="from-emerald-500 to-teal-500"
        />
        <StatCard
          icon={AlertTriangle}
          label="活跃告警"
          value={dashboardStats.activeAlarms}
          unit="条"
          trend={-12}
          color="from-red-500 to-orange-500"
        />
        <StatCard
          icon={Gauge}
          label="PUE值"
          value={dashboardStats.pue}
          trend={-3.2}
          color="from-violet-500 to-purple-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={Thermometer}
          label="平均温度"
          value={dashboardStats.avgTemperature}
          unit="°C"
          color="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={Droplets}
          label="平均湿度"
          value={dashboardStats.avgHumidity}
          unit="%"
          color="from-sky-500 to-blue-500"
        />
        <StatCard
          icon={CheckSquare}
          label="今日巡检"
          value={`${dashboardStats.completedInspections}/${dashboardStats.todayInspections}`}
          color="from-pink-500 to-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">温湿度趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="温度(°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">电力负载趋势 (kW)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerTrend}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#colorPower)"
                  name="负载(kW)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">快捷功能</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                >
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md group-hover:scale-105 transition-transform',
                    action.color
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">活跃告警</h3>
            <Link to="/alarms" className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">
              查看全部
            </Link>
          </div>
          <div className="space-y-3">
            {recentAlarms.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">暂无活跃告警</div>
            ) : (
              recentAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <span className={cn(
                    'flex-shrink-0 mt-0.5 h-2 w-2 rounded-full',
                    getAlarmLevelColor(alarm.level).split(' ')[0]
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{alarm.content}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{alarm.deviceName}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">近7日告警统计</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alarmTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} name="告警数量" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">今日巡检任务</h3>
            <Link to="/inspection" className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">
              查看全部
            </Link>
          </div>
          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">今日暂无巡检任务</div>
            ) : (
              todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{task.name}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      task.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : task.status === 'in_progress'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-gray-100 text-gray-700'
                    )}>
                      {task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '进行中' : '待执行'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all"
                        style={{ width: `${(task.completedCount / task.pointCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {task.completedCount}/{task.pointCount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">负责人: {task.assigneeName}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
