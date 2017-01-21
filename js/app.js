$(document).ready(function(){
	// Restore state
	grade.default = grade.seven;
	state.load();

	// Populate dropdown list and make it work
	$("li").each(function(el){
		$(this).click(function(e){
			var that = $(this).children();
			e.preventDefault();
			state.update($(that).attr('data-item'), null);
		})
		var di = levelToBatch($(this).children().attr("data-item"));
		$(this).children().text("Batch " + di);
	});

	// Night mode
	$('#c_nm').click(function(){
		var isNight = $('html').hasClass('night');
		state.current.isNightMode = !isNight;
		state.save();
		return isNight ? $('html').removeAttr('class') : $('html').addClass('night');
	});

	// Menu button animation
	$('#hamburger').click(function(){
		if ($(this).hasClass('active')) {
			$(this).removeAttr('class');
			$('#menu .menu-content').addClass('invis');
		} else {
			$(this).addClass('active');
			$('#menu .menu-content').removeClass('invis');
		}
	})

	// Clear button
	$('#refresh').click(redraw);
});

var state = {
	current: {
		set: null,
		grades: [],
		isNightMode: false
	},
	update: function(newSet, redrawValues) {
		if (grade[newSet]) {
			var newName = levelToBatch(newSet);
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
	change: function(el) {
		var index = $(el).attr("data-subject"),
			value = $(el).val();
		this.current.grades[index] = value;
		this.save();
		calculate();
	},
	load: function() {
		if (typeof(Storage) !== undefined) {
			var savedJson = localStorage.getItem("gwadata");
			if (savedJson != null) {
				var savedState = JSON.parse(savedJson), nightMode = savedState.isNightMode,
					savedSet = savedState.set, savedGrades = savedState.grades;
				this.current = savedState;
				this.update(savedSet, savedGrades);
				if (nightMode) { $('html').addClass('night') }
			} else
				redraw();
		}
	},
	save: function() {
		if (typeof(Storage) !== undefined) {
			var currentState = this.current,
				currentJson = JSON.stringify(currentState);
			localStorage.setItem("gwadata", currentJson);
		}
	}
}

function levelToBatch(level) {
	var currYear = (new Date()).getFullYear(), batch, tweleven;
	if (currYear == 2017) {
		tweleven = currYear + 1;
	} else
		tweleven = (currYear + 1) + " & " + currYear;
	switch (level) {
		case "seven": batch = currYear + 5; break;
		case "eight": batch = currYear + 4; break;
		case "nine": batch = currYear + 3; break;
		case "ten": batch = currYear + 2; break;
		case "tweleven": batch = tweleven; break;
	}
	return batch;
}

var grade = {
	seven: [
		{ subject: "Integrated Science", units: 1.7 },
		{ subject: "Mathematics", units: 1.7 },
		{ subject: "English", units: 1.3 },
		{ subject: "Filipino", units: 1 },
		{ subject: "Social Science", units: 1 },
		{ subject: "PEHM", units: 1 },
		{ subject: "Values Education", units: 0.7 },
		{ subject: "AdTech", units: 1 },
		{ subject: "Computer Science", units: 1 }
	],
	eight: [
		{ subject: "Integrated Science", units: 2 },
		{ subject: "Mathematics", units: 1.7 },
		{ subject: "English", units: 1.3 },
		{ subject: "Filipino", units: 1 },
		{ subject: "Social Science", units: 1 },
		{ subject: "PEHM", units: 1 },
		{ subject: "Values Education", units: 0.7 },
		{ subject: "AdTech", units: 1 },
		{ subject: "Computer Science", units: 1 },
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
		{ subject: "Computer Science", units: 1 },
		{ subject: "Earth Science", units: 0.7 }
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
		{ subject: "Science", units: 1.7 },
		{ subject: "Mathematics", units: 1 },
		{ subject: "English", units: 1 },
		{ subject: "Filipino", units: 1 },
		{ subject: "Social Science", units: 1 },
		{ subject: "STR", units: 2 },
		{ subject: "Additional Science", units: 1.7 }
	]
};

function redraw(values) {
	//return;
	$("input").each(function(){ $(this).detach() });
	$("#g").attr("class","").text("Welcome");
	for (var h = 1; h < 4; h++) {
		$('#pane-'+h).remove();
		$('#app .row').append($("<div></div>").addClass('col-lg-4').attr('id','pane-'+h));
	}

	var boxes = 0;
	var drawInput = function(i){
		var pane = (i < 4) ? 1 : (i < 8) ? 2 : 3;
		var group = $("<div></div>").addClass("subject");
		var label = $("<span></span>")
		var box = $("<input>").attr("type", "number").attr("data-subject", i);
		if (values != null) { $(box).val(values[i]) }
		$(label).text(grade.default[i].subject);
		$(group).append(label).append(box);
		$("#pane-"+pane).append(group);
		boxes++;
	}

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

	$("input").on("change paste keyup input", function(e){
		if ($(this).val().length > 4) {
			var trimmed = $(this).val().slice(0,4);
			$(this).val(trimmed);
		}
		state.change(this);
		//hopToNext(this);
	});
	if (values != null) { calculate() }
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
	var total = 0, units = 0, gwa;

	$("input").each(function(){
		var value = $(this).val();

		// Don't accept null values, values with chars other than 0-9 and period, and values below 1.0 or above 5.0
		if (!value) {
			total = 0;
			return false;
		} else if (isInvalidGrade(value)) {
			total = -1;
			return false;
		} else {
			var identifier = $(this).attr('data-subject');
			total += parseFloat(value) * grade.default[identifier].units;
			units += grade.default[identifier].units;
		}
	});

	gwa = total / units;
	if (total == 0)
		$("#g").attr("class","").text("Welcome");
	else if (total == -1)
		$("#g").attr("class","err").text("Error");
	else {
		var str = gwa.toPrecision(4) + "";
		$('#g').removeAttr("class").text(str.slice(0,5));
		if (gwa <= 1.500 && gwa != 0)
			$("#g").addClass('dl');
	}
}
