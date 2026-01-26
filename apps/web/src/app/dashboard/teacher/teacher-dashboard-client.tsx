"use client"

import { StatsCard } from '@/components/ui/stats-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AttendanceChart, QuizChart, ProgressChart } from '@/components/charts/dashboard-charts'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface TeacherDashboardClientProps {
  userName: string
}

// Mock data for charts
const attendanceData = [
  { date: 'Mon', present: 45, absent: 5, total: 50 },
  { date: 'Tue', present: 48, absent: 2, total: 50 },
  { date: 'Wed', present: 47, absent: 3, total: 50 },
  { date: 'Thu', present: 46, absent: 4, total: 50 },
  { date: 'Fri', present: 44, absent: 6, total: 50 },
]

const quizData = [
  { quiz: 'Math Quiz 1', score: 85, maxScore: 100 },
  { quiz: 'Science Quiz', score: 78, maxScore: 100 },
  { quiz: 'History Quiz', score: 92, maxScore: 100 },
  { quiz: 'English Quiz', score: 88, maxScore: 100 },
]

const progressData = [
  { week: 'Week 1', progress: 85, target: 80 },
  { week: 'Week 2', progress: 78, target: 80 },
  { week: 'Week 3', progress: 92, target: 80 },
  { week: 'Week 4', progress: 88, target: 80 },
]

const todaySchedule = [
  { id: 1, name: 'Mathematics - Grade 10', time: '9:00 AM - 10:00 AM', room: 'Room 101' },
  { id: 2, name: 'Mathematics - Grade 11', time: '10:30 AM - 11:30 AM', room: 'Room 102' },
  { id: 3, name: 'Mathematics - Grade 9', time: '1:00 PM - 2:00 PM', room: 'Room 103' },
]

const pendingActions = [
  { id: 1, title: 'Grade Quiz submissions', count: 12, priority: 'high' },
  { id: 2, title: 'Review attendance reports', count: 3, priority: 'medium' },
  { id: 3, title: 'Create new quiz', count: 1, priority: 'low' },
]

export function TeacherDashboardClient({ userName }: TeacherDashboardClientProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {userName}! Here is your teaching overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Classes Today"
          value="4"
          description="Scheduled"
          icon={Calendar}
        />
        <StatsCard
          title="Total Students"
          value="120"
          description="Across all classes"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Active Quizzes"
          value="8"
          description="Currently running"
          icon={BookOpen}
        />
        <StatsCard
          title="Avg Attendance"
          value="92%"
          description="This week"
          icon={Clock}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AttendanceChart data={attendanceData} />
        <QuizChart data={quizData} />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today is Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today is Schedule</CardTitle>
                <CardDescription>Your classes for today</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Class
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cls.time} • {cls.room}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>Tasks requiring your attention</CardDescription>
              </div>
              <Link href="/dashboard/teacher/tasks">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        action.priority === 'high'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          : action.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {action.priority === 'high' ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <p className="font-medium">{action.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {action.count} pending
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
      <ProgressChart data={progressData} title="Class Performance" description="Quiz scores across your classes" />
    </div>
  )
}

