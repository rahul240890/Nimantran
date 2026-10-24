/** Only ever real: invitations that went live, and reviews an admin approved. */
export const trustCopy = {
  sent: (count: string) => `${count} invitations sent with Shubh`,
  rating: (average: string, count: number) =>
    `${average} out of 5 from ${count === 1 ? "1 family" : `${count} families`}`,
  stars: (count: number) => `${count} out of 5 stars`,
  reviewsHeading: "What families say",
  reviewsIntro: "From hosts whose invitations went live. We read every review before it shows.",
} as const;
