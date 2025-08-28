// ===== ROLETA PROFISSIONAL COM GIRO MELHORADO - 4 SETORES =====

// Estados da máquina de estados da roleta
const ESTADOS_ROLETA = {
    IDLE: 'idle',
    SPINNING: 'spinning',
    STOPPING: 'stopping',
    STOPPED: 'stopped'
};

// Estado do jogo com gerenciamento robusto
let gameState = {
    // Estado da roleta
    estadoRoleta: ESTADOS_ROLETA.IDLE,
    anguloAtual: 0,
    velocidadeAtual: 0,
    tempoGiro: 0,
    
    // Controles de animação
    animacaoId: null,
    
    // Locks para prevenir ações simultâneas
    bloqueado: false,
    podeParar: false
};

// Elementos DOM
const elements = {
    btnGirar: document.getElementById('btn-girar'),
    btnParar: document.getElementById('btn-parar'),
    roleta: document.getElementById('roleta'),
    statusText: document.getElementById('status-text'),
    velocidadeBar: document.getElementById('velocidade-bar'),
    resultado: document.getElementById('resultado'),
    toastContainer: document.getElementById('toast-container'),
    particlesBg: document.getElementById('particles-bg'),
    roletaContainer: document.getElementById('roleta-gratis-container')
};

// Configurações da roleta - SIMPLIFICADA PARA 4 SETORES
const roletaConfig = {
    setores: [
        { premio: 25, cor: '#ff6b6b', angulo: 0 },    // Vermelho
        { premio: 50, cor: '#4ecdc4', angulo: 90 },   // Azul
        { premio: 75, cor: '#ffd700', angulo: 180 },  // Dourado
        { premio: 100, cor: '#9b59b6', angulo: 270 }  // Roxo
    ]
};

// ===== SISTEMA DE FÍSICA MELHORADO PARA GIRO ULTRA FLUIDO =====

class FisicaMelhorada {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.angulo = 0;
        this.velocidade = 0;
        this.aceleracao = 0;
        this.tempo = 0;
        this.fase = 'idle';
        this.parandoForcado = false;
        
        // Configurações otimizadas para movimento ultra fluido
        this.tempoAceleracao = 1200; // 1.2s - mais rápido e responsivo
        this.tempoDesaceleracao = 2800; // 2.8s - desaceleração mais natural
        this.velocidadeMaxima = 20 + Math.random() * 8; // 20-28 rpm - mais consistente
        this.velocidadeMinima = 3; // Velocidade inicial
        
        // Parâmetros para suavização ultra fluida
        this.inercia = 0.95; // Inércia otimizada
        this.ruido = 0;
        this.ultimaVelocidade = 0;
        this.suavizacao = 0.08; // Fator de suavização mais agressivo
        
        this.anguloAlvo = 0;
        this.frameCount = 0;
    }

    iniciarGiro() {
        this.reset();
        this.fase = 'acelerando';
        this.velocidade = this.velocidadeMinima;
        return null;
    }

    pararGiro() {
        if (this.fase === 'acelerando' || this.fase === 'constante') {
            this.parandoForcado = true;
            this.fase = 'desacelerando';
            this.tempo = 0;
            
            // Cálculo mais preciso do setor alvo (4 setores = 90° cada)
            const anguloAtual = this.angulo % 360;
            const setorAtual = Math.floor(anguloAtual / 90);
            
            // Determinar setor alvo com base na velocidade atual
            const voltasExtras = Math.max(3, Math.min(7, this.velocidade / 4));
            const setoresExtras = Math.floor(Math.random() * 2) + 2; // 2-3 setores extras
            const proximoSetor = (setorAtual + setoresExtras) % 4;
            
            this.anguloAlvo = this.angulo + (voltasExtras * 360) + 
                             (proximoSetor * 90) - (anguloAtual % 360);
            
            return proximoSetor;
        }
        return null;
    }

    atualizar(deltaTime) {
        // Normalizar deltaTime para 60fps com maior precisão
        const dt = Math.min(deltaTime, 20) / 16.67;
        this.tempo += deltaTime;
        this.frameCount++;
        
        // Salvar velocidade anterior para suavização ultra fluida
        this.ultimaVelocidade = this.velocidade;
        
        switch (this.fase) {
            case 'acelerando':
                this.atualizarAceleracaoUltraFluida(dt);
                break;
            case 'constante':
                this.atualizarConstanteUltraFluida(dt);
                break;
            case 'desacelerando':
                this.atualizarDesaceleracaoUltraFluida(dt);
                break;
        }

        // Aplicar suavização ultra fluida para eliminar qualquer jitter
        this.velocidade = this.lerp(this.ultimaVelocidade, this.velocidade, this.suavizacao);
        
        // Ruído mais sutil e natural
        this.ruido = Math.sin(this.tempo * 0.002) * 0.15 + 
                     Math.cos(this.tempo * 0.005) * 0.1;
        
        // Atualizar ângulo com movimento ultra suavizado
        const velocidadeFinal = this.velocidade + this.ruido;
        this.angulo += velocidadeFinal * dt * 0.5;

        return {
            angulo: this.angulo % 360,
            velocidade: Math.abs(velocidadeFinal),
            fase: this.fase,
            completo: this.fase === 'parado'
        };
    }

    atualizarAceleracaoUltraFluida(dt) {
        if (this.tempo < this.tempoAceleracao) {
            const progresso = this.tempo / this.tempoAceleracao;
            
            // Curva de aceleração ultra suave (ease-out-expo)
            const curva = progresso === 1 ? 1 : 1 - Math.pow(2, -10 * progresso);
            
            // Aceleração gradual ultra natural
            const velocidadeAlvo = this.velocidadeMinima + 
                                 (this.velocidadeMaxima - this.velocidadeMinima) * curva;
            
            this.velocidade = velocidadeAlvo;
        } else {
            this.fase = 'constante';
            this.velocidade = this.velocidadeMaxima;
        }
    }

    atualizarConstanteUltraFluida(dt) {
        // Variação ultra sutil para movimento mais natural
        const variacao1 = Math.sin(this.tempo * 0.0015) * 0.3;
        const variacao2 = Math.cos(this.tempo * 0.003) * 0.15;
        const variacao3 = Math.sin(this.tempo * 0.0008) * 0.4;
        
        this.velocidade = this.velocidadeMaxima + variacao1 + variacao2 + variacao3;
        
        // Manter velocidade dentro de limites ultra precisos
        this.velocidade = Math.max(this.velocidadeMaxima * 0.85, 
                                  Math.min(this.velocidadeMaxima * 1.15, this.velocidade));
    }

    atualizarDesaceleracaoUltraFluida(dt) {
        if (this.tempo < this.tempoDesaceleracao) {
            const progresso = this.tempo / this.tempoDesaceleracao;
            
            // Curva de desaceleração ultra realista (ease-out-quart)
            const curva = 1 - Math.pow(1 - progresso, 4);
            
            // Desaceleração ultra suave
            this.velocidade = this.velocidadeMaxima * (1 - curva);
            
            // Convergência para ângulo alvo ultra precisa
            if (progresso > 0.4) {
                const fatorConvergencia = (progresso - 0.4) / 0.6;
                const convergencia = this.easeOutQuart(fatorConvergencia);
                
                const diferenca = this.anguloAlvo - this.angulo;
                const ajuste = diferenca * convergencia * 0.006; // Ultra suave
                
                this.angulo += ajuste;
            }
        } else {
            this.fase = 'parado';
            this.velocidade = 0;
            this.angulo = this.anguloAlvo;
        }
    }

    // Funções de easing ultra suaves
    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
}

// ===== SISTEMA DE ÁUDIO MELHORADO =====

class AudioSystemMelhorado {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.volume = 0.2; // Volume mais baixo
        this.muted = false;
        this.init();
    }
    
    async init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = this.volume;
        } catch (e) {
            console.log('❌ Áudio não suportado:', e);
        }
    }
    
    play(type, velocidade = 1) {
        if (!this.context || this.muted) return;
        
        const agora = this.context.currentTime;
        
        switch (type) {
            case 'giroInicio':
                this.playGiroInicio(agora);
                break;
            case 'giroLoop':
                this.playGiroLoop(agora, velocidade);
                break;
            case 'parada':
                this.playParada(agora);
                break;
            case 'vitoria':
                this.playVitoria(agora);
                break;
        }
    }
    
    playGiroInicio(agora) {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.frequency.setValueAtTime(200, agora);
        oscillator.frequency.exponentialRampToValueAtTime(400, agora + 0.4);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.06, agora);
        gainNode.gain.exponentialRampToValueAtTime(0.001, agora + 0.8);
        
        oscillator.start(agora);
        oscillator.stop(agora + 0.8);
    }
    
    playGiroLoop(agora, velocidade) {
        // Som ultra sutil durante o giro
        if (Math.random() < 0.08) { // 8% de chance por frame
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            const freq = 140 + (velocidade * 4);
            oscillator.frequency.value = freq;
            oscillator.type = 'triangle';
            
            const volume = Math.min(0.02, velocidade * 0.001);
            gainNode.gain.setValueAtTime(volume, agora);
            gainNode.gain.exponentialRampToValueAtTime(0.001, agora + 0.08);
            
            oscillator.start(agora);
            oscillator.stop(agora + 0.08);
        }
    }
    
    playParada(agora) {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.frequency.setValueAtTime(400, agora);
        oscillator.frequency.exponentialRampToValueAtTime(200, agora + 1.5);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.05, agora);
        gainNode.gain.exponentialRampToValueAtTime(0.001, agora + 1.5);
        
        oscillator.start(agora);
        oscillator.stop(agora + 1.5);
    }
    
    playVitoria(agora) {
        // Sequência melódica para vitória
        const notas = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        
        notas.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            const startTime = agora + i * 0.15;
            gain.gain.setValueAtTime(0.03, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
            
            osc.start(startTime);
            osc.stop(startTime + 0.25);
        });
    }
}

// ===== SISTEMA DE EFEITOS VISUAIS ULTRA MELHORADO =====

class EfeitosVisuaisUltraMelhorados {
    constructor() {
        this.ultimaVelocidade = 0;
        this.transicaoSuave = 0.06; // Transição ultra suave
        this.particlePool = [];
        this.maxParticles = 15; // Reduzido para melhor performance
    }
    
    aplicarEfeitosVelocidade(velocidade) {
        if (!elements.roleta) return;
        
        // Suavizar mudanças de velocidade ultra fluidas
        this.ultimaVelocidade = this.lerp(this.ultimaVelocidade, velocidade, this.transicaoSuave);
        
        const velocidadeNormalizada = Math.min(1, this.ultimaVelocidade / 28);
        
        // Motion blur ultra sutil
        const blur = velocidadeNormalizada * 0.8;
        
        // Brilho ultra sutil
        const brilho = 1 + (velocidadeNormalizada * 0.1);
        
        // Saturação dinâmica ultra sutil
        const saturacao = 1 + (velocidadeNormalizada * 0.15);
        
        // Aplicar efeitos com transição ultra suave
        elements.roleta.style.filter = `blur(${blur}px) brightness(${brilho}) saturate(${saturacao})`;
        
        // Sombra dinâmica ultra sutil
        const sombra = velocidadeNormalizada * 15;
        const opacidadeSombra = velocidadeNormalizada * 0.2;
        elements.roleta.style.boxShadow = `0 0 ${sombra}px rgba(255, 215, 0, ${opacidadeSombra})`;
    }
    
    criarParticulasGiro() {
        if (!elements.particlesBg || this.particlePool.length >= this.maxParticles) return;
        
        const particula = document.createElement('div');
        const tamanho = Math.random() * 2.5 + 1;
        const cores = [
            'rgba(255, 107, 107, 0.3)', // Vermelho
            'rgba(76, 205, 196, 0.3)',  // Azul
            'rgba(255, 215, 0, 0.4)',   // Dourado
            'rgba(155, 89, 182, 0.3)'   // Roxo
        ];
        
        particula.style.cssText = `
            position: absolute;
            width: ${tamanho}px;
            height: ${tamanho}px;
            background: ${cores[Math.floor(Math.random() * cores.length)]};
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleGiroUltraFluido 1.2s ease-out forwards;
            will-change: transform, opacity;
        `;
        
        elements.particlesBg.appendChild(particula);
        this.particlePool.push(particula);
        
        setTimeout(() => {
            if (particula.parentNode) {
                particula.parentNode.removeChild(particula);
                const index = this.particlePool.indexOf(particula);
                if (index > -1) this.particlePool.splice(index, 1);
            }
        }, 1200);
    }
    
    criarConfetes() {
        if (!elements.particlesBg) return;
        
        for (let i = 0; i < 25; i++) {
            const confete = document.createElement('div');
            const cores = ['#ff6b6b', '#4ecdc4', '#ffd700', '#9b59b6'];
            
            confete.style.cssText = `
                position: absolute;
                width: ${Math.random() * 5 + 2}px;
                height: ${Math.random() * 5 + 2}px;
                background: ${cores[Math.floor(Math.random() * cores.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                pointer-events: none;
                animation: confeteFallUltraFluido ${1.2 + Math.random() * 1.8}s ease-out forwards;
                animation-delay: ${Math.random() * 1.2}s;
                will-change: transform;
            `;
            
            elements.particlesBg.appendChild(confete);
        }
        
        setTimeout(() => {
            const confetes = elements.particlesBg.querySelectorAll('div');
            confetes.forEach(confete => {
                if (confete.style.animation.includes('confeteFallUltraFluido')) {
                    confete.remove();
                }
            });
        }, 3500);
    }
    
    limparEfeitos() {
        if (elements.roleta) {
            elements.roleta.style.filter = '';
            elements.roleta.style.boxShadow = '';
        }
        this.particlePool = [];
    }
    
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
}

// ===== INSTÂNCIAS DOS SISTEMAS MELHORADOS =====
const fisica = new FisicaMelhorada();
const audioSystem = new AudioSystemMelhorado();
const efeitos = new EfeitosVisuaisUltraMelhorados();

// ===== FUNÇÕES PRINCIPAIS ULTRA MELHORADAS =====

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎰 Inicializando RoletaWin Ultra Melhorada...');
    
    // Verificar elementos essenciais
    if (!verificarElementos()) {
        console.error('❌ Elementos essenciais não encontrados');
        return;
    }
    
    // Inicializar sistemas
    inicializarEventListeners();
    adicionarEstilosUltraMelhorados();
    criarParticulas();
    
    // Estado inicial
    gameState.estadoRoleta = ESTADOS_ROLETA.IDLE;
    
    if (elements.statusText) {
        elements.statusText.textContent = 'Roleta ultra melhorada pronta! Clique em GIRAR para começar.';
    }
    
    console.log('✅ RoletaWin Ultra Melhorada inicializada com sucesso!');
});

// Verificar elementos DOM
function verificarElementos() {
    const elementosEssenciais = ['btnGirar', 'roleta'];
    
    for (const elemento of elementosEssenciais) {
        if (!elements[elemento]) {
            console.error(`❌ Elemento ${elemento} não encontrado`);
            return false;
        }
    }
    
    return true;
}

// Adicionar estilos CSS ultra melhorados
function adicionarEstilosUltraMelhorados() {
    const style = document.createElement('style');
    style.textContent = `
        /* Animações ultra fluidas para partículas */
        @keyframes particleGiroUltraFluido {
            0% {
                transform: translateY(0) scale(0) rotate(0deg);
                opacity: 0;
            }
            15% {
                opacity: 1;
            }
            100% {
                transform: translateY(-40px) scale(1.2) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes confeteFallUltraFluido {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        /* Roleta ultra melhorada */
        #roleta {
            transition: filter 0.2s ease, box-shadow 0.2s ease;
            will-change: transform;
            transform-origin: center center;
        }
        
        /* Otimizações de performance ultra */
        .toast {
            will-change: transform;
        }
        
        /* Efeitos de hover ultra suaves */
        .btn-jogar {
            transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .btn-jogar:hover {
            transform: translateY(-1px) scale(1.02);
        }
        
        /* Indicador de velocidade ultra fluido */
        #velocidade-bar {
            transition: width 0.1s ease, background-color 0.2s ease;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar event listeners
function inicializarEventListeners() {
    if (!elements.btnGirar || !elements.btnParar) {
        console.error('❌ Elementos de botão não encontrados');
        return;
    }
    
    elements.btnGirar.addEventListener('click', (e) => {
        criarEfeitoRipple(e, elements.btnGirar);
        handleGirarClick();
    });
    
    if (elements.btnParar) {
        elements.btnParar.addEventListener('click', (e) => {
            criarEfeitoRipple(e, elements.btnParar);
            handlePararClick();
        });
    }
    
    // Eventos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !gameState.bloqueado) {
            e.preventDefault();
            if (gameState.estadoRoleta === ESTADOS_ROLETA.IDLE) {
                handleGirarClick();
            } else if (gameState.estadoRoleta === ESTADOS_ROLETA.SPINNING) {
                handlePararClick();
            }
        }
    });
}

// Handle click no botão girar
function handleGirarClick() {
    if (gameState.bloqueado || gameState.estadoRoleta !== ESTADOS_ROLETA.IDLE) {
        return;
    }
    
    iniciarGiroUltraMelhorado();
}

// Handle click no botão parar
function handlePararClick() {
    if (gameState.bloqueado || gameState.estadoRoleta !== ESTADOS_ROLETA.SPINNING) {
        return;
    }
    
    pararGiroUltraMelhorado();
}

// ===== FUNÇÃO PRINCIPAL: INICIAR GIRO ULTRA MELHORADO =====
function iniciarGiroUltraMelhorado() {
    if (gameState.bloqueado) return;
    
    console.log('🎯 Iniciando giro ultra melhorado');
    
    // Bloquear ações e definir estado
    gameState.bloqueado = true;
    gameState.estadoRoleta = ESTADOS_ROLETA.SPINNING;
    gameState.tempoGiro = 0;
    gameState.podeParar = false;
    
    // Resetar física
    fisica.reset();
    fisica.angulo = gameState.anguloAtual;
    fisica.iniciarGiro();
    
    // Atualizar interface
    trocarBotoes(true);
    
    // Efeitos
    audioSystem.play('giroInicio');
    
    // Iniciar loop de animação ultra melhorado
    iniciarLoopAnimacaoUltraMelhorado();
    
    mostrarToast('Roleta ultra melhorada girando! Movimento fluido e profissional.', 'info');
}

// ===== LOOP DE ANIMAÇÃO ULTRA MELHORADO =====
function iniciarLoopAnimacaoUltraMelhorado() {
    let ultimoTempo = performance.now();
    
    function loop(tempoAtual) {
        if (gameState.estadoRoleta === ESTADOS_ROLETA.STOPPED) {
            return; // Parar loop
        }
        
        const deltaTime = tempoAtual - ultimoTempo;
        ultimoTempo = tempoAtual;
        
        // Atualizar tempo de giro
        gameState.tempoGiro += deltaTime;
        
        // Atualizar física ultra melhorada
        const estadoFisica = fisica.atualizar(deltaTime);
        
        // Atualizar estado do jogo
        gameState.anguloAtual = estadoFisica.angulo;
        gameState.velocidadeAtual = estadoFisica.velocidade;
        
        // Aplicar rotação com transform ultra otimizado
        if (elements.roleta) {
            elements.roleta.style.transform = `rotate(${gameState.anguloAtual}deg)`;
        }
        
        // Efeitos visuais ultra melhorados
        efeitos.aplicarEfeitosVelocidade(gameState.velocidadeAtual);
        
        // Atualizar indicadores ultra precisos
        atualizarIndicadoresUltraMelhorados(estadoFisica);
        
        // Som durante o giro ultra sutil
        audioSystem.play('giroLoop', gameState.velocidadeAtual);
        
        // Criar partículas durante o giro (ultra otimizado)
        if (gameState.velocidadeAtual > 12 && Math.random() < 0.12) {
            efeitos.criarParticulasGiro();
        }
        
        // Habilitar botão parar após aceleração
        if (estadoFisica.fase === 'constante' && !gameState.podeParar) {
            gameState.podeParar = true;
            if (elements.btnParar) {
                elements.btnParar.disabled = false;
            }
        }
        
        // Verificar se terminou
        if (estadoFisica.completo) {
            finalizarGiroUltraMelhorado();
            return;
        }
        
        // Continuar loop
        gameState.animacaoId = requestAnimationFrame(loop);
    }
    
    gameState.animacaoId = requestAnimationFrame(loop);
}

// ===== PARAR GIRO ULTRA MELHORADO =====
function pararGiroUltraMelhorado() {
    if (gameState.estadoRoleta !== ESTADOS_ROLETA.SPINNING || !gameState.podeParar) {
        return;
    }
    
    console.log('🛑 Parando giro ultra melhorado');
    
    gameState.estadoRoleta = ESTADOS_ROLETA.STOPPING;
    
    // Iniciar desaceleração ultra suave
    const setorAlvo = fisica.pararGiro();
    gameState.setorAlvo = setorAlvo;
    
    // Atualizar interface
    if (elements.btnParar) {
        elements.btnParar.disabled = true;
    }
    
    mostrarToast('Desaceleração ultra suave iniciada! A roleta está parando com precisão...', 'warning');
}

// ===== FINALIZAR GIRO ULTRA MELHORADO =====
function finalizarGiroUltraMelhorado() {
    console.log('🏁 Finalizando giro ultra melhorado');
    
    // Atualizar estado
    gameState.estadoRoleta = ESTADOS_ROLETA.STOPPED;
    gameState.bloqueado = false;
    
    // Limpar animações
    if (gameState.animacaoId) {
        cancelAnimationFrame(gameState.animacaoId);
        gameState.animacaoId = null;
    }
    
    // Limpar efeitos visuais gradualmente
    setTimeout(() => {
        efeitos.limparEfeitos();
    }, 600);
    
    // Resetar indicadores
    if (elements.velocidadeBar) {
        elements.velocidadeBar.style.width = '0%';
    }
    
    // Som de parada
    audioSystem.play('parada');
    
    // Calcular resultado final (4 setores = 90° cada)
    const anguloFinal = (360 - (gameState.anguloAtual % 360)) % 360;
    const setorIndex = Math.floor(anguloFinal / 90);
    const setorResultado = roletaConfig.setores[setorIndex];
    
    gameState.velocidadeAtual = 0;
    
    // Resetar estado da roleta
    gameState.estadoRoleta = ESTADOS_ROLETA.IDLE;
    
    // Mostrar resultado com delay
    setTimeout(() => {
        if (setorResultado.premio > 0) {
            efeitos.criarConfetes();
            audioSystem.play('vitoria');
        }
        
        mostrarResultadoUltraMelhorado(setorResultado);
        
        // Resetar para próximo giro
        setTimeout(() => {
            trocarBotoes(false);
            if (elements.statusText) {
                elements.statusText.textContent = 'Roleta ultra melhorada pronta! Movimento fluido e profissional.';
            }
        }, 3000);
    }, 900);
}

// ===== FUNÇÕES DE INTERFACE ULTRA MELHORADAS =====

// Trocar botões
function trocarBotoes(girando) {
    if (!elements.btnGirar) return;
    
    if (girando) {
        elements.btnGirar.classList.add('hidden');
        if (elements.btnParar) {
            elements.btnParar.classList.remove('hidden');
            elements.btnParar.disabled = true; // Será habilitado após aceleração
        }
    } else {
        if (elements.btnParar) {
            elements.btnParar.classList.add('hidden');
        }
        elements.btnGirar.classList.remove('hidden');
    }
}

// Atualizar indicadores ultra melhorados
function atualizarIndicadoresUltraMelhorados(estadoFisica) {
    // Atualizar status
    let statusText = '';
    const tempoMinutos = Math.floor(gameState.tempoGiro / 60000);
    const tempoSegundos = Math.floor((gameState.tempoGiro % 60000) / 1000);
    const tempoFormatado = `${tempoMinutos}:${tempoSegundos.toString().padStart(2, '0')}`;
    
    switch (estadoFisica.fase) {
        case 'acelerando':
            statusText = `Aceleração ultra suave... ${estadoFisica.velocidade.toFixed(1)} rpm`;
            break;
        case 'constante':
            statusText = `Movimento ultra fluido... ${estadoFisica.velocidade.toFixed(1)} rpm (${tempoFormatado})`;
            break;
        case 'desacelerando':
            statusText = `Parada ultra precisa... ${estadoFisica.velocidade.toFixed(1)} rpm`;
            break;
    }
    
    if (elements.statusText) {
        elements.statusText.textContent = statusText;
    }
    
    // Atualizar barra de velocidade ultra suave
    if (elements.velocidadeBar) {
        const porcentagem = (estadoFisica.velocidade / 28) * 100;
        elements.velocidadeBar.style.width = `${Math.min(100, porcentagem)}%`;
        
        // Cor dinâmica baseada na velocidade (4 cores dos setores)
        let cor;
        if (estadoFisica.velocidade < 7) {
            cor = '#ff6b6b'; // Vermelho
        } else if (estadoFisica.velocidade < 14) {
            cor = '#4ecdc4'; // Azul
        } else if (estadoFisica.velocidade < 21) {
            cor = '#ffd700'; // Dourado
        } else {
            cor = '#9b59b6'; // Roxo
        }
        
        elements.velocidadeBar.style.backgroundColor = cor;
    }
}

// Mostrar resultado ultra melhorado
function mostrarResultadoUltraMelhorado(setor) {
    const isWin = setor.premio > 0;
    
    if (elements.resultado) {
        elements.resultado.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 15px;">
                    ${isWin ? '🎉' : '😔'}
                </div>
                <div style="font-size: 2rem; margin-bottom: 10px; color: ${setor.cor};">
                    R$ ${setor.premio},00
                </div>
                <div style="font-size: 1.2rem; opacity: 0.9;">
                    ${isWin ? 'Parabéns! Movimento ultra fluido e prêmio garantido!' : 'Tente novamente com a roleta ultra melhorada!'}
                </div>
            </div>
        `;
        
        elements.resultado.classList.add('show');
        
        setTimeout(() => {
            elements.resultado.classList.remove('show');
        }, 5000);
    }
}

// ===== FUNÇÕES AUXILIARES ULTRA MELHORADAS =====

// Criar efeito ripple ultra melhorado
function criarEfeitoRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transform: scale(0);
        animation: rippleUltraMelhorado 0.4s ease-out;
        pointer-events: none;
        will-change: transform;
    `;
    
    // Adicionar animação CSS se não existir
    if (!document.querySelector('#ripple-ultra-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-ultra-style';
        style.textContent = `
            @keyframes rippleUltraMelhorado {
                to {
                    transform: scale(2.2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
}

// Toast notifications ultra melhoradas
function mostrarToast(mensagem, tipo = 'info') {
    if (!elements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensagem;
    
    const estilos = {
        success: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
        error: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
        warning: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
        info: 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)'
    };
    
    toast.style.background = estilos[tipo] || estilos.info;
    toast.style.color = tipo === 'warning' ? '#0a0e27' : '#ffffff';
    toast.style.willChange = 'transform';
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Criar partículas de fundo ultra melhoradas
function criarParticulas() {
    if (!elements.particlesBg) return;
    
    for (let i = 0; i < 16; i++) { // Reduzido para melhor performance
        const particula = document.createElement('div');
        const tamanho = Math.random() * 3.5 + 1;
        const cores = [
            'rgba(255, 107, 107, 0.2)', // Vermelho
            'rgba(76, 205, 196, 0.2)',  // Azul
            'rgba(255, 215, 0, 0.25)',  // Dourado
            'rgba(155, 89, 182, 0.2)'   // Roxo
        ];
        
        particula.style.cssText = `
            position: absolute;
            width: ${tamanho}px;
            height: ${tamanho}px;
            background: ${cores[Math.floor(Math.random() * cores.length)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            filter: blur(0.3px);
            animation: particleFloatUltraFluido ${22 + Math.random() * 18}s linear infinite;
            animation-delay: ${Math.random() * 8}s;
            will-change: transform;
        `;
        
        elements.particlesBg.appendChild(particula);
    }
    
    // Adicionar CSS para animação de partículas se não existir
    if (!document.querySelector('#particle-ultra-style')) {
        const style = document.createElement('style');
        style.id = 'particle-ultra-style';
        style.textContent = `
            @keyframes particleFloatUltraFluido {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.2;
                }
                50% {
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

console.log('🎰 RoletaWin Ultra Melhorada carregada com sucesso! 4 setores, movimento ultra fluido e profissional!');

