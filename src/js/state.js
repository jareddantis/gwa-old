/**
    state.js:
      Methods responsible for keeping app state between
      page loads, e.g. ensuring that the entered grades
      don't get lost.

    Part of the illustra/gwa project by @aureljared.
    Licensed under GPLv2.
*/

var state = {
    /**
        current:
          Current settings object.
    */
    current: {
        version: "10 beta 1",
        set: "seven",      // Selected set of subjects
        grades: [],        // Entered grades
        dispMode: "day",   // Night mode
        isGpa: false       // cGPA mode
    },

    /**
        get():
          Retrieve key from settings object.
    */
    get: function(key) {
        return this.current[key];
    },

    /**
        set():
          Update settings object and save settings
          in local storage.
    */
    set: function(key, value) {
        // Modify current settings
        this.current[key] = value;

        // Save settings in local storage
        if (typeof(Storage) !== undefined) {
            var currentState = this.current,
                currentJson = JSON.stringify(currentState);
            localStorage.setItem("gwadata", currentJson);
        }
    },

    getGrade: function(id) {
        return this.current.grades[id];
    },

    setGrade: function(id, grade) {
        this.current.grades[id] = grade;
        this.set("grades", this.current.grades);
    },

    /**
        switchLevel():
          Switch grade level and save that preference.
    */
    switchLevel: function(level) {
        // Reset grades
        this.resetGrades(level);

        // Save selected grade level
        this.set("set", level);
        subjects.default = subjects[level];

        // Repopulate subject list
        app.populateSubjects();

        // Switch colors
        app.setColors(level);
    },

    resetGrades: function(level) {
        // If no args passed, assume reset grades
        // for current grade level
        level = level || this.get("set");

        console.log("Resetting grades for " + level);

        // Fill current set of grades with default values
        var grades = [];
        for (var i = 0; i < subjects[level].length; i++)
            grades.push(1.0);
        this.set("grades", grades);
    },

    /**
        load():
          Load saved state
    */
    load: function() {
        // Check if browser supports local data storage
        if (typeof(Storage) !== undefined) {
            var savedJson = localStorage.getItem("gwadata");

            // Check for saved state
            if (savedJson != null) {
                console.log("Data exists, loading");
                var savedState = JSON.parse(savedJson);

                // Check if saved state is valid
                if (savedState.set != null && savedState.grades.length > 1) {
                    console.log("Restoring state for " + savedState.set);
                    $('#levels select').val(savedState.set);
                    this.switchLevel(savedState.set);
                    this.current.grades = savedState.grades;
                    this.current.isGpa = savedState.isGpa;
                    app.setTheme(savedState.dispMode);
                    app.populateSubjects();
                } else {
                    console.warn("Data is invalid, resetting");
                    this.switchLevel("seven");
                    app.populateSubjects();
                }
            } else {
                console.log("Data does not exist, initializing");
                this.switchLevel("seven");
                app.populateSubjects();
            }
        } else {
            $('tr.loader td').text("Please use a newer browser.");
        }
    },
};
