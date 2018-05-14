/**
    @file app.js
    @description Responsible for handling the UI.
    @author Jared Dantis (@aureljared)
    @license GPLv2
*/

var app = {
	/**
	    Initializes the app by creating click listeners,
	    displaying the app version, and restoring saved state.
	*/
	init: function() {
		// Restore state
		state.load();

		// Display version
		var version = state.get("version");
		$('#version').text(version);
		var fdbkLink = $('#btn-feedback').parent().attr('href');
		fdbkLink += '-' + version.replace(/ /g, '');
		$('#btn-feedback').parent().attr('href', fdbkLink);

		// Button styling & default action
		$('.button').each(function(){
			$(this).mousedown(function(){
				$(this).addClass('focus');
			}).mouseup(function(){
				$(this).removeClass('focus');
			}).click(function(){
				// Hide sidebar on click
				if ($('#menu').hasClass('visible')) {
					$('#menu').removeClass('visible');
					$('#menu-bg').fadeOut();
				}
			});
		});

		// Grade level chooser action
		$('#levels select').on('change', function(){
			// Load new subject set
			state.switchLevel($(this).val());

			// Hide sidebar
			if ($('#menu').hasClass('visible')) {
				$('#menu').removeClass('visible');
				$('#menu-bg').fadeOut();
			}
		});

		// Night mode button action
		$('#btn-theme').click(function(){
			// Night becomes day and vice versa
			var theme = "day";
			if ($('html').attr('data-theme') == "day")
				theme = "night";

			// Apply theme
			app.setTheme(theme);
		});

		// Clear grades button action
		$('#btn-clr').click(function(){
			state.resetGrades();
			app.populateSubjects();
		});

		// cGPA toggle button action
		$('#btn-gpa').click(function(){
			// Flip mode
			var curr = state.get("isGpa");
			app.setGpa(!curr);
		});

		// Sidebar toggle action
		$('#menu-toggle').click(function(){
			if ($('#menu').hasClass('visible')) {
				$('#menu').removeClass('visible');
				$('#menu-bg').fadeOut();
			} else {
				$('#menu').addClass('visible');
				$('#menu-bg').fadeIn();
			}
		});

		// Hide sidebar on click outside
		$('#menu-bg').click(function(){
			$('#menu').removeClass('visible');
			$(this).fadeOut();
		});
	},

	/**
	    Sets day/night mode.

	    @param {String} The new selected theme
	*/
	setTheme: function(theme) {
		// Update button text
		var old = theme == "day" ? "Night" : "Day";
		$('#btn-theme span').text(old + ' mode');

		// Apply new theme
		$('html').attr('data-theme', theme);

		// Save theme preferences
		state.set("dispMode", theme);
	},

	/**
	    Sets/unsets cGPA calculation mode.

	    @param {Boolean} isGpa - Whether we are now in cGPA mode or not
	*/
	setGpa: function(isGpa) {
		// Update button text
		var newText = isGpa ? "GWA mode" : "cGPA mode (alpha)";
		$('#btn-gpa span').text(newText);

		// Save prefs
		state.set("isGpa", isGpa);

		// Recalculate
		app.calculate();
	},

	/**
	    Sets the accent colors according to grade level.

	    @param {String} level - The grade level on which to base accent colors
	*/
	setColors: function(level) {
		$('#app').attr('data-theme', level);
	},

	/**
	    Fills the subject list with the subjects and the saved
	    grades for each.
	*/
	populateSubjects: function() {
		var currGrades = state.get("grades");

		// Check for length mismatch
		// e.g. if grade set does not match grade level
		if (currGrades.length != subjects.default.length) {
			console.error("currGrades does not fit subjects.default");
			return;
		}

		// Empty subject table
		$('#grades table').empty();

		// Create new subject rows
		for (var i = 0; i < subjects.default.length; i++) {
			// Create subject row
			var subj = subjects.default[i],
				subjName = subj.name + " (" + subj.units.toFixed(1) + " units)",
				subjGrade = currGrades[i].toFixed(2),
				row = this.createSubjectRow(i, subjName, subjGrade);

			// Add new row to table
			$('#grades table').append(row);
		}

		// Calculate GWA in case of saved grades
		app.calculate();
	},

	/**
	    Creates a table row element (tr) that contains a
	    subject, along with the grade and -/+ controls.

	    @param {Int} id
	    	The subject ID, e.g. the index of the subject
	    	in the array subjects.default.
	    @param {String} subjName  -  Subject name
	    @param {String} subjGrade  -  Saved subject grade
	    @returns {jQuery} The created subject row
	*/
	createSubjectRow: function(id, subjName, subjGrade){
		//  <tr> element that will contain everything
		var row = $('<tr>').attr('data-subject', id),
		//  <td> element that will contain the grade & subject name
			lcol = $('<td>'),
			subj = $('<p>').text(subjName),
			grade = $('<h2>').addClass('num').text(subjGrade),
		//  <td> element that will contain the +/- buttons
			rcol = $('<td>').addClass('controls'),
			plus = $('<div>').addClass('plus'),
			minus = $('<div>').addClass('minus');

		// Add plus/minus action
		$(minus).click(function(){
			// Get current grade
			var subjId = $(this).parent().parent().attr('data-subject'),
				grade = state.getGrade(parseInt(subjId));

			// Increment if possible
			if (grade > 1) {
				if (grade > 3)
					grade -= 1;
				else
					grade -= 0.25;
			}

			// Update grade
			state.setGrade(subjId, grade);
			$('tr[data-subject='+subjId+'] h2').text(grade.toFixed(2));

			// Recalculate
			app.calculate();
		});
		$(plus).click(function(){
			// Get current grade
			var subjId = $(this).parent().parent().attr('data-subject'),
				grade = state.getGrade(parseInt(subjId));

			// Decrement if possible
			if (grade < 5) {
				if (grade > 2.75)
					grade += 1;
				else
					grade += 0.25;
			}

			// Update grade
			state.setGrade(subjId, grade);
			$('tr[data-subject='+subjId+'] h2').text(grade.toFixed(2));

			// Recalculate
			app.calculate();
		});

		// Allow manual grade entry on grade click
		$(grade).click(function(){
			var subjId = $(this).parent().parent().attr('data-subject');
			app.promptGrade(subjId);
		});

		// Put everything together
		$(lcol).append(subj).append(grade);
		$(rcol).append(minus).append(plus);
		$(row).append(lcol).append(rcol);
		return row;
	},

	/**
	    Asks user to manually input a grade for a specific subject.

	    @param {String} subjId
	    	The subject ID, e.g. the index of the subject
	    	in the array subjects.default.
	*/
	promptGrade: function(subjId) {
		var curr = state.getGrade(parseInt(subjId)),
			name = subjects.default[subjId].name;

		// Prompt new grade
		var newGrade = window.prompt("Enter grade for " + name),
			validation = calc.isValid(newGrade);
		if (newGrade.length > 0) {
			if (!validation.result) {
				// Set new grade
				newGrade = parseFloat(newGrade);
				$('tr[data-subject='+subjId+'] h2').text(newGrade.toFixed(2));
				state.setGrade(subjId, newGrade);

				// Recalculate
				app.calculate();
			} else {
				// Display error
				window.alert("Invalid grade entered: " + validation.reason);
			}
		}
	},

	/**
	    Calculates GWA and displays result
	*/
	calculate: function() {
		var result = calc.ulate();
		$('#gwa').text(result.substring(0,5));
	}
};
