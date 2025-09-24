const todoInput = document.getElementById("todoInput");
const todoAddBtn = document.getElementById("todoAddBtn");
const todoListPendingTable = document.querySelector(".todo-list-pending-table");
const todoListCompletedTable = document.querySelector(".todo-list-completed-table");

let todoCurrentInput = "";
const todoTaskList = [];
const todoTaskCompletedList = [];

todoInput.addEventListener("input", function (e) {
  todoCurrentInput = e.target.value;
  console.log(todoCurrentInput);
});

function clearTodoInput() {
  todoInput.value = "";
  todoCurrentInput = "";
}

function renderTodoList(todoTaskList) {
  todoListPendingTable.innerHTML = "";

  if (!todoTaskList || todoTaskList.length === 0) {
    todoListPendingTable.innerHTML = `
                    <div class="empty-state">
                        <h3>No tasks found</h3>
                        <p>Add some tasks to get started!</p>
                    </div>
                `;
    return;
  }

  const todoTableHTML = `
                <table class="task-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${todoTaskList.map((task) => createTodoTaskRow(task)).join("")}
                    </tbody>
                </table>
            `;

  todoListPendingTable.innerHTML = todoTableHTML;
}

function createTodoTaskRow(task) {
  return `
                <tr>
                    <td><strong>#${task.id}</strong></td>
                    <td><strong>${task.title}</strong></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-edit" onclick="editTask(${task.id})">
                                ✏️
                            </button>
                            <button class="btn btn-delete" onclick="showDeleteModal(${task.id})">
                                🗑️
                            </button>
                            <button class="btn btn-complete" onclick="completeTask(${task.id})">
                                ✅
                            </button>
                        </div>
                    </td>
                </tr>
            `;
}

function addTodoTask() {
  if (todoCurrentInput !== "") {
    const newTodoTask = { id: todoTaskList.length + 1, title: todoCurrentInput, completed: false };
    todoTaskList.push(newTodoTask);
    renderTodoList(todoTaskList);
    console.log("Task added:", todoCurrentInput);
    console.log("Current task list:", todoTaskList);
    clearTodoInput();
  } else {
    alert("Please enter a valid task.");
  }
}

todoAddBtn.addEventListener("click", function () {
  addTodoTask();
});

function isValidUser(user) {
  if (!isNaN(user) && trimmed !== "") return false;

  const isAlphanumericOnly = /^[a-zA-Z0-9]+$/.test(user);
  if (!isAlphanumericOnly) return false;

  return true;
}

function login() {
  const user = prompt("Insert a valid user name");

  if (!isValidUser(user)) {
    alert("Valid user name is required");
    throw new Error("Valid user name is required");
  }

  const h1 = document.querySelector("h1");
  h1.innerText = `${user}'s TODO list`;

  console.log("User logged in:", user);
}

login();
