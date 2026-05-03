# Smart Task Scheduler & Reminder

A Python Flask-based web application for task scheduling and reminder management with built-in demo-driven schedule suggestions.

## Features

- ✅ Add tasks with title, description, and due date
- ✅ View task list with deadlines
- ✅ Get optimized schedule recommendations instantly
- 🔔 Browser notifications for upcoming reminders
- 💾 Local storage for persistence
- 🎨 Polished responsive UI with modern styling

## Tech Stack

- **Backend:** Python Flask
- **Frontend:** HTML, CSS, JavaScript
- **Database:** Browser Local Storage

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nischay-3/AI_task_scheduler.git
   cd AI_task_scheduler
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure email reminders (optional):**
   - Open the `.env` file
   - Add your SMTP settings for email reminders
   - Example SMTP configuration is already included in `.env`

5. **Run the application:**
   ```bash
   python app.py
   ```

6. **Open in browser:**
   Navigate to `http://localhost:3000`

## Usage

1. **Add a Task:** Fill in the task title, description (optional), and due date, then click "Add Task"
2. **View Tasks:** Tasks appear in a clean task list with due time and overdue highlighting
3. **Get a Schedule:** Click "Get Optimized Schedule" to receive a suggested task order
4. **Delete Tasks:** Click the "Delete" button on any task to remove it
5. **Get Reminders:** Browser notifications appear 5 minutes before task deadlines

## Project Structure

```
ai-task-scheduler/
├── app.py                 # Flask backend with demo suggestion logic
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html         # Main HTML template
└── static/
    ├── style.css          # CSS styling
    └── script.js          # Frontend JavaScript logic
```

## Dependencies

- Flask - Web framework
- Flask-CORS - Cross-Origin Resource Sharing

## How Schedule Suggestions Work

The application generates schedule recommendations by ordering tasks by due date and delivering clear reasoning for the suggested workflow.

## License

MIT