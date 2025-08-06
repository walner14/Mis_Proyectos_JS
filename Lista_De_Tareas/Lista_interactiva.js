// Activar/desactivar prioridad
const enablePriority = document.getElementById("enablePriority");
const priorityInput = document.getElementById("priorityInput");

enablePriority.addEventListener("change", () => {
  priorityInput.disabled = !enablePriority.checked;
});

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const total = document.getElementById("total");
  const completed = document.getElementById("completed");
  const pending = document.getElementById("pending");
  const searchInput = document.getElementById("searchInput");
  const addFutureTaskBtn = document.getElementById("addFutureTaskBtn");

  let tasks = [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      tasks = JSON.parse(stored);
    }
  }

  function renderTasks() {
    taskList.innerHTML = "";
    const filtered = getFilteredTasks();

    filtered.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item";
      if (task.completed) li.classList.add("completed");
      if (task.priority) li.classList.add(`priority-${task.priority}`);
      if (task.isFuture) li.classList.add("future-task");

      li.innerHTML = `
        <span class="task-text">${task.text}</span>
        ${task.futureDate ? `<small class="future-date">🔔 Para: ${task.futureDate}</small>` : ""}
        <span class="priority ${task.priority || ""}"></span>
        <div class="actions">
          <button onclick="toggleComplete(${index})">✅</button>
          <button onclick="deleteTask(${index})">🗑️</button>
        </div>
      `;

      li.querySelector(".task-text").addEventListener("dblclick", () => {
        const newText = prompt("Editar tarea:", task.text);
        if (newText !== null && newText.trim() !== "") {
          tasks[index].text = newText.trim();
          saveTasks();
          renderTasks();
        }
      });

      taskList.appendChild(li);
    });

    updateStats();
    crearCalendarioAnual(tasks);
  }

  function updateStats() {
    total.textContent = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;
    completed.textContent = completedCount;
    pending.textContent = tasks.length - completedCount;
  }

  function getFilteredTasks() {
    const term = searchInput.value.toLowerCase();
    return tasks.filter(task => task.text.toLowerCase().includes(term));
  }

  // Agregar tarea normal
  addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const priority = priorityInput.value;

    if (text !== "") {
      tasks.push({
        text,
        completed: false,
        priority,
        id: Date.now()
      });

      taskInput.value = "";
      priorityInput.value = "baja";
      saveTasks();
      renderTasks();
    }
  });

  if (addFutureTaskBtn) {
    addFutureTaskBtn.remove();
  }

  searchInput.addEventListener("input", () => renderTasks());

  window.toggleComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };

  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };

  window.filterTasks = (filter) => {
    const lis = taskList.getElementsByTagName("li");
    tasks.forEach((task, i) => {
      const li = lis[i];
      if (filter === "all") {
        li.style.display = "flex";
      } else if (filter === "completed") {
        li.style.display = task.completed ? "flex" : "none";
      } else if (filter === "pending") {
        li.style.display = !task.completed ? "flex" : "none";
      }
    });
  };

  window.sortTasksAlphabetically = () => {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    saveTasks();
    renderTasks();
  };

  if (typeof Sortable !== "undefined") {
    Sortable.create(taskList, {
      animation: 150,
      onEnd: (evt) => {
        const movedItem = tasks.splice(evt.oldIndex, 1)[0];
        tasks.splice(evt.newIndex, 0, movedItem);
        saveTasks();
      }
    });
  }

  // Cargar y mostrar tareas
  loadTasks();
  renderTasks();
});

// Función para crear la vista de 12 meses
function crearCalendarioAnual(tasks = []) {
  const contenedor = document.getElementById("calendar");
  contenedor.innerHTML = ""; // Limpiar

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const contenedorAnual = document.createElement("div");
  contenedorAnual.classList.add("grid-anual");

  meses.forEach((nombreMes, index) => {
    const now = new Date();
    const year = now.getFullYear();

    const calendarioMes = document.createElement("div");
    calendarioMes.classList.add("calendario-mes");

    const titulo = document.createElement("h3");
    titulo.textContent = nombreMes;
    calendarioMes.appendChild(titulo);

    const tabla = document.createElement("table");
    const encabezado = document.createElement("thead");
    encabezado.innerHTML = `
      <tr>
        <th>Lu</th><th>Ma</th><th>Mi</th><th>Ju</th><th>Vi</th><th>Sa</th><th>Do</th>
      </tr>
    `;
    tabla.appendChild(encabezado);

    const cuerpo = document.createElement("tbody");

    const primerDia = new Date(year, index, 1).getDay(); // 0=Domingo
    const diasEnMes = new Date(year, index + 1, 0).getDate();
    let dia = 1;
    let comenzarEn = primerDia === 0 ? 6 : primerDia - 1;

    for (let fila = 0; fila < 6; fila++) {
      const filaHTML = document.createElement("tr");
      for (let col = 0; col < 7; col++) {
        const celda = document.createElement("td");

        if (fila === 0 && col < comenzarEn) {
          celda.textContent = "";
        } else if (dia > diasEnMes) {
          celda.textContent = "";
        } else {
          const fechaStr = `${year}-${String(index + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
          celda.textContent = dia;

          if (tasks.some(task => task.futureDate === fechaStr)) {
            celda.classList.add("tarea-agregada");
            celda.title = "Tarea programada";
          }

          celda.dataset.fecha = fechaStr;
          celda.addEventListener("click", () => {
            const tareaTexto = prompt(`Agregar tarea para ${fechaStr}:`);
            if (tareaTexto) {
              const nuevaTarea = {
                id: Date.now(),
                text: tareaTexto,
                completed: false,
                isFuture: true,
                priority: null,
                futureDate: fechaStr
              };
              tasks.push(nuevaTarea);
              localStorage.setItem("tasks", JSON.stringify(tasks));
              document.dispatchEvent(new Event("DOMContentLoaded"));
              alert("🔔 ¡Tarea agregada para " + fechaStr + "!");
            }
          });
          dia++;
        }
        filaHTML.appendChild(celda);
      }
      cuerpo.appendChild(filaHTML);
      if (dia > diasEnMes) break;
    }

    tabla.appendChild(cuerpo);
    calendarioMes.appendChild(tabla);
    contenedorAnual.appendChild(calendarioMes);
  });

  contenedor.appendChild(contenedorAnual);
}

// Estilos para el calendario anual
const estilo = document.createElement("style");
estilo.textContent = `
  .grid-anual {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    padding: 10px;
  }
  .calendario-mes {
    background-color: #fefefe;
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 10px;
    text-align: center;
  }
  .calendario-mes h3 {
    margin-bottom: 5px;
    font-size: 1rem;
  }
  .calendario-mes table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
  }
  .calendario-mes th, .calendario-mes td {
    border: 1px solid #ddd;
    width: 14.2%;
    height: 28px;
    padding: 2px;
    text-align: center;
  }
  .calendario-mes td:hover {
    background-color: #d4f0ff;
    cursor: pointer;
  }
  .tarea-agregada {
    background-color: #c8e6c9 !important;
  }
`;
document.head.appendChild(estilo);


