import { LucideIcon, QrCode, FileQuestion, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        {Icon && (
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="mt-2">{description}</CardDescription>
        )}
      </CardHeader>
      {action && (
        <CardFooter className="justify-center">
          <Button onClick={action.onClick}>{action.label}</Button>
        </CardFooter>
      )}
    </Card>
  )
}

// Specific empty states for common scenarios
export function EmptyAttendanceState({ onGenerateQR }: { onGenerateQR?: () => void }) {
  return (
    <EmptyState
      title="No attendance sessions"
      description="You haven't created any attendance sessions yet. Generate a QR code to start tracking attendance."
      icon={QrCode}
      action={onGenerateQR ? { label: "Generate QR Code", onClick: onGenerateQR } : undefined}
    />
  )
}

export function EmptyQuizzesState({ onCreateQuiz }: { onCreateQuiz?: () => void }) {
  return (
    <EmptyState
      title="No quizzes yet"
      description="Create your first quiz to get started with assessing student knowledge."
      icon={FileQuestion}
      action={onCreateQuiz ? { label: "Create Quiz", onClick: onCreateQuiz } : undefined}
    />
  )
}

export function EmptyActivityState() {
  return (
    <EmptyState
      title="No recent activity"
      description="Your recent activities will appear here. Start by attending classes or taking quizzes."
      icon={Clock}
    />
  )
}

export function EmptyStudentsState({ onAddStudent }: { onAddStudent?: () => void }) {
  return (
    <EmptyState
      title="No students enrolled"
      description="Students will appear here once they enroll in your classes."
      icon={Users}
      action={onAddStudent ? { label: "Add Student", onClick: onAddStudent } : undefined}
    />
  )
}

