// --- LÓGICA DO MINI-JOGO RPG ---
        
// Espera o DOM carregar para iniciar o jogo
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    // Verifica se o canvas existe antes de continuar
    if (!canvas) {
        // Se o canvas não for encontrado, não faz nada.
        // Isto é normal em páginas que não têm o jogo, como o index.html.
        return;
    }

    const ctx = canvas.getContext('2d');
    const popup = document.getElementById('mission-popup');

    // --- Variáveis do Jogo ---
    const TILE_SIZE = 40; // Tamanho de cada "pixel" do nosso jogo
    let popupTimer = null; // Timer para esconder o popup

    // Definições do Avatar (Aprendiz)
    const player = {
        x: TILE_SIZE * 2,
        y: TILE_SIZE * 5,
        width: TILE_SIZE,
        height: TILE_SIZE * 1.5, // Um pouco mais alto para parecer um personagem
        color: '#0F46B9', // Azul do manual
        headColor: '#a5f3fc', // Um tom de ciano claro para a cabeça
        speed: TILE_SIZE / 2, // Movimento em "grades"
        lastMove: null
    };

    // Definições das "Missões" (Prédios)
    const missions = [
        {
            x: TILE_SIZE * 5, y: TILE_SIZE * 2,
            width: TILE_SIZE * 3, height: TILE_SIZE * 2,
            color: '#FFB80F', // Amarelo do manual
            roofColor: '#eab308', // Amarelo mais escuro para o telhado
            name: "ESCRITORIO",
            message: "Nova Missão: Simulação de Entrevista!"
        },
        {
            x: TILE_SIZE * 12, y: TILE_SIZE * 7,
            width: TILE_SIZE * 4, height: TILE_SIZE * 3,
            color: '#FFB80F',
            roofColor: '#eab308',
            name: "FABRICA",
            message: "Quest: Segurança do Trabalho!"
        },
        {
            x: TILE_SIZE * 17, y: TILE_SIZE * 2,
            width: TILE_SIZE * 2, height: TILE_SIZE * 2,
            color: '#FFB80F',
            roofColor: '#eab308',
            name: "LOJA",
            message: "Desafio: Atendimento ao Cliente!"
        }
    ];
    
    // Cenário (Árvores)
    const scenery = [
        // (x, y, tamanho_da_copa, cor_da_copa, cor_do_tronco)
        { x: TILE_SIZE * 1, y: TILE_SIZE * 1, w: TILE_SIZE, h: TILE_SIZE, trunkH: TILE_SIZE / 2 },
        { x: TILE_SIZE * 8, y: TILE_SIZE * 4, w: TILE_SIZE, h: TILE_SIZE, trunkH: TILE_SIZE / 2 },
        { x: TILE_SIZE * 3, y: TILE_SIZE * 9, w: TILE_SIZE, h: TILE_SIZE, trunkH: TILE_SIZE / 2 },
        { x: TILE_SIZE * 15, y: TILE_SIZE * 5, w: TILE_SIZE, h: TILE_SIZE, trunkH: TILE_SIZE / 2 }
    ];

    // --- Funções de Desenho ---
    function drawPlayer() {
        // Corpo
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y + (TILE_SIZE / 2), player.width, player.height - (TILE_SIZE / 2));
        
        // Cabeça
        ctx.fillStyle = player.headColor;
        ctx.fillRect(player.x + (TILE_SIZE / 4), player.y, player.width / 2, TILE_SIZE / 2);
    }

    function drawMissions() {
        ctx.font = "12px 'Press Start 2P'";
        ctx.textAlign = "center";
        
        missions.forEach(mission => {
            // Desenha a base do prédio
            ctx.fillStyle = mission.color;
            ctx.fillRect(mission.x, mission.y, mission.width, mission.height);
            
            // Desenha o Telhado
            ctx.fillStyle = mission.roofColor;
            ctx.beginPath();
            ctx.moveTo(mission.x - 5, mission.y);
            ctx.lineTo(mission.x + mission.width / 2, mission.y - 15);
            ctx.lineTo(mission.x + mission.width + 5, mission.y);
            ctx.closePath();
            ctx.fill();

            // Desenha a borda
            ctx.strokeStyle = '#191919';
            ctx.lineWidth = 4;
            ctx.strokeRect(mission.x, mission.y, mission.width, mission.height);

            // Desenha o nome
            ctx.fillStyle = '#191919';
            ctx.fillText(mission.name, mission.x + mission.width / 2, mission.y - 20); // Ajusta Y para o telhado
        });
    }
    
    // Desenha o Cenário
    function drawScenery() {
        scenery.forEach(tree => {
            // Tronco
            ctx.fillStyle = '#78350f'; // Marrom escuro
            ctx.fillRect(tree.x + tree.w / 3, tree.y + tree.h - tree.trunkH, tree.w / 3, tree.trunkH);
            
            // Copa
            ctx.fillStyle = '#22c55e'; // Verde vivo
            ctx.fillRect(tree.x, tree.y, tree.w, tree.h - tree.trunkH);
        });
    }

    // --- Função de Popup ---
    function showMissionPopup(message) {
        // Se já houver um popup, limpa o timer antigo
        if (popupTimer) {
            clearTimeout(popupTimer);
        }
        
        // Verifica se o elemento popup existe
        if (popup) {
            popup.textContent = message;
            popup.style.display = 'block';
        } else {
            console.warn("Elemento 'mission-popup' não encontrado.");
        }


        // Esconde o popup depois de 3 segundos
        popupTimer = setTimeout(() => {
            if (popup) {
                popup.style.display = 'none';
            }
            popupTimer = null; // Limpa o timer
        }, 3000);
    }

    // --- Controlo de Colisão ---
    function checkCollisions() {
        let collided = false;

        // 1. Colisão com Missões
        missions.forEach(mission => {
            if (
                player.x < mission.x + mission.width &&
                player.x + player.width > mission.x &&
                player.y < mission.y + mission.height &&
                player.y + player.height > mission.y
            ) {
                collided = true;
                showMissionPopup(mission.message);
            }
        });

        // 2. Colisão com Cenário
        scenery.forEach(tree => {
             if (
                player.x < tree.x + tree.w &&
                player.x + player.width > tree.x &&
                player.y < tree.y + tree.h &&
                player.y + player.height > tree.y
            ) {
                collided = true;
                showMissionPopup("Uma árvore! Não dá para passar.");
            }
        });
        
        // Impede o jogador de "entrar" no prédio ou árvore
        if (collided) {
            if (player.lastMove === 'ArrowRight') player.x -= player.speed;
            if (player.lastMove === 'ArrowLeft') player.x += player.speed;
            if (player.lastMove === 'ArrowDown') player.y -= player.speed;
            if (player.lastMove === 'ArrowUp') player.y += player.speed;
        }
    }
    
    // --- Controlo de Input ---
    function handleInput(e) {
        // Impede a página de rolar com as setas
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }

        player.lastMove = e.key; // Guarda o último movimento

        switch (e.key) {
            case 'ArrowUp':
                if (player.y > 0) player.y -= player.speed;
                break;
            case 'ArrowDown':
                if (player.y < canvas.height - player.height) player.y += player.speed;
                break;
            case 'ArrowLeft':
                if (player.x > 0) player.x -= player.speed;
                break;
            case 'ArrowRight':
                if (player.x < canvas.width - player.width) player.x += player.speed;
                break;
        }
    }
    
    // --- Game Loop ---
    function gameLoop() {
        // 1. Limpa a tela
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 2. Desenha o cenário
        drawScenery();
        
        // 3. Desenha os prédios/missões
        drawMissions();
        
        // 4. Desenha o jogador
        drawPlayer();
        
        // 5. Verifica colisões
        checkCollisions();
        
        // Chama o próximo frame
        requestAnimationFrame(gameLoop);
    }

    // --- Inicia o Jogo ---
    window.addEventListener('keydown', handleInput);
    gameLoop(); // Inicia o loop do jogo!
});