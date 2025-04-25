'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import getBannedUser from "@/libs/getBannedUser";
import BanPopup from "@/components/BanPopup";
import dayjs from 'dayjs';

export default function BanUserIDPage({ params }: { params: { bid: string } }) {
    const { data: session, status } = useSession();
    const [banDetail, setBanDetail] = useState<BannedUser | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showBanPopup, setShowBanPopup] = useState(false);

    const handleClosePopup = () => {
        setShowBanPopup(false);
    };

    useEffect(() => {
        const fetchBannedUserDetail = async () => {
            if (!session?.user?.token) return;
            try {
                const userBannedDetail = await getBannedUser(
                    session.user.token,
                    params.bid
                );
                setBanDetail(userBannedDetail.data);
            } catch (err: any) {
                console.error("Error fetching banned user:", err);
                setError(err.message || "Failed to fetch banned user details.");
            }
        };
        if (status === "authenticated") {
            fetchBannedUserDetail();
        }
    }, []);

    const handleClick = () => {
        setShowBanPopup(true);
    };

    return (
        <main>
            <div className="bg-purple-50 min-h-screen py-12 px-4 sm:px-6">
                {error && <div className="text-red-500">{error}</div>}
                {!banDetail ? (
                    <div className="flex justify-center items-center w-full py-12">
                        <div className="text-purple-700 font-semibold text-center">Loading details...</div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl text-purple-800 mb-4">Banned User Details</div>
                            <div className="space-y-3">
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="font-semibold w-32 text-gray-600">Ban ID:</span>
                                    <span className="text-gray-800">{banDetail._id}</span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="font-semibold w-32 text-gray-600">User ID:</span>
                                    <span className="text-gray-800">{banDetail.user._id}</span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="font-semibold w-32 text-gray-600">Username:</span>
                                    <span className="text-gray-800">{banDetail.user.name}</span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="font-semibold w-32 text-gray-600">Email:</span>
                                    <span className="text-gray-800">{banDetail.user.email}</span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="font-semibold w-32 text-gray-600">Ban Reason:</span>
                                    <span className="text-gray-800">{banDetail.reason}</span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="font-semibold w-32 text-gray-600">Ban Date:</span>
                                    <span className="text-gray-800">
                                        {banDetail.createdAt 
                                            ? dayjs(banDetail.createdAt).format('DD MMM YYYY, HH:mm') 
                                            : 'No Ban Date'}
                                    </span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="font-semibold w-32 text-gray-600">Unban Date:</span>
                                    <span className="text-gray-800">
                                        {banDetail.unbanDate 
                                            ? dayjs(banDetail.unbanDate).format('DD MMM YYYY, HH:mm') 
                                            : 'No unban date set'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button 
                                    onClick={handleClick}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                >
                                    Update Ban Detail
                                </button>
                                {
                                    showBanPopup && (
                                        <BanPopup
                                            prevMsg={banDetail.reason}
                                            prevDate={banDetail.unbanDate}
                                            uid={banDetail.user._id}
                                            onClose={handleClosePopup}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
