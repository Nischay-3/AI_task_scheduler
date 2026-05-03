from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import openai

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def index():
    return render_template('index.html')

def generate_mock_suggestion(tasks):
    """Generate a mock AI suggestion for demo/testing purposes"""
    if not tasks:
        return "No tasks provided."
    
    # Sort tasks by due date
    sorted_tasks = sorted(tasks, key=lambda x: x.get('due', ''))
    
    suggestion = "📋 **Suggested Task Order:**\n\n"
    for i, task in enumerate(sorted_tasks, 1):
        suggestion += f"{i}. **{task['title']}**\n"
        suggestion += f"   - Due: {task['due']}\n"
        if task.get('description'):
            suggestion += f"   - Note: {task['description']}\n"
        suggestion += "\n"
    
    suggestion += "💡 **Reasoning:**\n"
    suggestion += "Tasks are ordered by due date. Complete urgent tasks first to avoid missing deadlines. "
    suggestion += "Break larger tasks into smaller subtasks if needed. Take short breaks between tasks for better productivity.\n\n"
    suggestion += "✨ *Note: Using demo suggestions. Add your OpenAI API key in .env for real AI suggestions.*"
    
    return suggestion

@app.route('/api/suggest-schedule', methods=['POST'])
def suggest_schedule():
    try:
        data = request.json
        tasks = data.get('tasks', [])
        
        api_key = os.getenv('OPENAI_API_KEY', '')
        
        # Check if API key is set and valid
        if not api_key or api_key == 'your_openai_api_key_here' or api_key.startswith('sk-proj-'):
            # Use mock suggestion if no valid API key
            if api_key == 'your_openai_api_key_here' or not api_key:
                suggestion = generate_mock_suggestion(tasks)
                return jsonify({'suggestion': suggestion, 'mode': 'demo'})
        
        try:
            task_list = "\n".join([f"- {t['title']}: {t['description']} (Due: {t['due']})" for t in tasks])
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{
                    "role": "user",
                    "content": f"Given these tasks:\n{task_list}\n\nSuggest an optimal order to complete them based on priority, deadlines, and dependencies. Provide a numbered list with brief reasoning."
                }],
                max_tokens=300,
                timeout=10
            )
            
            suggestion = response['choices'][0]['message']['content']
            return jsonify({'suggestion': suggestion, 'mode': 'live'})
        
        except Exception as api_error:
            error_msg = str(api_error)
            print(f"OpenAI API Error: {error_msg}")
            
            # Check for specific errors
            if 'billing' in error_msg.lower() or 'quota' in error_msg.lower():
                fallback = generate_mock_suggestion(tasks)
                return jsonify({
                    'suggestion': fallback + "\n\n⚠️ **Note:** OpenAI API billing limit reached. Showing demo suggestions instead.",
                    'mode': 'demo'
                })
            else:
                # Use mock for any API error
                fallback = generate_mock_suggestion(tasks)
                return jsonify({
                    'suggestion': fallback,
                    'mode': 'demo'
                })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'suggestion': generate_mock_suggestion(request.json.get('tasks', [])),
            'mode': 'demo',
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True, port=3000)
