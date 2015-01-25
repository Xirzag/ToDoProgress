var note = document.getElementById("note");
if(typeof(Storage) === "undefined"){
	alert("Esta p&acute;gina requiere un navegador que soporte WebStorage");
}else{
	if(!localStorage.numberOfTasks) {
		localStorage.setItem("numberOfTasks","0");
		note.value = "Crea una nueva tarea utilizando la barra superior\nPuedes escribir tus notas en este campo";
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
	displayFinish(creationDate, parts, done, document.getElementById("task"+id));
	btnDeleteOrMore(id, done, parts);
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

function calculateProgress(done, parts){
	return (done * 100)/parts;
}

function displayProgress(done, parts, task){
	var progress = calculateProgress(done, parts) + "%";
	task.getElementsByClassName("progress")[0].style.width = progress;
}

function checkRows(){
	var rows = note.value.split("\n").length;
	if(rows < 3) note.style.height = "92px"; 
	else note.style.height = 29*rows+"px";
	localStorage.setItem("note", note.value);
}

checkRows();

function reset(){
	localStorage.clear();
}

