// All editorial content is placeholder content, pending Dr. Palmer's review.
const CATEGORIES = {
  Locomotor: { skills: ["Run", "Gallop", "Hop", "Jump", "Leap", "Skip", "Slide"], description: "Locomotor skills are how well a child moves their body through space, like running, galloping, and hopping. Watch for smooth, balanced movement. Short, frequent practice helps most." },
  "Object Control": { skills: ["Throw", "Catch", "Toss", "Kick", "Roll", "Dribble", "1-Hand Strike", "2-Hand Strike"], description: "Object control skills are how well a child sends or handles an object, like throwing, catching, kicking, and rolling a ball. Watch where the child's eyes and feet are pointed. Start practice with soft, light objects." }
};
const EQUIPMENT_HELP = "Things in my room means items like paper plates, tape, socks, or a ball.";
const ABOUT_MAP = "MAP was developed by Dr. Kara Palmer at the University of Michigan School of Kinesiology to help young children build foundational movement skills through activities that fit into classroom routines. Videos teach each skill, teachers guide practice, and children practice. Free to use. Log in to track practice for each class.";
const FILTER_FIELDS = [
  { key: "group", label: "Group size", options: [["", "Any"], ["Small group", "Small group"], ["Whole class", "Whole class"]] },
  { key: "space", label: "Space", options: [["", "Any"], ["Indoor", "Indoor"], ["Outdoor", "Outdoor"]] },
  { key: "time", label: "Time", options: [["", "Any"], ["under-5", "<5 min"], ["5-10", "5–10 min"], ["10-20", "10–20 min"]] },
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

// Additional movement guidance is provisional demonstration content.
skillContent["Slide"] = {"goal": "Move sideways without crossing your feet.", "setup": "Choose a clear practice space and leave room between children.", "steps": [["Face forward", "Demonstrate the movement slowly, then invite children to try it together.", "Eyes ahead!"], ["Step to the side", "Demonstrate the movement slowly, then invite children to try it together.", "Step sideways!"], ["Bring feet together", "Demonstrate the movement slowly, then invite children to try it together.", "Together!"], ["Slide across", "Demonstrate the movement slowly, then invite children to try it together.", "Slide to the other side!"]], "easier": ["Practice slowly with an adult's demonstration.", "Shorten the travel distance and pause between movements."], "challenge": ["Link several controlled repetitions together.", "Try the movement over a longer distance or with a more precise target."]};
skillContent["Jump"] = {"goal": "Take off and land with both feet together.", "setup": "Choose a clear practice space and leave room between children.", "steps": [["Feet together", "Demonstrate the movement slowly, then invite children to try it together.", "Two feet ready!"], ["Bend your knees", "Demonstrate the movement slowly, then invite children to try it together.", "Bend low!"], ["Push and jump", "Demonstrate the movement slowly, then invite children to try it together.", "Jump up!"], ["Land softly", "Demonstrate the movement slowly, then invite children to try it together.", "Soft landing!"]], "easier": ["Practice slowly with an adult's demonstration.", "Shorten the travel distance and pause between movements."], "challenge": ["Link several controlled repetitions together.", "Try the movement over a longer distance or with a more precise target."]};
skillContent["Leap"] = {"goal": "Take off from one foot and land on the other.", "setup": "Choose a clear practice space and leave room between children.", "steps": [["Find clear space", "Demonstrate the movement slowly, then invite children to try it together.", "Space ready!"], ["Step and push", "Demonstrate the movement slowly, then invite children to try it together.", "Push off!"], ["Reach forward", "Demonstrate the movement slowly, then invite children to try it together.", "Reach across!"], ["Land on the other foot", "Demonstrate the movement slowly, then invite children to try it together.", "Other foot lands!"]], "easier": ["Practice slowly with an adult's demonstration.", "Shorten the travel distance and pause between movements."], "challenge": ["Link several controlled repetitions together.", "Try the movement over a longer distance or with a more precise target."]};
skillContent["Skip"] = {"goal": "Alternate a step and a hop with a steady rhythm.", "setup": "Choose a clear practice space and leave room between children.", "steps": [["Step forward", "Demonstrate the movement slowly, then invite children to try it together.", "Step!"], ["Hop on that foot", "Demonstrate the movement slowly, then invite children to try it together.", "Hop!"], ["Change feet", "Demonstrate the movement slowly, then invite children to try it together.", "Switch feet!"], ["Repeat the rhythm", "Demonstrate the movement slowly, then invite children to try it together.", "Step, hop, step, hop!"]], "easier": ["Practice slowly with an adult's demonstration.", "Shorten the travel distance and pause between movements."], "challenge": ["Link several controlled repetitions together.", "Try the movement over a longer distance or with a more precise target."]};
skillContent["Catch"] = {"goal": "Watch an approaching ball and receive it with both hands.", "setup": "Choose a clear practice space and leave room between children.", "steps": [["Face your partner", "Demonstrate the movement slowly, then invite children to try it together.", "Eyes on your friend!"], ["Hands ready", "Demonstrate the movement slowly, then invite children to try it together.", "Hands ready!"], ["Watch the ball", "Demonstrate the movement slowly, then invite children to try it together.", "Watch it come!"], ["Bring it in", "Demonstrate the movement slowly, then invite children to try it together.", "Catch and hug!"]], "easier": ["Practice slowly with an adult's demonstration.", "Use a shorter distance or a larger, lighter ball."], "challenge": ["Link several controlled repetitions together.", "Try the movement over a longer distance or with a more precise target."]};
skillContent["Toss"] = {"goal": "Send a soft object forward with an underhand swing.", "setup": "Choose a clear practice space and leave room between children.", "steps": [["Face the target", "Demonstrate the movement slowly, then invite children to try it together.", "Find the target!"], ["Arm down and back", "Demonstrate the movement slowly, then invite children to try it together.", "Arm down!"], ["Step and swing", "Demonstrate the movement slowly, then invite children to try it together.", "Step and swing!"], ["Release toward the target", "Demonstrate the movement slowly, then invite children to try it together.", "Send it forward!"]], "easier": ["Practice slowly with an adult's demonstration.", "Use a shorter distance or a larger, lighter ball."], "challenge": ["Link several controlled repetitions together.", "Try the movement over a longer distance or with a more precise target."]};
skillContent["Dribble"] = {"goal": "Push a ball down and control its rebound.", "setup": "Choose a clear practice space and leave room between children.", "steps": [["Stand with space", "Demonstrate the movement slowly, then invite children to try it together.", "Room to bounce!"], ["Hold the ball", "Demonstrate the movement slowly, then invite children to try it together.", "Ball ready!"], ["Push toward the floor", "Demonstrate the movement slowly, then invite children to try it together.", "Push down!"], ["Meet the bounce", "Demonstrate the movement slowly, then invite children to try it together.", "Catch the bounce!"]], "easier": ["Practice slowly with an adult's demonstration.", "Use a shorter distance or a larger, lighter ball."], "challenge": ["Link several controlled repetitions together.", "Try the movement over a longer distance or with a more precise target."]};
skillContent["1-Hand Strike"] = {"goal": "Contact a light ball with one hand or a paddle.", "setup": "Choose a clear practice space and leave room between children.", "steps": [["Stand beside the ball", "Demonstrate the movement slowly, then invite children to try it together.", "Stand ready!"], ["Eyes on the ball", "Demonstrate the movement slowly, then invite children to try it together.", "Watch the ball!"], ["Swing one hand", "Demonstrate the movement slowly, then invite children to try it together.", "Swing one hand!"], ["Follow through", "Demonstrate the movement slowly, then invite children to try it together.", "Point forward!"]], "easier": ["Practice slowly with an adult's demonstration.", "Use a shorter distance or a larger, lighter ball."], "challenge": ["Link several controlled repetitions together.", "Try the movement over a longer distance or with a more precise target."]};
skillContent["2-Hand Strike"] = {"goal": "Use both hands to swing toward a ball.", "setup": "Choose a clear practice space and leave room between children.", "steps": [["Hands together", "Demonstrate the movement slowly, then invite children to try it together.", "Two hands ready!"], ["Stand sideways", "Demonstrate the movement slowly, then invite children to try it together.", "Side to the ball!"], ["Watch and swing", "Demonstrate the movement slowly, then invite children to try it together.", "Watch and swing!"], ["Follow through", "Demonstrate the movement slowly, then invite children to try it together.", "Finish forward!"]], "easier": ["Practice slowly with an adult's demonstration.", "Use a shorter distance or a larger, lighter ball."], "challenge": ["Link several controlled repetitions together.", "Try the movement over a longer distance or with a more precise target."]};

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
const legacyActivities = rawActivities.map(([id, name, skill, difficulty, effort, duration, space, equipment, group, materials]) => {
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

// Verified playlist titles and links. Skills and classroom metadata are demo classifications.
const mapSessions = [
  {
    "videoId": "xMKbTy5DbFI",
    "name": "Run & Throw",
    "sessionTitle": "MAP Session 1 Run & Throw",
    "sessionNumber": 1,
    "skillTags": [
      "Run",
      "Throw"
    ],
    "seconds": 173,
    "playlistPosition": 1
  },
  {
    "videoId": "nMGVVV_KrBU",
    "name": "Catch & Gallop",
    "sessionTitle": "MAP Session 2 Catch & Gallop",
    "sessionNumber": 2,
    "skillTags": [
      "Catch",
      "Gallop"
    ],
    "seconds": 181,
    "playlistPosition": 2
  },
  {
    "videoId": "NJ5f_OYY9Ac",
    "name": "Slide & Toss",
    "sessionTitle": "MAP Session 3 Slide & Toss",
    "sessionNumber": 3,
    "skillTags": [
      "Slide",
      "Toss"
    ],
    "seconds": 203,
    "playlistPosition": 3
  },
  {
    "videoId": "cAH_BksQCrc",
    "name": "Kick & Hop",
    "sessionTitle": "MAP Session 4 Kick & Hop",
    "sessionNumber": 4,
    "skillTags": [
      "Kick",
      "Hop"
    ],
    "seconds": 193,
    "playlistPosition": 4
  },
  {
    "videoId": "9Wax-11jqvY",
    "name": "Jump & Roll",
    "sessionTitle": "MAP Session 5 Jump & Roll",
    "sessionNumber": 5,
    "skillTags": [
      "Jump",
      "Roll"
    ],
    "seconds": 180,
    "playlistPosition": 5
  },
  {
    "videoId": "34KE0614DBE",
    "name": "Dribble & Leap",
    "sessionTitle": "MAP Session 6 Dribble & Leap",
    "sessionNumber": 6,
    "skillTags": [
      "Dribble",
      "Leap"
    ],
    "seconds": 184,
    "playlistPosition": 6
  },
  {
    "videoId": "BhD6AUK1vf4",
    "name": "Skip & 1 Hand Strike",
    "sessionTitle": "MAP Session 7 Skip & 1 Hand Strike",
    "sessionNumber": 7,
    "skillTags": [
      "Skip",
      "1-Hand Strike"
    ],
    "seconds": 184,
    "playlistPosition": 7
  },
  {
    "videoId": "i8kE88VqSC0",
    "name": "2 Hand Strike & Run",
    "sessionTitle": "MAP Session 8 2 Hand Strike & Run",
    "sessionNumber": 8,
    "skillTags": [
      "2-Hand Strike",
      "Run"
    ],
    "seconds": 189,
    "playlistPosition": 8
  },
  {
    "videoId": "tjlp3UT2Z2w",
    "name": "Gallop & Throw",
    "sessionTitle": "MAP Session 9 Gallop & Throw",
    "sessionNumber": 9,
    "skillTags": [
      "Gallop",
      "Throw"
    ],
    "seconds": 173,
    "playlistPosition": 9
  },
  {
    "videoId": "1O5r_LXLeXY",
    "name": "Catch & Slide",
    "sessionTitle": "MAP Session 10 Catch & Slide",
    "sessionNumber": 10,
    "skillTags": [
      "Catch",
      "Slide"
    ],
    "seconds": 194,
    "playlistPosition": 10
  },
  {
    "videoId": "OamL7n1jiec",
    "name": "Hop & Toss",
    "sessionTitle": "MAP Session 11 Hop & Toss",
    "sessionNumber": 11,
    "skillTags": [
      "Hop",
      "Toss"
    ],
    "seconds": 194,
    "playlistPosition": 11
  },
  {
    "videoId": "pLiGg1plG3k",
    "name": "Kick & Jump",
    "sessionTitle": "MAP Session 12 Kick & Jump",
    "sessionNumber": 12,
    "skillTags": [
      "Kick",
      "Jump"
    ],
    "seconds": 181,
    "playlistPosition": 12
  },
  {
    "videoId": "erGTVRctM2Y",
    "name": "Leap & Roll",
    "sessionTitle": "MAP Session 13 Leap & Roll",
    "sessionNumber": 13,
    "skillTags": [
      "Leap",
      "Roll"
    ],
    "seconds": 181,
    "playlistPosition": 13
  },
  {
    "videoId": "z8lgoldBE2s",
    "name": "Dribble & Skip",
    "sessionTitle": "MAP Session 14 Dribble & Skip",
    "sessionNumber": 14,
    "skillTags": [
      "Dribble",
      "Skip"
    ],
    "seconds": 181,
    "playlistPosition": 14
  },
  {
    "videoId": "UTycHoLJ3jo",
    "name": "Run & 1 Hand Strike",
    "sessionTitle": "MAP Session 15 Run & 1 Hand Strike",
    "sessionNumber": 15,
    "skillTags": [
      "Run",
      "1-Hand Strike"
    ],
    "seconds": 188,
    "playlistPosition": 15
  },
  {
    "videoId": "LQz_YqDpT3M",
    "name": "2 Hand Strike & Gallop",
    "sessionTitle": "MAP Session 16 2 Hand Strike & Gallop",
    "sessionNumber": 16,
    "skillTags": [
      "2-Hand Strike",
      "Gallop"
    ],
    "seconds": 189,
    "playlistPosition": 16
  },
  {
    "videoId": "sf1s2Kg5O9I",
    "name": "Slide & Throw",
    "sessionTitle": "MAP Session 17 Slide & Throw",
    "sessionNumber": 17,
    "skillTags": [
      "Slide",
      "Throw"
    ],
    "seconds": 185,
    "playlistPosition": 17
  },
  {
    "videoId": "_eWo9Y6HAbs",
    "name": "Catch & Hop",
    "sessionTitle": "MAP Session 18 Catch & Hop",
    "sessionNumber": 18,
    "skillTags": [
      "Catch",
      "Hop"
    ],
    "seconds": 192,
    "playlistPosition": 18
  },
  {
    "videoId": "wcYnr0L9Vd4",
    "name": "Jump & Toss",
    "sessionTitle": "MAP Session 19 Jump & Toss",
    "sessionNumber": 19,
    "skillTags": [
      "Jump",
      "Toss"
    ],
    "seconds": 188,
    "playlistPosition": 19
  },
  {
    "videoId": "OFmiaWM8fzk",
    "name": "Kick & Leap",
    "sessionTitle": "MAP Session 20 Kick & Leap",
    "sessionNumber": 20,
    "skillTags": [
      "Kick",
      "Leap"
    ],
    "seconds": 182,
    "playlistPosition": 20
  },
  {
    "videoId": "_6iOvs855iE",
    "name": "Skip & Roll",
    "sessionTitle": "MAP Session 21 Skip & Roll",
    "sessionNumber": 21,
    "skillTags": [
      "Skip",
      "Roll"
    ],
    "seconds": 178,
    "playlistPosition": 21
  },
  {
    "videoId": "OodtIBZNL1w",
    "name": "Dribble & Run",
    "sessionTitle": "MAP Session 22 Dribble & Run",
    "sessionNumber": 22,
    "skillTags": [
      "Dribble",
      "Run"
    ],
    "seconds": 184,
    "playlistPosition": 22
  },
  {
    "videoId": "Sx88vU0Fsbc",
    "name": "Gallop & 1 Hand Strike",
    "sessionTitle": "MAP Session 23 Gallop & 1 Hand Strike",
    "sessionNumber": 23,
    "skillTags": [
      "Gallop",
      "1-Hand Strike"
    ],
    "seconds": 188,
    "playlistPosition": 23
  },
  {
    "videoId": "a0kHAc5j2Hg",
    "name": "2 Hand Strike & Slide",
    "sessionTitle": "MAP Session 24 2 Hand Strike & Slide",
    "sessionNumber": 24,
    "skillTags": [
      "2-Hand Strike",
      "Slide"
    ],
    "seconds": 202,
    "playlistPosition": 24
  },
  {
    "videoId": "sOth2dzB-Yg",
    "name": "Hop & Throw",
    "sessionTitle": "MAP Session 25 Hop & Throw",
    "sessionNumber": 25,
    "skillTags": [
      "Hop",
      "Throw"
    ],
    "seconds": 183,
    "playlistPosition": 25
  },
  {
    "videoId": "E2hmIuSNjY0",
    "name": "Catch & Jump",
    "sessionTitle": "MAP Session 26 Catch & Jump",
    "sessionNumber": 26,
    "skillTags": [
      "Catch",
      "Jump"
    ],
    "seconds": 179,
    "playlistPosition": 26
  },
  {
    "videoId": "Rvv0xJVmT3M",
    "name": "Leap & Toss",
    "sessionTitle": "MAP Session 27 Leap & Toss",
    "sessionNumber": 27,
    "skillTags": [
      "Leap",
      "Toss"
    ],
    "seconds": 190,
    "playlistPosition": 27
  },
  {
    "videoId": "PXBze-I7nIU",
    "name": "Kick & Skip",
    "sessionTitle": "MAP Session 28 Kick & Skip",
    "sessionNumber": 28,
    "skillTags": [
      "Kick",
      "Skip"
    ],
    "seconds": 179,
    "playlistPosition": 28
  },
  {
    "videoId": "m5YRnDdlUvU",
    "name": "Kick & Skip",
    "sessionTitle": "MAP Session 28 Kick & Skip",
    "sessionNumber": 28,
    "skillTags": [
      "Kick",
      "Skip"
    ],
    "seconds": 179,
    "playlistPosition": 29
  },
  {
    "videoId": "mWxPexEQNZ4",
    "name": "Run & Roll",
    "sessionTitle": "MAP Session 29 Run & Roll",
    "sessionNumber": 29,
    "skillTags": [
      "Run",
      "Roll"
    ],
    "seconds": 182,
    "playlistPosition": 30
  },
  {
    "videoId": "6bniVvQTJDE",
    "name": "Dribble & Gallop",
    "sessionTitle": "MAP Session 30 Dribble & Gallop 1",
    "sessionNumber": 30,
    "skillTags": [
      "Dribble",
      "Gallop"
    ],
    "seconds": 184,
    "playlistPosition": 31
  },
  {
    "videoId": "726fJ9ocwmY",
    "name": "Slide & 1 Hand Strike",
    "sessionTitle": "MAP Session 31 Slide & 1 Hand Strike",
    "sessionNumber": 31,
    "skillTags": [
      "Slide",
      "1-Hand Strike"
    ],
    "seconds": 200,
    "playlistPosition": 32
  },
  {
    "videoId": "ckbfgbohDy4",
    "name": "2 Hand Strike & Hop",
    "sessionTitle": "MAP Session 32 2 Hand Strike & Hop",
    "sessionNumber": 32,
    "skillTags": [
      "2-Hand Strike",
      "Hop"
    ],
    "seconds": 199,
    "playlistPosition": 33
  },
  {
    "videoId": "uShlf2qfD2o",
    "name": "Jump & Throw",
    "sessionTitle": "MAP Session 33 Jump & Throw",
    "sessionNumber": 33,
    "skillTags": [
      "Jump",
      "Throw"
    ],
    "seconds": 171,
    "playlistPosition": 34
  },
  {
    "videoId": "_ecvA4DMO5g",
    "name": "Catch & Leap",
    "sessionTitle": "MAP Session 34 Catch & Leap",
    "sessionNumber": 34,
    "skillTags": [
      "Catch",
      "Leap"
    ],
    "seconds": 181,
    "playlistPosition": 35
  },
  {
    "videoId": "-T598I2_jX0",
    "name": "Skip & Toss",
    "sessionTitle": "MAP Session 35 Skip & Toss",
    "sessionNumber": 35,
    "skillTags": [
      "Skip",
      "Toss"
    ],
    "seconds": 187,
    "playlistPosition": 36
  },
  {
    "videoId": "DzwiiUahLQY",
    "name": "Kick & Run",
    "sessionTitle": "MAP Session 36 Kick & Run",
    "sessionNumber": 36,
    "skillTags": [
      "Kick",
      "Run"
    ],
    "seconds": 183,
    "playlistPosition": 37
  },
  {
    "videoId": "4vWPG72UB8A",
    "name": "Gallop & Roll",
    "sessionTitle": "MAP Session 37 Gallop & Roll",
    "sessionNumber": 37,
    "skillTags": [
      "Gallop",
      "Roll"
    ],
    "seconds": 182,
    "playlistPosition": 38
  },
  {
    "videoId": "A9oWSmf-3XU",
    "name": "Dribble & Slide",
    "sessionTitle": "MAP Session 38 Dribble & Slide",
    "sessionNumber": 38,
    "skillTags": [
      "Dribble",
      "Slide"
    ],
    "seconds": 197,
    "playlistPosition": 39
  },
  {
    "videoId": "hc6ysiyFzAA",
    "name": "Hop & 1 Hand Strike",
    "sessionTitle": "MAP Session 39 Hop & 1 Hand Strike 1",
    "sessionNumber": 39,
    "skillTags": [
      "Hop",
      "1-Hand Strike"
    ],
    "seconds": 198,
    "playlistPosition": 40
  },
  {
    "videoId": "Yi8NybBGrXU",
    "name": "2 Hand Strike & Jump",
    "sessionTitle": "MAP Session 40 2 Hand Strike & Jump",
    "sessionNumber": 40,
    "skillTags": [
      "2-Hand Strike",
      "Jump"
    ],
    "seconds": 187,
    "playlistPosition": 41
  },
  {
    "videoId": "DzE67y4p_6s",
    "name": "Leap & Throw",
    "sessionTitle": "MAP Session 41 Leap & Throw",
    "sessionNumber": 41,
    "skillTags": [
      "Leap",
      "Throw"
    ],
    "seconds": 172,
    "playlistPosition": 42
  },
  {
    "videoId": "9wKlvuBUxOg",
    "name": "Catch & Skip",
    "sessionTitle": "MAP Session 42 Catch & Skip",
    "sessionNumber": 42,
    "skillTags": [
      "Catch",
      "Skip"
    ],
    "seconds": 178,
    "playlistPosition": 43
  },
  {
    "videoId": "EvwgAqNeOFE",
    "name": "Run & Toss",
    "sessionTitle": "MAP Session 43 Run & Toss",
    "sessionNumber": 43,
    "skillTags": [
      "Run",
      "Toss"
    ],
    "seconds": 190,
    "playlistPosition": 44
  },
  {
    "videoId": "lRe0mhaoQ8k",
    "name": "Kick & Gallop",
    "sessionTitle": "MAP Session 44 Kick & Gallop",
    "sessionNumber": 44,
    "skillTags": [
      "Kick",
      "Gallop"
    ],
    "seconds": 183,
    "playlistPosition": 45
  },
  {
    "videoId": "RYmCyjexQxA",
    "name": "Slide & Roll",
    "sessionTitle": "MAP Session 45 Slide & Roll",
    "sessionNumber": 45,
    "skillTags": [
      "Slide",
      "Roll"
    ],
    "seconds": 195,
    "playlistPosition": 46
  },
  {
    "videoId": "eZHXOaT-quI",
    "name": "Dribble & Hop",
    "sessionTitle": "MAP Session 46 Dribble & Hop",
    "sessionNumber": 46,
    "skillTags": [
      "Dribble",
      "Hop"
    ],
    "seconds": 194,
    "playlistPosition": 47
  },
  {
    "videoId": "9om5ywTijpk",
    "name": "Jump & 1 Hand Strike",
    "sessionTitle": "MAP Session 47 Jump & 1 Hand Strike",
    "sessionNumber": 47,
    "skillTags": [
      "Jump",
      "1-Hand Strike"
    ],
    "seconds": 186,
    "playlistPosition": 48
  },
  {
    "videoId": "xNHXQSIEUQg",
    "name": "2 Hand Strike & Leap",
    "sessionTitle": "MAP Session 48 2 Hand Strike & Leap",
    "sessionNumber": 48,
    "skillTags": [
      "2-Hand Strike",
      "Leap"
    ],
    "seconds": 189,
    "playlistPosition": 49
  }
];
const legacyVideoIds = {
  "xMKbTy5DbFI": "feed-the-fish",
  "tjlp3UT2Z2w": "sea-star-toss",
  "sf1s2Kg5O9I": "splash-target",
  "nMGVVV_KrBU": "sea-creature-gallop",
  "LQz_YqDpT3M": "seahorse-race",
  "cAH_BksQCrc": "lily-pad-hop",
  "_eWo9Y6HAbs": "stepping-stones",
  "9Wax-11jqvY": "rolling-waves",
  "erGTVRctM2Y": "turtle-roll",
  "pLiGg1plG3k": "treasure-kick",
  "OFmiaWM8fzk": "tide-kick",
  "i8kE88VqSC0": "dolphin-dash",
  "UTycHoLJ3jo": "wave-chase"
};

const skillCategory = skill => CATEGORIES.Locomotor.skills.includes(skill) ? "Locomotor" : "Object Control";
function movementDetails(skill) {
  const content = skillContent[skill];
  return {
    goal: content.goal, setup: content.setup,
    steps: content.steps.map(([title, text, cue]) => ({ title, text, cue, photo: null, clip: null })),
    easier: content.easier, challenge: content.challenge,
    easierGood: content.easierGood ?? "Children who are learning this movement.",
    challengeGood: content.challengeGood ?? "Children who perform the movement with control."
  };
}
// Demo classroom time includes a short demonstration and guided practice.
// Simple movement pairs are quick breaks; coordination and equipment need longer.
function classroomDuration(skillTags) {
  const complexity = {
    Run: 0, Slide: 0, Jump: 1, Gallop: 1, Hop: 1, Leap: 2, Skip: 2,
    Roll: 0, Toss: 0, Catch: 1, Throw: 1, Kick: 1, Dribble: 2,
    "1-Hand Strike": 2, "2-Hand Strike": 2
  };
  const score = skillTags.reduce((total, skill) => total + (complexity[skill] ?? 1), 0);
  return score <= 1 ? 4 : score <= 2 ? 8 : 15;
}
const activities = mapSessions.map(session => {
  const legacy = legacyActivities.find(activity => activity.id === legacyVideoIds[session.videoId]);
  const skill = legacy?.skill ?? session.skillTags[0];
  const category = skillCategory(skill);
  const objectSkills = session.skillTags.filter(tag => skillCategory(tag) === "Object Control");
  const needsBat = objectSkills.some(tag => tag.includes("Strike"));
  const materials = legacy?.materials ?? [{ name: needsBat ? "Paddle and soft ball" : "Soft ball", substitution: needsBat ? "A hand and a light ball" : "Rolled socks" }];
  return {
    ...legacy, ...movementDetails(skill), ...session,
    id: legacy?.id ?? "session-" + session.videoId,
    category, skill, categories: [...new Set(session.skillTags.map(skillCategory))],
    placeholder: true,
    difficulty: legacy?.difficulty ?? 1 + session.sessionNumber % 3,
    effort: legacy?.effort ?? (category === "Locomotor" ? "High" : "Medium"),
    duration: classroomDuration(session.skillTags), space: legacy?.space ?? "Either",
    equipment: legacy?.equipment ?? (needsBat ? "Needs gathering" : "Things in my room"),
    group: legacy?.group ?? "Whole class", materials,
    video: { length: session.seconds, url: "https://www.youtube.com/watch?v=" + session.videoId,
      chapters: legacy?.video.chapters ?? [
        {time:0,label:"Example: introduce the movement",thumbnail:null},
        {time:30,label:"Example: demonstrate",thumbnail:null},
        {time:60,label:"Example: practice together",thumbnail:null}
      ] },
    handout: "Provisional classroom setup handout",
    related: []
  };
});
function lessonForSkill(activity, skill = activity.skill) {
  if (!activity.skillTags.includes(skill)) skill = activity.skill;
  const focused = skill === activity.skill ? activity : { ...activity, ...movementDetails(skill), category: skillCategory(skill), skill };
  return { ...focused, related: activities.filter(other => other.id !== activity.id && other.skillTags.includes(skill)).slice(0, 3).map(other => other.id) };
}

const SKILL_PLACES = {
  "Run": {
    "name": "Forest Trail",
    "x": 22,
    "y": 32,
    "cell": 0
  },
  "Gallop": {
    "name": "Riverside Bridge",
    "x": 48,
    "y": 28,
    "cell": 1
  },
  "Hop": {
    "name": "Woodland Cabin",
    "x": 74,
    "y": 33,
    "cell": 2
  },
  "Jump": {
    "name": "Lily Pond",
    "x": 18,
    "y": 59,
    "cell": 3
  },
  "Leap": {
    "name": "Log Crossing",
    "x": 44,
    "y": 54,
    "cell": 4
  },
  "Skip": {
    "name": "Blossom Orchard",
    "x": 72,
    "y": 62,
    "cell": 5
  },
  "Slide": {
    "name": "Shell Cove",
    "x": 47,
    "y": 79,
    "cell": 6
  },
  "Throw": {
    "name": "Target Garden",
    "x": 20,
    "y": 32,
    "cell": 0
  },
  "Catch": {
    "name": "Waterfall Pond",
    "x": 44,
    "y": 27,
    "cell": 1
  },
  "Toss": {
    "name": "Picnic Clearing",
    "x": 72,
    "y": 31,
    "cell": 2
  },
  "Kick": {
    "name": "Goal Meadow",
    "x": 80,
    "y": 52,
    "cell": 3
  },
  "Roll": {
    "name": "Riverbank",
    "x": 66,
    "y": 75,
    "cell": 4
  },
  "Dribble": {
    "name": "Bounce Courtyard",
    "x": 41,
    "y": 71,
    "cell": 5
  },
  "1-Hand Strike": {
    "name": "Equipment Cottage",
    "x": 17,
    "y": 61,
    "cell": 6
  },
  "2-Hand Strike": {
    "name": "Lakeside Dock",
    "x": 46,
    "y": 48,
    "cell": 7
  }
};
