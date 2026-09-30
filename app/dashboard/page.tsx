import { auth, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      <SignedOut>
        <div className="text-sm">You are signed out. <Link href="/sign-in" className="underline">Sign in</Link></div>
      </SignedOut>
      <SignedIn>
        <div className="text-sm text-muted-foreground">Your saved searches and threads will appear here.</div>
      </SignedIn>
    </div>
  );
}