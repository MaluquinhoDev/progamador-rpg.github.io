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

    // Adicionar Desafio
    addChallengeBtn.addEventListener("click", function () {
        const description = document.getElementById("challengeDescription").value;

        if (description.trim() === "") {
            return;
        }

        challenges.push({ description: description, completed: false });
        document.getElementById("challengeDescription").value = ''; 
        saveData();
        updateChallengesDisplay();
    });

    // Função para atualizar a exibição dos desafios
    function updateChallengesDisplay() {
        if (!challengesList) return;
        challengesList.innerHTML = '';

        if (challenges.length === 0) {
            challengeMessage.textContent = "Nenhum desafio adicionado.";
        } else {
            challengeMessage.textContent = "";
            challenges.forEach(function (challenge, index) {
                const newChallenge = document.createElement("li");

                const newText = document.createElement("p");
                newText.classList.add("text");
                newText.id = `challenge-text-${index}`;
                newText.style.maxHeight = "100px"; // Limite inicial para a altura da caixa
                newText.style.overflow = "hidden"; // Esconde o excesso
                newText.textContent = challenge.description;
                newChallenge.appendChild(newText);

                const toggleBtn = document.createElement("button");
                toggleBtn.classList.add("toggle-btn");
                toggleBtn.textContent = "Mostrar mais";
                toggleBtn.onclick = function () {
                    toggleText(newText, toggleBtn);
                };

                newChallenge.appendChild(toggleBtn);

                if (!challenge.completed) {
                    const completeBtn = document.createElement("button");
                    completeBtn.textContent = "Concluir";
                    completeBtn.addEventListener("click", function () {
                        markChallengeAsCompleted(index, newChallenge, completeBtn);
                    });
                    newChallenge.appendChild(completeBtn);
                } else {
                    const completedMessage = document.createElement("span");
                    completedMessage.textContent = " - Desafio concluído!";
                    completedMessage.style.color = "green";
                    newChallenge.appendChild(completedMessage);
                }

                challengesList.appendChild(newChallenge);
            });
        }
    }

    function markChallengeAsCompleted(index, challengeElement, completeBtn) {
        if (!challenges[index].completed) {
            challenges[index].completed = true;
            challengeElement.removeChild(completeBtn);

            const completedMessage = document.createElement("span");
            completedMessage.textContent = " - Desafio concluído!";
            completedMessage.style.color = "green";
            challengeElement.appendChild(completedMessage);

            gainExperience(20);
            saveData();
        }
    }

    // Adicionar Aprendizado
    addLearningBtn.addEventListener("click", function () {
        const description = document.getElementById("learningDescription").value;

        if (description.trim() === "") {
            return;
        }

        learnings.push(description);
        document.getElementById("learningDescription").value = '';
        updateLearningsDisplay();
        gainExperience(10);
        saveData();
    });

    function updateLearningsDisplay() {
        if (!learningsList) return;
        learningsList.innerHTML = '';

        if (learnings.length === 0) {
            learningMessage.textContent = "Nenhum aprendizado adicionado.";
        } else {
            learningMessage.textContent = "";
            learnings.forEach(function (learning, index) {
                const newLearning = document.createElement("li");

                const newText = document.createElement("p");
                newText.classList.add("text");
                newText.id = `learning-text-${index}`;
                newText.style.maxHeight = "100px"; // Limite inicial para a altura da caixa
                newText.style.overflow = "hidden"; // Esconde o excesso
                newText.textContent = learning;
                newLearning.appendChild(newText);

                const toggleBtn = document.createElement("button");
                toggleBtn.classList.add("toggle-btn");
                toggleBtn.textContent = "Mostrar mais";
                toggleBtn.onclick = function () {
                    toggleText(newText, toggleBtn);
                };

                newLearning.appendChild(toggleBtn);
                learningsList.appendChild(newLearning);
            });
        }
    }

    function toggleText(textElement, button) {
        const isCollapsed = textElement.style.maxHeight === "100px";
        if (isCollapsed) {
            textElement.style.maxHeight = "none"; // Expande o texto
            textElement.style.overflow = "visible";
            button.textContent = "Mostrar menos";
        } else {
            textElement.style.maxHeight = "100px"; // Retorna ao limite inicial
            textElement.style.overflow = "hidden";
            button.textContent = "Mostrar mais";
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
        playerStatsRef.once("value", function(snapshot) {
            if (snapshot.exists()) {
                const data = snapshot.val();
                level = data.level || 1;
                experience = data.experience || 0;
                challenges = data.challenges || [];
                learnings = data.learnings || [];

                updateStats();
                updateChallengesDisplay();
                updateLearningsDisplay();
            }
        });
    }
});
