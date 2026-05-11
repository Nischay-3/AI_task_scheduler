
from flask import Flask, render_template, request, redirect, url_for
import os
import json
from datetime import datetime, timedelta

app = Flask(__name__)

TASKS_FILE = 'tasks.json'

def load_tasks():
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with open(TASKS_FILE, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, indent=2)

def get_due_soon(tasks):
    now = datetime.now()
    soon = now + timedelta(minutes=5)
    due_soon = []
    for t in tasks:
        try:
            due = datetime.strptime(t['due'], '%Y-%m-%dT%H:%M')
            if now <= due <= soon:
                due_soon.append(t)
        except Exception:
            continue
    return due_soon

def get_overdue(tasks):
    now = datetime.now()
    overdue = []
    for t in tasks:
        try:
            due = datetime.strptime(t['due'], '%Y-%m-%dT%H:%M')
            if due < now:
                overdue.append(t)
        except Exception:
            continue
    return overdue

def generate_suggestion(tasks):
    if not tasks:
        return "No tasks provided."
    sorted_tasks = sorted(tasks, key=lambda x: x.get('due', ''))
    suggestion = "📋 AI Task Summary & Suggested Order:<br><br>"
    for i, task in enumerate(sorted_tasks, 1):
        suggestion += f"{i}. {task['title']} (Due: {task['due'].replace('T', ' ')})<br>"
        if task.get('description'):
            suggestion += f"&nbsp;&nbsp;Note: {task['description']}<br>"
    suggestion += "<br>💡 Reasoning:<br>Tasks are ordered by due date so urgent items appear first."
    return suggestion

@app.route('/', methods=['GET', 'POST'])
def index():
    tasks = load_tasks()
    message = None
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        description = request.form.get('description', '').strip()
        due = request.form.get('due', '').strip()
        if not title or not due:
            message = 'Title and due date are required.'
        else:
            tasks.append({'title': title, 'description': description, 'due': due})
            save_tasks(tasks)
            return redirect(url_for('index'))
    due_soon = get_due_soon(tasks)
    overdue = get_overdue(tasks)
    suggestion = generate_suggestion(tasks) if tasks else None
    return render_template('index.html', tasks=tasks, due_soon=due_soon, overdue=overdue, suggestion=suggestion, message=message)

@app.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    tasks = load_tasks()
    if 0 <= task_id < len(tasks):
        tasks.pop(task_id)
        save_tasks(tasks)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=3000)
