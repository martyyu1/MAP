// All editorial content is placeholder content, pending Dr. Palmer's review.
const CATEGORIES = {
  Locomotor: { skills: ["Run", "Gallop", "Hop"], description: "Locomotor skills are how well a child moves their body through space, like running, galloping, and hopping. Watch for smooth, balanced movement. Short, frequent practice helps most." },
  "Object Control": { skills: ["Throw", "Roll", "Kick"], description: "Object control skills are how well a child sends or handles an object, like throwing, catching, kicking, and rolling a ball. Watch where the child's eyes and feet are pointed. Start practice with soft, light objects." }
};
const EQUIPMENT_HELP = "Things in my room means items like paper plates, tape, socks, or a ball.";
const CONTENT_NOTICE = "Placeholder activity content · To be reviewed by Dr. Palmer";
const ABOUT_MAP = "MAP was developed by Dr. Kara Palmer at the University of Michigan School of Kinesiology to help young children build foundational movement skills through activities that fit into classroom routines. Videos teach each skill, teachers guide practice, and children practice. Free to use. Log in to track practice for each class.";
const FILTER_FIELDS = [
  { key: "group", label: "Group size", options: [["", "Any"], ["Small group", "Small group"], ["Whole class", "Whole class"]] },
  { key: "space", label: "Space", options: [["", "Any"], ["Indoor", "Indoor"], ["Outdoor", "Outdoor"]] },
  { key: "time", label: "Time", options: [["", "Any"], ["10", "≤10 min"], ["15", "≤15 min"], ["20", "≤20 min"]] },
  { key: "equipment", label: "Equipment", options: [["", "Any"], ["Nothing needed", "Nothing needed"], ["Things in my room", "Things in my room"], ["Needs gathering", "Needs gathering"]] }
];
// Supply approved video URLs, timestamps, and images here when they are available.
// Movement-first titles reference the MAP Sessions vocabulary (Run, Gallop,
// Hop, Throw, Roll, Kick). IDs stay stable for existing saved/class records.
const rawActivities = [
  ["feed-the-fish", "Throwing to a Target", "Throw", 2, "Low", 15, "Either", "Things in my room", "Small group", [["Beanbags", "Rolled socks"], ["Basket", "Box"], ["Tape", "A visible floor line"]]],
  ["sea-star-toss", "Throwing to Floor Targets", "Throw", 2, "Medium", 10, "Indoor", "Things in my room", "Small group", [["Paper plates", "Paper squares"], ["Beanbags", "Rolled socks"]]],
  ["splash-target", "Outdoor Target Throwing", "Throw", 3, "Medium", 10, "Outdoor", "Things in my room", "Small group", [["Beanbags", "Rolled socks"], ["Box", "Hoop if available"]]],
  ["sea-creature-gallop", "Galloping", "Gallop", 2, "High", 10, "Either", "Things in my room", "Whole class", [["Tape", "Cones if available"]]],
  ["seahorse-race", "Galloping Across a Space", "Gallop", 3, "High", 10, "Either", "Nothing needed", "Whole class", []],
  ["lily-pad-hop", "Hopping Between Markers", "Hop", 3, "Medium", 10, "Indoor", "Things in my room", "Small group", [["Paper plates", "Hoops if available"]]],
  ["stepping-stones", "Single-Leg Hopping", "Hop", 2, "Low", 10, "Indoor", "Things in my room", "Small group", [["Paper plates", "Tape marks"]]],
  ["rolling-waves", "Rolling to a Partner", "Roll", 1, "Low", 10, "Indoor", "Things in my room", "Small group", [["Playground ball", "Soft ball"]]],
  ["turtle-roll", "Controlled Ball Rolling", "Roll", 2, "Low", 10, "Indoor", "Things in my room", "Small group", [["Soft ball", "Playground ball"]]],
  ["treasure-kick", "Kicking into a Goal", "Kick", 2, "Medium", 15, "Outdoor", "Needs gathering", "Whole class", [["Ball", "Soft ball"], ["Cones", "Hoops laid flat"]]],
  ["tide-kick", "Target Kicking", "Kick", 3, "Medium", 10, "Outdoor", "Needs gathering", "Whole class", [["Ball", "Soft ball"], ["Cones", "Hoops laid flat"]]],
  ["dolphin-dash", "Running and Stopping", "Run", 1, "High", 10, "Outdoor", "Nothing needed", "Whole class", []],
  ["wave-chase", "Running to a Finish Line", "Run", 2, "Medium", 10, "Either", "Nothing needed", "Whole class", []]
];
const skillContent = {
  Run: {
    goal: "Run with balanced steps and stop with control.",
    setup: "Choose a clear running area with a start and finish point. Leave space between children.",
    steps: [["Ready position", "Stand at the start with eyes looking ahead.", "Eyes ahead!"], ["Bend your arms", "Keep elbows bent and arms relaxed.", "Arms ready!"], ["Run to the shore", "Run forward with alternating arms and legs.", "Run to the shore!"], ["Slow and stop", "Take smaller steps to slow down and stop.", "Little steps, then freeze!"]],
    easier: ["Shorten the distance.", "Start with a brisk walk."],
    challenge: ["Change direction at the teacher's signal.", "Practice a controlled stop at different points."]
  },
  Gallop: {
    goal: "Keep the same foot in front while galloping.",
    setup: "Choose a clear path and identify the start and finish.",
    steps: [["Lead foot forward", "Choose one foot to stay in front.", "Front foot is the leader!"], ["Step and catch up", "Step forward and bring the back foot toward the front foot.", "Step, catch up!"], ["Find the rhythm", "Repeat the step-together pattern with a gentle bounce.", "Step and bounce!"], ["Gallop across", "Travel across the space without changing the lead foot.", "Gallop to the other side!"]],
    easier: ["Shorten the distance.", "Practice the step-together pattern slowly."],
    challenge: ["Try leading with the other foot.", "Follow a gently curving path."]
  },
  Hop: {
    goal: "Take off and land on the same foot with balance.",
    setup: "Place paper plates on the floor with a short gap between them. Leave clear space around each child.",
    steps: [["Pick a foot", "Stand on one foot and stretch your arms out.", "One foot ready!"], ["Bend and push", "Bend the standing knee and push off gently.", "Bend and spring!"], ["Land softly", "Return to the same foot with a soft knee.", "Soft landing!"], ["Hop again", "Try another hop, then pause and switch feet.", "Hop, stop, swap!"]],
    easier: ["Make the gaps smaller.", "Offer an adult's hand for balance."],
    challenge: ["Link three hops together.", "Increase the gap slightly while keeping a soft landing."]
  },
  Throw: {
    goal: "Step with the opposite foot when throwing.",
    setup: "Place a target a few steps beyond a clear throwing line.",
    steps: [["Stand sideways", "Turn your side toward the target.", "Side to the target!"], ["Arm back", "Move the throwing arm behind your body.", "Arm way back!"], ["Step and throw", "Step with the opposite foot as the arm moves forward.", "Step and throw!"], ["Follow through", "Let the arm continue toward the target.", "Point at the target!"]],
    easier: ["Move the target closer.", "Use a larger target and a soft, light object."],
    challenge: ["Move the target a little farther away.", "Try a smaller target."]
  },
  Roll: {
    goal: "Send a ball along the floor toward a partner or target.",
    setup: "Pair children with clear rolling lanes and a few steps between partners.",
    steps: [["Face your friend", "Look at your partner and hold the ball.", "Eyes on your friend!"], ["Bend down", "Bend your knees and lower the ball.", "Low to the floor!"], ["Swing and roll", "Move your arm forward and release close to the floor.", "Swing and roll!"], ["Ready to receive", "Open your hands and stop the returning ball.", "Hands ready!"]],
    easier: ["Bring partners closer together.", "Use a larger, slower ball."],
    challenge: ["Increase the distance between partners.", "Roll through a narrower space."]
  },
  Kick: {
    goal: "Place the non-kicking foot beside the ball and kick toward a target.",
    setup: "Use cones to mark a wide goal and leave clear space around each ball.",
    steps: [["Find the target", "Look toward the goal, then at the ball.", "Find your treasure!"], ["Foot beside the ball", "Place your non-kicking foot next to the ball.", "Plant your foot!"], ["Swing and kick", "Swing the other leg forward to contact the ball.", "Swing and kick!"], ["Follow the kick", "Let the kicking leg move toward the goal.", "Point to the treasure!"]],
    easier: ["Make the goal wider.", "Move the ball closer to the goal."],
    challenge: ["Make the goal narrower.", "Try kicking from a little farther away."]
  }
};
const activityOverrides = {
  "feed-the-fish": {
    goal: "Step with the opposite foot when throwing.",
    setup: "Put a tape line on the floor and the basket a few steps away.",
    chapters: [[0, "Intro"], [12, "Stand sideways"], [25, "Arm back"], [38, "Step with opposite foot"], [52, "Follow through"]],
    steps: [["Side to the fish", "Turn sideways toward the basket before you begin.", "Side to the fish!"], ["Arm way back", "Bring your throwing arm behind your body.", "Arm way back!"], ["Step and throw", "Step with the opposite foot as you throw toward the basket.", "Step and throw!"], ["Point at the fish", "Let your arm finish pointing toward the basket.", "Point at the fish!"]],
    easier: ["Move the basket to 1 m.", "Use a bigger, lighter object.", "Give hand over hand help for the arm swing."],
    easierGood: "Children who are new to throwing.",
    challenge: ["Step back to 3 m.", "Use a smaller target.", 'Count "fish fed" as a class.'],
    challengeGood: "Children who throw smoothly."
  },
  "sea-creature-gallop": {
    goal: "Keep the same foot in front while galloping.",
    setup: "Mark a start line and a finish line about 8 m apart.",
    chapters: [[0, "Intro"], [14, "Lead foot forward"], [30, "Step together"], [48, "Gallop across"]],
    steps: [["Lead foot forward", "Place one foot in front and let it lead.", "Front foot is the leader!"], ["Step and catch up", "Step forward and bring the back foot toward the lead foot.", "Step, catch up!"], ["Bounce like a seahorse", "Add a gentle bounce to the step-together rhythm.", "Bounce like a seahorse!"], ["Gallop across", "Keep the same foot in front as you travel to the finish.", "Gallop to the other side!"]],
    easier: ["Shorten the distance to 4 m.", "Hold an adult's hand while galloping.", "Practice step together slowly without the bounce."],
    easierGood: "Children who are not yet keeping one foot in front.",
    challenge: ["Switch the lead foot halfway across.", "Gallop around cones in a zigzag.", "Gallop to a drum beat that speeds up."],
    challengeGood: "Children who gallop smoothly with either foot."
  },
  "seahorse-race": { setup: "Use existing room landmarks as a start and finish. Keep each child's path clear." },
  "wave-chase": { setup: "Choose a clear open space. Children follow the teacher's walking and running signals." },
  "splash-target": { setup: "Place a box outside beyond a throwing line. A hoop can replace the box if available." },
  "sea-star-toss": { setup: "Lay paper plates on the floor as targets, with space for each child's throw." },
  "turtle-roll": { setup: "Choose a clear lane. Children roll a soft ball slowly to a partner." }
};
const activities = rawActivities.map(([id, name, skill, difficulty, effort, duration, space, equipment, group, materials]) => {
  const content = { ...skillContent[skill], ...activityOverrides[id] };
  const category = ["Run", "Gallop", "Hop"].includes(skill) ? "Locomotor" : "Object Control";
  return {
    id, name, category, skill, difficulty, effort, duration, space, equipment, group,
    placeholder: true, goal: content.goal, setup: content.setup,
    materials: materials.map(([name, substitution]) => ({ name, substitution })),
    video: { length: 65, url: null, chapters: (content.chapters ?? [[0, "Intro"], [15, "Get ready"], [30, "Try the movement"], [48, "Practice together"]]).map(([time, label]) => ({ time, label, thumbnail: null })) },
    steps: content.steps.map(([title, text, cue]) => ({ title, text, cue, photo: null, clip: null })),
    easier: content.easier, challenge: content.challenge,
    easierGood: content.easierGood ?? "Children who are learning this movement.",
    challengeGood: content.challengeGood ?? "Children who perform the movement with control.",
    handout: "Placeholder setup handout",
    related: rawActivities.filter(row => row[2] === skill && row[0] !== id).map(row => row[0])
  };
});
