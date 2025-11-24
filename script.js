/**
 * Arquivo script.js
 * Lógica funcional completa para menu mobile e implementação da Rádio Online Regionalizada.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Portal Trilha do Aprendiz carregado! Interatividade e Geolocalização ativadas.");

    // --- 1. LÓGICA DO MENU MOBILE (Seu Código de UX) ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Alternar ícone do menu
            const icon = menuToggle.querySelector('svg');
            if (mobileMenu.classList.contains('hidden')) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            }
        });
        
        // Fechar menu ao clicar em um link (mobile)
        const mobileLinks = document.querySelectorAll('#mobile-menu a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = menuToggle.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
            });
        });
    }

    // --- 2. SISTEMA DE ANIMAÇÕES AO SCROLL (Seu Código de Estética) ---
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // --- 3. FEEDBACK VISUAL PARA INTERAÇÕES (Seu Código de Estética) ---
    document.querySelectorAll('.card-hover').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // --- 4. LÓGICA DA RÁDIO ONLINE REGIONALIZADA (NOVA FUNCIONALIDADE) ---
    
    const radioPlayer = document.getElementById('audio-player');
    const radioTitle = document.getElementById('radio-title');
    const radioStatus = document.getElementById('radio-status');

    if (radioPlayer && radioTitle && radioStatus) { // Executa somente na página do podcast
        
        // Fórmula de Haversine para calcular distância em KM
        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Raio da Terra em km
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distância em km
        }

        // Encontra e carrega a rádio mais próxima ou a Nacional (fallback)
        function loadRegionalRadio(userLat, userLon, radioStations) {
            let closestRadio = null;
            let minDistance = Infinity;
            let nationalRadio = radioStations.find(s => s.cidade.includes('Nacional'));

            // 1. Encontra a rádio regional mais próxima
            radioStations.forEach(station => {
                if (!station.cidade.includes('Nacional')) {
                    const distance = calculateDistance(userLat, userLon, station.lat, station.lon);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestRadio = station;
                    }
                }
            });
            
            // 2. Define o player: Usa a rádio mais próxima ou fallback para a Nacional
            if (!closestRadio || minDistance > 500) { 
                closestRadio = nationalRadio;
            }

            // 3. Atualiza o Player
            if (closestRadio) {
                radioPlayer.src = closestRadio.stream_url;
                radioTitle.textContent = `${closestRadio.nome} (${closestRadio.cidade})`;
                radioStatus.textContent = "Rádio regionalizada carregada com sucesso! Dê play abaixo.";
                radioPlayer.load(); // Carrega o novo stream
            } else {
                radioStatus.textContent = "Erro ao carregar lista de rádios.";
            }
        }
        
        // Inicia o processo
        fetch('radio_data.json')
            .then(response => response.json())
            .then(radioStations => {
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            // Sucesso: Carrega a rádio mais próxima
                            loadRegionalRadio(position.coords.latitude, position.coords.longitude, radioStations);
                        },
                        (error) => {
                            // Falha: Usa a rádio Nacional como fallback
                            console.error("Erro na Geolocalização:", error);
                            radioStatus.textContent = "Falha ao obter localização. Carregando rádio Nacional...";
                            loadRegionalRadio(0, 0, radioStations); // Usa 0,0 para forçar o fallback
                        }
                    );
                } else {
                    // Navegador não suporta geolocalização: Usa a rádio Nacional como fallback
                    radioStatus.textContent = "Seu navegador não suporta geolocalização. Carregando rádio Nacional...";
                    loadRegionalRadio(0, 0, radioStations); // Usa 0,0 para forçar o fallback
                }
            })
            .catch(error => {
                console.error("Erro ao carregar dados do JSON:", error);
                radioStatus.textContent = "Erro ao carregar dados de rádio.";
            });
    }

    console.log("Mídia na Trilha: Dados estáticos carregados. Implemente a busca dinâmica!");
});