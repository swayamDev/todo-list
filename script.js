document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const todoInput = document.querySelector(".todo-input");
  const addButton = document.querySelector(".add-button");
  const todoList = document.querySelector(".todo-list");
  const filterButtons = document.querySelectorAll(".filter");
  const tasksLeftSpan = document.querySelector(".tasks-left");

  // Current filter state
  let currentFilter = "all";

  // Todo array
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Initial render
  renderTodos();
  updateTasksLeft();

  // Event Listeners
  addButton.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update filter buttons UI
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update current filter
      currentFilter = button.getAttribute("data-filter");

      // Re-render todos with filter
      renderTodos();
    });
  });

  // Functions
  function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText) {
      // Create new todo object
      const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
      };

      // Add to todos array
      todos.push(newTodo);

      // Save to local storage
      saveToLocalStorage();

      // Clear input
      todoInput.value = "";

      // Render todos & update stats
      renderTodos();
      updateTasksLeft();

      // Focus input for next entry
      todoInput.focus();
    }
  }

  function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveToLocalStorage();
    renderTodos();
    updateTasksLeft();
  }

  function toggleComplete(id) {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    saveToLocalStorage();
    renderTodos();
    updateTasksLeft();
  }

  function renderTodos() {
    // Clear current list
    todoList.innerHTML = "";

    // Filter todos based on current filter
    const filteredTodos = todos.filter((todo) => {
      if (currentFilter === "active") {
        return !todo.completed;
      } else if (currentFilter === "completed") {
        return todo.completed;
      }
      return true; // 'all' filter
    });

    // Check if list is empty
    if (filteredTodos.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "empty-list";
      emptyMessage.textContent =
        currentFilter === "all"
          ? "Your todo list is empty! Add a task to get started."
          : `No ${currentFilter} tasks found.`;
      todoList.appendChild(emptyMessage);
      return;
    }

    // Create elements for todos
    filteredTodos.forEach((todo) => {
      // Create todo item
      const todoItem = document.createElement("li");
      todoItem.className = `todo-item ${todo.completed ? "completed" : ""}`;

      // Create checkbox
      const checkbox = document.createElement("label");
      checkbox.className = "checkbox";

      const checkboxInput = document.createElement("input");
      checkboxInput.type = "checkbox";
      checkboxInput.checked = todo.completed;
      checkboxInput.addEventListener("change", () => toggleComplete(todo.id));

      const checkmark = document.createElement("span");
      checkmark.className = "checkmark";

      checkbox.appendChild(checkboxInput);
      checkbox.appendChild(checkmark);

      // Create todo text
      const todoText = document.createElement("span");
      todoText.className = "todo-text";
      todoText.textContent = todo.text;

      // Create delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = "×";
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

      // Append elements to todo item
      todoItem.appendChild(checkbox);
      todoItem.appendChild(todoText);
      todoItem.appendChild(deleteBtn);

      // Append todo item to list
      todoList.appendChild(todoItem);
    });
  }

  function updateTasksLeft() {
    const activeTasks = todos.filter((todo) => !todo.completed).length;
    tasksLeftSpan.textContent = `${activeTasks} task${
      activeTasks !== 1 ? "s" : ""
    } left`;
  }

  function saveToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
});
