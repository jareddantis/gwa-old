$(document).ready(function(){
	grade.default = grade.nine;
	$("li").each(function(el){
		$(this).click(function(e){
			e.preventDefault();
			grade.default = grade[$(this).children().attr('data-item')];
			$("#btn-text").text($(this).children().text());
			redraw();
		})
	});
	redraw();
});

var grade = {
	nine: [
		{ subject: "English", units: 1 },
		{ subject: "Biology", units: 1 },
		{ subject: "Chemistry", units: 1 },
		{ subject: "Filipino", units: 1 },
		{ subject: "Computer Science", units: 1 },
		{ subject: "Social Science", units: 1 },
		{ subject: "Earth Science", units: 1 },
		{ subject: "Mathematics", units: 1 },
		{ subject: "Statistics", units: 1 },
		{ subject: "Physics", units: 1 },
		{ subject: "Physical Education, Music, Health", units: 0.99 }
	],
	ten: [
		{ subject: "English", units: 1 },
		{ subject: "Biology", units: 1 },
		{ subject: "Chemistry", units: 1 },
		{ subject: "Filipino", units: 1 },
		{ subject: "Computer Science", units: 1 },
		{ subject: "Social Science", units: 1 },
		{ subject: "Mathematics", units: 1 },
		{ subject: "Physics", units: 1 },
		{ subject: "Physical Education, Music, Health", units: 0.99 }
	]
};

function redraw() {
	$("input").each(function(el){
		$(this).detach();
	});
	$('#left').empty();
	$('#right').empty();

	for (var i = 0; i < 6; i++) {
		var fg = $("<div></div>").addClass("form-group");
		var label = $("<label></label>").addClass("control-label");
		var box = $("<input>").addClass("form-control").attr("type", "text").attr("data-subject", i).attr("maxlength","4");
		$(label).text(grade.default[i].subject);
		$(fg).append(label).append(box);
		$("#left").append(fg);
	}
	for (var i = 6; i < grade.default.length; i++) {
		var fg = $("<div></div>").addClass("form-group");
		var label = $("<label></label>").addClass("control-label");
		var box = $("<input>").addClass("form-control").attr("type", "text").attr("data-subject", i).attr("maxlength","4");
		$(label).text(grade.default[i].subject);
		$(fg).append(label).append(box);
		$("#right").append(fg);
	}

	$("#right").append($("<h1></h1>").attr("id","g"));
	$("input").on("change paste keyup click", calculate);
}

function calculate() {
	var total = 0, units = 0;
	$("input").each(function(){
		if (!$(this).val()) {
			total = 0;
			return false;
		} else {
			var identifier = $(this).attr('data-subject');
			total += parseFloat($(this).val()) * grade.default[identifier].units;
			units += grade.default[identifier].units;
		}
	});
	if (total == 0)
		$("#g").text("Incomplete data");
	else
		$("#g").text((total / units).toPrecision(5));
}
