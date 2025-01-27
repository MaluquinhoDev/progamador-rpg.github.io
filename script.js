import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
