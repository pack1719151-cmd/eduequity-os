"use client"

import { StatsCard } from '@/components/ui/stats-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AttendanceChart, QuizChart, ProgressChart } from '@/components/charts/dashboard-charts'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen, Award, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface StudentDashboardClientProps {
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
  { week: 'Week 1', progress: 65, target: 80 },
  { week: 'Week 2', progress: 72, target: 80 },
  { week: 'Week 3', progress: 78, target: 80 },
  { week: 'Week 4', progress: 85, target: 80 },
]

const recentActivity = [
  {
    id: 1,
    type: 'quiz',
    title: 'Mathematics Quiz',
    description: 'Completed with 85% score',
    time: '2 hours ago',
    status: 'success',
  },
  {
    id: 2,
    type: 'attendance',
    title: 'Science Class',
    description: 'Marked present',
    time: 'Yesterday',
    status: 'success',
  },
  {
    id: 3,
    type: 'assignment',
    title: 'English Essay',
    description: 'Submitted',
    time: '2 days ago',
    status: 'success',
  },
  {
    id: 4,
    type: 'warning',
    title: 'History Assignment',
    description: 'Due in 2 days',
    time: '3 days ago',
    status: 'warning',
  },
]

const upcomingClasses = [
  { id: 1, name: 'Mathematics', time: '9:00 AM', room: 'Room 101', status: 'upcoming' },
  { id: 2, name: 'Science', time: '10:30 AM', room: 'Lab 3', status: 'upcoming' },
  { id: 3, name: 'English', time: '1:00 PM', room: 'Room 204', status: 'upcoming' },
  { id: 4, name: 'History', time: '2:30 PM', room: 'Room 105', status: 'upcoming' },
]

export function StudentDashboardClient({ userName }: StudentDashboardClientProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {userName}! Here is your learning overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Attendance Rate"
          value="92%"
          description="This semester"
          icon={Calendar}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Quizzes Completed"
          value="12"
          description="Out of 15"
          icon={BookOpen}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Average Score"
          value="85%"
          description="Overall grade"
          icon={Award}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Study Hours"
          value="24h"
          description="This week"
          icon={Clock}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AttendanceChart data={attendanceData} />
        <QuizChart data={quizData} />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest academic activities</CardDescription>
              </div>
              <Link href="/dashboard/student/activity">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full ${
                      activity.status === 'success'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                  >
                    {activity.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today is Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today is Classes</CardTitle>
                <CardDescription>Your scheduled classes for today</CardDescription>
              </div>
              <Link href="/dashboard/student/schedule">
                <Button variant="ghost" size="sm" className="gap-1">
                  Full Schedule
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-4 p-3 rounded-lg border"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cls.room}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{cls.time}</p>
                    <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      Upcoming
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <ProgressChart data={progressData} title="Weekly Learning Progress" description="Your progress vs weekly targets" />
    </div>
  )
}

