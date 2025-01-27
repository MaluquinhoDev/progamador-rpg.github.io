import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_DOMINIO.firebaseapp.com",
    databaseURL: "https://SEU_BANCO.firebaseio.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
    const addLearningBtn = document.getElementById("addLearningBtn");
    const learningDescription = document.getElementById("learningDescription");
    const learningsList = document.getElementById("learningsList");
    const learningMessage = document.getElementById("learningMessage");

    let level = 1;
    let experience = 0;

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
            text.classList.toggle("expanded");
            toggleBtn.textContent = text.classList.contains("expanded")
                ? "Mostrar menos"
                : "Mostrar mais";
        });

        li.appendChild(toggleBtn);
        learningsList.appendChild(li);

        learningDescription.value = "";
        learningMessage.textContent = "Aprendizado adicionado com sucesso!";
        learningMessage.style.color = "green";

        updateStats();
        saveData();
    });

    function updateStats() {
        level = Math.floor(experience / 100) + 1;
        document.getElementById("level").textContent = level;
        document.getElementById("experience").textContent = experience;
    }

    function saveData() {
        const statsRef = ref(database, 'playerStats');
        set(statsRef, { level, experience });
    }
});
