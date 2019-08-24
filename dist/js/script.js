"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _wrapNativeSuper(e){var n="function"==typeof Map?new Map:void 0;return(_wrapNativeSuper=function(e){if(null===e||!_isNativeFunction(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(e))return n.get(e);n.set(e,t)}function t(){return _construct(e,arguments,_getPrototypeOf(this).constructor)}return t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(t,e)})(e)}function isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}function _construct(e,t,n){return(_construct=isNativeReflectConstruct()?Reflect.construct:function(e,t,n){var i=[null];i.push.apply(i,t);var s=new(Function.bind.apply(e,i));return n&&_setPrototypeOf(s,n.prototype),s}).apply(null,arguments)}function _isNativeFunction(e){return-1!==Function.toString.call(e).indexOf("[native code]")}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var app={pendingNewTheme:null,pendingSubjectPrompt:!1,menuShouldHide:function(){return window.matchMedia("(max-width: 1200px)").matches},openMenu:function(){app.menuShouldHide()&&$("#menu").addClass("animating").addClass("visible")},closeMenu:function(){app.menuShouldHide()&&$("#menu").addClass("animating").removeClass("visible")},setTheme:function(e){var t,n=$("#btn-theme span");switch(e){case"auto":n.text("Night mode auto"),t=app.sunHasSet()||app.deviceInDarkMode()?"night":"day";break;case"night":n.text("Night mode on"),t=e;break;default:n.text("Night mode off"),t=e}app.menuShouldHide()?app.pendingNewTheme=t:$("html").attr("data-theme",t),state.set("dispMode",e)},sunHasSet:function(){var e=new Date,t=SunCalc.getTimes(e,12,121),n=t.sunrise,i=t.sunset;return 0<=n-e||0<=e-i},deviceInDarkMode:function(){return window.matchMedia("(prefers-color-scheme: dark)").matches},deviceIsIOS:function(){var e=window.navigator.userAgent,t=!!e.match(/iP(ad|hone|od|od Touch)/i),n=!!e.match(/WebKit/i);return t&&n},deviceIsMobileSafari:function(){var e=window.navigator.userAgent.match(/(Chrome|CriOS|OPiOS)/i);return app.deviceIsIOS()&&!e},setGpa:function(e){var t=e?"GWA mode":"cGPA mode (alpha)";$("#btn-gpa span").text(t),state.set("isGpa",e),app.calculate()},setColors:function(e){$("#app").attr("data-theme",e)},populateChooser:function(e){for(var t=$("#levels select"),n=subjects.getSets(),i=0;i<n.length;i++){var s=n[i],a=s.alias,o=s.name,r=$("<option>");$(r).attr("value",a).text(o),t.append(r)}t.val(e),t.on("change",function(){var e=$(this).val();if("custom"===e){if(app.closeMenu(),state.set("prevSet",state.get("set")),0===subjects.get("custom").length)return void(app.menuShouldHide()?app.pendingSubjectPrompt=!0:dialogs.customSubjects())}else app.closeMenu();"custom"===state.get("set")&&e===state.get("prevSet")?state.switchLevel(e,!0):state.switchLevel(e)})},populateSubjects:function(){var e=state.get("grades"),t=subjects.get();if(e.length!==t.length)if(e.length>t.length)for(;e.length>t.length;)e.pop();else for(;e.length<t.length;)e.push(1);var n=$("#grades table");n.empty();for(var i=0;i<t.length;i++){var s=t[i],a=s.name+" ("+s.units.toFixed(1)+" units)",o=e[i].toFixed(2),r=utils.newSubjectRow(i,a,o);n.append(r)}app.calculate()},promptGrade:function(e){var t=subjects.get()[e].name,n=window.prompt("Enter grade for "+t),i=calc.isValid(n);0<n.length&&(i.result||(n=parseFloat(n),$("tr[data-subject="+e+"] h2").text(n.toFixed(2)),state.setGrade(e,n),app.calculate()))},calculate:function(){var e=calc.ulate();$("#gwa").text(e.substring(0,5))},showEditBtn:function(){$("#btn-edit").slideDown()},hideEditBtn:function(){$("#btn-edit").slideUp()}},calc={ulate:function(){for(var e=0,t=0,n=state.get("isGpa"),i=subjects.get(),s=0;s<i.length;s++){var a=i[s].units;e+=a;var o=state.getGrade(s);n&&(o=this.convertToGpa(o)),t+=o*a}return isNaN(t/e)?($("#levels select").val("seven"),"Error"):""+(t/e).toFixed(10)},convertToGpa:function(e){var t;switch(parseFloat(e)){case 1:t=4;break;case 1.25:t=3.7;break;case 1.5:t=3.3;break;case 1.75:t=3;break;case 2:t=2.7;break;case 2.25:t=2.3;break;case 2.5:t=2;break;case 2.75:t=1.7;break;case 3:t=1.3;break;case 4:t=1;break;default:t=0}return t},isValid:function(e){var t=parseFloat(e),n="";return/[^0-9.]+/.test(e)?n="contains invalid characters":t<1||5<t?n=t+" is out of range":t<3&&t%.25!=0?n="no such grade":(3<t&&t<4||4<t&&t<5)&&(n="no such grade"),{result:0<n.length,reason:n}}},state={current:{version:"14.1 build 20190824",versionCode:22,set:"seven",prevSet:"seven",grades:[],dispMode:"auto",isGpa:!(app.init=function(){state.load();var e=state.get("version");$("#version").text(e+" "),$("#btn-feedback").parent().attr("href","http://server.jared.gq/feedback/?subject=pisaygwa-web-"+e.replace(" build ","b")),window.isUpdateAvailable.then(function(e){e&&dialogs.updateFound()});var t=new Hammer(document.body);t.on("swiperight",app.openMenu),t.on("swipeleft",function(){app.closeMenu()});var n=$("#menu");if($("#menu-toggle").click(n.hasClass("visible")?app.closeMenu:app.openMenu),n.click(function(){app.closeMenu()}),$(".button").each(function(){$(this).mousedown(function(){$(this).addClass("focus")}).mouseup(function(){$(this).removeClass("focus")}).click(function(){app.closeMenu()})}),$("#btn-theme").click(function(){var e;switch(state.get("dispMode")){case"day":e="night";break;case"night":e="auto";break;default:e="day"}app.setTheme(e)}),$("#btn-edit").click(function(){window.setTimeout(function(){dialogs.customSubjects()},300)}),$("#btn-clr").click(function(){state.resetGrades(),app.populateSubjects()}),$("#btn-gpa").click(function(){var e=state.get("isGpa");app.setGpa(!e)}),$("a").each(function(){$(this).attr("target","_blank").attr("rel","noopener")}),app.menuShouldHide()&&($(".menu").on("transitionend",function(){n.removeClass("animating");var e=app.pendingNewTheme,t=app.pendingSubjectPrompt;null!==e&&($("html").attr("data-theme",e),app.pendingNewTheme=null),t&&(dialogs.customSubjects(),app.pendingSubjectPrompt=!1)}),n.children().click(function(e){e.stopPropagation()})),app.deviceIsIOS()&&!state.get("iOSprompt")){var i=!0,s=!0;app.deviceIsMobileSafari()?"standalone"in window.navigator&&window.navigator.standalone&&(i=!1):s=!1,i&&dialogs.iOSinstall(s)}}),customSet:[],iOSprompt:!1},get:function(e){return this.current[e]},set:function(e,t){if(this.current[e]=t,void 0!==("undefined"==typeof Storage?"undefined":_typeof(Storage))){var n=this.current,i=JSON.stringify(n);localStorage.setItem("gwadata",i)}},getGrade:function(e){return this.current.grades[e]},setGrade:function(e,t){this.current.grades[e]=t,this.set("grades",this.current.grades)},switchLevel:function(e,t){void 0===t&&(t=e===this.get("set")),"custom"===e?app.showEditBtn():app.hideEditBtn(),t||this.resetGrades(e),this.set("set",e),subjects.setDefault(e),app.populateSubjects(),app.setColors(e)},resetGrades:function(e){e=e||this.get("set");for(var t=[],n=subjects.get(e),i=0;i<n.length;i++)t.push(1);this.set("grades",t)},load:function(){if(void 0!==("undefined"==typeof Storage?"undefined":_typeof(Storage))){var e=localStorage.getItem("gwadata");if(null!=e){var t=JSON.parse(e);if(null!=t.set&&0<t.grades.length){if("string"==typeof t.grades[0]){for(var n=[],i=0;i<t.grades.length;i++){var s=parseFloat(t.grades[i]);n.push(s)}this.set("grades",n)}else this.current.grades=t.grades;void 0===t.customSet?this.set("customSet",[]):(subjects.setCustom(t.customSet),"custom"===t.set&&app.showEditBtn()),void 0===t.iOSprompt||t.versionCode<22?this.set("iOSprompt",!1):this.current.iOSprompt=t.iOSprompt,app.populateChooser(t.set),this.switchLevel(t.set,!0),this.current.prevSet=t.set,app.setGpa(t.isGpa),app.setTheme(t.dispMode)}else app.populateChooser("seven"),this.switchLevel("seven",!1)}else app.populateChooser("seven"),this.switchLevel("seven",!1)}else{document.querySelector("tr.loader td").innerText="Please use a newer browser."}}},subjects={default:"seven",setDefault:function(e){this.sets.hasOwnProperty(e)&&(this.default=e)},get:function(e){return e=e||this.default,this.sets[e].subjects},getSets:function(){for(var e=[],t=Object.keys(this.sets),n=0;n<t.length;n++){var i=t[n];e.push({alias:i,name:subjects.sets[i].name})}return e},setCustom:function(e){this.sets.custom.subjects=e,state.set("customSet",e)},sets:{custom:{name:"Custom subjects",subjects:[]},seven:{name:"Grade 7",subjects:[{name:"Integrated Science",units:1.7},{name:"Mathematics",units:1.7},{name:"Computer Science",units:1},{name:"English",units:1.3},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Values Education",units:.7},{name:"AdTech",units:1}]},eight:{name:"Grade 8",subjects:[{name:"Integrated Science",units:2},{name:"Mathematics",units:1.7},{name:"Computer Science",units:1},{name:"English",units:1.3},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Values Education",units:.7},{name:"AdTech",units:1},{name:"Earth Science",units:.7}]},nine:{name:"Grade 9",subjects:[{name:"Biology",units:1},{name:"Chemistry",units:1},{name:"Physics",units:1},{name:"Mathematics",units:1},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Statistics",units:1},{name:"Computer Science",units:1}]},tenElec:{name:"Grade 10",subjects:[{name:"Biology",units:1},{name:"Chemistry",units:1},{name:"Physics",units:1},{name:"Mathematics",units:1.3},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Research",units:1},{name:"Computer Science",units:1},{name:"Elective",units:1}]},ten:{name:"Grade 10 (no elective)",subjects:[{name:"Biology",units:1},{name:"Chemistry",units:1},{name:"Physics",units:1},{name:"Mathematics",units:1.3},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1},{name:"PEHM",units:1},{name:"Research",units:1},{name:"Computer Science",units:1}]},tweleven:{name:"SYP",subjects:[{name:"Research",units:2},{name:"Core Science",units:1.7},{name:"Elective",units:1.7},{name:"Mathematics",units:1},{name:"English",units:1},{name:"Filipino",units:1},{name:"Social Science",units:1}]}}},utils={newSubjectRow:function(e,t,n){var i=$("<tr>").attr("data-subject",e),s=$("<td>"),a=$("<p>").text(t),o=$("<h2>").addClass("num").text(n),r=$("<td>").addClass("controls"),u=$("<div>").addClass("plus"),c=$("<div>").addClass("minus");return $(c).click(function(){var e=$(this).parent().parent().attr("data-subject"),t=state.getGrade(parseInt(e));1<t&&(t-=3<t?1:.25),state.setGrade(e,t),$("tr[data-subject="+e+"] h2").text(t.toFixed(2)),app.calculate()}),$(u).click(function(){var e=$(this).parent().parent().attr("data-subject"),t=state.getGrade(parseInt(e));t<5&&(t+=2.75<t?1:.25),state.setGrade(e,t),$("tr[data-subject="+e+"] h2").text(t.toFixed(2)),app.calculate()}),$(o).click(function(){var e=$(this).parent().parent().attr("data-subject");app.promptGrade(e)}),$(s).append(a).append(o),$(r).append(c).append(u),$(i).append(s).append(r),i},newCustomSubject:function(e,t){var n=$("<tr>"),i=$("<td>").addClass("subject-delete"),s=$("<td>").addClass("subject-name"),a=$("<td>").addClass("subject-units"),o=$("<input>").attr("type","text"),r=$("<input>").attr("type","text");return $(i).click(function(){var e=$(this).parent();if(0<$(e).siblings().length)$(e).remove();else{var t=$(e).children("td.subject-name").children("input"),n=$(e).children("td.subject-units").children("input");$(t).val("").blur(),$(n).val("").blur()}}),$(o).attr("placeholder","Subject"),$(r).attr("placeholder","Units"),e&&t&&($(o).val(e),$(r).val(t)),$(s).append(o),$(a).append(r),$(n).append(i).append(s).append(a),n[0]},highlightCustomSubjEl:function(e,t){if(!$(e).hasClass("err")){var n=$(t).scrollTop()-$(t).offset().top+$(e).offset().top;$(t).animate({scrollTop:n},150),$(e).addClass("err"),window.setTimeout(function(){$(e).removeClass("err")},500)}},parseSubjects:function(e,t){for(var n=[],i=!0,s=0;s<e.length;s++){var a=e[s],o=$(a).children("td.subject-name").children("input"),r=$(o).val(),u=$(a).children("td.subject-units").children("input"),c=parseFloat($(u).val());if(0===r.length){if(isNaN(c)||0===c.length)continue;this.highlightCustomSubjEl(o,t),i=!1;break}if(isNaN(c)||void 0===c||0===c.length){this.highlightCustomSubjEl(u,t),i=!1;break}n.push({name:r,units:c})}if(n.length<=0){var l=state.get("prevSet");return"custom"===l&&(l="seven",state.set("prevSet",l)),$("#levels select").val(l),state.switchLevel(l),subjects.setCustom([]),!0}return i&&(subjects.setCustom(n),state.switchLevel("custom"),app.populateSubjects()),i}},Dialog=function(e){function o(){var e;return _classCallCheck(this,o),(e=_possibleConstructorReturn(this,_getPrototypeOf(o).call(this))).listeners={},e.attachShadow({mode:"open"}),e.container=document.getElementById("dialog-container"),e.container.appendChild(_assertThisInitialized(e)),e}return _inherits(o,_wrapNativeSuper(HTMLElement)),_createClass(o,[{key:"connectedCallback",value:function(){var e=this.shadowRoot,t=document.getElementById("dialog-template"),n=document.importNode(t.content,!0);e.appendChild(n);var i=e.querySelector(".dialog-content"),s=state.get("set"),a=document.documentElement.getAttribute("data-theme");i.setAttribute("data-theme",a),i.setAttribute("data-accent",s),this.addEventListener("transitionend",this.onTransitionFinished),this.addEventListener("click",o.onClickListener)}},{key:"disconnectedCallback",value:function(){for(var e=this.shadowRoot.querySelectorAll(".dialog-buttons li"),t=0;t<e.length;t++){var n=e[t];n.removeEventListener("click",this.listeners[n.innerText])}this.removeEventListener("transitionend",this.onTransitionFinished),this.removeEventListener("click",o.onClickListener)}},{key:"addButton",value:function(e,t){var n=this.shadowRoot,i=t.bind(this),s=document.createElement("li");s.innerText=e,s.addEventListener("click",i),this.listeners[e]=i,n.querySelector(".dialog-buttons ul").appendChild(s)}},{key:"appendToBody",value:function(e){this.shadowRoot.querySelector(".dialog-body").appendChild(e)}},{key:"show",value:function(){var e=this.container;window.setTimeout(function(){requestAnimationFrame(function(){e.classList.add("animating"),e.classList.add("visible")})},10)}},{key:"dismiss",value:function(){var e=this.container;e.classList.add("animating"),e.classList.remove("visible"),window.setTimeout(function(){e.classList.remove("animating"),e.removeChild(this)}.bind(this),300)}},{key:"onTransitionFinished",value:function(){this.container.classList.remove("animating")}},{key:"title",set:function(e){this.shadowRoot.querySelector(".dialog-header h2").innerHTML=e}},{key:"type",set:function(e){var t=this.shadowRoot;this.setAttribute("type",e),t.querySelector(".dialog-content").setAttribute("type",e)}}],[{key:"onClickListener",value:function(e){e.stopPropagation()}}]),o}();customElements.define("gwa-dialog",Dialog);var dialogs={_new:function(e){var t=new Dialog,n=e.subtitle||void 0,i=e.img||void 0,s=e.onDismiss||void 0,a=e.buttons||void 0;if(t.title=e.title||function(e){throw new Error("[dialog] Title unspecified")}(),t.type=e.type||function(e){throw new Error("[dialog] Type unspecified")}(),void 0!==i){var o=document.createElement("img");o.src="dist/img/".concat(i,".svg"),o.alt=i.replace(/-/g," "),t.appendToBody(o)}if(void 0!==n){var r=document.createElement("p");r.innerText=n,t.appendToBody(r)}if(void 0!==s&&t.addButton("dismiss",function(){e.onDismiss(),t.dismiss()}),void 0!==a)for(var u=0;u<a.length;u++){var c=a[u],l=c.name,d=c.fn;t.addButton(l,d)}return t},customSubjects:function(){var n=this._new({title:"Custom subjects",type:"custom-subjects",buttons:[{name:"+ row",fn:function(){var e=this.shadowRoot;e.querySelector("tbody").appendChild(utils.newCustomSubject());var t=e.querySelector(".dialog-body");t.scrollTop=t.scrollHeight}},{name:"cancel",fn:function(){if(0===subjects.get("custom").length){var e=state.get("prevSet");document.querySelector("#levels select").value=e,state.switchLevel(e)}this.dismiss()}},{name:"save",fn:function(){var e=this.shadowRoot,t=e.querySelectorAll(".dialog-body tbody tr");utils.parseSubjects(t,e.querySelector(".dialog-body"))&&n.dismiss()}}]}),e=subjects.get("custom"),t=document.createElement("tbody");if(0<e.length)for(var i=0;i<e.length;i++){var s=e[i].name,a=e[i].units,o=utils.newCustomSubject(s,a);t.appendChild(o)}else t.appendChild(utils.newCustomSubject());var r=document.createElement("table");r.appendChild(t),n.appendToBody(r),n.show()},iOSinstall:function(e){this._new({title:"Bookmark for easier access,<br>even when offline",type:"ios-install",subtitle:e?"Just tap Share and choose Add To Home Screen.":"Open this site in Safari to begin.",img:e?"ios-install":"ios-safari",onDismiss:function(){state.set("iOSprompt",!0)}}).show()},updateFound:function(){var e=this._new({title:"App update found",type:"update-found",img:"update-found"});e.addButton("update & refresh",function(){window.location.reload()}),e.show()}};