import type { Instrumentation } from "next";

/*
 * Server errors, written to the logs as one line of JSON each so they are easy to search
 * in Vercel, and emailed to whoever looks after the site (lib/errors/alert.ts,
 * docs/LAUNCH.md). The address is trimmed as for analytics.
 */
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const { countableUrl } = await import("@/lib/analytics");
  const { describeError } = await import("@/lib/errors/report");
  const { sendAlert } = await import("@/lib/errors/alert");
  const described = describeError(error);
  const path = countableUrl(request.path);
  console.error(
    "[server-error]",
    JSON.stringify({
      ...described,
      path,
      method: request.method,
      route: context.routePath,
      type: context.routeType,
    }),
  );
  await sendAlert({
    where: "server",
    message: described.message,
    stack: described.stack,
    path,
    facts: [
      ["Route", `${request.method} ${context.routePath} (${context.routeType})`],
      ...(described.digest ? [["Digest", described.digest] as [string, string]] : []),
    ],
  }).catch(() => false);
};
