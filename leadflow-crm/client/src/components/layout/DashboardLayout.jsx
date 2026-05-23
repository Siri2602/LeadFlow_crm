import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#0d1117]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
