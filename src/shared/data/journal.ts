import type { Img } from '../commerce/types'
import { images } from './images'

export interface JournalEntry {
  id: string
  handle: string
  title: string
  excerpt: string
  publishedAt: string
  tags: string[]
  author: string
  image?: Img
  // rich body from shopify's contentHtml. always sanitized before render.
  contentHtml: string
}

// placeholder journal. every entry is house-voice placeholder copy to show the reading experience;
// none is written in frances's voice, and none states a fact about her life.
// letters use <div class="letter">, captions use <figure>/<figcaption>, pull quotes use <blockquote>.

const letterBlock = `<div class="letter" data-placeholder="true">
<p class="letter-mark">Placeholder letter</p>
<p>This space holds one of Frances’s typewritten letters. Its transcription will be set here as she typed it, once the family chooses which letter to share.</p>
<p>Until then, nothing here is in her voice.</p>
</div>`

export const mockJournal: JournalEntry[] = [
  {
    id: 'mock-article-1',
    handle: 'the-letters',
    title: 'The letters',
    excerpt: 'How a family’s memory became a house. A placeholder for the founder’s own telling.',
    publishedAt: '2026-10-24T09:00:00Z',
    tags: ['Letters'],
    author: 'Jessi Frances',
    image: images.womanWriting,
    contentHtml: `<p class="placeholder-note">Placeholder entry. The founder will tell this story in her own words.</p>
<p>Every house begins somewhere. This one begins with letters, typed by a woman named Frances and found by her granddaughter after Frances had passed.</p>
<p>What the letters held is not ours to summarize. What we can say is what the brand itself says: they revealed new dimensions of her strength and hope, and they turned family memory into a larger idea. Women carry stories worth preserving. Beauty can be a way of remembering.</p>
<h2>Why a letter</h2>
<p>A typed letter is a deliberate thing. It is composed, corrected, folded and sent. It asks for time from the person who writes it and from the person who reads it. That is the pace this journal hopes to keep.</p>
${letterBlock}
<p>In the months ahead, with the family’s permission, a few of Frances’s letters may appear here, transcribed with care and never rewritten.</p>
<blockquote><p>She doesn’t wear jewelry to be noticed. She wears it to remember who she’s becoming.</p></blockquote>
<p>Until then, this is where the journal starts: with the idea that what a woman has lived deserves to be kept, and that the keeping can be beautiful.</p>`,
  },
  {
    id: 'mock-article-2',
    handle: 'already-and-still',
    title: 'Already, and still',
    excerpt: 'On becoming, which is not the same as being unfinished.',
    publishedAt: '2026-10-20T09:00:00Z',
    tags: ['Reflections'],
    author: 'Jessi Frances',
    image: images.sisters,
    contentHtml: `<p class="placeholder-note">Placeholder entry, written to show the reading experience.</p>
<p>There is a way of talking about growth that makes a woman feel behind. Become more, fix this, catch up. The house does not speak that way.</p>
<p>Becoming, as the house uses the word, holds two truths at once. You are already someone worth celebrating. And you are still becoming. Neither cancels the other.</p>
<figure><img src="${images.sisters.url}" alt="${images.sisters.altText}" width="${images.sisters.width}" height="${images.sisters.height}" loading="lazy" /><figcaption>Two Sisters (On the Terrace), Pierre-Auguste Renoir, 1881. Art Institute of Chicago, public domain. Placeholder image.</figcaption></figure>
<h2>Three small instructions</h2>
<p>Celebrate how far she’s come. Love the woman she is. Remind her that she’s still becoming. They read like instructions, but they are closer to a promise: that each object and each story here will be made in that spirit.</p>
<blockquote><p>Not because she isn’t enough. But because her story isn’t finished.</p></blockquote>
<p>A huggie that fits. A drop chosen for the chapter she is in. A letter kept in a drawer. None of these asks her to be someone else.</p>`,
  },
  {
    id: 'mock-article-3',
    handle: 'wear-the-chapter-youre-in',
    title: 'Wear the chapter you’re in',
    excerpt: 'Why the first pieces of the house are a huggie and a set of drops that change with her.',
    publishedAt: '2026-10-14T09:00:00Z',
    tags: ['The House'],
    author: 'Jessi Frances',
    image: images.antiqueEarrings,
    contentHtml: `<p class="placeholder-note">Placeholder entry, written to show the reading experience.</p>
<p>The First Huggie™ is meant to be beautiful on its own: carefully fitted, in more than one size, and quiet enough to wear every day.</p>
<p>Its small loop is the start of something else. Chapters™ are interchangeable heirloom drops that hang from it, and each one is named for a part of a life. The first three are The Beginning, The Becoming, and The Mother.</p>
<h2>One foundation, many chapters</h2>
<p>The idea is simple. The huggie stays. The drop changes as she does. Over years, the drawer fills with chapters, and each one remembers something.</p>
<blockquote><p>Wear the chapter you’re in.</p></blockquote>
<p>Placeholder: details of metals, sizes, and how each drop attaches will be added here when the pieces are final.</p>`,
  },
  {
    id: 'mock-article-4',
    handle: 'notes-on-the-magnolia',
    title: 'Notes on the magnolia',
    excerpt: 'Bud and bloom, and why the house keeps both.',
    publishedAt: '2026-10-09T09:00:00Z',
    tags: ['Reflections'],
    author: 'Jessi Frances',
    image: images.magnolias,
    contentHtml: `<p class="placeholder-note">Placeholder entry, written to show the reading experience.</p>
<p>The magnolia appears across the house in two forms: the bud, closed and certain, and the bloom, open and generous. They are never meant to be read as before and after.</p>
<figure><img src="${images.magnolias.url}" alt="${images.magnolias.altText}" width="${images.magnolias.width}" height="${images.magnolias.height}" loading="lazy" /><figcaption>Magnolias on Light Blue Velvet Cloth, Martin Johnson Heade, 1885–95. Art Institute of Chicago, public domain. Placeholder image.</figcaption></figure>
<p>A bud is not a lesser flower. It is a flower at a particular moment. So is the bloom.</p>
<blockquote><p>Symbolism should feel discovered, not over-explained.</p></blockquote>
<p>That line comes from the brief for this website, and it is a good rule for a journal too. So this note stops here.</p>`,
  },
  {
    id: 'mock-article-5',
    handle: 'women-becoming',
    title: 'Women becoming',
    excerpt: 'An introduction to the stories this journal will keep.',
    publishedAt: '2026-10-02T09:00:00Z',
    tags: ['Women’s stories'],
    author: 'Jessi Frances',
    image: images.readingLetter,
    contentHtml: `<p class="placeholder-note">Placeholder entry, written to show the reading experience.</p>
<p>The Frances Journal is not a blog for search traffic. It is meant as an intimate archive: letters, reflections, women’s stories, and meaningful moments.</p>
<p>In time, this series will hold the stories of real women, told with their permission and in their own words. A first job. A move across the country. A child. A loss. A late beginning.</p>
<h2>How a story is kept</h2>
<p>Each story will be short, honest, and unhurried. There will be no before-and-after, because no one here needs correcting.</p>
${letterBlock}
<p>Placeholder: details on how to share a story with the house will appear here.</p>`,
  },
  {
    id: 'mock-article-6',
    handle: 'before-the-tapestry',
    title: 'Before the tapestry',
    excerpt: 'The first House Tapestry, MMXXVII, previews on November 8.',
    publishedAt: '2026-09-28T09:00:00Z',
    tags: ['The House'],
    author: 'Jessi Frances',
    image: images.letterConversation,
    contentHtml: `<p class="placeholder-note">Placeholder entry, written to show the reading experience.</p>
<p>Each year, the house will commission an illustrated chapter of its own story. The first is the 2027 House Tapestry, MMXXVII, which previews on November 8, 2026.</p>
<p>It is not a pattern to repeat on a box. It is closer to a family record: symbols that hold the history of the house, the life of the year, and the idea of becoming.</p>
<h2>Ten years, one work</h2>
<p>The connected ten-year masterwork is envisioned for MMXXVII through MMXXXVI. Every chapter will stay in the archive, so the whole can be read in order one day.</p>
<p>Placeholder: a note from the illustrator, Madi, may appear here once the artwork is shared.</p>`,
  },
]
