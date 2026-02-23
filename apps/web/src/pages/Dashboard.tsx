import {
  useStats,
  useHealth,
  useTriggerSmartCollect,
  useTriggerDailyReport,
  getSourceLabel,
} from '@infohunter/shared';

export function DashboardPage() {
  const { data: stats, isLoading } = useStats();
  const { data: health } = useHealth();
  const smartCollect = useTriggerSmartCollect();
  const dailyReport = useTriggerDailyReport();

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 max-w-6xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">概览</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="活跃订阅" value={stats?.subscriptions.active ?? 0} color="blue" />
        <StatCard
          label="总内容数"
          value={stats?.contents.total ?? 0}
          sub={`今日新增 ${stats?.contents.today ?? 0}`}
          color="emerald"
        />
        <StatCard label="本周" value={stats?.contents.this_week ?? 0} color="violet" />
        <StatCard label="待通知" value={stats?.notifications?.pending ?? 0} color="amber" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Twitter" value={health?.twitter_contents ?? 0} color="sky" />
        <StatCard label="YouTube" value={health?.youtube_contents ?? 0} color="red" />
        <StatCard label="Blog/RSS" value={health?.blog_contents ?? 0} color="orange" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-4">快捷操作</h3>
      <div className="flex gap-3">
        <button
          onClick={() => smartCollect.mutate()}
          disabled={smartCollect.isPending}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {smartCollect.isPending ? '采集中...' : '⚡ 智能采集'}
        </button>
        <button
          onClick={() => dailyReport.mutate()}
          disabled={dailyReport.isPending}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {dailyReport.isPending ? '生成中...' : '📄 生成日报'}
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    violet: 'text-violet-600',
    amber: 'text-amber-600',
    sky: 'text-sky-500',
    red: 'text-red-500',
    orange: 'text-orange-500',
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colorMap[color] ?? 'text-slate-900'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );
}
