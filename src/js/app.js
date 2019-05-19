/**
    @file app.js
    @description Responsible for handling the UI.
    @author Jared Dantis (@jareddantis)
    @license GPLv2
*/

const app = {
    /**
        Sets day/night mode.

        @param {String} The new selected theme
    */
    setTheme: function(theme) {
    	var newTheme;

    	switch (theme) {
    		case "auto":
	    		// Update button text
	    		$('#btn-theme span').text('Night mode auto');

	    		// Determine theme
	    		if (app.sunHasSet())
	    			newTheme = "night";
	    		else
	    			newTheme = "day";
	    		break;
	    	case "night":
	    		// Update button text
	    		$('#btn-theme span').text('Night mode on');
	    		newTheme = theme;
	    		break;
	    	default:
	    		// Update button text
	    		$('#btn-theme span').text('Night mode off');
	    		newTheme = theme;
    	}

        // Apply new theme
        $('html').attr('data-theme', newTheme);

        // Save theme preferences
        state.set("dispMode", theme);
    },

    /**
        Determines if the sun has set based on Philippine
        coordinates and the local computer time.

        @returns {Boolean} Whether the sun has set or not
    */
    sunHasSet: function() {
    	var now = new Date(),
    		nowH = now.getHours(), nowM = now.getMinutes(),
    		times = SunCalc.getTimes(now, 12, 121),
    		riseH = times.sunrise.getHours(),
    		riseM = times.sunrise.getMinutes(),
    		setH = times.sunset.getHours(),
    		setM = times.sunset.getMinutes(),
    		sunrise = nowH < riseH || (nowH == riseH && nowM <= riseM),
    		sunset = nowH > setH || (nowH == setH && nowM >= setM);

    	return sunrise || sunset;
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
        Creates the options for the grade dropdown list.

        @param {String} selectedSet - The grade level to select by default
    */
    populateChooser: function(selectedSet) {
        var sets = subjects.getSets();
        for (var i = 0; i < sets.length; i++) {
            var set = sets[i],
                value = set.alias,
                text = set.name,
                option = $("<option>");
            $(option).attr("value", value)
                     .text(text);
            $('#levels select').append(option);
        }

        // Restore selected set
        $('#levels select').val(selectedSet);

        // Define onChange behavior
        $('#levels select').on('change', function(){
            var newSet = $(this).val();

            // Collapse sidebar (mobile)
            if ($('#menu').hasClass('visible')) {
                $('#menu').removeClass('visible');
                $('#menu-bg').fadeOut();
            }

            // User selected custom subjects
            if (newSet == "custom") {
                // Remember currently selected set
                state.set("prevSet", state.get("set"));

                // If subjects are not defined,
                // don't switch level yet in case user hits Cancel
                if (subjects.get("custom").length == 0) {
                    console.warn("[app] customSet empty, deferring switchLevel");
                    app.dialog.promptSubjects();
                    return;
                }
            }

            // If user hit Cancel on custom subject input,
            // we restore previously selected set
            // along with the grades
            if (state.get("set") == "custom" &&
                newSet == state.get("prevSet")) {
                state.switchLevel(newSet, true);
            }
            // Load new subject set
            else {
                console.log("[app] Switching to " + newSet);
                state.switchLevel(newSet);
            }
        });
    },

    /**
        Fills the subject list with the subjects and the saved
        grades for each.
    */
    populateSubjects: function() {
        var currGrades = state.get("grades"),
            subjs = subjects.get();

        // Check for length mismatch
        // e.g. if grade array does not match grade level
        if (currGrades.length != subjs.length) {
            console.warn("[app] currGrades.length != subjects.default, adjusting");
            console.log("[app] currGrades (len = " + currGrades.length + ") -----");
            console.log(currGrades);
            console.log("[app] subjects.default (len = " + subjs.length + ") -----");
            console.log(subjs);

            // Adjust currGrades to match subjs.length
            if (currGrades.length > subjs.length) {
                // Trim extra grades
                while (currGrades.length > subjs.length)
                    currGrades.pop(currGrades.length - 1);
            } else {
                // Add 1.00 grades
                while (currGrades.length < subjs.length)
                    currGrades.push(1.00);
            }
        }

        // Empty subject table
        $('#grades table').empty();

        // Create new subject rows
        for (var i = 0; i < subjs.length; i++) {
            // Create subject row
            var subj = subjs[i],
                subjName = subj.name + " (" + subj.units.toFixed(1) + " units)",
                subjGrade = currGrades[i].toFixed(2),
                row = widget.newSubjectRow(i, subjName, subjGrade);

            // Add new row to table
            $('#grades table').append(row);
        }

        // Calculate GWA in case of saved grades
        app.calculate();
    },

    /**
        Asks user to manually input a grade for a specific subject.

        @param {String} subjId
            The subject ID, e.g. the index of the subject
            in the array subjects.default.
    */
    promptGrade: function(subjId) {
        var curr = state.getGrade(parseInt(subjId)),
            name = subjects.get()[subjId].name;

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

        // We truncate the grade, not round
        $('#gwa').text(result.substring(0,5));
    },

    /**
		Dialogs (see src/js/dialogs)
    */
    dialog: {}
};
