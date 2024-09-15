/**
 * ===================================
 * Time before ascension
 * ===================================
 */

function getLevelPerSecond() {
	var turtleLevel = parseFloat(dataInput['turtle-level']);
	if (isNaN(turtleLevel)) turtleLevel = 0;
	var turtleEvolve = parseFloat(dataInput['turtle-evolve']);
	if (isNaN(turtleEvolve)) turtleEvolve = 1;
	var bonusSpeed = parseFloat(dataInput['bonus-speed']);
	if (isNaN(bonusSpeed)) bonusSpeed = 1;

	var turtleBonus = 0;
	if (dataInput['turtle-equiped'] == true) {
		turtleBonus = turtleEvolve * (dataInformation.dropRate.pets.turtle * turtleLevel / 100);
	}
	return lvPerSecond = (1 + turtleBonus) * bonusSpeed * getDifficultyReward();

}

function getTimeBeforeAscension(highBonus) {
	if (highBonus == true) {
		levelTarget = dataInformation.ascension.slow;
	} else {
		levelTarget = dataInformation.ascension.quick;
	}
	var statLevel = parseFloat(dataInput['stat-level']);
	if (isNaN(statLevel)) statLevel = 0;


	var nbLevelToDo = levelTarget - statLevel;
	if (nbLevelToDo < 0) nbLevelToDo = 0;
	var lvPerSecond = getLevelPerSecond();

	return Math.ceil(nbLevelToDo / lvPerSecond);

}

/**
 * ===================================
 * Update ascension informations
 * ===================================
 */

function updateAscensionTime() {

	var timeBeforeAscension = getTimeBeforeAscension(false);
	var timeBeforeAscensionHigh = getTimeBeforeAscension(true);
	var t = new Date();
	t.setSeconds(t.getSeconds() + timeBeforeAscension);
	var tHigh = new Date();
	tHigh.setSeconds(tHigh.getSeconds() + timeBeforeAscensionHigh);

	options = {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: false,
	};
	var formatedDate = new Intl.DateTimeFormat(navigator.languages[0], options).format(t);
	var formatedDateHigh = new Intl.DateTimeFormat(navigator.languages[0], options).format(tHigh);

	$(".time-before-ascension").text(secsToTime(timeBeforeAscension));
	$(".date-next-ascension").text(formatedDate);
	$(".time-before-ascension-high").text(secsToTime(timeBeforeAscensionHigh));
	$(".date-next-ascension-high").text(formatedDateHigh);
}

function sanctumAttackNeedToReach(attack, health) {
	var level = maxIdleLevelOneShotHealthForcedWithHero(health, true);
	var neededAttack = 30 + 2*level;
	var attackRatio = (neededAttack / attack - 1) * 100;

	return Math.ceil(attackRatio);
}

function maxIdleLevelOneShotAttack(attack) {

	var sanctumAttackLevel = parseFloat(dataInput["sanctum-attack"]);
	if (isNaN(sanctumAttackLevel) || sanctumAttackLevel < 0) sanctumAttackLevel = 0;
	var sanctumAttackBonus = 1 + (heroAdditionnalBonus("rex",sanctumAttackLevel) / 100);
	var modifiedAttack = attack * sanctumAttackBonus;

	if (modifiedAttack < 1) modifiedAttack = 1;
	var maxLevelAttack = Math.trunc((modifiedAttack - 30) / 2);
	if (maxLevelAttack < 1) maxLevelAttack = 1;

	return Math.trunc(maxLevelAttack);
}

function maxIdleLevelOneShotHealthForcedWithHero(health, forced) {

	var sanctumDefenseLevel = parseFloat(dataInput["sanctum-defense"]);
	if (isNaN(sanctumDefenseLevel) || sanctumDefenseLevel < 0) sanctumDefenseLevel = 0;
	if (sanctumDefenseLevel > dataInformation.caps.stoneskin) sanctumDefenseLevel = dataInformation.caps.stoneskin;
	var sanctumDefenseBonus = 0;
	if (forced == true) {
		var sanctumDefenseBonus = 1 - (sanctumBonusWithHero("mira",sanctumDefenseLevel, true) / 100);
	} else {
		var sanctumDefenseBonus = 1 - (heroAdditionnalBonus("mira",sanctumDefenseLevel) / 100);
	}
	var modifiedHealth = health / sanctumDefenseBonus;


	var maxLevelHealth = 2 * modifiedHealth - 1;
	if (maxLevelHealth < 1) maxLevelHealth = 1;

	return Math.trunc(maxLevelHealth);
}

function maxIdleLevelOneShotHealth(health) {
	return maxIdleLevelOneShotHealthForcedWithHero(health, false);
}

function maxIdleLevelOneShot(attack, health) {
	return Math.min(maxIdleLevelOneShotAttack(attack), maxIdleLevelOneShotHealth(health));
}

function getAscensionData(forceTurtle = false, turtleEquiped = false, forceDifficulty = false, difficulty = 0) {
	var speed = parseFloat(dataInput['bonus-speed']);
	if (isNaN(speed) || speed < 1) speed = 1;
	if (speed > dataInformation.caps.speed) speed = dataInformation.caps.speed;
	var attack = parseFloat(dataInput['stat-attack']);
	if (isNaN(attack)) attack = 1;
	var health = parseFloat(dataInput['stat-health']);
	if (isNaN(health)) health = 30;
	var currentLevel = parseFloat(dataInput['stat-level']);
	if (isNaN(currentLevel)) currentLevel = 1;
	var highestLevel = parseFloat(dataInput['stat-level-highest']);
	if (isNaN(highestLevel)) highestLevel = 1;

	var turtleLevel = parseFloat(dataInput['turtle-level']);
	if (isNaN(turtleLevel)) turtleLevel = 0;
	var turtleEvolve = parseFloat(dataInput['turtle-evolve']);
	if (isNaN(turtleEvolve)) turtleEvolve = 1;

	var turtleBonus = 0;
	var isTurtleEquiped = false;
	if (forceTurtle) {
		isTurtleEquiped = turtleEquiped;
	} else {
		isTurtleEquiped = (dataInput['turtle-equiped'] == true);
	}
	if (isTurtleEquiped) {
		turtleBonus = turtleEvolve * (dataInformation.dropRate.pets.turtle * turtleLevel / 100);
	}

	var difficultyReward = 1;
	var difficultyMultipler = 1;
	if (forceDifficulty) {
		difficultyReward = dataInformation.difficulty[difficulty].reward;
		difficultyMultipler = dataInformation.difficulty[difficulty].label;
	} else {
		difficultyReward = getDifficultyReward();
		difficultyMultipler = getDifficultyMultiplier();
	}

	var lvPerSecond = (1 + turtleBonus) * speed * difficultyReward;
	var maxIdleLevel = maxIdleLevelOneShot(attack, health) / difficultyMultipler;
	var maxIdleTime = Math.trunc((maxIdleLevel - currentLevel) / lvPerSecond)
	if (maxIdleTime < 0) maxIdleTime = 0;
	var maxAscensionBonus = calcAscensionLevel(maxIdleLevel);

	var fireBladeForMax = sanctumAttackNeedToReach(attack, health);

	var ascensionMultiplier = parseFloat(dataInput["bonus-ascension"]);
	if (isNaN(ascensionMultiplier)) ascensionMultiplier = 1;
	var ascensionBonus = calcAscensionLevel(highestLevel);
	var nextAscensionBonus = ascensionMultiplier + ascensionBonus;

	var nextHourLevel = currentLevel + 3600 * lvPerSecond;
	if (nextHourLevel > maxIdleLevel) nextHourLevel = maxIdleLevel;
	var currentAscensionBonus = calcAscensionLevel(currentLevel);
	var nextHourTotalAscensionBonus = calcAscensionLevel(nextHourLevel);

	var nextHourAscensionBonus = nextHourTotalAscensionBonus - currentAscensionBonus;
	if (nextHourAscensionBonus < 0) nextHourAscensionBonus = 0;
	


	return {
		'lvPerSecond': lvPerSecond,
		'maxIdleTime': maxIdleTime,
		'maxIdleLevel': maxIdleLevel,
		'maxAscensionBonus': maxAscensionBonus,
		'ascensionBonus': ascensionBonus,
		'nextAscensionBonus': nextAscensionBonus,
		'nextHourAscensionBonus': nextHourAscensionBonus,
		'fireBladeForMax': fireBladeForMax,
		'currentLevel': currentLevel
	};
}

function updateMaxIdleTime() {

	var ascensionData = getAscensionData();

	$('.level-per-second').text(formatCount(Math.round(ascensionData.lvPerSecond)));
	$('.max-idle-time-level').text(secsToTime(ascensionData.maxIdleTime));
	$('.max-idle-level').text(formatCount(ascensionData.maxIdleLevel));
	$('.max-ascension-bonus').text(formatCount(ascensionData.maxAscensionBonus));
	$('.current-ascension-bonus').text(formatCount(ascensionData.ascensionBonus));
	$('.next-ascension-bonus').text(formatCount(ascensionData.nextAscensionBonus));
	$('.next-hour-ascension-bonus').text(formatCount(ascensionData.nextHourAscensionBonus));
	$('.max-idle-skill-upgrade').text(formatCount(ascensionData.fireBladeForMax));
	$('.loyalist-asc-mult').text(getLoyalistMultiplier());


	if (ascensionData.currentLevel >= dataInformation.ascension.quick) {
		$("#ascend-button").prop("disabled", false);
		$(".quick-ascend").hide();
	} else {
		$("#ascend-button").prop("disabled", true);
		$(".quick-ascend").show();
	}
	if (ascensionData.currentLevel >= dataInformation.ascension.slow) {
		$(".slow-ascend").hide();
	} else {
		$(".slow-ascend").show();
	}
}

function getLoyalistMultiplier() {
	var loyalistMultiplier = 1;
	var loyalistTab = dataInput["info-loyalist"];
	if (loyalistTab) {		
		for(var i=0; i< loyalistTab.length; i++) {
			loyalistMultiplier += loyalistTab[i]*dataInformation.loyalist[i];
		}
	}
	return loyalistMultiplier;
}

function calcAscensionLevel(maxLevel) {
	var ascensionBonus = 0;



	if (maxLevel < dataInformation.ascension.quick) {
		return 0;
	}

	if (maxLevel < dataInformation.ascension.slow) {
		ascensionBonus = 0.5 + ((maxLevel - dataInformation.ascension.quick) / 1000000 * 0.3)
	} else {
		ascensionBonus = 2 + ((maxLevel - dataInformation.ascension.slow) / 1000000 * 0.2)
	}

	return (Math.round(ascensionBonus * 10) / 10) * getLoyalistMultiplier();
}

function calcNeededLevelForBonus(ascensionBonusTarget) {
	var modifiedAscensionBonusTarget = ascensionBonusTarget / getLoyalistMultiplier();
	
	var baseBonus = 0.5;
	var baseLevel = dataInformation.ascension.quick;
	var baseCoeff = 0.3;
	if (modifiedAscensionBonusTarget > 2) {
		baseBonus = 2;
		baseLevel = dataInformation.ascension.slow;
		baseCoeff = 0.2;
	}
	return ((modifiedAscensionBonusTarget - baseBonus) / baseCoeff) * 1000000 + baseLevel;
}

function updateAscensionTarget() {
	var ascensionBonusTarget = parseFloat(dataInput['stat-bonus-ascension-target']);
	var currentLevel = parseFloat(dataInput['stat-level']);
	var highestLevel = parseFloat(dataInput['stat-level-highest']);
	var currentAscensionBonus = calcAscensionLevel(highestLevel);

	if (currentAscensionBonus >= ascensionBonusTarget) {
		$('.bonus-ascension-target-level-needed').text("0");
		$('.bonus-ascension-target-level-missing').text("0");
		$('.bonus-ascension-target-time-needed').text("Done");
	} else {
		var targetLevel = calcNeededLevelForBonus(ascensionBonusTarget);
		var neededLevel = targetLevel - currentLevel;
		var levelPerSecond = getLevelPerSecond();
		var nbSeconds = Math.ceil(neededLevel / levelPerSecond);

		$('.bonus-ascension-target-level-needed').text(formatCount(targetLevel.toFixed(0)));
		$('.bonus-ascension-target-level-missing').text(formatCount(neededLevel.toFixed(0)));
		$(".bonus-ascension-target-time-needed").text(secsToTime(nbSeconds) + " (" + formatCount(nbSeconds.toFixed(0)) + " seconds)");
	}

}