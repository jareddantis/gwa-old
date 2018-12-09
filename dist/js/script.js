var app={init:function(e){console.log("[app] Initializing"),state.load();var t=state.get("version");$("#version").text(t);var s=$("#btn-feedback").parent().attr("href");s+="-"+t.replace(/ /g,""),$("#btn-feedback").parent().attr("href",s),$(".button").each(function(){$(this).mousedown(function(){$(this).addClass("focus")}).mouseup(function(){$(this).removeClass("focus")}).click(function(){$("#menu").hasClass("visible")&&($("#menu").removeClass("visible"),$("#menu-bg").fadeOut())})}),$("#btn-theme").click(function(){var e;switch(state.get("dispMode")){case"day":e="night";break;case"night":e="auto";break;default:e="day"}app.setTheme(e)}),$("#btn-edit").click(function(){app.dialog.promptSubjects()}),$("#btn-clr").click(function(){state.resetGrades(),app.populateSubjects()}),$("#btn-gpa").click(function(){var e=state.get("isGpa");app.setGpa(!e)}),$("#menu-toggle").click(function(){$("#menu").hasClass("visible")?($("#menu").removeClass("visible"),$("#menu-bg").fadeOut()):($("#menu").addClass("visible"),$("#menu-bg").fadeIn())}),$("#menu-bg").click(function(){$("#menu").removeClass("visible"),$(this).fadeOut()}),$("#custom-subject-add").click(function(){var e=$("#custom-subject tbody");$(e).append(widget.newCustomSubject());var t=$(".custom-subject-body")[0].scrollHeight;$(".custom-subject-body")[0].scrollTop=t}),$("#custom-subject-save").click(function(){var e=$("#custom-subject tbody tr");app.dialog.parseSubjects(e)}),$("#custom-subject-quit").click(function(){if(0==subjects.get("custom").length){var e=state.get("prevSet");$("#levels select").val(e),state.switchLevel(e)}$("#custom-subject").fadeOut(150)})},setTheme:function(e){var t;switch(e){case"auto":$("#btn-theme span").text("Night mode auto"),t=app.sunHasSet()?"night":"day";break;case"night":$("#btn-theme span").text("Night mode on"),t=e;break;default:$("#btn-theme span").text("Night mode off"),t=e}$("html").attr("data-theme",t),state.set("dispMode",e)},sunHasSet:function(){var e=new Date,t=e.getHours(),s=e.getMinutes(),a=SunCalc.getTimes(e,12,121),n=a.sunrise.getHours(),i=a.sunrise.getMinutes(),u=a.sunset.getHours(),c=a.sunset.getMinutes();return t<n||t==n&&s<=i||(u<t||t==u&&c<=s)},setGpa:function(e){var t=e?"GWA mode":"cGPA mode (alpha)";$("#btn-gpa span").text(t),state.set("isGpa",e),app.calculate()},setColors:function(e){$("#app").attr("data-theme",e)},populateChooser:function(e){for(var t=subjects.getSets(),s=0;s<t.length;s++){var a=t[s],n=a.alias,i=a.name,u=$("<option>");$(u).attr("value",n).text(i),$("#levels select").append(u)}$("#levels select").val(e),$("#levels select").on("change",function(){var e=$(this).val();if($("#menu").hasClass("visible")&&($("#menu").removeClass("visible"),$("#menu-bg").fadeOut()),"custom"==e&&(state.set("prevSet",state.get("set")),0==subjects.get("custom").length))return console.warn("[app] customSet empty, deferring switchLevel"),void app.dialog.promptSubjects();"custom"==state.get("set")&&e==state.get("prevSet")?state.switchLevel(e,!0):(console.log("[app] Switching to "+e),state.switchLevel(e))})},populateSubjects:function(){var e=state.get("grades"),t=subjects.get();if(e.length!=t.length)if(console.warn("[app] currGrades.length != subjects.default, adjusting"),console.log("[app] currGrades (len = "+e.length+") -----"),console.log(e),console.log("[app] subjects.default (len = "+t.length+") -----"),console.log(t),e.length>t.length)for(;e.length>t.length;)e.pop(e.length-1);else for(;e.length<t.length;)e.push(1);$("#grades table").empty();for(var s=0;s<t.length;s++){var a=t[s],n=a.name+" ("+a.units.toFixed(1)+" units)",i=e[s].toFixed(2),u=widget.newSubjectRow(s,n,i);$("#grades table").append(u)}app.calculate()},promptGrade:function(e){state.getGrade(parseInt(e));var t=subjects.get()[e].name,s=window.prompt("Enter grade for "+t),a=calc.isValid(s);0<s.length&&(a.result?window.alert("Invalid grade entered: "+a.reason):(s=parseFloat(s),$("tr[data-subject="+e+"] h2").text(s.toFixed(2)),state.setGrade(e,s),app.calculate()))},calculate:function(){var e=calc.ulate();$("#gwa").text(e.substring(0,5))},dialog:{}},calc={ulate:function(){for(var e=0,t=0,s=state.get("isGpa"),a=subjects.get(),n=0;n<a.length;n++){var i=a[n].units;e+=i;var u=state.getGrade(n);s&&(u=this.convertToGpa(u)),t+=u*i}return isNaN(t/e)?($("#levels select").val("seven"),!1):""+(t/e).toFixed(10)},convertToGpa:function(e){var t;switch(parseFloat(e)){case 1:t=4;break;case 1.25:t=3.7;break;case 1.5:t=3.3;break;case 1.75:t=3;break;case 2:t=2.7;break;case 2.25:t=2.3;break;case 2.5:t=2;break;case 2.75:t=1.7;break;case 3:t=1.3;break;case 4:t=1;break;default:t=0}return t},isValid:function(e){var t=parseFloat(e),s="";return/[^0-9\.]+/.test(e)?s="contains invalid characters":t<1||5<t?s=t+" is out of range":t<3&&t%.25!=0?s="no such grade":(3<t&&t<4||4<t&&t<5)&&(s="no such grade"),{result:0<s.length,reason:s}}},state={current:{version:"12.7.2",versionCode:19,set:"seven",prevSet:"seven",grades:[],dispMode:"auto",isGpa:!1,customSet:[]},get:function(e){return this.current[e]},set:function(e,t){if(this.current[e]=t,void 0!==typeof Storage){var s=this.current,a=JSON.stringify(s);localStorage.setItem("gwadata",a)}},getGrade:function(e){return this.current.grades[e]},setGrade:function(e,t){this.current.grades[e]=t,this.set("grades",this.current.grades)},switchLevel:function(e,t){void 0===t&&(t=e==this.get("set")),console.log("[state] Switching to "+e+", retain="+t),"custom"==e?app.showEditBtn():app.hideEditBtn(),t||this.resetGrades(e),this.set("set",e),subjects.setDefault(e),app.populateSubjects(),app.setColors(e)},resetGrades:function(e){e=e||this.get("set"),console.log("[state] Resetting grades for "+e);for(var t=[],s=subjects.get(e),a=0;a<s.length;a++)t.push(1);this.set("grades",t)},load:function(){if(void 0!==typeof Storage){var e=localStorage.getItem("gwadata");if(null!=e){console.log("[state] Data exists, loading");var t=JSON.parse(e);if(null!=t.set&&0<t.grades.length){if(console.log("[state] Restoring saved state"),"string"==typeof t.grades[0]){console.log("[state] Upgrading saved state from v<10");for(var s=[],a=0;a<t.grades.length;a++){var n=parseFloat(t.grades[a]);s.push(n)}this.set("grades",s)}else this.current.grades=t.grades;void 0===t.customSet?this.set("customSet",[]):(subjects.setCustom(t.customSet),"custom"==t.set&&app.showEditBtn()),app.populateChooser(t.set),this.switchLevel(t.set,!0),this.current.prevSet=t.set,app.setGpa(t.isGpa),app.setTheme(t.dispMode)}else console.warn("[state] Data is invalid, resetting"),app.populateChooser("seven"),this.switchLevel("seven",!1)}else console.log("[state] Data does not exist, initializing"),app.populateChooser("seven"),this.switchLevel("seven",!1)}else $("tr.loader td").text("Please use a newer browser.")}},subjects={default:"seven",setDefault:function(e){this.sets.hasOwnProperty(e)?this.default=e:console.error("[subjects] No such set: "+e)},get:function(e){return e=e||this.default,this.sets[e].subjects},getSets:function(){for(var e=[],t=Object.keys(this.sets),s=0;s<t.length;s++){var a=t[s];e.push({alias:a,name:subjects.sets[a].name})}return e},setCustom:function(e){this.sets.custom.subjects=e,state.set("customSet",e)},sets:{custom:{name:"Custom subjects",subjects:[]},seven:{name:"Grade 7",subjects:[{name:"Integrated Science",units:1.7},{name:"Mathematics",units:1.7},{name:"Computer Science",units:1},{name:"English",units:1.3},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Values Education",units:.7},{name:"AdTech",units:1}]},eight:{name:"Grade 8",subjects:[{name:"Integrated Science",units:2},{name:"Mathematics",units:1.7},{name:"Computer Science",units:1},{name:"English",units:1.3},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Values Education",units:.7},{name:"AdTech",units:1},{name:"Earth Science",units:.7}]},nine:{name:"Grade 9",subjects:[{name:"Biology",units:1},{name:"Chemistry",units:1},{name:"Physics",units:1},{name:"Mathematics",units:1},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Statistics",units:1},{name:"Computer Science",units:1}]},tenElec:{name:"Grade 10",subjects:[{name:"Biology",units:1},{name:"Chemistry",units:1},{name:"Physics",units:1},{name:"Mathematics",units:1.3},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Research",units:1},{name:"Computer Science",units:1},{name:"Elective",units:1}]},ten:{name:"Grade 10 (no elective)",subjects:[{name:"Biology",units:1},{name:"Chemistry",units:1},{name:"Physics",units:1},{name:"Mathematics",units:1.3},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Research",units:1},{name:"Computer Science",units:1}]},tweleven:{name:"SYP",subjects:[{name:"Research",units:2},{name:"Core Science",units:1.7},{name:"Elective",units:1.7},{name:"Mathematics",units:1},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1}]}}},widget={newSubjectRow:function(e,t,s){var a=$("<tr>").attr("data-subject",e),n=$("<td>"),i=$("<p>").text(t),u=$("<h2>").addClass("num").text(s),c=$("<td>").addClass("controls"),o=$("<div>").addClass("plus"),r=$("<div>").addClass("minus");return $(r).click(function(){var e=$(this).parent().parent().attr("data-subject"),t=state.getGrade(parseInt(e));1<t&&(t-=3<t?1:.25),state.setGrade(e,t),$("tr[data-subject="+e+"] h2").text(t.toFixed(2)),app.calculate()}),$(o).click(function(){var e=$(this).parent().parent().attr("data-subject"),t=state.getGrade(parseInt(e));t<5&&(t+=2.75<t?1:.25),state.setGrade(e,t),$("tr[data-subject="+e+"] h2").text(t.toFixed(2)),app.calculate()}),$(u).click(function(){var e=$(this).parent().parent().attr("data-subject");app.promptGrade(e)}),$(n).append(i).append(u),$(c).append(r).append(o),$(a).append(n).append(c),a},newCustomSubject:function(e,t){var s=$("<tr>"),a=$("<td>").addClass("subject-delete"),n=$("<td>").addClass("subject-name"),i=$("<td>").addClass("subject-units"),u=$("<input>").attr("type","text"),c=$("<input>").attr("type","text");return $(a).click(function(){var e=$(this).parent();if(0<$(e).siblings().length)$(e).remove();else{var t=$(e).children("td.subject-name").children("input"),s=$(e).children("td.subject-units").children("input");$(t).val("").blur(),$(s).val("").blur()}}),$(u).attr("placeholder","Subject"),$(c).attr("placeholder","Units"),e&&t&&($(u).val(e),$(c).val(t)),$(n).append(u),$(i).append(c),$(s).append(a).append(n).append(i),s}};app.dialog.promptSubjects=function(){var e=subjects.get("custom"),t=$("#custom-subject tbody");if($(t).empty(),0<e.length)for(var s=0;s<e.length;s++){var a=e[s].name,n=e[s].units,i=widget.newCustomSubject(a,n);$(t).append(i)}else $(t).append(widget.newCustomSubject());$("#custom-subject").fadeIn(150)},app.dialog.parseSubjects=function(e){for(var t=[],s=!0,a=0;a<e.length;a++){var n=e[a],i=$(n).children("td.subject-name").children("input"),u=$(i).val(),c=$(n).children("td.subject-units").children("input"),o=parseFloat($(c).val());if(0==u.length&&(isNaN(o)||0==o.length||void 0===o)){if(void 0!==e[a+1]){console.warn("[c_s] Skipping empty row "+a);continue}if(void 0===t[0]){var r=state.get("prevSet");"custom"==r&&(r="seven",state.set("prevSet",r)),$("#levels select").val(r),state.switchLevel(r),subjects.setCustom([]),console.warn("[c_s] No subjects, restoring "+r),s=!1,$("#custom-subject").fadeOut(150);break}}if(0==u.length){console.warn("[c_s] Empty name in row "+a),app.dialog.highlightCustomSubjEl(i),s=!1;break}if(isNaN(o)||void 0===o||0==o.length){console.warn("[c_s] Bad units in row "+a),app.dialog.highlightCustomSubjEl(c),s=!1;break}console.log("[c_s] New subject: "+u+" = "+o),t.push({name:u,units:o})}s&&(subjects.setCustom(t),state.switchLevel("custom"),app.populateSubjects(),$("#custom-subject").fadeOut(150))},app.dialog.highlightCustomSubjEl=function(e){if(!$(e).hasClass("err")){var t=$("#custom-subject .dialog-body").scrollTop()-$("#custom-subject .dialog-body").offset().top+$(e).offset().top;$("#custom-subject .dialog-body").animate({scrollTop:t},150),$(e).addClass("err"),window.setTimeout(function(){$(e).removeClass("err")},1e3)}},app.showEditBtn=function(){$("#btn-edit").slideDown()},app.hideEditBtn=function(){$("#btn-edit").slideUp()};