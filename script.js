// Configuração do Firebase com as credenciais do seu projeto
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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", function () {
    const addChallengeBtn = document.getElementById("addChallengeBtn");
    const challengesList = document.getElementById("challengesList");
    const challengeMessage = document.getElementById("challengeMessage");

    const addLearningBtn = document.getElementById("addLearningBtn");
    const learningsList = document.getElementById("learningsList");
    const learningMessage = document.getElementById("learningMessage");

    let challenges = [];
    let learnings = [];
    let experience = 0;
    let level = 1;

    loadData();

    // Adicionar Aprendizado
    addLearningBtn.addEventListener("click", function () {
        const description = document.getElementById("learningDescription").value;

        if (description.trim() === "") {
            learningMessage.textContent = "O aprendizado não pode estar vazio.";
            return;
        }

        const points = Math.min(description.length * 2, 100); // Pontuação baseada no comprimento (máx. 100 pontos)
        learnings.push({ description: description, points: points });
        gainExperience(points);
        document.getElementById("learningDescription").value = "";
        saveData();
        updateLearningsDisplay();
    });

    // Adicionar Desafio
    addChallengeBtn.addEventListener("click", function () {
        const description = document.getElementById("challengeDescription").value;

        if (description.trim() === "") {
            challengeMessage.textContent = "O desafio não pode estar vazio.";
            return;
        }

        challenges.push({ description: description, completed: false });
        document.getElementById("challengeDescription").value = "";
        saveData();
        updateChallengesDisplay();
    });

    // Função para marcar desafio como concluído
    function completeChallenge(index) {
        if (!challenges[index].completed) {
            challenges[index].completed = true;
            gainExperience(50); // 50 pontos ao concluir desafio
            saveData();
            updateChallengesDisplay();
        }
    }

    function gainExperience(amount) {
        experience += amount;
        updateLevel();
        updateStats();
    }

    function updateLevel() {
        level = Math.floor(experience / 100) + 1;
    }

    function updateStats() {
        document.getElementById("level").textContent = level;
        document.getElementById("experience").textContent = experience;
        document.getElementById("skills").textContent = level * 10;
    }

    function saveData() {
        firebase.database().ref('playerStats').set({
            level: level,
            experience: experience,
            skills: level * 10,
            challenges: challenges,
            learnings: learnings
        });
    }

    function loadData() {
        const playerStatsRef = firebase.database().ref('playerStats');
        playerStatsRef.once("value", function (snapshot) {
            if (snapshot.exists()) {
                const data = snapshot.val();
                level = data.level || 1;
                experience = data.experience || 0;
                challenges = data.challenges || [];
                learnings = data.learnings || [];

                updateStats();
                updateLearningsDisplay();
                updateChallengesDisplay();
            }
        });
    }

    function updateLearningsDisplay() {
        learningsList.innerHTML = "";
        learnings.forEach((learning) => {
            const li = document.createElement("li");
            li.textContent = `${learning.description} (+${learning.points} XP)`;
            learningsList.appendChild(li);
        });
    }

    function updateChallengesDisplay() {
        challengesList.innerHTML = "";
        challenges.forEach((challenge, index) => {
            const li = document.createElement("li");
            li.textContent = challenge.description;

            if (!challenge.completed) {
                const completeBtn = document.createElement("button");
                completeBtn.textContent = "Concluir";
                completeBtn.onclick = () => completeChallenge(index);
                li.appendChild(completeBtn);
            } else {
                li.textContent += " - Concluído (+50 XP)";
            }

            challengesList.appendChild(li);
        });
    }
});
