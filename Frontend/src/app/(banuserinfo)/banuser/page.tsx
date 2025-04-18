"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import getUsers from "@/libs/getUsers";
import getBannedUsers from "@/libs/getBannedUsers";
import { banUser, unbanUser } from "@/libs/banUser";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  tel: string;
}
import BanPopup from "@/components/BanPopup";
import UnbanPopup from "@/components/UnbanPopup";
import { set } from "mongoose";

// Define a type for user object to ensure type safety

export default function BanUserPage() {

  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [bannedUserIds, setBannedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingUserId, setSubmittingUserId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [showBanPopup, setShowBanPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showUnbanPopup, setShowUnbanPopup] = useState(false);

  const handleBanClick = (uid:string) => {
    setSubmittingUserId(uid);
    setSelectedUser(uid);
    setShowBanPopup(true);
  };

  const handleUnbanClick = (uid:string) => {
    setSubmittingUserId(uid);
    setSelectedUser(uid);
    setShowUnbanPopup(true);
  };

  const handleClosePopup = () => {
    setSubmittingUserId(null);
    setShowBanPopup(false);
    setShowUnbanPopup(false);
    setSelectedUser(null);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!session?.user?.token) {
        throw new Error("No token found in session");
      }

      const usersResponse = await getUsers(
        session.user.token,
        currentPage,
        itemsPerPage
      );
      const bannedUsersResponse = await getBannedUsers(session.user.token);

      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
      setTotalPages(usersResponse.totalPages || 1);

      setBannedUserIds(
        Array.isArray(bannedUsersResponse.data)
          ? bannedUsersResponse.data.map(
              (entry: { user: { _id: string } }) => entry.user._id
            )
          : []
      );
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data");
    
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchData();
  }, [status, currentPage]);

  // const handleBanUser = async (userId: string) => {
  //   setSubmittingUserId(userId);
  //   setError(null);
  //   try {
  //     if (!session?.user?.token) {
  //       throw new Error("No token found in session");
  //     }
  //     await banUser(userId, session.user.token);
  //     await fetchData(); // Re-fetch user list to update UI
  //   } catch (err: any) {
  //     console.error("Error banning user:", err);
  //     setError(err.message || "Failed to ban user");
  //     alert(err.message || "Failed to ban user");
  //   } finally {
  //     setSubmittingUserId(null);
  //   }
  // };

  // const handleUnbanUser = async (userId: string) => {
  //   setSubmittingUserId(userId);
  //   setError(null);
  //   try {
  //     if (!session?.user?.token) {
  //       throw new Error("No token found in session");
  //     }

  //     await unbanUser(userId, session.user.token);
  //     await fetchData();
  //   } catch (err: any) {
  //     console.error("Error unbanning user:", err);
  //     setError(err.message || "Failed to unban user");
  //     alert(err.message || "Failed to unban user");
  //   } finally {
  //     setSubmittingUserId(null);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-purple-50 w-full h-screen">
        <div className="text-purple-700 font-semibold">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-purple-50 min-h-screen w-full p-8 mx-auto flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-purple-800 text-center">
        Manage Users
      </h1>
      <div className="shadow-lg rounded-lg w-full max-w-7xl rounded-lg overflow-hidden">
      <table className="w-full bg-white border border-purple-200 rounded-lg shadow-lg">
        <thead>
        <tr className="bg-purple-100">
          <th className="py-2 px-4 border-b border-purple-200 text-purple-800 text-center">
          Name
          </th>
          <th className="py-2 px-4 border-b border-purple-200 text-purple-800 text-center">
          Email
          </th>
          <th className="py-2 px-4 border-b border-purple-200 text-purple-800 text-center">
          Role
          </th>
          <th className="py-2 px-4 border-b border-purple-200 text-purple-800 text-center">
          Status
          </th>
          <th className="py-2 px-4 border-b border-purple-200 text-purple-800 text-center">
          Actions
          </th>
        </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
          <tr
            key={user._id}
            className={`${bannedUserIds.includes(user._id) ? "bg-red-50 hover:bg-red-100" : ""}`}
            onClick={(e) => {
              if(!bannedUserIds.includes(user._id)) return;
              router.push(`/banuser/${user._id}`);
            }}
          >
          
          <td className="py-2 px-4 border-b border-purple-200 text-black text-center">
            {user.name}
          </td>
          <td className="py-2 px-4 border-b border-purple-200 text-black text-center">
            {user.email}
          </td>
          <td className="py-2 px-4 border-b border-purple-200 text-black text-center">
            {user.role}
          </td>
          <td className="py-2 px-4 border-b border-purple-200 text-center">
            {bannedUserIds.includes(user._id) ? (
            <span className="text-red-600 font-medium">Banned</span>
            ) : (
            <span className="text-green-600 font-medium">Active</span>
            )}
          </td>
          <td className="py-2 px-4 border-b border-purple-200 text-center">
            {!bannedUserIds.includes(user._id) ? (
            <button
              className={`bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-6 rounded ${
              submittingUserId === user._id ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={(e) => {handleBanClick(user._id); e.stopPropagation();}}
            >
              {submittingUserId === user._id ? "Banning..." : "Ban"}
            </button>
            ) : (
            <button
              className={`bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded ${
              submittingUserId === user._id ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={(e) => {handleUnbanClick(user._id); e.stopPropagation();}}
            >
              {submittingUserId === user._id ? "Unbanning..." : "Unban"}
            </button>
            )}
          </td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          className="px-4 py-2 bg-purple-300 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span className="px-4 py-2 text-purple-800 font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {showBanPopup && selectedUser && (
        <BanPopup uid={selectedUser} onClose={handleClosePopup}  />
      )}
      {showUnbanPopup && selectedUser && (
        <UnbanPopup uid={selectedUser} onClose={handleClosePopup} />
      )}
    </div>
  );
}
