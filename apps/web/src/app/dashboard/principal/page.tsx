import { redirect } from 'next/navigation'
import { getCurrentUser, getUserRole } from '@/lib/auth'

export default async function PrincipalDashboard() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== 'principal') {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Principal Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.full_name}!
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Total Students</h3>
          <p className="text-3xl font-bold mt-2">1,250</p>
          <p className="text-sm text-muted-foreground">+15 this month</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Teachers</h3>
          <p className="text-3xl font-bold mt-2">45</p>
          <p className="text-sm text-muted-foreground">Active staff</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Avg Attendance</h3>
          <p className="text-3xl font-bold mt-2">94%</p>
          <p className="text-sm text-muted-foreground">This week</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Pending Requests</h3>
          <p className="text-3xl font-bold mt-2">8</p>
          <p className="text-sm text-muted-foreground">Awaiting approval</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">School Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Attendance Rate</p>
                <p className="text-sm text-muted-foreground">94.2% average</p>
              </div>
              <div className="h-2 w-24 bg-green-500 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Quiz Completion</p>
                <p className="text-sm text-muted-foreground">87% completion rate</p>
              </div>
              <div className="h-2 w-24 bg-blue-500 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Student Performance</p>
                <p className="text-sm text-muted-foreground">B+ average grade</p>
              </div>
              <div className="h-2 w-24 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">New Course Request</p>
                <p className="text-sm text-muted-foreground">Computer Science 101</p>
              </div>
              <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded">Review</button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Staff Leave Request</p>
                <p className="text-sm text-muted-foreground">John Smith - 3 days</p>
              </div>
              <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded">Review</button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Budget Allocation</p>
                <p className="text-sm text-muted-foreground">Science Dept - $5,000</p>
              </div>
              <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded">Review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

