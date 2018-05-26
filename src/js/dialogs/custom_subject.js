/**
    This file handles everything about the
    custom subjects input UI.

    @file custom_subject.js
    @author Jared Dantis (@aureljared)
    @license GPLv2
*/

/**
    Prompts user for custom subjects.
*/
app.dialog.promptSubjects = function() {
    // Get current custom set
    var currCustom = subjects.get("custom"),
        table = $('#custom-subject tbody');

    // Empty table
    $(table).empty();

    // See if there are already defined subjects
    if (currCustom.length > 0) {
        // Restore previously defined subjects
        for (var i = 0; i < currCustom.length; i++) {
            var name = currCustom[i].name,
                units = currCustom[i].units,
                row = widget.newCustomSubject(name, units);
            $(table).append(row);
        }
    } else {
        // Add empty row to subject table
        $(table).append(widget.newCustomSubject());
    }

    // We're ready, show dialog
    $('#custom-subject').fadeIn(150);
};

/**
    Validates and saves user-specified subjects.

    @param {Array} subjEls - All subject rows (tr)
*/
app.dialog.parseSubjects = function(subjEls) {
    var set = [], valid = true;

    for (var i = 0; i < subjEls.length; i++) {
        var subj = subjEls[i],
            subjNameEl = $(subj).children('td.subject-name')
                           .children('input'),
            subjName = $(subjNameEl).val(),
            subjUnitsEl = $(subj).children('td.subject-units')
                           .children('input'),
            subjUnits = parseFloat($(subjUnitsEl).val());

            // Check if entire row is empty
            if (subjName.length == 0 && (isNaN(subjUnits) ||
            	subjUnits.length == 0 || subjUnits === undefined)) {
                // Check for any succeeding rows
                if (subjEls[i+1] !== undefined) {
                    // Skip this row
                    console.warn("[c_s] Skipping empty row " + i);
                    continue;
                }
                // Check if entire table is empty
                else if (set[0] === undefined) {
                    // Restore previously selected subject set
                    var prevSet = state.get("prevSet");
                    $('#levels select').val(prevSet);
                    state.switchLevel(prevSet);

                    // Empty saved custom set
                    subjects.setCustom([]);

                    // Quit
                    console.error("[c_s] No subjects, restoring " + prevSet);
                    valid = false;
                    $('#custom-subject').fadeOut(150);
                    break;
                }
            }

        // Check if name is empty
        if (subjName.length == 0) {
            console.error("[c_s] Empty name in row " + i);
            app.dialog.highlightCustomSubjEl(subjNameEl);
            valid = false;
            break;
        }

        // Check if units is empty or invalid
        if (isNaN(subjUnits) || subjUnits === undefined ||
        	subjUnits.length == 0) {
            console.error("[c_s] Bad units in row " + i);
            app.dialog.highlightCustomSubjEl(subjUnitsEl);
            valid = false;
            break;
        }

        // Subject is assumed valid
        console.log("[c_s] New subject: " + subjName + " = " + subjUnits);
        set.push({
            name: subjName,
            units: subjUnits
        });
    }

    if (valid) {
        // Save new set
        subjects.setCustom(set);

        // Select new set
        state.switchLevel("custom");

        // Repopulate
        app.dialog.populateSubjects();

        // Hide dialog
        $('#custom-subject').fadeOut(150);
    }
};

/**
    Highlights empty/invalid cell for 1 second
*/
app.dialog.highlightCustomSubjEl = function(el) {
    if (!$(el).hasClass('err')) {
    	// Scroll div to element
    	var parentScroll = $('.custom-subject-body').scrollTop(),
    		parentOffset = $('.custom-subject-body').offset().top,
    		elOffset = $(el).offset().top,
    		offset = parentScroll - parentOffset + elOffset;
    	$('.custom-subject-body').animate({
    		scrollTop: offset
    	}, 150);

    	// Highlight with red bar
        $(el).addClass('err');
        window.setTimeout(function(){
            $(el).removeClass('err');
        }, 1000);
    }
};

/**
    Shows 'Edit subjects' menu button
*/
app.showEditBtn = function() {
    $('#btn-edit').slideDown();
};

/**
    Hides 'Edit subjects' menu button
*/
app.hideEditBtn = function() {
    $('#btn-edit').slideUp();
};
