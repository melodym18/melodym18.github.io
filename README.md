# Melody Morel — Portfolio

My personal portfolio site, built with plain HTML, CSS and JavaScript and hosted on GitHub Pages.

Live site: https://melodym18.github.io

## How it's organized

```
index.html          Page layout and text (hero, about, skills, contact)
projects.json       All project content, one entry per project
css/style.css       Styles and colors
js/script.js        Builds the project cards from projects.json
images/projects/    Screenshots and recordings, one folder per project
documents/          Resume and project PDFs
```

## Adding a new project

1. Put the project's screenshots in a new folder, e.g. `images/projects/my-new-app/`.
2. Open `projects.json`, copy an existing entry, paste it where you want it in the list (order on the page follows the file), and update the text and image paths. Keep the commas between entries.
3. Commit and push. GitHub Pages updates the site in about a minute.

Fields in each entry:

| Field | What it is |
| --- | --- |
| `id` | Short unique name with no spaces, e.g. `my-new-app` |
| `title`, `kind`, `context`, `role` | Shown at the top of the card |
| `summary` | One or two sentences on the card |
| `tech` | List of technologies |
| `cover` | Main image: `{ "src": "...", "alt": "..." }`, or `null` for a text placeholder |
| `coverStyle` | Optional. `"phone"` frames a tall phone screenshot; `"contain"` shows a wide screenshot whole instead of cropping it |
| `media` | Images or videos shown in the case study. Videos use `"type": "video"` with an `.mp4` and a `poster` image |
| `galleryStyle` | Optional. `"phones"` for phone screenshots, `"wide"` for one large image |
| `overview`, `problem`, `learned` | Paragraphs in the case study |
| `contributions` | List of what you did |
| `teamNote` | Optional. Credits teammates on group projects |
| `highlights` | Optional. `{ "title": "...", "items": [ ... ] }` |
| `links` | Buttons, e.g. `{ "label": "View code", "url": "https://github.com/..." }` |

## Resume

Put the file at `documents/resume.pdf`. The resume buttons stay hidden until that file exists.

## Previewing locally

`projects.json` loads with `fetch`, which browsers block when you open `index.html` directly from your computer. Run a small local server from this folder instead:

```
python -m http.server
```

Then open http://localhost:8000. In VS Code, the Live Server extension does the same thing.
