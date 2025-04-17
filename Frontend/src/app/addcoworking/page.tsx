"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import createCoworkingSpace from "@/libs/createCoworking";

export default function AddCoworking() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    // Redirect non-admins to sign in
    useEffect(() => {
      if (status === "loading") return;
      if (!session || session.user.role !== "admin") {
        router.push("/api/auth/signin");
      }
    }, [session, status, router]);
  
    const [form, setForm] = useState<CoworkingItem>({
      _id : "",
      name: "",
      address: "",
      district: "",
      province: "",
      postalcode: "",
      tel: "",
      picture: "",
      time:"",
      __v: 0,
      id: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setLoading(true);
  
      try {
        if (session?.user.token) {
          console.log(form);
          await createCoworkingSpace(form, session.user.token);
        } else {
          throw new Error("User token is missing");
        }
        window.alert("Co‑Working Space created successfully!");
        router.push("/coworking");
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-200 via-purple-300 to-pink-400 w-full min-h-screen overflow-hidden items-center p-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-lg border border-gray-200 mt-10">
        <h1 className="mt-10 text-3xl font-extrabold mb-8 text-center text-indigo-900">
          Create Co‑Working Space
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              placeholder="Enter name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input 
              type="text" 
              name="address" 
              id="address" 
              placeholder="Enter address"
              value={form.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
            />
          </div>
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">
              District
            </label>
            <input 
              type="text" 
              name="district" 
              id="district" 
              placeholder="Enter district"
              value={form.district}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
            />
          </div>
          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700">
              Province
            </label>
            <input 
              type="text" 
              name="province" 
              id="province" 
              placeholder="Enter province"
              value={form.province}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
            />
          </div>
          <div>
            <label htmlFor="postalcode" className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input 
              type="text" 
              name="postalcode" 
              id="postalcode" 
              placeholder="Enter postal code"
              value={form.postalcode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
            />
          </div>
          <div>
            <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
              Telephone Number
            </label>
            <input 
              type="text" 
              name="tel" 
              id="tel" 
              placeholder="Enter telephone number"
              value={form.tel}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
            />
          </div>
          <div>
            <label htmlFor="picture" className="block text-sm font-medium text-gray-700">
              Picture URL
            </label>
            <input 
              type="text" 
              name="picture" 
              id="picture" 
              placeholder="Enter picture URL"
              value={form.picture}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Available Time
            </label>
            <input 
              type="text" 
              name="time" 
              id="time" 
              placeholder="Enter available time (e.g. 09.00 - 18.00)"
              value={form.time}
              onChange={handleChange}
              pattern="[0-9]{2}\.[0-9]{2} - [0-9]{2}\.[0-9]{2}"
              title="Format: 09.00 - 18.00"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
            />
          </div>
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-5 py-3 text-white text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          {loading ? "Submitting..." : "Create Co‑Working Space"}
        </button>
      </form>
      <button 
        onClick={() => router.push("/")}
        className="mt-6 w-full max-w-lg rounded-xl border border-indigo-300 bg-white hover:bg-indigo-50 hover:border-indigo-500 px-5 py-3 text-indigo-600 text-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
      >
        Back to Main Page
      </button>
    </div>
  );
}