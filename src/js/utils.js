/**
    @file utils.js
    @description Reusable components and helper functions
    @author Jared Dantis (@jareddantis)
    @license GPLv2
*/

const utils = {
    /**
        Creates a table row element (tr) that contains a
        subject, along with the grade and -/+ controls.

        @param {Number} id
            The subject ID, e.g. the index of the subject
            in the array subjects.default.
        @param {String} subjName  -  Subject name
        @param {String} subjGrade  -  Saved subject grade
        @returns {jQuery} The created subject row
    */
    newSubjectRow: function(id, subjName, subjGrade){
        //  <tr> element that will contain everything
        let row = $('<tr>').attr('data-subject', id),
        //  <td> element that will contain the grade & subject name
            lcol = $('<td>'),
            subj = $('<p>').text(subjName),
            grade = $('<h2>').addClass('num').text(subjGrade),
        //  <td> element that will contain the +/- buttons
            rcol = $('<td>').addClass('controls'),
            plus = $('<div>').addClass('plus'),
            minus = $('<div>').addClass('minus');

        // Add plus/minus button actions
        $(minus).click(function(){
            // Get current grade
            let subjId = $(this).parent().parent().attr('data-subject'),
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
            let subjId = $(this).parent().parent().attr('data-subject'),
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
            let subjId = $(this).parent().parent().attr('data-subject');
            app.promptGrade(subjId);
        });

        // Put everything together
        $(lcol).append(subj).append(grade);
        $(rcol).append(minus).append(plus);
        $(row).append(lcol).append(rcol);
        return row;
    },

    /**
        Creates a table row element (tr) that contains
        input boxes for a custom subject and its units.

        @param {String} [subjName]  -  Subject name
        @param {String} [subjUnits]  -  Subject units
        @returns {jQuery} The created subject row
    */
    newCustomSubject: function(subjName, subjUnits) {
        let row = $('<tr>'),
            del = $('<td>').addClass('subject-delete'),
            name = $('<td>').addClass('subject-name'),
            unit = $('<td>').addClass('subject-units'),
            nameInput = $('<input>').attr('type', 'text'),
            unitInput = $('<input>').attr('type', 'text');

        // on click delete button
        $(del).click(function(){
            let row = $(this).parent();

            if ($(row).siblings().length > 0)
                $(row).remove();
            else {
                // Don't delete the only row
                // Instead, empty the content
                let name = $(row).children('td.subject-name')
                                 .children('input'),
                    unit = $(row).children('td.subject-units')
                                 .children('input');
                $(name).val('').blur();
                $(unit).val('').blur();
            }
        });

        // Name & unit text box placeholders
        $(nameInput).attr('placeholder', 'Subject');
        $(unitInput).attr('placeholder', 'Units');

        // Restore content, if any
        if (subjName && subjUnits) {
            $(nameInput).val(subjName);
            $(unitInput).val(subjUnits);
        }

        // Put everything together
        $(name).append(nameInput);
        $(unit).append(unitInput);
        $(row).append(del).append(name).append(unit);
        return row[0];
    },

    highlightCustomSubjEl: function(el, body) {
        if (!$(el).hasClass('err')) {
            // Scroll div to element
            let parentScroll = $(body).scrollTop(),
                parentOffset = $(body).offset().top,
                elOffset = $(el).offset().top,
                offset = parentScroll - parentOffset + elOffset;
            $(body).animate({
                scrollTop: offset
            }, 150);

            // Highlight with red bar
            $(el).addClass('err');
            window.setTimeout(function(){
                $(el).removeClass('err');
            }, 500);
        }
    },

    /**
        Validates and saves user-specified subjects.

        @param {Array} subjEls - All subject rows (tr)
        @param {Element} body - Custom subjects table body
     */
    parseSubjects: function(subjEls, body) {
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
                    console.warn("[utils:parseSubjects] Skipping empty row " + i);
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
                    console.warn("[utils:parseSubjects] No subjects, restoring " + prevSet);
                    return true;
                }
            }

            // Check if name is empty
            if (subjName.length === 0) {
                console.warn("[utils:parseSubjects] Empty name in row " + i);
                this.highlightCustomSubjEl(subjNameEl, body);
                valid = false;
                break;
            }

            // Check if units is empty or invalid
            if (isNaN(subjUnits) || subjUnits === undefined || subjUnits.length === 0) {
                console.warn("[utils:parseSubjects] Bad units in row " + i);
                this.highlightCustomSubjEl(subjUnitsEl, body);
                valid = false;
                break;
            }

            // Subject is assumed valid
            console.log("[utils:parseSubjects] New subject: " + subjName + " = " + subjUnits);
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
    }
};