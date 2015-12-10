$(document).ready(function(){
	// Automatically update GWA value on form value changes
	var update = function(){
		var eng = $('#eng').val() * 1, bio = $('#bio').val() * 1,
			chem = $('#chem').val() * 1, fil = $('#fil').val() * 1,
			cs = $('#cs').val() * 1, pe = $('#pehm').val() * 1,
			es = $('#es').val() * 1, ss = $('#ss').val() * 1,
			stat = $('#stat').val() * 1, math = $('#math').val() * 1,
			phys = $('#phys').val() * 1;
		var grades = [eng,bio,chem,fil,cs,ss,stat,math,phys,pe,es];
		var gwa = calc(grades);
		if(!gwa)
			$('#g').html('Incomplete data');
		else
			$('#g').html('GWA: '+gwa.toPrecision(4));
	}, boxes = $('input');
	for(var i = 0; i < boxes.length; i++)
		$(boxes[i]).change(update);
});

function calc(g){
	var total = 0, gwa;

	// Check for empty grades
	for(var i = 0; i < g.length; i++){
		if(!g[i])
			return false; // Empty / zero grade
	}

	// Add grades
	for(var i = 0; i < 10; i++)
		total += g[i];

	// Add Earth Sci grade
	total += g[10] * 0.7;

	// GWA
	gwa = total / 10.7;
	return gwa;
}