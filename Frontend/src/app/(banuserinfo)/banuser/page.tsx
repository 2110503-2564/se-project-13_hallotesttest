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
  }, [session, status, currentPage]);

  const handleBanUser = async (userId: string) => {
    setSubmittingUserId(userId);
    setError(null);
    try {
      if (!session?.user?.token) {
        throw new Error("No token found in session");
      }
      await banUser(userId, session.user.token);
      await fetchData();
    } catch (err: any) {
      console.error("Error banning user:", err);
      setError(err.message || "Failed to ban user");
      alert(err.message || "Failed to ban user");
    } finally {
      setSubmittingUserId(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    setSubmittingUserId(userId);
    setError(null);
    try {
      if (!session?.user?.token) {
        throw new Error("No token found in session");
      }

      await unbanUser(userId, session.user.token);
      await fetchData();
    } catch (err: any) {
      console.error("Error unbanning user:", err);
      setError(err.message || "Failed to unban user");
      alert(err.message || "Failed to unban user");
    } finally {
      setSubmittingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-purple-50">
        <div className="text-purple-700 font-semibold">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-purple-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-purple-800 text-center">
        Manage Users
      </h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-purple-200">
          <thead>
            <tr className="bg-purple-100">
              <th className="py-2 px-4 border-b border-purple-200 text-purple-800 text-center">
                #
              </th>
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
                className="hover:bg-purple-50"
                onClick={(e) => {
                  router.push(`/banuser/${user._id}`);
                  e.stopPropagation();
                }}
              >
                <td className="py-2 px-4 border-b border-purple-200 text-center text-gray-700">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
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
                      disabled={
                        submittingUserId !== null &&
                        submittingUserId !== user._id
                      }
                      className={`bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded ${
                        submittingUserId !== user._id &&
                        submittingUserId !== null
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={(e) => {
                        handleBanUser(user._id);
                        e.stopPropagation();
                      }}
                    >
                      {submittingUserId === user._id ? "Banning..." : "Ban"}
                    </button>
                  ) : (
                    <button
                      disabled={
                        submittingUserId !== null &&
                        submittingUserId !== user._id
                      }
                      className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ${
                        submittingUserId !== user._id &&
                        submittingUserId !== null
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={(e) => {
                        handleUnbanUser(user._id);
                        e.stopPropagation();
                      }}
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
    </div>
  );
}
