const h1 = document.querySelector("h1");
const todoInput = document.getElementById("todoInput");
const todoAddBtn = document.getElementById("todoAddBtn");
const todoListPendingTable = document.querySelector(".todo-list-pending-table");
const todoListCompletedTable = document.querySelector(".todo-list-completed-table");

let todoTaskLocalStorage = JSON.parse(localStorage.getItem("todoTasks")) || [];
let todoTaskCompletedLocalStorage = JSON.parse(localStorage.getItem("todoTasksCompleted")) || [];

const todoTaskList = todoTaskLocalStorage;
const todoTaskCompletedList = todoTaskCompletedLocalStorage;

// Event Listeners
todoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTodoTask();
  }
});

todoAddBtn.addEventListener("click", function () {
  addTodoTask();
});

// Utility Functions
function clearTodoInput() {
  todoInput.value = "";
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

// Función reutilizable para reasignar IDs
function reassignIds(taskList) {
  taskList.forEach((task, index) => {
    task.id = index + 1;
  });
}

// Función reutilizable para renderizar tablas
function renderTaskTable(container, taskList, emptyMessage, createRowFunction) {
  container.innerHTML = "";

  if (!taskList || taskList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>${emptyMessage.title}</h3>
        <p>${emptyMessage.description}</p>
      </div>
    `;
    return;
  }

  const tableHTML = `
    <table class="task-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${taskList.map(createRowFunction).join("")}
      </tbody>
    </table>
  `;

  container.innerHTML = tableHTML;
}

// CRUD Operations
function addTodoTask() {
  const taskTitle = todoInput.value.trim();
  
  if (taskTitle === "") {
    alert("Please enter a valid task.");
    return;
  }

  const newId = todoTaskList.length > 0 ? Math.max(...todoTaskList.map((task) => task.id)) + 1 : 1;

  const newTodoTask = {
    id: newId,
    title: taskTitle,
    completed: false,
  };

  todoTaskList.push(newTodoTask);
  saveTodoTasks();
  renderTodoList(todoTaskList);
  renderCompletedList(todoTaskCompletedList);

  console.log("Task added:", taskTitle);
  console.log("Current task list:", todoTaskList);

  clearTodoInput();
}

function renderTodoList(todoTaskList) {
  renderTaskTable(
    todoListPendingTable,
    todoTaskList,
    { title: "No pending tasks", description: "Add some tasks to get started!" },
    createTodoTaskRow
  );
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
          <button class="btn btn-delete" onclick="deleteTaskWithConfirm(${task.id}, false)">
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
  renderTaskTable(
    todoListCompletedTable,
    completedTaskList,
    { title: "No completed tasks", description: "Complete some tasks to see them here!" },
    createCompletedTaskRow
  );
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
          <button class="btn btn-delete" onclick="deleteTaskWithConfirm(${task.id}, true)">
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

    reassignIds(todoTaskList);
    reassignIds(todoTaskCompletedList);

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

// Función combinada para confirmar y borrar
function deleteTaskWithConfirm(taskId, isCompleted) {
  const taskList = isCompleted ? todoTaskCompletedList : todoTaskList;
  const task = taskList.find((task) => task.id === taskId);

  if (!task) return;

  if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
    const taskIndex = taskList.findIndex((task) => task.id === taskId);
    
    if (taskIndex !== -1) {
      const deletedTask = taskList[taskIndex];
      taskList.splice(taskIndex, 1);

      if (!isCompleted) {
        reassignIds(todoTaskList);
        saveTodoTasks();
        renderTodoList(todoTaskList);
        console.log("IDs reassigned. Current tasks:", todoTaskList);
      } else {
        saveCompletedTasks();
        renderCompletedList(todoTaskCompletedList);
      }

      console.log("Task deleted:", deletedTask);
    }
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