import { birthdayInvitationMessages } from "./birthday-invitation-messages";
import { digitalWeddingInvitationWhatsapp } from "./digital-wedding-invitation-whatsapp";
import { haldiMehendiSangeetMessages } from "./haldi-mehendi-sangeet-invitation-messages";
import { shadiCardMatterHindi } from "./hi-shadi-card-matter";
import { indianWeddingFunctions } from "./indian-wedding-functions";
import type { BlogPost } from "./types";
import { weddingInvitationVideo } from "./wedding-invitation-video";
import { weddingInvitationWording } from "./wedding-invitation-wording";

/* Every blog post. A new post is one file in this folder plus a line here (docs/BLOG.md). */

export const POSTS: readonly BlogPost[] = [
  weddingInvitationWording,
  digitalWeddingInvitationWhatsapp,
  haldiMehendiSangeetMessages,
  weddingInvitationVideo,
  indianWeddingFunctions,
  birthdayInvitationMessages,
  shadiCardMatterHindi,
];
