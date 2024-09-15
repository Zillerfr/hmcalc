const inputTimerTime = 5000;
let inputTimer;

const inputTimerTimeHide = 5000;
let inputTimerHide = {};

/**
 * ===================================
 * Saved inputs
 * ===================================
 */
var dataInput = {};

/**
 * ===================================
 * Game base data
 * ===================================
 */
const dataInformation = {
	'resourceCost' : {
		'wood' : {
			'quantity' : 100,
			'gemCost' : 10
		},
		'stone' : {
			'quantity' : 10,
			'gemCost' : 10
		},
		'metal' : {
			'quantity' : 1,
			'gemCost' : 10
		}
	},
	'dropRate' : {
		'online' : {
			'wood': 80,
			'stone': 15,
			'metal': 5
		},
		'pets' : {
			'bird' : 1,
			'dog' : 0.5,
			'fox' : 0.25,
			'pinguin' : 0.15,
			'snake' : 0.5,
			'turtle' : 0.2,
			'cat' : 0.3,
			'mordek' : 0.1
		}
	},
	'craftResource' : {
		'ring' : {
			'gold': 100,
			'wood': 30,
			'stone': 8,
			'metal': 2
		},
		'armor' : {
			'gold': 200,
			'wood': 10,
			'stone': 5,
			'metal': 4
		},
		'sword' : {
			'gold': 100,
			'wood': 100,
			'stone': 2,
			'metal': 2
		}
	},
	'caps' : {
		'speed': 2300,
		'stoneskin': 75,
		'craftlevel': 29,
		'minimumCraft': 99,
		'heroLevel': 20,
		'mordekLevel': 8,
		'loyalistLevel': 3,
		'rebuildSteps': 4,
		'crit': 10,
		'petlevel': {
			'bird' : 100,
			'dog' : 200,
			'fox' : 300,
			'pinguin' : 300,
			'snake' : 200,
			'turtle' : 300,
			'cat' : 300,
			'mordek' : 300
		}
	},
	'difficulty': [
		{
			'label': 1,
			'reward': 1
		},{
			'label': 20,
			'reward': 2
		},{
			'label': 50,
			'reward': 5
		},{
			'label': 250,
			'reward': 25
		},{			
			'label': 1000,
			'reward': 100
		}
	],
	'ascension' : {
		'quick' : 2000000,
		'slow' : 7000000,
		'max' : 20000000000
	},
	'evolution' : {
		'basecost': {
			'bird' : 0.5,
			'dog' : 1,
			'fox' : 1.5,
			'pinguin' : 2,
			'snake' : 2.5,
			'turtle' : 3,
			'cat' : 4,
			'mordek' : 5
		},
		'basemultiplier': 1.00006
	},
	'loyalist' : [0, 0.2, 0.3, 0.5]
};

const minValues = {
    "bonus-ascension": 1,
    "bonus-speed": 1,
    "bird-level": "0",
    "dog-level": "0",
    "fox-level": "0",
    "pinguin-level": "0",
    "snake-level": "0",
    "turtle-level": "0",
    "cat-level": "0",
    "mordek-level": "0",
    "gem-cost-ring": 0,
    "gem-cost-sword": 0,
    "gem-cost-armor": 0,
    "gem-cost-all": 0,
    "resources-gold": 0,
    "resources-wood": 0,
    "resources-stone": 0,
    "resources-metal": 0,
    "resources-gem": 0,
    "bonus-craft": 0,
    "stat-attack": 5,
    "stat-gold": 5,
    "stat-regen": 5,
    "stat-health": 30,
    "stat-level": 0,
    "stat-level-highest": 0,
	"stat-bonus-ascension-target": 0,
    "sanctum-attack": 1,
    "sanctum-attack-duration": "30",
    "sanctum-defense": 1,
    "sanctum-defense-duration": "30",
    "sanctum-health": 1,
    "sanctum-gold": 1,
    "sanctum-gold-duration": "30",
    "sanctum-speed": 1,
    "sanctum-speed-duration": "30",
    "craft-ring-level": 0,
    "craft-ring-xp": 0,
    "craft-ring-target": 1,
    "craft-armor-level": 0,
    "craft-armor-xp": 0,
    "craft-armor-target": 1,
    "craft-sword-level": 0,
    "craft-sword-xp": 0,
    "craft-sword-target": 1,
    "bird-equiped": false,
    "dog-equiped": false,
    "fox-equiped": false,
    "pinguin-equiped": false,
    "snake-equiped": false,
    "turtle-equiped": false,
    "cat-equiped": false,
    "mordek-equiped": false,
    "rex-equiped": false,
    "sylvie-equiped": false,
    "mira-equiped": false,
    "leo-equiped": false,
    "anantha-equiped": false,
    "bird-evolve": "1",
    "dog-evolve": "1",
    "fox-evolve": "1",
    "pinguin-evolve": "1",
    "snake-evolve": "1",
    "turtle-evolve": "1",
    "cat-evolve": "1",
    "mordek-evolve": "1",
    "rex-evolve": "1",
    "sylvie-evolve": "1",
    "mira-evolve": "1",
    "leo-evolve": "1",
    "anantha-evolve": "1",
	"building-gold-rank": 0,
	"building-gold-progress": 0,
	"building-wood-rank": 0,
	"building-wood-progress": 0,
	"building-stone-rank": 0,
	"building-stone-progress": 0,
	"building-metal-rank": 0,
	"building-metal-progress": 0,
	"building-gem-rank": 0,
	"building-gem-progress": 0,
    "fight-boss-level": "1",
	"stat-bonus-ascension-target": 0
}

const gameDataNames = {
    "BirdLevel": "bird-level",
    "CatLevel": "cat-level",
	"CraftLevel": "craft-ring-level",
    "CraftLevel2": "craft-armor-level",
    "CraftLevel3": "craft-sword-level",
    "DogLevel": "dog-level",
	"FireBladeDuration": "sanctum-attack-duration",
    "FoxLevel": "fox-level",
	"GameSpeed": "bonus-speed",
    "Gems": "resources-gem",
    "GemsLevel": "building-gem-rank",
    "GemsProgress": "building-gem-progress",
    "GemsStore": "resources-gem-billions",
    "GodsSpeedDuration": "sanctum-speed-duration",
    "GoldLevel": "building-gold-rank",
    "GoldProgress": "building-gold-progress",
    "Metal": "resources-metal",
    "MetalLevel": "building-metal-rank",
    "MetalProgress": "building-metal-progress",
    "MetalStore": "resources-metal-billions",
    "MinimumCraft": "bonus-craft",
    "PenguinLevel": "pinguin-level",
    "SnakeLevel": "snake-level",
    "Stone": "resources-stone",
    "StoneLevel": "building-stone-rank",
    "StoneProgress": "building-stone-progress",
    "StoneSkinDuration": "sanctum-defense-duration",
    "StoneStore": "resources-stone-billions",
    "TouchOfMidasDuration": "sanctum-gold-duration",
    "TurtleLevel": "turtle-level",
    "UnknownLevel": "mordek-level",
    "Wood": "resources-wood",
    "WoodLevel": "building-wood-rank",
    "WoodProgress": "building-wood-progress",
    "WoodStore": "resources-wood-billions",
    "XPSlidercurrent": "craft-ring-xp",
    "XPSlidercurrent2": "craft-armor-xp",
    "XPSlidercurrent3": "craft-sword-xp",
    "ananthaLevel": "anantha-evolve",
    "attackPower2": "stat-attack",
    "birdBonus": "bird-evolve",
    "catBonus": "cat-evolve",
    "characterSelect": "selected-character",
    "dogBonus": "dog-evolve",
	"equippedButtonName": "selected-pet",
    "fireBladeLevel": "sanctum-attack",
    "foxBonus": "fox-evolve",
    "globalBonus": "bonus-ascension",
    "godsSpeedLevel": "sanctum-speed",
    "gold": "resources-gold",
    "goldGained2": "stat-gold",
    "healingAuraLevel": "sanctum-health",
    "heroHealth2": "stat-health",
    "regenGained2": "stat-regen",
    "highestLevel": "stat-level-highest",
    "level": "stat-level",
    "leoLevel": "leo-evolve",
    "miraLevel": "mira-evolve",
    "mordekBonus": "mordek-evolve",
    "mordekLevel": "fight-boss-level",
    "penguinBonus": "pinguin-evolve",
    "rexLevel": "rex-evolve",
    "snakeBonus": "snake-evolve",
    "stoneSkinLevel": "sanctum-defense",
    "sylvieLevel": "sylvie-evolve",
    "touchOfMidasLevel": "sanctum-gold",
    "turtleBonus": "turtle-evolve",
	"CurrentRegen3": "stat-critical",
	"Loyalist1Defeated": "info-loyalist",
	"Loyalist2Defeated": "info-loyalist",
	"Loyalist3Defeated": "info-loyalist"
}


const rebuild = {
	"gold": {
		"buildings": ["Labor Force", "Decorations", "Trade Market", "Kings Crown"],
		"rating": [1, 0.1, 0.01, 0.001],
		"cost": 100000000000
	},
	"wood": {
		"buildings": ["Houses", "Furniture", "Fences", "Tools"],
		"rating": [0.1, 0.01, 0.001, 0.0001],
		"cost": 10000000000
	},
	"stone": {
		"buildings": ["Roads", "Statues", "Mines", "Castle"],
		"rating": [0.15, 0.015, 0.0015, 0.00015],
		"cost": 10000000000
	},
	"metal": {
		"buildings": ["Bridges", "Black Smith", "Weapons", "Steam Engine"],
		"rating": [0.2, 0.02, 0.002, 0.0002],
		"cost": 10000000000
	},
	"gem": {
		"buildings": ["Observatory", "Magical Forges", "Crown Jewels", "INFINITY PORTAL"],
		"rating": [0.25, 0.025, 0.0025, 0.00025],
		"cost": 10000000000
	}
}