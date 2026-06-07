import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Send,
  X,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/store';
import {
  cn,
  getAlarmLevelName,
  getAlarmLevelColor,
  getAlarmStatusName,
  formatDateTime,
} from '@/utils';

export default function Alarms() {
  const { alarms, users, dispatchAlarm, resolveAlarm, updateAlarmStatus } = useStore();
  const [selectedAlarmId, setSelectedAlarmId] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [dispatchUser, setDispatchUser] = useState('');
  const [resolveNote, setResolveNote] = useState('');

  const filteredAlarms = alarms.filter(a => {
    const matchLevel = levelFilter === 'all' || a.level === levelFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchLevel && matchStatus;
  });

  const selectedAlarm = alarms.find(a => a.id === selectedAlarmId);

  const handleDispatch = () => {
    if (selectedAlarmId && dispatchUser) {
      dispatchAlarm(selectedAlarmId, dispatchUser);
      setShowDispatchModal(false);
      setDispatchUser('');
    }
  };

  const handleResolve = () => {
    if (selectedAlarmId && resolveNote) {
      resolveAlarm(selectedAlarmId, resolveNote);
      setShowResolveModal(false);
      setResolveNote('');
    }
  };

  const handleConfirm = (alarmId: string) => {
    updateAlarmStatus(alarmId, 'confirmed');
  };

  const stats = {
    total: alarms.length,
    pending: alarms.filter(a => a.status === 'pending' || a.status === 'confirmed').length,
    processing: alarms.filter(a => a.status === 'dispatched' || a.status === 'processing').length,
    resolved: alarms.filter(a => a.status === 'resolved' || a.status === 'closed').length,
    critical: alarms.filter(a => a.level === 'critical' && a.status !== 'resolved' && a.status !== 'closed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">告警处置</h1>
        <p className="mt-1 text-sm text-gray-500">实时告警监控与智能处置</p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">告警总数</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <div className="text-xs text-gray-500">紧急告警</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-xs text-gray-500">待处理</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
              <MessageSquare className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sky-600">{stats.processing}</div>
              <div className="text-xs text-gray-500">处理中</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{stats.resolved}</div>
              <div className="text-xs text-gray-500">已解决</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">全部级别</option>
              <option value="critical">紧急</option>
              <option value="major">重要</option>
              <option value="minor">一般</option>
              <option value="info">提示</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">全部状态</option>
              <option value="pending">待确认</option>
              <option value="confirmed">已确认</option>
              <option value="dispatched">已分派</option>
              <option value="processing">处理中</option>
              <option value="resolved">已解决</option>
            </select>
            <span className="ml-auto text-sm text-gray-500">共 {filteredAlarms.length} 条</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[calc(100vh-340px)] overflow-y-auto">
            {filteredAlarms.map(alarm => (
              <div
                key={alarm.id}
                onClick={() => setSelectedAlarmId(alarm.id)}
                className={cn(
                  'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                  selectedAlarmId === alarm.id && 'bg-cyan-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className={cn(
                    'flex-shrink-0 mt-1 px-2 py-0.5 rounded text-xs font-bold',
                    getAlarmLevelColor(alarm.level)
                  )}>
                    {getAlarmLevelName(alarm.level)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{alarm.content}</p>
                      <ChevronRight className={cn(
                        'h-4 w-4 text-gray-400 flex-shrink-0 transition-transform',
                        selectedAlarmId === alarm.id && 'rotate-90'
                      )} />
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span>{alarm.deviceName}</span>
                      <span>·</span>
                      <span>{formatDateTime(alarm.occurTime)}</span>
                      <span className={cn(
                        'ml-auto px-2 py-0.5 rounded-full',
                        alarm.status === 'resolved' || alarm.status === 'closed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : alarm.status === 'pending'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-sky-100 text-sky-700'
                      )}>
                        {getAlarmStatusName(alarm.status)}
                      </span>
                    </div>
                    {alarm.handlerName && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        处理人: {alarm.handlerName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">告警详情</h3>
            {selectedAlarm && (
              <button onClick={() => setSelectedAlarmId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {selectedAlarm ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className={cn('px-3 py-1 rounded text-sm font-bold', getAlarmLevelColor(selectedAlarm.level))}>
                  {getAlarmLevelName(selectedAlarm.level)}
                </span>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs',
                  selectedAlarm.status === 'resolved' || selectedAlarm.status === 'closed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-sky-100 text-sky-700'
                )}>
                  {getAlarmStatusName(selectedAlarm.status)}
                </span>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">{selectedAlarm.content}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">关联设备</span>
                    <span className="text-gray-900">{selectedAlarm.deviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">发生时间</span>
                    <span className="text-gray-900">{formatDateTime(selectedAlarm.occurTime)}</span>
                  </div>
                  {selectedAlarm.handlerName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">处理人</span>
                      <span className="text-gray-900">{selectedAlarm.handlerName}</span>
                    </div>
                  )}
                  {selectedAlarm.resolveTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">解决时间</span>
                      <span className="text-gray-900">{formatDateTime(selectedAlarm.resolveTime)}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedAlarm.resolveNote && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">处置说明</div>
                  <p className="text-sm text-gray-700">{selectedAlarm.resolveNote}</p>
                </div>
              )}

              {(selectedAlarm.status === 'pending') && (
                <button
                  onClick={() => handleConfirm(selectedAlarm.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  确认告警
                </button>
              )}

              {(selectedAlarm.status === 'confirmed') && (
                <button
                  onClick={() => setShowDispatchModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
                >
                  <Send className="h-4 w-4" />
                  分派处理
                </button>
              )}

              {(selectedAlarm.status === 'dispatched' || selectedAlarm.status === 'processing') && (
                <button
                  onClick={() => setShowResolveModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  标记解决
                </button>
              )}

              {selectedAlarm.history && selectedAlarm.history.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">处置记录</h4>
                  <div className="space-y-2">
                    {selectedAlarm.history.map((item, idx) => (
                      <div key={idx} className="flex gap-2 text-xs">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-cyan-500" />
                          {idx < selectedAlarm.history!.length - 1 && (
                            <div className="w-px flex-1 bg-gray-200 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-medium">{item.action}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-500">{item.operator}</span>
                          </div>
                          <div className="text-gray-400">{formatDateTime(item.time)}</div>
                          {item.note && <p className="text-gray-600 mt-1">{item.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <AlertTriangle className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">点击左侧告警查看详情</p>
            </div>
          )}
        </div>
      </div>

      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">分派告警</h3>
            <select
              value={dispatchUser}
              onChange={e => setDispatchUser(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 mb-4 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">选择处理人</option>
              {users.filter(u => u.role === 'engineer').map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDispatchModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDispatch}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                确认分派
              </button>
            </div>
          </div>
        </div>
      )}

      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">解决告警</h3>
            <textarea
              value={resolveNote}
              onChange={e => setResolveNote(e.target.value)}
              placeholder="请填写处置说明..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 mb-4 focus:border-cyan-500 focus:outline-none resize-none text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowResolveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleResolve}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                确认解决
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
