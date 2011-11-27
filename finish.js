function saveTasksToLocalStorage (tasks) {
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
    $("#cur-todo-label").text(finish.currentTask);
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
    finish.openTasks.push(task);
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


var Finish = {
    currentTask: "Not doing shit",
    openTasks: []
};


