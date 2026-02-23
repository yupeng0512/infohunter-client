import {
  useCreditSummary,
  useCreditRecords,
  formatRelativeTime,
} from '@infohunter/shared';

export function CostsPage() {
  const { data: summary, isLoading } = useCreditSummary(30);
  const { data: records } = useCreditRecords({ limit: 50 });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">加载中...</div>;
  }

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">成本监控</h2>

      {summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">今日用量</p>
              <p className="text-3xl font-bold text-slate-900">{summary.today.used}</p>
              <p className="text-xs text-slate-400 mt-1">/ {summary.today.limit} ({summary.today.percentage}%)</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">日均消耗</p>
              <p className="text-3xl font-bold text-blue-600">
                {summary.period.avg_daily}
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">本月累计</p>
              <p className="text-3xl font-bold text-slate-900">{summary.period.month}</p>
              <p className="text-xs text-slate-400 mt-1">≈ ${summary.cost_estimate.monthly_usd}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">剩余额度</p>
              <p className="text-3xl font-bold text-emerald-600">{summary.today.remaining}</p>
              <p className="text-xs text-slate-400 mt-1">{summary.cost_estimate.plan}</p>
            </div>
          </div>

          {summary.by_operation?.today && summary.by_operation.today.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-8">
              <h3 className="font-semibold text-slate-900 mb-3">今日操作分布</h3>
              <div className="space-y-2">
                {summary.by_operation.today.map((item) => {
                  const pct = summary.today.used
                    ? Math.round((item.total_credits / summary.today.used) * 100)
                    : 0;
                  return (
                    <div key={`${item.operation}-${item.context}`} className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 w-40">{item.operation} ({item.context})</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-500 w-24 text-right">
                        {item.total_credits} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {records && records.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">最近记录</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {records.map((r) => (
              <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-slate-700">{r.operation}</span>
                  {r.detail && (
                    <span className="text-xs text-slate-400 ml-2">{r.detail}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-slate-900">{r.credits}</span>
                  <span className="text-xs text-slate-400 ml-3">
                    {formatRelativeTime(r.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
