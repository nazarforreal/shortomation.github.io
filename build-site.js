// build-site.js
// Regenerates everything that depends on the blog posts or the site's identity:
//   - every blog post page (blog/<slug>/index.html) from post-template.html,
//     with the Markdown pre-rendered so crawlers and AI tools can read it
//   - the post list on blog/index.html (plain links, no JavaScript needed)
//   - the post URLs in sitemap.xml
//   - structured data (JSON-LD) on every page
//
// Usage (from anywhere): node build-site.js
// Add a post: create assets/posts/<slug>.md, add an entry to assets/posts.json, run this script.

const fs = require('fs');
const path = require('path');
const { marked } = require('./assets/marked.min.js');

const ROOT = __dirname;
const SITE = 'https://nazarzhmurko.com';
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => (p.startsWith('http') ? p : SITE + encodeURI(p));
const displayDate = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

// ---------- Identity (single source for all structured data) ----------
const SOCIAL = [
  'https://www.linkedin.com/in/nazar-zhmurko',
  'https://youtube.com/@nazarshortcuts',
  'https://www.threads.com/@notionshortcuts',
];
const ORG_ID = `${SITE}/#organization`;
const PERSON_ID = `${SITE}/about/#nazar`;
const WEBSITE_ID = `${SITE}/#website`;
const LOGO = abs('/assets/logo transparent.png');

const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Shortomation',
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: LOGO },
  description: 'Shortomation makes Apple Shortcuts kits, Notion templates, courses and consulting for Notion power users and teams.',
  email: 'support@nazarzhmurko.com',
  founder: { '@id': PERSON_ID },
  address: { '@type': 'PostalAddress', addressCountry: 'UA' },
  sameAs: [...SOCIAL, 'https://nazarzhmurko.gumroad.com'],
};
const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Nazar Zhmurko',
  url: `${SITE}/about/`,
  image: abs('/assets/about1.jpg'),
  jobTitle: 'Notion and Apple Shortcuts automation consultant',
  worksFor: { '@id': ORG_ID },
  sameAs: SOCIAL,
};
const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE}/`,
  name: 'Shortomation',
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
};
const breadcrumb = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + url })),
});
const webpage = (type, url, name, extra = {}) => ({
  '@type': type,
  '@id': `${SITE}${url}#webpage`,
  url: SITE + url,
  name,
  isPartOf: { '@id': WEBSITE_ID },
  publisher: { '@id': ORG_ID },
  inLanguage: 'en',
  ...extra,
});
const graph = (...nodes) => JSON.stringify({ '@context': 'https://schema.org', '@graph': [organization, website, ...nodes] }, null, 2);

// ---------- Posts ----------
const posts = JSON.parse(read('assets/posts.json')).posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
const template = read('post-template.html');

for (const post of posts) {
  const md = read(`assets/posts/${post.slug}.md`);
  const description = post.excerpt || post.title;
  const image = post.thumbnail ? abs(post.thumbnail) : LOGO;
  const url = `/blog/${post.slug}/`;
  const jsonld = graph(
    person,
    {
      '@type': 'BlogPosting',
      '@id': `${SITE}${url}#article`,
      headline: post.title,
      description,
      datePublished: post.date,
      image,
      url: SITE + url,
      mainEntityOfPage: SITE + url,
      inLanguage: 'en',
      author: { '@id': PERSON_ID },
      publisher: { '@id': ORG_ID },
    },
    breadcrumb([['Home', '/'], ['Blog', '/blog/'], [post.title, url]]),
  );
  const html = template
    .replace(/{{jsonld}}/g, jsonld)
    .replace(/{{content}}/g, marked.parse(md))
    .replace(/{{description}}/g, esc(description))
    .replace(/{{image}}/g, esc(image))
    .replace(/{{dateDisplay}}/g, displayDate(post.date))
    .replace(/{{slug}}/g, post.slug)
    .replace(/{{title}}/g, esc(post.title))
    .replace(/{{date}}/g, post.date);
  fs.mkdirSync(path.join(ROOT, 'blog', post.slug), { recursive: true });
  write(`blog/${post.slug}/index.html`, html);
}

// ---------- Blog index: static post cards ----------
const replaceBetween = (s, name, body) => {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(\\s*<!-- ${name}:end -->)`);
  if (!re.test(s)) throw new Error(`markers "${name}" not found`);
  return s.replace(re, `$1\n${body}$2`);
};
const card = (post) => `          <a href="/blog/${post.slug}/" class="card fade-in card--nav post-card" style="text-decoration:none; color:inherit; min-width:250px; max-width:400px; padding:2rem 1.5rem; background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04); border:1.5px solid #e0e7ef; display:flex; flex-direction:column; justify-content:flex-start;">
            <div style="flex:1 1 auto; display:flex; flex-direction:column; justify-content:flex-start;">
              <h3 style="margin-bottom:0.5rem; font-size:1.3rem; font-weight:600; line-height:1.25;">${esc(post.title)}</h3>
              <div class="post-date" style="font-size:0.98rem; margin-bottom:0.7rem;"><time datetime="${post.date}">${displayDate(post.date)}</time></div>
              <p style="font-size:1.08rem; color:#444; margin-bottom:0; line-height:1.45;">${esc(post.excerpt || '')}</p>
            </div>${post.thumbnail ? `
            <img src="${esc(post.thumbnail)}" alt="${esc(post.title)} thumbnail" class="post-thumbnail" style="margin-top:1.2rem; border-radius:14px; width:100%; max-width:320px; height:140px; object-fit:cover; align-self:center; background:#f7f7f7; box-shadow:0 1px 4px rgba(0,0,0,0.04);" loading="lazy">` : ''}
          </a>`;
let blogIndex = read('blog/index.html');
blogIndex = replaceBetween(blogIndex, 'posts', posts.length ? posts.map(card).join('\n') : '          <p>No posts yet. Check back soon!</p>');

// ---------- Sitemap ----------
let sitemap = read('sitemap.xml');
sitemap = replaceBetween(sitemap, 'posts', posts.map((p) => `  <url>\n    <loc>${SITE}/blog/${p.slug}/</loc>\n    <lastmod>${p.date}</lastmod>\n    <priority>0.60</priority>\n  </url>`).join('\n'));
write('sitemap.xml', sitemap);

// ---------- Structured data on static pages ----------
const pageSchema = {
  'index.html': graph(person, webpage('WebPage', '/', 'Shortomation – Notion Shortcuts, Kits, Courses & Consulting', { about: { '@id': ORG_ID } })),
  'shortcuts/index.html': graph(
    webpage('CollectionPage', '/shortcuts/', 'Notion Shortcut Kits', {
      description: 'Apple Shortcuts kits that automate Notion workspaces, sold on Gumroad.',
      relatedLink: 'https://nazarzhmurko.gumroad.com',
    }),
    breadcrumb([['Home', '/'], ['Shortcuts', '/shortcuts/']]),
  ),
  'courses/index.html': graph(
    {
      '@type': 'Course',
      name: 'Automate Notion with Siri Shortcuts: Master Notion API + ChatGPT API Integration',
      description: 'Unlock the full potential of Notion by integrating it with Siri Shortcuts and ChatGPT.',
      url: 'https://payhip.com/b/Bhb6T',
      inLanguage: 'en',
      provider: { '@id': ORG_ID },
      instructor: { '@id': PERSON_ID },
      image: abs('/assets/course-demo1.png'),
    },
    person,
    webpage('CollectionPage', '/courses/', 'Courses'),
    breadcrumb([['Home', '/'], ['Courses', '/courses/']]),
  ),
  'consulting/index.html': graph(
    {
      '@type': 'Service',
      name: 'Notion and Apple Shortcuts consulting',
      serviceType: 'Custom Notion shortcut kits and 1:1 coaching',
      description: 'Personalized Notion shortcut kits tailored to your workflows, plus 1:1 coaching and support for your Notion workspace.',
      url: `${SITE}/consulting/`,
      provider: { '@id': ORG_ID },
      areaServed: 'Worldwide',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Consulting services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Personalized Notion Shortcut Kits', description: 'Custom Notion shortcut kits tailored to your specific workflows.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '1:1 Coaching & Support', description: 'Personalized coaching and support to optimize your Notion workspace and workflows.' } },
        ],
      },
      potentialAction: { '@type': 'ReserveAction', target: 'https://forms.fillout.com/t/iEnwZ1fRnnus', name: 'Book an appointment' },
    },
    webpage('WebPage', '/consulting/', 'Notion Consulting'),
    breadcrumb([['Home', '/'], ['Consulting', '/consulting/']]),
  ),
  'about/index.html': graph(person, webpage('AboutPage', '/about/', 'About Nazar Zhmurko', { mainEntity: { '@id': PERSON_ID } }), breadcrumb([['Home', '/'], ['About', '/about/']])),
  'blog/index.html': graph(
    {
      '@type': 'Blog',
      '@id': `${SITE}/blog/#blog`,
      name: 'Shortomation Blog',
      url: `${SITE}/blog/`,
      publisher: { '@id': ORG_ID },
      author: { '@id': PERSON_ID },
      blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: p.date })),
    },
    person,
    breadcrumb([['Home', '/'], ['Blog', '/blog/']]),
  ),
  'privacy/index.html': graph(webpage('WebPage', '/privacy/', 'Privacy Policy'), breadcrumb([['Home', '/'], ['Privacy Policy', '/privacy/']])),
  'cookies/index.html': graph(webpage('WebPage', '/cookies/', 'Cookie Policy'), breadcrumb([['Home', '/'], ['Cookie Policy', '/cookies/']])),
};
for (const [file, json] of Object.entries(pageSchema)) {
  let s = file === 'blog/index.html' ? blogIndex : read(file);
  s = replaceBetween(s, 'schema', `  <script type="application/ld+json">\n${json}\n  </script>`);
  write(file, s);
}

console.log(`Built ${posts.length} posts, blog index, sitemap and structured data for ${Object.keys(pageSchema).length} pages.`);
