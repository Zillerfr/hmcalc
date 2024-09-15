/* TODO
- use gods speed drops for building calculator
- use resource stock for building calculator
- make sections in all tabs foldable
- speed buying calc
- add multiplier for values change in multiplier

  INFORMATIONS
- Ennemy attack : (1 + level) / 2.0)
- Ennemy HP : 30 + 2* level
- health next hp cost = (current hp - 30)*2 + 1

  PATCHNOTE


*/

/**
 * ==================================
 * Main
 * ==================================
 */
(function($, undefined) {

	"use strict";

	// When ready.
	$(function() {

		/**
		 * ==================================
		 * Initialisation
		 * ==================================
		 */
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		$(".timed-hide").hide();
		if (urlParams.has('data')) {
			const data = urlParams.get('data')
			var importedGameDataText = atob(data.replace(/\n/g, ''));
			var importOk = false;
			try {
				var importedGameData = JSON.parse(importedGameDataText);
				//console.log(importedGameData);
				importOk = true;
			} catch (e) {
				alert('Corrupted import data.')
			}

			if (importOk) {
				updateValuesFromGameObject(importedGameData);
			}
		}
		initTheme();
		initDifficulty();
		loadFromStorage();
		initFormat();
		updateAllPetEffects();
		updateAllSkillEffects();
		updateNumberFormat()


		/**
		 * ==================================
		 * Input management
		 * ==================================
		 */

		$('.input-int, .input-int-craft, .input-percent, .input-int-pet, .fight-boss-level').keypress(function (e)
			{
				var allowedChars = '0123456789';
				var invalidKey = e.key.length === 1 && !contains(allowedChars, e.key)
						|| e.key === '.' && contains(e.target.value, '.');
				invalidKey && e.preventDefault();
			}
		);

		$('.input-real').keypress(function (e)
			{
				var allowedChars = '0123456789.,';

				var invalidKey = e.key.length === 1 && !contains(allowedChars, e.key)
						|| e.key === '.' && contains(e.target.value, '.');
				invalidKey && e.preventDefault();
			}
		);

		$('.input-real-extended').keypress(function (e)
			{
				var allowedChars = '0123456789.,';
				var invalidKey = e.key.length === 1 && !contains(allowedChars, e.key)
						|| e.key === '.' && contains(e.target.value, '.');
				invalidKey && e.preventDefault();
			}
		);

		$('.input-real-crit').keypress(function (e)
			{
				var allowedChars = '0123456789.,';
				var invalidKey = e.key.length === 1 && !contains(allowedChars, e.key)
						|| e.key === '.' && contains(e.target.value, '.');
				invalidKey && e.preventDefault();
			}
		);

		$('.fight-boss-level').on( "keyup", function( event ) {

			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}
			var $this = $(this);

			// Get the value.
			var input = $this.val().replace(/[^0-9]/g, '');
			if (input < 1) {
				input = 1;
			} else if (input > 8) {
				input = 8;
			}

			updateBossFight();
			$this.val( function() {
				return input;
			} );

		} );

		$('.input-int-pet').on( "keyup", function( event ) {

			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}
			var $this = $(this);

			// Get the value.
			var input = $this.val().replace(/[^0-9]/g, '');
			var petName = $this.attr('id').replace('-level', '');
			if (input < 0) {
				input = 0;
			} else if (input > dataInformation.caps.petlevel[petName]) {
				input = dataInformation.caps.petlevel[petName];
			}
			saveToStorage($this.attr('id'), input);
			processInputChange($this.attr('id'), input);

			$this.val( function() {
				return input;
			} );

		} );

		$('.input-int-pet-evolve').on( "keyup", function( event ) {		
			
			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}


			var $this = $(this);

			// Get the value.
			var input = $this.val().replace(/[^0-9]/g, '');
			if (input < 1) {
				input = 1;
			}
			if (!$this.attr('id').startsWith('pet-tab-')) {
				saveToStorage($this.attr('id'), input);
				$('#' + $this.attr('id') + '-text').text(formatCount(input));
			}
			
			$this.val( function() {
				return input;
			} );		

			if ($this.attr('id').startsWith('pet-tab-')) {
				clearTimeout(inputTimer)
				inputTimer = setTimeout(() => {			
					processInputChange($this.attr('id'), input);
				}, inputTimerTime);
			} else {
				processInputChange($this.attr('id'), input);
			}

		} );

		$(".input-int-pet-evolve").focusout(function(){
			clearTimeout(inputTimer);
			processInputChange($(this).attr('id'), $(this).val());
		});

		$(".input-int-pet-evolve").on('keypress',function(e) {
			if(e.which == 13) {
				clearTimeout(inputTimer);
				processInputChange($(this).attr('id'), $(this).val());
			}
		});

		$('.input-int-hero-evolve').on( "keyup", function( event ) {

			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}


			var $this = $(this);

			// Get the value.
			var input = $this.val().replace(/[^0-9]/g, '');
			if (input < 0) {
				input = 0;
			}
			if (input > 20) {
				input = 20;
			}
			saveToStorage($this.attr('id'), input);
			processInputChange($this.attr('id'), input);

			$this.val( function() {
				return input;
			} );

		} );

		$('.input-int-craft').on( "keyup", function( event ) {
			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}


			var $this = $(this);

			// Get the value.
			var input = $this.val().replace(/[^0-9]/g, '');
			if (input < 0) {
				input = 0;
			} else if (input > dataInformation.caps.craftlevel) {
				input = dataInformation.caps.craftlevel;
			}
			saveToStorage($this.attr('id'), input);
			processInputChange($this.attr('id'), input);

			$this.val( function() {
				return input;
			} );

		} );

		$('.input-percent').on( "keyup", function( event ) {

			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}


			var $this = $(this);

			// Get the value.
			var input = $this.val().replace(/[^0-9]/g, '');
			if (input < 0) {
				input = 0;
			} else if ($this.attr('id') == "bonus-craft" && input > 99) {
				input = 99;
			} else if (input > 100) {
				input = 100;
			}
			saveToStorage($this.attr('id'), input);

			$this.val( function() {
				return input;
			} );

		} );

		$('.input-building').on( "keyup", function( event ) {

			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}

			var $this = $(this);

			// Get the value.
			var input = $this.val().replace(/[^0-9]/g, '');
			if (input < 0) {
				input = 0;
			} else if (input > 4) {
				input = 4;
			}
			saveToStorage($this.attr('id'), input);
			processInputChange($this.attr('id'), input);

			$this.val( function() {
				return input;
			} );

		} );



		$('.input-int').on( "keyup", function( event ) {

			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}


			var $this = $( this );

			// Get the value.
			var input = $this.val().replace(/[^0-9]/g, '');
			if (input == "" || input == undefined || isNaN(parseFloat(input)) == true) {
				input = 0;
			} else if ($this.attr('id') == "sanctum-defense" && input > dataInformation.caps.stoneskin) {
				input = dataInformation.caps.stoneskin;
			} else if ($this.attr('id').startsWith("craft-") && $this.attr('id').endsWith("-xp")) {
				var maxCraftXp = getMaxCraftXp($this.attr('id').replace("craft-", "").replace("-xp", ""));
				if (input > maxCraftXp) input = maxCraftXp;
			} else {
				input = parseFloat(input);
			}
			saveToStorage($this.attr('id'), input);
			processInputChange($this.attr('id'), input);
			$('#' + $this.attr('id') + '-text').text(formatCount(input));
			
			if ($this.hasClass('timed-hide')) {
				clearTimeout(inputTimerHide[$this.attr('id')]);
				inputTimerHide[$this.attr('id')] = setTimeout(() => {
					$("#" + $this.attr('id')).hide();
				}, inputTimerTimeHide);
			}
			
			$this.val( function() {
				return formatBase(input);
			} );

		} );
		
		$('.show-hidden-input').click(function(event){
			var $formatedText = $(this).closest(".show-hidden-input");
			var $inputToShow = $formatedText.siblings(".timed-hide");
		
			$inputToShow.show();
			$inputToShow.focus();
			clearTimeout(inputTimerHide[$inputToShow.attr('id')])
			inputTimerHide[$inputToShow.attr('id')] = setTimeout(() => {
				$inputToShow.hide();
			}, inputTimerTimeHide);
		});
		
		$(".timed-hide").focusout(function(){
			clearTimeout(inputTimerHide[$(this).attr('id')]);
			$(this).hide();
		});
		
		$(".timed-hide").on('keypress',function(e) {
			if(e.which == 13) {
				clearTimeout(inputTimerHide[$(this).attr('id')]);
				$(this).hide();
			}
		});

		$('.input-real').on( "keyup", function( event ) {

			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}


			var $this = $( this );

			// Get the value.
			var input = $this.val().replaceAll(getSeparator(navigator.languages[0], 'group'),'').replace(/[^0-9\.,]/g, '');
			if (input.charAt(0) === getSeparator(navigator.languages[0], 'decimal')) {
				input = "0" + input;
			}
			var end = "";
			if (input.charAt(input.length-1) === getSeparator(navigator.languages[0], 'decimal')) {
				end = getSeparator(navigator.languages[0], 'decimal');
			}
			input = input.replace(getSeparator(navigator.languages[0], 'decimal'),'.');
			if (input == "" || input == undefined || isNaN(parseFloat(input)) == true) {
				input = 0;
			} else {
				input = parseFloat(input);
			}

			if ($this.attr('id') == 'bonus-speed') {
				if (input < 1) {
					input = 1;
				}
				if (input > dataInformation.caps.speed) input = dataInformation.caps.speed;
			}

			if ($this.attr('id') == 'bonus-ascension') {
				if (input < 1) {
					input = 1;
				}
			}

			saveToStorage($this.attr('id'), input);
			processInputChange($this.attr('id'), input);
			$('#' + $this.attr('id') + '-text').text(formatCount(input));

			const numberFormatter = new Intl.NumberFormat(navigator.languages[0], { maximumFractionDigits: 1 });
			const newValue = numberFormatter.format(input) + end;

			$this.val( function() {
				return newValue;
			} );

		} );

		$('.input-real-crit').on( "keyup", function( event ) {

			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}


			var $this = $( this );

			// Get the value.
			var input = $this.val().replaceAll(getSeparator(navigator.languages[0], 'group'),'').replace(/[^0-9\.,]/g, '');
			if (input.charAt(0) === getSeparator(navigator.languages[0], 'decimal')) {
				input = "0" + input;
			}
			var end = "";
			if (input.charAt(input.length-1) === getSeparator(navigator.languages[0], 'decimal')) {
				end = getSeparator(navigator.languages[0], 'decimal');
			}
			input = input.replace(getSeparator(navigator.languages[0], 'decimal'),'.');
			if (input == "" || input == undefined || isNaN(parseFloat(input)) == true) {
				input = 0;
			} else {
				input = parseFloat(input);
			}

			if ($this.attr('id') == 'stat-critical') {
				if (input < 0) {
					input = 0;
				}
				if (input > dataInformation.caps.crit) input = dataInformation.caps.crit;
			}


			saveToStorage($this.attr('id'), input);
			processInputChange($this.attr('id'), input);
			$('#' + $this.attr('id') + '-text').text(formatCount(input));

			const numberFormatter = new Intl.NumberFormat(navigator.languages[0], { maximumFractionDigits: 2 });
			const newValue = numberFormatter.format(input) + end;

			$this.val( function() {
				return newValue;
			} );

		} );

		$('.input-real-extended').on( "keyup", function( event ) {

			event.preventDefault();
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}

			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}

			var $this = $( this );

			// Get the value.
			var input = $this.val().replaceAll(getSeparator(navigator.languages[0], 'group'),'').replace(/[^0-9\.,]/g, '');
			if (input.charAt(0) === getSeparator(navigator.languages[0], 'decimal')) {
				input = "0" + input;
			}
			var end = "";
			if (input.charAt(input.length-1) === getSeparator(navigator.languages[0], 'decimal')) {
				end = getSeparator(navigator.languages[0], 'decimal');
			}
			input = input.replace(getSeparator(navigator.languages[0], 'decimal'),'.');
			if (input == "" || input == undefined || isNaN(parseFloat(input)) == true) {
				input = 0;
			} else if (input > 100) {
				input = 100;
			} else {
				input = parseFloat(input);
			}

			saveToStorage($this.attr('id'), input);
			processInputChange($this.attr('id'), input);

			const numberFormatter = new Intl.NumberFormat(navigator.languages[0], { maximumFractionDigits: 5 });
			const newValue = numberFormatter.format(input) + end;

			$this.val( function() {
				return newValue;
			} );

		} );

		/**
		 * ==================================
		 * Pet checkbox management
		 * ==================================
		 */
		$('.pet-check').change(function() {

			var checkedState = $(this).prop('checked');
			$('.pet-check').each(function() {
				$(this).prop('checked', false);
			});
			$(this).prop('checked', checkedState);

			$('.pet-check').each(function() {
				saveToStorage($(this).attr('id'), $(this).prop('checked'));
			});
			processInputChange($(this).attr('id'), checkedState);
		});

		/**
		 * ==================================
		 * Hero checkbox management
		 * ==================================
		 */
		$('.hero-check').change(function() {

			var checkedState = $(this).prop('checked');
			$('.hero-check').each(function() {
				$(this).prop('checked', false);
			});
			$(this).prop('checked', checkedState);

			$('.hero-check').each(function() {
				saveToStorage($(this).attr('id'), $(this).prop('checked'));
			});
			processInputChange($(this).attr('id'), checkedState);
		});

		/**
		 * ==================================
		 * Number Format management
		 * ==================================
		 */
		$('.numberFormat').change(function() {

			var checkedState = $(this).prop('checked');
			$('.numberFormat').each(function() {
				$(this).prop('checked', false);
			});
			$(this).prop('checked', checkedState);

			$('.numberFormat').each(function() {
				saveToStorage($(this).attr('id'), $(this).prop('checked'));
			});
		});

		/**
		 * ==================================
		 * Tabs management
		 * ==================================
		 */
		var tabs = document.querySelectorAll(".tabs_wrap ul li");
		var allTabs = document.querySelectorAll(".tab_item_wrap");

		tabs.forEach((tab)=>{
			tab.addEventListener("click", ()=>{
				tabs.forEach((tab)=>{
					tab.classList.remove("active");
				});
				tab.classList.add("active");
				var tabval = tab.getAttribute("data-tabs");

				allTabs.forEach((item)=>{
					item.classList.remove("active");
				});

				var activeTab = document.querySelectorAll("." + tabval);
				activeTab.forEach((item)=>{
					item.classList.add("active");
				});

				switch (tabval) {
					case "tab_data" :
						updateNumberFormat();
						break;
					case "tab_craft" :
						updateCraftTab();
						updateCraftPurchases();
						break;
					case "tab_pet" :
						updatePets();
						break;
					case "tab_mordek" :
						updateBossFight();
						break;
					case "tab_drop" :
						updateDropTab();
						break;
					case "tab_rebuild" :
						updateRebuild();
						break;
					default:
						break;
				}
			})
		})

	});
})(jQuery);