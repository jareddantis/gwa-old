/**
 * @file state.js
 * @description Responsible for syncing user data with LocalStorage.
 * @author Jared Dantis (@jareddantis)
 * @license GPLv2
*/

const state = {
    /**
     * Current settings.
     * Will be saved by state.set(), and is accessed by state.get().
    */
    current: {
        version: "14.1",   // {String} Version name (external)
        versionCode: 22,   // {Number} Version code (internal)
        set: "seven",      // {String} Selected set of subjects
        prevSet: "seven",  // {String} Previously selected set
        grades: [],        // {Array} Entered grades
        dispMode: "auto",  // {String} Display mode (night/day/auto)
        isGpa: false,      // {Boolean} cGPA mode
        customSet: [],     // {Array} Custom subjects & units
        iOSprompt: false,  // {Boolean} Whether iOS install prompt was already shown
    },

    /**
     * Retrieves specific setting.
     *
     * @param {String} key - The key for the setting
     * @returns {(String|Array|Number|Boolean)} The requested setting
    */
    get: function(key) {
        return this.current[key];
    },

    /**
     * Updates specific setting and save all settings to localStorage.
     *
     * @param {String} key - The key for the setting
     * @param {String|Array|Boolean} value - The new value for the setting
    */
    set: function(key, value) {
        // Modify current settings object
        this.current[key] = value;

        // Save settings in local storage
        if (typeof(Storage) !== undefined) {
            let currentState = this.current,
                currentJson = JSON.stringify(currentState);
            localStorage.setItem("gwadata", currentJson);
        }
    },

    /**
     * Gets saved grade for a subject.
     *
     * @param {Number} id - Subject ID. See utils.newSubjectRow().
     * @returns {(String|Array|Number|Boolean)} The requested grade
    */
    getGrade: function(id) { return this.current.grades[id]; },

    /**
     * Sets grade for a subject.
     *
     * @param {String} id - Subject ID. See utils.newSubjectRow().
     * @param {String|Number} grade - The new subject grade
    */
    setGrade: function(id, grade) {
        this.current.grades[id] = grade;
        this.set("grades", this.current.grades);
    },

    /**
     * Switches grade level and save that preference.
     *
     * @param {String} level - The new grade level
     * @param {Boolean} [retainGrades]
     *      Whether to retain grades or not.
     *      Useful when restoring saved state.
    */
    switchLevel: function(level, retainGrades) {
        // Retain grades if no change in level
        if (retainGrades === undefined)
            retainGrades = level === this.get("set");

        console.log("[state] Switching to " + level + ", retain=" + retainGrades);

        // If "custom", show edit button
        if (level === "custom")
            app.showEditBtn();
        else
            app.hideEditBtn();

        // Reset grades
        if (!retainGrades)
            this.resetGrades(level);

        // Save selected grade level
        this.set("set", level);
        subjects.setDefault(level);

        // Repopulate subject list
        app.populateSubjects();

        // Switch colors
        app.setColors(level);
    },

    /**
     * Sets all grades to 1.0.
     *
     * @param {String} [level] - The grade level for which to reset grades
    */
    resetGrades: function(level) {
        // If no args passed, assume reset grades
        // for current grade level
        level = level || this.get("set");

        console.log("[state] Resetting grades for " + level);

        // Fill current set of grades with default values
        let grades = [], subjs = subjects.get(level);
        for (let i = 0; i < subjs.length; i++)
            grades.push(1.0);
        this.set("grades", grades);
    },

    /**
     * Loads saved state from LocalStorage.
    */
    load: function() {
        // Check if browser supports local data storage
        if (typeof(Storage) !== undefined) {
            let savedJson = localStorage.getItem("gwadata");

            // Check for saved state
            if (savedJson != null) {
                console.log("[state] Data exists, loading");
                let savedState = JSON.parse(savedJson);

                // Check if saved state is valid
                if (savedState.set != null && savedState.grades.length > 0) {
                    console.log("[state] Restoring saved state");

                    // Restore grades
                    if (typeof savedState.grades[0] === "string") {
                        // Grades were saved as strings in versions <10
                        console.log("[state] Upgrading saved state from v<10");
                        let grades = [];
                        for (let i = 0; i < savedState.grades.length; i++) {
                            let grade = parseFloat(savedState.grades[i]);
                            grades.push(grade);
                        }

                        // Save converted grade data
                        this.set("grades", grades);
                    } else {
                        // Restore grades normally
                        this.current.grades = savedState.grades;
                    }

                    // Restore custom subject set
                    if (savedState.customSet === undefined) {
                        // No custom subject set in release <11
                        // Define it as empty array and save in LocalStorage
                        this.set("customSet", []);
                    } else {
                        // customSet exists in LocalStorage
                        subjects.setCustom(savedState.customSet);

                        // Show edit button if selected set is custom
                        if (savedState.set === "custom")
                            app.showEditBtn();
                    }

                    // Restore iOS prompt status
                    if (savedState.iOSprompt === undefined || savedState.versionCode < 22) {
                        // No iOS prompt in release <22
                        // Default to false and save to LocalStorage
                        this.set("iOSprompt", false);
                    } else {
                        this.current.iOSprompt = savedState.iOSprompt;
                    }

                    // Populate grade level chooser and
                    // restore selected level
                    app.populateChooser(savedState.set);
                    this.switchLevel(savedState.set, true);
                    this.current.prevSet = savedState.set;

                    // Restore cGPA calculation mode and theme
                    app.setGpa(savedState.isGpa);
                    app.setTheme(savedState.dispMode);
                } else {
                    console.warn("[state] Data is invalid, resetting");
                    app.populateChooser("seven");
                    this.switchLevel("seven", false);
                }
            } else {
                console.log("[state] Data does not exist, initializing");
                app.populateChooser("seven");
                this.switchLevel("seven", false);
            }
        } else {
            // LocalStorage is needed for app to work correctly.
            let loadTitle = document.querySelector('tr.loader td');
            loadTitle.innerText = "Please use a newer browser.";
        }
    }
};
