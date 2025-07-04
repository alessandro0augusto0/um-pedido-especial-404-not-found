const hora = new Date().getHours();
if (hora > 18 || hora < 6) {
    document.body.classList.add('night-mode');
}

const video = document.getElementById('videoFundo');
const audioOverlay = document.getElementById('audioOverlay');
const muteBtn = document.getElementById('muteBtn');
let respostaMostrada = false;
let tentativas = 0;

const mensagensNao = [
    "Não", 
    "Tem certeza?", 
    "Pensa bem!", 
    "Olha o coração ali! ❤️", 
    "Vamos, clique no ❤️!",
    "Você é teimosa, hein? 😏",
    "O 'Sim' tá ali ó 👆",
    "Tá difícil? 😅",
    "Eu sei que você quer dizer Sim!",
    "O amor persiste, e eu também! ❤️"
];

function iniciarVideo() {
    video.muted = true;
    
    video.play()
        .then(() => {
            const ativarAudio = () => {
                video.muted = false;
                muteBtn.textContent = '🔊';
                muteBtn.title = 'Desativar som';
                audioOverlay.style.opacity = '0';
                setTimeout(() => {
                    audioOverlay.style.display = 'none';
                }, 500);
                document.removeEventListener('click', ativarAudio);
            };
            
            document.addEventListener('click', ativarAudio);
        })
        .catch(error => {
            audioOverlay.innerHTML = `
                <div class="audio-message">
                    <h2>Prepare-se ❤️</h2>
                    <p>Toque em qualquer lugar na tela</p>
                </div>
            `;
            
            const iniciarManual = () => {
                video.muted = false;
                video.play()
                    .then(() => {
                        muteBtn.textContent = '🔊';
                        audioOverlay.style.opacity = '0';
                        setTimeout(() => {
                            audioOverlay.style.display = 'none';
                        }, 500);
                    });
                document.removeEventListener('click', iniciarManual);
            };
            
            document.addEventListener('click', iniciarManual);
        });
}

function criarCoracoesFundo() {
    const heartBg = document.getElementById('heartBg');
    const numHearts = 25; // Quantidade de corações
    
    for (let i = 0; i < numHearts; i++) {
        const heart = document.createElement('span');
        heart.innerHTML = '❤️';
        
        // Posição inicial aleatória na parte inferior
        heart.style.left = `${Math.random() * 100}vw`;
        
        // Tamanho aleatório entre 10px e 40px
        const size = Math.random() * 30 + 10;
        heart.style.fontSize = `${size}px`;
        
        // Duração e delay aleatórios
        const duration = Math.random() * 15 + 10; // 10-25 segundos
        const delay = Math.random() * 5; // 0-5 segundos
        
        heart.style.animation = `float ${duration}s linear ${delay}s infinite`;
        
        // Opacidade aleatória
        heart.style.opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8
        
        // Adiciona um pouco de rotação aleatória
        heart.style.setProperty('--random-x', (Math.random() * 2 - 1).toFixed(2));
        
        heartBg.appendChild(heart);
    }
}

// Atualiza o contador de tentativas
function atualizarContador() {
    document.getElementById('contador').textContent = `Tentativas: ${tentativas}`;
}

// Move o botão "Não" de forma inteligente
function mudarPosicao() {
    if (respostaMostrada) return;
    
    tentativas++;
    atualizarContador();
    
    // Atualiza a mensagem
    const msgIndex = Math.min(tentativas - 1, mensagensNao.length - 1);
    document.getElementById('nao').textContent = mensagensNao[msgIndex];
    
    // Calcula nova posição
    const container = document.querySelector('.container');
    const button = document.getElementById('nao');
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    
    const maxX = containerRect.width - buttonRect.width;
    const maxY = containerRect.height / 2;
    
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    button.style.transition = 'all 0.2s ease-out';
    button.style.left = `${newX}px`;
    button.style.top = `${newY}px`;
    
    // Aumenta a dificuldade
    if (tentativas > 5) {
        button.style.fontSize = `${18 - Math.min(tentativas/2, 8)}px`;
    }
}

// Mostra a resposta quando clica no coração
function mostrarResposta() {
    if (respostaMostrada) return;
    respostaMostrada = true;
    
    const resposta = document.getElementById('resposta');
    resposta.textContent = 'Eu sabia que você ia aceitar ❤️';
    resposta.style.opacity = '1';
    
    // Mostra a data do pedido
    const agora = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('dataPedido').textContent = `Pedido aceito em: ${agora.toLocaleDateString('pt-BR', options)}`;
    document.getElementById('dataPedido').style.opacity = '1';
    
    // Efeito de confete
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff3366', '#ff6699', '#ff99cc', '#ffffff']
    });
    
    // Remove o botão "Não"
    document.getElementById('nao').style.display = 'none';
    
    // Adiciona mais corações
    for (let i = 0; i < 10; i++) {
        setTimeout(criarCoracoesFundo, i * 200);
    }
    
    // Ativa o áudio se ainda não estiver ativado
    if (video.muted) {
        video.muted = false;
        muteBtn.textContent = '🔊';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicia o vídeo
    setTimeout(iniciarVideo, 300);
    
    // Configura o botão de mudo
    muteBtn.addEventListener('click', function() {
        video.muted = !video.muted;
        this.textContent = video.muted ? '🔇' : '🔊';
        this.title = video.muted ? 'Ativar som' : 'Desativar som';
    });
    
    // Cria corações iniciais
    criarCoracoesFundo();
    
    // Configura o botão "Não"
    document.getElementById('nao').addEventListener('click', function(e) {
        e.preventDefault();
        mudarPosicao();
    });
    
    // Mostra textos com atraso
    document.querySelectorAll('p').forEach((p, index) => {
        setTimeout(() => {
            p.style.animation = 'fadeIn 1s forwards';
        }, index * 1500);
    });
});