import { useState } from 'react';
import {
  FileBarChart,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckSquare,
  Server,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Clock,
} from 'lucide-react';
import { cn } from '../utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { reportData } from '@/mock/data';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const slaData = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}月`,
  target: 99.95,
  actual: 99.9 + Math.random() * 0.1,
}));

const alarmTypeData = [
  { name: '温度告警', value: 35 },
  { name: '电力告警', value: 28 },
  { name: '设备离线', value: 22 },
  { name: '风扇异常', value: 15 },
  { name: '配置变更', value: 10 },
  { name: '其他', value: 8 },
];

const deviceTypeData = [
  { name: '服务器', value: 45 },
  { name: '交换机', value: 25 },
  { name: 'UPS', value: 12 },
  { name: '精密空调', value: 8 },
  { name: '配电柜', value: 6 },
  { name: '消防设备', value: 4 },
];

const alarmTrend = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}`,
  紧急: Math.floor(Math.random() * 3),
  重要: Math.floor(Math.random() * 5) + 2,
  一般: Math.floor(Math.random() * 8) + 3,
  提示: Math.floor(Math.random() * 10) + 5,
}));

const inspectionCompletion = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
  return {
    day: `${date.getMonth() + 1}/${date.getDate()}`,
    计划: 10,
    完成: Math.floor(Math.random() * 3) + 8,
  };
});

export default function Reports() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '综合概览', icon: FileBarChart },
    { id: 'sla', label: 'SLA统计', icon: TrendingUp },
    { id: 'alarms', label: '告警分析', icon: AlertTriangle },
    { id: 'devices', label: '设备统计', icon: Server },
    { id: 'inspection', label: '巡检分析', icon: CheckSquare },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">报表中心</h1>
          <p className="mt-1 text-sm text-gray-500">多维度数据分析与可视化报表</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4" />
            本月
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">
            <Download className="h-4 w-4" />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{reportData.sla.actual}%</div>
              <div className="text-xs text-gray-500">SLA达成率</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100">
              <AlertTriangle className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-600">{reportData.alarms.resolutionRate}%</div>
              <div className="text-xs text-gray-500">告警解决率</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{reportData.alarms.avgResolutionTime}min</div>
              <div className="text-xs text-gray-500">平均解决时间</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
              <CheckSquare className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-violet-600">{reportData.inspection.completionRate}%</div>
              <div className="text-xs text-gray-500">巡检完成率</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-cyan-600" />
              SLA趋势（近12个月）
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={slaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[99.8, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" name="目标值" dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} name="实际值" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-cyan-600" />
              告警类型分布
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alarmTypeData}
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {alarmTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {alarmTypeData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-gray-700 flex-1">{item.name}</span>
                    <span className="text-gray-500 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-600" />
              近30天告警趋势
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={alarmTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="紧急" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="重要" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="一般" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="提示" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-600" />
              设备类型分布
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#9ca3af" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {deviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sla' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">SLA详细趋势</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={slaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[99.8, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" name="目标值(99.95%)" dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} name="实际达成率" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">SLA关键指标</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">目标可用性</span>
                    <span className="font-medium text-gray-900">{reportData.sla.target}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">实际可用性</span>
                    <span className="font-medium text-emerald-600">{reportData.sla.actual}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(reportData.sla.actual / 100) * 100}%` }} />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">累计可用时长</div>
                  <div className="text-2xl font-bold text-gray-900">43,189 小时</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">累计停机时长</div>
                  <div className="text-2xl font-bold text-gray-900">5.2 小时</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alarms' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">告警趋势分析</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={alarmTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="紧急" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="重要" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="一般" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="提示" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">告警处理效率</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-gray-900">{reportData.alarms.total}</div>
                  <div className="text-xs text-gray-500 mt-1">告警总数</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-emerald-600">{reportData.alarms.resolved}</div>
                  <div className="text-xs text-gray-500 mt-1">已解决</div>
                </div>
                <div className="p-4 bg-cyan-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-cyan-600">{reportData.alarms.resolutionRate}%</div>
                  <div className="text-xs text-gray-500 mt-1">解决率</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-amber-600">{reportData.alarms.avgResolutionTime}m</div>
                  <div className="text-xs text-gray-500 mt-1">平均解决时间</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">设备类型占比</h3>
            <div className="flex items-center justify-center">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceTypeData}
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">设备状态统计</h3>
            <div className="space-y-4">
              {[
                { name: '在线', count: 98, color: 'bg-emerald-500' },
                { name: '告警', count: 8, color: 'bg-amber-500' },
                { name: '离线', count: 5, color: 'bg-gray-500' },
                { name: '故障', count: 3, color: 'bg-red-500' },
                { name: '维护中', count: 6, color: 'bg-blue-500' },
              ].map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 flex items-center gap-2">
                      <span className={cn('h-2.5 w-2.5 rounded-full', item.color)} />
                      {item.name}
                    </span>
                    <span className="font-medium text-gray-900">{item.count} 台</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', item.color)}
                      style={{ width: `${(item.count / 120) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inspection' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">近7天巡检完成情况</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inspectionCompletion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="计划" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="完成" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">巡检关键指标</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-gray-900">{reportData.inspection.total}</div>
                  <div className="text-xs text-gray-500 mt-1">计划巡检次数</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-emerald-600">{reportData.inspection.completed}</div>
                  <div className="text-xs text-gray-500 mt-1">已完成</div>
                </div>
                <div className="p-4 bg-cyan-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-cyan-600">{reportData.inspection.completionRate}%</div>
                  <div className="text-xs text-gray-500 mt-1">完成率</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-red-600">{reportData.inspection.abnormalCount}</div>
                  <div className="text-xs text-gray-500 mt-1">异常发现</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
