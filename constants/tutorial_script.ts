

export const TUTORIAL_SCRIPT = [
    // Stage 0: Introduction
    {
        stage: 0,
        guideText: "Welcome to the Ember Kinship Enclave. I'm Leo. I'm here to teach you the basics before you head out into the wider world.",
        objective: "Click Continue to begin your training.",
        completionCondition: 'continue',
    },
    // Stage 1: Movement
    {
        stage: 1,
        guideText: "First things first, movement. You can travel between areas by clicking the buttons on the right side of your screen under 'Travel'.",
        objective: "Travel to the Sparring Area.",
        highlight: "navigation-button-enclave_sparring_area",
        completionCondition: 'move:enclave_sparring_area',
    },
    // Stage 2: Inventory
    {
        stage: 2,
        guideText: "Good. This is where we'll practice combat. The world is dangerous, so I've unlocked your side panel. First, open your inventory by clicking the knapsack icon.",
        objective: "Open your Inventory.",
        highlight: "side-panel-button-inventory",
        completionCondition: 'open-panel:inventory',
        unlocks: ['inventory'],
    },
    // Stage 3: Equipment
    {
        stage: 3,
        guideText: "Excellent. Now, before you fight, you should know about your equipment. Open your Equipment panel by clicking the helmet icon.",
        objective: "Open your Equipment panel.",
        highlight: "side-panel-button-equipment",
        completionCondition: 'open-panel:equipment',
        unlocks: ['equipment'],
    },
    // Stage 4: Open Combat Styles
    {
        stage: 4,
        guideText: "This panel shows what you're wearing. Now, let's talk stances. Click the crossed swords icon to open your Combat Styles panel.",
        objective: "Open the Combat Styles panel.",
        highlight: "side-panel-button-combat",
        completionCondition: 'open-panel:combat',
        unlocks: ['combat'],
    },
    // Stage 5: Explain Stances
    {
        stage: 5,
        guideText: "This panel shows your available combat stances. They're very important, affecting which skills you train and your effectiveness in a fight.",
        objective: "The guide explains combat stances.",
        completionCondition: 'continue',
    },
    // Stage 6: Move to Sparring
    {
        stage: 6,
        guideText: "Now for a real test. Let's go back to the sparring area.",
        objective: "Travel to the Sparring Area.",
        highlight: "navigation-button-enclave_sparring_area",
        completionCondition: 'move:enclave_sparring_area',
    },
    // Stage 7: Fight Dummy (Aggressive)
    {
        stage: 7,
        guideText: "Attack the dummy. The combat screen will appear. Select 'Aggressive' to train your Strength and hit harder.",
        objective: "Attack the Training Dummy using the 'Aggressive' stance.",
        highlight: "activity-button-0",
        completionCondition: 'hit-dummy-aggressive',
    },
    // Stage 8: Fight Dummy (Defensive)
    {
        stage: 8,
        guideText: "See the Strength XP? Good. Now try the 'Defensive' stance. It trains your Defence skill, making you tougher.",
        objective: "Attack the Training Dummy using the 'Defensive' stance.",
        highlight: "activity-button-0",
        completionCondition: 'hit-dummy-defensive',
    },
    // Stage 9: HP explained
    {
        stage: 9,
        guideText: "Excellent. Your health is shown in the HP Orb at the top of the side panel. If it reaches zero, you'll be returned to safety, but you'll lose some coins. Let's pretend you took a hit.",
        objective: "The guide explains Hitpoints.",
        highlight: "hp-orb",
        completionCondition: 'continue',
    },
    // Stage 10: Healing
    {
        stage: 10,
        guideText: "You can heal by eating food. Your health will also regenerate slowly over time. For now, let's move on.",
        objective: "The guide explains healing.",
        completionCondition: 'continue',
    },
    // Stage 11: Woodcutting Intro
    {
        stage: 11,
        guideText: "Now for some survival skills. Every adventurer needs to know how to gather resources. Let's head to the forest patch.",
        objective: "Travel to the Forest Patch.",
        highlight: "navigation-button-enclave_forest_patch",
        completionCondition: 'move:enclave_forest_patch',
    },
    // Stage 12: Chop Tree
    {
        stage: 12,
        guideText: "To chop a tree, you need an axe. Luckily, there's one right here. Go ahead and take it from your inventory, then chop down a tree.",
        objective: "Chop down a tree.",
        highlight: "activity-button-0",
        completionCondition: 'chop-log',
        rewards: {
            items: [{ itemId: 'bronze_axe', quantity: 1 }]
        },
    },
    // Stage 13: Firemaking
    {
        stage: 13,
        guideText: "Excellent! Now you have some logs. To light a fire, you 'use' a tinderbox on them. Click the tinderbox, then click your logs.",
        objective: "Use your Tinderbox on the Logs.",
        highlight: "inventory-slot-tinderbox",
        completionCondition: 'light-fire',
        rewards: {
            items: [{ itemId: 'tinderbox', quantity: 1 }]
        },
    },
    // Stage 14: Crafting Intro
    {
        stage: 14,
        guideText: "A warm fire, lovely. Now, let's make you your first weapon. A proper adventurer crafts their own gear. Take this pickaxe and head to the mine.",
        objective: "Travel to the Enclave Mine.",
        highlight: "navigation-button-enclave_mine",
        completionCondition: 'move:enclave_mine',
        rewards: {
            items: [{ itemId: 'bronze_pickaxe', quantity: 1 }]
        },
    },
    // Stage 15: Mining
    {
        stage: 15,
        guideText: "To make a bronze weapon, you'll need one copper ore and one tin ore. Get mining!",
        objective: "Mine 1 Copper Ore and 1 Tin Ore.",
        highlight: "activity-button-0", // Note: Overlay logic handles conditional highlighting
        completionCondition: 'mine-ores',
    },
    // Stage 16: Forge
    {
        stage: 16,
        guideText: "Great! With ore in hand, you need a forge to process it. Head to the next area.",
        objective: "Travel to the Enclave Forge.",
        highlight: "navigation-button-enclave_forge",
        completionCondition: 'move:enclave_forge',
    },
    // Stage 17: Right-click Furnace
    {
        stage: 17,
        guideText: "First, you need to smelt your ores into a bar. Most objects have more than one action. {ACTION} the Furnace to see what you can do.",
        objective: "{ACTION} the furnace.",
        highlight: "activity-button-0", // furnace
        completionCondition: 'context-menu-furnace',
    },
    // Stage 18: Smelt Bar
    {
        stage: 18,
        guideText: "Perfect. The context menu shows all available actions. Now, select 'Smelt' to open the smelting interface and create a Bronze Bar.",
        objective: "Use the Furnace to smelt a Bronze Bar.",
        highlight: null,
        completionCondition: 'smelt-bar',
    },
    // Stage 19: Right-click Anvil
    {
        stage: 19,
        guideText: "Perfect. Now you have a metal bar. You'll need a hammer to work it. Here, take this one. You can use an anvil to smith that bar into equipment. {ACTION} the Anvil to see its options.",
        objective: "{ACTION} the anvil.",
        highlight: "activity-button-1", // anvil
        completionCondition: 'context-menu-anvil',
        rewards: {
            items: [{ itemId: 'hammer', quantity: 1 }]
        },
    },
    // Stage 20: Smith Dagger
    {
        stage: 20,
        guideText: "Good. Select 'Smith' from the menu, then find and smith a Bronze Dagger. This will be your first weapon.",
        objective: "Use the Anvil to smith a Bronze Dagger.",
        highlight: null,
        completionCondition: 'smith-dagger',
    },
    // Stage 21: Equip Dagger
    {
        stage: 21,
        guideText: "A fine weapon for a beginner! Now, equip it. You know how this works.",
        objective: "Equip your new Bronze Dagger.",
        highlight: "inventory-slot-bronze_dagger",
        completionCondition: 'equip-dagger',
    },
    // Stage 22: Path to Rat 1
    {
        stage: 22,
        guideText: "You're a natural. Now for a real test. Let's go back to the forest patch and deal with that overgrown rat.",
        objective: "Travel to the Enclave Mine.",
        highlight: "navigation-button-enclave_mine",
        completionCondition: 'move:enclave_mine',
    },
    // Stage 23: Path to Rat 2
    {
        stage: 23,
        guideText: "Almost there. Just through here.",
        objective: "Travel to the Forest Patch.",
        highlight: "navigation-button-enclave_forest_patch",
        completionCondition: 'move:enclave_forest_patch',
    },
    // Stage 24: Kill Rat
    {
        stage: 24,
        guideText: "There's that rat. Take care of it with your new dagger.",
        objective: "Defeat the Tutorial Rat.",
        highlight: "activity-button-1",
        completionCondition: 'kill-rat',
    },
    // Stage 25: Skills Menu
    {
        stage: 25,
        guideText: "Well done! You've earned experience in many skills. You can check your progress in the Skills Panel.",
        objective: "Open the Skills panel.",
        highlight: "side-panel-button-skills",
        completionCondition: 'open-panel:skills',
        unlocks: ['skills'],
    },
    // Stage 26: Path to Departure 1
    {
        stage: 26,
        guideText: "You've learned everything I can teach you here. The rest is up to you. Meet me at the departure point when you're ready to leave.",
        objective: "Travel to the Enclave Mine.",
        highlight: "navigation-button-enclave_mine",
        completionCondition: 'move:enclave_mine',
        unlocks: ['quests', 'map', 'atlas'],
    },
    // Stage 27: Path to Departure 2
    {
        stage: 27,
        guideText: "Through the forge now.",
        objective: "Travel to the Enclave Forge.",
        highlight: "navigation-button-enclave_forge",
        completionCondition: 'move:enclave_forge',
    },
    // Stage 28: Path to Departure 3
    {
        stage: 28,
        guideText: "Just up ahead. The main world awaits.",
        objective: "Travel to the Departure Point.",
        highlight: "navigation-button-enclave_departure_point",
        completionCondition: 'move:enclave_departure_point',
    },
    // Stage 29: Final Talk Trigger
    {
        stage: 29,
        guideText: "This is it. The world of Embrune awaits. Good luck out there, adventurer.",
        objective: "Talk to Leo to depart for the main world.",
        highlight: "activity-button-0",
        completionCondition: 'talk-to-guide-final',
    },
    // Stage 30: Departure
    {
        stage: 30,
        guideText: "Your first stop should be Meadowdale. The smith there, Valerius, is always looking for new talent. Or, you could check the quest board in The Rusty Flagon inn for work. Good luck.",
        objective: "Click Depart to enter the main world.",
        highlight: null,
        completionCondition: 'depart',
    },
];
