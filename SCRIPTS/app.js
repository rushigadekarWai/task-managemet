document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

const taskForm = document.getElementById("taskForm");
const taskOwner = document.getElementById("taskOwner");
const taskName = document.getElementById("taskName");
const taskDescription = document.getElementById("taskDescription");
const taskStartDate = document.getElementById("taskStartDate");
const taskDueDate = document.getElementById("taskDueDate");
const taskReminder = document.getElementById("taskReminder");
const taskAssignedTo = document.getElementById("taskAssignedTo");
const taskPriority = document.getElementById("taskPriority");
const taskStatus = document.getElementById("taskStatus");
const taskCompletedBy = document.getElementById("taskCompletedBy");
const taskImage = document.getElementById("taskImage");
const imagePreview = document.getElementById("imagePreview");
const taskTableBody = document.getElementById("taskTableBody");

taskImage.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (
    !taskOwner.value.trim() ||
    !taskName.value.trim() ||
    !taskDescription.value.trim() ||
    !taskStartDate.value ||
    !taskDueDate.value ||
    !taskPriority.value ||
    !taskStatus.value
  ) {
    alert("Please fill in all required fields before saving.");
    return;
  }

  const task = {
    owner: taskOwner.value,
    name: taskName.value,
    description: taskDescription.value,
    startDate: taskStartDate.value,
    dueDate: taskDueDate.value,
    reminder: taskReminder.value,
    assignedTo: taskAssignedTo.value,
    priority: taskPriority.value,
    status: taskStatus.value,
    completedBy: taskCompletedBy.value,
    image: imagePreview.src !== "#" ? imagePreview.src : "", // Save Base64 image if uploaded
  };

  saveTask(task);
  taskForm.reset();
  imagePreview.style.display = "none"; // Hide image preview after submission
});

const showMessage = (message, type) => {
  const taskMessage = document.getElementById("taskMessage");
  taskMessage.textContent = message;
  taskMessage.className = `alert alert-${type}`; // Bootstrap alert styling
  taskMessage.style.display = "block";

  setTimeout(() => {
    taskMessage.style.display = "none"; // Hide after 3 seconds
  }, 3000);
};

const saveTask = (task) => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
  showMessage("Task added successfully!", "success");
};

const loadTasks = () => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskTableBody.innerHTML = "";

  tasks.forEach((task, index) => {
    let taskRow = `<tr>
        <td>
          <div class="task-details">
            <input type="checkbox" class="task-checkbox me-3" data-index="${index}">
            <img src="../ASSETS/profile.png" alt="Profile" class="task-profile-img">
            <div>
              <h6 class="task-name mb-0">${task.name}</h6>
              <span class="task-assignee">${task.owner}</span>
            </div>
            <div class="task-time">
              <span>${task.startDate}</span>
            </div>
          </div>
        </td>
        <td class="text-center">
          <img src="../ASSETS/profile.png" alt="Assigned to ${task.assignedTo}" class="rounded-circle">
        </td>
        <td class="text-center">
          <!-- Action buttons initially hidden -->
          <div class="task-actions" style="display: none;">
            <button class="btn btn-warning btn-sm edit-btn" onclick="editTask(${index})">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" onclick="deleteTask(${index})">Delete</button>
          </div>
        </td>
      </tr>`;

    taskTableBody.innerHTML += taskRow;
  });

  attachCheckboxEvents();
};


// Attach events to checkboxes to show/hide actions
const attachCheckboxEvents = () => {
  document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const taskRow = this.closest("tr"); // Get the closest row
      const actionsCell = taskRow.querySelector(".task-actions");

      if (this.checked) {
        actionsCell.style.display = "flex"; // Show buttons
      } else {
        actionsCell.style.display = "none"; // Hide buttons
      }
    });
  });
};

const editTask = (index) => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let task = tasks[index];

  taskOwner.value = task.owner;
  taskName.value = task.name;
  taskDescription.value = task.description;
  taskStartDate.value = task.startDate;
  taskDueDate.value = task.dueDate;
  taskReminder.value = task.reminder;
  taskAssignedTo.value = task.assignedTo;
  taskPriority.value = task.priority;
  taskStatus.value = task.status;
  taskCompletedBy.value = task.completedBy;

  if (task.image) {
    imagePreview.src = task.image;
    imagePreview.style.display = "block";
  } else {
    imagePreview.style.display = "none";
  }

  deleteTask(index); // Remove old task and let user save updated one
};

const deleteTask = (index) => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
  showMessage("Task deleted successfully!", "danger");
};

console.log("Tasks in localStorage:", tasks);
