// Importando as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

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

// Inicializa o Firebase com a configuração
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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

    // Verifique se todos os elementos necessários existem antes de continuar
    if (!addChallengeBtn || !challengesList || !challengeMessage || !addLearningBtn || !learningsList || !learningMessage) {
        console.error("Erro: Algum dos elementos do DOM não foi encontrado.");
        if (!addChallengeBtn) console.error("Elemento 'addChallengeBtn' não encontrado.");
        if (!challengesList) console.error("Elemento 'challengesList' não encontrado.");
        if (!challengeMessage) console.error("Elemento 'challengeMessage' não encontrado.");
        if (!addLearningBtn) console.error("Elemento 'addLearningBtn' não encontrado.");
        if (!learningsList) console.error("Elemento 'learningsList' não encontrado.");
        if (!learningMessage) console.error("Elemento 'learningMessage' não encontrado.");
        return; // Sai da função se algum dos elementos não for encontrado
    }

    // Carrega dados do Firebase ao iniciar a página
    loadData();

    // Adicionar Desafio
    addChallengeBtn.addEventListener("click", function () {
        const description = document.getElementById("challengeDescription").value;

        if (description.trim() === "") {
            return; // Não faz nada se o campo estiver vazio
        }

        challenges.push({ description: description, completed: false });
        document.getElementById("challengeDescription").value = ''; // Limpa o campo de descrição
        saveData(); // Salva os dados no Firebase
        updateChallengesDisplay();
    });

    // Função para atualizar a exibição dos desafios
    function updateChallengesDisplay() {
        if (!challengesList) return; // Verifica se o challengesList existe
        challengesList.innerHTML = ''; // Limpa a lista existente

        if (challenges.length === 0) {
            challengeMessage.textContent = "Nenhum desafio adicionado.";
        } else {
            challengeMessage.textContent = "";
            challenges.forEach(function (challenge, index) {
                const newChallenge = document.createElement("li");

                // Cria o contêiner de texto com a funcionalidade de mostrar/ocultar
                const newText = document.createElement("p");
                newText.classList.add("text");
                newText.id = `challenge-text-${index}`;
                newText.textContent = challenge.description;
                newChallenge.appendChild(newText);

                const toggleBtn = document.createElement("button");
                toggleBtn.classList.add("toggle-btn");
                toggleBtn.textContent = "Mostrar mais";
                toggleBtn.onclick = function () {
                    toggleText(newText.id, toggleBtn);
                };

                newChallenge.appendChild(toggleBtn);

                if (!challenge.completed) {
                    // Botão para marcar o desafio como concluído
                    const completeBtn = document.createElement("button");
                    completeBtn.textContent = "Concluir";
                    completeBtn.addEventListener("click", function () {
                        markChallengeAsCompleted(index, newChallenge, completeBtn);
                    });

                    newChallenge.appendChild(completeBtn);
                } else {
                    // Se o desafio já estiver concluído, exibe a mensagem
                    const completedMessage = document.createElement("span");
                    completedMessage.textContent = " - Desafio concluído!";
                    completedMessage.style.color = "green";
                    newChallenge.appendChild(completedMessage);
                }

                challengesList.appendChild(newChallenge);
            });
        }
    }

    // Função para marcar desafio como concluído
    function markChallengeAsCompleted(index, challengeElement, completeBtn) {
        if (!challenges[index].completed) {
            challenges[index].completed = true;
            challengeElement.removeChild(completeBtn);

            const completedMessage = document.createElement("span");
            completedMessage.textContent = " - Desafio concluído!";
            completedMessage.style.color = "green";
            challengeElement.appendChild(completedMessage);

            gainExperience(20); // Ganha XP ao concluir um desafio
            saveData(); // Salva os dados no Firebase
        }
    }

    // Adicionar Aprendizado
    addLearningBtn.addEventListener("click", function () {
        const description = document.getElementById("learningDescription").value;

        if (description.trim() === "") {
            return; // Não faz nada se o campo estiver vazio
        }

        learnings.push(description);
        document.getElementById("learningDescription").value = ''; // Limpa o campo de descrição
        updateLearningsDisplay();
        gainExperience(10); // Ganha XP ao adicionar um aprendizado
        saveData(); // Salva os dados no Firebase
    });

    // Função para atualizar a exibição dos aprendizados
    function updateLearningsDisplay() {
        if (!learningsList) return; // Verifica se o learningsList existe
        learningsList.innerHTML = ''; // Limpa a lista existente

        if (learnings.length === 0) {
            learningMessage.textContent = "Nenhum aprendizado adicionado.";
        } else {
            learningMessage.textContent = "";
            learnings.forEach(function (learning, index) {
                const newLearning = document.createElement("li");

                // Cria o contêiner de texto com a funcionalidade de mostrar/ocultar
                const newText = document.createElement("p");
                newText.classList.add("text");
                newText.id = `learning-text-${index}`;
                newText.textContent = learning;
                newLearning.appendChild(newText);

                const toggleBtn = document.createElement("button");
                toggleBtn.classList.add("toggle-btn");
                toggleBtn.textContent = "Mostrar mais";
                toggleBtn.onclick = function () {
                    toggleText(newText.id, toggleBtn);
                };

                newLearning.appendChild(toggleBtn);

                learningsList.appendChild(newLearning);
            });
        }
    }

    // Função para alternar entre mostrar e ocultar o texto
    function toggleText(textId, button) {
        const textElement = document.getElementById(textId);

        if (textElement.style.maxHeight === "none") {
            // Se o texto estiver expandido, minimiza
            textElement.style.maxHeight = "80px";
            textElement.style.webkitLineClamp = "3";
            button.textContent = "Mostrar mais";
        } else {
            // Se o texto estiver minimizado, expande
            textElement.style.maxHeight = "none";
            textElement.style.webkitLineClamp = "unset";
            button.textContent = "Mostrar menos";
        }
    }

    // Atualiza a experiência e o nível
    function gainExperience(xp) {
        experience += xp;
        updateExperienceAndLevel();
        saveData(); // Salva os dados no Firebase
    }

    function updateExperienceAndLevel() {
        document.getElementById("experience").textContent = experience;

        while (experience >= level * 100) {
            levelUp();
        }
        document.getElementById("level").textContent = level;
    }

    function levelUp() {
        level++;
        document.getElementById("level").textContent = level;

        showAlert(`Parabéns! Você subiu para o nível ${level}`);
    }

    function showAlert(message) {
        const alertContainer = document.getElementById('alert-container');
        const alertMessage = document.getElementById('alert-message');

        alertMessage.textContent = message;
        alertContainer.style.display = 'block';

        setTimeout(() => {
            hideAlert();
        }, 5000);
    }

    function hideAlert() {
        const alertContainer = document.getElementById('alert-container');
        alertContainer.style.display = 'none';
    }

    document.getElementById('close-btn').addEventListener('click', hideAlert);

    // Função para salvar dados no Firebase
    function saveData() {
        set(ref(database, 'userData'), {
            challenges: challenges,
            learnings: learnings,
            experience: experience,
            level: level
        });
    }

    // Função para carregar dados do Firebase
    function loadData() {
        const dataRef = ref(database, 'userData');
        get(dataRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                challenges = data.challenges || [];
                learnings = data.learnings || [];
                experience = data.experience || 0;
                level = data.level || 1;

                updateChallengesDisplay();
                updateLearningsDisplay();
                updateExperienceAndLevel();
            }
        }).catch((error) => {
            console.error("Erro ao carregar dados do Firebase: ", error);
        });
    }
});
