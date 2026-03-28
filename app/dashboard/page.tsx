import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from './SignOutButton'
import SuccessBanner from './SuccessBanner'

type DemoStatus = 'pending' | 'planning' | 'running' | 'completed' | 'failed'

interface Demo {
  id: string
  project_name: string
  prompt: string
  status: DemoStatus
  created_at: string
}

const statusConfig: Record<DemoStatus, { label: string; classes: string }> = {
  pending: { label: 'Pending', classes: 'bg-gray-100 text-gray-500' },
  planning: { label: 'Planning', classes: 'bg-blue-100 text-blue-700' },
  running: { label: 'Running', classes: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Completed', classes: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', classes: 'bg-red-100 text-red-600' },
}

async function fetchDemos(): Promise<Demo[]> {
  try {
    const res = await fetch('http://localhost:8000/api/v1/demos', {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const params = await searchParams
  const justCreated = params.created === 'true'

  // Mock empty array until backend endpoint is ready
  const demos: Demo[] = []
  // Uncomment to fetch from backend:
  // const demos = await fetchDemos()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-900 tracking-tight">Guideframe</span>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {justCreated && (
          <SuccessBanner message="Your demo is being generated! It will appear here once ready." />
        )}

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Demos</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage your product demos</p>
          </div>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Demo
          </Link>
        </div>

        {demos.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-gray-400">
                <rect x="1" y="2" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 20h8M11 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">No demos yet</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
              Create your first product demo. Guideframe will generate a guided walkthrough from your URL and prompt.
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Create your first demo
            </Link>
          </div>
        ) : (
          /* Demo grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {demos.map((demo) => {
              const status = statusConfig[demo.status] ?? statusConfig.pending
              return (
                <div
                  key={demo.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all cursor-default"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{demo.project_name}</h3>
                    <span
                      className={`shrink-0 inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${status.classes}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{demo.prompt}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(demo.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
