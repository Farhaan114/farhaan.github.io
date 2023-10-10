from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return "Welcome to the Voice to Text Webpage!"

@app.route('/save_transcript', methods=['POST'])
def save_transcript():
    data = request.get_json()
    transcript = data.get('transcript', '')
    
    # Save the transcript to a Python file
    with open('transcript.txt', 'w') as file:
        file.write(transcript)
    
    response_data = {'message': 'Transcript received and saved successfully'}
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)
