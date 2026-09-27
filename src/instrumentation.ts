import type { Instrumentation } from "next";

/*
 * Server errors, written to the logs as one line of JSON each so they are easy to search
 * and alert on in Vercel (docs/LAUNCH.md). The address is trimmed as for analytics.
 */
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const { countableUrl } = await import("@/lib/analytics");
  const { describeError } = await import("@/lib/errors/report");
  console.error(
    "[server-error]",
    JSON.stringify({
      ...describeError(error),
      path: countableUrl(request.path),
      method: request.method,
      route: context.routePath,
      type: context.routeType,
    }),
  );
};
