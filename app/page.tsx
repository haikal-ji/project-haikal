import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  let dbUser = null;
  if (authUser?.email) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: authUser.email },
      });
    } catch (e) {
      console.error("Failed to query DB user:", e);
    }
  }

  const displayName =
    dbUser?.name ||
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.user_metadata?.user_name ||
    authUser?.email;

  const avatarUrl =
    dbUser?.avatar ||
    authUser?.user_metadata?.avatar_url ||
    authUser?.user_metadata?.picture ||
    null;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Navbar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center font-bold text-white dark:text-black">
              H
            </div>
            <span className="font-semibold text-lg tracking-tight">Project Haikal</span>
          </div>

          <div>
            {authUser ? (
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition"
                >
                  Logout
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {authUser ? (
          <div className="max-w-xl mx-auto w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName || "User avatar"}
                  width={64}
                  height={64}
                  className="rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                  {displayName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Login Berhasil
                </div>
                <h1 className="text-xl font-bold">{displayName}</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{authUser.email}</p>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 space-y-3 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-zinc-500 dark:text-zinc-400">Provider Auth</span>
                <span className="font-medium capitalize">{authUser.app_metadata.provider || "GitHub / OAuth"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500 dark:text-zinc-400">Database Sync</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {dbUser ? "Tersinkron di PostgreSQL (Prisma)" : "Sync Pending"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500 dark:text-zinc-400">User ID</span>
                <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[200px]">
                  {authUser.id}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <form action="/auth/signout" method="POST" className="w-full">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50 font-medium text-sm transition"
                >
                  Keluar / Logout
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Selamat Datang di <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Project Haikal
              </span>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Anda belum login. Silakan masuk untuk mengakses fitur dan data akun Anda.
            </p>

            <div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black font-semibold text-sm shadow-md transition"
              >
                Menuju Halaman Login &rarr;
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
