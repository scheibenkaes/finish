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
        ul.append($("<li>", {text: v}));
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
    saveTasksToLocalStorage(finish);
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
    finish.openTasks = finish.openTasks.splice(found, 1);
    return finish;
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
        Finish = addTask(Finish, t);
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
    Finish.currentTask = null;
    saveTasksToLocalStorage(Finish);
    updateWithTasks(Finish);
}

var Finish = {
    currentTask: "Not doing shit",
    openTasks: []
};


