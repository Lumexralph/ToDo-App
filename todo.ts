const todoList: string[] = [];
const todoInput: HTMLInputElement = document.getElementById("todoInput") as HTMLInputElement;

// addTodo - takes user input and create a new todo
function addTodo(): void {
    if (todoInput == null) {
        console.error("The todo input is missing from the page")
        return;
    }

    // get the value from the input
    const newTodo: string = todoInput.value;

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
        todoList.sort()

        // update the todo list
        updateTodoList();
    }
}

const todoListDiv: HTMLDivElement = document.getElementById("todoListContainer") as HTMLDivElement;

function updateTodoList(): void {
    console.log("Updating the rendered todo list");
    todoListDiv.innerHTML = "";
    todoListDiv.textContent = "";  // for Edge

    const ul: HTMLUListElement = document.createElement('ul') as HTMLUListElement;
    ul.setAttribute("id", "todoList");
    todoListDiv.appendChild(ul);

    // build the list of tasks/todo
    todoList.forEach(item => {
        const li = document.createElement("li");
        li.setAttribute("class", "todo-list-item");
        li.innerText = item;
        ul.appendChild(li);
    });
}