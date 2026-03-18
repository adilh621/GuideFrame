import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from './SignOutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Signed in as {user.email}</p>
        <SignOutButton />
      </div>
    </div>
  )
}
