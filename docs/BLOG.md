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

## Keywords

Already written:

- wedding invitation wording
- digital wedding invitation on WhatsApp
- haldi, mehendi and sangeet messages
- wedding invitation video
- Indian wedding functions
- birthday invitation messages
- शादी कार्ड मैटर (Hindi)

Next, in order:

1. Engagement and ring ceremony invitation message
2. Reception invitation wording
3. Griha pravesh (housewarming) invitation message, in English and Hindi
4. Save the date message ideas
5. 1st birthday invitation card wording
6. Anniversary party invitation message
7. Baby shower (godh bharai) invitation message
8. Diwali party invitation message, written before Diwali
9. Wedding RSVP message and how to ask guests to confirm
10. Thank-you message after the wedding
11. Gujarati kankotri wording
12. Marathi lagna patrika wording
13. Tamil wedding invitation wording
14. Muslim nikah invitation wording
15. Hindi birthday invitation messages (जन्मदिन निमंत्रण संदेश)

Festival posts should go live 4 to 6 weeks before the festival, so search engines have found them in time.
