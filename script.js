const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false; // Flag to check if a task is being edited

let todos = JSON.parse(localStorage.getItem("todo-list")); // Retrieve the existing tasks from local storage

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active"); // Remove active class from the previous filter
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let li = "";
    if(todos) {
        todos.forEach((todo, id) => {
            let isCompleted = todo.status == "completed" ? "checked" : ""; // Check if the task is completed
            if (filter == todo.status || filter == "all") {
                li += `<li class="task">
                  <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted} />
                    <p class= "${isCompleted}">${todo.name}</p>
                  </label>
                  <div class="settings">
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                  </div>
                </li>`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>You don't have any tasks here</span>`; // Display a message if there are no tasks
}
showTodo("all"); // Call the function to display the tasks when the page loads

function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show"); // Show the task menu
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show"); // Hide the task menu when clicking outside
        }
    });
}

function deleteTask(deleteId) { 
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Update the task list in local storage
    showTodo("all"); // Refresh the task list display
}

function editTask(taskId, taskName) {
    editId = taskId; // Store the ID of the task being edited
    isEditedTask = true; // Set the flag to indicate editing mode
    taskInput.value = taskName; // Set the input field to the task name for editing
}

clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length); // Clear all tasks from the array
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Update the task list in local storage
    showTodo("all"); // Refresh the task list display
});

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed"; // Update the task status in the array
    } else { 
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending"; // Update the task status in the array
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditedTask) {
            if (!todos) {
                todos = [];
            }
            let todoInfo = { name: userTask, status: "pending" };
            todos.push(todoInfo); // Add the new task to the list
        } else {
            isEditedTask = false; // Reset the flag
            if (editId !== undefined && todos[editId]) {
                todos[editId].name = userTask; // Update the task name
            }
        }
        taskInput.value = ""; // Clear the input field after adding or editing the task
        localStorage.setItem("todo-list", JSON.stringify(todos)); // Save the updated list to local storage
        showTodo("all");
    }
});