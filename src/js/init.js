/**
    @file init.js
    @description Responsible for initializing the UI.
    @author Jared Dantis (@jareddantis)
    @license GPLv2
 */

/**
    Initializes the app by creating click listeners,
    displaying the app version, and restoring saved state.

    This function is the first function called after the
    page has loaded and all other libraries have initialized.
 */
app.init = function() {
    console.log("[app] Initializing");

    // Restore state
    state.load();

    // Display version
    let version = state.get("version");
    $('#version').text(version);
    let fdbkLink = $('#btn-feedback').parent().attr('href');
    fdbkLink += '-' + version.replace(/ /g, '');
    $('#btn-feedback').parent().attr('href', fdbkLink);

    // Check for updates
    $('#update-reload').click(function(){
        window.location.reload();
    });
    window['isUpdateAvailable']
        .then(function(isAvailable) {
            console.log("[app] Update found, showing dialog");
            if (isAvailable) {
                $('#update-found').fadeIn(200);
            }
        });

    // Init FastClick
    FastClick.attach(document.body);

    // Swipe to open drawer
    $('body').swipe({
        swipe: function(s,w,i,p,e,r){
            switch (w) {
                case "right":
                    $('#menu').addClass('visible');
                    $('#menu-bg').fadeIn();
                    break;
                case "left":
                    $('#menu').removeClass('visible');
                    $('#menu-bg').fadeOut();
            }
        },
        excludedElements: "#levels, label, button, input, select, textarea"
    });

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

    // Night mode button action
    $('#btn-theme').click(function(){
        var newTheme;
        switch (state.get("dispMode")) {
            case "day": // day -> night
                newTheme = "night";
                break;
            case "night": // night -> auto
                newTheme = "auto";
                break;
            default: // auto -> day
                newTheme = "day";
        }

        // Apply theme
        app.setTheme(newTheme);
    });

    // Edit subjects button action
    $('#btn-edit').click(function(){
        // Show dialog
        app.dialog.promptSubjects();
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

    // Collapse sidebar on click outside (mobile)
    $('#menu-bg').click(function(){
        $('#menu').removeClass('visible');
        $(this).fadeOut();
    });

    // Custom subject dialog buttons
    $('#custom-subject-add').click(function(){
        // Add empty row to custom subject table
        var table = $('#custom-subject tbody');
        $(table).append(widget.newCustomSubject());

        // Scroll to bottom of table
        var height = $(".custom-subject-body")[0].scrollHeight;
        $(".custom-subject-body")[0].scrollTop = height;
    });
    $('#custom-subject-save').click(function(){
        // Parse new subject data
        var subjs = $('#custom-subject tbody tr');
        app.dialog.parseSubjects(subjs);
    });
    $('#custom-subject-quit').click(function(){
        if (subjects.get("custom").length == 0) {
            // Restore previously selected subject set
            var prevSet = state.get("prevSet");
            $('#levels select').val(prevSet);
            state.switchLevel(prevSet);
        }

        // Hide dialog
        $('#custom-subject').fadeOut(150);
    });
};