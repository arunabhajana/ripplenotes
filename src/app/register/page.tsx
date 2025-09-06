"use client";

import { Waves } from "lucide-react"; // brand icon
import { RegisterForm } from "@/components/ui/RegisterForm";

/**
 * RegisterPage – full-screen register view with brand icon and form.
 */
export default function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Waves className="size-4" />
          </div>
          <span>Ripple Notes</span>
        </a>

        <RegisterForm />
      </div>
    </div>
  );
}
