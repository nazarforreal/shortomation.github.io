const fs = require('fs');
const path = require('path');

function deletePost(slug) {
  // 1. Delete markdown file
  const mdPath = path.join(__dirname, 'assets', 'posts', `${slug}.md`);
  if (fs.existsSync(mdPath)) {
    fs.unlinkSync(mdPath);
    console.log(`Deleted markdown: ${mdPath}`);
  } else {
    console.log(`Markdown file not found: ${mdPath}`);
  }

  // 2. Remove from posts.json
  const jsonPath = path.join(__dirname, 'assets', 'posts.json');
  if (fs.existsSync(jsonPath)) {
    const postsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const before = postsData.posts.length;
    postsData.posts = postsData.posts.filter(post => post.slug !== slug);
    const after = postsData.posts.length;
    fs.writeFileSync(jsonPath, JSON.stringify(postsData, null, 2));
    if (before !== after) {
      console.log(`Removed post entry from posts.json: ${slug}`);
    } else {
      console.log(`No entry found in posts.json for slug: ${slug}`);
    }
  } else {
    console.log(`posts.json not found: ${jsonPath}`);
  }

  // 3. Delete HTML directory
  const htmlDir = path.join(__dirname, 'blog', slug);
  if (fs.existsSync(htmlDir)) {
    fs.rmSync(htmlDir, { recursive: true, force: true });
    console.log(`Deleted HTML directory: ${htmlDir}`);
  } else {
    console.log(`HTML directory not found: ${htmlDir}`);
  }
}

// Usage: node delete-post.js post1
const slug = process.argv[2];
if (!slug) {
  console.error('Please provide a post slug. Usage: node delete-post.js <slug>');
  process.exit(1);
}
deletePost(slug);