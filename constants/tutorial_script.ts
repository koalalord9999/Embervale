
export const TUTORIAL_SCRIPT = [
    // Stage 0: Start Prompt
    {
        stage: 0,
        guideText: "",
        objective: "Talk to Leo to begin your training.",
        highlight: "activity-button-0",
        completionCondition: 'start-tutorial',
    },
    // Stage 1: Introduction
    {
        stage: 1,
        guideText: "Welcome to the Ember Kinship Enclave. I'm Leo. I'm here to teach you the basics before you head out into the wider world.",
        objective: "Follow the guide's instructions.",
        highlight: null,
        completionCondition: 'continue',
    },
    // Stage 2: Movement
    {
        stage: 2,
        guideText: "First things first, movement. You can travel between areas by clicking the buttons on the right side of your screen under 'Travel'.",
        objective: "Travel to the Sparring Area.",
        highlight: "navigation-button-enclave_sparring_area",
        completionCondition: 'move:enclave_sparring_area',
    },
    // Stage 3: Inventory Unlock
    {
        stage: 3,
        guideText: "Good. This is where we'll practice combat. The world is dangerous, so you need to know how to handle yourself. Let's start with your inventory.",
        objective: "The guide explains your inventory.",
        highlight: "inventory-button",
        completionCondition: 'continue',
        unlocks: ['inventory'],
    },
    // Stage 4: Get Sandwich & Open Equip
    {
        stage: 4,
        guideText: "I've given you a sandwich in case you get scraped up. Now, before you fight, you should know about your equipment. Open your Equipment panel.",
        objective: "Open your Equipment panel.",
        highlight: "equipment-button",
        completionCondition: 'open-equipment',
        unlocks: ['equipment'],
        rewards: {
            items: [{ itemId: 'sandwich', quantity: 1 }]
        },
    },
    // Stage 5: Explain Combat Stances
    {
        stage: 5,
        guideText: "This panel shows what you're wearing. Now, let's talk stances. You'll see your combat style buttons appear during a fight. They're very important.",
        objective: "The guide explains combat stances.",
        highlight: null,
        completionCondition: 'continue',
    },
    // Stage 6: Fight Dummy (Aggressive)
    {
        stage: 6,
        guideText: "Select the 'Aggressive' stance to train your Strength and hit harder. Give that dummy a few whacks.",
        objective: "Attack the Training Dummy using the 'Aggressive' stance.",
        highlight: "activity-button-0",
        completionCondition: 'hit-dummy-aggressive',
    },
    // Stage 7: Fight Dummy (Defensive)
    {
        stage: 7,
        guideText: "See the Strength XP? Good. Now try the 'Defensive' stance. It trains your Defence skill, making you tougher.",
        objective: "Attack the Training Dummy using the 'Defensive' stance.",
        highlight: "activity-button-0",
        completionCondition: 'hit-dummy-defensive',
    },
    // Stage 8: Explain HP
    {
        stage: 8,
        guideText: "Excellent. Your health is shown in the HUD on the right. If it reaches zero, you'll find yourself back in a safe town, but you'll lose some coins. Let's pretend you took a hit.",
        objective: "The guide explains Hitpoints.",
        highlight: null,
        completionCondition: 'continue',
    },
    // Stage 9: Healing
    {
        stage: 9,
        guideText: "You can heal by eating food. Open your inventory and eat that sandwich I gave you. You can right-click it for options, but a simple left-click will do the trick.",
        objective: "Open your inventory and eat the Sandwich.",
        highlight: "inventory-button",
        completionCondition: 'eat-sandwich',
    },
    // Stage 10: Woodcutting Intro
    {
        stage: 10,
        guideText: "There, all better. Now for some survival skills. Every adventurer needs to know how to gather resources. Let's head to the forest patch.",
        objective: "Travel to the Forest Patch.",
        highlight: "navigation-button-enclave_forest_patch",
        completionCondition: 'move:enclave_forest_patch',
    },
    // Stage 11: Chop Tree
    {
        stage: 11,
        guideText: "To chop a tree, you need an axe. Luckily, there's one right here. Go ahead and take it, then chop down a tree.",
        objective: "Chop down a tree.",
        highlight: "activity-button-0",
        completionCondition: 'chop-log',
        rewards: {
            items: [{ itemId: 'bronze_axe', quantity: 1 }]
        },
    },
    // Stage 12: Firemaking
    {
        stage: 12,
        guideText: "Excellent! Now you have some logs. To light a fire, you 'use' a tinderbox on them. Left-click it, then left-click your logs.",
        objective: "Use your Tinderbox on the Logs.",
        highlight: "inventory-slot-tinderbox",
        completionCondition: 'light-fire',
        rewards: {
            items: [{ itemId: 'tinderbox', quantity: 1 }]
        },
    },
    // Stage 13: Crafting Intro
    {
        stage: 13,
        guideText: "A warm fire, lovely. Now, let's make you your first weapon. A proper adventurer crafts their own gear. Take this pickaxe and head to the mine.",
        objective: "Travel to the Enclave Mine.",
        highlight: "navigation-button-enclave_mine",
        completionCondition: 'move:enclave_mine',
        rewards: {
            items: [{ itemId: 'bronze_pickaxe', quantity: 1 }]
        },
    },
    // Stage 14: Mining
    {
        stage: 14,
        guideText: "To make a bronze weapon, you'll need one copper ore and one tin ore. Get mining!",
        objective: "Mine 1 Copper Ore and 1 Tin Ore.",
        highlight: "activity-button-0", // Highlights first mining node
        completionCondition: 'mine-ores',
    },
    // Stage 15: Forge
    {
        stage: 15,
        guideText: "Great! With ore in hand, you need a forge to process it. Head to the next area.",
        objective: "Travel to the Enclave Forge.",
        highlight: "navigation-button-enclave_forge",
        completionCondition: 'move:enclave_forge',
    },
    // Stage 16: Right-click Furnace
    {
        stage: 16,
        guideText: "First, you need to smelt your ores into a bar. Most objects have more than one action. Right-click the Furnace to see what you can do.",
        objective: "Right-click the furnace.",
        highlight: "activity-button-0", // furnace
        completionCondition: 'context-menu-furnace',
    },
    // Stage 17: Smelt Bar
    {
        stage: 17,
        guideText: "Perfect. The context menu shows all available actions. Now, select 'Smelt' to open the smelting interface and create a Bronze Bar.",
        objective: "Use the Furnace to smelt a Bronze Bar.",
        highlight: null,
        completionCondition: 'smelt-bar',
    },
    // Stage 18: Right-click Anvil
    {
        stage: 18,
        guideText: "Perfect. Now you have a metal bar. You can use an anvil to smith that bar into equipment. Right-click the Anvil to see its options.",
        objective: "Right-click the anvil.",
        highlight: "activity-button-1", // anvil
        completionCondition: 'context-menu-anvil',
    },
    // Stage 19: Smith Dagger
    {
        stage: 19,
        guideText: "Good. Select 'Smith' from the menu, then find and smith a Bronze Dagger. This will be your first weapon.",
        objective: "Use the Anvil to smith a Bronze Dagger.",
        highlight: null, // User has to find it
        completionCondition: 'smith-dagger',
    },
    // Stage 20: Equip Dagger
    {
        stage: 20,
        guideText: "A fine weapon for a beginner! Now, equip it. You know how this works.",
        objective: "Equip your new Bronze Dagger.",
        highlight: "inventory-slot-bronze_dagger",
        completionCondition: 'equip-dagger',
    },
    // Stage 21: First "Real" Fight
    {
        stage: 21,
        guideText: "You're a natural. Now for a real test. Let's go back to the forest patch and deal with that overgrown rat.",
        objective: "Return to the Forest Patch and defeat the Tutorial Rat.",
        highlight: "navigation-button-enclave_forest_patch",
        completionCondition: 'kill-rat',
    },
    // Stage 22: Skills Menu
    {
        stage: 22,
        guideText: "Well done! You've earned experience in many skills. You can check your progress in the Skills Panel.",
        objective: "Open the Skills panel.",
        highlight: "skills-button",
        completionCondition: 'open-skills',
        unlocks: ['skills'],
    },
    // Stage 23: Final Departure
    {
        stage: 23,
        guideText: "You've learned everything I can teach you here. The rest is up to you. Meet me at the departure point when you're ready to leave.",
        objective: "Travel to the Departure Point.",
        highlight: "navigation-button-enclave_departure_point",
        completionCondition: 'move:enclave_departure_point',
        unlocks: ['quests', 'map', 'atlas'],
    },
    // Stage 24: Final Talk
    {
        stage: 24,
        guideText: "This is it. The world of Embervale awaits. Good luck out there, adventurer.",
        objective: "Talk to Leo to depart for the main world.",
        highlight: "activity-button-0",
        completionCondition: 'talk-to-guide-final',
    },
];
