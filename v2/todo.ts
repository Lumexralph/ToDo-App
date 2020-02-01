// Domain/Model layer
class ToodoItem {
    /**
     * If you implement the TodoItem class as we propose, instances of the class
     * will be immutable: Once an instance has been created, you cannot modify it,
     * whether from the inside or from the outside.
     * This is guaranteed because the fields are private and only expose a getter
     * that protects the field from external modifications.
     * In addition, the fields are also read-only, which prevents internal modifications as well.
     * This is a practice that we heavily recommend.
     */
    private readonly _creationTimestamp: number;
    private readonly _identifier: string;

    constructor(private _description: string, identifier?: string) {
        this._creationTimestamp = new Date().getTime();

        if (identifier) {
            this._identifier = identifier;
        } else {
            // for any real world project use
            //  UUIDs instead: https://www.npmjs.com/package/uuid
            this._identifier = Math.random().toString(36).substr(3, 10);
        }
    }

    get creationTimestamp(): number {
        return this._creationTimestamp;
    }

    get identifier(): string {
        return this._identifier;
    }

    get description(): string {
        return this._description;
    }
}


class TodoList {
    private _todoList: ReadonlyArray<ToodoItem> = [];

    constructor(todoList?: ToodoItem[]) {
        // let's ensure we have a valid array
        if (Array.isArray(todoList) && todoList.length) {
            this._todoList = this._todoList.concat(todoList);
        }
    }

    get todoList(): ReadonlyArray<ToodoItem> {
        return this._todoList;
    }

    addTodo(todoItem: ToodoItem): void {
        if (todoItem) {
            // the value is "truthy":
            // not null, not undefined, not NaN, not an empty string,
            // not 0, not false
            // favor immutability to use a more functional approach.
            this._todoList = this._todoList.concat(todoItem);
        }
    }

    removeTodo(itemId: string): void {
        if (itemId) {
            // favor immutability to use a more functional approach.
            this._todoList = this._todoList.filter(item => {
                if (item.identifier == itemId) {
                    return false; // drop the item
                }
                return true; // leave the item
            });
        }
    }
}

// View layer - Interface user interacts with
interface TodoListView {
    render(todoList: ReadonlyArray<ToodoItem>): void;
    getInput(): ToodoItem;
    getFilter(): string;
    clearInput(): void;
    filter(): void;
}

// HTML-based implementation of the interface
class HTMLTodoListView implements TodoListView {
    private readonly todoInput: HTMLInputElement;
    private readonly todoListDiv: HTMLDivElement;
    private readonly todoListFilter: HTMLInputElement;

    constructor() {
        this.todoInput = document.getElementById("todoInput") as HTMLInputElement;
        this.todoListDiv = document.getElementById("todoListContainer") as HTMLDivElement;
        this.todoListFilter = document.getElementById("todoFilter") as HTMLInputElement;

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

    clearInput(): void {
        this.todoInput.value = "";
    }

    getFilter(): string {
        return this.todoListFilter.value.toUpperCase();
    }

    getInput(): ToodoItem {
        const todoInputValue: string = this.todoInput.value.trim();
        const retVal: ToodoItem = new ToodoItem(todoInputValue);

        return retVal;
    }

    filter(): void {
        console.log("Filtering the rendered list..");
    }

    render(todoList: ReadonlyArray<ToodoItem>): void {
        console.log("Updating the rendered todo list");
        this.todoListDiv.innerHTML = "";
        this.todoListDiv.textContent = "";  // for Edge

        const ul: HTMLUListElement = document.createElement('ul') as HTMLUListElement;
        ul.setAttribute("id", "todoList");
        this.todoListDiv.appendChild(ul);

        // build the list of tasks/todo
        todoList.forEach(item => {
            const li = document.createElement("li");
            li.setAttribute("class", "todo-list-item");
            li.innerHTML = `<a href="#" onclick='todoIt.removeTodo("${item.identifier}")'>${item.description}</a>`;
            ul.appendChild(li);
        });
    }
}
