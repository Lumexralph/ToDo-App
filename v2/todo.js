"use strict";
// Domain/Model layer
var ToodoItem = /** @class */ (function () {
    function ToodoItem(_description, identifier) {
        this._description = _description;
        this._creationTimestamp = new Date().getTime();
        if (identifier) {
            this._identifier = identifier;
        }
        else {
            // for any real world project use
            //  UUIDs instead: https://www.npmjs.com/package/uuid
            this._identifier = Math.random().toString(36).substr(3, 10);
        }
    }
    Object.defineProperty(ToodoItem.prototype, "creationTimestamp", {
        get: function () {
            return this._creationTimestamp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToodoItem.prototype, "identifier", {
        get: function () {
            return this._identifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToodoItem.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    return ToodoItem;
}());
var TodoList = /** @class */ (function () {
    function TodoList(todoList) {
        this._todoList = [];
        // let's ensure we have a valid array
        if (Array.isArray(todoList) && todoList.length) {
            this._todoList = this._todoList.concat(todoList);
        }
    }
    Object.defineProperty(TodoList.prototype, "todoList", {
        get: function () {
            return this._todoList;
        },
        enumerable: true,
        configurable: true
    });
    TodoList.prototype.addTodo = function (todoItem) {
        if (todoItem) {
            // the value is "truthy":
            // not null, not undefined, not NaN, not an empty string,
            // not 0, not false
            // favor immutability to use a more functional approach.
            this._todoList = this._todoList.concat(todoItem);
        }
    };
    TodoList.prototype.removeTodo = function (itemId) {
        if (itemId) {
            // favor immutability to use a more functional approach.
            this._todoList = this._todoList.filter(function (item) {
                if (item.identifier == itemId) {
                    return false; // drop the item
                }
                return true; // leave the item
            });
        }
    };
    return TodoList;
}());
// HTML-based implementation of the interface
var HTMLTodoListView = /** @class */ (function () {
    function HTMLTodoListView() {
        this.todoInput = document.getElementById("todoInput");
        this.todoListDiv = document.getElementById("todoListContainer");
        this.todoListFilter = document.getElementById("todoFilter");
        // defensive check
        if (!this.todoInput) {
            throw new Error("Could not the HTML input element with todoInput id. Is the HTML correct?");
        }
        if (!this.todoListDiv) {
            throw new Error("Could not the HTML div element with todoListContainer id. Is the HTML correct?");
        }
        if (!this.todoListFilter) {
            throw new Error("Could not the HTML input element with todoFilter id. Is the HTML correct?");
        }
    }
    HTMLTodoListView.prototype.clearInput = function () {
        this.todoInput.value = "";
    };
    HTMLTodoListView.prototype.getFilter = function () {
        return this.todoListFilter.value.toUpperCase();
    };
    HTMLTodoListView.prototype.getInput = function () {
        var todoInputValue = this.todoInput.value.trim();
        var retVal = new ToodoItem(todoInputValue);
        return retVal;
    };
    HTMLTodoListView.prototype.filter = function () {
        console.log("Filtering the rendered list..");
        var todoListHtml = document.getElementById("todoList");
        if (todoListHtml === null) {
            console.log("Nothing to Filter");
            return;
        }
        var todoListFilterText = this.getFilter();
        todoListHtml.childNodes.forEach(function (item) {
            var itemText = item.textContent;
            if (itemText !== null) {
                itemText = itemText.toUpperCase();
                if (itemText.startsWith(todoListFilterText)) {
                    item.style.display = "list-item";
                }
                else {
                    item.style.display = "none";
                }
            }
        });
    };
    HTMLTodoListView.prototype.render = function (todoList) {
        console.log("Updating the rendered todo list");
        this.todoListDiv.innerHTML = "";
        this.todoListDiv.textContent = ""; // for Edge
        var ul = document.createElement('ul');
        ul.setAttribute("id", "todoList");
        this.todoListDiv.appendChild(ul);
        // build the list of tasks/todo
        todoList.forEach(function (item) {
            var li = document.createElement("li");
            li.setAttribute("class", "todo-list-item");
            li.innerHTML = "<a href=\"#\" onclick='todoIt.removeTodo(\"" + item.identifier + "\")'>" + item.description + "</a>";
            ul.appendChild(li);
        });
    };
    return HTMLTodoListView;
}());
// controller is initiated with the view interface i.e any object that
// implements the TodoListView interface
var TodoIt = /** @class */ (function () {
    function TodoIt(_todoListView) {
        this._todoListView = _todoListView;
        // reference to the model and its operations
        this._todoList = new TodoList();
        // reference to tne view
        // whatever we have for the view must have the TodoListView interface
        // because we'll be calling the methods without caring about the implementation.
        // it also helps to decouple the code, the different architecture layers
        console.log("TodoIt V2");
        if (!this._todoList) {
            throw new Error("The todo list view implementation is required to properly initialize TodoIt!");
        }
    }
    TodoIt.prototype.addTodo = function () {
        // get the value from the view
        var newTodo = this._todoListView.getInput();
        // validate the input
        if ("" !== newTodo.description) {
            console.log("Adding todo: ", newTodo);
        }
        // add the new item to the list, interact with the model or domain
        this._todoList.addTodo(newTodo);
        console.log("New todo list: ", this._todoList.todoList);
        // clear the input
        this._todoListView.clearInput();
        // update the rendered todo list
        this._todoListView.render(this._todoList.todoList);
        // filter the list if needed
        this.filterTodoList();
    };
    TodoIt.prototype.filterTodoList = function () {
        // interact with the view
        this._todoListView.filter();
    };
    TodoIt.prototype.removeTodo = function (identifier) {
        if (identifier) {
            console.log("item to remove: ", identifier);
            // interact with the model or data
            this._todoList.removeTodo(identifier);
            // interact with the view and the model
            this._todoListView.render(this._todoList.todoList);
            this.filterTodoList();
        }
    };
    return TodoIt;
}());
// utility function
var EventUtils = /** @class */ (function () {
    function EventUtils() {
    }
    EventUtils.isEnter = function (event) {
        var isEnterResult = false;
        var EventUtils = /** @class */ (function () {
            function EventUtils() {
            }
            EventUtils.isEnter = function (event) {
                var isEnterResult = false;
                if (event !== undefined && event.defaultPrevented) {
                    return false;
                }
                if (event == undefined) {
                    isEnterResult = false;
                }
                else if (event.key !== undefined) {
                    isEnterResult = event.key === 'Enter';
                }
                else if (event.keyCode !== undefined) {
                    isEnterResult = event.keyCode === 13;
                }
                return isEnterResult;
            };
            return EventUtils;
        }());
    };
    return EventUtils;
}());
// instantiate the view
var view = new HTMLTodoListView();
// create the controller with the view
// pass a concrete implementation of the view interface,
// but our controller doesn't know and doesn't care.
// All it cares about is that it gets something that is
// compatible with the interface.
var todoIt = new TodoIt(view);
