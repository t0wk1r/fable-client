"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiUsers } from "react-icons/fi";
import api from "../../../../services/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "writer" | "admin";
  photoURL?: string;
  createdAt?: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const token = localStorage.getItem("fable-token");

    try {
      const res = await api.get("/admin/users", {
        headers: { authorization: token },
      });

      setUsers(res.data.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, role: string) => {
    const token = localStorage.getItem("fable-token");

    try {
      await api.patch(
  `/admin/users/role/${id}`,
  { role },
  { headers: { authorization: token } }
);

      toast.success("User role updated");
      fetchUsers();
    } catch {
      toast.error("Role update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("fable-token");

    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { authorization: token },
      });

      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-xl">
        <FiUsers className="mb-4 text-5xl" />
        <h1 className="text-4xl font-black">Manage Users</h1>
        <p className="mt-2 text-violet-100">
          Change roles or delete users from the platform.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
            No users found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500 dark:border-slate-800">
                  <th className="py-3">User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Change Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 overflow-hidden rounded-full bg-violet-100">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-bold text-violet-700">
                              {user.name?.charAt(0)}
                            </div>
                          )}
                        </div>

                        <span className="font-bold text-slate-900 dark:text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="text-slate-500">{user.email}</td>

                    <td>
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold capitalize text-violet-700">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                      >
                        <option value="user">User</option>
                        <option value="writer">Writer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="text-slate-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="rounded-xl bg-red-100 p-3 text-red-700 hover:bg-red-200"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}