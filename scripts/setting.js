function showSetting(id){
	var task = document.getElementById("task"+id);
	var setting = task.getElementsByClassName("settingTool")[0];
	var btnStyle = task.getElementsByClassName("settings")[0].style;
	if( btnStyle.opacity == "0.6" ){
		task.style.height = 92+setting.offsetHeight+"px";
		setting.style.opacity = "0";
		;
		setTimeout(function(){task.style.height = "92px";},50);
		
		btnStyle.opacity = "0.2";
	}else{
		btnStyle.opacity = "0.6";
				
		setting.style.opacity = "1";
		task.style.height = 92+setting.offsetHeight+"px";
		setTimeout(function(){settingInit(setting,id, task);},500);
	}	
}

function settingInit(setting, id, task){
	
	task.style.height = "auto";

	setting.getElementsByClassName("setName")[0].value = localStorage.getItem("tName"+id);
	setting.getElementsByClassName("setPriority")[0].value = parseInt(localStorage.getItem("tPrio"+id));
	setting.getElementsByClassName("setParts")[0].value = parseInt(localStorage.getItem("tPart"+id));
	setting.getElementsByClassName("setDone")[0].value = parseInt(localStorage.getItem("tDone"+id));
	setting.getElementsByClassName("setCreate")[0].value = dateToStr(new Date(localStorage.getItem("tDate"+id)));
	setting.getElementsByClassName("setLast")[0].value = dateToStr(new Date(localStorage.getItem("tLast"+id)));
}

function settingClose(setting, task){
	task.style.height = "92px";
}

function confirmSettings(id){
	var task = document.getElementById("task"+id);
	var setting = task.getElementsByClassName("settingTool")[0];
	var name = setting.getElementsByClassName("setName")[0].value;
	var priority = setting.getElementsByClassName("setPriority")[0].value;
	var parts = setting.getElementsByClassName("setParts")[0].value;
	var done = setting.getElementsByClassName("setDone")[0].value;
	var create = new Date(setting.getElementsByClassName("setCreate")[0].value);
	//console.log(create+" "+setting.getElementsByClassName("setCreate")[0].value);
	var last = new Date(setting.getElementsByClassName("setLast")[0].value);
	localStorage.setItem("tName"+id, name);
	localStorage.setItem("tPrio"+id, priority);
	localStorage.setItem("tPart"+id, parts);
	localStorage.setItem("tDone"+id, done);
	localStorage.setItem("tDate"+id, create);
	localStorage.setItem("tLast"+id, last);
	task.getElementsByClassName("head")[0].getElementsByClassName("name")[0].innerHTML = name;
	task.getElementsByClassName("lastEdit")[0].getElementsByClassName("time")[0].innerHTML = last.toGMTString();
	displayProgress(done, parts, task);
	displayFinish(create, parts, done, task);
	displayProgressColor(task, priority, last);	
}

function dateToStr(date){
	if(supportsDateInput()){
		//2014-11-16T15:25:33
		var output=date.getFullYear()+'-'+fd((date.getMonth())+1)+'-'+fd(date.getDay());
		output += 'T'+fd(date.getHours())+':'+fd(date.getMinutes())+':'+fd(date.getSeconds());
		//console.log(output);
		return output;
	}else{
		//var options = { hour: "numeric", minute: "2-digit", second: "2-digit" };
		//return date.toLocaleDateString('es',options);
		return date.toGMTString();
	}
}

function fd(number){
	if(number<10) return "0"+number;
	return number;
}

function supportsDateInput() { //No funciona ¬¬
	return window.webkitURL != null;
	/*var dummy = document.createElement("input");
	dummy.setAttribute("type", "localDateTime");
	return dummy.getAttribute("type") == "localDateTime";*/
}

function deleteTask(id){
	var task = document.getElementById("task"+id);
	if(!confirm("Desea borrar "+task.getElementsByClassName("name")[0].innerHTML+"?")) return;
	
	var task = document.getElementById("task"+id);
	task.style.height = "0px";
	task.style.opacity = "0";
	setTimeout(function(){document.getElementById("taskList").removeChild(task);},600);
	localStorage.removeItem("tName"+id);
	localStorage.removeItem("tPrio"+id);
	localStorage.removeItem("tPart"+id);
	localStorage.removeItem("tDone"+id);
	localStorage.removeItem("tDate"+id);
	localStorage.removeItem("tLast"+id);
}
