import { Newspaper, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeading } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { POSTS } from "@/content/blog";
import { requireAdmin } from "@/lib/admin/access";
import { blogPostPath } from "@/lib/blog/posts";
import { adminPosts, isLive, type AdminPost } from "@/lib/blog/store";

export const metadata: Metadata = { title: "Blog" };

const day = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

function state(post: AdminPost, now: Date) {
  if (post.status === "draft") return { tone: "neutral" as const, label: "Draft" };
  if (!isLive(post, now)) return { tone: "warning" as const, label: "Scheduled" };
  return { tone: "success" as const, label: "Live" };
}

/** Every post: those written here, which can be changed, and those that ship with the site. */
export default async function BlogAdminPage() {
  await requireAdmin("/admin/blog");
  const posts = await adminPosts();
  const now = new Date();
  const linkClass =
    "inline-flex min-h-11 items-center font-semibold text-ink underline-offset-4 hover:text-accent-text hover:underline";

  return (
    <>
      <AdminHeading
        eyebrow="Content"
        title="Blog"
        intro="Posts bring visitors from Google. Write one here with a cover, save it as a draft, then publish it now or on a date. The blog, its sitemap and Google's preview update by themselves."
      />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <Newspaper aria-hidden className="size-5 text-accent-text" />
                Written here
              </CardTitle>
              <CardDescription>Newest first. Times are India time.</CardDescription>
            </div>
            <Button asChild size="sm" leadingIcon={<Plus aria-hidden />}>
              <Link href="/admin/blog/new">New post</Link>
            </Button>
          </CardHeader>
          <CardBody>
            {posts.length === 0 ? (
              <EmptyState
                icon={<Newspaper aria-hidden />}
                title="No posts yet"
                description="Your first post can start from a search phrase: the AI writes a draft for you to check."
              />
            ) : (
              <ul className="flex flex-col divide-y divide-line">
                {posts.map((post) => {
                  const badge = state(post, now);
                  return (
                    <li
                      key={post.id}
                      className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <div className="flex min-w-0 flex-col">
                        <Link href={`/admin/blog/${post.id}`} className={linkClass}>
                          {post.heading}
                        </Link>
                        <span className="text-sm break-all text-ink-muted">
                          {blogPostPath(post.slug, post.locale)} ·{" "}
                          {day.format(new Date(post.publishedAt))}
                        </span>
                      </div>
                      <Badge tone={badge.tone} dot>
                        {badge.label}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Built into the site</CardTitle>
            <CardDescription>
              {POSTS.length} posts ship with the code and are always live. Ask Claude to change one,
              or write a new version here under another address.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <ul className="flex flex-col divide-y divide-line">
              {[...POSTS]
                .sort((a, b) => b.published.localeCompare(a.published))
                .map((post) => (
                  <li
                    key={`${post.locale}-${post.slug}`}
                    className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <a
                      href={blogPostPath(post.slug, post.locale)}
                      target="_blank"
                      rel="noreferrer"
                      lang={post.locale}
                      className={linkClass}
                    >
                      {post.heading}
                    </a>
                    <Badge tone="success" dot>
                      {post.locale === "hi" ? "Live · Hindi" : "Live"}
                    </Badge>
                  </li>
                ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
