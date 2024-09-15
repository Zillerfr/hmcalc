/**
 * ===================================
 * Get bonus to idle sanctum skills from heroes/tavern
 * ===================================
 */
 function sanctumBonusWithHero(hero, baseBonus, forced) {
	var heroEquiped = dataInput[hero + '-equiped'];
	var heroTraining = parseFloat(dataInput[hero + '-evolve']);
	var heroBonus = baseBonus;

	if (heroEquiped || forced == true) {
		if (baseBonus < 100) {
			heroBonus = baseBonus + heroTraining;
		} else {
			heroBonus = baseBonus * (100 + heroTraining) / 100
		}
	}
	return Math.trunc(heroBonus);
}

function heroAdditionnalBonus(hero, baseBonus) {
	return sanctumBonusWithHero(hero, baseBonus, false);
}


/**
 * ===================================
 * Gods Speed Drops
 * ===================================
 */
function getGodsSpeedBonusResources() {
	var bonusSpeed = parseFloat(dataInput['bonus-speed']);
	if (isNaN(bonusSpeed)) bonusSpeed = 1;
	var ascensionBonus = parseFloat(dataInput['bonus-ascension']);
	if (isNaN(ascensionBonus)) ascensionBonus = 1;
	var godsSpeedDuration = parseFloat(dataInput['sanctum-speed-duration']);
	if (isNaN(godsSpeedDuration)) godsSpeedDuration = 30;
	var godsSpeedLevel = parseFloat(dataInput['sanctum-speed']);
	if (isNaN(godsSpeedLevel)) godsSpeedLevel = 0;
	var godsSpeedLevelWithHero = heroAdditionnalBonus("anantha",godsSpeedLevel)
	var goldPerKill = parseFloat(dataInput['stat-gold']);
	if (isNaN(goldPerKill)) goldPerKill = 1;
	var godsSpeedBonus = 1 + (godsSpeedLevelWithHero * 5 / 100);

	var goldDrop = Math.trunc(getDifficultyReward() * godsSpeedBonus * ascensionBonus * bonusSpeed * godsSpeedDuration * goldPerKill / (1+2.5/300));
	var woodDrop = Math.trunc(getDifficultyReward() * godsSpeedBonus * ascensionBonus * bonusSpeed * godsSpeedDuration * 0.8);
	var stoneDrop = Math.trunc(getDifficultyReward() * godsSpeedBonus * ascensionBonus * bonusSpeed * godsSpeedDuration * 0.15);
	var metalDrop = Math.trunc(getDifficultyReward() * godsSpeedBonus * ascensionBonus * bonusSpeed * godsSpeedDuration * 0.05);

	return {
		'gold' : goldDrop,
		'wood' : woodDrop,
		'stone' : stoneDrop,
		'metal' : metalDrop
		}

}

/**
 * ===================================
 * Drop Rates tab management
 * ===================================
 */

function getOnlineDrop(resource) {
	var dropRate = 0;
	var petDropRate = 0;
	var petName = "";
	switch (resource) {
		case "wood" :
			dropRate = getWoodDropRate();
			petName = "bird";
			petDropRate = getPetDropRate(petName);
			break;
		case "stone" :
			dropRate = getStoneDropRate();
			petName = "dog";
			petDropRate = getPetDropRate(petName);
			break;
		case "metal" :
			dropRate = getMetalDropRate();
			petName = "fox";
			petDropRate = getPetDropRate(petName);
			break;
		case "gem" :
			dropRate = getGemDropRate();
			petName = "pinguin";
			petDropRate = getPetDropRate(petName);
			break;
		case "gold" :
			dropRate = getGoldDropRate();
			petName = "snake";
			petDropRate = getPetDropRate(petName);
			break;
		default:
			break;
	}

	var mordekResourceDropRate = dropRate;
	var petResourceDropRate = dropRate + petDropRate;

	if (resource != "gold") {
		mordekResourceDropRate += getPetDropRate("mordek");
	}

	var currentDropRate = dropRate;
	if (dataInput[petName + '-equiped'] == true) {
		currentDropRate = petResourceDropRate
	} else if (dataInput['mordek-equiped'] == true) {
		currentDropRate = mordekResourceDropRate
	}

	var dropRates = {
		"dropRate": dropRate,
		"petDropRate": petDropRate,
		"currentDropRate": currentDropRate,
		"petResourceDropRate": petResourceDropRate,
		"petName": petName,
		"mordekResourceDropRate": mordekResourceDropRate
	}

	return dropRates;
}

function updateOnlineDrop(resource) {
	var dropRates = getOnlineDrop(resource);
	var dropRate = dropRates['dropRate'];
	var petDropRate = dropRates['petDropRate'];
	var petName = dropRates['petName'];
	var mordekResourceDropRate = dropRates['mordekResourceDropRate'];
	var petResourceDropRate = dropRates['petResourceDropRate'];
	var currentDropRate = dropRates['currentDropRate'];

	$('.' + resource + '-online-drop-natural-s').text(formatCount(Math.trunc(dropRate)));
	$('.' + resource + '-online-drop-natural-h').text(formatCount(Math.trunc(dropRate * 3600)));

	$('.' + resource + '-online-drop-pet-s').text(formatCount(Math.trunc(petResourceDropRate)));
	$('.' + resource + '-online-drop-pet-h').text(formatCount(Math.trunc(petResourceDropRate * 3600)));

	if (resource != "gold") {
		$('.' + resource + '-online-drop-mordek-s').text(formatCount(Math.trunc(mordekResourceDropRate)));
		$('.' + resource + '-online-drop-mordek-h').text(formatCount(Math.trunc(mordekResourceDropRate * 3600)));
	}

	$('.' + resource + '-online-drop-current-s').text(formatCount(Math.trunc(currentDropRate)));
	$('.' + resource + '-online-drop-current-h').text(formatCount(Math.trunc(currentDropRate * 3600)));
}

function updateGodsSpeedDrop() {

	var godsSpeedDrops = getGodsSpeedBonusResources();

	$('.gold-godsspeed-drop').text(formatCount(godsSpeedDrops.gold));
	$('.wood-godsspeed-drop').text(formatCount(godsSpeedDrops.wood));
	$('.stone-godsspeed-drop').text(formatCount(godsSpeedDrops.stone));
	$('.metal-godsspeed-drop').text(formatCount(godsSpeedDrops.metal));
}

function updateDropTab() {
	updateOnlineDrop("wood");
	updateOnlineDrop("stone");
	updateOnlineDrop("metal");
	updateOnlineDrop("gem");
	updateOnlineDrop("gold");
	updateGodsSpeedDrop();
}