"use client"
import DateReserve from "@/components/DateReserve"
import { FormControl, MenuItem, Select } from "@mui/material"
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import getUserProfile from '@/libs/getUserProfile';
import getcoworkings from '@/libs/getCoworkings';
import createBooking from '@/libs/createBooking';

export default function Booking() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [date, setDate] = useState<Dayjs|null>(null);
    const [coworkingId, setCoworkingId] = useState<string>('');
    const [coworkingSpaces, setCoworkingSpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
      const fetchData = async () => {
        if (session?.user?.token) {
          try {
            setLoading(true);
            
            const profileData = await getUserProfile(session.user.token);
            setUserProfile(profileData.data);
            
            
            const coworkingsData = await getcoworkings();
            if (coworkingsData && coworkingsData.data) {
                setCoworkingSpaces(coworkingsData.data);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load required data");
          } finally {
            setLoading(false);
          }
        }
      };
      
      if (session?.user?.token) {
        fetchData();
      }
    }, [session]);
    
    const makeBooking = async () => {
      if (!session?.user?.token) {
        window.alert("You must be logged in to make a booking");
        return;
      }
      
      setError(null);
      
      if (!date?.isValid()) {
        setError("Please select a valid date");
        return;
      }
      
      if (!coworkingId) {
        setError("Please select a coworking space");
        return;
      }
      
      try {
        setSubmitting(true);
        const bookingDate = date.toISOString();
        await createBooking(coworkingId, bookingDate, session.user.token);
        window.alert("Booking was successful!");
      } catch (err: any) {
        setError(err.message || "Failed to create booking");
      } finally {
        setSubmitting(false);
      }
    };
    
    if (status === "loading" || loading) {
      return (
        <div className="flex flex-col bg-gradient-to-br from-blue-200 via-purple-300 to-pink-400 w-full min-h-screen overflow-hidden items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          <p className="text-white mt-4 text-lg">Loading...</p>
        </div>
      );
    }
    
    return (
        <div className="flex flex-col bg-gradient-to-br from-blue-200 via-purple-300 p-8 to-pink-400 w-full min-h-screen overflow-hidden items-center">
        <FormControl variant="standard" className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-lg border border-gray-200 mt-10">
          <div className="mt-10 text-3xl font-extrabold mb-8 text-center text-indigo-900">
            New Reservation
          </div>
          
          {userProfile && (
            <div className="mb-6">
              <div className="text-xl text-indigo-900 ml-4 font-semibold">Your Information</div>
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mt-2 shadow-md">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="text-indigo-800">{userProfile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-indigo-800">{userProfile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Tel:</span>
                    <span className="text-indigo-800">{userProfile.tel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="text-xl text-indigo-900 ml-4 font-semibold">Co-Working Space</div>
            <div className="px-4 overflow-x-hidden">
              <Select
                variant="outlined"
                name="coworking"
                id="coworking"
                value={coworkingId}
                onChange={(e) => setCoworkingId(e.target.value)}
                className="h-full w-full bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden"
                displayEmpty
              >
                <MenuItem value="" disabled>Please select a Co-Working Space</MenuItem>
                {coworkingSpaces.map((space) => (
                  <MenuItem key={space.id} value={space.id}>
                    {space.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="text-xl text-indigo-900 ml-4 font-semibold">Booking Date</div>
            <div className="flex justify-center px-4">
              <DateReserve onDateChange={(value: Dayjs) => setDate(value)} />
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            onClick={makeBooking}
            disabled={submitting}
            className={`mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-5 py-3 text-white text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            name="Book coworking"
          >
            {submitting ? 'Processing...' : 'Book Your Co-Working Space'}
          </button>
        </FormControl>
        
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 w-full max-w-lg rounded-xl border border-indigo-300 bg-white hover:bg-indigo-50 hover:border-indigo-500 px-5 py-3 text-indigo-600 hover:text-indigo-700 text-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
        >
          Back to main page
        </button>
      </div>
    );
}