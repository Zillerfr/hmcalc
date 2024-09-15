/**
 * ===================================
 * Purchases tab management
 * ===================================
 */

function getGemCost(resource, quantity) {
	return Math.ceil(quantity / dataInformation.resourceCost[resource].quantity) * dataInformation.resourceCost[resource].gemCost;
}

function getGoldDropRate() {
	var dropRate = parseFloat(dataInput['stat-gold']) * parseFloat(dataInput['bonus-ascension']) * parseFloat(dataInput['bonus-speed']);
	if (isNaN(dropRate)) dropRate = 0;
	return dropRate * getDifficultyReward();
}

function getWoodDropRate() {
	var dropRate = parseFloat(dataInformation.dropRate.online.wood) * parseFloat(dataInput['bonus-ascension']) * parseFloat(dataInput['bonus-speed']) / 100;
	if (isNaN(dropRate)) dropRate = 0;
	return dropRate * getDifficultyReward();
}

function getStoneDropRate() {
	var dropRate = parseFloat(dataInformation.dropRate.online.stone) * parseFloat(dataInput['bonus-ascension']) * parseFloat(dataInput['bonus-speed']) / 100;
	if (isNaN(dropRate)) dropRate = 0;
	return dropRate * getDifficultyReward();
}

function getMetalDropRate() {
	var dropRate = parseFloat(dataInformation.dropRate.online.metal) * parseFloat(dataInput['bonus-ascension']) * parseFloat(dataInput['bonus-speed']) / 100;
	if (isNaN(dropRate)) dropRate = 0;
	return dropRate * getDifficultyReward();
}

function getGemDropRate() {
	var dropRate = parseFloat(dataInput['bonus-ascension']) * parseFloat(dataInput['bonus-speed']);
	if (isNaN(dropRate)) dropRate = 0;
	return dropRate * getDifficultyReward();
}

function getPetDropRate(petName) {
	var petEvolve = parseFloat(dataInput[petName + '-evolve']);
	if (isNaN(petEvolve)) petEvolve = 1;

	var dropRate = 0;
	if (petName == "snake") {
		dropRate = petEvolve * parseFloat(dataInput[petName + '-level']) * parseFloat(dataInformation.dropRate.pets.snake) * getGoldDropRate() / 100;
	} else {
		dropRate = petEvolve * parseFloat(dataInput[petName + '-level']) * parseFloat(dataInformation.dropRate.pets[petName]) * parseFloat(dataInput['bonus-ascension']) * parseFloat(dataInput['bonus-speed']) / 100;
	}
	if (isNaN(dropRate)) dropRate = 0;
	return dropRate;
}

function countItemCraftable(item, resource) {

	var resourceQuantity = parseFloat(dataInput['resources-' + resource]);
	if (isNaN(resourceQuantity)) resourceQuantity = 0;
	var neededResourcesPerItem = dataInformation.craftResource[item][resource];

	var craftableItemNumber = Math.trunc(resourceQuantity / neededResourcesPerItem);
	return craftableItemNumber;
}

function calcMissingResource(item, itemQuantity, resource) {
	var resourceInStock = parseFloat(dataInput['resources-' + resource]);
	if (isNaN(resourceInStock)) resourceInStock = 0;

	var neededResourcesPerItem = dataInformation.craftResource[item][resource];

	return itemQuantity * neededResourcesPerItem - resourceInStock;
}

function calcCraftPurchasePerItemAndResource (item, resource) {
	var nbCraftableItem = countItemCraftable(item, resource);
	$('.drain-purchase-' + item + '-' + resource + '-quantity').text(formatCount(nbCraftableItem));
	var missingWoodGemCost = 0;
	var missingStoneGemCost = 0;
	var missingMetalGemCost = 0;
	if (resource != "wood") {
		var missingWood = calcMissingResource(item, nbCraftableItem, "wood");
		if (missingWood < 0) missingWood = 0;
		$('.drain-purchase-' + item + '-' + resource + '-missing-wood').text(formatCount(missingWood));
		missingWoodGemCost = getGemCost("wood", missingWood);
	}
	if (resource != "stone") {
		var missingStone = calcMissingResource(item, nbCraftableItem, "stone");
		if (missingStone < 0) missingStone = 0;
		$('.drain-purchase-' + item + '-' + resource + '-missing-stone').text(formatCount(missingStone));
		missingStoneGemCost = getGemCost("stone", missingStone);
	}
	if (resource != "metal") {
		var missingMetal = calcMissingResource(item, nbCraftableItem, "metal");
		if (missingMetal < 0) missingMetal = 0;
		$('.drain-purchase-' + item + '-' + resource + '-missing-metal').text(formatCount(missingMetal));
		missingMetalGemCost = getGemCost("metal", missingMetal);
	}
	var totalMissingResourceGemCost = missingWoodGemCost + missingStoneGemCost + missingMetalGemCost;
	$('.drain-purchase-' + item + '-' + resource + '-gemcost').text(formatCount(totalMissingResourceGemCost));
}

function calcCraftPurchaseItem(item) {
	calcCraftPurchasePerItemAndResource(item, "wood");
	calcCraftPurchasePerItemAndResource(item, "stone");
	calcCraftPurchasePerItemAndResource(item, "metal");
}

function updateCraftPurchases() {
	calcCraftPurchaseItem("ring");
	calcCraftPurchaseItem("armor");
	calcCraftPurchaseItem("sword");
}

function updateCraftsMaxXp() {
	updateCraftMaxXp("ring");
	updateCraftMaxXp("armor");
	updateCraftMaxXp("sword");
}

function updateCraftMaxXp(item) {
	var maxCraftXp = getMaxCraftXp(item);
	$("." + item + "-max-xp").text(formatCount(maxCraftXp))
	if (parseFloat(dataInput["craft-" + item + "-xp"]) > maxCraftXp) {
		forceValue("craft-" + item + "-xp", maxCraftXp);
	}
}

function getMaxCraftXp(craft) {

	var craftLevel = parseFloat(dataInput["craft-" + craft + "-level"]);
	if (craftLevel > dataInformation.caps.craftlevel - 1) craftLevel = dataInformation.caps.craftlevel - 1;
	var maxCraftXp = nbCraftNeeded(craftLevel + 1);
	if (craftLevel < dataInformation.caps.craftlevel - 1) maxCraftXp -= 1;
	return maxCraftXp;

}

function nbCraftNeeded(level) {
	if (level < 1) level = 1;
	if (level > dataInformation.caps.craftlevel) level = dataInformation.caps.craftlevel;
	var modifier = 1;
	if (level == dataInformation.caps.craftlevel) modifier = 0;
	return (10 * Math.pow(3, level-1))+modifier;
}

function maxStatPerLevel(level) {
	if (level < 0) level = 0;
	if (level > dataInformation.caps.craftlevel - 1) level = dataInformation.caps.craftlevel - 1;
	return 3 * Math.pow(4, level);
}

function nbGemsPerCraft(level) {
	if (level < 1) level = 1;
	if (level > dataInformation.caps.craftlevel - 1) level = dataInformation.caps.craftlevel - 1;
	var number = level - 6;
	if (number < 0) number = 0;
	return number;
}

function updateHarvestTime(resource, missingResourceQuantity) {
	var nbSecondToDrop = 0;
	var dropRate = 0;
	var petDropRate = 0;
	var nbGodsSpeed = 0;
	var petName = "";
	var godsSpeedDrop = getGodsSpeedBonusResources();
	switch (resource) {
		case "wood" :
			dropRate = getWoodDropRate();
			nbGodsSpeed = Math.ceil(missingResourceQuantity / godsSpeedDrop.wood);
			petName = "bird";
			petDropRate = getPetDropRate(petName);
			break;
		case "stone" :
			dropRate = getStoneDropRate();
			nbGodsSpeed = Math.ceil(missingResourceQuantity / godsSpeedDrop.stone);
			petName = "dog";
			petDropRate = getPetDropRate(petName);
			break;
		case "metal" :
			dropRate = getMetalDropRate();
			nbGodsSpeed = Math.ceil(missingResourceQuantity / godsSpeedDrop.metal);
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
			nbGodsSpeed = Math.ceil(missingResourceQuantity / godsSpeedDrop.gold);
			petName = "snake";
			petDropRate = getPetDropRate(petName);
			break;
		default:
			break;
	}
	nbSecondToDrop = missingResourceQuantity / dropRate;
	$('.' + resource + '-harvest-time-nopet').text(secsToTime(nbSecondToDrop));

	var petResourceDropRate = dropRate + petDropRate;
	nbSecondToDrop = missingResourceQuantity / petResourceDropRate;
	$('.' + resource + '-harvest-time-pet').text(secsToTime(nbSecondToDrop));

	var mordekResourceDropRate = dropRate;
	if (resource != "gold") {
		//mordekResourceDropRate += mordekDropRate();
		mordekResourceDropRate += getPetDropRate("mordek");
		nbSecondToDrop = missingResourceQuantity / mordekResourceDropRate;
		$('.' + resource + '-harvest-time-mordek').text(secsToTime(nbSecondToDrop));
	}

	var currentDropRate = dropRate;
	if (dataInput[petName + '-equiped'] == true) {
		currentDropRate = petResourceDropRate
	} else if (dataInput['mordek-equiped'] == true) {
		currentDropRate = mordekResourceDropRate
	}
	nbSecondToDrop = missingResourceQuantity / currentDropRate;
	$('.' + resource + '-harvest-time-equipet').text(secsToTime(nbSecondToDrop));

	if (resource != "gem") {
		$('.' + resource + '-harvest-time-godsspeed').text(formatCount(nbGodsSpeed));
	}
}

function updateHarvestTimeGemsAll(missingResourceQuantity) {
	// TODO
	var nbSecondToDrop = 0;
	var dropRate = getGemDropRate();
	var petDropRate = getPetDropRate("pinguin");

	nbSecondToDrop = missingResourceQuantity / dropRate;
	$('.gem-buying-harvest-time-nopet').text(secsToTime(nbSecondToDrop));

	var petResourceDropRate = dropRate + petDropRate;
	nbSecondToDrop = missingResourceQuantity / petResourceDropRate;
	$('.gem-buying-harvest-time-pet').text(secsToTime(nbSecondToDrop));

	var mordekResourceDropRate = dropRate;
	mordekResourceDropRate += getPetDropRate("mordek");
	nbSecondToDrop = missingResourceQuantity / mordekResourceDropRate;
	$('.gem-buying-harvest-time-mordek').text(secsToTime(nbSecondToDrop));

	var currentDropRate = dropRate;
	if (dataInput['pinguin-equiped'] == true) {
		currentDropRate = petResourceDropRate
	} else if (dataInput['mordek-equiped'] == true) {
		currentDropRate = mordekResourceDropRate
	}
	nbSecondToDrop = missingResourceQuantity / currentDropRate;
	$('.gem-buying-harvest-time-equipet').text(secsToTime(nbSecondToDrop));

}

function updateResourceCraftItem(item, resource, neededResourceQuantity) {
	var resourceStock = parseFloat(dataInput['resources-' + resource])
	var missingResource = neededResourceQuantity - resourceStock;
	if (missingResource < 0) missingResource = 0;

	$('.' + resource + '-needed-' + item).text(formatCount(neededResourceQuantity));
	if (resource != 'gem') {
		$('.' + resource + '-miss-' + item).text(formatCount(missingResource));
		if (resource != 'gold') {
			var gemCost = getGemCost(resource, missingResource);
			dataInput['gem-cost-' + item] += gemCost;
			$('.' + resource + '-cost-' + item).text(formatCount(gemCost));
		}
	} else {

	}

	if (item == "all") {
		updateHarvestTime(resource, missingResource);
	}

}

function updateCraftItem(item) {
	var numberToCraft = {}

	if (item == 'all') {
		var numberToCraftRing = getNumbersToCraft("ring");
		var numberToCraftSword = getNumbersToCraft("sword");
		var numberToCraftArmor = getNumbersToCraft("armor");
		numberToCraft.number = numberToCraftRing.number + numberToCraftSword.number + numberToCraftArmor.number;
		numberToCraft.gold = numberToCraftRing.gold + numberToCraftSword.gold + numberToCraftArmor.gold;
		numberToCraft.wood = numberToCraftRing.wood + numberToCraftSword.wood + numberToCraftArmor.wood;
		numberToCraft.stone = numberToCraftRing.stone + numberToCraftSword.stone + numberToCraftArmor.stone;
		numberToCraft.metal = numberToCraftRing.metal + numberToCraftSword.metal + numberToCraftArmor.metal;
		numberToCraft.gem = numberToCraftRing.gem + numberToCraftSword.gem + numberToCraftArmor.gem;
	} else {
		numberToCraft = getNumbersToCraft(item);
	}
	dataInput['gem-cost-' + item] = 0;
	updateResourceCraftItem(item, "gold", numberToCraft.gold);
	updateResourceCraftItem(item, "wood", numberToCraft.wood);
	updateResourceCraftItem(item, "stone", numberToCraft.stone);
	updateResourceCraftItem(item, "metal", numberToCraft.metal);
	updateResourceCraftItem(item, "gem", numberToCraft.gem);

	$('.nb-craft-' + item).text(formatCount(numberToCraft.number));
	$('.gem-cost-' + item).text(formatCount(parseFloat(dataInput['gem-cost-' + item] + numberToCraft.gem)));
	var gemCostMiss = parseFloat(dataInput['gem-cost-' + item] + numberToCraft.gem) - parseFloat(dataInput['resources-gem']);
	if (gemCostMiss < 0) gemCostMiss = 0;
	$('.gem-cost-miss-' + item).text(formatCount(gemCostMiss));
	if (item == 'all') {
		updateHarvestTimeGemsAll(gemCostMiss);
	}

	$('.' + item + '-from-level').text(parseFloat(dataInput['craft-' + item + '-level']));
	$('.' + item + '-to-level').text(parseFloat(dataInput['craft-' + item + '-target']));
}

function updateCraftTab() {
	updateCraftItem("ring");
	updateCraftItem("sword");
	updateCraftItem("armor");
	updateCraftItem("all");

	$('.craft-level-cap').text(dataInformation.caps.craftlevel-1);
	$('.craft-level-cap-maxed').text(dataInformation.caps.craftlevel);
}

function getNumbersToCraft(item) {

	var itemLevel = parseFloat(dataInput['craft-' + item + '-level']);
	var itemCraftXp = parseFloat(dataInput['craft-' + item + '-xp']);
	var itemTargetLevel = parseFloat(dataInput['craft-' + item + '-target']);
	var itemCraftData = {
		'number': 0,
		'gold': 0,
		'wood': 0,
		'stone': 0,
		'metal': 0,
		'gem': 0
	};

	for (let i = itemLevel + 1; i <= itemTargetLevel; i++) {
		var countCraft = nbCraftNeeded(i);
		if (i == itemLevel + 1) {
			countCraft -= itemCraftXp;
			if (countCraft < 0) countCraft = 0;
		}
		itemCraftData.number += countCraft;
		itemCraftData.gold += countCraft * dataInformation.craftResource[item].gold;
		itemCraftData.wood += countCraft * dataInformation.craftResource[item].wood;
		itemCraftData.stone += countCraft * dataInformation.craftResource[item].stone;
		itemCraftData.metal += countCraft * dataInformation.craftResource[item].metal;
		itemCraftData.gem += countCraft * nbGemsPerCraft(i-1);
	}
	return itemCraftData;
}