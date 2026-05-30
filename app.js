const STORAGE_KEY = "dataEngineeringLearningTasks";
const STATUS_OPTIONS = ["Not Started", "In Progress", "Done"];

const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const totalCount = document.querySelector("#total-count");
const progressCount = document.querySelector("#progress-count");
const doneCount = document.querySelector("#done-count");

let tasks = loadTasks();

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    return [];
  }

  try {
    return JSON.parse(savedTasks);
  } catch (error) {
    console.warn("Could not load saved learning tasks.", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(formData) {
  return {
    id: createTaskId(),
    topic: formData.get("topic").trim(),
    category: formData.get("category"),
    status: formData.get("status"),
    notes: formData.get("notes").trim(),
    createdAt: new Date().toISOString()
  };
}

function createTaskId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addTask(event) {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const task = createTask(formData);

  if (!task.topic) {
    return;
  }

  tasks.unshift(task);
  saveTasks();
  render();
  taskForm.reset();
}

function updateTaskStatus(taskId, status) {
  tasks = tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return { ...task, status };
  });

  saveTasks();
  render();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  render();
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoDate));
}

function renderStatusOptions(currentStatus) {
  return STATUS_OPTIONS.map((status) => {
    const selected = status === currentStatus ? "selected" : "";
    return `<option value="${status}" ${selected}>${status}</option>`;
  }).join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTask(task) {
  const listItem = document.createElement("li");
  listItem.className = "task-card";
  const topic = escapeHtml(task.topic);
  const category = escapeHtml(task.category);
  const status = escapeHtml(task.status);
  const notes = escapeHtml(task.notes || "No notes yet.");

  listItem.innerHTML = `
    <div class="task-card-header">
      <div>
        <h3 class="task-topic">${topic}</h3>
        <div class="task-meta">
          <span>${category}</span>
          <span>Created ${formatDate(task.createdAt)}</span>
        </div>
      </div>
      <span class="status-pill">${status}</span>
    </div>
    <p class="task-notes">${notes}</p>
    <div class="task-actions">
      <label>
        <span class="visually-hidden">Change status for ${topic}</span>
        <select data-action="status" data-id="${task.id}">
          ${renderStatusOptions(task.status)}
        </select>
      </label>
      <button class="delete-button" type="button" data-action="delete" data-id="${task.id}">
        Delete
      </button>
    </div>
  `;

  return listItem;
}

function renderTasks() {
  taskList.innerHTML = "";
  emptyState.classList.toggle("is-hidden", tasks.length > 0);

  tasks.forEach((task) => {
    taskList.appendChild(renderTask(task));
  });
}

function renderSummary() {
  totalCount.textContent = tasks.length;
  progressCount.textContent = tasks.filter((task) => task.status === "In Progress").length;
  doneCount.textContent = tasks.filter((task) => task.status === "Done").length;
}

function render() {
  renderSummary();
  renderTasks();
}

function handleTaskListClick(event) {
  const action = event.target.dataset.action;
  const taskId = event.target.dataset.id;

  if (action === "delete") {
    deleteTask(taskId);
  }
}

function handleTaskListChange(event) {
  const action = event.target.dataset.action;
  const taskId = event.target.dataset.id;

  if (action === "status") {
    updateTaskStatus(taskId, event.target.value);
  }
}

taskForm.addEventListener("submit", addTask);
taskList.addEventListener("click", handleTaskListClick);
taskList.addEventListener("change", handleTaskListChange);

render();
