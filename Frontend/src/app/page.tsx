'use client'
import Banner from '@/components/Banner'
import Link from "next/link";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [showBanPopup, setShowBanPopup] = useState(false);
  
  useEffect(() => {
    if (
      session?.user.msg === "Yor are banned" &&
      status === "authenticated" &&
      !sessionStorage.getItem("banPopupShown")
    ) {
      setShowBanPopup(true);
      sessionStorage.setItem("banPopupShown", "true");
    }
  }, [session, status]);


  return (
    <main className='min-h-screen'>
      <Banner />
      {/* Ban Popup */}
      {showBanPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border-4 border-red-200 relative animate-bounce-in">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 rounded-full p-4 mb-4 shadow">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-red-700">Account Banned</h2>
              <p className="mb-6 text-gray-700">Your account has been banned.<br />Please contact support for more information.</p>
              <button
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold shadow hover:from-red-600 hover:to-pink-600 transition"
                onClick={() => setShowBanPopup(false)}
              >
                Close
              </button>
            </div>
            <span className="absolute top-2 right-4 text-red-400 text-2xl font-bold animate-pulse">!</span>
          </div>
          <style jsx>{`
            @keyframes bounce-in {
              0% { transform: scale(0.8); opacity: 0; }
              60% { transform: scale(1.05); opacity: 1; }
              100% { transform: scale(1); }
            }
            .animate-bounce-in {
              animation: bounce-in 0.5s;
            }
          `}</style>
        </div>
      )}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">Why Choose Our Co-Working Spaces</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Prime Locations</h3>
              <p className="text-gray-600">Strategically located spaces in the heart of business districts for maximum convenience.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Flexible Hours</h3>
              <p className="text-gray-600">24/7 access to accommodate your work schedule and maximize productivity.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Events</h3>
              <p className="text-gray-600">Regular networking events and workshops to help you grow your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Book Your Perfect Space?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">Find the ideal workspace for your needs, whether it's a quiet desk, a collaborative area, or a professional meeting room.</p>
          <Link href="/booking" className="inline-block px-8 py-4 bg-white text-indigo-900 rounded-md font-semibold hover:bg-indigo-50 transition-colors duration-300 transform hover:scale-105">
            Book Now
          </Link>
        </div>
      </section>
    </main>
  )
}
