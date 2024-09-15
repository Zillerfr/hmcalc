function initTheme() {
	const localStorageTheme = localStorage.getItem("theme");
	const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
	var theme = "light";
	if (localStorageTheme !== null) {
		theme = localStorageTheme;
	} else if (systemSettingDark.matches) {
		theme = "dark";
	}
	document.querySelector("html").setAttribute("data-theme", theme);
	$('.select-theme').val(theme);
}

// Adding an eventListener function to change color everytime var check is changed.(checked & unchecked)
function updateTheme() {

	var newTheme = $('.select-theme').val();
	document.querySelector("html").setAttribute("data-theme", newTheme);
	localStorage.setItem("theme", newTheme);
}


function getSeparator(locale, separatorType) {
        const numberWithGroupAndDecimalSeparator = 1000.1;
        return Intl.NumberFormat(locale)
            .formatToParts(numberWithGroupAndDecimalSeparator)
            .find(part => part.type === separatorType)
            .value;
    }

/**
 * ===================================
 * Format Huge numbers with abbrevation
 * ===================================
 */
const COUNT_ABBRS = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg'];


function getNumberFormat() {
	if (document.getElementById("formatAbbr").checked) {
		return "abbr";
	} else if (document.getElementById("formatExpo").checked) {
		return "expo";
	} else {
		return "full";
	}
}


function formatBase(count, maxDigits = 0) {
	const numberFormatter = new Intl.NumberFormat(navigator.languages[0], { maximumFractionDigits: maxDigits, useGrouping: false });
	return numberFormatter.format(count);
}

function formatAbbr(count) {
	const numberFormatterBase = new Intl.NumberFormat(navigator.languages[0], { maximumFractionDigits: 3 });

	const i = 0 === count ? count : Math.floor(Math.log(count) / Math.log(1000));
	return numberFormatterBase.format((count / Math.pow(1000, i))) + " " + COUNT_ABBRS[i];

}

function formatCount(count, maxDigits = 2) {

	const numberFormatter = new Intl.NumberFormat(navigator.languages[0], { maximumFractionDigits: maxDigits });

	let result = 0;
	let sign = "";
	if (count < 0) {
		sign = "-";
		count = Math.abs(count);
	}

	var numberFormat = getNumberFormat();
	if (numberFormat == "expo" && count >= 1) {
		return sign + parseFloat(count).toExponential(2)
	} else if (numberFormat == "abbr" && count >= 1) {
		const i = 0 === count ? count : Math.floor(Math.log(count) / Math.log(1000));
		result = sign + formatAbbr(count);
	} else {
		result = sign + numberFormatter.format(count);
	}


    return result;
}

function initFormat() {
	const numberFormatter = new Intl.NumberFormat(navigator.languages[0], { maximumFractionDigits: 0 });
	const baseNumber = 1234567;
	$('#format-exemple-full').text(numberFormatter.format(baseNumber));
	$('#format-exemple-abbr').text(formatAbbr(baseNumber));
	$('#format-exemple-expo').text(baseNumber.toExponential(2));
}

/**
 * ===================================
 * Format number of days in years / month / Days
 * ===================================
 */
const daysFmt = days => {
  const years = Math.floor(days / 365);
  const months = Math.floor((days - years * 365) / 30);
  const d = Math.round(days - years * 365 - months * 30);

  let res = [];
  if (years > 1) {
    res.push(formatCount(years) + ' years');
  } else if (years == 1) {
    res.push(years + ' year');
  }
  if (months > 1) {
    res.push(months + ' months');
  } else if (months == 1) {
    res.push(months + ' month');
  }
  if (d > 1) {
    res.push(d + ' days, ');
  } else if (d == 1) {
    res.push(d + ' day, ');
  }

  return res.join(', ');
}

/**
 * ===================================
 * Format number of seconds
 * d Days hh:mm:ss
 * ===================================
 */
function secsToTime(secs) {

	secs = Math.ceil(secs);
	var secsIn2Years = 60 * 60 * 24 * 365 * 2;
	if (secs > secsIn2Years) return "More than 2 years";
	
	let d = secs / 8.64e4 | 0;
	let H = (secs % 8.64e4) / 3.6e3 | 0;
	let m = (secs % 3.6e3)  / 60 | 0;
	let s = secs % 60;
	let z = n=> (n < 10? '0' : '') + n;

	var duration = "";
	if (d > 0) duration += daysFmt(d);
	duration += z(H) + ":" + z(m) + ":" + z(s);

	return duration;

}

/**
 * ===================================
 * Format number of seconds
 * d Days hh hours mm minutes ss seconds
 * ===================================
 */
function secsToTimeBis(secs) {

	secs = Math.ceil(secs);
	var secsIn2Years = 60 * 60 * 24 * 365 * 2;
	if (secs > secsIn2Years) return "More than 2 years";

	let d = secs / 8.64e4 | 0;
	let H = (secs % 8.64e4) / 3.6e3 | 0;
	let m = (secs % 3.6e3)  / 60 | 0;
	let s = secs % 60;

	var duration = "";
	if (d > 0) duration += daysFmt(d);
	if (H == 1) duration += H + " hour ";
	if (H > 1) duration += H + " hours ";
	if (m == 1) duration += m + " minute ";
	if (m > 1) duration += m + " minutes ";
	if (s == 1) duration += s + " second ";
	if (s > 1) duration += s + " seconds ";

	return duration;
}

/**
 * ==================================
 * Storage management
 * ==================================
 */

function updateValuesFromObject(dataObject) {

	dataInput = {};

	for (var key in minValues) {
		if (dataObject.hasOwnProperty(key)) {
			dataInput[key] = dataObject[key];
		}
	}
	localStorage.setItem('herosAndMonstersCalculator', JSON.stringify(dataInput));
}

function updateValuesFromGameObject(dataObject) {
	dataInput = {};

	savedInput = {};
	var retrievedObject = localStorage.getItem('herosAndMonstersCalculator');
	if (retrievedObject) {
		savedInput = JSON.parse(retrievedObject);
	}

	if (savedInput.hasOwnProperty('formatFull')) {
		dataInput['formatFull'] = savedInput['formatFull'];
	}
	if (savedInput.hasOwnProperty('formatAbbr')) {
		dataInput['formatAbbr'] = savedInput['formatAbbr'];
	}
	if (savedInput.hasOwnProperty('formatExpo')) {
		dataInput['formatExpo'] = savedInput['formatExpo'];
	}

	for (var key in gameDataNames) {
		if (dataObject.hasOwnProperty(key)) {

			if (gameDataNames[key].startsWith('resources-')) {
				if (gameDataNames[key].endsWith('-gold')) {
					dataInput[gameDataNames[key]] = parseFloat(dataObject[key]);
				} else {
					if (dataInput.hasOwnProperty(gameDataNames[key])) {
						dataInput[gameDataNames[key]] += parseFloat(dataObject[key]);
					} else {
						dataInput[gameDataNames[key]] = parseFloat(dataObject[key]);
					}
				}
				if (gameDataNames[key].endsWith('-billions')) {
					var resourceKey = gameDataNames[key].replace('-billions', '');
					if (dataInput.hasOwnProperty(resourceKey)) {
						dataInput[resourceKey] += (parseFloat(dataObject[key]) * 1000000000);
					} else {
						dataInput[resourceKey] = (parseFloat(dataObject[key]) * 1000000000);
					}
				}

			} else if (gameDataNames[key] == 'selected-character') {
				var selectedCharacter = '';
				switch (dataObject[key]) {
					case "1":
						selectedCharacter = 'rex';
						break;
					case "2":
						selectedCharacter = 'sylvie';
						break;
					case "3":
						selectedCharacter = 'leo';
						break;
					case "4":
						selectedCharacter = 'mira';
						break;
					case "5":
						selectedCharacter = 'anantha';
						break;
				}
				dataInput["rex-equiped"] = (selectedCharacter == 'rex');
				dataInput["sylvie-equiped"] = (selectedCharacter == 'sylvie');
				dataInput["mira-equiped"] = (selectedCharacter == 'mira');
				dataInput["leo-equiped"] = (selectedCharacter == 'leo');
				dataInput["anantha-equiped"] = (selectedCharacter == 'anantha');
			} else if (gameDataNames[key] == 'selected-pet') {
				var selectedPet = '';
				switch (dataObject[key]) {
					case "EquipBird":
						selectedPet = 'bird';
						break;
					case "EquipDog":
						selectedPet = 'dog';
						break;
					case "EquipFox":
						selectedPet = 'fox';
						break;
					case "EquipPenguin":
						selectedPet = 'pinguin';
						break;
					case "EquipSnake":
						selectedPet = 'snake';
						break;
					case "EquipTurtle":
						selectedPet = 'turtle';
						break;
					case "EquipCat":
						selectedPet = 'cat';
						break;
					case "EquipUnknown":
						selectedPet = 'mordek';
						break;
				}
				dataInput["bird-equiped"] = (selectedPet == 'bird');
				dataInput["dog-equiped"] = (selectedPet == 'dog');
				dataInput["fox-equiped"] = (selectedPet == 'fox');
				dataInput["pinguin-equiped"] = (selectedPet == 'pinguin');
				dataInput["snake-equiped"] = (selectedPet == 'snake');
				dataInput["turtle-equiped"] = (selectedPet == 'turtle');
				dataInput["cat-equiped"] = (selectedPet == 'cat');
				dataInput["mordek-equiped"] = (selectedPet == 'mordek');
			} else if (gameDataNames[key] == 'fight-boss-level') {
				var mordekFightLevel = dataObject[key];
				if (mordekFightLevel > 8) {
					if (dataObject.hasOwnProperty("Loyalist1Defeated") && dataObject.hasOwnProperty("Loyalist2Defeated") && dataObject.hasOwnProperty("Loyalist3Defeated")) {
						if (dataObject["Loyalist1Defeated"] == 0) {
							mordekFightLevel = 1;
						} else if (dataObject["Loyalist2Defeated"] == 0) {
							mordekFightLevel = 2;
						} else {
							mordekFightLevel = 3;
						}
						$('.select-boss-type').val(1);
						updateBossType();

					} else {
						mordekFightLevel = 8;
					}
				}
				dataInput[gameDataNames[key]] = mordekFightLevel;
			} else if (gameDataNames[key] == 'info-loyalist') {
				var loyalistTab = dataInput["info-loyalist"];
				if (!loyalistTab) {
					loyalistTab = [0];
				}
				var loyalistNumber = Number.parseInt(key.replace("Loyalist", "").replace("Defeated", ""));
				loyalistTab[loyalistNumber] = dataObject[key];
				dataInput["info-loyalist"] = loyalistTab;
			} else {				
				var dataValue = dataObject[key];
				var thousandsSeparator = '';
				var decimalSeparator = '';
				try {
					thousandsSeparator = getSeparator(navigator.languages[0], 'group');
				} catch (e) {

				}
				try {
					decimalSeparator = getSeparator(navigator.languages[0], 'decimal');
				} catch (e) {

				}

				dataValue = dataValue.replaceAll(thousandsSeparator,'').replaceAll(decimalSeparator,'.');

				if (gameDataNames[key] == 'bonus-ascension' || gameDataNames[key] == 'bonus-speed') {
					dataValue = Number.parseFloat(dataValue).toFixed(1);
				}
				if (gameDataNames[key].startsWith('building-') && gameDataNames[key].endsWith('-progress')) {
					dataValue = Number.parseFloat(dataValue).toFixed(5);
				}


				dataInput[gameDataNames[key]] = dataValue;

				if (gameDataNames[key].startsWith('craft-') && gameDataNames[key].endsWith('-level')) {
					var craftKey = gameDataNames[key];
					var newTarget = parseFloat(dataValue) + 1;
					if (newTarget > dataInformation.caps.craftlevel) newTarget = dataInformation.caps.craftlevel;
					dataInput[craftKey.replace('-level', '-target')] = newTarget;
				}

			}
		}
	}
	localStorage.setItem('herosAndMonstersCalculator', JSON.stringify(dataInput));
}

function firstInit() {
	$("input").each(function() {
		completeUnknownValue(this.id);
	})
	saveAllToStorage();
}

function completeUnknownValue(id) {
	saveToStorage(id, minValues[id]);
}

function loadFromStorage() {
	var retrievedObject = localStorage.getItem('herosAndMonstersCalculator');
	if (retrievedObject) {
		dataInput = JSON.parse(retrievedObject);

		$('#formatAbbr').prop('checked', dataInput['formatAbbr']);
		$('#formatExpo').prop('checked', dataInput['formatExpo']);
		$('#formatFull').prop('checked', dataInput['formatFull']);

		$("input").each(function() {
			if (this.id != "" && this.id !="difficulty") {
				if (!dataInput.hasOwnProperty(this.id)) {
					completeUnknownValue(this.id);
				}
				if (this.classList.contains('pet-check') || this.classList.contains('hero-check') || this.classList.contains('numberFormat')) {
					$(this).prop('checked', dataInput[this.id]);
				} else {
					if (parseFloat(dataInput[this.id]) < parseFloat(minValues[this.id])) {
						dataInput[this.id] = minValues[this.id];
					}
					var numberDigits = 0;
					if (this.classList.contains('input-real')) {
						numberDigits = 1;
					} else if (this.classList.contains('input-real-crit')) {
						numberDigits = 2;
					} else if (this.classList.contains('input-real-extended')) {
						numberDigits = 5;
					}

					if (this.type == "number") {
						this.value = dataInput[this.id];
					} else {
						this.value = formatBase(dataInput[this.id], numberDigits);
					}
				}
				$('#' + this.id + '-text').text(formatCount(dataInput[this.id]));
			}
		})

		updateAscensionTime();
		updateMaxIdleTime();
		updateAscensionTarget();
		updateCraftsMaxXp();

	} else {
		firstInit();
	}
}

function saveAllToStorage() {
	$("input").each(function() {

		switch (this.id) {
			case "bird-equiped" :
			case "dog-equiped" :
			case "fox-equiped" :
			case "pinguin-equiped" :
			case "snake-equiped" :
			case "turtle-equiped" :
			case "cat-equiped" :
			case "mordek-equiped" :
			case "rex-equiped" :
			case "mira-equiped" :
			case "leo-equiped" :
			case "sylvie-equiped" :
			case "anantha-equiped" :
			case "formatFull":
			case "formatAbbr":
			case "formatExpo":
				dataInput[this.id] = $(this).prop("checked");
				break;
			default:
				dataInput[this.id] = this.value.replace(',','.');
		}


	})
	localStorage.setItem('herosAndMonstersCalculator', JSON.stringify(dataInput));
}

function saveToStorage(id, value) {
	if (id != "") {
		dataInput[id] = value;
		localStorage.setItem('herosAndMonstersCalculator', JSON.stringify(dataInput));
	}
}

function valueUpdate(idObject, isPositive) {

	var newValue = parseFloat($("#" + idObject).val());
	if (isPositive) {
		newValue += 1;
	} else {
		newValue -= 1;
	}

	var maxValue = -1;
	var minValue = minValues[idObject];
	switch (idObject) {
		case 'fight-boss-level' :
			var bossType = $('.select-boss-type').val();
			if (bossType == "1") {
				maxValue = dataInformation.caps.loyalistLevel;
			} else {
				maxValue = dataInformation.caps.mordekLevel;
			}			
			break;
		case 'bonus-speed' :
			maxValue = dataInformation.caps.speed;
			break;
		case 'sanctum-defense' :
			maxValue = dataInformation.caps.stoneskin;
			break;
		case 'building-gold-rank' :
		case 'building-wood-rank' :
		case 'building-stone-rank' :
		case 'building-metal-rank' :
		case 'building-gem-rank' :
			maxValue = dataInformation.caps.rebuildSteps;
			break;
		case 'bonus-craft' :
			maxValue = dataInformation.caps.minimumCraft;
			break;
		case 'craft-ring-level' :
		case 'craft-ring-target' :
		case 'craft-armor-level' :
		case 'craft-armor-target' :
		case 'craft-sword-level' :
		case 'craft-sword-target' :
			maxValue = dataInformation.caps.craftlevel;
			break;
		case 'bird-level' :
		case 'dog-level' :
		case 'snake-level' :
		case 'fox-level' :
		case 'pinguin-level' :
		case 'turtle-level' :
		case 'cat-level' :
		case 'mordek-level' :
			maxValue = dataInformation.caps.petlevel[idObject.replace('-level', '')];
			break;
		case 'mira-evolve' :
		case 'rex-evolve' :
		case 'leo-evolve' :
		case 'sylvie-evolve' :
		case 'anantha-evolve' :
			maxValue = dataInformation.caps.heroLevel;
			break;
	}
	if (maxValue > 0 && newValue > maxValue) newValue = maxValue;
	if (newValue < minValue) newValue = minValue;

	saveToStorage(idObject, newValue);
	$("#" + idObject).val(newValue);
	processInputChange(idObject, newValue);
}

function createCumulativeCalculationBox(label, index) {
	$cumulativeBox = $("#cumulative-calculation-box");

	var divLine = $('<div></div>').addClass('data-item-data-line');
	var divLineTitle = $('<div></div>').addClass('data-item-data-line-title item-border item-no-border-bottom').text('Difficulty ' + label + 'x');
	var divBox = $('<div></div>').addClass('data-item-data-line-craft item-border');
	var divBoxTurtle =  $('<div></div>').addClass('data-item-data-line-crafting');
	var divLineTurtleTitle = $('<div></div>').addClass('data-item-data-line-crafting-title').text('With turtle :');
	var divLineTurtleResult = $('<div></div>').addClass('data-item-data-line-crafting-amount total-evolution-time-all-pets-with-turtle-' + index).text('0');
	var divBoxNoTurtle =  $('<div></div>').addClass('data-item-data-line-crafting');
	var divLineNoTurtleTitle = $('<div></div>').addClass('data-item-data-line-crafting-title').text('Without turtle :');
	var divLineNoTurtleResult = $('<div></div>').addClass('data-item-data-line-crafting-amount total-evolution-time-all-pets-without-turtle-' + index).text('0');

	divBoxTurtle.append(divLineTurtleTitle).append(divLineTurtleResult);
	divBoxNoTurtle.append(divLineNoTurtleTitle).append(divLineNoTurtleResult);
	divBox.append(divBoxTurtle).append(divBoxNoTurtle);
	divLine.append(divLineTitle).append(divBox);

	$cumulativeBox.append(divLine);
}

function getDifficultyReward() {
	var localStorageDifficulty = localStorage.getItem("difficulty");
	if (!localStorageDifficulty) localStorageDifficulty = 0;
	
	return dataInformation.difficulty[localStorageDifficulty].reward;
}

function getDifficultyMultiplier() {
	var localStorageDifficulty = localStorage.getItem("difficulty");
	if (!localStorageDifficulty) localStorageDifficulty = 0;
	
	return dataInformation.difficulty[localStorageDifficulty].label;
}

function initDifficulty() {
	var localStorageDifficulty = localStorage.getItem("difficulty");

	if (localStorageDifficulty >= dataInformation.difficulty.length) {
		localStorageDifficulty = 0;
		localStorage.setItem("difficulty", localStorageDifficulty);
	}

	if (localStorageDifficulty) {
		$("#difficulty").val(localStorageDifficulty);
		$(".difficulty-value").text(dataInformation.difficulty[localStorageDifficulty].label + "x");
		$(".difficulty-reward").text(dataInformation.difficulty[localStorageDifficulty].reward + "x");
	}

	$("#difficulty").attr('max', dataInformation.difficulty.length-1);
	for (let index = 0; index < dataInformation.difficulty.length; ++index) {
		createCumulativeCalculationBox(dataInformation.difficulty[index].label, index);
	}

}

function changeDifficulty(object) {
	localStorage.setItem("difficulty", object.value);
	$(".difficulty-value").text(dataInformation.difficulty[object.value].label + "x");
	$(".difficulty-reward").text(dataInformation.difficulty[object.value].reward + "x");
	updateMaxIdleTime()
}


function processInputChange(idObject, newValue) {

	$this = $('#' + idObject);

	if (idObject == 'stat-level') {
		if (newValue > parseFloat(dataInput["stat-level-highest"])) {
			dataInput["stat-level-highest"] = newValue;
			saveToStorage($this.attr('stat-level-highest'), newValue);
			$("#stat-level-highest").val(formatBase(newValue));
			$('#stat-level-highest-text').text(formatCount(newValue));
		}
		updateAscensionTime();
		updateMaxIdleTime();
		updateAscensionTarget();
	} else if (idObject == 'stat-attack' || idObject == 'stat-health') {
		updateMaxIdleTime();
	} else if (idObject == 'stat-level-highest') {
		updateAscensionTime();
		updateMaxIdleTime();
		updateAscensionTarget();
	} else if (idObject.startsWith("sanctum-")) {
		updateSkillEffect(idObject.replace("-duration", ""));
		updateMaxIdleTime();
	} else if ( idObject.startsWith("craft-") && idObject.endsWith('-xp')) {
		updateCraftTab();
	} else if (idObject == 'stat-bonus-ascension-target') {
		updateAscensionTarget();
	}

	if (idObject == 'bonus-speed') {
		updateAscensionTime();
		updateMaxIdleTime();
		updateAscensionTarget();
	}

	if (idObject == 'bonus-ascension') {
		updateMaxIdleTime();
	}

	if (idObject.startsWith('craft-') && idObject.endsWith('-level')) {
		var idTarget = idObject.replace('-level', '-target');
		var valTarget = parseFloat(newValue) + 1;
		if (valTarget > dataInformation.caps.craftlevel) valTarget = dataInformation.caps.craftlevel;
		forceValue(idTarget, valTarget);
		updateCraftMaxXp(idObject.replace("craft-", "").replace("-level", ""))
		updateCraftTab();
	}

	if (idObject.startsWith('craft-') && idObject.endsWith('-target')) {
		var idTarget = idObject.replace('-target', '-level');
		if (newValue < parseFloat(dataInput[idTarget])) forceValue(idObject, parseFloat(dataInput[idTarget]));
		updateCraftTab();
	}

	if (idObject == 'turtle-level' || idObject == 'turtle-evolve') {
		updateAscensionTime();
		updateMaxIdleTime();
		updateAscensionTarget();
	}

	if (idObject == 'turtle-equiped') {
		updateAscensionTime();
		updateMaxIdleTime();
		updateAscensionTarget();
	}

	if ($this.hasClass('hero-check')) {
		updateAllSkillEffects();
		updateMaxIdleTime();
	}

	if ($this.hasClass('input-building') || $this.hasClass('input-real-extended')) {
		updateRebuild();
	}

	if (!idObject.startsWith('pet-tab-') && ($this.hasClass('input-int-pet') || $this.hasClass('input-int-pet-evolve'))) {
		updatePetEffect(idObject.replace('-level', '').replace('-evolve', ''));
	}

	if (idObject.startsWith('pet-tab-')) {
		calcPetEvolution(idObject);
	}

	if (idObject == 'fight-boss-level') {
		updateBossFight();
	}

	if (idObject == 'turtle-level' || idObject == 'turtle-evolve') {
		updateAscensionTime();
		updateAscensionTarget();
	}

	if ($this.hasClass('input-int-hero-evolve')) {
		var skillName = '';
		switch (idObject) {
			case 'rex-evolve' :
				skillName = 'sanctum-attack';
				break;
			case 'mira-evolve' :
				skillName = 'sanctum-defense';
				break;
			case 'leo-evolve' :
				skillName = 'sanctum-health';
				break;
			case 'sylvie-evolve' :
				skillName = 'sanctum-gold';
				break;
			case 'anantha-evolve' :
				skillName = 'sanctum-speed';
				break;
		}
		updateSkillEffect(skillName);
		updateMaxIdleTime();
	}

}

function doRemoveData() {
	refineURL();
}

function doReset() {

	const response = confirm("All your data will be erased, are you sure you want to do it ?");

	if (response) {
		localStorage.setItem('herosAndMonstersCalculator', JSON.stringify(minValues));
		refineURL();
		window.location.reload();
	}
}

function doExport() {

	var jsonString = JSON.stringify(dataInput);
	var b64String = btoa(jsonString);

	$('#exported-data').text(b64String);
	$('#exported-data').removeClass('hidden');

}

function doImport() {
	var importedText = atob($('#import-data').val().replace(/\n/g, ''));
	var importOk = false;
	var importedData = {};
	try {
		importedData = JSON.parse(importedText);
		importOk = true;
	} catch (e) {
		alert('Corrupted import data.')
	}

	if (importOk) {
		updateValuesFromObject(importedData);
		$('#import-data').val("");
		window.location.reload();
	}
}

function textAreaAdjust(o) {   o.style.height = "1px";   o.style.height = (25+o.scrollHeight)+"px"; }

function forceValue(idTarget, valTarget) {
	saveToStorage(idTarget, valTarget);
	dataInput[idTarget] = valTarget;
	$('#' + idTarget).val(valTarget);
}

function contains(stringValue, charValue) {
	return stringValue.indexOf(charValue) > -1;
}

//Helper function to extract the URL between the last '/' and before '?'
//If URL is www.example.com/one/two/file.php?user=55 this function will return 'file.php'
 //pseudo code: edit to match your URL settings
function refineURL()
{
    //get full URL
    var currURL= window.location.href; //get current address

    //Get the URL between what's after '/' and befor '?'
    //1- get URL after'/'
    var afterDomain= currURL.substring(currURL.lastIndexOf('/') + 1);
	var startingUrl = currURL.substring(0, currURL.lastIndexOf('/'));
    //2- get the part before '?'
    var beforeQueryString= afterDomain.split("?")[0];

	if (startingUrl.startsWith('file://')) {
		window.history.pushState({}, document.title, startingUrl +  "/" + beforeQueryString );
	} else {
		window.history.pushState({}, document.title, "/" + beforeQueryString );
	}
}

function updatePetEffect(petName) {
	var petEvolve = parseFloat(dataInput[petName + '-evolve']);
	if (isNaN(petEvolve)) petEvolve = 1;
	petEvolve = petEvolve * getDifficultyReward();

	var petChance = parseFloat(dataInput[petName + '-level']) * parseFloat(dataInformation.dropRate.pets[petName]);

	var resourceString = '';
	var verbString = ' get ';

	switch (petName) {
		case 'bird' :
			resourceString = ' wood';
			break;
		case 'dog' :
			resourceString = ' stone';
			break;
		case 'fox' :
			resourceString = ' metal';
			break;
		case 'pinguin' :
			resourceString = ' gem(s)';
			break;
		case 'snake' :
			resourceString = ' x more Gold/kill';
			break;
		case 'turtle' :
			verbString = ' skip '
			resourceString = ' level(s)';
			break;
		case 'cat' :
			petChance = petChance;
			resourceString = ' soul(s)';
			break;
		case 'mordek' :
			resourceString = ' of wood + stone + metal + gem(s)';
			break;
	}

	$('.' + petName + '-effect').text(formatCount(petChance) + "% chance to" + verbString + formatCount(petEvolve) + resourceString);
}

function updateAllPetEffects() {
	updatePetEffect('bird');
	updatePetEffect('dog');
	updatePetEffect('fox');
	updatePetEffect('pinguin');
	updatePetEffect('snake');
	updatePetEffect('turtle');
	updatePetEffect('cat');
	updatePetEffect('mordek');
}

function updateSkillEffect(skill) {

	var skillDuration = parseFloat(dataInput[skill + '-duration']);
	if (isNaN(skillDuration)) skillDuration = 30;
	var skillLevel = parseFloat(dataInput[skill]);
	if (isNaN(skillLevel)) godsSpeedLevel = 0;
	var heroName = '';
	var skillFactor = 0;
	var skillFactor2 = 0;
	var effectString = '%';
	var effectPhrase = '';
	notePhrase = '';

	switch (skill) {
	case 'sanctum-defense' :
		skillFactor = 1;
		heroName = 'mira';
		effectPhrase = ' defense bonus';
		break;
	case 'sanctum-attack' :
		skillFactor = 1;
		heroName = 'rex';
		effectPhrase = ' attack bonus';
		break;
	case 'sanctum-health' :
		skillFactor = 1;
		skillDuration = 30;
		skillFactor2 = 1;
		heroName = 'leo';
		effectString = ' x';
		effectPhrase = ' more soul(s) per kill';
		break;
	case 'sanctum-gold' :
		skillFactor = 5;
		heroName = 'sylvie';
		effectPhrase = ' more gold per kill';
		break;
	case 'sanctum-speed' :
		skillFactor = 0.05;
		skillFactor2 = 1;
		effectString = ' x';
		heroName = 'anantha';
		effectPhrase = ' speed multiplier';
		notePhrase = '\nNote : if used in main battle screen, instead it drops resources, see "Drop Rates" tab';
		break;
	}

	var skillLevelWithHero = heroAdditionnalBonus(heroName, skillLevel);
	var skillBonus = skillFactor * skillLevelWithHero + skillFactor2;

	$('.' + skill + '-effect').text(formatCount(skillBonus) + effectString + effectPhrase + " for " + secsToTimeBis(skillDuration).trim() + "." + notePhrase);
}

function updateAllSkillEffects() {
	updateSkillEffect('sanctum-defense');
	updateSkillEffect('sanctum-attack');
	updateSkillEffect('sanctum-health');
	updateSkillEffect('sanctum-gold');
	updateSkillEffect('sanctum-speed');
}

function updateNumberFormat() {
	$(".formated-number").each(function() {

		var numberDigits = 0;
		if (this.classList.contains('input-real')) {
			numberDigits = 1;
		} else if (this.classList.contains('input-real-crit')) {
			numberDigits = 2;
		} else if (this.classList.contains('input-real-extended')) {
			numberDigits = 5;
		}
		var inputValue = parseFloat($("#" + this.id.replace("-text", '')).val().replace(',', '.'));
		if (!inputValue) inputValue = 0;
		$('#' + this.id).text(formatCount(inputValue, numberDigits));
	});
}