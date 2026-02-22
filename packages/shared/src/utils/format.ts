export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return '刚刚';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分钟前`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} 小时前`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} 天前`;
  return date.toLocaleDateString('zh-CN');
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}

export function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    twitter: 'Twitter',
    youtube: 'YouTube',
    blog: 'Blog/RSS',
  };
  return labels[source] ?? source;
}

export function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    twitter: '#1DA1F2',
    youtube: '#FF0000',
    blog: '#FF8C00',
  };
  return colors[source] ?? '#6B7280';
}

export function getImportanceLabel(score: number | null | undefined): string {
  if (score == null) return '未评分';
  if (score >= 0.8) return '重要';
  if (score >= 0.5) return '一般';
  return '低';
}
