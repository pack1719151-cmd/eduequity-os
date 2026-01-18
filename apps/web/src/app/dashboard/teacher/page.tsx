import { redirect } from 'next/navigation'
import { getCurrentUser, getUserRole } from '@/lib/auth'

export default async function TeacherDashboard() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== 'teacher') {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.full_name}!
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Classes Today</h3>
          <p className="text-3xl font-bold mt-2">4</p>
          <p className="text-sm text-muted-foreground">Scheduled</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Students</h3>
          <p className="text-3xl font-bold mt-2">120</p>
          <p className="text-sm text-muted-foreground">Across all classes</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Quizzes</h3>
          <p className="text-3xl font-bold mt-2">8</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Avg Attendance</h3>
          <p className="text-3xl font-bold mt-2">92%</p>
          <p className="text-sm text-muted-foreground">This week</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Today&apos;s Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Mathematics - Grade 10</p>
                <p className="text-sm text-muted-foreground">9:00 AM - 10:00 AM</p>
              </div>
              <p className="text-sm font-medium">Room 101</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Mathematics - Grade 11</p>
                <p className="text-sm text-muted-foreground">10:30 AM - 11:30 AM</p>
              </div>
              <p className="text-sm font-medium">Room 102</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Mathematics - Grade 9</p>
                <p className="text-sm text-muted-foreground">1:00 PM - 2:00 PM</p>
              </div>
              <p className="text-sm font-medium">Room 103</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Actions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <p className="font-medium">Grade Quiz submissions</p>
              <span className="text-sm text-muted-foreground">12 pending</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <p className="font-medium">Review attendance reports</p>
              <span className="text-sm text-muted-foreground">3 classes</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <p className="font-medium">Create new quiz</p>
              <span className="text-sm text-muted-foreground">Due: Friday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

