document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('newTaskForm');
    const taskList = document.getElementById('taskList');
    let taskIdInput = '' 
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const dueDateInput = document.getElementById('dueDate');
  
    const apiUrl = 'http://localhost:4040/tasks';
  
    // Fetch all tasks
    const fetchTasks = async () => {
      const response = await fetch(apiUrl);
      const tasks = await response.json();
      taskList.innerHTML = tasks.map(task => `
        <li>
          <div class="task-item"><strong>${task.title}</strong> (Due: ${new Date(task.dueDate).toLocaleDateString()})</div>
          <p>${task.description}</p>
          <div class = "button-wrapper">
            <button class="edit-button" onclick="editTask('${task._id}')">Edit</button>
            <button class="delete-button" onclick="deleteTask('${task._id}')">Delete</button>
          </div>
        </li>
      `).join('');
    };
  
    // Create or update task
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const task = {
        title: titleInput.value,
        description: descriptionInput.value,
        dueDate: dueDateInput.value,
      };
  
      let method = 'POST';
      let url = apiUrl;
      if (taskIdInput && taskIdInput.length > 0) {
        method = 'PUT';
        url = `${apiUrl}/${taskIdInput}`;
      }
  
      const data = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      console.log("data submit response: ", data);
      taskIdInput = '';
      taskForm.reset();
      fetchTasks();
    });
  
    // Edit task
    window.editTask = async (id) => {
      const response = await fetch(`${apiUrl}/${id}`);
      const task = await response.json();
      taskIdInput = task._id;
      titleInput.value = task.title;
      descriptionInput.value = task.description;
      dueDateInput.value = task.dueDate.split('T')[0];
    };
  
    // Delete task
    window.deleteTask = async (id) => {
      await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      fetchTasks();
    };
  
    fetchTasks();
  });
  