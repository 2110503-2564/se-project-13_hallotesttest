"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import getUsers from "@/libs/getUsers";
import getBannedUsers from "@/libs/getBannedUsers";

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
import dayjs from "dayjs";
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
  const [bannedUserMap, setBannedUserMap] = useState<Record<string, string>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [tempCurrentPage, setTempCurrentPage] = useState(currentPage);
  const [totalPages, setTotalPages] = useState(1);
  const [showBanPopup, setShowBanPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showUnbanPopup, setShowUnbanPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterAdmin, setFilterAdmin] = useState(false);
  const [filterUser, setFilterUser] = useState(false);
  const [filterBanned, setFilterBanned] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  const handleBanClick = (uid: string) => {
    setSubmittingUserId(uid);
    setSelectedUser(uid);
    setShowBanPopup(true);
  };

  const handleUnbanClick = (uid: string) => {
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

  const handleFilterClick = () => {
    setShowFilterPopup(!showFilterPopup);
  };

  const handleFilterApply = () => {
    // Apply filter logic here
    setShowFilterPopup(false);
  };
  const handleFilterClose = () => {
    setShowFilterPopup(false);
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
      setTotalPages(usersResponse.pages || 1);

      setBannedUserIds(
        Array.isArray(bannedUsersResponse.data)
          ? bannedUsersResponse.data.map(
              (entry: { user: { _id: string } }) => entry.user._id
            )
          : []
      );

      const bannedMap: Record<string, string> = {};
      if (Array.isArray(bannedUsersResponse.data)) {
        bannedUsersResponse.data.forEach(
          (entry: { _id: string; user: { _id: string } }) => {
            bannedMap[entry.user._id] = entry._id;
          }
        );
      }
      setBannedUserMap(bannedMap);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (!filterAdmin || user.role === "admin") &&
          (!filterUser || user.role === "user") &&
          (!filterActive || !bannedUserIds.includes(user._id)) &&
          (!filterBanned || bannedUserIds.includes(user._id))
      )
    : [];

  // const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(e.target.value, 10);
  //   if (!isNaN(value) && value > 0) {
  //     setItemsPerPage(value);
  //     setCurrentPage(1); // reset to first page when itemsPerPage changes
  //     console.log(itemsPerPage, currentPage);
  //   }
  // };

  const filterPopup = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="space-y-6">
            <div>
              <h2 className="mt-5 font-bold text-2xl text-purple-700 mb-3">
                Role
              </h2>
              <div className="flex flex-row justify-between items-center">
                <div className="flex items-center">
                  <button
                    className={`mt-8 rounded-md w-[100px] px-5 py-2 text-center text-base font-normal cursor-pointer mx-10 ${
                      filterAdmin
                        ? "bg-purple-700 hover:bg-purple-600 text-white border border-purple-800"
                        : "bg-white hover:bg-gray-100 border border-black text-black"
                    } `}
                    onClick={(e) => {
                      setFilterAdmin(!filterAdmin);
                      setFilterUser(false);
                      e.stopPropagation();
                    }}
                  >
                    Admin
                  </button>
                </div>
                <div className="flex items-center">
                  <button
                    className={`mt-8 rounded-md w-[100px] px-5 py-2 text-center text-black text-base font-normal cursor-pointer mx-10 ${
                      filterUser
                        ? "bg-purple-700 hover:bg-purple-600 text-white border border-purple-800"
                        : "bg-white hover:bg-gray-100 border border-black text-black"
                    } `}
                    onClick={(e) => {
                      setFilterUser(!filterUser);
                      setFilterAdmin(false);
                      e.stopPropagation();
                    }}
                  >
                    User
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mt-8 font-bold text-2xl text-purple-700 mb-3">
                Status
              </h2>
              <div className="flex flex-row justify-between items-center">
                <div className="flex items-center">
                  <button
                    className={`mt-8 rounded-md w-[100px] px-5 py-2 text-center text-black text-base font-normal cursor-pointer mx-10 ${
                      filterActive
                        ? "bg-purple-700 hover:bg-purple-600 text-white border border-purple-800"
                        : "bg-white hover:bg-gray-100 border border-black text-black"
                    } `}
                    onClick={(e) => {
                      setFilterActive(!filterActive);
                      setFilterBanned(false);
                      e.stopPropagation();
                    }}
                  >
                    Active
                  </button>
                </div>
                <div className="flex items-center">
                  <button
                    className={`mt-8 rounded-md w-[100px] px-5 py-2 text-center text-black text-base font-normal cursor-pointer mx-10 ${
                      filterBanned
                        ? "bg-purple-700 hover:bg-purple-600 text-white border border-purple-800"
                        : "bg-white hover:bg-gray-100 border border-black text-black"
                    } `}
                    onClick={(e) => {
                      setFilterBanned(!filterBanned);
                      setFilterActive(false);
                      e.stopPropagation();
                    }}
                  >
                    Banned
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              className="mt-8 mx-5 w-[100px] rounded-md bg-purple-600 px-6 py-3 text-center text-white text-base font-medium shadow-md cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleFilterApply();
              }}
            >
              Filter
            </button>
            <button
              className="mt-8 mx-5 w-[100px] rounded-md bg-purple-600 px-6 py-3 text-center text-white text-base font-medium shadow-md cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleFilterClose();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchData();
  }, [status, currentPage, itemsPerPage, currentPage]);

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

      <div className="flex items-center justify-between bg-white p-2 rounded-xl shadow-sm border border-purple-100 w-full my-5 max-w-7xl">
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full bg-transparent outline-none focus:outline-none focus:ring-0 border-none text-gray-800 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-4 px-4 py-1 font-bold rounded-full border border-purple-300 text-purple-500 bg-purple-100/30 hover:bg-purple-100 transition font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            handleFilterClick();
          }}
        >
          Filter
        </button>
      </div>

      <div className="shadow-lg w-full max-w-7xl rounded-lg overflow-hidden">
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
            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                className={`${
                  bannedUserMap[user._id]
                    ? "bg-red-50 hover:bg-red-100 cursor-pointer "
                    : ""
                }`}
                onClick={(e) => {
                  const banId = bannedUserMap[user._id];
                  if (!banId) return;
                  router.push(`/banuser/${banId}`);
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
                        submittingUserId === user._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={(e) => {
                        handleBanClick(user._id);
                        e.stopPropagation();
                      }}
                    >
                      {submittingUserId === user._id ? "Banning..." : "Ban"}
                    </button>
                  ) : (
                    <button
                      className={`bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded ${
                        submittingUserId === user._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={(e) => {
                        handleUnbanClick(user._id);
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
      <div className="flex justify-between items-center w-full max-w-7xl p-4 bg-white shadow-md rounded-xl text-sm mt-2">
        {/* Rows per page */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700">Rows per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
            className="border border-purple-300 rounded-md pr-7 pl-3 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400 text-gray-600 text-sm"
          >
            {[5, 10, 20, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-gray-600 ">{`1 - 10 of 100 Rows`}</span>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentPage(1);
              setTempCurrentPage(1);
            }}
            disabled={currentPage === 1}
            className="text-gray-700 disabled:opacity-30 text-xl"
          >
            &laquo;
          </button>
          <button
            onClick={() => {
              const newPage = Math.max(currentPage - 1, 1);
              setCurrentPage(newPage);
              setTempCurrentPage(newPage);
            }}
            disabled={currentPage === 1}
            className="text-gray-700 disabled:opacity-30 text-xl"
          >
            &lsaquo;
          </button>
          <input
            type="text"
            min={1}
            max={totalPages}
            value={tempCurrentPage}
            onChange={(e) => setTempCurrentPage(parseInt(e.target.value, 10))}
            onBlur={() => {
              if (
                tempCurrentPage > 0 &&
                tempCurrentPage <= totalPages &&
                tempCurrentPage !== currentPage
              ) {
                setCurrentPage(tempCurrentPage);
              } else {
                setTempCurrentPage(currentPage);
              }
            }}
            className="w-12 text-center border border-purple-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400 text-gray-600"
          />
          <span className="text-gray-700">of {totalPages}</span>
          <button
            onClick={() => {
              const newPage = Math.min(currentPage + 1, totalPages);
              setCurrentPage(newPage);
              setTempCurrentPage(newPage);
            }}
            disabled={currentPage === totalPages}
            className="text-gray-700 disabled:opacity-30 text-xl"
          >
            &rsaquo;
          </button>
          <button
            onClick={() => {
              setCurrentPage(totalPages);
              setTempCurrentPage(totalPages);
            }}
            disabled={currentPage === totalPages}
            className="text-gray-700 disabled:opacity-30 text-xl"
          >
            &raquo;
          </button>
        </div>
      </div>

      {showBanPopup && selectedUser && (
        <BanPopup
          uid={selectedUser}
          onClose={handleClosePopup}
          prevMsg=""
          prevDate={dayjs().add(1, "day").toString()}
        />
      )}
      {showUnbanPopup && selectedUser && (
        <UnbanPopup uid={selectedUser} onClose={handleClosePopup} />
      )}

      {showFilterPopup && filterPopup()}
    </div>
  );
}
