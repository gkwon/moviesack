import Link from 'next/link'
import { Mail } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export default function CheckEmailPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm text-center space-y-6">
        <Mail className="w-12 h-12 text-primary mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent you a confirmation link. Click it to activate your account and start building your sack.
          </p>
        </div>
        <Link href="/auth/login" className={buttonVariants({ variant: 'outline' })}>
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
