import { redirect } from 'next/navigation'
import { getCurrentUser, getUserRole } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PrincipalDashboardClient } from './principal-dashboard-client'

export default async function PrincipalDashboard() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== 'principal') {
    redirect('/login')
  }

  return (
    <DashboardLayout userRole={role} userName={user.full_name}>
      <PrincipalDashboardClient userName={user.full_name} />
    </DashboardLayout>
  )
}

