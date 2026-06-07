import { useState } from 'react';
import {
  CheckSquare,
  MapPin,
  Camera,
  AlertCircle,
  Check,
  Clock,
  Calendar,
  User,
  Plus,
  X,
} from 'lucide-react';
import { useStore } from '@/store';
import {
  cn,
  getInspectionStatusName,
  getInspectionStatusColor,
  formatDateTime,
} from '@/utils';

export default function Inspection() {
  const { inspectionTasks, completeInspectionPoint, currentUser } = useStore();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<any>(null);
  const [checkRemark, setCheckRemark] = useState('');
  const [isAbnormal, setIsAbnormal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = inspectionTasks.filter(t => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  const selectedTask = inspectionTasks.find(t => t.id === selectedTaskId);

  const handleOpenCheck = (point: any) => {
    setCurrentPoint(point);
    setCheckRemark('');
    setIsAbnormal(false);
    setShowCheckModal(true);
  };

  const handleCheckIn = () => {
    if (selectedTask && currentPoint) {
      completeInspectionPoint(selectedTask.id, currentPoint.id, checkRemark, isAbnormal);
      setShowCheckModal(false);
    }
  };

  const myTasks = inspectionTasks.filter(t => t.assigneeId === currentUser.id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">巡检任务</h1>
          <p className="mt-1 text-sm text-gray-500">规范化巡检管理与异常上报</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">
          <Plus className="h-4 w-4" />
          新建任务
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <CheckSquare className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{inspectionTasks.length}</div>
              <div className="text-xs text-gray-500">全部任务</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
              <Clock className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sky-600">
                {inspectionTasks.filter(t => t.status === 'in_progress').length}
              </div>
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
              <div className="text-2xl font-bold text-emerald-600">
                {inspectionTasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-500">已完成</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {inspectionTasks.filter(t => t.status === 'overdue').length}
              </div>
              <div className="text-xs text-gray-500">已逾期</div>
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
              <option value="pending">待执行</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="overdue">已逾期</option>
            </select>
            <span className="ml-auto text-sm text-gray-500">共 {filteredTasks.length} 条</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[calc(100vh-340px)] overflow-y-auto">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                className={cn(
                  'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                  selectedTaskId === task.id && 'bg-cyan-50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900">{task.name}</h4>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        getInspectionStatusColor(task.status)
                      )}>
                        {getInspectionStatusName(task.status)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {task.planDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.assigneeName}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckSquare className="h-3 w-3" />
                        {task.completedCount}/{task.pointCount}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded-full transition-all"
                            style={{ width: `${(task.completedCount / task.pointCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {Math.round((task.completedCount / task.pointCount) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">巡检详情</h3>
            {selectedTask && (
              <button onClick={() => setSelectedTaskId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {selectedTask ? (
            <div className="p-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedTask.name}</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">计划日期</span>
                    <span className="text-gray-900">{selectedTask.planDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">负责人</span>
                    <span className="text-gray-900">{selectedTask.assigneeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">完成进度</span>
                    <span className="text-gray-900">{selectedTask.completedCount}/{selectedTask.pointCount}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">巡检点</h5>
                <div className="space-y-2">
                  {selectedTask.points.map((point, idx) => (
                    <div
                      key={point.id}
                      className={cn(
                        'p-3 rounded-lg border transition-colors',
                        point.checked
                          ? 'bg-gray-50 border-gray-100'
                          : 'bg-white border-gray-200 hover:border-cyan-300'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'flex-shrink-0 mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold',
                          point.checked
                            ? point.abnormal
                              ? 'bg-red-100 text-red-600'
                              : 'bg-emerald-100 text-emerald-600'
                            : 'bg-gray-100 text-gray-500'
                        )}>
                          {point.checked ? <Check className="h-3 w-3" /> : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              'text-sm font-medium',
                              point.checked ? 'text-gray-500' : 'text-gray-900'
                            )}>
                              {point.name}
                            </span>
                            {point.abnormal && (
                              <span className="text-xs text-red-600 flex items-center gap-0.5">
                                <AlertCircle className="h-3 w-3" />
                                异常
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{point.deviceName}</p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {point.location}
                          </p>
                          {point.checked && point.checkTime && (
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDateTime(point.checkTime)}
                            </p>
                          )}
                          {point.remark && (
                            <p className="text-xs text-gray-600 mt-1 p-2 bg-gray-100 rounded">
                              {point.remark}
                            </p>
                          )}
                          {!point.checked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCheck(point);
                              }}
                              className="mt-2 w-full py-1.5 text-xs font-medium text-cyan-600 bg-cyan-50 rounded hover:bg-cyan-100 transition-colors"
                            >
                              打卡巡检
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <CheckSquare className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">点击左侧任务查看详情</p>
            </div>
          )}
        </div>
      </div>

      {showCheckModal && currentPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">巡检打卡</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-900">{currentPoint.name}</div>
                <div className="text-xs text-gray-500 mt-1">{currentPoint.deviceName}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">巡检备注</label>
                <textarea
                  value={checkRemark}
                  onChange={e => setCheckRemark(e.target.value)}
                  placeholder="请输入巡检情况..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-cyan-500 focus:outline-none resize-none text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAbnormal}
                  onChange={e => setIsAbnormal(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">标记为异常</span>
              </label>
              <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm">
                <Camera className="h-4 w-4" />
                上传照片
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCheckModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                取消
              </button>
              <button
                onClick={handleCheckIn}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium"
              >
                确认打卡
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
