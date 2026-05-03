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
    if (tasks.length === 0) {
      taskList.innerHTML = '<li style="text-align: center; color: #999; border: none;">No tasks yet. Add one to get started!</li>';
      return;
    }
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      const dueDate = new Date(task.due);
      const now = new Date();
      const isOverdue = dueDate < now;
      
      if (isOverdue) {
        li.classList.add('overdue');
      }
      
      const taskContent = document.createElement('div');
      taskContent.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.description || 'No description'}</p>
        <small>📅 Due: ${dueDate.toLocaleString()}</small>
      `;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => deleteTask(index));
      
      li.appendChild(taskContent);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  // Add task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const due = document.getElementById('task-due').value;
    
    if (title.trim()) {
      tasks.push({ title, description, due });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
      taskForm.reset();
    }
  });

  // Delete task
  function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }

  // Optimize schedule
  optimizeBtn.addEventListener('click', async () => {
    if (tasks.length === 0) {
      alert('No tasks to optimize. Add some tasks first!');
      return;
    }

    optimizeBtn.disabled = true;
    optimizeBtn.textContent = 'Loading suggestion...';

    try {
      const response = await fetch('/api/suggest-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      });

      const data = await response.json();
      suggestionDiv.innerHTML = `<div class="suggestion-box"><h3>✨ Schedule Suggestion</h3><p>${data.suggestion.replace(/\n/g, '<br>')}</p></div>`;
    } catch (error) {
      console.error(error);
      suggestionDiv.innerHTML = '<p style="color: red;">⚠️ Connection error. Check if the server is running.</p>';
    } finally {
      optimizeBtn.disabled = false;
      optimizeBtn.textContent = 'Get Optimized Schedule';
    }
  });

  // Check for reminders
  setInterval(() => {
    const now = new Date();
    tasks.forEach(task => {
      const dueDate = new Date(task.due);
      const timeDiff = dueDate - now;
      if (timeDiff > 0 && timeDiff < 300000) { // Within 5 minutes
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`⏰ Reminder: ${task.title}`, {
            body: `Due at ${dueDate.toLocaleString()}`,
            icon: '🤖'
          });
        }
      }
    });
  }, 30000); // Check every 30 seconds

  renderTasks();
});
