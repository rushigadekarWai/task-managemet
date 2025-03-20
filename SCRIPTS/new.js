document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const taskTableBody = document.getElementById("taskTableBody");
    const successAlert = document.getElementById("successAlert"); // For success alert after task creation
    let editingTaskId = null; // To track the task being edited
  
    // Load tasks on index.html page
    if (taskTableBody) {
      loadTasks();
    }
  
    // Load tasks from LocalStorage and display them in the table
    function loadTasks() {
      taskTableBody.innerHTML = ""; // Clear table content first
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
      if (!Array.isArray(tasks)) {
        console.error("Tasks are not in the correct format in LocalStorage");
        return;
      }
  
      tasks.forEach(task => {
        // Ensure task is not null and has a name property
        if (task && task.name) {
          const row = document.createElement("tr");
  
          row.innerHTML = `
            <td>
              <div class="task-details">
                <input type="checkbox" class="task-checkbox me-2" onchange="toggleTaskActions(this)">
                <div>
                  <h6 class="task-name mb-0">${task.name}</h6>
                  <span class="task-description">${task.description}</span>
                </div>
              </div>
            </td>
            <td class="text-center">
              <span class="badge ${getStatusBadgeClass(task.status)}">${task.status}</span>
            </td>
            <td class="text-center">${task.dueDate || "N/A"}</td>
            <td class="text-center">${task.assignedTo || "N/A"}</td>
            <td class="text-center">
              <button class="btn btn-warning btn-sm edit-btn" onclick="editTask(${task.id})" disabled>Edit</button>
              <button class="btn btn-info btn-sm view-btn" onclick="viewTask(${task.id})">View</button>

              <button class="btn btn-danger btn-sm delete-btn" onclick="confirmDeleteTask(${task.id})" disabled>Delete</button>
            </td>
          `;
  
          taskTableBody.appendChild(row);
        }
      });
    }
  
    // Handle form submission in add_task.html
    if (taskForm) {
      taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const task = {
          id: new Date().getTime(), // Unique task ID
          name: document.getElementById("taskName").value,
          description: document.getElementById("taskDescription").value,
          startDate: document.getElementById("taskStartDate").value,
          dueDate: document.getElementById("taskDueDate").value,
          reminder: document.getElementById("taskReminder").value,
          assignedTo: document.getElementById("taskAssignedTo").value,
          priority: document.getElementById("taskPriority").value,
          status: document.getElementById("taskStatus").value,
        };
  
        // Check if name is valid
        if (!task.name || task.name.trim() === "") {
          alert("Task name is required.");
          return;
        }
  
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
  
        localStorage.setItem("tasks", JSON.stringify(tasks));
  
        taskForm.reset();
  
        // Show stylish success alert and redirect after 2 seconds
        successAlert.style.display = "block"; // Show the alert
  
        setTimeout(() => {
          successAlert.style.display = "none"; // Hide the alert
          window.location.href = "index.html";  // Redirect to index.html after 2 seconds
        }, 2000);
      });
    }
  
    // Function to show confirmation dialog before deleting
    window.confirmDeleteTask = function (taskId) {
      const confirmation = confirm("Are you sure you want to delete this task?");
      
      if (confirmation) {
        deleteTask(taskId); // If confirmed, delete the task
      }
    };
  
    // Delete task from LocalStorage
    window.deleteTask = function (taskId) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.filter(task => task.id !== taskId);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      loadTasks();
    };
  
    // Function to return badge classes based on task status
    function getStatusBadgeClass(status) {
      switch (status) {
        case "Open":
          return "bg-success text-white";
        case "In Progress":
          return "bg-warning text-dark";
        case "Completed":
          return "bg-primary text-white";
        default:
          return "bg-secondary text-white";
      }
    }
  
    // Function to edit a task
    window.editTask = function (taskId) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const taskToEdit = tasks.find(task => task.id === taskId);
      if (!taskToEdit) return;
  
      // Populate the edit form with the task's current values
      document.getElementById("editTaskName").value = taskToEdit.name;
      document.getElementById("editTaskDescription").value = taskToEdit.description;
      document.getElementById("editTaskStartDate").value = taskToEdit.startDate;
      document.getElementById("editTaskDueDate").value = taskToEdit.dueDate;
      document.getElementById("editTaskReminder").value = taskToEdit.reminder;
      document.getElementById("editTaskAssignedTo").value = taskToEdit.assignedTo;
      document.getElementById("editTaskPriority").value = taskToEdit.priority;
      document.getElementById("editTaskStatus").value = taskToEdit.status;
  
      editingTaskId = taskToEdit.id;
  
      // Show the modal
      const editModal = new bootstrap.Modal(document.getElementById("editTaskModal"));
      editModal.show();
    };
  
    // Save edited task data
    const saveEditTaskBtn = document.getElementById("saveEditTaskBtn");
    if (saveEditTaskBtn) {
      saveEditTaskBtn.addEventListener("click", function () {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const taskIndex = tasks.findIndex(task => task.id === editingTaskId);
        if (taskIndex === -1) return;
  
        // Get updated values from the form
        const updatedTask = {
          id: editingTaskId,
          name: document.getElementById("editTaskName").value,
          description: document.getElementById("editTaskDescription").value,
          startDate: document.getElementById("editTaskStartDate").value,
          dueDate: document.getElementById("editTaskDueDate").value,
          reminder: document.getElementById("editTaskReminder").value,
          assignedTo: document.getElementById("editTaskAssignedTo").value,
          priority: document.getElementById("editTaskPriority").value,
          status: document.getElementById("editTaskStatus").value,
        };
  
        tasks[taskIndex] = updatedTask;
        localStorage.setItem("tasks", JSON.stringify(tasks));
  
        // Close the modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById("editTaskModal"));
        editModal.hide();
  
        loadTasks(); // Reload tasks to show updated values
      });
    }
  
    // Enable Edit and Delete buttons when checkbox is checked
    window.toggleTaskActions = function (checkbox) {
      const row = checkbox.closest("tr");
      const editBtn = row.querySelector(".edit-btn");
      const deleteBtn = row.querySelector(".delete-btn");
  
      if (checkbox.checked) {
        editBtn.disabled = false;
        deleteBtn.disabled = false;
      } else {
        editBtn.disabled = true;
        deleteBtn.disabled = true;
      }
    };
  
    // Function to view task details
    window.viewTask = function (taskId) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const taskToView = tasks.find(task => task.id === taskId);
      console.log("Viewing task", taskToView);
      // Logic for viewing task details (You can display in a separate modal or section)
    };




    // Function to view task details in the modal
window.viewTask = function (taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskToView = tasks.find(task => task.id === taskId);
    
    if (!taskToView) return;
    
    // Populate the modal with task details
    document.getElementById("viewTaskName").innerText = taskToView.name;
    document.getElementById("viewTaskDescription").innerText = taskToView.description;
    document.getElementById("viewTaskStartDate").innerText = taskToView.startDate || "N/A";
    document.getElementById("viewTaskDueDate").innerText = taskToView.dueDate || "N/A";
    document.getElementById("viewTaskReminder").innerText = taskToView.reminder || "N/A";
    document.getElementById("viewTaskAssignedTo").innerText = taskToView.assignedTo || "N/A";
    document.getElementById("viewTaskPriority").innerText = taskToView.priority || "N/A";
    document.getElementById("viewTaskStatus").innerText = taskToView.status || "N/A";
    
    // Show the modal
    const viewModal = new bootstrap.Modal(document.getElementById("viewTaskModal"));
    viewModal.show();
  };
  
  });
  