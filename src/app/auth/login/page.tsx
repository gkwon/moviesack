'use client'

import Link from 'next/link'
import { Film } from 'lucide-react'
import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { login } from '@/app/auth/actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null)

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Film className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your Moviesack account</p>
        </div>

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" type="email" name="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input id="password" type="password" name="password" placeholder="••••••••" required />
          </div>

          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          No account?{' '}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
