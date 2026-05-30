const STORAGE_KEY = "dataEngineeringLearningTasks";
const STATUS_OPTIONS = ["Not Started", "In Progress", "Done"];

const taskForm = document.querySelector("#task-form");
const formHeading = document.querySelector("#form-heading");
const submitTaskButton = document.querySelector("#submit-task-button");
const cancelEditButton = document.querySelector("#cancel-edit-button");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const clearTasksButton = document.querySelector("#clear-tasks-button");
const statusFilter = document.querySelector("#status-filter");
const categoryFilter = document.querySelector("#category-filter");
const totalCount = document.querySelector("#total-count");
const progressCount = document.querySelector("#progress-count");
const doneCount = document.querySelector("#done-count");

let tasks = loadTasks();
let currentStatusFilter = "All";
let currentCategoryFilter = "All";
let editingTaskId = null;

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
  const topic = formData.get("topic").trim();

  if (!topic) {
    return;
  }

  if (editingTaskId) {
    updateTaskFromForm(editingTaskId, formData);
    resetFormMode();
  } else {
    tasks.unshift(createTask(formData));
  }

  saveTasks();
  render();
  taskForm.reset();
}

function updateTaskFromForm(taskId, formData) {
  tasks = tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return {
      ...task,
      topic: formData.get("topic").trim(),
      category: formData.get("category"),
      status: formData.get("status"),
      notes: formData.get("notes").trim()
    };
  });
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

  if (editingTaskId === taskId) {
    resetFormMode();
    taskForm.reset();
  }

  saveTasks();
  render();
}

function clearAllTasks() {
  const confirmed = confirm("Clear all learning tasks? This cannot be undone.");

  if (!confirmed) {
    return;
  }

  tasks = [];
  editingTaskId = null;
  localStorage.removeItem(STORAGE_KEY);
  resetFormMode();
  taskForm.reset();
  render();
}

function startEditingTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  editingTaskId = taskId;
  taskForm.elements.topic.value = task.topic;
  taskForm.elements.category.value = task.category;
  taskForm.elements.status.value = task.status;
  taskForm.elements.notes.value = task.notes;
  formHeading.textContent = "Edit Learning Task";
  submitTaskButton.textContent = "Update Task";
  cancelEditButton.hidden = false;
  taskForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetFormMode() {
  editingTaskId = null;
  formHeading.textContent = "Add Learning Task";
  submitTaskButton.textContent = "Add Task";
  cancelEditButton.hidden = true;
}

function getVisibleTasks() {
  return tasks.filter((task) => {
    const matchesStatus = currentStatusFilter === "All" || task.status === currentStatusFilter;
    const matchesCategory = currentCategoryFilter === "All" || task.category === currentCategoryFilter;

    return matchesStatus && matchesCategory;
  });
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
      <button class="edit-button" type="button" data-action="edit" data-id="${task.id}">
        Edit
      </button>
    </div>
  `;

  return listItem;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();

  taskList.innerHTML = "";
  emptyState.classList.toggle("is-hidden", visibleTasks.length > 0);
  emptyState.textContent = tasks.length === 0
    ? "No tasks yet. Add your first learning task to begin."
    : "No tasks match the selected filters.";

  visibleTasks.forEach((task) => {
    taskList.appendChild(renderTask(task));
  });
}

function renderSummary() {
  totalCount.textContent = tasks.length;
  progressCount.textContent = tasks.filter((task) => task.status === "In Progress").length;
  doneCount.textContent = tasks.filter((task) => task.status === "Done").length;
  clearTasksButton.disabled = tasks.length === 0;
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

  if (action === "edit") {
    startEditingTask(taskId);
  }
}

function handleTaskListChange(event) {
  const action = event.target.dataset.action;
  const taskId = event.target.dataset.id;

  if (action === "status") {
    updateTaskStatus(taskId, event.target.value);
  }
}

function handleStatusFilterChange(event) {
  currentStatusFilter = event.target.value;
  renderTasks();
}

function handleCategoryFilterChange(event) {
  currentCategoryFilter = event.target.value;
  renderTasks();
}

taskForm.addEventListener("submit", addTask);
cancelEditButton.addEventListener("click", () => {
  resetFormMode();
  taskForm.reset();
});
clearTasksButton.addEventListener("click", clearAllTasks);
statusFilter.addEventListener("change", handleStatusFilterChange);
categoryFilter.addEventListener("change", handleCategoryFilterChange);
taskList.addEventListener("click", handleTaskListClick);
taskList.addEventListener("change", handleTaskListChange);

render();
