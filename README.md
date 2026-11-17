# Movement, Activity & Play

A free, browser-based prototype that helps preschool teachers find, prepare, and
lead movement activities for children ages 3–6.

**Live website:** https://martyyu1.github.io/MAP/

## Use locally

Open this folder in VS Code and launch `index.html` with Live Server or Live
Preview. No installation or build step is required.

## Included

- Thirteen activities across Locomotor and Object Control skills
- Search, classroom filters, difficulty levels, and effort labels
- Activity instructions, adaptations, Teach view, and Watch with the class
- Saved activities and a combined, printable materials checklist
- Optional island browsing and class stars
- Browser-local storage for saved activities, practiced status, recent activities,
  filters, and material check marks
- Responsive layouts for tablets, laptops, and phones

## Code structure

Activity content is in `activities.js`. Shared UI is in `components.js`,
storage logic is in `store.js`, and each screen has its own file in `screens/`.
`styles.css` contains the color tokens, layout, responsive, and print styles.
`app.js` handles navigation and user actions. Illustrations are local inline SVG.

## Prototype content

All activity content is placeholder material awaiting Dr. Palmer's review.
Videos, photos, thumbnails, and clips are explicitly marked placeholders.
Playback previews simulate time. The website stores progress in the current
browser and does not require an account.

## Hosting

GitHub Pages publishes the repository root on the `main` branch.
The `.nojekyll` file preserves this plain HTML, CSS, and JavaScript site.
