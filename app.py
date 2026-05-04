from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

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


@app.route('/api/suggest-schedule', methods=['POST'])
def suggest_schedule():
    data = request.json or {}
    tasks = data.get("tasks", [])
    suggestion = generate_mock_suggestion(tasks)
    return jsonify({"suggestion": suggestion})


if __name__ == '__main__':
    app.run(debug=True, port=3000)
