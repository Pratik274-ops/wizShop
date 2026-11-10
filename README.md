# WIZ SHOP — "Midnight Archive" theme

Plain HTML, CSS and JavaScript. No install or build step.

## Run it
Open the folder in VS Code and use the **Live Server** extension (right-click `index.html` > Open with Live Server), or just double-click `index.html`.

## Files
| File | What it does |
| --- | --- |
| `index.html` | All page content, including the product cards |
| `styles.css` | Theme colours (variables at the top), layout and responsive rules |
| `app.js` | Header, mobile menu, scroll reveals, hover-to-play product films |
| `assets/products/` | Product photos shown on the cards |
| `assets/video/` | Product films (play on hover / tap) and the hero film |
| `assets/logo.png` | Your logo |

## Edit a product
Each product is one `<article class="card">` block in `index.html`. Change the name and the line under it (material), and swap `assets/products/NAME.jpg` and `assets/video/NAME.mp4`.
`--pos:50% 100%` on `.card__media` chooses which part of the photo stays visible when it is cropped.

## Add a product
Copy a whole `<article class="card">...</article>` block into the right category's `<div class="cat__grid">`, then update the names and file paths. Update the "pieces" count in that category's `cat__count`.

## Change the look
Colours and fonts are the variables at the top of `styles.css` (`--ink`, `--champ`, `--serif`, `--sans`).

## Notes
- Names and material lines on the cards are placeholders. No prices are shown; each card has an "Enquire" link to the footer. Replace the `#` links in the footer with your real Instagram, WhatsApp and email.
- Videos are muted and compressed (about 0.5–0.9 MB each).
