import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBhhS89kDMjrN-m4GqK2n1cXWyekw86-m4",
    authDomain: "dev-rpg-cf6a2.firebaseapp.com",
    databaseURL: "https://dev-rpg-cf6a2-default-rtdb.firebaseio.com",
    projectId: "dev-rpg-cf6a2",
    storageBucket: "dev-rpg-cf6a2.firebasestorage.app",
    messagingSenderId: "5816364523",
    appId: "1:5816364523:web:fce8fb68fecbaa2177fdae",
    measurementId: "G-5ZR7SV9357"
};

// Inicializando o Firebase com a configuração fornecida
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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
        set(ref(database, 'playerStats'), {
            level: level,
            experience: experience
        });
    }
});
