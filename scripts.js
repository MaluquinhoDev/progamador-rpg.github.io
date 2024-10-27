document.addEventListener("DOMContentLoaded", function () {
    const addChallengeBtn = document.getElementById("addChallengeBtn");
    const challengesList = document.getElementById("challengesList");
    const challengeMessage = document.getElementById("challengeMessage");

    const addLearningBtn = document.getElementById("addLearningBtn");
    const learningsList = document.getElementById("learningsList");
    const learningMessage = document.getElementById("learningMessage");

    let challenges = JSON.parse(localStorage.getItem('challenges')) || [];
    let learnings = JSON.parse(localStorage.getItem('learnings')) || [];
    let experience = parseInt(localStorage.getItem('experience')) || 0;
    let level = parseInt(localStorage.getItem('level')) || 1;

    // Atualizar a interface inicial
    updateChallengesDisplay();
    updateLearningsDisplay();
    updateExperienceAndLevel();

    // Adicionar Desafio
    addChallengeBtn.addEventListener("click", function () {
        const description = document.getElementById("challengeDescription").value;

        if (description.trim() === "") {
            return; // Não faz nada se o campo estiver vazio
        }

        challenges.push({ description: description, completed: false });
        document.getElementById("challengeDescription").value = ''; // Limpa o campo de descrição
        saveData(); // Salva os dados no localStorage
        updateChallengesDisplay();
    });

    function updateChallengesDisplay() {
        challengesList.innerHTML = ''; // Limpa a lista existente

        if (challenges.length === 0) {
            challengeMessage.textContent = "Nenhum desafio adicionado.";
        } else {
            challengeMessage.textContent = "";
            challenges.forEach(function (challenge, index) {
                const newChallenge = document.createElement("li");
                newChallenge.textContent = challenge.description;

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

    function markChallengeAsCompleted(index, challengeElement, completeBtn) {
        if (!challenges[index].completed) {
            challenges[index].completed = true;

            // Remove o botão "Concluir"
            challengeElement.removeChild(completeBtn);

            // Adiciona a mensagem de conclusão
            const completedMessage = document.createElement("span");
            completedMessage.textContent = " - Desafio concluído!";
            completedMessage.style.color = "green";
            challengeElement.appendChild(completedMessage);

            // Ganha XP ao concluir um desafio
            gainExperience(20); // Por exemplo, 20 pontos de XP ao concluir um desafio
            saveData(); // Salva os dados no localStorage
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
        saveData(); // Salva os dados no localStorage
    });

    function updateLearningsDisplay() {
        learningsList.innerHTML = ''; // Limpa a lista existente

        if (learnings.length === 0) {
            learningMessage.textContent = "Nenhum aprendizado adicionado.";
        } else {
            learningMessage.textContent = "";
            learnings.forEach(function (learning) {
                const newLearning = document.createElement("li");
                newLearning.textContent = learning;
                learningsList.appendChild(newLearning);
            });
        }
    }

    // Atualiza a experiência e o nível
    function gainExperience(xp) {
        experience += xp;
        updateExperienceAndLevel();
        saveData(); // Salva os dados no localStorage
    }

    function updateExperienceAndLevel() {
        document.getElementById("experience").textContent = experience;

        // Verifica se o nível deve ser aumentado
        while (experience >= level * 100) {
            levelUp();
        }
        document.getElementById("level").textContent = level;
    }

    function levelUp() {
        level++;
        document.getElementById("level").textContent = level;

        // Exibe o alerta estilizado quando o nível aumenta
        showAlert(`Parabéns! Você subiu para o nível ${level}`);
    }

    // Função para exibir a mensagem de alerta estilizada
    function showAlert(message) {
        const alertContainer = document.getElementById('alert-container');
        const alertMessage = document.getElementById('alert-message');

        alertMessage.textContent = message;
        alertContainer.classList.add('show');

        // Fecha o alerta automaticamente após 5 segundos
        setTimeout(() => {
            hideAlert();
        }, 5000);
    }

    // Função para esconder o alerta
    function hideAlert() {
        const alertContainer = document.getElementById('alert-container');
        alertContainer.classList.remove('show');
    }

    // Evento para fechar o alerta ao clicar no botão "X"
    document.getElementById('close-btn').addEventListener('click', hideAlert);

    // Salvar dados no localStorage
    function saveData() {
        localStorage.setItem('challenges', JSON.stringify(challenges));
        localStorage.setItem('learnings', JSON.stringify(learnings));
        localStorage.setItem('experience', experience.toString());
        localStorage.setItem('level', level.toString());
    }
});
