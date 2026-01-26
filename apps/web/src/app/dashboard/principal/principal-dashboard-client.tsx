"use client"

import { StatsCard } from '@/components/ui/stats-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AttendanceChart, QuizChart, ProgressChart, DistributionChart } from '@/components/charts/dashboard-charts'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  TrendingUp,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface PrincipalDashboardClientProps {
  userName: string
}

// Mock data for charts
const attendanceData = [
  { date: 'Mon', present: 1200, absent: 50, total: 1250 },
  { date: 'Tue', present: 1210, absent: 40, total: 1250 },
  { date: 'Wed', present: 1180, absent: 70, total: 1250 },
  { date: 'Thu', present: 1220, absent: 30, total: 1250 },
  { date: 'Fri', present: 1190, absent: 60, total: 1250 },
]

const quizData = [
  { quiz: 'Week 1', score: 78, maxScore: 100 },
  { quiz: 'Week 2', score: 82, maxScore: 100 },
  { quiz: 'Week 3', score: 79, maxScore: 100 },
  { quiz: 'Week 4', score: 85, maxScore: 100 },
]

const progressData = [
  { week: 'Week 1', progress: 78, target: 80 },
  { week: 'Week 2', progress: 82, target: 80 },
  { week: 'Week 3', progress: 79, target: 80 },
  { week: 'Week 4', progress: 85, target: 80 },
]

const gradeDistribution = [
  { name: 'A', value: 35, color: '#10b981' },
  { name: 'B', value: 40, color: '#3b82f6' },
  { name: 'C', value: 18, color: '#f59e0b' },
  { name: 'D', value: 7, color: '#ef4444' },
]

const pendingApprovals = [
  { id: 1, type: 'Course', title: 'Computer Science 101', submitter: 'John Smith', date: '2 days ago' },
  { id: 2, type: 'Leave', title: 'Staff Leave Request', submitter: 'Jane Doe', date: '1 day ago' },
  { id: 3, type: 'Budget', title: 'Science Dept - $5,000', submitter: 'Mike Johnson', date: '3 hours ago' },
]

const schoolMetrics = [
  { label: 'Attendance Rate', value: 94.2, target: 95, status: 'good' },
  { label: 'Quiz Completion', value: 87, target: 90, status: 'warning' },
  { label: 'Avg Grade', value: 82, target: 80, status: 'excellent' },
]

export function PrincipalDashboardClient({ userName }: PrincipalDashboardClientProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Principal Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {userName}! Here is your school overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value="1,250"
          description="+15 this month"
          icon={Users}
          trend={{ value: 1.2, isPositive: true }}
        />
        <StatsCard
          title="Teachers"
          value="45"
          description="Active staff"
          icon={GraduationCap}
        />
        <StatsCard
          title="Avg Attendance"
          value="94%"
          description="This week"
          icon={Calendar}
          trend={{ value: 2, isPositive: true }}
        />
        <StatsCard
          title="Pending Requests"
          value="8"
          description="Awaiting approval"
          icon={Clock}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AttendanceChart data={attendanceData} />
        <QuizChart data={quizData} />
        <DistributionChart 
          data={gradeDistribution} 
          title="Grade Distribution" 
          description="Overall class performance" 
        />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* School Metrics */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>School Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </div>
              <Link href="/dashboard/principal/reports">
                <Button variant="ghost" size="sm" className="gap-1">
                  Full Report
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schoolMetrics.map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {metric.value}% / {metric.target}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        metric.status === 'excellent'
                          ? 'bg-green-500'
                          : metric.status === 'good'
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Requests awaiting your review</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{approval.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {approval.submitter} • {approval.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      {approval.type}
                    </span>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <ProgressChart data={progressData} title="Academic Performance" description="Weekly academic trends across the school" />
    </div>
  )
}

