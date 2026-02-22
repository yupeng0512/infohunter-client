import { useState } from 'react';
import {
  useSubscriptions,
  useCreateSubscription,
  useUpdateSubscription,
  useDeleteSubscription,
  type SubscriptionResponse,
  type SubscriptionCreate,
  type Source,
  getSourceLabel,
  getSourceColor,
  formatRelativeTime,
} from '@infohunter/shared';

export function SubscriptionsPage() {
  const { data: subs, isLoading } = useSubscriptions();
  const createSub = useCreateSubscription();
  const updateSub = useUpdateSubscription();
  const deleteSub = useDeleteSubscription();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">订阅管理</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? '取消' : '+ 添加订阅'}
        </button>
      </div>

      {showForm && (
        <CreateForm
          onSubmit={(data) => {
            createSub.mutate(data, { onSuccess: () => setShowForm(false) });
          }}
          loading={createSub.isPending}
        />
      )}

      {isLoading ? (
        <div className="text-center py-20 text-slate-400">加载中...</div>
      ) : !subs?.length ? (
        <div className="text-center py-20 text-slate-400">暂无订阅</div>
      ) : (
        <div className="space-y-3">
          {subs.map((sub) => (
            <SubCard
              key={sub.id}
              sub={sub}
              onToggle={() =>
                updateSub.mutate({
                  id: sub.id,
                  data: { status: sub.status === 'active' ? 'paused' : 'active' },
                })
              }
              onDelete={() => {
                if (confirm(`确定删除订阅「${sub.name}」？`)) deleteSub.mutate(sub.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SubCard({
  sub,
  onToggle,
  onDelete,
}: {
  sub: SubscriptionResponse;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const typeLabels: Record<string, string> = {
    keyword: '关键词',
    author: '作者',
    topic: '话题',
    feed: 'RSS Feed',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: getSourceColor(sub.source) + '18',
              color: getSourceColor(sub.source),
            }}
          >
            {getSourceLabel(sub.source)}
          </span>
          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
            {typeLabels[sub.type] ?? sub.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              sub.status === 'active'
                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {sub.status === 'active' ? '● 活跃' : '○ 暂停'}
          </button>
          <button
            onClick={onDelete}
            className="text-xs px-2 py-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            删除
          </button>
        </div>
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{sub.name}</h3>
      <p className="text-sm text-slate-500 mb-2">{sub.target}</p>
      <div className="text-xs text-slate-400">
        {sub.last_fetched_at
          ? `上次采集 ${formatRelativeTime(sub.last_fetched_at)}`
          : '尚未采集'}
      </div>
    </div>
  );
}

function CreateForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: SubscriptionCreate) => void;
  loading: boolean;
}) {
  const [name, setName] = useState('');
  const [source, setSource] = useState<Source>('twitter');
  const [type, setType] = useState('keyword');
  const [target, setTarget] = useState('');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">名称</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="如：AI 技术动态"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">目标</label>
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="关键词或用户名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">来源</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as Source)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="twitter">Twitter</option>
            <option value="youtube">YouTube</option>
            <option value="blog">Blog/RSS</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">类型</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="keyword">关键词</option>
            <option value="author">作者</option>
            <option value="topic">话题</option>
            <option value="feed">RSS Feed</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => onSubmit({ name, source, type, target })}
        disabled={loading || !name || !target}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? '创建中...' : '创建订阅'}
      </button>
    </div>
  );
}
