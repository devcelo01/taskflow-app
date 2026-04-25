let tarefas = [];
let filtroAtual = "todas";

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTaskButton');
const contador = document.getElementById("contador");

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");

    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    }
}

function renderizarTarefas() {
    taskList.innerHTML = "";

    const pendentes = tarefas.filter(t => !t.concluida).length;
    contador.textContent = `Pendentes: ${pendentes}`;

    if (tarefas.length === 0) {
        taskList.innerHTML = "<p style='text-align:center; color:#777;'>Nenhuma tarefa ainda</p>";
        return;
    }

    tarefas.forEach((tarefa, index) => {

        if (filtroAtual === "pendentes" && tarefa.concluida) return;
        if (filtroAtual === "concluidas" && !tarefa.concluida) return;

        const li = document.createElement('li');
        li.textContent = tarefa.texto;

        if (tarefa.concluida) {
            li.classList.add("completed");
        }

        li.addEventListener("click", function() {
            tarefas[index].concluida = !tarefas[index].concluida;
            salvarTarefas();
            renderizarTarefas();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "🗑️";

        deleteButton.addEventListener("click", function(event) {
            event.stopPropagation();
            tarefas.splice(index, 1);
            salvarTarefas();
            renderizarTarefas();
        });

        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

addTaskButton.addEventListener("click", function() {
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        tarefas.push({ 
            texto: taskText, 
            concluida: false 
        });

        salvarTarefas();
        renderizarTarefas();

        taskInput.value = "";
    }
});

function filtrar(tipo, event) {
    filtroAtual = tipo;

    document.querySelectorAll(".filters button").forEach(btn => {
        btn.classList.remove("active");
    });

    if (event) {
        event.target.classList.add("active");
    }

    renderizarTarefas();
}

carregarTarefas();
renderizarTarefas();