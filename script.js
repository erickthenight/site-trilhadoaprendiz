/**
 * Arquivo script.js
 * * Este arquivo será usado para toda a interatividade da sua aplicação.
 * * COMO PROFESSOR, EU INDICO:
 * 1. Menu Mobile: Implemente a lógica de abrir/fechar o menu mobile.
 * 2. Animações: Adicione a biblioteca AOS (Animate on Scroll) para o scroll-reveal.
 * 3. Carrossel: Use uma biblioteca leve (como o Swiper ou Slick) para a Hero Section, se desejar.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Portal Trilha do Aprendiz carregado! Vamos codificar!");

    // 1. Lógica do Menu Mobile (EXEMPLO DE BAIXA COMPLEXIDADE)
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. Exemplo de uso de uma função JS para o Futuro:
    function simularBuscaDeMidia() {
        // No futuro, você pode usar a Fetch API aqui para buscar dados
        // de um arquivo JSON estático ou de um serviço externo (Custo Zero!).
        console.log("Mídia na Trilha: Dados estáticos carregados. Implemente a busca dinâmica!");
    }

    simularBuscaDeMidia();
});