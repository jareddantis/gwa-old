/**
    app.js:
      Responsible for handling the UI.

    Part of the illustra/gwa project by @aureljared.
    Licensed under GPLv2.
*/

var app = {
	init: function() {
		// Restore state
		$('#version').text(state.get("version"));
		state.load();

		// Button styling
		$('.button').each(function(){
			$(this).mousedown(function(){
				$(this).addClass('focus');
			}).mouseup(function(){
				$(this).removeClass('focus');
			});
		});

		// Grade level chooser action
		$('#levels select').on('change', function(){
			// Load new subject set
			state.switchLevel($(this).val());
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
	},

	setTheme: function(theme) {
		// Apply new theme
		$('html').attr('data-theme', theme);

		// Save theme preferences
		state.set("dispMode", theme);
	},

	setColors: function(level) {
		$('#app').attr('data-theme', level);
	},

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

		// Put everything together
		$(lcol).append(subj).append(grade);
		$(rcol).append(minus).append(plus);
		$(row).append(lcol).append(rcol);
		return row;
	},

	calculate: function() {
		// Calculate and display result
		var result = calc.ulate();
		$('#gwa').text(result.substring(0,5));
	}
};
