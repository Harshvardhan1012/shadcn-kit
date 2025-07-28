'use client'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { InputField } from '@/components/Form/Input' // your enhanced InputField
import { Button } from '@/components/ui/button' // assuming you have a Button component
import { MailIcon, LockIcon } from 'lucide-react' // or any icon lib you're using

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function inputTest() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'new values',
      password: '823889',
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    console.log('✅ Submitted:', values)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
        <InputField<LoginFormValues>
          name="email"
          label="Email"
          placeholder="you@example.com"
          control={form.control}
          icon={MailIcon}
          type="email"
          autoFocus
          required
          maxLength={100}
          description="We'll never share your email."
          onChangeCapture={(e) => {
            console.log('Email changed:', e.target.value)
          }}
          onBlur={() => {
            console.log('Email input blurred')
          }}
        />

        <InputField<LoginFormValues>
          name="password"
          label="Password"
          placeholder="••••••••"
          control={form.control}
          icon={LockIcon}
          type="password"
          required
          description="Use at least 6 characters."
        />

        <Button type="submit">Sign In</Button>
      </form>
    </FormProvider>
  )
}
