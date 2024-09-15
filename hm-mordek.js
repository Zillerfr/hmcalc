/**
 * ===================================
 * Boss Fight Simulator
 * ===================================
 */

function updateBossType() {

	var bossType = $('.select-boss-type').val();
	if (bossType == "1") {
		$(".selected-boss").text("Loyalist");
		if ($("#fight-boss-level").val() > 3) {
			$("#fight-boss-level").val(3);
		}
	} else {
		$(".selected-boss").text("Mordek");
	}
	updateBossFight();

}

function getBossStat(level) {
	var bossType = $('.select-boss-type').val();
	if (bossType == "1") {
		return getLoyalistStat(level);
	} else {
		return getMordekStat(level);
	}
}

function getMordekStat(level) {
	if (level < 1) level = 1;
	return {
		'attack' : 50 * Math.pow(5,level-1),
		'hp' : 100000 * Math.pow(8,level-1),
		'regen' : 400 * Math.pow(8,level-1)
		}
}

function getLoyalistStat(level) {
	var atkMult = 1;
	if (level < 1) level = 1;
	if (level > 3) level = 3;
	if (level == 1) atkMult = 3;
	if (level == 3) atkMult = 10;
	return {
		'attack' : 3000000000000 * Math.pow(10,level-1) * atkMult,
		'hp' : 45000000000000000000 * Math.pow(10,level-1),
		'regen' : 4000000000 * Math.pow(10,level-1)
		}
}

 const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const getNextRound = (sleepTime, round) => {
  return sleep(sleepTime).then(v => round + 1)
}

const doBossFight = async _ => {

	if ($(".fight-boss-level").prop("disabled")) return;

	// data init
	var bossLevel = $(".fight-boss-level").val();
	var bossAttack = getBossStat(bossLevel).attack;
	var bossRegen = getBossStat(bossLevel).regen;
	var bossBaseHp = getBossStat(bossLevel).hp;
	var bossHp = bossBaseHp;

	var playerHp = parseFloat(dataInput['stat-health']);
	if (isNaN(playerHp)) playerHp = 30;
	var criticalChance = parseFloat(dataInput['stat-critical']);
	if (isNaN(criticalChance)) criticalChance = 0;	
	var playerAttack = parseFloat(dataInput['stat-attack']);
	if (isNaN(playerAttack)) playerHp = 1;
	var sanctumAttackLevel = parseFloat(dataInput["sanctum-attack"]);
	if (isNaN(sanctumAttackLevel) || sanctumAttackLevel < 0) sanctumAttackLevel = 0;
	var sanctumAttackBonus = 1 + (heroAdditionnalBonus("",sanctumAttackLevel) / 100);
	var sanctumAttackDuration = parseFloat(dataInput["sanctum-attack-duration"]);
	if (isNaN(sanctumAttackDuration)) sanctumAttackDuration = 30;
	var sanctumDefenseLevel = parseFloat(dataInput["sanctum-defense"]);
	if (isNaN(sanctumDefenseLevel) || sanctumDefenseLevel < 0) sanctumDefenseLevel = 0;
	if (sanctumDefenseLevel > dataInformation.caps.stoneskin) sanctumDefenseLevel = dataInformation.caps.stoneskin;
	var sanctumDefenseBonus = 1 - (heroAdditionnalBonus("",sanctumDefenseLevel) / 100);
	var sanctumDefenseDuration = parseFloat(dataInput["sanctum-defense-duration"]);
	if (isNaN(sanctumDefenseDuration)) sanctumDefenseDuration = 30;

	var fightSpeed = $('.select-fight-speed').val();
	if (isNaN(fightSpeed)) fightSpeed = 0;
	var innerSanctumUse = $('.fight-use-inner').prop("checked");
	var criticalBonus = 1 + criticalChance / 100;

	// start - bloc inputs
	if (fightSpeed > 0) {
		$('.select-fight-speed').prop("disabled", true);
		$(".fight-use-inner").prop("disabled", true);
		$(".fight-boss-level").prop("disabled", true);
		$("#mordek-fight-button").prop("disabled", true);
		$(".tabs_wrap").slideUp("1500");
	}

	var round = 0;
	while (bossHp > 0 && playerHp > 0) {

		var fireBladeBonus = 1;
		var stoneSkinBonus = 1;
		if (innerSanctumUse && (sanctumAttackDuration > round/4)) {
			fireBladeBonus = sanctumAttackBonus;
		}
		if (innerSanctumUse && (sanctumDefenseDuration > round/4)) {
			stoneSkinBonus = sanctumDefenseBonus;
		}

		if ((playerAttack * fireBladeBonus) < (4* bossRegen)) {
			break;
		}

		// player attacks
		if (round/4 == Math.trunc(round/4)) {
			bossHp = bossHp - (playerAttack * fireBladeBonus * criticalBonus);
		}
		// boss regen
		if (bossHp > 0) bossHp += bossRegen;
		if (bossHp > bossBaseHp) bossHp = bossBaseHp;

		// boss attack
		if (round == 0) playerHp -= 3 * bossAttack;
		playerHp -= (bossAttack * stoneSkinBonus);

		$('.player-current-hp').text(formatCount(playerHp));
		$("#player-hp").val(playerHp);
		$('.mordek-current-hp').text(formatCount(bossHp));
		$("#mordek-hp").val(bossHp);

		if (fightSpeed > 0) {
			const nextRound = await getNextRound(250 / fightSpeed, round);
			round = nextRound;
		} else {
			round += 1;
		}

		if (round > 20 && bossHp == bossBaseHp) {
			break;
		}

		if (round > 12000 && bossHp > (bossBaseHp * 0.75)) {
			bossHp = bossBaseHp;
			break;
		}
	}

	var nbSecFight = Math.trunc(round/4);
	if (bossHp <= 0) {
		$('.result-ok').show();
		$('.mordek-fight-duration').text(secsToTimeBis(nbSecFight));
		$('.mordek-fight-duration').show();
	} else {
		if (bossHp < bossBaseHp) {
			var nbTryNeeded = bossBaseHp / (bossBaseHp - bossHp);
			var stringNbTry = ", you need ";
			if (nbTryNeeded > 50) {
				stringNbTry += "more than 50";
			} else {
				stringNbTry += Math.ceil(nbTryNeeded);
			}
			stringNbTry += " tries to beat him";
			$('.result-nbtry').text(stringNbTry);
			$('.mordek-fight-duration').text(secsToTimeBis(nbSecFight));
			$('.mordek-fight-duration').show();
		} else {
			$('.result-nbtry').text(", you need to train before being able to beat him");
		}
		$('.result-ko').show();
	}

	// end - restore inputs
	if (fightSpeed > 0) {
		$('.select-fight-speed').prop("disabled", false);
		$(".fight-use-inner").prop("disabled", false);
		$(".fight-boss-level").prop("disabled", false);
		$("#mordek-fight-button").prop("disabled", false);
		$(".tabs_wrap").slideDown("1500");
	}
}

function updateBossFight() {

	$('.result-ok').hide();
	$('.result-ko').hide();
	$('.mordek-fight-duration').hide();

	var playerHp = parseFloat(dataInput['stat-health']);
	if (isNaN(playerHp)) playerHp = 30;
	$('.player-max-hp').text(formatCount(playerHp));
	$('.player-current-hp').text(formatCount(playerHp));
	$("#player-hp").val(playerHp);
	$("#player-hp").prop("max", playerHp);

	var bossLevel = $(".fight-boss-level").val();
	saveToStorage("fight-boss-level", bossLevel);
	var bossHp = getBossStat(bossLevel).hp;
	$('.mordek-max-hp').text(formatCount(bossHp));
	$('.mordek-current-hp').text(formatCount(bossHp));
	$("#mordek-hp").val(bossHp);
	$("#mordek-hp").prop("max", bossHp);
}