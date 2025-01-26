<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RPG de Programador</title>
    <link rel="stylesheet" href="styles.css">

    <!-- Firebase App e Database SDKs -->
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>
</head>
<body>
    <div class="container">
        <h1>RPG de Programador</h1>

        <!-- Estatísticas do Programador -->
        <section class="stats">
            <h2>Estatísticas</h2>
            <div class="stat">
                <span class="stat-label">Nível:</span>
                <span class="stat-value" id="level">1</span>
            </div>
            <div class="stat">
                <span class="stat-label">Experiência:</span>
                <span class="stat-value" id="experience">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">Habilidades:</span>
                <span class="stat-value" id="skills">0</span>
            </div>
        </section>

        <!-- Adicionar Desafio -->
        <section class="challenges">
            <h2>Desafios</h2>
            <input type="text" id="challengeDescription" placeholder="Descreva seu desafio">
            <button id="addChallengeBtn">Adicionar Desafio</button>
            <p id="challengeMessage"></p>
            <ul id="challengesList" class="text-limited"></ul>
        </section>

        <!-- Adicionar Aprendizado -->
        <section class="learnings">
            <h2>Aprendizados</h2>
            <input type="text" id="learningDescription" placeholder="Descreva seu aprendizado">
            <button id="addLearningBtn">Adicionar Aprendizado</button>
            <p id="learningMessage"></p>
            <ul id="learningsList" class="text-limited"></ul>
        </section>

        <div id="alert-container" style="display:none;">
            <p id="alert-message"></p>
            <button id="close-btn">Fechar</button>
        </div>

        <script type="module" src="script.js"></script>
    </div>
</body>
</html>
