import { redirect } from 'next/navigation'
import { getCurrentUser, getUserRole } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StudentDashboardClient } from './student-dashboard-client'
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton'

export default async function StudentDashboard() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== 'student') {
    redirect('/login')
  }

  return (
    <DashboardLayout userRole={role} userName={user.full_name}>
      <StudentDashboardClient userName={user.full_name} />
    </DashboardLayout>
  )
}

