"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("fable-user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-slate-900">
        <div className="text-center">
          <img
            src={
              user.photoURL ||
              "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt={user.name}
            className="mx-auto h-32 w-32 rounded-full object-cover"
          />

          <h1 className="mt-4 text-3xl font-black">
            {user.name}
          </h1>

          <p className="mt-2 text-slate-500">
            {user.email}
          </p>

          <span className="mt-4 inline-block rounded-full bg-violet-100 px-4 py-2 font-bold capitalize text-violet-700">
            {user.role}
          </span>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">
              Full Name
            </p>
            <h3 className="font-bold">
              {user.name}
            </h3>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Email
            </p>
            <h3 className="font-bold">
              {user.email}
            </h3>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Role
            </p>
            <h3 className="font-bold capitalize">
              {user.role}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}