const fs = require('fs');
const path = require('path');

const [,, slug, title, date] = process.argv;

if (!slug || !title || !date) {
  console.log('Usage: node create-post.js <slug> <title> <date:YYYY-MM-DD>');
  process.exit(1);
}

const template = fs.readFileSync('post-template.html', 'utf8')
  .replace(/{{slug}}/g, slug)
  .replace(/{{title}}/g, title)
  .replace(/{{date}}/g, date);

const postDir = path.join('shortomation.github.io', 'blog', slug);
fs.mkdirSync(postDir, { recursive: true });
fs.writeFileSync(path.join(postDir, 'index.html'), template);

const mdPath = path.join('shortomation.github.io', 'assets', 'posts', `${slug}.md`);
if (!fs.existsSync(mdPath)) {
  fs.writeFileSync(mdPath, `# ${title}\n\nYour content here.\n`);
}

console.log(`Created blog/${slug}/index.html and assets/posts/${slug}.md`);