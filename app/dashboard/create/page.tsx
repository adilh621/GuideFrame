'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface FormState {
  project_name: string
  product_url: string
  prompt: string
  goal: string
  audience: string
  duration_preference: string
}

export default function CreateDemoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({
    project_name: '',
    product_url: '',
    prompt: '',
    goal: '',
    audience: '',
    duration_preference: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const payload: Record<string, string | number> = {
        project_name: form.project_name,
        product_url: form.product_url,
        prompt: form.prompt,
      }
      if (form.goal.trim()) payload.goal = form.goal.trim()
      if (form.audience.trim()) payload.audience = form.audience.trim()
      if (form.duration_preference)
        payload.duration_preference = parseInt(form.duration_preference, 10)

      const res = await fetch('http://localhost:8000/api/v1/demos/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as { detail?: string }).detail ||
            'Failed to create demo. Please try again.'
        )
      }

      router.push('/dashboard?created=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Back to dashboard"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M11 14L6 9l5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <span className="text-sm text-gray-400">/</span>
          <span className="text-sm font-medium text-gray-700">New Demo</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Create a Demo</h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Describe your product and what you want to showcase. Guideframe will
            handle the rest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card: Core fields */}
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
            {/* Project Name */}
            <div className="px-6 py-5">
              <label
                htmlFor="project_name"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                id="project_name"
                name="project_name"
                type="text"
                required
                value={form.project_name}
                onChange={handleChange}
                placeholder="Acme Task Manager"
                className="w-full text-sm text-gray-900 placeholder-gray-400 bg-gray-50 rounded-lg px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            {/* Product URL */}
            <div className="px-6 py-5">
              <label
                htmlFor="product_url"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Product URL <span className="text-red-400">*</span>
              </label>
              <input
                id="product_url"
                name="product_url"
                type="url"
                required
                value={form.product_url}
                onChange={handleChange}
                placeholder="https://app.example.com"
                className="w-full text-sm text-gray-900 placeholder-gray-400 bg-gray-50 rounded-lg px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            {/* Prompt */}
            <div className="px-6 py-5">
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Prompt <span className="text-red-400">*</span>
              </label>
              <textarea
                id="prompt"
                name="prompt"
                required
                rows={4}
                value={form.prompt}
                onChange={handleChange}
                placeholder="Show how a user creates a task, assigns it to a teammate, and checks progress on the dashboard"
                className="w-full text-sm text-gray-900 placeholder-gray-400 bg-gray-50 rounded-lg px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none leading-relaxed"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Describe the user journey you want to demonstrate.
              </p>
            </div>
          </div>

          {/* Card: Optional fields */}
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
            <div className="px-6 pt-5 pb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Optional
              </p>
            </div>

            {/* Goal */}
            <div className="px-6 py-5">
              <label
                htmlFor="goal"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Goal
              </label>
              <input
                id="goal"
                name="goal"
                type="text"
                value={form.goal}
                onChange={handleChange}
                placeholder="Show value of real-time collaboration features"
                className="w-full text-sm text-gray-900 placeholder-gray-400 bg-gray-50 rounded-lg px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            {/* Audience */}
            <div className="px-6 py-5">
              <label
                htmlFor="audience"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Audience
              </label>
              <input
                id="audience"
                name="audience"
                type="text"
                value={form.audience}
                onChange={handleChange}
                placeholder="Potential customers"
                className="w-full text-sm text-gray-900 placeholder-gray-400 bg-gray-50 rounded-lg px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            {/* Duration */}
            <div className="px-6 py-5">
              <label
                htmlFor="duration_preference"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Duration Preference
                <span className="ml-1 text-xs font-normal text-gray-400">
                  (seconds)
                </span>
              </label>
              <input
                id="duration_preference"
                name="duration_preference"
                type="number"
                min="10"
                max="600"
                value={form.duration_preference}
                onChange={handleChange}
                placeholder="60"
                className="w-32 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 rounded-lg px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0 mt-0.5"
              >
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M8 5v3.5M8 11v.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between pt-1">
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="animate-spin"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeOpacity="0.25"
                    />
                    <path
                      d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Generating…
                </>
              ) : (
                'Generate Demo'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
