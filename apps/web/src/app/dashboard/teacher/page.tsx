import { redirect } from 'next/navigation'
import { getCurrentUser, getUserRole } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { TeacherDashboardClient } from './teacher-dashboard-client'

export default async function TeacherDashboard() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== 'teacher') {
    redirect('/login')
  }

  return (
    <DashboardLayout userRole={role} userName={user.full_name}>
      <TeacherDashboardClient userName={user.full_name} />
    </DashboardLayout>
  )
}

