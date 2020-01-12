"use strict";
var todoList = [];
var todoInput = document.getElementById("todoInput");
// addTodo - takes user input and create a new todo
function addTodo() {
    if (todoInput == null) {
        console.error("The todo input is missing from the page");
        return;
    }
    // get the value from the input
    var newTodo = todoInput.value;
    // ensure it is a valid text
    // Always put the safe part of the check on the left (that is,
    // the two single quotes). In this case, the empty string,
    // '', is safe, while calling trim() on newTodo could trigger
    // an error (for example, if it was null). This is just one of
    // many defensive programming tricks.
    if ("" !== newTodo.trim()) {
        console.log("Adding Todo: ", newTodo);
        // add new todo to the list
        todoList.push(newTodo);
        console.log("New Todo List: ", todoList);
        // clear the input field
        todoInput.value = "";
        // keep the list sorted
        todoList.sort();
        // update the todo list
        updateTodoList();
    }
}
var todoListDiv = document.getElementById("todoListContainer");
function updateTodoList() {
    console.log("Updating the rendered todo list");
    todoListDiv.innerHTML = "";
    todoListDiv.textContent = ""; // for Edge
    var ul = document.createElement('ul');
    ul.setAttribute("id", "todoList");
    todoListDiv.appendChild(ul);
    // build the list of tasks/todo
    todoList.forEach(function (item) {
        var li = document.createElement("li");
        li.setAttribute("class", "todo-list-item");
        li.innerText = item;
        ul.appendChild(li);
    });
}
