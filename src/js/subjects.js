/**
 * List of all the subjects per grade level, along
 * with the corresponding grade units.
 * Also handles custom subject definitions.
 *
 * @file subjects.js
 * @author Jared Dantis (@jareddantis)
 * @license GPLv2
*/

const subjects = {
    /**
     * Default set, from which app.populateSubjects() will create subject rows for.
    */
    default: "seven",

    /**
     * Sets the default subject set.
     *
     * @param {String} defaultSet - The new default set
    */
    setDefault: function(defaultSet) {
        if (this.sets.hasOwnProperty(defaultSet))
            this.default = defaultSet;
        else
            console.error("[subjects] No such set: " + defaultSet);
    },

    /**
     * Retrieves a specific subject set.
     *
     * @param {String} set - A specific subject set
     * @returns {Array} The requested subject set
    */
    get: function(set) {
        // If no arguments are passed, we return
        // the default subject set.
        set = set || this.default;
        return this.sets[set].subjects;
    },

    /**
     * Lists all available subject sets.
     *
     * @returns {Array} All available subject sets
    */
    getSets: function() {
        let sets = [],
            keys = Object.keys(this.sets);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            sets.push({
                alias: key,
                name: subjects.sets[key].name
            });
        }
        return sets;
    },

    /**
     * Defines custom subject set from user input and saves the set in localStorage.
     *
     * @param {Array} customSet - The custom defined set
    */
    setCustom: function(customSet) {
        this.sets.custom.subjects = customSet;

        // Save
        state.set("customSet", customSet);
    },

    /**
     * Subject sets
    */
    sets: {
        custom: {
            name: "Custom subjects",
            subjects: []
        },
        seven: {
            name: "Grade 7",
            subjects: [
                { name: "Integrated Science", units: 1.7 },
                { name: "Mathematics", units: 1.7 },
                { name: "Computer Science", units: 1 },
                { name: "English", units: 1.3 },
                { name: "Filipino", units: 1 },
                { name: "Social Science", units: 1 },
                { name: "PEHM", units: 1 },
                { name: "Values Education", units: 0.7 },
                { name: "AdTech", units: 1 }
            ]
        },
        eight: {
            name: "Grade 8",
            subjects: [
                { name: "Integrated Science", units: 2 },
                { name: "Mathematics", units: 1.7 },
                { name: "Computer Science", units: 1 },
                { name: "English", units: 1.3 },
                { name: "Filipino", units: 1 },
                { name: "Social Science", units: 1 },
                { name: "PEHM", units: 1 },
                { name: "Values Education", units: 0.7 },
                { name: "AdTech", units: 1 },
                { name: "Earth Science", units: 0.7 }
            ]
        },
        nine: {
            name: "Grade 9",
            subjects: [
                { name: "Biology", units: 1 },
                { name: "Chemistry", units: 1 },
                { name: "Physics", units: 1 },
                { name: "Mathematics", units: 1 },
                { name: "English", units: 1 },
                { name: "Filipino", units: 1 },
                { name: "Social Science", units: 1 },
                { name: "PEHM", units: 1 },
                { name: "Statistics", units: 1 },
                { name: "Computer Science", units: 1 }
            ]
        },
        tenElec: {
            name: "Grade 10",
            subjects: [
                { name: "Biology", units: 1 },
                { name: "Chemistry", units: 1 },
                { name: "Physics", units: 1 },
                { name: "Mathematics", units: 1.3 },
                { name: "English", units: 1 },
                { name: "Filipino", units: 1 },
                { name: "Social Science", units: 1 },
                { name: "PEHM", units: 1 },
                { name: "Research", units: 1 },
                { name: "Computer Science", units: 1 },
                { name: "Elective", units: 1 }
            ]
        },
        ten: {
            name: "Grade 10 (no elective)",
            subjects: [
                { name: "Biology", units: 1 },
                { name: "Chemistry", units: 1 },
                { name: "Physics", units: 1 },
                { name: "Mathematics", units: 1.3 },
                { name: "English", units: 1 },
                { name: "Filipino", units: 1 },
                { name: "Social Science", units: 1 },
                { name: "PEHM", units: 1 },
                { name: "Research", units: 1 },
                { name: "Computer Science", units: 1 }
            ]
        },
        tweleven: {
            name: "SYP",
            subjects: [
                { name: "Research", units: 2 },
                { name: "Core Science", units: 1.7 },
                { name: "Elective", units: 1.7 },
                { name: "Mathematics", units: 1 },
                { name: "English", units: 1 },
                { name: "Filipino", units: 1 },
                { name: "Social Science", units: 1 }
            ]
        }
    }
};
