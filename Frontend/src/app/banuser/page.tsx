// BanUserPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import getUsers from "@/libs/getUsers";
import getBannedUsers from "@/libs/getBannedUsers";
import { banUser, unbanUser } from "@/libs/banUser"; // Import both functions

// Define a type for user object to ensure type safety
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
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!session?.user?.token) {
        throw new Error("No token found in session");
      }

      const usersResponse = await getUsers(session.user.token);
      const bannedUsersResponse = await getBannedUsers(session.user.token);

      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);

      // Extract banned user IDs properly
      setBannedUserIds(
        Array.isArray(bannedUsersResponse.data)
          ? bannedUsersResponse.data.map(
              (entry: { user: { _id: any } }) => entry.user._id
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
  }, [session, status, router]);

  const handleBanUser = async (userId: string) => {
    setSubmitting(true);
    setError(null);
    try {
      if (!session?.user?.token) {
        throw new Error("No token found in session");
      }

      await banUser(userId, session.user.token);
      await fetchData(); // Re-fetch user list to update UI
    } catch (err: any) {
      console.error("Error banning user:", err);
      setError(err.message || "Failed to ban user");
      alert(err.message || "Failed to ban user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    setSubmitting(true);
    setError(null);
    try {
      if (!session?.user?.token) {
        throw new Error("No token found in session");
      }

      await unbanUser(userId, session.user.token);
      await fetchData(); // Re-fetch user list to update UI
    } catch (err: any) {
      console.error("Error unbanning user:", err);
      setError(err.message || "Failed to unban user");
      alert(err.message || "Failed to unban user");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="shadow appearance-none border border-purple-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-purple-200">
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
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-purple-50">
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
                      disabled={submitting}
                      className={`bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded ${
                        submitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleBanUser(user._id)}
                    >
                      {submitting ? "Banning..." : "Ban"}
                    </button>
                  ) : (
                    <button
                      disabled={submitting}
                      className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ${
                        submitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleUnbanUser(user._id)}
                    >
                      {submitting ? "Unbanning..." : "Unban"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
