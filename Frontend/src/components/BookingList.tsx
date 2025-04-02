"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/libs/getUserProfile';
import getBooking from '@/libs/getBooking';
import deleteBooking from '@/libs/deleteBooking';
import EditBooking from './EditBooking';

export default function BookingList() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingReservation, setEditingReservation] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (session?.user?.token) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    // Parallel API calls to improve performance
                    const [profileData, reservationsData] = await Promise.all([
                        getUserProfile(session.user.token),
                        getBooking(session.user.token)
                    ]);
                    
                    setProfile(profileData);
                    setReservations(reservationsData.data || []);
                } catch (err: any) {
                    console.error("Error fetching data:", err);
                    setError(err.message || "Failed to load your information");
                } finally {
                    setLoading(false);
                }
            };
            
            fetchData();
        }
    }, [session, status, router]);

    const handleDeleteBooking = async (reservationId: string) => {
        if (!session?.user?.token) return;
        
        if (window.confirm("Are you sure you want to delete this reservation?")) {
            try {
                setDeletingId(reservationId);
                await deleteBooking(reservationId, session.user.token);
                
                // Update the reservations list after successful deletion
                setReservations(prevReservations => 
                    prevReservations.filter(reservation => reservation._id !== reservationId)
                );
            } catch (err: any) {
                console.error("Error deleting reservation:", err);
                alert(err.message || "Failed to delete reservation");
            } finally {
                setDeletingId(null);
            }
        }
    };
    
    const handleEditReservation = (reservation: any) => {
        setEditingReservation(reservation);
        setIsEditModalOpen(true);
    };

    const handleReservationUpdated = async () => {
        if (session?.user?.token) {
            try {
                const reservationsData = await getBooking(session.user.token);
                setReservations(reservationsData.data || []);
            } catch (err) {
                console.error("Error updating reservations list:", err);
            }
        }
    };

    if (loading) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
                <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                <p className="text-white mt-4 text-lg">Loading your information...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
                <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700">{error}</p>
                    <button 
                        onClick={() => router.push("/")}
                        className="mt-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 text-white font-semibold shadow-lg"
                    >
                        Return to Home
                    </button>
                </div>
            </main>
        );
    }

    if (!profile || !profile.data) {
        return null;
    }

    const createdAt = new Date(profile.data.createdAt);
    
    return ( 
        <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Information */}
                    <div className="bg-white shadow-xl rounded-2xl p-8">
                        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Your Profile</h1>
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 shadow-md">
                            <div className="text-2xl font-semibold text-indigo-800 mb-4">{profile.data.name}</div>
                            <table className="w-full">
                                <tbody className="divide-y divide-indigo-200">
                                    <tr className="py-2">
                                        <td className="py-3 font-medium text-gray-700">Email: </td>
                                        <td className="py-3 text-indigo-700">{profile.data.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 font-medium text-gray-700">Role: </td>
                                        <td className="py-3 text-indigo-700">{profile.data.role}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 font-medium text-gray-700">Member Since: </td>
                                        <td className="py-3 text-indigo-700">{createdAt.toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 font-medium text-gray-700">Tel: </td>
                                        <td className="py-3 text-indigo-700">{profile.data.tel}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Reservations List */}
                    <div className="bg-white shadow-xl rounded-2xl p-8">
                        {
                            (session?.user.role === 'admin')? (
                                <h1 className="text-3xl font-bold text-indigo-900 mb-6">All Reservations</h1>
                             ) : (
                                <h1 className="text-3xl font-bold text-indigo-900 mb-6">Your Reservations</h1>
                             )
                        }
                        {reservations.length > 0 ? (
                            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 shadow-md">
                                <ul className="divide-y divide-indigo-200">
                                {reservations.map((reservation) => (
                                        <li key={reservation._id} className="py-4">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-indigo-800">{reservation.coWorking.name}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {reservation.coWorking.province}
                                                    </p>
                                                    {session?.user.role === 'admin' && reservation.user && (
                                                        <p className="text-xs font-medium text-indigo-600 mt-1">
                                                            Reserved by: {reservation.user.name || reservation.user.email}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center mt-2 md:mt-0">
                                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mr-3">
                                                        {new Date(reservation.reservDate).toLocaleDateString()}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleEditReservation(reservation)}
                                                        className="px-3 py-1 rounded-md bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white text-sm font-medium transition-all duration-300 mr-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteBooking(reservation._id)}
                                                        disabled={deletingId === reservation._id}
                                                        className={`px-3 py-1 rounded-md bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-medium transition-all duration-300 ${deletingId === reservation._id ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                    >
                                                        {deletingId === reservation._id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-gray-100 rounded-xl p-6 text-center">
                                <p className="text-gray-600">You don't have any reservations yet.</p>
                                <button 
                                    onClick={() => router.push("/booking")}
                                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                                >
                                    Make a Reservation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                    <button 
                        onClick={() => router.push("/")}
                        className="px-6 py-3 rounded-xl border border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-600 font-semibold transition-all"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
            
            {isEditModalOpen && editingReservation && session?.user?.token && (
                <EditBooking
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    reservation={editingReservation}
                    token={session.user.token}
                    onReservationUpdated={handleReservationUpdated}
                />
            )}
        </main>
    );
}