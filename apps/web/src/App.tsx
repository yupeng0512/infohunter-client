import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { DashboardPage } from './pages/Dashboard';
import { FeedPage } from './pages/Feed';
import { SubscriptionsPage } from './pages/Subscriptions';
import { CostsPage } from './pages/Costs';
import { SettingsPage } from './pages/Settings';

const navItems = [
  { to: '/', label: '概览', icon: '📊' },
  { to: '/feed', label: '内容', icon: '📰' },
  { to: '/subscriptions', label: '订阅', icon: '📋' },
  { to: '/costs', label: '成本', icon: '💰' },
  { to: '/settings', label: '设置', icon: '⚙️' },
];

export function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50">
        <aside className="w-56 bg-slate-900 text-white flex flex-col">
          <div className="px-5 py-6 border-b border-slate-700">
            <h1 className="text-lg font-bold tracking-tight">InfoHunter</h1>
            <p className="text-xs text-slate-400 mt-1">AI 信息监控系统</p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="px-5 py-4 border-t border-slate-700 text-xs text-slate-500">
            v0.1.0
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/costs" element={<CostsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
