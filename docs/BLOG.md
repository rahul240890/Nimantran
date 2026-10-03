# Blog

The blog brings visitors from search: people looking for invitation wording, messages and planning help, who then make their invitation on Shubh. It lives at `/blog` (English) and `/hi/blog` (Hindi).

## How a post is made

1. Ask Claude in the project for a post on a keyword, for example "write a blog post for _engagement invitation message_".
2. Claude writes it as one file in `src/content/blog/`, adds it to `src/content/blog/index.ts`, and opens a PR.
3. The post goes live when the PR is merged. The sitemap, the blog's front page and "More to read" pick it up by themselves.

A post is written in one language. A Hindi post is a separate file with `locale: "hi"`, and its address is `/hi/blog/<slug>`. When a post exists in both languages, give both the same `pair` key so each lists the other as its language version.

## What each post has

- A `title` of at most 48 characters, used for the browser tab and search results (the site name is added after it). A `description` of at most 155 characters. Unit tests check both.
- The keywords it is written for, in `keywords`. They are not shown.
- An `occasion`. The post ends with "Make your … invitation", which goes to the editor for that occasion and to its designs page.
- A body built from these blocks:
  - paragraphs, which may carry `[a link](/path)` and `**bold**` words;
  - `h2` sections, each with an `id`, which make the table of contents;
  - `h3` headings;
  - lists, ordered or not;
  - tips;
  - `wording` cards, messages with a **Copy** button.
- A few `faq` questions. They show at the end of the post and go to search engines as FAQ structured data.

Every link in a post must point at a page that exists. A unit test checks this.

## Writing rules

- Write for the reader's search, not for us. Put the most useful part, the messages or the steps, near the top.
- Only state what the product really does today. The video belongs to paid editions, so say so.
- Link to two or three other posts and to the matching occasion or tradition pages.
- Use real-sounding Indian names and dates, never real people.
- Update `updated` when a post changes.

## Writing posts from Admin

An admin can also write a post without code at **Admin, Blog** (`/admin/blog`):

- title (48 characters, counted), address, heading, description (155, counted), introduction, cover picture with its description, the post itself, questions and answers, search phrases, the occasion and the language;
- **Draft** (only admins see it) or **Published** with a date and time: a date ahead schedules the post, and it goes live by itself;
- **Draft with AI**: type a search phrase and the AI set up at **Admin, AI** writes a first draft to check and change.

The post is written in a light markup shown under the box: `## Section`, `### Smaller heading`, `- list`, `1. numbered`, `> [Label] message to copy`, `! tip`, `[words](/path)` and `**bold**`. Admin posts are stored in the `blog_posts` table and covers in the public `blog` storage bucket (migration `20261003170000_blog_posts.sql`, owner file `shubhdwar/blog-posts.sql`). They join the code's posts on the blog, the sitemap and "More to read" within five minutes. An address used by a post in the code can't be taken.

## SEO for every post

- One main search phrase per post, in the title, the first words of the description, the heading and the first paragraph. Related phrases in `keywords` and in the section headings.
- Copyable messages near the top: that is what searchers came for.
- FAQ answers in the words people search, sent to Google as FAQ structured data, with Article structured data, breadcrumbs, a canonical address and `hreflang` links to the other language's version when a `pair` exists.
- Internal links: every post links to its occasion's designs page and to two or three related posts. "More to read" under a post shows the posts it links to, then posts that link to it, then the same occasion. Each occasion's designs page (`/invitations/<occasion>`) lists that occasion's posts under "Wording ideas".
- A Hindi post is written for Hindi searchers (Devanagari keywords and Hinglish spellings), not translated word for word.

## Keywords

Research (3 October 2026): the searches families make around an invitation are for **wording and messages to copy**, by occasion and by language. Google's results for most of these are thin template sites, Canva/Adobe template pages and a few publishers (WeddingWire India for wedding messages, SmartPuja for puja and griha pravesh), so a complete, well-structured post can rank. Exact monthly volumes need Google Search Console after launch or Keyword Planner; the order below is by how often the phrase family appears in Google's suggestions and in competitors' pages, and by how close it is to making an invitation.

Written (32 posts):

- Wedding: wedding invitation wording; digital invitation on WhatsApp; haldi, mehendi and sangeet messages; wedding invitation video; Indian wedding functions; engagement invitation message; save the date message; reception invitation wording; wedding invitation message for friends; wedding RSVP message; thank you message after wedding; Muslim wedding invitation wording; Gujarati wedding invitation wording (kankotri).
- Family: birthday invitation messages; 1st birthday invitation message; anniversary party invitation message; baby shower invitation message (godh bharai, seemantham); annaprashan invitation message; thread ceremony invitation message; griha pravesh invitation message; retirement party invitation message; shop opening invitation message.
- Festivals and puja: Diwali party invitation message; Satyanarayan puja invitation message; Ganpati invitation message; garba night invitation message.
- Hindi: शादी कार्ड मैटर; शादी का निमंत्रण WhatsApp संदेश; सगाई निमंत्रण संदेश; गृह प्रवेश निमंत्रण संदेश; जन्मदिन निमंत्रण संदेश; दिवाली निमंत्रण संदेश; सत्यनारायण कथा निमंत्रण.

Next, in order:

1. Marathi lagna patrika wording
2. Tamil wedding invitation wording
3. Bengali wedding card wording
4. Punjabi wedding (Anand Karaj) invitation wording
5. Mundan ceremony invitation (needs a mundan occasion first)
6. Naming ceremony (namkaran) invitation (needs a naming ceremony occasion first)
7. Hindi: सगाई, हल्दी, मेहंदी के निमंत्रण संदेश; गणेश स्थापना निमंत्रण; मुंडन निमंत्रण
8. Eid party invitation message
9. Lohri and Makar Sankranti invitation messages, before January
10. Christmas party invitation message, before December

Festival posts should go live 4 to 6 weeks before the festival, so search engines have found them in time.
