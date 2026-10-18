# Blog

The blog brings visitors from search: people looking for invitation wording, messages and planning help, who then make their invitation on Shubh. It lives at `/blog` (English) and at `/hi/blog`, `/mr/blog`, `/gu/blog`, `/bn/blog` and `/ta/blog` for the other site languages. A language's blog appears once it has a post of its own.

## How a post is made

1. Ask Claude in the project for a post on a keyword, for example "write a blog post for _engagement invitation message_".
2. Claude writes it as one file in `src/content/blog/`, adds it to `src/content/blog/index.ts`, and opens a PR.
3. The post goes live when the PR is merged. The sitemap, the blog's front page and "More to read" pick it up by themselves.

A post is written in one language. A post in another language is a separate file with its `locale` (`"hi"`, `"mr"`, `"gu"`, `"bn"` or `"ta"`), and its address is `/<locale>/blog/<slug>`, for example `/hi/blog/<slug>`. Its file name starts with the locale (`gu-kankotri-lakhan.ts`). When a post exists in two languages, give both the same `pair` key so each lists the other as its language version, and add the pair to `POST_PAIRS` in `src/lib/blog/addresses.ts` (a unit test checks they agree).

## What each post has

- A `title` of at most 48 characters, used for the browser tab and search results (the site name is added after it). A `description` of at most 155 characters. Unit tests check both.
- The keywords it is written for, in `keywords`. They are not shown.
- An `answer`: the post's main question answered in two or three sentences, 25 to 70 words (a unit test checks). It shows first, under **In short**, and goes to search engines as the article's abstract. Write it so it stands alone when an answer engine quotes it: no "here", "below" or "this post".
- An `occasion`. The post ends with "Make your … invitation", which goes to the editor for that occasion and to its designs page.
- A body built from these blocks:
  - paragraphs, which may carry `[a link](/path)` and `**bold**` words;
  - `h2` sections, each with an `id`, which make the table of contents;
  - `h3` headings;
  - lists, ordered or not;
  - tips;
  - `wording` cards, messages with a **Copy** button;
  - `table`s, with a caption, column headings and rows, for comparisons and timelines (what to send when, digital or printed, which function is which). A wide table scrolls inside its own frame on a phone.
- A byline: every post is signed by Shubh's founder, Ved RK (`site.founder` in `src/lib/site.ts`), on the page and as the article's author for search engines.
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
- A post in an Indian language is written for that language's searchers (keywords in its own script and the romanised spellings people type, such as "kankotri lakhan"), not translated word for word. Very few sites write these well, so they are the easiest posts to rank.

## Answer engines (AEO and GEO)

Google's AI Overviews, ChatGPT, Perplexity and Gemini answer many of these searches themselves and name the pages they took the answer from. A post is more likely to be quoted when:

- it answers the question in its first lines (`answer`), in the words people search;
- each section is a question or a plain label, with the answer in its first sentence;
- it has the facts people repeat, such as timings, counts and costs, in a `table` or a list;
- its FAQ covers the follow-up questions, each answer complete on its own;
- it shows when it was last updated: change `updated` when the facts change, and the post shows "Updated" beside the date.

`/llms.txt` lists what Shubh is, its main pages, occasions, traditions and every post, for AI assistants that read it. It is a small extra, not a ranking tool: Google does not use it and studies so far show no clear effect. It is built from the site's own words and posts, so it costs nothing to keep.

## Keywords

Research (3 October 2026): the searches families make around an invitation are for **wording and messages to copy**, by occasion and by language. Google's results for most of these are thin template sites, Canva/Adobe template pages and a few publishers (WeddingWire India for wedding messages, SmartPuja for puja and griha pravesh), so a complete, well-structured post can rank. Exact monthly volumes need Google Search Console after launch or Keyword Planner; the order below is by how often the phrase family appears in Google's suggestions and in competitors' pages, and by how close it is to making an invitation.

Written (47 posts):

- Wedding: wedding invitation wording; digital invitation on WhatsApp; haldi, mehendi and sangeet messages; wedding invitation video; Indian wedding functions; engagement invitation message; save the date message; reception invitation wording; wedding invitation message for friends; wedding RSVP message; thank you message after wedding; Muslim wedding invitation wording; Gujarati wedding invitation wording (kankotri); when to send wedding invitations (timeline); wedding invitation etiquette; roka and tilak invitation messages; best digital invitation websites in India, compared (Shubh disclosed as ours; prices checked 18 October 2026, recheck every quarter); digital vs printed wedding cards, the real cost.
- Family: birthday invitation messages; 1st birthday invitation message; anniversary party invitation message; baby shower invitation message (godh bharai, seemantham); annaprashan invitation message; naming ceremony invitation message (namkaran, barse, barasala, noolukettu); thread ceremony invitation message; griha pravesh invitation message; retirement party invitation message; shop opening invitation message.
- Festivals, puja and parties: Diwali party invitation message; Satyanarayan puja invitation message; Ganpati invitation message; garba night invitation message; Christmas party invitation message; New Year party invitation message; Lohri invitation message (baby's and bride's first Lohri).
- Hindi: शादी कार्ड मैटर; शादी का निमंत्रण WhatsApp संदेश; शादी का कार्ड कितने दिन पहले भेजें (paired with the timeline post); हल्दी, मेहंदी और संगीत निमंत्रण संदेश (paired); सगाई निमंत्रण संदेश; गृह प्रवेश निमंत्रण संदेश; जन्मदिन निमंत्रण संदेश; दिवाली निमंत्रण संदेश; सत्यनारायण कथा निमंत्रण.
- In their own languages (17 October 2026): કંકોતરી લખાણ (Gujarati, paired with the English Gujarati wording post); लग्नपत्रिका मजकूर (Marathi); திருமண அழைப்பிதழ் வாசகம் (Tamil); বিয়ের কার্ডের লেখা (Bengali).

Research (18 October 2026, web results only; no Search Console yet): niche occasions have almost no copyable wording, mostly template galleries; the closest content rival (Invifest) gives about four messages a page and Hindi only in Roman letters; the "best digital invitation website" lists that answer engines cite are vendors' own lists, and Shubh is in none of them; timing advice online is old (2019) and disagrees. Google's guidance for its AI features: no special schema or AI text file is needed; original, useful, up-to-date content is what counts. AI assistants cite newer pages than Google's normal results do, so keep `updated` honest and refresh seasonal posts every year.

Next, in order:

1. Ask the lists that rank for "best invitation app India" (Weddingkart, The Curated Knot, Samaro) to include Shubh.
2. Recheck the comparison's prices every quarter, and update `updated` when they change.
3. Vivah muhurat dates for the season with a "send invitations by" date for each, only from a panchang we can cite, since published lists disagree
4. English versions of the Marathi, Tamil and Bengali wedding posts, paired with them
5. Anand Karaj invitation wording (following gurdwara guidance on printing Gurbani), and Christian wedding invitation wording for India, before December
6. Bhaat (mayra) nyota, mundan (needs a mundan occasion first), kitty party, shashtipoorthi (60th birthday) invitations
7. Makar Sankranti, Pongal, Uttarayan and Haldi-Kumkum invitations, with a Marathi हळदी कुंकू post, by early December
8. School annual day and Republic Day function invitations, by early December
9. Iftar and Eid Milan invitations (Ramadan from about 8 February 2027), and Holi party invitations (22 March 2027)
10. More in their own languages: Gujarati સીમંત, Marathi साखरपुडा and बारसे, Tamil வளைகாப்பு, Bengali অন্নপ্রাশন

Original numbers make posts worth citing: once there is enough use, publish anonymised figures from the product (days from sending to replies, functions per wedding, languages chosen).

Festival posts should go live 4 to 6 weeks before the festival, so search engines have found them in time.
