document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const optimizeBtn = document.getElementById('optimize-btn');
  const statusMessage = document.getElementById('status-message');
  const suggestionDiv = document.getElementById('suggestion');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  if ('Notification' in window) {
    Notification.requestPermission();
  }

  tasks = tasks.map(task => ({ ...task, notified: task.notified || false }));

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function setStatus(message, type = 'success') {
    statusMessage.innerHTML = `<div class="status-box" style="border-color: ${type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}; color: ${type === 'error' ? '#991b1b' : '#164e2a'}; background: ${type === 'error' ? 'rgba(254,226,226,0.9)' : 'rgba(220,252,231,0.9)'};">${message}</div>`;
    setTimeout(() => { statusMessage.innerHTML = ''; }, 6500);
  }

  function renderTasks() {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
      taskList.innerHTML = '<li class="task-item"><strong>No tasks yet</strong><p>Add a task and get reminders automatically.</p></li>';
      return;
    }

    tasks.forEach((task, index) => {
      const dueDate = new Date(task.due);
      const now = new Date();
      const isOverdue = dueDate < now;

      const li = document.createElement('li');
      li.className = `task-item${isOverdue ? ' overdue' : ''}`;
      li.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.description || 'No description provided.'}</p>
        <small>Due: ${dueDate.toLocaleString()}</small>
        <button class="delete-btn">Delete</button>
      `;

      li.querySelector('.delete-btn').addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        setStatus('Task removed.');
      });

      taskList.appendChild(li);
    });
  }

  function generateSuggestion(tasks) {
    if (tasks.length === 0) {
      return 'Add tasks to see schedule recommendations.';
    }

    const sorted = [...tasks].sort((a, b) => new Date(a.due) - new Date(b.due));
    let suggestion = '📋 Suggested task order:\n\n';
    sorted.forEach((task, index) => {
      suggestion += `${index + 1}. ${task.title} (Due: ${new Date(task.due).toLocaleString()})\n`;
      if (task.description) {
        suggestion += `   Note: ${task.description}\n`;
      }
      suggestion += '\n';
    });

    suggestion += '💡 Reasoning:\nTasks are ordered by due date so urgent items appear first. Focus on the nearest deadline, then move to later tasks.';
    return suggestion;
  }

  function notifyTask(task) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Reminder: ${task.title}`, {
        body: `Due at ${new Date(task.due).toLocaleString()}`,
        icon: 'https://api.iconify.design/mdi/alarm-bell.svg?color=%231d4ed8',
      });
      task.notified = true;
      saveTasks();
    }
  }

  setInterval(() => {
    const now = new Date();
    tasks.forEach(task => {
      const dueDate = new Date(task.due);
      const timeDiff = dueDate - now;
      if (timeDiff > 0 && timeDiff < 300000 && !task.notified) {
        notifyTask(task);
      }
    });
  }, 30000);

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-description').value.trim();
    const due = document.getElementById('task-due').value;

    if (!title || !due) {
      setStatus('Please provide a title and due date.', 'error');
      return;
    }

    tasks.push({ title, description, due, notified: false });
    saveTasks();
    renderTasks();
    taskForm.reset();
    setStatus('Task added and reminder is active.');
  });

  optimizeBtn.addEventListener('click', () => {
    suggestionDiv.innerHTML = `<div class="suggestion-box"><h3>✨ Schedule Suggestion</h3><p>${generateSuggestion(tasks).replace(/\n/g, '<br>')}</p></div>`;
  });

  renderTasks();
});