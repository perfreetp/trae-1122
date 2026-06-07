import {
  BarChart3,
  Box,
  Zap,
  Wind,
  TrendingUp,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { capacityData } from '@/mock/data';
import { cn } from '@/utils';

const COLORS = ['#06b6d4', '#e5e7eb'];

const capacityTrend = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}月`,
  space: 50 + i * 1.5 + Math.random() * 3,
  power: 45 + i * 1.2 + Math.random() * 2,
  cooling: 40 + i * 1 + Math.random() * 2,
}));

const cabinetCapacity = Array.from({ length: 10 }, (_, i) => ({
  cabinet: `A1-${String(i + 1).padStart(2, '0')}`,
  used: Math.floor(Math.random() * 25) + 10,
  total: 42,
}));

export default function Capacity() {
  const spaceData = [
    { name: '已使用', value: capacityData.space.used },
    { name: '剩余', value: capacityData.space.total - capacityData.space.used },
  ];

  const powerData = [
    { name: '已使用', value: capacityData.power.used },
    { name: '剩余', value: capacityData.power.total - capacityData.power.used },
  ];

  const coolingData = [
    { name: '已使用', value: capacityData.cooling.used },
    { name: '剩余', value: capacityData.cooling.total - capacityData.cooling.used },
  ];

  const predictions = [
    { type: 'space', date: '2026年Q4', rate: 85, alert: true },
    { type: 'power', date: '2027年Q1', rate: 80, alert: false },
    { type: 'cooling', date: '2027年Q2', rate: 78, alert: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">容量规划</h1>
        <p className="mt-1 text-sm text-gray-500">数据中心资源容量统计与预测分析</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">空间容量</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
              <Box className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spaceData}
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {spaceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900">{capacityData.space.rate}%</div>
              <div className="text-sm text-gray-500 mt-1">使用率</div>
              <div className="text-xs text-gray-400 mt-2">
                {capacityData.space.used} / {capacityData.space.total} U位
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                capacityData.space.rate > 80 ? 'bg-red-500' : capacityData.space.rate > 60 ? 'bg-amber-500' : 'bg-cyan-500'
              )}
              style={{ width: `${capacityData.space.rate}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">电力容量</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={powerData}
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {powerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900">{capacityData.power.rate}%</div>
              <div className="text-sm text-gray-500 mt-1">使用率</div>
              <div className="text-xs text-gray-400 mt-2">
                {capacityData.power.used} / {capacityData.power.total} kW
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                capacityData.power.rate > 80 ? 'bg-red-500' : capacityData.power.rate > 60 ? 'bg-amber-500' : 'bg-cyan-500'
              )}
              style={{ width: `${capacityData.power.rate}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">制冷容量</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <Wind className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coolingData}
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {coolingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900">{capacityData.cooling.rate}%</div>
              <div className="text-sm text-gray-500 mt-1">使用率</div>
              <div className="text-xs text-gray-400 mt-2">
                {capacityData.cooling.used} / {capacityData.cooling.total} kW
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                capacityData.cooling.rate > 80 ? 'bg-red-500' : capacityData.cooling.rate > 60 ? 'bg-amber-500' : 'bg-cyan-500'
              )}
              style={{ width: `${capacityData.cooling.rate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">容量趋势（近12个月）</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={capacityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="space" stroke="#06b6d4" strokeWidth={2} name="空间使用率" dot={false} />
                <Line type="monotone" dataKey="power" stroke="#f59e0b" strokeWidth={2} name="电力使用率" dot={false} />
                <Line type="monotone" dataKey="cooling" stroke="#8b5cf6" strokeWidth={2} name="制冷使用率" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">容量预警预测</h3>
          <div className="space-y-3">
            {predictions.map((pred, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex-shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg',
                    pred.alert ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  )}>
                    {pred.alert ? <AlertTriangle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {pred.type === 'space' ? '空间容量' : pred.type === 'power' ? '电力容量' : '制冷容量'}
                      </span>
                      <span className="text-xs text-gray-500">{pred.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      预计达到 <span className="font-medium text-gray-900">{pred.rate}%</span> 使用率
                    </p>
                    {pred.alert && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        建议尽快规划扩容
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-100">
            <h4 className="text-sm font-medium text-cyan-900 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              扩容建议
            </h4>
            <p className="text-xs text-cyan-700 mt-2">
              根据当前增长趋势，建议在2026年Q4前完成新增机柜的规划与部署，预计需要新增10个标准机柜以满足未来12个月的业务增长需求。
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-900 mb-4">各机柜U位使用率</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cabinetCapacity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="cabinet" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="used" fill="#06b6d4" radius={[4, 4, 0, 0]} name="已使用U位" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
