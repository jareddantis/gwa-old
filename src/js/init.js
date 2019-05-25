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
    // Display version
    let appVersion = state.get("version"),
        fdbkLink = 'http://server.jared.gq/feedback/?subject=pisaygwa-web-';
    console.log("[app] Welcome to pisaygwa v" + appVersion);
    $('#version').text(appVersion + ' ');
    $('#btn-feedback').parent().attr('href',
        fdbkLink + appVersion.replace(' build ', 'b'));

    // Check for updates
    window['isUpdateAvailable']
        .then(function(isAvailable) {
            console.log("[app] Update found, showing dialog");
            if (isAvailable) {
                // Create dialog
                let image = $('<img>').attr('src', 'dist/img/update-found.svg'),
                    dialog = new Dialog();
                $('body').append(dialog);
                dialog.title = 'App update found';
                dialog.type = 'update-found';
                dialog.addButton('update & refresh', function() {
                    window.location.reload();
                });
                dialog.appendToBody($(image)[0]);

                // Show dialog
                dialog.show();
            }
        });

    // Swipe to open drawer
    let hammer = new Hammer(document.body);
    hammer.on('swiperight', app.openMenu);
    hammer.on('swipeleft', app.closeMenu);

    // Sidebar toggle action
    $('#menu-toggle').click($('#menu').hasClass('visible') ? app.closeMenu : app.openMenu);

    // Collapse sidebar on background click (mobile)
    $('#menu-bg').click(app.closeMenu);

    // Button styling & default action
    $('.button').each(function(){
        $(this).mousedown(function(){
            $(this).addClass('focus');
        }).mouseup(function(){
            $(this).removeClass('focus');
        }).click(app.closeMenu);
    });

    // Night mode button action
    $('#btn-theme').click(function(){
        let newTheme;
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
        let curr = state.get("isGpa");
        app.setGpa(!curr);
    });

    // Restore state
    state.load();
};