import * as React from "react"
import { ControllerRenderProps, FieldPath, FieldValues, FormProvider, UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

interface FormProps<TFieldValues extends FieldValues> extends React.ComponentPropsWithoutRef<"form"> {
  form: UseFormReturn<TFieldValues>
}

function Form<TFieldValues extends FieldValues>({ form, children, className, ...props }: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form className={className} {...props}>
        {children}
      </form>
    </FormProvider>
  )
}

interface FormFieldContextValue<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue<FieldValues, string> | null>(null)

interface FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  name: TName
  render: (props: { field: ControllerRenderProps<TFieldValues, TName> }) => React.ReactElement
}

function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({ name, render }: FormFieldProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name } as FormFieldContextValue<FieldValues, string>}>
      {render({ field: {} as ControllerRenderProps<TFieldValues, TName> })}
    </FormFieldContext.Provider>
  )
}

function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />
}

function FormLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn(className)} {...props} />
}

function FormControl({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />
}

function FormDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

function FormMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {children}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
}

export type { FormFieldProps }

