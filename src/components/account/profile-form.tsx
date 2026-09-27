"use client";

import { Languages, LogOut, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveProfile, signOut } from "@/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { accountText } from "@/i18n/copy/account";
import { useText } from "@/i18n/client";
import { languages } from "@/i18n/locales";
import { PROFILE_RULES, type Account } from "@/lib/auth/account";
import { formatPhone } from "@/lib/auth/phone";
import type { Locale } from "@/lib/categories/schema";
import { PersonAvatar } from "./person-avatar";
import { refreshAccountHint } from "./use-account-hint";

type Errors = Partial<Record<"name" | "language", string>>;

export function ProfileForm({ account }: { account: Account }) {
  const { accountMenu, profileCopy, signInCopy } = useText(accountText);
  const router = useRouter();
  const [name, setName] = useState(account.name);
  const [language, setLanguage] = useState<Locale>(account.language);
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const [leaving, startLeaving] = useTransition();

  const save = () =>
    startSaving(async () => {
      setFailure(null);
      const result = await saveProfile({ name, language });
      if (result.status === "invalid") {
        setErrors(result.errors);
        return;
      }
      if (result.status === "failed") {
        setFailure(signInCopy.errors[result.error]);
        return;
      }
      setErrors({});
      setName(result.account.name);
      refreshAccountHint();
      toast({ title: profileCopy.saved, tone: "success" });
      router.refresh();
    });

  const leave = () =>
    startLeaving(async () => {
      await signOut();
      refreshAccountHint();
      toast({ title: accountMenu.signedOut, tone: "success" });
      router.push("/");
      router.refresh();
    });

  const message = (key: "name" | "language") => {
    const error = errors[key];
    return error ? profileCopy.errors[error as keyof typeof profileCopy.errors] : undefined;
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-6 p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <PersonAvatar
            name={name.trim()}
            src={account.avatarUrl}
            size="lg"
            label={accountMenu.yourAccount}
          />
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="text-sm text-ink-muted">{profileCopy.signedInWith}</p>
            <p className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="inline-flex min-w-0 items-center gap-2 font-semibold break-all">
                {account.method === "phone" ? (
                  <Phone aria-hidden className="size-4 shrink-0 text-ink-muted" />
                ) : (
                  <Mail aria-hidden className="size-4 shrink-0 text-ink-muted" />
                )}
                {account.phone ? formatPhone(account.phone) : account.email}
              </span>
              <Badge tone="gold">{profileCopy.methods[account.method]}</Badge>
            </p>
          </div>
        </div>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
          className="flex flex-col gap-5 border-t border-line pt-6"
        >
          <Field
            label={profileCopy.name}
            hint={profileCopy.nameHint}
            required
            error={message("name")}
          >
            <Input
              value={name}
              maxLength={PROFILE_RULES.name}
              autoComplete="name"
              onChange={(event) => {
                setName(event.target.value);
                if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
              }}
            />
          </Field>
          <Field
            label={profileCopy.language}
            hint={profileCopy.languageHint}
            error={message("language")}
          >
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value as Locale)}
              leading={<Languages />}
              options={languages.map((item) => ({
                value: item.code,
                label: (
                  <span>
                    <span lang={item.code}>{item.native}</span>
                    {item.code !== "en" && (
                      <span className="text-ink-muted"> · {item.english}</span>
                    )}
                  </span>
                ),
                textValue: item.english,
              }))}
            />
          </Field>
          {failure && (
            <p
              role="alert"
              className="rounded-md border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
            >
              {failure}
            </p>
          )}
          <div>
            <Button type="submit" loading={saving}>
              {profileCopy.save}
            </Button>
          </div>
        </form>
      </Card>

      <Card
        elevation="flat"
        className="flex-row flex-wrap items-center justify-between gap-4 p-5 sm:p-6"
      >
        <p className="text-sm text-ink-muted">{profileCopy.signOutHint}</p>
        <Button
          variant="secondary"
          loading={leaving}
          leadingIcon={<LogOut aria-hidden />}
          onClick={leave}
        >
          {profileCopy.signOut}
        </Button>
      </Card>
    </div>
  );
}
