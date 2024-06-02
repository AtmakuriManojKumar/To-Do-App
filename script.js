document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("new-task");
    const taskDesc = document.getElementById("task-desc");
    const taskPriority = document.getElementById("task-priority");
    const taskDate = document.getElementById("task-date");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const searchTask = document.getElementById("search-task");
    const filterPriority = document.getElementById("filter-priority");
    const filterStatus = document.getElementById("filter-status");

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = "";
        const filterText = searchTask.value.toLowerCase();
        const filterPrio = filterPriority.value;
        const filterStat = filterStatus.value;

        const filteredTasks = tasks.filter(task => {
            return (
                (filterPrio === "All" || task.priority === filterPrio) &&
                (filterStat === "All" || (filterStat === "Pending" && !task.completed) || (filterStat === "Completed" && task.completed)) &&
                (task.text.toLowerCase().includes(filterText) || task.desc.toLowerCase().includes(filterText))
            );
        });

        filteredTasks.sort((a, b) => {
            if (a.priority === b.priority) return new Date(a.date) - new Date(b.date);
            if (a.priority === "High") return -1;
            if (a.priority === "Medium" && b.priority !== "High") return -1;
            return 1;
        });

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement("li");
            const dueDate = new Date(task.date);
            const today = new Date();
            taskItem.className = `${task.completed ? "completed" : ""} ${dueDate < today && !task.completed ? "overdue" : ""}`;
            taskItem.innerHTML = `
                <div class="task-details">
                    <span><strong>${task.text}</strong> - ${task.desc}</span>
                    <small>Priority: ${task.priority} | Due: ${task.date}</small>
                </div>
                <div class="task-buttons">
                    <button class="toggle-btn">${task.completed ? "Uncomplete" : "Complete"}</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            taskList.appendChild(taskItem);

            // Complete / Uncomplete Task
            taskItem.querySelector(".toggle-btn").addEventListener("click", () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            // Edit Task
            taskItem.querySelector(".edit-btn").addEventListener("click", () => {
                const newText = prompt("Edit your task:", task.text);
                const newDesc = prompt("Edit your description:", task.desc);
                const newPrio = prompt("Edit your priority (High, Medium, Low):", task.priority);
                const newDate = prompt("Edit your due date:", task.date);
                if (newText !== null && newDesc !== null && newPrio !== null && newDate !== null) {
                    tasks[index].text = newText;
                    tasks[index].desc = newDesc;
                    tasks[index].priority = newPrio;
                    tasks[index].date = newDate;
                    saveTasks();
                    renderTasks();
                }
            });

            // Delete Task
            taskItem.querySelector(".delete-btn").addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });
        });
    };

    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        const taskDescription = taskDesc.value.trim();
        const taskPriorityValue = taskPriority.value;
        const taskDueDate = taskDate.value;
        if (taskText && taskDueDate) {
            tasks.push({ text: taskText, desc: taskDescription, priority: taskPriorityValue, date: taskDueDate, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = "";
            taskDesc.value = "";
            taskPriority.value = "Medium";
            taskDate.value = "";
        }
    });

    searchTask.addEventListener("input", renderTasks);
    filterPriority.addEventListener("change", renderTasks);
    filterStatus.addEventListener("change", renderTasks);

    // Initial render
    renderTasks();
});
