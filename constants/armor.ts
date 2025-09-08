
import { Item, EquipmentSlot, SkillName } from '../types';

export const armor: Item[] = [
    // Bronze
    {
        id: 'bronze_full_helm', name: 'Bronze Full Helm', description: 'A helmet that covers the entire head.', stackable: false, value: 25,
        iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg', material: 'bronze',
        equipment: {
            slot: EquipmentSlot.Head, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: -3,
            stabDefence: 9, slashDefence: 8, crushDefence: 7, rangedDefence: 2, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
        },
    },
    {
        id: 'bronze_platebody', name: 'Bronze Platebody', description: 'Provides excellent protection for the torso.', stackable: false, value: 60,
        iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg', material: 'bronze',
        equipment: {
            slot: EquipmentSlot.Body, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: -10,
            stabDefence: 20, slashDefence: 18, crushDefence: 15, rangedDefence: 5, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
        },
    },
    {
        id: 'bronze_platelegs', name: 'Bronze Platelegs', description: 'Sturdy platelegs made from bronze.', stackable: false, value: 40,
        iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg', material: 'bronze',
        equipment: {
            slot: EquipmentSlot.Legs, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: -5,
            stabDefence: 10, slashDefence: 9, crushDefence: 8, rangedDefence: 3, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
        },
    },
    {
        id: 'bronze_kiteshield', name: 'Bronze Kiteshield', description: 'A large, sturdy shield.', stackable: false, value: 35,
        iconUrl: 'https://api.iconify.design/game-icons:shield.svg', material: 'bronze',
        equipment: {
            slot: EquipmentSlot.Shield, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: -5,
            stabDefence: 12, slashDefence: 11, crushDefence: 10, rangedDefence: 5, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
        },
    },
    // Iron
    {
        id: 'iron_full_helm', name: 'Iron Full Helm', description: 'A sturdy iron helmet.', stackable: false, value: 150,
        iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg', material: 'iron',
        equipment: {
            slot: EquipmentSlot.Head, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -2, magicAttack: -3,
            stabDefence: 15, slashDefence: 14, crushDefence: 13, rangedDefence: 5, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 5 }],
        },
    },
    {
        id: 'iron_platebody', name: 'Iron Platebody', description: 'Provides good protection for the torso.', stackable: false, value: 400,
        iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg', material: 'iron',
        equipment: {
            slot: EquipmentSlot.Body, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -10, magicAttack: -15,
            stabDefence: 35, slashDefence: 33, crushDefence: 30, rangedDefence: 10, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 5 }],
        },
    },
    {
        id: 'iron_platelegs', name: 'Iron Platelegs', description: 'Sturdy platelegs made from iron.', stackable: false, value: 220,
        iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg', material: 'iron',
        equipment: {
            slot: EquipmentSlot.Legs, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -5, magicAttack: -7,
            stabDefence: 25, slashDefence: 23, crushDefence: 20, rangedDefence: 7, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 5 }],
        },
    },
    {
        id: 'iron_kiteshield', name: 'Iron Kiteshield', description: 'A large, sturdy iron shield.', stackable: false, value: 210,
        iconUrl: 'https://api.iconify.design/game-icons:shield.svg', material: 'iron',
        equipment: {
            slot: EquipmentSlot.Shield, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: -8,
            stabDefence: 20, slashDefence: 18, crushDefence: 16, rangedDefence: 10, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 5 }],
        },
    },
    // Steel
    {
        id: 'steel_full_helm', name: 'Steel Full Helm', description: 'A sturdy steel helmet.', stackable: false, value: 360,
        iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg', material: 'steel',
        equipment: {
            slot: EquipmentSlot.Head, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -3, magicAttack: -4,
            stabDefence: 22, slashDefence: 21, crushDefence: 19, rangedDefence: 8, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 10 }],
        },
    },
    {
        id: 'steel_platebody', name: 'Steel Platebody', description: 'Provides excellent protection for the torso.', stackable: false, value: 950,
        iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg', material: 'steel',
        equipment: {
            slot: EquipmentSlot.Body, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -15, magicAttack: -20,
            stabDefence: 50, slashDefence: 48, crushDefence: 44, rangedDefence: 15, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 10 }],
        },
    },
    {
        id: 'steel_platelegs', name: 'Steel Platelegs', description: 'Sturdy platelegs made from steel.', stackable: false, value: 540,
        iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg', material: 'steel',
        equipment: {
            slot: EquipmentSlot.Legs, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -7, magicAttack: -10,
            stabDefence: 38, slashDefence: 36, crushDefence: 32, rangedDefence: 12, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 10 }],
        },
    },
    {
        id: 'steel_kiteshield', name: 'Steel Kiteshield', description: 'A large, sturdy steel shield.', stackable: false, value: 500,
        iconUrl: 'https://api.iconify.design/game-icons:shield.svg', material: 'steel',
        equipment: {
            slot: EquipmentSlot.Shield, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: -10,
            stabDefence: 30, slashDefence: 28, crushDefence: 25, rangedDefence: 15, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 10 }],
        },
    },
    // Mithril
    {
        id: 'mithril_full_helm', name: 'Mithril Full Helm', description: 'A sturdy mithril helmet.', stackable: false, value: 900,
        iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg', material: 'mithril',
        equipment: {
            slot: EquipmentSlot.Head, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -3, magicAttack: -4,
            stabDefence: 26, slashDefence: 25, crushDefence: 23, rangedDefence: 10, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 20 }],
        },
    },
    {
        id: 'mithril_platebody', name: 'Mithril Platebody', description: 'Provides excellent protection for the torso.', stackable: false, value: 2375,
        iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg', material: 'mithril',
        equipment: {
            slot: EquipmentSlot.Body, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -15, magicAttack: -20,
            stabDefence: 58, slashDefence: 55, crushDefence: 50, rangedDefence: 18, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 20 }],
        },
    },
    {
        id: 'mithril_platelegs', name: 'Mithril Platelegs', description: 'Sturdy platelegs made from mithril.', stackable: false, value: 1350,
        iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg', material: 'mithril',
        equipment: {
            slot: EquipmentSlot.Legs, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -8, magicAttack: -12,
            stabDefence: 42, slashDefence: 40, crushDefence: 36, rangedDefence: 15, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 20 }],
        },
    },
    {
        id: 'mithril_kiteshield', name: 'Mithril Kiteshield', description: 'A large, sturdy mithril shield.', stackable: false, value: 1250,
        iconUrl: 'https://api.iconify.design/game-icons:shield.svg', material: 'mithril',
        equipment: {
            slot: EquipmentSlot.Shield, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: -10,
            stabDefence: 35, slashDefence: 33, crushDefence: 30, rangedDefence: 18, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 20 }],
        },
    },
    // Adamantite
    {
        id: 'adamantite_full_helm', name: 'Adamantite Full Helm', description: 'A sturdy adamantite helmet.', stackable: false, value: 1800,
        iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg', material: 'adamantite',
        equipment: {
            slot: EquipmentSlot.Head, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -4, magicAttack: -5,
            stabDefence: 32, slashDefence: 30, crushDefence: 28, rangedDefence: 12, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 30 }],
        },
    },
    {
        id: 'adamantite_platebody', name: 'Adamantite Platebody', description: 'Provides excellent protection for the torso.', stackable: false, value: 4750,
        iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg', material: 'adamantite',
        equipment: {
            slot: EquipmentSlot.Body, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -20, magicAttack: -25,
            stabDefence: 65, slashDefence: 62, crushDefence: 58, rangedDefence: 22, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 30 }],
        },
    },
    {
        id: 'adamantite_platelegs', name: 'Adamantite Platelegs', description: 'Sturdy platelegs made from adamantite.', stackable: false, value: 2700,
        iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg', material: 'adamantite',
        equipment: {
            slot: EquipmentSlot.Legs, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -10, magicAttack: -15,
            stabDefence: 50, slashDefence: 48, crushDefence: 44, rangedDefence: 18, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 30 }],
        },
    },
    {
        id: 'adamantite_kiteshield', name: 'Adamantite Kiteshield', description: 'A large, sturdy adamantite shield.', stackable: false, value: 2500,
        iconUrl: 'https://api.iconify.design/game-icons:shield.svg', material: 'adamantite',
        equipment: {
            slot: EquipmentSlot.Shield, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: -12,
            stabDefence: 42, slashDefence: 40, crushDefence: 38, rangedDefence: 20, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 30 }],
        },
    },
    // Runic
    {
        id: 'runic_full_helm', name: 'Runic Full Helm', description: 'A sturdy runic helmet.', stackable: false, value: 3600,
        iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg', material: 'runic',
        equipment: {
            slot: EquipmentSlot.Head, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -5, magicAttack: -6,
            stabDefence: 42, slashDefence: 40, crushDefence: 38, rangedDefence: 15, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 40 }],
        },
    },
    {
        id: 'runic_platebody', name: 'Runic Platebody', description: 'Provides excellent protection for the torso.', stackable: false, value: 9500,
        iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg', material: 'runic',
        equipment: {
            slot: EquipmentSlot.Body, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -25, magicAttack: -30,
            stabDefence: 80, slashDefence: 78, crushDefence: 72, rangedDefence: 28, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 40 }],
        },
    },
    {
        id: 'runic_platelegs', name: 'Runic Platelegs', description: 'Sturdy platelegs made from runic metal.', stackable: false, value: 5400,
        iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg', material: 'runic',
        equipment: {
            slot: EquipmentSlot.Legs, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: -12, magicAttack: -18,
            stabDefence: 60, slashDefence: 58, crushDefence: 55, rangedDefence: 22, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 40 }],
        },
    },
    {
        id: 'runic_kiteshield', name: 'Runic Kiteshield', description: 'A large, sturdy runic shield.', stackable: false, value: 5000,
        iconUrl: 'https://api.iconify.design/game-icons:shield.svg', material: 'runic',
        equipment: {
            slot: EquipmentSlot.Shield, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: -15,
            stabDefence: 52, slashDefence: 50, crushDefence: 48, rangedDefence: 25, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 40 }],
        },
    },
    // Aquatite
    {
        id: 'aquatite_full_helm', name: 'Aquatite Full Helm', description: 'A helmet forged from Aquatite. Provides excellent protection, especially against projectiles.', stackable: false, value: 60000,
        iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg', material: 'aquatite',
        equipment: {
            slot: EquipmentSlot.Head, stabAttack: 0, slashAttack: 0, crushAttack: 0, magicAttack: -10, rangedAttack: -5,
            stabDefence: 40, slashDefence: 42, crushDefence: 38, magicDefence: -5, rangedDefence: 45,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 60 }],
        },
    },
    {
        id: 'aquatite_platebody', name: 'Aquatite Platebody', description: 'Provides powerful protection for the torso, especially against ranged attacks.', stackable: false, value: 150000,
        iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg', material: 'aquatite',
        equipment: {
            slot: EquipmentSlot.Body, stabAttack: 0, slashAttack: 0, crushAttack: 0, magicAttack: -30, rangedAttack: -15,
            stabDefence: 95, slashDefence: 92, crushDefence: 88, magicDefence: -10, rangedDefence: 100,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 60 }],
        },
    },
    {
        id: 'aquatite_platelegs', name: 'Aquatite Platelegs', description: 'Sturdy platelegs made from Aquatite. Excellent against arrows.', stackable: false, value: 95000,
        iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg', material: 'aquatite',
        equipment: {
            slot: EquipmentSlot.Legs, stabAttack: 0, slashAttack: 0, crushAttack: 0, magicAttack: -21, rangedAttack: -7,
            stabDefence: 65, slashDefence: 62, crushDefence: 60, magicDefence: -6, rangedDefence: 68,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 60 }],
        },
    },
    {
        id: 'aquatite_kiteshield', name: 'Aquatite Kiteshield', description: 'A large, sturdy shield made from Aquatite.', stackable: false, value: 90000,
        iconUrl: 'https://api.iconify.design/game-icons:shield.svg', material: 'aquatite',
        equipment: {
            slot: EquipmentSlot.Shield, stabAttack: 0, slashAttack: 0, crushAttack: 0, magicAttack: -12, rangedAttack: -8,
            stabDefence: 60, slashDefence: 62, crushDefence: 58, magicDefence: -4, rangedDefence: 65,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 60 }],
        },
    },
    // Leather
    {
        id: 'leather_body', name: 'Leather Body', description: 'Provides minor protection.', stackable: false, value: 30,
        iconUrl: 'https://api.iconify.design/game-icons:leather-vest.svg',
        equipment: {
            slot: EquipmentSlot.Body, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 5, slashDefence: 8, crushDefence: 7, rangedDefence: 2, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
        }
    },
    {
        id: 'leather_gloves', name: 'Leather Gloves', description: 'Simple leather gloves.', stackable: false, value: 15,
        iconUrl: 'https://api.iconify.design/game-icons:gloves.svg',
        equipment: {
            slot: EquipmentSlot.Gloves, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 1, slashDefence: 1, crushDefence: 1, rangedDefence: 1, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
        }
    },
    {
        id: 'leather_boots', name: 'Leather Boots', description: 'Simple leather boots.', stackable: false, value: 15,
        iconUrl: 'https://api.iconify.design/game-icons:leather-boot.svg',
        equipment: {
            slot: EquipmentSlot.Boots, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 1, slashDefence: 1, crushDefence: 1, rangedDefence: 1, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
        }
    },
    {
        id: 'leather_cowl', name: 'Leather Cowl', description: 'A simple leather hood.', stackable: false, value: 20,
        iconUrl: 'https://api.iconify.design/game-icons:light-helm.svg',
        equipment: {
            slot: EquipmentSlot.Head, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 1, slashDefence: 2, crushDefence: 2, rangedDefence: 1, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [ { skill: SkillName.Defence, level: 1 }, { skill: SkillName.Ranged, level: 1 }, ],
        }
    },
    {
        id: 'leather_vambraces', name: 'Leather Vambraces', description: 'Sturdy leather arm guards.', stackable: false, value: 25,
        iconUrl: 'https://api.iconify.design/game-icons:bracers.svg',
        equipment: {
            slot: EquipmentSlot.Gloves, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 2, magicAttack: 0,
            stabDefence: 1, slashDefence: 2, crushDefence: 1, rangedDefence: 1, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [ { skill: SkillName.Defence, level: 1 }, { skill: SkillName.Ranged, level: 1 }, ],
        }
    },
    {
        id: 'leather_chaps', name: 'Leather Chaps', description: 'Protective leather leg coverings.', stackable: false, value: 25,
        iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg',
        equipment: {
            slot: EquipmentSlot.Legs, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 2, slashDefence: 4, crushDefence: 3, rangedDefence: 1, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
        }
    },
    // Jewelry
    {
        id: 'silver_ring', name: 'Silver Ring', description: 'A simple silver ring.', stackable: false, value: 600,
        iconUrl: 'https://api.iconify.design/game-icons:ring.svg', material: 'silver',
        equipment: {
            slot: EquipmentSlot.Ring, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0,
        },
    },
    {
        id: 'silver_necklace', name: 'Silver Necklace', description: 'A simple silver necklace.', stackable: false, value: 675,
        iconUrl: 'https://api.iconify.design/game-icons:necklace.svg', material: 'silver',
        equipment: {
            slot: EquipmentSlot.Necklace, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0,
        },
    },
    {
        id: 'silver_amulet', name: 'Silver Amulet', description: 'A simple silver amulet on a string.', stackable: false, value: 800,
        iconUrl: 'https://api.iconify.design/game-icons:gem-pendant.svg', material: 'silver',
        equipment: {
            slot: EquipmentSlot.Necklace, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0,
        },
    },
    // Other
    {
        id: 'wooden_shield', name: 'Wooden Shield', description: 'A simple wooden shield.', stackable: false, value: 15,
        iconUrl: 'https://api.iconify.design/game-icons:round-shield.svg', material: 'iron-ore',
        equipment: {
            slot: EquipmentSlot.Shield, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 4, slashDefence: 5, crushDefence: 3, rangedDefence: 2, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
        },
    },
    {
        id: 'goblin_mail', name: 'Goblin Mail', description: 'Crude but effective armor made by goblins.', stackable: false, value: 15,
        iconUrl: 'https://api.iconify.design/game-icons:mail-shirt.svg',
        equipment: {
            slot: EquipmentSlot.Body, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 4, slashDefence: 6, crushDefence: 8, rangedDefence: 0, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0,
        }
    },
    {
        id: 'spiked_cape', name: 'Spiked Cape', description: 'A tough leather cape reinforced with sharp iron spikes. Has a chance to damage melee attackers.', stackable: false, value: 800,
        iconUrl: 'https://api.iconify.design/game-icons:spiked-armor.svg',
        equipment: {
            slot: EquipmentSlot.Cape, stabAttack: 0, slashAttack: 0, crushAttack: 0, rangedAttack: 0, magicAttack: 0,
            stabDefence: 1, slashDefence: 2, crushDefence: 2, rangedDefence: 1, magicDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, requiredLevels: [{ skill: SkillName.Defence, level: 20 }],
        }
    },
];
