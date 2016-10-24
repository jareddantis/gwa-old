$(document).ready(function(){
	grade.default = grade.seven;
	state.load();
	$("li").each(function(el){
		$(this).click(function(e){
			var that = $(this).children();
			e.preventDefault();
			state.update($(that).attr('data-item'), $(that).text(), null);
		})
	});
});

var state = {
	current: {
		set: null,
		grades: []
	},
	update: function(newSet, newName, redrawValues) {
		if (grade[newSet]) {
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
			console.log("Invalid gradeset \"" + newSet + "\"");
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
				var savedState = JSON.parse(savedJson),
					savedSet = savedState.set, savedName, savedGrades = savedState.grades;
				this.current = savedState;
				switch (savedSet) {
					case "seven": savedName = "Grade 7"; break;
					case "eight": savedName = "Grade 8"; break;
					case "nine": savedName = "Grade 9"; break;
					case "ten": savedName = "Grade 10"; break;
					case "tweleven": savedName = "Grade 11 & 12"; break;
				}
				this.update(savedSet, savedName, savedGrades);
			} else
				redraw();
		}
	},
	save: function() {
		if (typeof(Storage) !== undefined) {
			var currentState = this.current,
				currentJson = JSON.stringify(currentState);
			localStorage.setItem("gwadata", currentJson);
			console.log("saved " + currentJson);
		}
	}
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
	$("input").each(function(){ $(this).detach() });
	$('#left').empty();
	$('#right').empty();
	$("#g").attr("class","").text("GWA: (incomplete data)");

	for (var i = 0; i < 6; i++) {
		var fg = $("<div></div>").addClass("form-group");
		var label = $("<label></label>").addClass("control-label");
		var box = $("<input>").addClass("form-control")
		            .attr("type", "text").attr("data-subject", i)
		            .attr("maxlength","4");
		if (values != null) { $(box).val(values[i]) }
		$(label).text(grade.default[i].subject);
		$(fg).append(label).append(box);
		$("#left").append(fg);
	}
	for (var i = 6; i < grade.default.length; i++) {
		var fg = $("<div></div>").addClass("form-group");
		var label = $("<label></label>").addClass("control-label");
		var box = $("<input>").addClass("form-control")
		            .attr("type", "text").attr("data-subject", i)
		            .attr("maxlength","4");
		if (values != null) { $(box).val(values[i]) }
		$(label).text(grade.default[i].subject);
		$(fg).append(label).append(box);
		$("#right").append(fg);
	}

	$("input").on("change paste keyup", function(){ state.change(this) });
	if (values != null) { calculate() }
}

function calculate() {
	var isInvalidGrade = function(value) {
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
	};
	
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
		$("#g").attr("class","").text("GWA: (incomplete data)");
	else if (total == -1)
		$("#g").attr("class","err").text("Invalid data.");
	else {
		if (gwa <= 1.500 && gwa != 0)
			$("#g").attr("class","dl").text("GWA: " + gwa.toPrecision(4) + ", congrats!");
		else
			$("#g").attr("class","").text("GWA: " + gwa.toPrecision(4));
	}
}
