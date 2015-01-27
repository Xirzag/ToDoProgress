var note = document.getElementById("note");
if(typeof(Storage) === "undefined"){
	alert("Esta p&acute;gina requiere un navegador que soporte WebStorage");
}else{
	if(!localStorage.numberOfTasks) {
		localStorage.setItem("numberOfTasks","0");
		note.value = "Crea una nueva tarea utilizando la barra superior \nRecuerda que la prioridad es el la cantidad de dias que puedes estar sin hacer la tarea";
	}
	else{
		note.value = localStorage.getItem("note");
		var numberOfTasks = parseInt(localStorage.getItem("numberOfTasks"));
		for (var i=0; i < numberOfTasks; i++) {
			if(localStorage.getItem("tName"+i)){
				taskDisplay(
					localStorage.getItem("tName"+i),
					new Date(localStorage.getItem("tDate"+i)),
					parseInt(localStorage.getItem("tPart"+i)),
					parseInt(localStorage.getItem("tDone"+i)),
					parseInt(localStorage.getItem("tPrio"+i)),
					new Date(localStorage.getItem("tLast"+i)),
					i
				);
			}
		};
	}
}

function taskAdd(){
	var numberOfTasks = parseInt(localStorage.getItem("numberOfTasks"));
	var name = document.getElementById("addName").value;
	var priority = document.getElementById("addPriority").value;
	var parts = document.getElementById("addParts").value;
	var today = new Date();
	localStorage.setItem("tName"+numberOfTasks, name);
	localStorage.setItem("tDone"+numberOfTasks, 0);
	localStorage.setItem("tDate"+numberOfTasks, today.toString());
	localStorage.setItem("tPart"+numberOfTasks, parts.toString());
	localStorage.setItem("tPrio"+numberOfTasks, priority.toString());
	localStorage.setItem("tLast"+numberOfTasks, today.toString());
	taskDisplay(name,today,parts,0,priority,today,numberOfTasks);
	localStorage.setItem("numberOfTasks", (++numberOfTasks).toString());
	document.getElementById("addName").value = "";
	document.getElementById("addPriority").value = "";
	document.getElementById("addParts").value = "";
}

function taskDisplay(name,creationDate,parts,done,priority,lastModified,id){
	var taskList = document.getElementById("taskList");
	var progress = calculateProgress(done, parts);
	var finishDate;
	/*if(done == 0) finishDate = "??-??-????";
	else finishDate = calculateFinish(lastModified, parts, done);*/
	taskList.innerHTML += '<div class="task" id="task'+id+
			'">\n<div class="tool">\n<div class="more" onclick="taskPartComplete(1,'+id+
			')">+</div>\n<div class="less" onclick="taskPartComplete(-1,'+id+')">-</div>\n</div>\n' +
			'<div class="info">\n<div class="head"><div class="name">'+name+
			'</div>\n<div class="finishTime">Terminado para<div class="time">?'/*+finishDate.toLocaleDateString()*/+
			'</div>\n</div>\n</div>\n<div class="progressBar"><div class="progress" style="width:'+progress+
			'%"> </div>\n</div>\n<div class="lastEdit">&Uacute;ltima vez<div class="time">'+lastModified.toGMTString()/*.toLocaleDateString()*/+
			'</div>\n</div>\n<img class="settings" onclick="showSetting('+id+
			')" src="img/setting.png"/>\n<div class="settingTool"><div class="inputControl">Nombre: <input class="setName" type="text" /></div>'+
			'<div class="inputControl">Prioridad <input class="setPriority" type="number" /></div>'+
			'<div class="inputControl">Partes <input class="setParts" type="number" /></div><div class="inputControl">Terminadas'+
			'<input class="setDone" type="number" /></div><div class="inputControl">Creado el '+
			'<input class="setCreate" type="datetime-local" /></div><div class="inputControl">Modificado el'+
			' <input class="setLast" type="datetime-local" /></div><input type="button" onclick="confirmSettings('+id+
			')" value="modificar"/><input type="button" onclick="deleteTask('+id+
			')" class="btnDelete" value="borrar"/></div></div>\n</div>';
	var task = document.getElementById("task"+id);
	displayFinish(creationDate, parts, done, task);
	btnDeleteOrMore(id, done, parts);
	displayProgressColor(task, priority, lastModified);
}

function btnDeleteOrMore(id, done, parts){
	var task = document.getElementById("task"+id);
	var moreBtn = task.getElementsByClassName("more")[0];
	if(done > parts-1) {
		moreBtn.className += " btnDelete";
		moreBtn.innerHTML = 'x';
	} else {
		moreBtn.className = "more";
		moreBtn.innerHTML = '+';
	}
}

function taskPartComplete(amount, id){
	var parts = parseInt(localStorage.getItem("tPart"+id));
	var done = parseInt(localStorage.getItem("tDone"+id)) + amount;
	if(done > parts) {
		deleteTask(id);
	}else if(done >= 0) {
		btnDeleteOrMore(id, done, parts);
		localStorage.setItem( "tDone"+id, done.toString() );
		
		var task = document.getElementById("task"+id);
		displayProgress(done, parts, task);
		task.getElementsByClassName("lastEdit")[0].getElementsByClassName("time")[0].innerHTML = new Date().toGMTString();
		
		var createDate = new Date(localStorage.getItem("tDate"+id));
		displayFinish(createDate, parts, done, task);
		localStorage.setItem( "tLast"+id, new Date().toString() );
	}
}

function calculateFinish(createDate, parts, done){
	var milsInPart = new Date().getTime() - createDate.getTime();
	return new Date((parts-done)*milsInPart/done + new Date().getTime());
}

function displayFinish(createDate, parts, done, task){
	var finishDate;
	if(done == 0) finishDate = "??-??-????";
	else finishDate = calculateFinish(createDate, parts, done).toLocaleDateString();
	task.getElementsByClassName("finishTime")[0].getElementsByClassName("time")[0].innerHTML = finishDate;
}

function displayProgressColor(task, priority, last){
	var days = (new Date().getTime() - last.getTime())/86400000;
	var priorcentage = days/priority; 
	var color;
	if( priorcentage < 0 ) color = "#444477";
	else if(priorcentage <= 1) color = colorBeyond("77FF44","FF7744",priorcentage);
	else if(priorcentage <= 2) color = colorBeyond("FF7744","FF3322",priorcentage);
	else color = "#FF3322";
	console.log("color "+color+" "+priorcentage);
	task.getElementsByClassName("progress")[0].style.backgroundColor = color;
}

function colorBeyond(colorA, colorB, offset) {
	var mixColor = "#";
	console.log(colorA.substring(0,2)+" "+colorA.substring(2,4)+" "+colorA.substring(4,6));
	console.log(colorB.substring(0,2)+" "+colorB.substring(2,4)+" "+colorB.substring(4,6));
	mixColor += toneBeyond(colorA.substring(0,2), colorB.substring(0,2), offset);
	mixColor += toneBeyond(colorA.substring(2,4), colorB.substring(2,4), offset);
	mixColor += toneBeyond(colorA.substring(4,6), colorB.substring(4,6), offset);
	return mixColor;
}

function toneBeyond(toneA, toneB, offset) {
	var toneA = parseInt(toneA, 16);
	var toneB = parseInt(toneB, 16);
	var mixTone = Math.abs(Math.floor((toneA-toneB)*offset));
	var mixTone = (mixTone +toneA );
	if( mixTone >= 255 ) return "ff";
	if( mixTone <= 0 ) return "00";
	mixTone = mixTone.toString(16);
	return (mixTone.length < 2)? '0'+ mixTone : mixTone;
}

function calculateProgress(done, parts){
	return (done * 100)/parts;
}

function displayProgress(done, parts, task){
	var progress = calculateProgress(done, parts) + "%";
	task.getElementsByClassName("progress")[0].style.width = progress;
}

function checkRows(){
	var rows = note.value.split("\n").length;
	if(rows < 3) note.style.height = "138px"; 
	else note.style.height = 29*rows+"px";
	localStorage.setItem("note", note.value);
}

checkRows();

setInterval(function(){ check(); }, 30000);

function check(){
	if (document.hidden) {
		for (var id=0; id < numberOfTasks; id++) {
			if(localStorage.getItem("tName"+id)){
				var task = document.getElementById("task"+id);
				var createDate = new Date(localStorage.getItem("tDate"+id));
				var parts = parseInt(localStorage.getItem("tPart"+id));
				var done = parseInt(localStorage.getItem("tDone"+id));
				displayFinish(createDate, parts, done, task);
			}
		}
	}
}

function reset(){
	localStorage.clear();
}

