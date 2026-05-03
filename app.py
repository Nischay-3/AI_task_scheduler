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

@app.route('/api/suggest-schedule', methods=['POST'])
def suggest_schedule():
    try:
        data = request.json
        tasks = data.get('tasks', [])
        
        task_list = "\n".join([f"- {t['title']}: {t['description']} (Due: {t['due']})" for t in tasks])
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "user",
                "content": f"Given these tasks:\n{task_list}\n\nSuggest an optimal order to complete them based on priority, deadlines, and dependencies. Provide a numbered list with brief reasoning."
            }],
            max_tokens=300
        )
        
        suggestion = response['choices'][0]['message']['content']
        return jsonify({'suggestion': suggestion})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Failed to get AI suggestion: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
