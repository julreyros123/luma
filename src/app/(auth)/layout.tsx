import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">Luma</span>
      </Link>
      {children}
    </div>
  );
}
