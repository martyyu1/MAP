# Movement, Activity & Play

A free, browser-based prototype that helps preschool teachers find, prepare, and
lead movement activities for children ages 3–6.

**Published website:** https://martyyu1.github.io/MAP/

V05 is the current release.

## Use locally

Open this folder in VS Code and launch `index.html` with Live Server or Live
Preview. No installation or build step is required.

## Included

- All 49 playlist videos across 7 Locomotor skills and 8 Object Control skills
- Search, classroom filters, difficulty levels, and effort labels
- Activity instructions, adaptations, Teach view, and Watch with the class
- Saved activities and a combined, printable materials checklist
- Two-level storybook islands with distinct skill destinations and matching close-up scenes
- Drag, pinch zoom, keyboard panning, zoom buttons, and Fit island
- Island browsing and class stars
- Demo teacher login/logout and switching between Sunflower and Bluebird classes
- Separate practiced status and star totals for each class
- A sticky Class stars summary with the active class name after login
- Difficulty uses only its star count; hollow stars become solid after practice
- Undo accidental practice marks from Activity, Teach, or Saved; undo removes
  only the current class's mark and that activity's awarded stars
- Browser-local storage for saved activities, practiced status, recent activities,
  filters, and material check marks
- Responsive layouts for tablets, laptops, and phones

## Code structure

This release is stored locally as output v05. The v04 folder is preserved.

Activity content, verified playlist metadata, skill tags, and scene locations are in `activities.js`. Shared UI is in `components.js`,
storage logic is in `store.js`, and each screen has its own file in `screens/`.
`styles.css` contains the color tokens, layout, responsive, and print styles.
`app.js` handles navigation and user actions. The island scenes and explorer are local PNG illustrations in assets/. Other
interface icons and activity placeholders use inline SVG.

## Prototype content

Video titles, URLs, durations, and thumbnails come from the MAP Sessions playlist.
Classroom metadata, skill associations, teaching guidance, photos, and clips are
demonstration content awaiting Dr. Palmer's review.
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
Locomotor uses golden apricot trees, natural green foliage, and a soft orange interface palette.
Object Control uses blue sea, a lagoon, and a lighthouse with the blue palette.
Activity names, stars, progress checks, paths, and controls remain live HTML/SVG.

Drag inside the map to explore on phones and computers. Zoom controls and
Fit island adjust the camera. The surrounding page stays in one column. The
explorer slides into a selected skill destination, respecting reduced motion.

Artwork was generated with the built-in image generation tool using the original
storybook islands and fox as visual references. See assets/artwork-notes.md for
the generation brief.


## Class stars

The sticky class-star summary is always visible after login.
The total is calculated from every currently practiced activity in the active
class, including previously completed activities. Each activity
contributes its difficulty number once. Undo removes that contribution immediately.
Changing classes displays that class's own total.

Difficulty is shown with one to four stars, without padding to four. Hollow stars
mean not yet practiced, and solid stars mean practiced in the active class.


## Activity naming

Cards show the verified movement-pair title and MAP Session number. Each session
can be reached through either of its skill tags, with contextual demonstration
guidance for the selected skill.

Source: https://www.youtube.com/playlist?list=PLxRvADrMevjgfUwo7tNqUGbZ_dB2WvTod


## V05 exploration flow

A category opens in Island view. Find Lesson without a category opens the grid.
Each island destination represents a skill. Clicking a destination moves the fox there. Clicking the same destination again after arrival opens its scene and all matching lessons. A skill chip opens its scene directly. Grid remains available
at either level. All skills returns to the world map.

Locomotor has Run, Gallop, Hop, Jump, Leap, Skip, and Slide.
Object Control has Throw, Catch, Toss, Kick, Roll, Dribble, 1-Hand Strike,
and 2-Hand Strike.

The playlist has 49 distinct videos, including two videos with the same Session
28 title. Both are retained. Most videos contain one skill from each category,
so the same video can appear under two skills. Practice status, saving, and stars
refer to its canonical video record and are shared across those skill views.
Class practice records remain independent.

Skill associations follow words in the verified video titles and are provisional.
Classroom filters, difficulty, adaptations, teaching steps, and chapter timings
are demonstration content awaiting client review. The original 13 activity IDs
are retained where linked to the corresponding demonstration video records.
V05 uses a separate storage key and imports existing v04 data on first use
when both versions are served from the same browser origin.

The video cards use YouTube thumbnails and the activity page links to the
verified YouTube session. The in-page video/step preview remains a labeled
placeholder, as in the earlier prototype.

## V05 files and verification

- playlist-source.json records the 49 titles and source URLs read from the playlist.
- screens/island.js owns world-map rendering, close-up scenes, and camera gestures.
- assets/locomotor-places.png and assets/object-control-places.png are generated
  4-by-2 landmark atlases. Each skill uses one cell on both the world and its
  enlarged scene, so the place is visually consistent.
- Landmark generation used the built-in image generation tool and the existing
  islands as references. The brief specified pink woodland forest, bridge,
  cabin, lily pond, log crossing, orchard, and beach destinations for Locomotor.
  Object Control uses a target garden, catching pond, picnic clearing, goal
  meadow, riverbank, dribbling courtyard, equipment cottage, and lakeside dock.

Checks include 49 unique videos, all 15 skills, contextual lesson content,
shared per-video completion across skills, independent class progress, undo,
live filtering, default Island view, Grid switching, camera zoom/pan/reset,
desktop and phone layout, and application console health.


### Interface refinement
- Skill labels show only movement names and lesson progress.
- Review badges, star explanations and Help have been removed from the interface.
- Signed-in teachers always see class stars, with no visibility toggle.
- On the island, click a destination to move the fox and stay there. Click the same destination again after arrival to open lessons. Top skill tabs still open lessons directly.
