"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// Helper function to show toast from anywhere
import { toast as showToast } from "sonner"

export { showToast as toast }

// Toast helper functions
export function showSuccess(message: string, description?: string) {
  showToast.success(message, {
    description,
  })
}

export function showError(message: string, description?: string) {
  showToast.error(message, {
    description,
  })
}

export function showInfo(message: string, description?: string) {
  showToast.info(message, {
    description,
  })
}

export function showWarning(message: string, description?: string) {
  showToast.warning(message, {
    description,
  })
}

export function showLoading(message: string) {
  return showToast.loading(message)
}

