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
- Storybook island covers and interactive maps, with a sliding explorer
- Optional island browsing and class stars
- Demo teacher login/logout and switching between Sunflower and Bluebird classes
- Separate practiced status and star totals for each class
- A sticky Class stars summary with the active class name when enabled
- Difficulty uses only its star count; hollow stars become solid after practice
- Undo accidental practice marks from Activity, Teach, or Saved; undo removes
  only the current class's mark and that activity's awarded stars
- Browser-local storage for saved activities, practiced status, recent activities,
  filters, and material check marks
- Responsive layouts for tablets, laptops, and phones

## Code structure

This release is stored locally as output v04.

Activity content is in `activities.js`. Shared UI is in `components.js`,
storage logic is in `store.js`, and each screen has its own file in `screens/`.
`styles.css` contains the color tokens, layout, responsive, and print styles.
`app.js` handles navigation and user actions. The island scenes and explorer are local PNG illustrations in assets/. Other
interface icons and activity placeholders use inline SVG.

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

## Island artwork

The Home covers and Island view share the same locally stored illustrations.
Locomotor uses pink blossom trees and hills with the rose-pink interface palette.
Object Control uses blue sea, a lagoon, and a lighthouse with the blue palette.
Activity names, stars, progress checks, paths, and controls remain live HTML/SVG.

The map keeps its proportions and readable activity labels on phones. Swipe
horizontally inside the map to explore. The surrounding page stays in one column.
Only the explorer slides, and reduced-motion preferences are respected.

Artwork was generated with the built-in image generation tool using the original
storybook islands and fox as visual references. See assets/artwork-notes.md for
the generation brief.


## Class stars

Help's Show class stars option controls the visibility of the sticky summary.
The total is calculated from every currently practiced activity in the active
class, including activities completed before enabling the summary. Each activity
contributes its difficulty number once. Undo removes that contribution immediately.
Changing classes displays that class's own total.

Difficulty is shown with one to four stars, without padding to four. Hollow stars
mean not yet practiced, and solid stars mean practiced in the active class.


## Activity naming

Activity titles use movement names and their practice format, such as Throwing to
a Target, Galloping, and Rolling to a Partner. Naming references the MAP Sessions
YouTube library, whose session titles use movement terms including Run, Gallop,
Hop, Throw, Roll, and Kick.

Source: https://www.youtube.com/playlist?list=PLxRvADrMevjgfUwo7tNqUGbZ_dB2WvTod

These are descriptive titles for the prototype's single-skill activities.
They are not verbatim session titles or verified one-to-one video mappings.
The stable activity IDs preserve saved lessons and class practice history.
