import {
  useCreditSummary,
  useCreditRecords,
  formatRelativeTime,
  getSourceLabel,
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
              <p className="text-sm text-slate-500 mb-1">30 天总消耗</p>
              <p className="text-3xl font-bold text-slate-900">{summary.total_credits}</p>
              <p className="text-xs text-slate-400 mt-1">credits</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">日均消耗</p>
              <p className="text-3xl font-bold text-blue-600">
                {Math.round(summary.daily_average)}
              </p>
            </div>
            {Object.entries(summary.by_source).map(([src, credits]) => (
              <div key={src} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">{getSourceLabel(src)}</p>
                <p className="text-3xl font-bold text-slate-900">{credits as number}</p>
              </div>
            ))}
          </div>

          {summary.by_operation && Object.keys(summary.by_operation).length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-8">
              <h3 className="font-semibold text-slate-900 mb-3">按操作分布</h3>
              <div className="space-y-2">
                {Object.entries(summary.by_operation).map(([op, credits]) => {
                  const pct = summary.total_credits
                    ? Math.round(((credits as number) / summary.total_credits) * 100)
                    : 0;
                  return (
                    <div key={op} className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 w-32">{op}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-500 w-20 text-right">
                        {credits as number} ({pct}%)
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
