/**
 * https://bit.ly/3gCyxWa
 * first_Term: The first term of the geometric progression.
 * common_Ratio: The common ratio of the geometric progression.
 * num_Of_Terms: The number of terms in the progression.
 */
function sumOf_Geometric_Progression(first_Term, common_Ratio, num_Of_Terms) {
  if (!Number.isFinite(num_Of_Terms)) {
    /*
      If the number of Terms is Infinity, the common ratio needs to be less than 1 to be a convergent geometric progression
      Article on Convergent Series: https://en.wikipedia.org/wiki/Convergent_series
    */
    if (Math.abs(common_Ratio) < 1) return first_Term / (1 - common_Ratio)
    throw new Error('The geometric progression is diverging, and its sum cannot be calculated')
  }
  if (common_Ratio === 1) return first_Term * num_Of_Terms
  return (first_Term * (Math.pow(common_Ratio, num_Of_Terms) - 1)) / (common_Ratio - 1)
}


function doUpdateEvolutionCost() {
	updateEvolutionCost('bird');
	updateEvolutionCost('dog');
	updateEvolutionCost('fox');
	updateEvolutionCost('pinguin');
	updateEvolutionCost('snake');
	updateEvolutionCost('turtle');
	updateEvolutionCost('cat');
	updateEvolutionCost('mordek');
	getTotalEvolutionCostAllPets();
}

function getTotalEvolutionCostAllPets() {
	var totalAscensionCost = 0;
	totalAscensionCost += getTotalEvolutionCostPet('bird');
	totalAscensionCost += getTotalEvolutionCostPet('dog');
	totalAscensionCost += getTotalEvolutionCostPet('fox');
	totalAscensionCost += getTotalEvolutionCostPet('pinguin');
	totalAscensionCost += getTotalEvolutionCostPet('snake');
	totalAscensionCost += getTotalEvolutionCostPet('turtle');
	totalAscensionCost += getTotalEvolutionCostPet('cat');
	totalAscensionCost += getTotalEvolutionCostPet('mordek');

	$(".total-evolution-cost-all-pets").text(formatCount(totalAscensionCost));

	// Ingame Values
	var ascensionDataBase = getAscensionData();
	var ascensionBonusPerSeconds = ascensionDataBase.nextHourAscensionBonus / 3600;
	var nbSecondsAscensionCost = totalAscensionCost/ascensionBonusPerSeconds;
	$(".total-evolution-time-all-pets").text(secsToTimeBis(nbSecondsAscensionCost));

	// Simulated Difficulty
	for (let index = 0; index < dataInformation.difficulty.length; ++index) {
		// With turtle
		var classEvolCostTimeTurtle = ".total-evolution-time-all-pets-with-turtle-" + index;
		var ascensionDataTurtle = getAscensionData(true, true, true, index);
		ascensionBonusPerSeconds = ascensionDataTurtle.nextHourAscensionBonus / 3600;
		nbSecondsAscensionCost = totalAscensionCost/ascensionBonusPerSeconds;
		$(classEvolCostTimeTurtle).text(secsToTimeBis(nbSecondsAscensionCost));

		// Without turtle
		var classEvolCostTimeNoTurtle = ".total-evolution-time-all-pets-without-turtle-" + index;
		var ascensionDataNoTurtle = getAscensionData(true, false, true, index);
		ascensionBonusPerSeconds = ascensionDataNoTurtle.nextHourAscensionBonus / 3600;
		nbSecondsAscensionCost = totalAscensionCost/ascensionBonusPerSeconds;
		$(classEvolCostTimeNoTurtle).text(secsToTimeBis(nbSecondsAscensionCost));

	};
}

function getTotalEvolutionCostPet(petName) {
	var inputTabPetEvolve = 'pet-tab-' + petName + '-evolution';
	var petEvolution = parseInt($('#' + inputTabPetEvolve).val());
	var inputTabPetEvolveTarget = inputTabPetEvolve + '-target';
	var petEvolutionTarget = parseInt($('#' + inputTabPetEvolveTarget).val());

	return getTotalEvolutionCost(petName, petEvolution, petEvolutionTarget);
}

function petEvolutionCost(petName, petEvolution) {
	var calcMult = dataInformation.evolution.basemultiplier;
	var calcBaseCost = dataInformation.evolution.basecost[petName];
	var calcTarget = petEvolution - 1;

	return sumOf_Geometric_Progression(calcBaseCost, calcMult, calcTarget).toFixed(1);
}

function getTotalEvolutionCost(petName, petEvolution, petEvolutionTarget) {
	var costFrom1ToEvolution = 0;
	if (petEvolution > 1) {
		costFrom1ToEvolution = petEvolutionCost(petName, petEvolution);
	}
	var costFrom1ToTarget = 0;
	if (petEvolutionTarget > 1) {
		costFrom1ToTarget = petEvolutionCost(petName, petEvolutionTarget);
	}
	var totalCost = costFrom1ToTarget - costFrom1ToEvolution;
	return totalCost;
}

function updateEvolutionCost(petName) {
	var inputTabPetEvolve = 'pet-tab-' + petName + '-evolution';
	var petEvolution = parseInt($('#' + inputTabPetEvolve).val());
	var inputTabPetEvolveTarget = inputTabPetEvolve + '-target';
	var petEvolutionTarget = parseInt($('#' + inputTabPetEvolveTarget).val());

	var classEvolCost = '.pet-tab-' + petName + '-evolution-cost';
	var classEvolCostTime = '.pet-tab-' + petName + '-evolution-cost-time';
	var classEvolProgression = '.pet-tab-' + petName + '-evolution-progression';
	var classEvolProgressionCost = '.pet-tab-' + petName + '-evolution-progression-cost';

	var petProgression = ((petEvolutionTarget - petEvolution) / petEvolution) * 100;
	var petProgressionCost = 0;

	if (petEvolutionTarget <= petEvolution) {
		$(classEvolCost).text("0");
		$(classEvolCostTime).text("0");
		$(classEvolProgression).text("0");
		$(classEvolProgressionCost).text("0");
	} else {

		var totalCost = getTotalEvolutionCost(petName, petEvolution, petEvolutionTarget);

		$(classEvolCost).text(formatCount(totalCost));
		petProgressionCost = totalCost / petProgression;
		var ascensionData = getAscensionData();
		var ascensionBonusPerSeconds = ascensionData.nextHourAscensionBonus / 3600;
		var nbSecondsAscensionCost = totalCost/ascensionBonusPerSeconds;
		$(classEvolCostTime).text(secsToTimeBis(nbSecondsAscensionCost));
		$(classEvolProgression).text(formatCount(petProgression) + " %");
		$(classEvolProgressionCost).text(formatCount(petProgressionCost));
	}

}

function checkPetEvolutionValues(petName) {
	var inputTabPetEvolve = 'pet-tab-' + petName + '-evolution';
	var petEvolution = parseInt($('#' + inputTabPetEvolve).val());
	var inputTabPetEvolveTarget = inputTabPetEvolve + '-target';
	var petEvolutionTarget = parseInt($('#' + inputTabPetEvolveTarget).val());

	if (petEvolutionTarget < petEvolution) $('#' + inputTabPetEvolveTarget).val(petEvolution);
	$('#' + inputTabPetEvolveTarget).attr('min', parseInt($('#' + inputTabPetEvolve).val()));
	doUpdateEvolutionCost();
}

function updatePet(petName){
	$('.pet-tab-' + petName + '-evolution-text').hide();

	var petEvolve = parseFloat(dataInput[petName + '-evolve']);
	if (isNaN(petEvolve)) petEvolve = 1;

	var inputTabPetEvolve = 'pet-tab-' + petName + '-evolution';
	var inputTabPetEvolveTarget = inputTabPetEvolve + '-target';

	if ($('#' + inputTabPetEvolve).val() < petEvolve) $('#' + inputTabPetEvolve).val(petEvolve);
	if ($('#' + inputTabPetEvolveTarget).val() < petEvolve) $('#' + inputTabPetEvolveTarget).val(petEvolve);
	updateEvolutionCost(petName)
}

function updatePets(){
	updatePet('bird');
	updatePet('dog');
	updatePet('fox');
	updatePet('pinguin');
	updatePet('snake');
	updatePet('turtle');
	updatePet('cat');
	updatePet('mordek');
	getTotalEvolutionCostAllPets();
}

function calcPetEvolution(idObject){

	var petName = idObject.replace('pet-tab-','').replace('-evolution','').replace('-target','');
	checkPetEvolutionValues(petName);


}