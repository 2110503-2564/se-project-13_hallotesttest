'use client'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

export default function SignOutPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignOut = async () => {
    setLoading(true)
    setError('')
    try {
      await signOut({ callbackUrl: '/' })
      sessionStorage.removeItem("banPopupShown");
    } catch (err: any) {
      setError('Sign out failed')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-200 via-purple-300 to-pink-400 w-full min-h-screen overflow-hidden items-center p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-lg border border-gray-200 mt-10 flex flex-col items-center">
        <h1 className="mt-10 text-3xl font-extrabold mb-8 text-center text-indigo-900">
          Sign Out
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Are you sure you want to sign out?
        </p>
        {error && (
          <div className="mt-4 text-red-600 font-medium">
            {error}
          </div>
        )}
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-5 py-3 text-white text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-60"
        >
          {loading ? 'Signing Out...' : 'Sign Out'}
        </button>
      </div>
      <div className="w-full max-w-lg">
        <button
          type="button"
          onClick={() => window.location.href = '/'}
          className="mt-6 w-full rounded-xl border border-indigo-300 bg-white hover:bg-indigo-50 hover:border-indigo-500 px-5 py-3 text-indigo-600 text-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
        >
          Back to Main Page
        </button>
      </div>
    </div>
  )
}