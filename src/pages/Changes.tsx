import { useState } from 'react';
import {
  GitBranch,
  Plus,
  X,
  Check,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/store';
import {
  cn,
  getChangeStatusName,
  getChangeStatusColor,
  getChangeTypeName,
  formatDateTime,
  formatDate,
} from '@/utils';

export default function Changes() {
  const { changeOrders, users, approveChangeOrder, addChangeOrder } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalOpinion, setApprovalOpinion] = useState('');
  const [newChange, setNewChange] = useState({
    title: '',
    type: 'hardware' as const,
    planTime: '',
    impactScope: '',
    description: '',
    rollbackPlan: '',
  });

  const filtered = changeOrders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const selected = changeOrders.find(o => o.id === selectedId);

  const handleApprove = (approve: boolean) => {
    if (selectedId) {
      approveChangeOrder(selectedId, approvalOpinion, approve);
      setShowApproveModal(false);
      setApprovalOpinion('');
    }
  };

  const handleCreate = () => {
    addChangeOrder({
      ...newChange,
      applicantId: users[0].id,
      applicantName: users[0].name,
      status: 'pending_approval',
    });
    setShowCreateModal(false);
    setNewChange({
      title: '',
      type: 'hardware',
      planTime: '',
      impactScope: '',
      description: '',
      rollbackPlan: '',
    });
  };

  const stats = {
    total: changeOrders.length,
    pending: changeOrders.filter(o => o.status === 'pending_approval').length,
    approved: changeOrders.filter(o => o.status === 'approved' || o.status === 'implementing').length,
    completed: changeOrders.filter(o => o.status === 'completed').length,
    rejected: changeOrders.filter(o => o.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">变更记录</h1>
          <p className="mt-1 text-sm text-gray-500">规范化变更管理与审批流程</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新建变更
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <GitBranch className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">全部变更</div>
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
              <div className="text-xs text-gray-500">待审批</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
              <Check className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sky-600">{stats.approved}</div>
              <div className="text-xs text-gray-500">进行中</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
              <div className="text-xs text-gray-500">已完成</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-xs text-gray-500">已驳回</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">全部状态</option>
              <option value="draft">草稿</option>
              <option value="pending_approval">待审批</option>
              <option value="approved">已批准</option>
              <option value="implementing">执行中</option>
              <option value="completed">已完成</option>
              <option value="rejected">已驳回</option>
              <option value="rolled_back">已回滚</option>
            </select>
            <span className="ml-auto text-sm text-gray-500">共 {filtered.length} 条</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[calc(100vh-340px)] overflow-y-auto">
            {filtered.map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedId(selectedId === order.id ? null : order.id)}
                className={cn(
                  'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                  selectedId === order.id && 'bg-cyan-50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900">{order.title}</h4>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        getChangeStatusColor(order.status)
                      )}>
                        {getChangeStatusName(order.status)}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {getChangeTypeName(order.type)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {order.id}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {order.applicantName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        计划: {formatDate(order.planTime)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 truncate">{order.impactScope}</p>
                  </div>
                  <ChevronRight className={cn(
                    'h-4 w-4 text-gray-400 flex-shrink-0 transition-transform',
                    selectedId === order.id && 'rotate-90'
                  )} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">变更详情</h3>
            {selected && (
              <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {selected ? (
            <div className="p-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selected.title}</h4>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    getChangeStatusColor(selected.status)
                  )}>
                    {getChangeStatusName(selected.status)}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {getChangeTypeName(selected.type)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">变更单号</span>
                  <span className="font-mono text-gray-900">{selected.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">申请人</span>
                  <span className="text-gray-900">{selected.applicantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">申请时间</span>
                  <span className="text-gray-900">{formatDateTime(selected.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">计划时间</span>
                  <span className="text-gray-900">{formatDateTime(selected.planTime)}</span>
                </div>
                {selected.approverName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">审批人</span>
                    <span className="text-gray-900">{selected.approverName}</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">影响范围</div>
                <p className="text-sm text-gray-700">{selected.impactScope}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">变更内容</div>
                <p className="text-sm text-gray-700">{selected.description}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">回滚方案</div>
                <p className="text-sm text-gray-700">{selected.rollbackPlan}</p>
              </div>

              {selected.approvalOpinion && (
                <div className={cn(
                  'p-3 rounded-lg',
                  selected.status === 'rejected' ? 'bg-red-50 border border-red-100' : 'bg-emerald-50 border border-emerald-100'
                )}>
                  <div className={cn(
                    'text-xs mb-1 font-medium',
                    selected.status === 'rejected' ? 'text-red-700' : 'text-emerald-700'
                  )}>
                    审批意见
                  </div>
                  <p className={cn(
                    'text-sm',
                    selected.status === 'rejected' ? 'text-red-600' : 'text-emerald-600'
                  )}>
                    {selected.approvalOpinion}
                  </p>
                </div>
              )}

              {selected.status === 'pending_approval' && (
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm"
                >
                  <Check className="h-4 w-4" />
                  处理审批
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <GitBranch className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">点击左侧变更查看详情</p>
            </div>
          )}
        </div>
      </div>

      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">变更审批</h3>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">审批意见</label>
              <textarea
                value={approvalOpinion}
                onChange={e => setApprovalOpinion(e.target.value)}
                placeholder="请输入审批意见..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-cyan-500 focus:outline-none resize-none text-sm"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                取消
              </button>
              <button
                onClick={() => handleApprove(false)}
                className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                驳回
              </button>
              <button
                onClick={() => handleApprove(true)}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                批准
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-[500px] shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">新建变更申请</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">变更标题</label>
                <input
                  type="text"
                  value={newChange.title}
                  onChange={e => setNewChange({ ...newChange, title: e.target.value })}
                  placeholder="请输入变更标题"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-cyan-500 focus:outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">变更类型</label>
                  <select
                    value={newChange.type}
                    onChange={e => setNewChange({ ...newChange, type: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-cyan-500 focus:outline-none text-sm"
                  >
                    <option value="hardware">硬件变更</option>
                    <option value="software">软件变更</option>
                    <option value="network">网络变更</option>
                    <option value="power">电力变更</option>
                    <option value="aircon">空调变更</option>
                    <option value="other">其他变更</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">计划时间</label>
                  <input
                    type="datetime-local"
                    value={newChange.planTime}
                    onChange={e => setNewChange({ ...newChange, planTime: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-cyan-500 focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">影响范围</label>
                <input
                  type="text"
                  value={newChange.impactScope}
                  onChange={e => setNewChange({ ...newChange, impactScope: e.target.value })}
                  placeholder="请描述影响范围"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-cyan-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">变更内容</label>
                <textarea
                  value={newChange.description}
                  onChange={e => setNewChange({ ...newChange, description: e.target.value })}
                  placeholder="请详细描述变更内容"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-cyan-500 focus:outline-none resize-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">回滚方案</label>
                <textarea
                  value={newChange.rollbackPlan}
                  onChange={e => setNewChange({ ...newChange, rollbackPlan: e.target.value })}
                  placeholder="请描述回滚方案"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-cyan-500 focus:outline-none resize-none text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
