/**
 * ===================================
 * Rebuild calculator
 * ===================================
 */

function updateOneBuildingName(resource, tier) {
	$('.building-' + resource + '-t' + tier + '-name').text(rebuild[resource].buildings[tier-1]);
}

function neededResourceForTier(resource, tier) {

	var rating = rebuild[resource].rating[tier-1];
	var cost = rebuild[resource].cost;
	var currentRank = dataInput['building-' + resource + '-rank'];
	var progressionToDo = 100;

	if (currentRank == tier - 1) {
		var currentProgression = dataInput['building-' + resource + '-progress'];
		progressionToDo -= currentProgression;
	}

	var costForRank = progressionToDo / rating * cost

	return costForRank;
}

function neededResourcesForBuilding(resource, tier) {
	var totalResource = 0;

	var currentRank = parseInt(dataInput['building-' + resource + '-rank']) + 1;

	for (var i = currentRank ; i <= tier ; i++) {
		totalResource += neededResourceForTier(resource, i);
	}

	return totalResource;
}

function updateTimeForRebuild(resource, tier) {

	var needed = neededResourcesForBuilding(resource, tier);

	var dropRates = getOnlineDrop(resource);
	var dropRate = dropRates['dropRate'];
	var petName = dropRates['petName'];
	var mordekResourceDropRate = dropRates['mordekResourceDropRate'];
	var petResourceDropRate = dropRates['petResourceDropRate'];
	var currentDropRate = dropRates['currentDropRate'];

	if (needed <= 0) {
		$('.building-' + resource + '-pet-t' + tier + '-natural').text("Done");
		$('.building-' + resource + '-pet-t' + tier + '-current').text("Done");
		if ( (resource == 'gold' && petName == 'snake') ||
			 (resource == 'wood' && petName == 'bird') ||
			 (resource == 'stone' && petName == 'dog') ||
			 (resource == 'metal' && petName == 'fox') ||
			 (resource == 'gem' && petName == 'pinguin')) {
			$('.building-' + resource + '-pet-t' + tier + '-' + petName).text("Done");
		}
		$('.building-' + resource + '-pet-t' + tier + '-mordek').text("Done");	
	} else {
		var nbSecNatural = needed / dropRate;
		var nbSecCurrent = needed / currentDropRate;
		var nbSecPet = needed / petResourceDropRate;
		var nbSecMordek = needed / mordekResourceDropRate;

		$('.building-' + resource + '-pet-t' + tier + '-natural').text(secsToTimeBis(nbSecNatural));
		$('.building-' + resource + '-pet-t' + tier + '-current').text(secsToTimeBis(nbSecCurrent));
		if ( (resource == 'gold' && petName == 'snake') ||
			(resource == 'wood' && petName == 'bird') ||
			(resource == 'stone' && petName == 'dog') ||
			(resource == 'metal' && petName == 'fox') ||
			(resource == 'gem' && petName == 'pinguin')) {
			$('.building-' + resource + '-pet-t' + tier + '-' + petName).text(secsToTimeBis(nbSecPet));
		}
		$('.building-' + resource + '-pet-t' + tier + '-mordek').text(secsToTimeBis(nbSecMordek));
	}
}

function updateBuildingsConstructionTime(resource) {
	for (var i = 1; i < 5; i++) {
		if (parseInt(dataInput['building-' + resource + '-rank']) < i) {
			updateTimeForRebuild(resource, i)
		} else {
			$("span[class^='building-" + resource + "-pet-t" + i +"-']").text('Done');
		}
	}
}

function updateBuildingsResource(resource){
	for (var i = 1; i < 5; i++) {
		updateOneBuildingName(resource, i);
	}
	if (parseInt(dataInput['building-' + resource + '-rank']) < 4) {
		$('.building-' + resource + '-current-name').text(rebuild[resource].buildings[dataInput['building-' + resource + '-rank']] + ' progression');
		$('#building-' + resource + '-progress').show();
	} else {
		$('.building-' + resource + '-current-name').text('All buildings are finished');
		$('#building-' + resource + '-progress').hide();
	}
	updateBuildingsConstructionTime(resource);
}


function updateRebuild(){
	updateBuildingsResource("gold");
	updateBuildingsResource("wood");
	updateBuildingsResource("stone");
	updateBuildingsResource("metal");
	updateBuildingsResource("gem");
}