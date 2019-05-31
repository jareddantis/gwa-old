/**
    @file app.js
    @description Responsible for handling the UI.
    @author Jared Dantis (@jareddantis)
    @license GPLv2
*/

const app = {
    /**
        Determines if screen is small enough for the sidebar to be hidden.
     */
    menuIsHidden: function() {
        return window.matchMedia('(max-width: 1200px)').matches;
    },

    /**
        Opens sidebar on mobile.
     */
    openMenu: function() {
        if (app.menuIsHidden()) {
            $('#menu').addClass('visible');
            app.dim();
        }
    },

    /**
        Closes sidebar on mobile.

        @param {Boolean} [remainDim] - Whether to leave the background dimmed
     */
    closeMenu: function(remainDim = false) {
        if (app.menuIsHidden()) {
            $('#menu').removeClass('visible');
            if (!remainDim)
                app.unDim();
        }
    },

    /**
        Shows dark background for sidebar and dialogs.
     */
    dim: function() {
        $('#dimmer').fadeIn();
    },

    /**
        Hides dark background.
     */
    unDim: function() {
        $('#dimmer').fadeOut();
    },

    /**
        Sets day/night mode.

        @param {String} theme - new selected theme
    */
    setTheme: function(theme) {
    	let $span = $('#btn-theme span'), newTheme;

    	switch (theme) {
    		case "auto":
	    		// Update button text
	    		$span.text('Night mode auto');

	    		// Determine theme
	    		if (app.sunHasSet() || app.deviceInDarkMode())
	    			newTheme = "night";
	    		else
	    			newTheme = "day";
	    		break;
	    	case "night":
	    		// Update button text
	    		$span.text('Night mode on');
	    		newTheme = theme;
	    		break;
	    	default:
	    		// Update button text
	    		$span.text('Night mode off');
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
    	let now = new Date(), times = SunCalc.getTimes(now, 12, 121),
            sunriseTime = times.sunrise, sunsetTime = times.sunset,
            sunriseOffset = sunriseTime - now, sunsetOffset = now - sunsetTime;

    	// We will use dark mode if time is between sunrise and sunset
    	return sunriseOffset >= 0 || sunsetOffset >= 0;
    },

    /**
        Determines if device is in dark mode based on browser API.

        @returns {Boolean} Whether browser reports active system dark mode
     */
    deviceInDarkMode: function() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    },

    deviceIsIOS: function() {
        let ua = window.navigator.userAgent;
        let iOS = !!ua.match(/iP(ad|hone|od|od Touch)/i);
        let webkit = !!ua.match(/WebKit/i);
        return iOS && webkit;
    },

    /**
        Determines if browser is iOS Safari.
        https://stackoverflow.com/a/29696509
        https://www.bennadel.com/blog/1950-detecting-iphone-s-app-mode-full-screen-mode-for-web-applications.htm

        @returns {Boolean} Whether browser is iOS Safari.
     */
    deviceIsMobileSafari: function() {
        let ua = window.navigator.userAgent;
        let otherBrowsers = ua.match(/(Chrome|CriOS|OPiOS)/i);
        return app.deviceIsIOS() && !otherBrowsers;
    },

    /**
        Sets/unsets cGPA calculation mode.

        @param {Boolean} isGpa - Whether we are now in cGPA mode or not
    */
    setGpa: function(isGpa) {
        // Update button text
        let newText = isGpa ? "GWA mode" : "cGPA mode (alpha)";
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
        let $select = $('#levels select'), sets = subjects.getSets();
        for (let i = 0; i < sets.length; i++) {
            let set = sets[i],
                {alias: value, name: text} = set,
                option = $("<option>");
            $(option).attr("value", value)
                     .text(text);
            $select.append(option);
        }

        // Restore selected set
        $select.val(selectedSet);

        // Define onChange behavior
        $select.on('change', function(){
            let newSet = $(this).val();

            // User selected custom subjects
            if (newSet === "custom") {
                app.closeMenu(true);

                // Remember currently selected set
                state.set("prevSet", state.get("set"));

                // If subjects are not defined,
                // don't switch level yet in case user hits Cancel
                if (subjects.get("custom").length === 0) {
                    console.warn("[app] customSet empty, deferring switchLevel");
                    app.dialog.promptSubjects();
                    return;
                }
            } else
                app.closeMenu(false);

            // If user hit Cancel on custom subject input,
            // we restore previously selected set
            // along with the grades
            if (state.get("set") === "custom" && newSet === state.get("prevSet"))
                state.switchLevel(newSet, true);
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
        let currGrades = state.get("grades"),
            subjs = subjects.get();

        // Check for length mismatch
        // e.g. if grade array does not match grade level
        if (currGrades.length !== subjs.length) {
            console.warn("[app] currGrades.length != subjects.default, adjusting");
            console.log("[app] currGrades (len = " + currGrades.length + ") -----");
            console.log(currGrades);
            console.log("[app] subjects.default (len = " + subjs.length + ") -----");
            console.log(subjs);

            // Adjust currGrades to match subjs.length
            if (currGrades.length > subjs.length) {
                // Trim extra grades
                while (currGrades.length > subjs.length)
                    currGrades.pop();
            } else {
                // Add 1.00 grades
                while (currGrades.length < subjs.length)
                    currGrades.push(1.00);
            }
        }

        // Empty subject table
        let $table = $('#grades table');
        $table.empty();

        // Create new subject rows
        for (let i = 0; i < subjs.length; i++) {
            // Create subject row
            let subj = subjs[i],
                subjName = subj.name + " (" + subj.units.toFixed(1) + " units)",
                subjGrade = currGrades[i].toFixed(2),
                row = widget.newSubjectRow(i, subjName, subjGrade);

            // Add new row to table
            $table.append(row);
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
        let name = subjects.get()[subjId].name;

        // Prompt new grade
        let newGrade = window.prompt("Enter grade for " + name),
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
        let result = calc.ulate();

        // We truncate the grade, not round
        $('#gwa').text(result.substring(0,5));
    },

    /**
		Dialogs (see src/js/dialogs)
    */
    dialog: {}
};
