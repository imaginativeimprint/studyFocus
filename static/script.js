// Timer Logic
let timerInterval;
let timeLeft = 25 * 60; // Default: 25 minutes
let isRunning = false;
let isStudyTime = true;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-timer');
const pauseBtn = document.getElementById('pause-timer');
const resetBtn = document.getElementById('reset-timer');
const studyTimeInput = document.getElementById('study-time');
const breakTimeInput = document.getElementById('break-time');
const timerStatus = document.getElementById('timer-status');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                if (isStudyTime) {
                    timeLeft = parseInt(breakTimeInput.value) * 60;
                    timerStatus.textContent = "Time for a break!";
                } else {
                    timeLeft = parseInt(studyTimeInput.value) * 60;
                    timerStatus.textContent = "Back to studying!";
                }
                isStudyTime = !isStudyTime;
                startTimer(); // Auto-start next phase
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    pauseTimer();
    timeLeft = parseInt(studyTimeInput.value) * 60;
    isStudyTime = true;
    timerStatus.textContent = "Ready to study!";
    updateTimerDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

studyTimeInput.addEventListener('change', () => {
    if (!isRunning && isStudyTime) {
        timeLeft = parseInt(studyTimeInput.value) * 60;
        updateTimerDisplay();
    }
});

breakTimeInput.addEventListener('change', () => {
    if (!isRunning && !isStudyTime) {
        timeLeft = parseInt(breakTimeInput.value) * 60;
        updateTimerDisplay();
    }
});

// Todo List Logic
const todoInput = document.getElementById('todo-input');
const subjectInput = document.getElementById('subject-input');
const addTaskBtn = document.getElementById('add-task');
const todoList = document.getElementById('todo-list');

function addTask() {
    const taskText = todoInput.value.trim();
    const subjectText = subjectInput.value.trim();
    if (taskText === '') return;

    const taskData = {
        text: taskText,
        subject: subjectText || 'General',
    };

    fetch('/add_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    })
    .then(response => response.json())
    .then(data => {
        renderTasks(data.tasks);
        todoInput.value = '';
        subjectInput.value = '';
    });
}

function deleteTask(index) {
    fetch(`/delete_task/${index}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        renderTasks(data.tasks);
    });
}

function renderTasks(tasks) {
    todoList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <div class="task-info">
                <div>${task.text}</div>
                <div class="subject">${task.subject}</div>
            </div>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteTask(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        todoList.appendChild(taskItem);
    });
}

addTaskBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Initial render
updateTimerDisplay();