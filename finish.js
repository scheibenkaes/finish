/*
    Copyright (C) 2011 Benjamin Klüglein

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


function saveTasksToLocalStorage (tasks) {
    $.jStorage.deleteKey("Finish");
    $.jStorage.set("Finish", tasks);
}

function onListPageShown (event) {
    Finish = readTasksFromLocalStorage() || Finish;
    updateWithTasks(Finish);
}

function updateWithTasks (finish) {
    updateActiveTask(finish);
    updateOpenTasks(finish);
}

function updateActiveTask (finish) {
    $("#cur-todo-label").text(finish.currentTask || "Nichts zu tun");
}

function updateOpenTasks (finish) {
    var ul = $("#open-todos-ul");
    ul.empty();
    jQuery.each(finish.openTasks.sort(), function(idx, v) {
        var str = "<li data-icon='star'><a href='javascript:onTaskSelected(\"" + v + "\")'>"+ v +"</a></li>";
        ul.append(str);
    });
    ul.listview('refresh');
}

function readTasksFromLocalStorage () {
    if ($.jStorage.storageAvailable()) { 
        return $.jStorage.get("Finish", null);
    } else {
        alert("Local Storage wird nicht unterstützt. Tasks können nicht gespeichert werden.");
        return null;
    }
}

// Business

function addTask (finish, task) {
    if (jQuery.inArray(task, finish.openTasks) == -1) {
        finish.openTasks.push(task);
    }
    return finish;
}

function closeCurrentTask (finish) {
    finish.currentTask = null;
    return finish;
}

function makeTaskActive (finish, task) {
    var found = jQuery.inArray(task, finish.openTasks);
    if (found == -1) { throw "Unbekannte Aufgabe." }
    finish.currentTask = finish.openTasks[found];
    finish.openTasks.splice(found, 1);
    return finish;
}

function onTaskSelected (task) {
    var dec = confirm(unescape("Soll '"+task+"' als aktive Aufgabe gew%E4hlt werden?"));
    if (!dec) return;
    if (Finish.currentTask != null) {
        alert(unescape("Moment! Erst '" + Finish.currentTask + "' fertig machen und dann das n%E4chste anfangen!!!"));
    } else {
        var f = makeTaskActive(Finish, task);
        updateWithTasks(f);
    }
}

function isActiveTaskDone (finish) {
    return finish.currentTask == null;
}

function checkNewTask () {
    var t = $("#new-task-name").val();
    var r =  t != null && t.length >= 3;
    if(!r) {
        alert("Bitte einen Titel eingeben");
    } else {
        var preemptive = $("#preemptive").val();
        if (preemptive === "yes") {
            var curTmp = Finish.currentTask;
            if (curTmp !== null)
                Finish = addTask(Finish, curTmp);
            Finish.currentTask = t;
        } else {
            Finish = addTask(Finish, t);
        }
        saveTasksToLocalStorage(Finish);
    }
    return r;
}

function checkDeleteTask () {
    var task = $("#tasks-to-delete").val();
    var idx = jQuery.inArray(task, Finish.openTasks);
    if (idx != -1) {
        Finish.openTasks.splice(idx, 1);
        saveTasksToLocalStorage(Finish);
    }
}

function onDeleteTaskPageShown (event) {
    var select = $("#tasks-to-delete");
    select.empty();
    jQuery.each(Finish.openTasks.sort(), function(idx, v){
        select.append($("<option>", {text: v, value: v}));
    });
    select.selectmenu('refresh');
}

function onTaskDone () {
    if (confirm("Und Du bist Dir sicher, dass Du alles mit dieser Aufgabe verbundene erledigt hast?") === true) {
        Finish.currentTask = null;
        saveTasksToLocalStorage(Finish);
        updateWithTasks(Finish);
    }
}

function onInfoPageShown (event) {
    var p = $("#info-text");
    $.get("README.md", function(data){
        p.text(data);
    });
}

var Finish = {
    currentTask: null,
    openTasks: []
};


