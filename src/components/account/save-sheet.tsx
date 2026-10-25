"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/dialog";
import { accountText } from "@/i18n/copy/account";
import { useText } from "@/i18n/client";
import { SignInForm } from "./sign-in-form";

/*
 * Signing in from the editor without leaving it (owner, 2026-10-25): every visitor who
 * reached "Sign in to publish" left on the sign-in page, so the editor's sign-in buttons
 * open the form in a sheet over the invitation, with email beside Google. The page says
 * which ways in are on (SignInOptions); without it, the buttons go to /sign-in as before.
 */

export type SignInOptions = { phone: boolean; email: boolean; preview: boolean };

const SignInOptionsContext = createContext<SignInOptions | null>(null);

export function SignInOptionsProvider({
  value,
  children,
}: {
  value: SignInOptions | null;
  children: ReactNode;
}) {
  return <SignInOptionsContext.Provider value={value}>{children}</SignInOptionsContext.Provider>;
}

export function SaveSheet({
  next,
  label,
  signedIn,
  variant = "primary",
  className,
  children,
}: {
  /** Where the form goes once signed in; the editor stays where it is. */
  next: string;
  label: ReactNode;
  /**
   * Signed in, the button gives way to children. Signing in refreshes the page under the
   * sheet, so the sheet stays open across it for the name the form asks for next.
   */
  signedIn: boolean;
  variant?: "primary" | "secondary";
  className?: string;
  children?: ReactNode;
}) {
  const options = useContext(SignInOptionsContext);
  const { saveCopy } = useText(accountText);
  const [open, setOpen] = useState(false);

  if (!options) {
    if (signedIn) return children;
    return (
      <Button asChild variant={variant} className={className}>
        <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>
          <LogIn aria-hidden />
          {label}
        </Link>
      </Button>
    );
  }

  return (
    <>
      {signedIn ? (
        children
      ) : (
        <Button
          variant={variant}
          leadingIcon={<LogIn aria-hidden />}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className={className}
        >
          {label}
        </Button>
      )}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          title={saveCopy.title}
          description={saveCopy.intro}
          closeLabel={saveCopy.close}
        >
          <SignInForm
            next={next}
            preview={options.preview}
            phone={options.phone}
            email={options.email}
            onSignedIn={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
