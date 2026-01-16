# Adding Products to the Shortcuts Gallery

This guide explains how to add new Payhip products to your Shortcuts gallery page.

## Quick Start

1. Open `/shortcuts/index.html`
2. Find the `<!-- ADD MORE PRODUCTS HERE -->` comment
3. Copy any existing product card
4. Paste it and update the details
5. Save and refresh your browser

## Detailed Instructions

### Step 1: Get Your Payhip Embed Code

1. **Log into Payhip**: Go to [payhip.com](https://payhip.com) and sign in
2. **Navigate to Products**: Click on "Products" in your dashboard
3. **Select Your Product**: Find the product you want to add and click on it
4. **Get Embed Code**:
   - Click the "Share / Embed" button
   - Select the "**Embed Page**" tab (not "Embed Button")
   - You'll see code that looks like:
     ```html
     <div class="payhip-embed-page" data-key="MdN0h">...</div>
     <script type="text/javascript" src="https://payhip.com/embed-page.js?v=24u68984"></script>
     ```
5. **Copy the data-key**: You only need the `data-key` value (e.g., "MdN0h")
   - The script is already included in the page header, so you don't need to copy it again

### Step 2: Add a New Product Card

1. **Open the file**: `/shortcuts/index.html`

2. **Find the product gallery section**: Look for the `<div class="product-gallery">` section

3. **Copy an existing product card**: Find any product card (the entire `<div class="product-card fade-in">...</div>` block) and copy it

4. **Paste it**: Paste the copied code inside the `product-gallery` div, preferably near the `<!-- ADD MORE PRODUCTS HERE -->` comment

5. **Update the product details**:

   ```html
   <div class="product-card fade-in">
     <div class="product-card__content">
       <!-- Update the title -->
       <h3>Your Product Title</h3>
       <!-- Update the description -->
       <p>Your product description goes here. Keep it concise and compelling!</p>
     </div>
     <div class="product-card__embed">
       <!-- Paste your Payhip data-key here -->
       <div class="payhip-embed-page" data-key="YOUR_KEY"></div>
     </div>
   </div>
   ```

### Step 3: Product Images

**Note**: When using Payhip's embed-page format, the product images, descriptions, and pricing are automatically pulled from your Payhip product page. You don't need to add separate images to the HTML.

The embed will display:
- Product cover image (from Payhip)
- Product title and description (from Payhip)
- Price and "Buy Now" button (from Payhip)
- All styling is handled by Payhip's embed

### Step 4: Test Your Changes

1. **Save the file**: Save `index.html`
2. **Open in browser**: Navigate to `http://localhost:8000/shortcuts/` (or your local server)
3. **Check the layout**:
   - Does the product card appear correctly?
   - Is the image displaying properly?
   - Does the Payhip button work when clicked?
4. **Test responsive design**:
   - Resize your browser window
   - Check mobile view (should show 1 column)
   - Check tablet view (should show 2 columns)
   - Check desktop view (should show 3 columns)

## Example: Complete Product Card

Here's a complete example with all elements filled in:

```html
<div class="product-card fade-in">
  <div class="product-card__content">
    <h3>Productivity Shortcuts Kit</h3>
    <p>Boost your productivity with 50+ carefully crafted Notion shortcuts. Perfect for professionals who want to work faster and smarter.</p>
  </div>
  <div class="product-card__embed">
    <div class="payhip-embed-page" data-key="ABC123"></div>
  </div>
</div>
```

## Alternative: Link to Payhip Store

If you prefer not to use embeds, you can create simple cards that link to your Payhip store:

```html
<div class="product-card__embed">
  <a href="https://payhip.com/ShortomationStore" class="btn btn--primary" target="_blank">View on Payhip</a>
</div>
```

This is useful when:
- You want a simpler, faster-loading page
- You prefer managing all product details on Payhip
- You want to drive traffic to your main store page

## Troubleshooting

### Payhip Embed Not Displaying
- **Check the script**: Ensure `<script type="text/javascript" src="https://payhip.com/embed-page.js?v=24u68984"></script>` is in the `<head>` section
- **Verify data-key**: Make sure the `data-key` value matches your actual Payhip product key
- **Check product visibility**: Ensure the product is set to "Visible" in your Payhip dashboard
- **Wait for load**: The embed may take a moment to load - check your browser's network tab for errors


### Layout Issues
- **Missing closing tags**: Ensure all `<div>` tags are properly closed
- **Extra spaces**: Remove any extra whitespace that might break the layout
- **Browser cache**: Try hard-refreshing (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Grid Not Responsive
- **Check CSS**: Ensure `/assets/style.css` is properly linked
- **Clear cache**: Browser cache might be showing old styles
- **Inspect element**: Use browser dev tools to check if styles are being applied

## Tips for Success

1. **Keep descriptions concise**: Aim for 1-2 sentences per product
2. **Use high-quality images**: Clear, professional images increase conversions
3. **Consistent naming**: Use a consistent naming pattern for product images
4. **Test on mobile**: Most visitors will view on mobile devices
5. **Update regularly**: Keep your product offerings fresh and up-to-date

## Need Help?

If you run into issues:
1. Check the HTML comments in `index.html` for inline guidance
2. Review this documentation
3. Inspect the browser console for JavaScript errors
4. Check Payhip's documentation: [payhip.com/help](https://payhip.com/help)

---

**Last Updated**: January 2026
