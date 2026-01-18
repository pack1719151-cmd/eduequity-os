import { redirect } from 'next/navigation'
import { getCurrentUser, getUserRole } from '@/lib/auth'

export default async function StudentDashboard() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== 'student') {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.full_name}!
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Attendance</h3>
          <p className="text-3xl font-bold mt-2">85%</p>
          <p className="text-sm text-muted-foreground">This semester</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Quizzes</h3>
          <p className="text-3xl font-bold mt-2">12</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Assignments</h3>
          <p className="text-3xl font-bold mt-2">5</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Avg Score</h3>
          <p className="text-3xl font-bold mt-2">78%</p>
          <p className="text-sm text-muted-foreground">Overall</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">Mathematics Quiz</p>
              <p className="text-sm text-muted-foreground">Completed with 85% score</p>
            </div>
            <p className="text-sm text-muted-foreground">2 hours ago</p>
          </div>
          
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">Science Attendance</p>
              <p className="text-sm text-muted-foreground">Marked present</p>
            </div>
            <p className="text-sm text-muted-foreground">Yesterday</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">English Assignment</p>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
            <p className="text-sm text-muted-foreground">2 days ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}

