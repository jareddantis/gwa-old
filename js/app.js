$(document).ready(function(){
	// Release version
	$('#vc').text(7);

	// Restore state
	calculateBatches();
	grade.default = grade.seven;
	state.load();

	// Populate dropdown list and make it work
	$("li").each(function(el){
		$(this).click(function(e){
			var that = $(this).children();
			e.preventDefault();
			state.update($(that).attr('data-item'), null);
		})
		var di = batches[$(this).children().attr("data-item")];
		$(this).children().text("Batch " + di);
	});

	// Units and night mode
	$('#c_nm').click(function(){
		var mode = $('#c_nm span').text(), newMode;
		switch(mode) {
			case "off":
				newMode = "night";
				break;
			case "on":
				newMode = "auto";
				break;
			case "auto":
				newMode = "day";
				break;
		}
		console.log(mode, newMode);
		state.current.dispMode = newMode;
		state.save();
		displayMode(newMode);
		$('#hamburger').removeAttr('class');
		$('#menu .menu-content').addClass('invis');
	});
	$('#c_units').click(function(){
		$('#hamburger').removeAttr('class');
		$('#menu .menu-content').addClass('invis');
		var showUnits = !state.current.showUnits;
		state.current.showUnits = showUnits;
		state.save();

		if (showUnits)
			$('#c_units span').text('on');
		else
			$('#c_units span').text('off');

		return unitsHandler(showUnits);
	});

	// Menu button animation
	$('#hamburger').click(function(){
		if ($(this).hasClass('active')) {
			$(this).removeAttr('class');
			$('#menu .menu-content').addClass('invis');
		} else {
			$(this).addClass('active');
			$('#menu .menu-content').removeClass('invis');

			// Hide menu on click outside
			// but only listen for clicks after menu slide out (500ms)
			window.setTimeout(function() {
				$(document).one('click', function(e){
					if (! $(e.target).closest('.menu-content').length) {
						$('#hamburger').removeAttr('class');
						$('#menu .menu-content').addClass('invis');
					}
				})
			}, 500);
		}
	})

	// Clear button
	$('#refresh').click(function(){
		state.current.grades = [];
		state.current.lock = [];
		state.save();
		redraw();
	});
});

function displayMode(mode) {
	switch(mode) {
		case "day":
			$('html').removeClass('night');
			$('#c_nm span').text('off');
			break;
		case "night":
			$('html').addClass('night');
			$('#c_nm span').text('on');
			break;
		case "auto":
			$('#c_nm span').text('auto');
			var hour = (new Date()).getHours();
			if (hour > 16 || hour < 5)
				$('html').addClass('night');
			else
				$('html').removeClass('night');
			break;
	}
}

var state = {
	// Saved state object
	current: {
		set: null,
		grades: [],
		lock: [],
		dispMode: "auto",
		showUnits: false
	},

	// Change current batch
	update: function(newSet, redrawValues) {
		if (grade[newSet]) {
			var newName = batches[newSet];
			$("#btn-text").text(newName);
			grade.default = grade[newSet];
			grade.set = newSet;
			this.current.set = newSet;

			if (redrawValues == null) {
				// Fill current set of grades with empty strings
				// so we can just update the values later
				// and not worry about missing values in between
				this.current.grades = [];
				for (var i = 0; i < grade.default.length; i++)
					this.current.grades.push("");
				this.save();
				redraw(this.current.grades);
			} else
				redraw(redrawValues);
		} else
			console.error("Invalid gradeset \"" + newSet + "\"");
	},

	// Change a grade
	change: function(el) {
		var index = parseInt($(el).attr("data-subject")),
			value = $(el).val();
		for (var i = 0; i < grade.default.length; i++) {
			if (i != index) {
				if (typeof this.current.grades[i] === "undefined")
					this.current.lock.push("");
			} else
				this.current.grades[index] = value;
		}
		this.save();
		calculate();
	},

	// Lock or unlock a grade
	toggle: function(el, status) {
		var index = parseInt($(el).attr("data-subject"));
		for (var i = 0; i < grade.default.length; i++) {
			if (i != index) {
				if (typeof this.current.lock[i] === "undefined")
					this.current.lock.push(false);
			} else {
				this.current.lock[i] = status;
			}
		}
		this.save();
	},

	// Load saved state
	load: function() {
		if (typeof(Storage) !== undefined) {
			var savedJson = localStorage.getItem("gwadata");
			if (savedJson != null) {
				var savedState = JSON.parse(savedJson),
					dispMode = savedState.dispMode,
					showUnits = savedState.showUnits,
					savedSet = savedState.set,
					savedGrades = savedState.grades;
				this.current = savedState;
				this.update(savedSet, savedGrades);

				displayMode(dispMode);
				$('#c_nm span').text(dispMode);
				unitsHandler(showUnits);
				$('#c_units span').text(showUnits ? "on" : "off");

				// Upgrade
				if (typeof this.current.lock === "undefined") {
					this.current.lock = [];
					this.save();
				}
			} else
				redraw();
		}
	},

	// Save state
	save: function() {
		if (typeof(Storage) !== undefined) {
			var currentState = this.current,
				currentJson = JSON.stringify(currentState);
			localStorage.setItem("gwadata", currentJson);
		}
	}
}

function calculateBatches() {
	var current = new Date(),
		currYear = current.getFullYear(),
		currMonth = current.getMonth();

	// Account for 2-year lapse during K+12 transition
	if (currYear == 2017)
		oldestBatch = 2018;
	else {
		if (currMonth < 6)
			oldestBatch = currYear;
		else
			oldestBatch = ++currYear;
	}

	batches.tweleven = oldestBatch + " & " + ++oldestBatch;
	batches.ten = ++oldestBatch;
	batches.nine = ++oldestBatch;
	batches.eight = ++oldestBatch;
	batches.seven = ++oldestBatch;
}

var batches = {
	"seven": "Grade 7",
	"eight": "Grade 8",
	"nine": "Grade 9",
	"ten": "Grade 10",
	"tweleven": "Grade 10 & 11"
};

var grade = {
	seven: [
		{ subject: "Integrated Science", units: 1.7 },
		{ subject: "Mathematics", units: 1.7 },
		{ subject: "Computer Science", units: 1 },
		{ subject: "English", units: 1.3 },
		{ subject: "Filipino", units: 1 },
		{ subject: "Social Science", units: 1 },
		{ subject: "PEHM", units: 1 },
		{ subject: "Values Education", units: 0.7 },
		{ subject: "AdTech", units: 1 }
	],
	eight: [
		{ subject: "Integrated Science", units: 2 },
		{ subject: "Mathematics", units: 1.7 },
		{ subject: "Computer Science", units: 1 },
		{ subject: "English", units: 1.3 },
		{ subject: "Filipino", units: 1 },
		{ subject: "Social Science", units: 1 },
		{ subject: "PEHM", units: 1 },
		{ subject: "Values Education", units: 0.7 },
		{ subject: "AdTech", units: 1 },
		{ subject: "Earth Science", units: 0.7 }
	],
	nine: [
		{ subject: "Biology", units: 1 },
		{ subject: "Chemistry", units: 1 },
		{ subject: "Physics", units: 1 },
		{ subject: "Mathematics", units: 1 },
		{ subject: "English", units: 1 },
		{ subject: "Filipino", units: 1 },
		{ subject: "Social Science", units: 1 },
		{ subject: "PEHM", units: 1 },
		{ subject: "Statistics", units: 1 },
		{ subject: "Computer Science", units: 1 }
	],
	ten: [
		{ subject: "Biology", units: 1 },
		{ subject: "Chemistry", units: 1 },
		{ subject: "Physics", units: 1 },
		{ subject: "Mathematics", units: 1.3 },
		{ subject: "English", units: 1 },
		{ subject: "Filipino", units: 1 },
		{ subject: "Social Science", units: 1 },
		{ subject: "PEHM", units: 1 },
		{ subject: "STR", units: 1 },
		{ subject: "Computer Science", units: 1 },
		{ subject: "Elective", units: 1 }
	],
	tweleven: [
		{ subject: "STR", units: 2 },
		{ subject: "Core", units: 1.7 },
		{ subject: "Elective", units: 1.7 },
		{ subject: "Mathematics", units: 1 },
		{ subject: "English", units: 1 },
		{ subject: "Filipino", units: 1 },
		{ subject: "Social Science", units: 1 }
	]
};

function unitsHandler(enabled) {
	if (enabled) {
		$('input').each(function(){
			var subjId = parseInt($(this).attr('data-subject')),
				units = grade.default[subjId].units.toFixed(1);
			$(this).attr('placeholder', units + ' units');
		})
	} else {
		$('input').each(function(){
			$(this).removeAttr('placeholder');
		})
	}
	calculate();
}

function redraw(values) {
	$("input, .lock").each(function(){ $(this).remove() });
	$("#g").attr("class","").text("Welcome");
	for (var h = 1; h < 4; h++) {
		$('#pane-'+h).remove();
		$('#app .row').append($("<div></div>").addClass('col-lg-4').attr('id','pane-'+h));
	}

	var boxes = 0;
	var drawInput = function(i){
		// Determine if grade is locked
		var isLocked = typeof state.current.lock === "undefined" ? false : state.current.lock[i];
		var lockunlock = (isLocked === true) ? "img/locked.min.svg" : "img/unlocked.min.svg";

		// Construct subject input group
		var pane = (i < 4) ? 1 : (i < 8) ? 2 : 3;
		var group = $("<div></div>").addClass("subject");
		var label = $("<span></span>")
		var lock = $("<img>").addClass("lock").attr("src", lockunlock);
		var modify = $("<img>").attr("src", "img/settings.min.svg");
		var gradecontrols = $("<div></div>").addClass("grade-control").append(lock);
		var box = $("<input>").attr("type", "number").attr("step", "0.25").attr("data-subject", i);
		if (isLocked === true)
			$(box).attr("disabled", "disabled");

		// Populate input box with saved grade
		if (values != null)
			$(box).val(values[i]);

		// Append input group to page
		$(label).text(grade.default[i].subject);
		$(group).append(label).append(gradecontrols).append(box);
		$("#pane-"+pane).append(group);
		boxes++;
	}

	// Populate each column by 4s
	for (var i = 0; i < 4; i++)
		drawInput(i);
	for (var i = 4; i < grade.default.length; i++)
		drawInput(i);
	if (grade.default.length > 8) {
		for (var i = boxes; i < grade.default.length; i++)
			drawInput(i);
	} else {
		$('#pane-3').remove();
		$('#pane-1').addClass('col-lg-offset-2');
	}

	// Handle value changes
	var inputs = $("input");
	$(inputs).each(function(){
		$(this).on("change paste keyup input", function(e){
			if ($(this).val().length > 4) {
				var trimmed = $(this).val().slice(0,4);
				$(this).val(trimmed);
			}
			state.change(this);
		});
	});
	if (values != null) { calculate() }

	// Lock button
	$('.lock').each(function() {
		$(this).click(function() {
			// Disable input box...
			var input = $(this).closest(".subject").children("input");
			var newState = !$(input)[0].hasAttribute("disabled");
			if (newState) {
				$(input).attr("disabled", "disabled");
				$(this).attr("src", "img/locked.min.svg");
			} else {
				$(input).removeAttr("disabled");
				$(this).attr("src", "img/unlocked.min.svg");
			}

			// ...then update state object
			state.toggle(input, newState);
		});
	});
	unitsHandler(state.current.showUnits);
}

function hopToNext(from){
	var grade = $(from).val();
	if (grade.length == 4 && !isInvalidGrade(parseFloat(grade))) {
		var boxes = $('input'),
			lastBox = parseInt($(boxes[boxes.length-1]).attr('data-subject')),
			fromBox = parseInt($(from).attr("data-subject"));
		
		if (fromBox != lastBox) {
			$(from).blur();
			$('input[data-subject='+(fromBox+1)+']').focus();
		}
	}
}

function isInvalidGrade(value) {
	var grade = parseFloat(value), invalid = false;

	// Contains characters other than numbers and period
	if (/[^0-9\.]+/.test(value))
		invalid = true;
	// Out of range
	else if (grade < 1 || grade > 5)
		invalid = true;
	// Indivisible by 0.25 for grades greater than 3.00
	else if (grade < 3 && (grade % 0.25 != 0))
		invalid = true;
	// Between 3, 4, and 5
	else if ((grade > 3 && grade < 4) || (grade > 4 && grade < 5))
		invalid = true;

	return invalid;
}

function calculate() {
	var result, err = 0, total = 0, units = 0;

	$("input").each(function(){
		var value = $(this).val(),
			identifier = $(this).attr('data-subject');
		units += grade.default[identifier].units;
		if (!value) {
			err = 0;
			return true;
		} else if (isInvalidGrade(value)) {
			err = 1;
			return false;
		} else {
			err = 2;
			total += parseFloat(value) * grade.default[identifier].units;
		}
	});

	result = total / units;
	welcomeText = state.current.showUnits ? units.toFixed(1) + " units" : "Welcome";
	if (err == 0)
		$("#g").attr("class","").text(welcomeText);
	else if (err == 1)
		$("#g").attr("class","err").text("Error");
	else {
		var str = result.toPrecision(10) + "";
		$('#g').removeAttr("class").text(str.slice(0,5));
		if (result <= 1.500 && result != 0)
			$("#g").addClass('dl');
	}
}
