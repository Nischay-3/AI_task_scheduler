# AI Task Scheduler & Reminder

A Python Flask-based web application for task scheduling and reminder management with AI-powered schedule optimization using OpenAI GPT.

## Features

- ✅ Add tasks with title, description, and due date
- ✅ View list of all tasks  
- 🤖 AI-powered schedule optimization using OpenAI GPT-3.5
- 🔔 Browser notifications for upcoming reminders
- 💾 Local storage for task persistence
- 🎨 Modern, responsive UI with gradient design

## Tech Stack

- **Backend:** Python Flask
- **Frontend:** HTML, CSS, JavaScript
- **AI:** OpenAI GPT-3.5-turbo
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

4. **Set up your OpenAI API key:**
   - Open the `.env` file
   - Replace `your_openai_api_key_here` with your actual OpenAI API key
   - Get your key from https://platform.openai.com/api-keys

5. **Run the application:**
   ```bash
   python app.py
   ```

6. **Open in browser:**
   Navigate to `http://localhost:3000`

## Usage

1. **Add a Task:** Fill in the task title, description (optional), and due date, then click "Add Task"
2. **View Tasks:** All tasks are displayed in a list with their due dates
3. **Optimize with AI:** Click "Optimize Schedule with AI" to get personalized task prioritization suggestions
4. **Delete Tasks:** Click the "Delete" button on any task to remove it
5. **Get Reminders:** Browser notifications appear 5 minutes before task deadlines

## Project Structure

```
ai-task-scheduler/
├── app.py                 # Flask backend with OpenAI integration
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (API key)
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── style.css         # CSS styling
    └── script.js         # Frontend JavaScript logic
```

## Environment Variables

Create a `.env` file in the root directory:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Dependencies

- Flask - Web framework
- Flask-CORS - Cross-Origin Resource Sharing
- python-dotenv - Environment variable management
- openai - OpenAI API client

## How AI Suggestions Work

The application uses OpenAI's GPT-3.5-turbo model to analyze your tasks and suggest an optimal order based on:
- Priority levels
- Deadlines/Due dates
- Task dependencies
- Estimated complexity

The AI provides detailed reasoning for each suggestion.

## License

MIT