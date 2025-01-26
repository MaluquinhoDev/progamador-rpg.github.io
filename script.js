// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SEU_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    databaseURL: "SEU_DATABASE_URL",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", function () {
    const addLearningBtn = document.getElementById("addLearningBtn");
    const learningDescription = document.getElementById("learningDescription");
    const learningsList = document.getElementById("learningsList");
    const learningMessage = document.getElementById("learningMessage");

    let level = 1;
    let experience = 0;

    // Adicionar aprendizado
    addLearningBtn.addEventListener("click", () => {
        const description = learningDescription.value.trim();

        if (!description) {
            learningMessage.textContent = "O aprendizado não pode estar vazio.";
            learningMessage.style.color = "red";
            return;
        }

        const points = Math.min(description.length * 2, 100);
        experience += points;

        const li = document.createElement("li");
        
        const text = document.createElement("div");
        text.classList.add("text");
        text.textContent = description;
        li.appendChild(text);

        const toggleBtn = document.createElement("button");
        toggleBtn.classList.add("toggle-btn");
        toggleBtn.textContent = "Mostrar mais";
        
        toggleBtn.addEventListener("click", function () {
            if (text.classList.contains("expanded")) {
                text.classList.remove("expanded");
                toggleBtn.textContent = "Mostrar mais";
            } else {
                text.classList.add("expanded");
                toggleBtn.textContent = "Mostrar menos";
            }
        });

        li.appendChild(toggleBtn);
        learningsList.appendChild(li);

        learningDescription.value = "";
        learningMessage.textContent = "Aprendizado adicionado com sucesso!";
        learningMessage.style.color = "green";

        updateStats();
        saveData();
    });

    // Atualizar estatísticas
    function updateStats() {
        level = Math.floor(experience / 100) + 1;
        document.getElementById("level").textContent = level;
        document.getElementById("experience").textContent = experience;
    }

    // Salvar dados no Firebase
    function saveData() {
        database.ref("playerStats").set({
            level: level,
            experience: experience
        });
    }
});
