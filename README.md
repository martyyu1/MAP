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
- Demo teacher login/logout and switching between Sunflower and Bluebird classes
- Separate practiced status and optional star awards for each class
- Browser-local storage for saved activities, practiced status, recent activities,
  filters, and material check marks
- Responsive layouts for tablets, laptops, and phones

## Code structure

This release is stored locally as output v04.

Activity content is in `activities.js`. Shared UI is in `components.js`,
storage logic is in `store.js`, and each screen has its own file in `screens/`.
`styles.css` contains the color tokens, layout, responsive, and print styles.
`app.js` handles navigation and user actions. Illustrations are local inline SVG.

## Prototype content

All activity content is placeholder material awaiting Dr. Palmer's review.
Videos, photos, thumbnails, and clips are explicitly marked placeholders.
Playback previews simulate time. The website stores progress in the current
browser. Login is a demonstration account, matching the original prototype.
It does not create a real account or synchronize across devices. Saved activities
and preparation checklists are shared across classes. Existing practice history
from the previous version is preserved in Sunflower Class.

## Hosting

GitHub Pages publishes the repository root on the `main` branch.
The `.nojekyll` file preserves this plain HTML, CSS, and JavaScript site.
