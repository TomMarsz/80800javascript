const h1 = document.querySelector("h1");
const todoInput = document.getElementById("todoInput");
const todoAddBtn = document.getElementById("todoAddBtn");
const todoListPendingTable = document.querySelector(".todo-list-pending-table");
const todoListCompletedTable = document.querySelector(".todo-list-completed-table");

let todoTaskLocalStorage = JSON.parse(localStorage.getItem("todoTasks")) || [];
let todoTaskCompletedLocalStorage = JSON.parse(localStorage.getItem("todoTasksCompleted")) || [];

let todoCurrentInput = "";
const todoTaskList = todoTaskLocalStorage;
const todoTaskCompletedList = todoTaskCompletedLocalStorage;

todoInput.addEventListener("input", function (e) {
  todoCurrentInput = e.target.value;
  console.log(todoCurrentInput);
});

todoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTodoTask();
  }
});

todoAddBtn.addEventListener("click", function () {
  addTodoTask();
});

function clearTodoInput() {
  todoInput.value = "";
  todoCurrentInput = "";
}

function saveTodoTasks() {
  try {
    localStorage.setItem("todoTasks", JSON.stringify(todoTaskList));
    console.log("Tasks saved to localStorage:", todoTaskList);
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
}

function saveCompletedTasks() {
  try {
    localStorage.setItem("todoTasksCompleted", JSON.stringify(todoTaskCompletedList));
    console.log("Completed tasks saved to localStorage:", todoTaskCompletedList);
  } catch (error) {
    console.error("Error saving completed tasks to localStorage:", error);
  }
}

function addTodoTask() {
  if (todoCurrentInput.trim() !== "") {
    const newId = todoTaskList.length > 0 ? Math.max(...todoTaskList.map((task) => task.id)) + 1 : 1;

    const newTodoTask = {
      id: newId,
      title: todoCurrentInput.trim(),
      completed: false,
    };

    todoTaskList.push(newTodoTask);

    saveTodoTasks();

    renderTodoList(todoTaskList);
    renderCompletedList(todoTaskCompletedList);

    console.log("Task added:", todoCurrentInput);
    console.log("Current task list:", todoTaskList);

    clearTodoInput();
  } else {
    alert("Please enter a valid task.");
  }
}

function renderTodoList(todoTaskList) {
  todoListPendingTable.innerHTML = "";

  if (!todoTaskList || todoTaskList.length === 0) {
    todoListPendingTable.innerHTML = `
      <div class="empty-state">
        <h3>No pending tasks</h3>
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
          <th></th>
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
      <td><strong>${task.id}</strong></td>
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

function renderCompletedList(completedTaskList) {
  todoListCompletedTable.innerHTML = "";

  if (!completedTaskList || completedTaskList.length === 0) {
    todoListCompletedTable.innerHTML = `
      <div class="empty-state">
        <h3>No completed tasks</h3>
        <p>Complete some tasks to see them here!</p>
      </div>
    `;
    return;
  }

  const completedTableHTML = `
    <table class="task-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${completedTaskList.map((task) => createCompletedTaskRow(task)).join("")}
      </tbody>
    </table>
  `;

  todoListCompletedTable.innerHTML = completedTableHTML;
}

function createCompletedTaskRow(task) {
  return `
    <tr class="completed-task">
      <td><strong>${task.id}</strong></td>
      <td><strong>${task.title}</strong></td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-restore" onclick="restoreTask(${task.id})">
            ↩️
          </button>
          <button class="btn btn-delete" onclick="deleteCompletedTask(${task.id})">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `;
}

function completeTask(taskId) {
  const taskIndex = todoTaskList.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    const completedTask = todoTaskList[taskIndex];
    completedTask.completed = true;

    todoTaskCompletedList.push(completedTask);

    todoTaskList.splice(taskIndex, 1);

    todoTaskList.forEach((task, index) => {
      task.id = index + 1;
    });

    todoTaskCompletedList.forEach((task, index) => {
      task.id = index + 1;
    });

    saveTodoTasks();
    saveCompletedTasks();

    renderTodoList(todoTaskList);
    renderCompletedList(todoTaskCompletedList);

    console.log("Task completed:", completedTask);
    console.log("Pending tasks IDs reassigned:", todoTaskList);
    console.log("Completed tasks IDs reassigned:", todoTaskCompletedList);
  }
}

function restoreTask(taskId) {
  const taskIndex = todoTaskCompletedList.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    const restoredTask = todoTaskCompletedList[taskIndex];
    restoredTask.completed = false;

    const newId = todoTaskList.length > 0 ? Math.max(...todoTaskList.map((task) => task.id)) + 1 : 1;
    restoredTask.id = newId;

    todoTaskList.push(restoredTask);

    todoTaskCompletedList.splice(taskIndex, 1);

    saveTodoTasks();
    saveCompletedTasks();

    renderTodoList(todoTaskList);
    renderCompletedList(todoTaskCompletedList);

    console.log("Task restored with new ID:", restoredTask);
  }
}

function editTask(taskId) {
  const task = todoTaskList.find((task) => task.id === taskId);

  if (task) {
    const newTitle = prompt("Edit task:", task.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      task.title = newTitle.trim();

      saveTodoTasks();

      renderTodoList(todoTaskList);
      console.log("Task edited:", task);
    }
  }
}

function showDeleteModal(taskId) {
  const task = todoTaskList.find((task) => task.id === taskId);

  if (task && confirm(`Are you sure you want to delete "${task.title}"?`)) {
    deleteTask(taskId);
  }
}

function deleteTask(taskId) {
  const taskIndex = todoTaskList.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    const deletedTask = todoTaskList[taskIndex];
    todoTaskList.splice(taskIndex, 1);

    todoTaskList.forEach((task, index) => {
      task.id = index + 1;
    });

    saveTodoTasks();

    renderTodoList(todoTaskList);
    console.log("Task deleted:", deletedTask);
    console.log("IDs reassigned. Current tasks:", todoTaskList);
  }
}

function deleteCompletedTask(taskId) {
  const taskIndex = todoTaskCompletedList.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    const deletedTask = todoTaskCompletedList[taskIndex];
    todoTaskCompletedList.splice(taskIndex, 1);

    saveCompletedTasks();

    renderCompletedList(todoTaskCompletedList);
    console.log("Completed task deleted:", deletedTask);
  }
}

function isValidUser(userName) {
  const trimmedName = userName.trim();
  if (!userName || !trimmedName) return false;
  if (trimmedName.length < 3) return false;
  if (!isNaN(trimmedName) && !isNaN(parseFloat(trimmedName))) return false;
  const isValidChars = /^[\p{L}\p{N}]+$/u.test(trimmedName);
  if (!isValidChars) return false;
  return true;
}

function login() {
  let userName = localStorage.getItem("userName");
  if (!userName) {
    do {
      userName = prompt("Insert a valid user name: \n- At least 3 characters long\n- Only letters and numbers\n- Cannot be only numbers");
      if (userName === null) {
        console.log("Login cancelled by user");
        return;
      }
      if (!isValidUser(userName)) {
        alert("Invalid username! Please try again.");
      }
    } while (!isValidUser(userName));
    localStorage.setItem("userName", userName);
  }
  h1.innerText = `${userName} TODO list`;
}

function initializeTodoApp() {
  login();
  renderTodoList(todoTaskList);
  renderCompletedList(todoTaskCompletedList);
  console.log("Todo app initialized");
  console.log("Pending tasks:", todoTaskList);
  console.log("Completed tasks:", todoTaskCompletedList);
}

document.addEventListener("DOMContentLoaded", function () {
  initializeTodoApp();
});
