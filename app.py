from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')


def generate_mock_suggestion(tasks):
    if not tasks:
        return "No tasks provided."

    sorted_tasks = sorted(tasks, key=lambda x: x.get('due', ''))
    suggestion = "📋 Suggested Task Order:\n\n"

    for i, task in enumerate(sorted_tasks, 1):
        suggestion += f"{i}. {task['title']}\n"
        suggestion += f"   Due: {task['due']}\n"
        if task.get('description'):
            suggestion += f"   Note: {task['description']}\n"
        suggestion += "\n"

    suggestion += "💡 Reasoning:\n"
    suggestion += (
        "Tasks are ordered by nearest due date so urgent work appears first. "
        "Use this schedule as a guide and adjust as needed for your priorities."
    )
    return suggestion


def send_email(to_address: str, task: dict):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    smtp_from = os.getenv("EMAIL_FROM", smtp_user or "no-reply@ai-task-scheduler.app")

    if not smtp_host or not smtp_user or not smtp_pass:
        raise ValueError("SMTP settings are not configured.")

    message = EmailMessage()
    message["Subject"] = f"Reminder: {task.get('title', 'Your Task')}"
    message["From"] = smtp_from
    message["To"] = to_address
    message.set_content(
        f"Hello,\n\n"
        f"You have created a task reminder in AI Task Scheduler & Reminder.\n\n"
        f"Task: {task.get('title')}\n"
        f"Description: {task.get('description') or 'No description'}\n"
        f"Due Date: {task.get('due')}\n\n"
        f"Please complete this task on time.\n\n"
        f"Thank you."
    )

    if smtp_port == 465:
        with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
            server.login(smtp_user, smtp_pass)
            server.send_message(message)
    else:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(message)


@app.route('/api/send-reminder', methods=['POST'])
def send_reminder():
    try:
        data = request.json or {}
        email = data.get("email")
        task = {
            "title": data.get("title", ""),
            "description": data.get("description", ""),
            "due": data.get("due", "")
        }

        if not email:
            return jsonify({"error": "Email address is required."}), 400

        send_email(email, task)
        return jsonify({"message": "Reminder email sent."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/suggest-schedule', methods=['POST'])
def suggest_schedule():
    data = request.json or {}
    tasks = data.get("tasks", [])
    suggestion = generate_mock_suggestion(tasks)
    return jsonify({"suggestion": suggestion})


if __name__ == '__main__':
    app.run(debug=True, port=3000)
