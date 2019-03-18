/**
    @file widget.js
    @description Reusable components (table rows)
    @author Jared Dantis (@jareddantis)
    @license GPLv2
*/

var widget = {
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
    newSubjectRow: function(id, subjName, subjGrade){
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

        // Add plus/minus button actions
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
        Creates a table row element (tr) that contains
        input boxes for a custom subject and its units.

        @param {Int} id
            The subject ID, e.g. the index of the subject
            in the array subjects.default.
        @param {String} subjName  -  Subject name
        @param {String} subjUnits  -  Subject units
        @returns {jQuery} The created subject row
    */
    newCustomSubject: function(subjName, subjUnits) {
        var row = $('<tr>'),
            del = $('<td>').addClass('subject-delete'),
            name = $('<td>').addClass('subject-name'),
            unit = $('<td>').addClass('subject-units'),
            nameInput = $('<input>').attr('type', 'text'),
            unitInput = $('<input>').attr('type', 'text');

        // on click delete button
        $(del).click(function(){
            var row = $(this).parent();

            if ($(row).siblings().length > 0)
                $(row).remove();
            else {
                // Don't delete the only row
                // Instead, empty the content
                var name = $(row).children('td.subject-name')
                                 .children('input'),
                    unit = $(row).children('td.subject-units')
                                 .children('input');
                $(name).val('').blur();
                $(unit).val('').blur();
            }
        });

        // Name & unit textbox placeholders
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
        return row;
    }
};
