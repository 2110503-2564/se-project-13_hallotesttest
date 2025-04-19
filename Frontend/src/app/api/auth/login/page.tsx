'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/',
    })
    if (res?.error) setError('Invalid credentials')
  }

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-200 via-purple-300 to-pink-400 w-full min-h-screen overflow-hidden items-center p-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-lg border border-gray-200 mt-10">
        <h1 className="mt-10 text-3xl font-extrabold mb-8 text-center text-indigo-900">
          Sign In
        </h1>
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-black"
              required
            />
          </div>
        </div>
        {error && (
          <div className="mt-4 text-red-600 font-medium">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-5 py-3 text-white text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Sign In
        </button>
      </form>
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