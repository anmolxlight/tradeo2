import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-6">
      <SignIn />
    </div>
  );
}