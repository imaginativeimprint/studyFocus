from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# In-memory storage for tasks (for demo purposes)
tasks = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/add_task", methods=["POST"])
def add_task():
    task_data = request.json
    tasks.append(task_data)
    return jsonify({"success": True, "tasks": tasks})

@app.route("/delete_task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    if 0 <= task_id < len(tasks):
        tasks.pop(task_id)
        return jsonify({"success": True, "tasks": tasks})
    return jsonify({"success": False, "error": "Task not found"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)  # <<< Change this line!