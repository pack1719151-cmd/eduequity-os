"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  GraduationCap,
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"

interface SidebarProps {
  userRole?: "student" | "teacher" | "principal" | null
  userName?: string
}

const studentLinks = [
  { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/student/attendance", label: "Attendance", icon: Calendar },
  { href: "/dashboard/student/quizzes", label: "Quizzes", icon: BookOpen },
  { href: "/dashboard/student/grades", label: "Grades", icon: BarChart3 },
]

const teacherLinks = [
  { href: "/dashboard/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/teacher/classes", label: "My Classes", icon: Users },
  { href: "/dashboard/teacher/quizzes", label: "Quizzes", icon: BookOpen },
  { href: "/dashboard/teacher/attendance", label: "Attendance", icon: Calendar },
  { href: "/dashboard/teacher/reports", label: "Reports", icon: BarChart3 },
]

const principalLinks = [
  { href: "/dashboard/principal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/principal/students", label: "Students", icon: Users },
  { href: "/dashboard/principal/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/dashboard/principal/approvals", label: "Approvals", icon: Shield },
  { href: "/dashboard/principal/reports", label: "Reports", icon: BarChart3 },
]

const bottomLinks = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
]

export function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const getLinks = () => {
    switch (userRole) {
      case "student":
        return studentLinks
      case "teacher":
        return teacherLinks
      case "principal":
        return principalLinks
      default:
        return studentLinks
    }
  }

  const links = getLinks()

  const NavLink = ({ item }: { item: typeof links[0] }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
    
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "scale-105")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="flex items-center gap-2">
              {item.label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  }

  const getRoleIcon = () => {
    switch (userRole) {
      case "student":
        return User
      case "teacher":
        return GraduationCap
      case "principal":
        return Shield
      default:
        return User
    }
  }

  const RoleIcon = getRoleIcon()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r transition-all duration-300",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">EduEquity</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {links.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="mt-6 border-t pt-4">
          <nav className="flex flex-col gap-1">
            {bottomLinks.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>
      </ScrollArea>

      {/* User Info */}
      <div className="border-t p-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <RoleIcon className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{userName || "User"}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">
                {userRole || "Guest"}
              </p>
            </div>
          )}
          {!collapsed && (
            <form action="/api/auth/logout" method="POST">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </aside>
  )
}

