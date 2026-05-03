document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const optimizeBtn = document.getElementById('optimize-btn');
  const suggestionDiv = document.getElementById('suggestion');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Request notification permission
  if ('Notification' in window) {
    Notification.requestPermission();
  }

  // Render tasks
  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      const dueDate = new Date(task.due);
      const now = new Date();
      if (dueDate < now) {
        li.classList.add('overdue');
      }
      li.innerHTML = `
        <div>
          <strong>${task.title}</strong>
          <p>${task.description}</p>
          <small>Due: ${dueDate.toLocaleString()}</small>
        </div>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      taskList.appendChild(li);
    });
  }

  // Add task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const due = document.getElementById('task-due').value;
    tasks.push({ title, description, due });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    taskForm.reset();
  });

  // Delete task
  taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = e.target.dataset.index;
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
  });

  // Optimize schedule with AI
  optimizeBtn.addEventListener('click', async () => {
    if (tasks.length === 0) {
      alert('No tasks to optimize');
      return;
    }
    try {
      const response = await fetch('/api/suggest-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      });
      const data = await response.json();
      suggestionDiv.innerHTML = `<h3>AI Suggestion:</h3><p>${data.suggestion.replace(/\n/g, '<br>')}</p>`;
    } catch (error) {
      console.error(error);
      suggestionDiv.innerHTML = '<p>Error getting AI suggestion</p>';
    }
  });

  // Check for reminders
  setInterval(() => {
    const now = new Date();
    tasks.forEach(task => {
      const dueDate = new Date(task.due);
      const timeDiff = dueDate - now;
      if (timeDiff > 0 && timeDiff < 60000) { // Within 1 minute
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Reminder: ${task.title}`, {
            body: `Due at ${dueDate.toLocaleString()}`,
          });
        }
      }
    });
  }, 30000); // Check every 30 seconds

  renderTasks();
});