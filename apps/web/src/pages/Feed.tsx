import { useState } from 'react';
import {
  useContents,
  type Source,
  type ContentListItem,
  formatRelativeTime,
  truncateText,
  formatNumber,
  getSourceLabel,
  getSourceColor,
  getImportanceLabel,
} from '@infohunter/shared';

const SOURCES: { label: string; value: Source | undefined }[] = [
  { label: '全部', value: undefined },
  { label: 'Twitter', value: 'twitter' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Blog', value: 'blog' },
];

export function FeedPage() {
  const [source, setSource] = useState<Source | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useContents({ source, page, page_size: 20 });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0;

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">内容</h2>
        <div className="flex gap-2">
          {SOURCES.map((s) => (
            <button
              key={s.label}
              onClick={() => { setSource(s.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                source === s.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-400">加载中...</div>
      ) : !data?.items.length ? (
        <div className="text-center py-20 text-slate-400">暂无内容</div>
      ) : (
        <div className="space-y-3">
          {data.items.map((item) => (
            <ContentRow
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
          >
            上一页
          </button>
          <span className="text-sm text-slate-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}

function ContentRow({
  item,
  expanded,
  onToggle,
}: {
  item: ContentListItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  const analysis = item.ai_analysis;
  const importance = analysis?.importance as number | undefined;

  return (
    <div
      className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow transition-shadow cursor-pointer"
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: getSourceColor(item.source) + '18',
              color: getSourceColor(item.source),
            }}
          >
            {getSourceLabel(item.source)}
          </span>
          <span className="text-xs text-slate-400">
            {item.posted_at ? formatRelativeTime(item.posted_at) : ''}
          </span>
        </div>

        {item.title && (
          <h3 className="font-semibold text-slate-900 mb-1 leading-snug">{item.title}</h3>
        )}
        {item.content && (
          <p className="text-sm text-slate-600 leading-relaxed">
            {truncateText(item.content, expanded ? 2000 : 150)}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {item.author && <span>@{item.author}</span>}
            {item.metrics?.likes != null && <span>♥ {formatNumber(item.metrics.likes)}</span>}
            {item.metrics?.views != null && <span>▶ {formatNumber(item.metrics.views)}</span>}
          </div>
          {importance != null && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                importance >= 0.7
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-blue-50 text-blue-500'
              }`}
            >
              AI {Math.round(importance * 100)}
            </span>
          )}
        </div>
      </div>

      {expanded && analysis && (
        <div className="border-t border-slate-100 p-4 bg-slate-50 rounded-b-xl">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">AI 分析</h4>
          {analysis.summary && (
            <p className="text-sm text-slate-600 mb-3">{String(analysis.summary)}</p>
          )}
          {analysis.key_points && Array.isArray(analysis.key_points) && (
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-3">
              {(analysis.key_points as string[]).map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              查看原文 →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
