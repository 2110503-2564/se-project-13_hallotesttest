'use client'

export default function ErrorPage() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-200 via-purple-300 to-pink-400 w-full min-h-screen overflow-hidden items-center p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-lg border border-gray-200 mt-32 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-900">
          Sign In Error
        </h1>
        <div className="text-red-600 font-semibold text-lg mb-8 text-center">
          Email or password is invalid
        </div>
        <button
          type="button"
          onClick={() => window.location.href = '/api/auth/login'}
          className="w-full rounded-xl border border-indigo-300 bg-white hover:bg-indigo-50 hover:border-indigo-500 px-5 py-3 text-indigo-600 text-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}