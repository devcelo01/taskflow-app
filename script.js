const usuario = localStorage.getItem("usuario");
let filtroAtual = localStorage.getItem("filtro") || "todas";

const form = document.getElementById("loginForm");
const erro = document.getElementById("erro");
const loginBtn = document.getElementById("loginBtn");

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        loginBtn.classList.add("loading");

        setTimeout(() => {
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            if (email === "admin@email.com" && senha === "123456") {
                localStorage.setItem("usuario", email);
                window.location.href = "dashboard.html";
            } else {
                erro.textContent = "Email ou senha incorretos.";
                erro.classList.add("show");
                loginBtn.classList.remove("loading");
            }
        }, 800);
    });
}

if (window.location.pathname.includes("dashboard.html")) {
    if (!usuario) {
        window.location.href = "index.html";
    } else {
        const texto = document.getElementById("boasVindas");
        if (texto) texto.textContent = `Bem-vindo, ${usuario}`;
    }
}

const logoutBtn = document.getElementById("logout");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        window.location.href = "index.html";
    });
}

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");
const clearBtn = document.getElementById("clearCompleted");

if (taskInput && taskList && addTaskBtn) {

    const chave = "tarefas_" + usuario;
    let tarefas = JSON.parse(localStorage.getItem(chave)) || [];

    function salvar() {
        localStorage.setItem(chave, JSON.stringify(tarefas));
    }

    function atualizarContador() {
        const contador = document.getElementById("contador");
        if (!contador) return;

        if (filtroAtual === "todas") {
            contador.textContent = `Todas: ${tarefas.length}`;
        }

        if (filtroAtual === "pendentes") {
            const p = tarefas.filter(t => !t.concluida).length;
            contador.textContent = `Pendentes: ${p}`;
        }

        if (filtroAtual === "concluidas") {
            const c = tarefas.filter(t => t.concluida).length;
            contador.textContent = `Concluídas: ${c}`;
        }
    }

    function renderizar() {
        taskList.innerHTML = "";
        atualizarContador();

        let visivel = false;

        tarefas.forEach((tarefa, index) => {

            if (filtroAtual === "pendentes" && tarefa.concluida) return;
            if (filtroAtual === "concluidas" && !tarefa.concluida) return;

            visivel = true;

            const li = document.createElement("li");

            const span = document.createElement("span");
            span.textContent = tarefa.texto;

            if (tarefa.concluida) {
                li.classList.add("completed");
            }

            li.addEventListener("click", () => {
                tarefas[index].concluida = !tarefas[index].concluida;
                salvar();
                renderizar();
            });

            span.addEventListener("dblclick", (e) => {
                e.stopPropagation();

                const novo = prompt("Editar tarefa:", tarefa.texto);

                if (novo && novo.trim()) {
                    tarefas[index].texto = novo.trim();
                    salvar();
                    renderizar();
                }
            });

            const btn = document.createElement("button");
            btn.textContent = "🗑️";

            btn.addEventListener("click", (e) => {
                e.stopPropagation();

                li.classList.add("fade-out");

                setTimeout(() => {
                    tarefas.splice(index, 1);
                    salvar();
                    renderizar();
                }, 300);
            });

            li.appendChild(span);
            li.appendChild(btn);
            taskList.appendChild(li);
        });

        if (!visivel) {
            taskList.innerHTML = "<li style='text-align:center; color:#777;'>Nenhuma tarefa aqui</li>";
        }
    }

    function adicionar() {
        const texto = taskInput.value.trim();

        if (!texto) return;

        tarefas.push({
            texto: texto,
            concluida: false
        });

        taskInput.value = "";
        salvar();
        renderizar();
    }

    addTaskBtn.addEventListener("click", adicionar);

    taskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            adicionar();
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            tarefas = tarefas.filter(t => !t.concluida);
            salvar();
            renderizar();
        });
    }

    window.filtrar = function(tipo, event) {
        filtroAtual = tipo;
        localStorage.setItem("filtro", tipo);

        document.querySelectorAll(".sidebar button").forEach(btn => {
            btn.classList.remove("active");
        });

        if (event) {
            event.target.classList.add("active");
        }

        renderizar();
    };

    renderizar();
}
