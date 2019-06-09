/**
 * @file init.js
 * @description Responsible for initializing the UI.
 * @author Jared Dantis (@jareddantis)
 * @license GPLv2
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
    let appVersion = state.get("version"),
        fdbkLink = 'http://server.jared.gq/feedback/?subject=pisaygwa-web-';
    console.log("[app] Welcome to pisaygwa v" + appVersion);
    $('#version').text(appVersion + ' ');
    $('#btn-feedback').parent().attr('href',
        fdbkLink + appVersion.replace(' build ', 'b'));

    // Check for updates
    window['isUpdateAvailable']
        .then(function (isAvailable) {
            console.log("[app] Update found, showing dialog");
            if (isAvailable)
                dialogs.updateFound();
        });

    // Swipe to open drawer
    let hammer = new Hammer(document.body);
    hammer.on('swiperight', app.openMenu);
    hammer.on('swipeleft', function () {
        app.closeMenu()
    });

    // Sidebar toggle action
    let $menu = $('#menu');
    $('#menu-toggle').click($menu.hasClass('visible') ? app.closeMenu : app.openMenu);

    // Collapse sidebar on background click (mobile)
    $menu.click(function () {
        app.closeMenu()
    });

    // Button styling & default action
    $('.button').each(function () {
        $(this).mousedown(function () {
            $(this).addClass('focus');
        }).mouseup(function () {
            $(this).removeClass('focus');
        }).click(function () {
            app.closeMenu();
        });
    });

    // Night mode button action
    $('#btn-theme').click(function () {
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
    $('#btn-edit').click(function () {
        // Show dialog after sidebar animation
        window.setTimeout(function () {
            dialogs.customSubjects();
        }, 300);
    });

    // Clear grades button action
    $('#btn-clr').click(function () {
        state.resetGrades();
        app.populateSubjects();
    });

    // cGPA toggle button action
    $('#btn-gpa').click(function () {
        // Flip mode
        let curr = state.get("isGpa");
        app.setGpa(!curr);
    });

    // <a> optimization
    $('a').each(function () {
        $(this).attr('target', '_blank').attr('rel', 'noopener');
    });

    // Sidebar animation setup
    if (app.menuShouldHide()) {
        $('.menu').on('transitionend', function () {
            // Remove animating class on transition end
            $menu.removeClass('animating');

            // Post sidebar collapse events
            let { pendingNewTheme, pendingSubjectPrompt } = app;
            if (pendingNewTheme !== null) {
                // Change theme after sidebar collapse
                // to allow the CPU some room to animate
                $('html').attr('data-theme', pendingNewTheme);
                app.pendingNewTheme = null;
            }
            if (pendingSubjectPrompt) {
                dialogs.customSubjects();
                app.pendingSubjectPrompt = false;
            }
        });
        $menu.children().click(function (e) {
            // Don't bubble up click events to ancestors
            e.stopPropagation();
        });
    }

    // iOS PWA install dialog
    // Though all browsers on iOS use the same underlying Webkit engine,
    // only Safari is able to add PWAs to the Home Screen.
    // Therefore we need to make sure that the user is using Safari.
    if (app.deviceIsIOS() && !state.get("iOSprompt")) {
        let willShow = true, isSafari = true;

        if (app.deviceIsMobileSafari()) {
            // Show dialog only if not yet installed
            if ("standalone" in window.navigator && window.navigator.standalone) {
                // No need to show dialog
                willShow = false;
            }
        } else {
            // User is running iOS but not using Safari.
            // Let the user know that installation can only be done with Safari.
            isSafari = false;
        }

        if (willShow)
            dialogs.iOSinstall(isSafari);
    }
};