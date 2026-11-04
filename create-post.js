// create-post.js
// Usage: node create-post.js <slug> "<title>" <YYYY-MM-DD> ["<excerpt>"] [thumbnail-path]
// Creates assets/posts/<slug>.md (if missing), adds the post to assets/posts.json,
// then runs build-site.js to generate the post page, blog list, sitemap and structured data.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const [,, slug, title, date, excerpt = '', thumbnail = null] = process.argv;

if (!slug || !title || !/^\d{4}-\d{2}-\d{2}$/.test(date || '')) {
  console.log('Usage: node create-post.js <slug> "<title>" <YYYY-MM-DD> ["<excerpt>"] [thumbnail-path]');
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.log('Use a lowercase, hyphenated slug made of readable words, e.g. notion-automation-ideas');
  process.exit(1);
}

const ROOT = __dirname;
const mdPath = path.join(ROOT, 'assets', 'posts', `${slug}.md`);
if (!fs.existsSync(mdPath)) fs.writeFileSync(mdPath, `Your content here.\n`);

const indexPath = path.join(ROOT, 'assets', 'posts.json');
const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const entry = { slug, title, excerpt, thumbnail, date };
const existing = data.posts.findIndex((p) => p.slug === slug);
if (existing >= 0) data.posts[existing] = { ...data.posts[existing], ...entry };
else data.posts.push(entry);
fs.writeFileSync(indexPath, JSON.stringify(data, null, 2) + '\n');

execFileSync(process.execPath, [path.join(ROOT, 'build-site.js')], { stdio: 'inherit' });
console.log(`Post "${title}" is at blog/${slug}/. Write it in assets/posts/${slug}.md, then run: node build-site.js`);
