/**
    This file handles everything about the
    custom subjects input UI.

    @file custom_subject.js
    @author Jared Dantis (@jareddantis)
    @license GPLv2
*/

/**
    Prompts user for custom subjects.
*/
app.dialog.promptSubjects = function() {
    // Get current custom set
    let currCustom = subjects.get("custom"),
        $tableBody = $('<tbody>'),
        dialog = new Dialog();

    // Prepare dialog
    $('body').append(dialog);
    this.prepareSubjectsPrompt(dialog);

    // See if there are already defined subjects
    if (currCustom.length > 0) {
        // Restore previously defined subjects
        for (let i = 0; i < currCustom.length; i++) {
            let name = currCustom[i].name,
                units = currCustom[i].units,
                row = widget.newCustomSubject(name, units);
            $tableBody.append(row);
        }
    } else {
        // Add empty row to subject table
        $tableBody.append(widget.newCustomSubject());
    }

    // We're ready, show dialog
    dialog.appendToBody($('<table>').append($tableBody)[0]);
    dialog.show();
};

app.dialog.prepareSubjectsPrompt = function(dialog) {
    // Title
    dialog.title = 'Custom subjects';
    dialog.type = 'custom-subjects';

    // Custom subject dialog buttons
    dialog.addButton('+ row', function(){
        const { shadowRoot } = this;

        // Add empty row to custom subject table
        let table = shadowRoot.querySelector('tbody');
        table.appendChild(widget.newCustomSubject());

        // Scroll to bottom of table
        let body = shadowRoot.querySelector('.dialog-body');
        body.scrollTop = body.scrollHeight;
    });
    dialog.addButton('save', function(){
        const { shadowRoot } = this;

        // Parse new subject data
        let subjs = shadowRoot.querySelectorAll('.dialog-body tbody tr');
        if (app.dialog.parseSubjects(subjs))
            this.dismiss();
        else
            window.alert("Please make sure all fields are complete and valid.");
    });
    dialog.addButton('cancel', function(){
        if (subjects.get("custom").length === 0) {
            // Restore previously selected subject set
            let prevSet = state.get("prevSet");
            $('#levels select').val(prevSet);
            state.switchLevel(prevSet);
        }

        // Hide dialog
        this.dismiss();
    });
}

/**
    Validates and saves user-specified subjects.

    @param {Array} subjEls - All subject rows (tr)
*/
app.dialog.parseSubjects = function(subjEls) {
    let set = [], valid = true;

    for (let i = 0; i < subjEls.length; i++) {
        let subj = subjEls[i],
            subjNameEl = $(subj).children('td.subject-name')
                           .children('input'),
            subjName = $(subjNameEl).val(),
            subjUnitsEl = $(subj).children('td.subject-units')
                           .children('input'),
            subjUnits = parseFloat($(subjUnitsEl).val());

            // Check if entire row is empty
            if (subjName.length === 0 && (isNaN(subjUnits) || subjUnits.length === 0)) {
                // Check for any succeeding rows
                if (subjEls[i+1] !== undefined) {
                    // Skip this row
                    console.warn("[c_s] Skipping empty row " + i);
                    continue;
                }
                // Check if entire table is empty
                else if (set[0] === undefined) {
                    // Restore previously selected subject set
                    let prevSet = state.get("prevSet");
                    if (prevSet === "custom") {
                        prevSet = "seven";
                        state.set("prevSet", prevSet);
                    }
                    $('#levels select').val(prevSet);
                    state.switchLevel(prevSet);

                    // Empty saved custom set
                    subjects.setCustom([]);

                    // Quit
                    console.warn("[c_s] No subjects, restoring " + prevSet);
                    return true;
                }
            }

        // Check if name is empty
        if (subjName.length === 0) {
            console.warn("[c_s] Empty name in row " + i);
            valid = false;
            break;
        }

        // Check if units is empty or invalid
        if (isNaN(subjUnits) || subjUnits === undefined || subjUnits.length === 0) {
            console.warn("[c_s] Bad units in row " + i);
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
        app.populateSubjects();
    }
    return valid;
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
