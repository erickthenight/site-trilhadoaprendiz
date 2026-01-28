// SISTEMA DE GAMIFICAÇÃO TRILHA DO APRENDIZ v1.0
// Autor: Erick Mattos (Yakami Tech)

const SistemaXP = {
    // Carrega dados ou cria perfil novo
    carregarPerfil: () => {
        let perfil = JSON.parse(localStorage.getItem('trilha_perfil'));
        if (!perfil) {
            perfil = {
                nome: "Jovem Aprendiz",
                nivel: 1,
                xp_atual: 0,
                xp_proximo_nivel: 100,
                medalhas: []
            };
            localStorage.setItem('trilha_perfil', JSON.stringify(perfil));
        }
        return perfil;
    },

    // Ganhar Pontos
    ganharXP: (qtd, motivo) => {
        let perfil = SistemaXP.carregarPerfil();
        perfil.xp_atual += qtd;
        
        // Lógica de Level Up
        if(perfil.xp_atual >= perfil.xp_proximo_nivel) {
            perfil.nivel++;
            perfil.xp_atual = perfil.xp_atual - perfil.xp_proximo_nivel;
            perfil.xp_proximo_nivel = Math.floor(perfil.xp_proximo_nivel * 1.5); // Dificulta o próximo nível
            alert(`🎉 PARABÉNS! Você subiu para o Nível ${perfil.nivel}!`);
        } else {
            // Notificação simples (tipo Toast)
            console.log(`+${qtd} XP: ${motivo}`);
        }

        localStorage.setItem('trilha_perfil', JSON.stringify(perfil));
        SistemaXP.atualizarInterface();
    },

    // Atualiza a tela (HUD)
    atualizarInterface: () => {
        const perfil = SistemaXP.carregarPerfil();
        
        // Procura elementos na tela para atualizar (se existirem)
        const elNome = document.getElementById('hud-nome');
        const elNivel = document.getElementById('hud-nivel');
        const elBarra = document.getElementById('hud-barra-fill');
        const elTextoXP = document.getElementById('hud-xp-texto');

        if(elNome) elNome.innerText = perfil.nome;
        if(elNivel) elNivel.innerText = perfil.nivel;
        if(elTextoXP) elTextoXP.innerText = `${perfil.xp_atual}/${perfil.xp_proximo_nivel} XP`;
        
        if(elBarra) {
            const porcentagem = (perfil.xp_atual / perfil.xp_proximo_nivel) * 100;
            elBarra.style.width = `${porcentagem}%`;
        }
    }
};

// Inicializa ao abrir o site
document.addEventListener('DOMContentLoaded', () => {
    SistemaXP.atualizarInterface();
});