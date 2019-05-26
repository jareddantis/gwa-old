"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _wrapNativeSuper(e){var n="function"==typeof Map?new Map:void 0;return(_wrapNativeSuper=function(e){if(null===e||!_isNativeFunction(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(e))return n.get(e);n.set(e,t)}function t(){return _construct(e,arguments,_getPrototypeOf(this).constructor)}return t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(t,e)})(e)}function isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}function _construct(e,t,n){return(_construct=isNativeReflectConstruct()?Reflect.construct:function(e,t,n){var a=[null];a.push.apply(a,t);var s=new(Function.bind.apply(e,a));return n&&_setPrototypeOf(s,n.prototype),s}).apply(null,arguments)}function _isNativeFunction(e){return-1!==Function.toString.call(e).indexOf("[native code]")}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var app={menuIsHidden:function(){return window.matchMedia("(max-width: 1200px)").matches},openMenu:function(){app.menuIsHidden()&&($("#menu").addClass("visible"),app.dim())},closeMenu:function(){var e=0<arguments.length&&void 0!==arguments[0]&&arguments[0];app.menuIsHidden()&&($("#menu").removeClass("visible"),e||app.unDim())},dim:function(){$("#dimmer").fadeIn()},unDim:function(){$("#dimmer").fadeOut()},setTheme:function(e){var t,n=$("#btn-theme span");switch(e){case"auto":n.text("Night mode auto"),t=app.sunHasSet()||app.deviceInDarkMode()?"night":"day";break;case"night":n.text("Night mode on"),t=e;break;default:n.text("Night mode off"),t=e}$("html").attr("data-theme",t),state.set("dispMode",e)},sunHasSet:function(){var e=new Date,t=SunCalc.getTimes(e,12,121),n=t.sunrise,a=t.sunset;return 0<=n-e||0<=e-a},deviceInDarkMode:function(){return window.matchMedia("(prefers-color-scheme: dark)").matches},setGpa:function(e){var t=e?"GWA mode":"cGPA mode (alpha)";$("#btn-gpa span").text(t),state.set("isGpa",e),app.calculate()},setColors:function(e){$("#app").attr("data-theme",e)},populateChooser:function(e){for(var t=$("#levels select"),n=subjects.getSets(),a=0;a<n.length;a++){var s=n[a],i=s.alias,o=s.name,r=$("<option>");$(r).attr("value",i).text(o),t.append(r)}t.val(e),t.on("change",function(){var e=$(this).val();if("custom"===e){if(app.closeMenu(!0),state.set("prevSet",state.get("set")),0===subjects.get("custom").length)return void app.dialog.promptSubjects()}else app.closeMenu(!1);"custom"===state.get("set")&&e===state.get("prevSet")?state.switchLevel(e,!0):state.switchLevel(e)})},populateSubjects:function(){var e=state.get("grades"),t=subjects.get();if(e.length!==t.length)if(e.length>t.length)for(;e.length>t.length;)e.pop();else for(;e.length<t.length;)e.push(1);var n=$("#grades table");n.empty();for(var a=0;a<t.length;a++){var s=t[a],i=s.name+" ("+s.units.toFixed(1)+" units)",o=e[a].toFixed(2),r=widget.newSubjectRow(a,i,o);n.append(r)}app.calculate()},promptGrade:function(e){var t=subjects.get()[e].name,n=window.prompt("Enter grade for "+t),a=calc.isValid(n);0<n.length&&(a.result||(n=parseFloat(n),$("tr[data-subject="+e+"] h2").text(n.toFixed(2)),state.setGrade(e,n),app.calculate()))},calculate:function(){var e=calc.ulate();$("#gwa").text(e.substring(0,5))},dialog:{}},calc={ulate:function(){for(var e=0,t=0,n=state.get("isGpa"),a=subjects.get(),s=0;s<a.length;s++){var i=a[s].units;e+=i;var o=state.getGrade(s);n&&(o=this.convertToGpa(o)),t+=o*i}return isNaN(t/e)?($("#levels select").val("seven"),"Error"):""+(t/e).toFixed(10)},convertToGpa:function(e){var t;switch(parseFloat(e)){case 1:t=4;break;case 1.25:t=3.7;break;case 1.5:t=3.3;break;case 1.75:t=3;break;case 2:t=2.7;break;case 2.25:t=2.3;break;case 2.5:t=2;break;case 2.75:t=1.7;break;case 3:t=1.3;break;case 4:t=1;break;default:t=0}return t},isValid:function(e){var t=parseFloat(e),n="";return/[^0-9.]+/.test(e)?n="contains invalid characters":t<1||5<t?n=t+" is out of range":t<3&&t%.25!=0?n="no such grade":(3<t&&t<4||4<t&&t<5)&&(n="no such grade"),{result:0<n.length,reason:n}}},state={current:{version:"14.0 build 20190526",versionCode:21,set:"seven",prevSet:"seven",grades:[],dispMode:"auto",isGpa:!(app.init=function(){var e=state.get("version");$("#version").text(e+" "),$("#btn-feedback").parent().attr("href","http://server.jared.gq/feedback/?subject=pisaygwa-web-"+e.replace(" build ","b")),window.isUpdateAvailable.then(function(e){if(e){var t=$("<img>").attr("src","dist/img/update-found.svg"),n=new Dialog;$("body").append(n),n.title="App update found",n.type="update-found",n.addButton("update & refresh",function(){window.location.reload()}),n.appendToBody($(t)[0]),n.show()}});var t=new Hammer(document.body);t.on("swiperight",app.openMenu),t.on("swipeleft",function(){app.closeMenu(!1)}),$("#menu-toggle").click($("#menu").hasClass("visible")?app.closeMenu:app.openMenu),$("#dimmer").click(function(){app.closeMenu(!1)}),$(".button").each(function(){$(this).mousedown(function(){$(this).addClass("focus")}).mouseup(function(){$(this).removeClass("focus")}).click(function(){app.closeMenu("btn-edit"===$(this)[0].id)})}),$("#btn-theme").click(function(){var e;switch(state.get("dispMode")){case"day":e="night";break;case"night":e="auto";break;default:e="day"}app.setTheme(e)}),$("#btn-edit").click(function(){window.setTimeout(function(){app.dialog.promptSubjects()},300)}),$("#btn-clr").click(function(){state.resetGrades(),app.populateSubjects()}),$("#btn-gpa").click(function(){var e=state.get("isGpa");app.setGpa(!e)}),$("a").each(function(){$(this).attr("target","_blank").attr("rel","noopener")}),state.load()}),customSet:[]},get:function(e){return this.current[e]},set:function(e,t){if(this.current[e]=t,void 0!==("undefined"==typeof Storage?"undefined":_typeof(Storage))){var n=this.current,a=JSON.stringify(n);localStorage.setItem("gwadata",a)}},getGrade:function(e){return this.current.grades[e]},setGrade:function(e,t){this.current.grades[e]=t,this.set("grades",this.current.grades)},switchLevel:function(e,t){void 0===t&&(t=e===this.get("set")),"custom"===e?app.showEditBtn():app.hideEditBtn(),t||this.resetGrades(e),this.set("set",e),subjects.setDefault(e),app.populateSubjects(),app.setColors(e)},resetGrades:function(e){e=e||this.get("set");for(var t=[],n=subjects.get(e),a=0;a<n.length;a++)t.push(1);this.set("grades",t)},load:function(){if(void 0!==("undefined"==typeof Storage?"undefined":_typeof(Storage))){var e=localStorage.getItem("gwadata");if(null!=e){var t=JSON.parse(e);if(null!=t.set&&0<t.grades.length){if("string"==typeof t.grades[0]){for(var n=[],a=0;a<t.grades.length;a++){var s=parseFloat(t.grades[a]);n.push(s)}this.set("grades",n)}else this.current.grades=t.grades;void 0===t.customSet?this.set("customSet",[]):(subjects.setCustom(t.customSet),"custom"===t.set&&app.showEditBtn()),app.populateChooser(t.set),this.switchLevel(t.set,!0),this.current.prevSet=t.set,app.setGpa(t.isGpa),app.setTheme(t.dispMode)}else app.populateChooser("seven"),this.switchLevel("seven",!1)}else app.populateChooser("seven"),this.switchLevel("seven",!1)}else $("tr.loader td").text("Please use a newer browser.")}},subjects={default:"seven",setDefault:function(e){this.sets.hasOwnProperty(e)&&(this.default=e)},get:function(e){return e=e||this.default,this.sets[e].subjects},getSets:function(){for(var e=[],t=Object.keys(this.sets),n=0;n<t.length;n++){var a=t[n];e.push({alias:a,name:subjects.sets[a].name})}return e},setCustom:function(e){this.sets.custom.subjects=e,state.set("customSet",e)},sets:{custom:{name:"Custom subjects",subjects:[]},seven:{name:"Grade 7",subjects:[{name:"Integrated Science",units:1.7},{name:"Mathematics",units:1.7},{name:"Computer Science",units:1},{name:"English",units:1.3},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Values Education",units:.7},{name:"AdTech",units:1}]},eight:{name:"Grade 8",subjects:[{name:"Integrated Science",units:2},{name:"Mathematics",units:1.7},{name:"Computer Science",units:1},{name:"English",units:1.3},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Values Education",units:.7},{name:"AdTech",units:1},{name:"Earth Science",units:.7}]},nine:{name:"Grade 9",subjects:[{name:"Biology",units:1},{name:"Chemistry",units:1},{name:"Physics",units:1},{name:"Mathematics",units:1},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Statistics",units:1},{name:"Computer Science",units:1}]},tenElec:{name:"Grade 10",subjects:[{name:"Biology",units:1},{name:"Chemistry",units:1},{name:"Physics",units:1},{name:"Mathematics",units:1.3},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Research",units:1},{name:"Computer Science",units:1},{name:"Elective",units:1}]},ten:{name:"Grade 10 (no elective)",subjects:[{name:"Biology",units:1},{name:"Chemistry",units:1},{name:"Physics",units:1},{name:"Mathematics",units:1.3},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Research",units:1},{name:"Computer Science",units:1}]},tweleven:{name:"SYP",subjects:[{name:"Research",units:2},{name:"Core Science",units:1.7},{name:"Elective",units:1.7},{name:"Mathematics",units:1},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1}]}}},widget={newSubjectRow:function(e,t,n){var a=$("<tr>").attr("data-subject",e),s=$("<td>"),i=$("<p>").text(t),o=$("<h2>").addClass("num").text(n),r=$("<td>").addClass("controls"),u=$("<div>").addClass("plus"),c=$("<div>").addClass("minus");return $(c).click(function(){var e=$(this).parent().parent().attr("data-subject"),t=state.getGrade(parseInt(e));1<t&&(t-=3<t?1:.25),state.setGrade(e,t),$("tr[data-subject="+e+"] h2").text(t.toFixed(2)),app.calculate()}),$(u).click(function(){var e=$(this).parent().parent().attr("data-subject"),t=state.getGrade(parseInt(e));t<5&&(t+=2.75<t?1:.25),state.setGrade(e,t),$("tr[data-subject="+e+"] h2").text(t.toFixed(2)),app.calculate()}),$(o).click(function(){var e=$(this).parent().parent().attr("data-subject");app.promptGrade(e)}),$(s).append(i).append(o),$(r).append(c).append(u),$(a).append(s).append(r),a},newCustomSubject:function(e,t){var n=$("<tr>"),a=$("<td>").addClass("subject-delete"),s=$("<td>").addClass("subject-name"),i=$("<td>").addClass("subject-units"),o=$("<input>").attr("type","text"),r=$("<input>").attr("type","text");return $(a).click(function(){var e=$(this).parent();if(0<$(e).siblings().length)$(e).remove();else{var t=$(e).children("td.subject-name").children("input"),n=$(e).children("td.subject-units").children("input");$(t).val("").blur(),$(n).val("").blur()}}),$(o).attr("placeholder","Subject"),$(r).attr("placeholder","Units"),e&&t&&($(o).val(e),$(r).val(t)),$(s).append(o),$(i).append(r),$(n).append(a).append(s).append(i),n[0]}};app.dialog.promptSubjects=function(){var e=subjects.get("custom"),t=$("<tbody>"),n=new Dialog;if($("body").append(n),this.prepareSubjectsPrompt(n),0<e.length)for(var a=0;a<e.length;a++){var s=e[a].name,i=e[a].units,o=widget.newCustomSubject(s,i);t.append(o)}else t.append(widget.newCustomSubject());n.appendToBody($("<table>").append(t)[0]),n.show()},app.dialog.prepareSubjectsPrompt=function(e){e.title="Custom subjects",e.type="custom-subjects",e.addButton("+ row",function(){var e=this.shadowRoot;e.querySelector("tbody").appendChild(widget.newCustomSubject());var t=e.querySelector(".dialog-body");t.scrollTop=t.scrollHeight}),e.addButton("save",function(){var e=this.shadowRoot,t=e.querySelectorAll(".dialog-body tbody tr");app.dialog.parseSubjects(t,e.querySelector(".dialog-body"))&&this.dismiss()}),e.addButton("cancel",function(){if(0===subjects.get("custom").length){var e=state.get("prevSet");$("#levels select").val(e),state.switchLevel(e)}this.dismiss()})},app.dialog.parseSubjects=function(e,t){for(var n=[],a=!0,s=0;s<e.length;s++){var i=e[s],o=$(i).children("td.subject-name").children("input"),r=$(o).val(),u=$(i).children("td.subject-units").children("input"),c=parseFloat($(u).val());if(0===r.length&&(isNaN(c)||0===c.length)){if(void 0!==e[s+1])continue;if(void 0===n[0]){var l=state.get("prevSet");return"custom"===l&&(l="seven",state.set("prevSet",l)),$("#levels select").val(l),state.switchLevel(l),subjects.setCustom([]),!0}}if(0===r.length){app.dialog.highlightCustomSubjEl(o,t),a=!1;break}if(isNaN(c)||void 0===c||0===c.length){app.dialog.highlightCustomSubjEl(u,t),a=!1;break}n.push({name:r,units:c})}return a&&(subjects.setCustom(n),state.switchLevel("custom"),app.populateSubjects()),a},app.dialog.highlightCustomSubjEl=function(e,t){if(!$(e).hasClass("err")){var n=$(t).scrollTop()-$(t).offset().top+$(e).offset().top;$(t).animate({scrollTop:n},150),$(e).addClass("err"),window.setTimeout(function(){$(e).removeClass("err")},500)}},app.showEditBtn=function(){$("#btn-edit").slideDown()},app.hideEditBtn=function(){$("#btn-edit").slideUp()};var Dialog=function(e){function t(){var e;return _classCallCheck(this,t),(e=_possibleConstructorReturn(this,_getPrototypeOf(t).call(this))).listeners={},e.attachShadow({mode:"open"}),e}return _inherits(t,_wrapNativeSuper(HTMLElement)),_createClass(t,[{key:"connectedCallback",value:function(){var e=this.shadowRoot,t=document.getElementById("dialog-template"),n=document.importNode(t.content,!0);e.appendChild(n);var a=e.querySelector(".dialog-content"),s=state.get("set"),i=document.documentElement.getAttribute("data-theme");a.setAttribute("data-theme",i),a.setAttribute("data-accent",s)}},{key:"disconnectedCallback",value:function(){for(var e=this.shadowRoot.querySelectorAll(".dialog-buttons li"),t=0;t<e.length;t++){var n=e[t];n.removeEventListener("click",this.listeners[n.innerText])}}},{key:"addButton",value:function(e,t){var n=this.shadowRoot,a=t.bind(this),s=document.createElement("li");s.innerText=e,s.addEventListener("click",a),this.listeners[e]=a,n.querySelector(".dialog-buttons ul").appendChild(s)}},{key:"appendToBody",value:function(e){this.shadowRoot.querySelector(".dialog-body").appendChild(e)}},{key:"show",value:function(){app.dim(),window.setTimeout(function(){var e=this.classList;requestAnimationFrame(function(){e.add("visible")})}.bind(this),10)}},{key:"dismiss",value:function(){app.unDim(),this.classList.remove("visible"),window.setTimeout(function(){document.body.removeChild(this)}.bind(this),300)}},{key:"title",set:function(e){this.shadowRoot.querySelector(".dialog-header h2").innerText=e}},{key:"type",set:function(e){var t=this.shadowRoot;this.setAttribute("type",e),t.querySelector(".dialog-content").setAttribute("type",e)}}]),t}();customElements.define("gwa-dialog",Dialog);