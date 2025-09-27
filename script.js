// script.js

// Obtener referencias al formulario y la lista de tareas
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const noTasksMessage = document.getElementById('noTasksMessage');

// Cargar tareas del localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Mostrar tareas cuando la página carga
displayTasks();

// Función para agregar una nueva tarea
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const taskDate = document.getElementById('taskDate').value;

    // Verificar que los campos no estén vacíos
    if (taskName && taskDate) {
        // Verificar que la fecha no esté en el pasado
        const currentDate = new Date();
        const taskDateObject = new Date(taskDate);
        if (taskDateObject < currentDate) {
            alert("La fecha y hora no pueden ser en el pasado.");
            return;
        }

        // Crear un objeto de tarea con nombre, fecha y hora
        const newTask = {
            name: taskName,
            date: taskDate,
            status: 'Pendiente',
            createdAt: new Date().toISOString()
        };

        // Agregar la tarea al array
        tasks.push(newTask);

        // Guardar tareas en el localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Limpiar el formulario
        taskForm.reset();

        // Volver a mostrar las tareas
        displayTasks();
    } else {
        alert("Por favor, complete todos los campos.");
    }
});

// Función para mostrar todas las tareas
function displayTasks() {
    taskList.innerHTML = '';

    // Verificar si hay tareas
    if (tasks.length === 0) {
        noTasksMessage.style.display = 'block';
    } else {
        noTasksMessage.style.display = 'none';
    }

    // Recorrer el array de tareas y crear un elemento para cada tarea
    tasks.forEach((task, index) => {
        const li = document.createElement('li');

        const taskDateObject = new Date(task.date);
        const currentDate = new Date();

        // Determinar el estado de la tarea (pasada, futura o completada)
        if (taskDateObject < currentDate && task.status !== 'Completada') {
            task.status = 'Completada'; // Cambiar el estado a completada si ha pasado la fecha
        }

        // Asignar clases visuales dependiendo de si la tarea está pasada o es futura
        if (task.status === 'Completada') {
            li.classList.add('completed');
        } else if (taskDateObject < currentDate) {
            li.classList.add('past-due');
        } else {
            li.classList.add('future');
        }

        // Mostrar el nombre, fecha y estado de la tarea
        li.innerHTML = `
            <span class="task-name">${task.name} - <strong>${formatDate(task.date)}</strong></span>
            <span class="task-status">${task.status}</span>
            <button class="complete" onclick="changeStatus(${index})">${task.status === 'Pendiente' ? 'Completar' : 'Finalizada'}</button>
            <button class="delete" onclick="deleteTask(${index})">Eliminar</button>
        `;

        taskList.appendChild(li);
    });
}

// Función para cambiar el estado de la tarea (Pendiente/Completada)
function changeStatus(index) {
    tasks[index].status = tasks[index].status === 'Pendiente' ? 'Completada' : 'Pendiente';
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardar en localStorage
    displayTasks();
}

// Función para eliminar una tarea
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardar en localStorage
    displayTasks();
}

// Función para formatear la fecha (día, mes, año, hora)
function formatDate(datetime) {
    const date = new Date(datetime);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    return formattedDate;
}

