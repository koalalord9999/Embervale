
import { DialogueNode } from '../../types';

export const BANKER_ZAHRA_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Banker Zahra',
        npcIcon: '/assets/npcChatHeads/banker_astrid.png', // Re-using asset
        text: "Welcome to the Bank of Embrune, Fouthia branch. Your items are safe from sand and thieves with us.",
        responses: [
            { text: "I'd like to access my bank.", next: 'access_bank' },
            { text: "Just looking around, thank you." }
        ]
    },
    access_bank: {
        npcName: 'Banker Zahra',
        npcIcon: '/assets/npcChatHeads/banker_astrid.png',
        text: "Of course. Please, step up to the counter.",
        responses: [
            { text: "Access my vault.", actions: [{ type: 'open_bank' }] },
            { text: "Not right now." }
        ]
    }
};

export const BARKEEP_ZALE_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Barkeep Zale',
        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png', // Re-using asset
        text: "Welcome to The Sand Serpent. We've got the strongest cactus wine and the softest sand-beds in Fouthia. What'll it be?",
        responses: [
            { text: "A glass of your finest.", next: 'buy_drink_intro' },
            { text: "I'd like to rent a room.", next: 'rent_room_intro' },
        ]
    },
    buy_drink_intro: {
        npcName: 'Barkeep Zale',
        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
        text: "An excellent choice! Knocks the dust from your throat. That'll be 5 coins.",
        responses: [
            { text: "Here you go.", check: { requirements: [{ type: 'coins', amount: 5 }], successNode: 'buy_drink_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 5 }, { type: 'give_item', itemId: 'beer', quantity: 1 }] },
            { text: "A bit steep for me." },
        ]
    },
    buy_drink_success: {
        npcName: 'Barkeep Zale',
        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
        text: "Cheers!",
        responses: []
    },
    buy_drink_fail: {
        npcName: 'Barkeep Zale',
        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
        text: "Sorry, you don't have enough coin for that.",
        responses: []
    },
    rent_room_intro: {
        npcName: 'Barkeep Zale',
        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
        text: "A wise choice. A night out of the wind does wonders for your health. A room for the night is 20 coins.",
        responses: [
            { text: "I'll take it.", check: { requirements: [{ type: 'coins', amount: 20 }], successNode: 'rent_room_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 20 }, { type: 'heal', amount: 'full' }] },
            { text: "I prefer sleeping with the sand-scorpions." },
        ]
    },
    rent_room_success: {
        npcName: 'Barkeep Zale',
        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
        text: "Wise choice. Sleep well.",
        responses: []
    }
};

export const KHALID_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Khalid the Armorer',
        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png', // Re-using asset
        text: "Need armor that won't cook you in your own skin? You've come to the right forge. Heavy plate is for the fools in the green lands. Here, we value lightness and breathability.",
        responses: []
    }
};

export const ZAFIRA_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Zafira the Alchemist',
        npcIcon: '/assets/npcChatHeads/herbalist_anise.png', // Re-using asset
        text: "The desert provides all the remedies one needs, if you know where to look. I sell potions for sun-sickness, scorpion stings, and worse. What ails you?",
        responses: []
    }
};

export const CAPTAIN_OMAR_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Captain Omar',
        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png', // Re-using asset
        text: "The Salt Flats are unforgiving, and the bandits are relentless. We do what we can to keep this town safe, but we're always looking for capable hands. Check the quest board if you're looking for work.",
        responses: []
    }
};
