import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchConfigs,
  updateConfig,
  useHealth,
  type SystemConfig,
} from '@infohunter/shared';

export function SettingsPage() {
  const { data: health } = useHealth();
  const { data: configs, isLoading } = useQuery({
    queryKey: ['configs'],
    queryFn: fetchConfigs,
  });

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">系统设置</h2>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-6">
        <h3 className="font-semibold text-slate-900 mb-3">系统状态</h3>
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              health?.status === 'ok' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-slate-700">
            后端: {health?.status === 'ok' ? '正常运行' : '未连接'}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-slate-400">加载中...</div>
      ) : configs && configs.length > 0 ? (
        <div className="space-y-3">
          {configs.map((cfg) => (
            <ConfigRow key={cfg.key} config={cfg} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400">暂无配置</div>
      )}
    </div>
  );
}

function ConfigRow({ config }: { config: SystemConfig }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(JSON.stringify(config.value, null, 2));
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      updateConfig(config.key, {
        value: JSON.parse(value),
        description: config.description ?? undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configs'] });
      setEditing(false);
    },
  });

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-sm font-medium text-slate-800">{config.key}</span>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs text-blue-600 hover:underline"
        >
          {editing ? '取消' : '编辑'}
        </button>
      </div>
      {config.description && (
        <p className="text-xs text-slate-400 mb-2">{config.description}</p>
      )}
      {editing ? (
        <div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full font-mono text-xs p-3 border border-slate-200 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? '保存中...' : '保存'}
          </button>
        </div>
      ) : (
        <pre className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 overflow-auto max-h-40">
          {JSON.stringify(config.value, null, 2)}
        </pre>
      )}
    </div>
  );
}
