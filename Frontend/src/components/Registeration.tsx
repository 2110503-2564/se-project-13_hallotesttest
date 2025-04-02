"use client"
import userRegister from "@/libs/userRegister";
import { Button, FormControl, TextField } from "@mui/material";
import router, { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const tel = formData.get("tel") as string;
    const password = formData.get("password") as string;

    try {
      await userRegister(name, email, tel, password);
      window.alert("Registration successful! Please sign in.");
      router.push("/api/auth/signin");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-300 to-pink-400">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          <h2 className="mt-4 text-xl font-semibold text-indigo-900">
            Creating User
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-200 via-purple-300 to-pink-400 w-full min-h-screen overflow-hidden items-center p-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-lg border border-gray-200 mt-10">
        <h1 className="mt-10 text-3xl font-extrabold mb-8 text-center text-indigo-900">
          Register
        </h1>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              placeholder="Enter your name" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
              Telephone
            </label>
            <input 
              type="tel" 
              name="tel" 
              id="tel" 
              placeholder="Enter your Telephone number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password (At least 6 characters)
            </label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              placeholder="Enter your password"
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
          Register
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