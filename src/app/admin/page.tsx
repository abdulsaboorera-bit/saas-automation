import { getAdminDashboardStats } from '@/lib/admin/dashboard';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return <AdminDashboardClient stats={stats} />;
}
