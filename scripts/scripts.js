/*-----------------------------------------------------
COMPORTAMENTOS GERAIS
------------------------------------------------------*/

//Recarrega a página quando redimensiona a tela
window.onresize = function(){ location.reload(); }





/*-----------------------------------------------------
OBJETOS GERAIS
------------------------------------------------------*/

//Game board
const board = document.querySelector("#game_board");

//Tamanho do board
const board_width = board.clientWidth;
const board_height = board.clientHeight;

//Tamanho original da imagem de fundo
const bg0_width = 1920;
const bg0_height = 1080;

//Tamanho proporcional da imagem de fundo
const bg1_width = Math.round((bg0_width * board_height) / bg0_height);
const bg1_height = board_height;

//Sons
const jackat_jump_sound = new Audio('sounds/jackat_jump.mp3');
const novelo_pick_sound = new Audio('sounds/novelo.mp3');
const musica_jogo_sound = new Audio('sounds/musica_jogo.mp3');
const balao_estourando_sound = new Audio('sounds/balao.mp3');
const game_over_sound = new Audio('sounds/game_over.mp3');



/*-----------------------------------------------------
CONFIGURAÇÕES
------------------------------------------------------*/

//Gerais
const game_url = "https://jackat.midiadigital.info"
const season_duration = 30; //Tempo de duração de cada seção em segundos.
var velocidade_predios = 10000; //em milessegundos
var velocidade_cenario = 3000; //em milessegundos
const velocidade_rato = 2500; //em milessegundos
const velocidade_pulo = 1000; //em milessegundos
const position_h_choque = (board_width * 20) / 100; //porcentagem da largura da tela



/*-----------------------------------------------------
CONTROLES DO JOGO
------------------------------------------------------*/

//Controle movimentos
var jackat_lives = true;
var jump_locked = false;
var timeout_jump = null;

//Cálculo da velocidade da tela em pixels por milessegundo
var px_ms = board_width/velocidade_cenario;

//Contagem de tempo
var play_time = 0;
var season_time = 0;
var season_atual = 0;

//Contagem pontos
const meta_novelos = 40;
var novelos_coletados = 0;
var meta_pct = 0;
var placar_size = 100 //tamanho da máscara do placar. Começa em 100% e diminui para mostrar avanço;

//Monitoramento dos objetos
var anima_novelos = [];
var anima_obstaculos = [];
var timeout_novelos = [];
var timeout_obstaculos = [];




/*-----------------------------------------------------
PRELOAD DAS IMAGENS
------------------------------------------------------*/
var images = [];
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

preload(
    game_url+"/images/cenario_primavera.png",
    game_url+"/images/cenario_verao.png",
    game_url+"/images/cenario_outono.png",
    game_url+"/images/cenario_inverno.png",

    game_url+"/images/cidade.png",

    game_url+"/images/ceu_primavera.png",
    game_url+"/images/ceu_verao.png",
    game_url+"/images/ceu_outono.png",
    game_url+"/images/ceu_inverno.png",

    game_url+"/images/jackat.gif",
    game_url+"/images/jackat-normal.gif",
    game_url+"/images/jackat-pulando.gif",
    game_url+"/images/rato.gif",

    game_url+"/images/novelo_azul.png",
    game_url+"/images/novelo_laranja.png",
    game_url+"/images/novelo_rosa.png",
    game_url+"/images/novelo_verde.png",

    game_url+"/images/balao_estourando.png",
    game_url+"/images/balao.png",
    game_url+"/images/boneco_neve_1.png",
    game_url+"/images/boneco_neve_2.png",
    game_url+"/images/cachorro.png",
    game_url+"/images/floco_neve.png",
    game_url+"/images/passaro.gif",

)





/*-----------------------------------------------------
FUNÇÕES GERAIS
------------------------------------------------------*/

//Retorna array com número aleatórios que representam
//o tempo de jogo de aparecimento de objetos
function random_time(max,qtd,avoid=false) {

    var i, arr = [];
    for (i = 0; i < max; i++) {
        arr[i] = i + 1;
    }

    var p, n, tmp;
    for (p = arr.length; p;) {
        n = Math.random() * p-- | 0;
        tmp = arr[n];
        arr[n] = arr[p];
        arr[p] = tmp;
    }
        
    times = [];
    i = 0;
    while (times.length < qtd) {

        //Com números proibidos
        if (avoid) {

            if (!avoid.includes(arr[i])) {
                times.push(arr[i]);
            }

        //Sem números proibidos
        } else {
            times.push(arr[i]);
        }

    i++;
    }

    return times;

}


//Oculta todos os frames (reset)
function reset_frames() {

    document.querySelectorAll('.frame').forEach(function(el) {
        el.style.display = 'none';
    });

}





/*-----------------------------------------------------
MENU
------------------------------------------------------*/

const bt_menu = document.querySelectorAll("#menu a");
bt_menu.forEach(bt => {

    bt.addEventListener('click', function() {


        //Captura destino do link
        const destino = this.hash;

        //Pega frame destino
        const fr_destino = document.querySelector(destino);

        //Oculta todos os frames
        reset_frames();

        //Exibe frame do destino
        fr_destino.style.display = 'block';

    });    

});





/*-----------------------------------------------------
ABERTURA
Ao carregar a página, apresenta frame da abertura.
------------------------------------------------------*/

//Carrega frame abertura
const fr_abertura = document.querySelector("#fr_abertura");
reset_frames();
fr_abertura.style.display = 'block';

var f=0;

function changeText(acao){

    //Captura os botões
    const bt_back = document.querySelector("#bt_back");
    const bt_next = document.querySelector("#bt_next");

    if(acao=="avancar"){
        f += 1
    }

    if(acao=="voltar"){
        f -= 1
    }
  
  	if( f < 0){
        f = 0;
    }
  
  	if(f == 0){
        document.getElementById('pText').innerHTML = "Olá, este é o Jackat. Ele adora novelos de lã, que o aquecem no inverno.";
        bt_back.style.visibility = "hidden";
        bt_next.style.visibility = "visible";
    }

    if(f == 1){
        document.getElementById('pText').innerHTML = "Oh, não! Ele teve seu suéter destruído!";
        bt_back.style.visibility = "visible";
        bt_next.style.visibility = "visible";
    }

    if(f == 2){
        document.getElementById('pText').innerHTML = "Precisamos ajudá-lo a coletar novos novelos para sobreviver ao frio.";
        bt_back.style.visibility = "visible";
        bt_next.style.visibility = "visible";
    }

    if(f == 3){
        document.getElementById('pText').innerHTML = "Passe por todas as estações coletando os novelos para chegar quentinho ao inverno.";
        bt_back.style.visibility = "visible";
        bt_next.style.visibility = "hidden";
    }
  
    if( f > 3){
        f = 3;
    }

}





/*-----------------------------------------------------
START
Ao clicar no botão star, carrega o frame da partida   
------------------------------------------------------*/

const bt_start = document.querySelector("#bt_start");

bt_start.addEventListener('click', function (e) {

    //Carrega frame da partida
    const fr_partida = document.querySelector("#fr_partida");

    //Oculta demais frames
    reset_frames();

    //Exibe frame da partida
    fr_partida.style.display = 'block';
  
    //Start musica
    musica_jogo_sound.volume = 0.4;
    musica_jogo_sound.loop = true;
    musica_jogo_sound.play();

    //Executa a partida
    partida();

});





/*-----------------------------------------------------
PARTIDA
Rato atravessa a tela. Ao chegar no final, carrega 
o frame da missão
------------------------------------------------------*/

//Carrega o rato
const rato = document.querySelector("#fr_partida .rato");

//Execução da tela de Partida
function partida() {

    //Animação do rato
    rato.animate(
        [
            //Keyframes
            {
                left: "-"+ rato.clientWidth +"px"
            },
            {
                left: 100 + "%"
            }
        ],
        {
            duration: velocidade_rato,
            iterations: 1
        }
    );

    //Permanece na tela de partida pelo tempo de movimento do rato
    setTimeout(() => {

        //Para a animação do rato
        rato.style.display = 'none';
        rato.remove();

        //Oculta demais frames
        reset_frames();

        //Carrega o frame da missão
        fr_missao.style.display = 'block';
        missao();

    },velocidade_rato);

};





/*-----------------------------------------------------
MISSÃO
Frame da missão do jogo, onde serão capturados os 
novelos desviando dos obstáculos.
------------------------------------------------------*/

//Carrega o frame da missão do jogo
const fr_missao = document.querySelector("#fr_missao");
const fr_missao_position = fr_missao.getBoundingClientRect();

//Carrega o frame do cenário final
const fr_final = document.querySelector("#final");

//Carrega fundos
const bg_predios = document.querySelectorAll(".bg_predios");
const bg_cenario = document.querySelectorAll(".bg_cenario");
const caixa = document.querySelector("#caixa");

//Execução da tela de missão
const missao = () => {

    //Monitoramento das animações
    const anima_predios = [];
    const anima_cenario = [];

    //Função que para a animação
    const stop_animations = () => {
        anima_predios.forEach((e) => { e.pause() });
        anima_cenario.forEach((e) => { e.pause() });
    };
    
    //Função que começa a animação
    const start_animations = (vel_predios,vel_cenario) => {

        //Animação dos predios
        bg_predios.forEach(element => anima_predios.push(element.animate(
                [
                    //Keyframes
                    {
                        backgroundPositionX: "0"
                    },
                    {
                        backgroundPositionX: "-" + bg1_width + "px"
                    }
                ],
                {
                    duration: vel_predios,
                    iterations: Infinity
                }
            )
        ));

        //Animação do cenario
        bg_cenario.forEach(element => anima_cenario.push(element.animate(
                [
                    //Keyframes
                    {
                        backgroundPositionX: "0"
                    },
                    {
                        backgroundPositionX: "-" + bg1_width + "px"
                    }
                ],
                {
                    duration: vel_cenario,
                    iterations: Infinity
                }
            )
        ));
    }

    //Começa a animação com a velocidade inicial
    start_animations(velocidade_predios,velocidade_cenario);

    //Animação da caixa
    caixa.animate(
        [
            //Keyframes
            {
                left: "0%"
            },
            {
                left: "-100%"
            }
        ],
        {
            duration: velocidade_cenario,
            iterations: 1
        }
    );

    //Exclui a caixa no final da animação
    setTimeout(() => {

        //Para a animação do rato
        caixa.style.display = 'none';
        caixa.remove();

    },velocidade_cenario);


    //Config estações
    //estacao,qtd_novelos,qtd_obstaculos,obstaculos,velocidade_cenario
    const seasons = [
        ['primavera',20,10,["cachorro"]],
        ['verao',17,15,["cachorro","balao"]],
        ['outono',12,20,["cachorro","passaro"]],
        ['inverno',7,25,["floco_neve","floco_neve","boneco_neve_1","boneco_neve_2"]]
    ];

    //Mudança de estações (muda o cenário)
    function season_change() {

        if (season_atual < (seasons.length)-1) {

            //Seleciona estação atual
            var leaving = document.querySelector("#cenario_" + seasons[season_atual][0]);

            //Avança para próxima estação
            season_atual += 1;

            //Seleciona próxima estação
            var entering = document.querySelector("#cenario_" + seasons[season_atual][0]);

            //Revela próxima estação
            entering.classList.add("current");
            console.log("É " + seasons[season_atual][0] + "!");

            //Oculta estação atual
            leaving.classList.remove("current");

            //Reseta o tempo da estação
            season_time = 0;

        }

    }


    //Carrega o jackat
    const jackat = document.querySelector("#fr_missao .jackat");

    //Animação pulo Jackat
    const jackat_jump = () => {

        //Muda para imagem pulando
        jackat.classList.add("jackat-jump");
        jackat_jump_sound.play();
    
        setTimeout(() => {
            
            //Ajusta o som
            jackat_jump_sound.pause();
            jackat_jump_sound.currentTime = 0;

            //Volta para a imagem normal
            jackat.classList.remove("jackat-jump");

        },(velocidade_pulo-50));

        //Animação do rato
        jackat.animate(
            [
                //Keyframes
                {
                    bottom: "10%",
                    easing: "ease-out",
                    offset: 0
                },
                {
                    bottom: "65%",
                    easing: "ease-out",
                    offset: 0.45
                },
                {
                    bottom: "65%",
                    easing: "ease-out",
                    offset: 0.50
                },
                {
                    bottom: "65%",
                    easing: "ease-out",
                    offset: 0.55
                },
                {
                    bottom: "10%",
                    easing: "ease-out",
                    offset: 1
                }
            ],
            {
                duration: velocidade_pulo,
                iterations: 1
            }
        );
    
    }

    //Execução do pulo
    const jump_exec = () => {

        if (jump_locked) {
            return; 
        } else {

            //Bloqueia pulo
            jump_locked = true;

            //Executa pulo
            jackat_jump();

            //Desbloqueia o pulo
            if (jackat_lives) {
                timeout_jump = setTimeout(() => { jump_locked = false; },(velocidade_pulo-50)); 
            }

        }

    }

    //Comandos de teclado    
    document.addEventListener('keydown', (e) => {

        //Comando apra pulo
        if (e.code === 'Space' || e.code === 'ArrowUp') {

            jump_exec();

        }

    });

    //Comandos de mouse e touch
    fr_missao.addEventListener("mouseclick", () => {
        jump_exec();
    });
    fr_missao.addEventListener("touch", () => {
        jump_exec();
    });
    fr_missao.addEventListener("touchstart", () => {
        jump_exec();
    });
    fr_missao.addEventListener("click", () => {
        jump_exec();
    });


    //Função que para a animação
    const stop_objects_animations = () => {
        anima_novelos.forEach((e) => { e.pause() });
        anima_obstaculos.forEach((e) => { e.pause() });
    };


    //Configuração dos novelos
    const novelos = ['azul', 'laranja', 'rosa', 'verde'];

    //Spawn de novelos
    function spawn_novelos() {

        //Escolhe um novelo aleatóriamente
        const novelo = Math.floor(Math.random() * novelos.length);

        //Cria um novelo com cor aleatória
        const um_novelo = document.createElement("div");
        um_novelo.classList.add("novelo");        
        um_novelo.classList.add(novelos[novelo]);

        //Ajusta altura aleatória do novelo (entre 15 e 75% da tela a partir do bottom)
        var position_novelo = Math.floor(Math.random() * (75 - 20) + 20);
        um_novelo.style.bottom = position_novelo + "%";

        //Insere o novelo no frame da missão na posição inicial
        fr_missao.appendChild(um_novelo);

        //Calcula velocidade de deslocamento
        const vel_novelo = (um_novelo.clientWidth + board_width) / px_ms;

        //Animação do novelo
        anima_novelos.push(
            um_novelo.animate(
                [
                    //Keyframes
                    {
                        left: 100 + "%"
                    },
                    {                    
                        left: "-"+ um_novelo.clientWidth +"px"
                    }
                ],
                {
                    duration: vel_novelo,
                    iterations: 1
                }
            )
        );

        //Apaga o novelo
        timeout_novelos.push(setTimeout(function(){
            um_novelo.style.display = 'none';
            um_novelo.remove();
        }, vel_novelo));

    }


    //Configuração dos obstáculos
    //obstaculo,[altura_minima,altura_maxima]
    const cnf_obstaculos = []
    cnf_obstaculos["cachorro"] = [0,0];
    cnf_obstaculos["balao"] = [50,65];
    cnf_obstaculos["passaro"] = [50,75];
    cnf_obstaculos["floco_neve"] = [45,75];
    cnf_obstaculos["boneco_neve_1"] = [0,0];
    cnf_obstaculos["boneco_neve_2"] = [0,0];

    //Spawn de obstáculos
    function spawn_obstaculos() {

        //Escolhe um novelo aleatóriamente
        const obstaculo = Math.floor(Math.random() * seasons[season_atual][3].length);

        //Nome do obstaculo        
        const ob_name = seasons[season_atual][3][obstaculo];

        //Cria o objeto com o obstáculo
        const um_obstaculo = document.createElement("div");
        um_obstaculo.classList.add("obstaculo");        
        um_obstaculo.classList.add(ob_name);

        //Ajusta altura aleatória conforme o obstáculo
        if (cnf_obstaculos[ob_name][0] > 0) {

            var position_obstaculo = Math.floor(Math.random() * (cnf_obstaculos[ob_name][1] - cnf_obstaculos[ob_name][0]) + cnf_obstaculos[ob_name][0]);
            um_obstaculo.style.bottom = position_obstaculo + "%";

        }

        //Insere o novelo no frame da missão na posição inicial
        fr_missao.appendChild(um_obstaculo);

        //Calcula velocidade de deslocamento
        const vel_obstaculo = (um_obstaculo.clientWidth + board_width) / px_ms;

        //Animação do novelo
        anima_obstaculos.push(
            um_obstaculo.animate(
                [
                    //Keyframes
                    {
                        right: "-"+ um_obstaculo.clientWidth +"px"
                    },
                    {                    
                        right: board_width +"px"
                    }
                ],
                {
                    duration: vel_obstaculo,
                    iterations: 1
                }
            )

        );

        //Apaga o obstáculo
        timeout_obstaculos.push(setTimeout(function(){
            um_obstaculo.style.display = 'none';
            um_obstaculo.remove();
        }, vel_obstaculo));

    }


    //Contagem do tempo de jogo (ações que acontecem com tempo determinado)
    const time_progress = () => {

        if (play_time <= ((season_duration*4)-1)) {

            //Avanço do tempo
            play_time += 1;
            season_time += 1;
            //console.log(play_time+"/"+season_time);

            //Determina os tempos de aparecimento dos obstaculos (com controle para não coincidirem com os novelos!)
            var obstaculos_times = random_time(season_duration,seasons[season_atual][2]);

            //Determina os tempos de aparecimento dos novelos
            var novelos_times = random_time(season_duration,seasons[season_atual][1]);

            //Captura todos os novelos na tela
            const novelos_ativos = document.querySelectorAll(".novelo");

            //Capturatodos os obstáculos na tela
            const obstaculos_ativos = document.querySelectorAll(".obstaculo");

            //Muda de estação quando der o tempo e não tiver mais novelos e obstáculos na tela
            if (season_time >= season_duration && novelos_ativos.length == 0 && obstaculos_ativos.length == 0) {

                //Muda o cenário
                season_change();

                //Determina os tempos de aparecimento dos obstaculos na nova estação
                obstaculos_times = random_time(season_duration,seasons[season_atual][2]);

                //Determina tempos de aparecimento dos novelos na nova estação
                novelos_times = random_time(season_duration,seasons[season_atual][1]);

            }

            //Spawn de novelos
            if (novelos_times.includes(season_time)) {
                spawn_novelos();
            }

            //Spawn de objetos
            if (obstaculos_times.includes(season_time)) {
                spawn_obstaculos();
            }

        }

    }    
    const time_count = setInterval(time_progress,1000);



    /*-----------------------------------------------------
    TELAS FINAIS
    Apresenta telas finais de gameover e win
    ------------------------------------------------------*/
    
    //Apresenta tela de gameover
    const gameover_screen = () => {
        
        setTimeout(() => {

            //Seleciona tela de gameover
            const screen = document.getElementById("gameover_screen");

            screen.style.display = "block";
            screen.animate(
                [
                    //Keyframes
                    {
                        top: "-100%"
                    },
                    {
                        top: "50%"
                    }
                ],
                {
                    duration: 500
                }
            );

        },1000);

    }

    //Apresenta tela de vitoria
    const win_screen = () => {
        
        setTimeout(() => {

            //Seleciona tela de gameover
            const screen = document.getElementById("win_screen");

            screen.style.display = "block";
            screen.animate(
                [
                    //Keyframes
                    {
                        top: "-100%"
                    },
                    {
                        top: "50%"
                    }
                ],
                {
                    duration: 500
                }
            );

        },1000);

    }



    /*-----------------------------------------------------
    GAME OVER
    Rotina acionada quando toca em um obstáculo ao longo do jogo
    ------------------------------------------------------*/
    const game_over = (obstaculo) => {

        console.log("Game over!");

        //Para a nimações
        stop_animations();
        stop_objects_animations();

        //Sons
        musica_jogo_sound.pause();
        game_over_sound.play();

        //Desabilita comandos
        jump_locked = true;

        //Para contegem de tempo
        clearInterval(time_count);

        //Para o loop do jogo
        clearInterval(loop);                    

        //Muda personagem para gameover
        jackat.classList.add("gameover");
        jackat_lives = false;
        clearTimeout(timeout_jump);

        //Cancela desaparecimento novelos
        timeout_novelos.forEach((e) => { 
            clearTimeout(e);
        });

        //Cancela desaparecimento obstáculos
        timeout_obstaculos.forEach((e) => {  
            clearTimeout(e);
        });

        //Se for balão
        if (obstaculo.classList.contains('balao')) {
            obstaculo.classList.add("estourado");
            balao_estourando_sound.play();
        }

        //Apresenta tela de gameover
        gameover_screen();

    }



    /*-----------------------------------------------------
    FINAL
    Ao cumprir a missão, carrega o frame final.
    ------------------------------------------------------*/
    const the_end = () => {

        //Desabilita comandos
        jump_locked = true;

        //Para contegem de tempo
        clearInterval(time_count);

        //Para o loop do jogo
        clearInterval(loop);

        //Animação da chegada na casinha
        fr_final.style.display = 'block';
        const final_animate = fr_final.animate(
            [
                //Keyframes
                {
                    left: "100%"
                },
                {
                    left: "0%"
                }
            ],
            {
                duration: velocidade_cenario,
                iterations: 1
            }
        );

        //Quando terminar a animação
        final_animate.onfinish = (event) => {
            
            //Para animação do cenário
            stop_animations();

            //Animação final do personagem
            const jackat_final = jackat.animate(
                [
                    //Keyframes
                    {
                        left: "10%"
                    },
                    {
                        left: "100%"
                    }
                ],
                {
                    duration: velocidade_cenario,
                    iterations: 1
                }
            );

            //Se não tiver atingido a meta de novelos
            if (meta_pct < 100) {

                const tempo = velocidade_cenario/2.5;
                setTimeout(() => {

                    console.log("Game over!");

                    //Para a animação final do personagem
                    jackat_final.pause();

                    //Sons
                    musica_jogo_sound.pause();
                    game_over_sound.play();                   

                    //Muda personagem para congelado
                    jackat.classList.add("frozen");
                    jackat_lives = false;

                    //Apresenta tela de gameover
                    gameover_screen();

                },tempo);


            //Se tiver atingido a meta (WIN!)
            } else {

                //Quando termina a animação do personagem
                jackat_final.onfinish = (event) => {

                    console.log("Você venceu!");

                    //Remove o div do personagem
                    jackat.style.display = 'none';
                    jackat.remove();

                    //Para o som do jogo
                    musica_jogo_sound.loop = false;

                    //Apresenta tela da vitória
                    win_screen();

                }

            }

        };     
        
    }



    /*-----------------------------------------------------
    O JOGO
    Loop de execução do jogo
    ------------------------------------------------------*/
    const loop = setInterval(() => {

        //Captura máscara do placar
        var placar_mask = document.getElementById("placar_mascara");

        //Captura todos os novelos na tela
        const novelos_ativos = document.querySelectorAll(".novelo");

        //Capturatodos os obstáculos na tela
        const obstaculos_ativos = document.querySelectorAll(".obstaculo");

        //Pega a posição atual do personagem
        let jackat_position = {};
        jackat_position.top = +window.getComputedStyle(jackat).top.replace("px","");
      	jackat_position.bottom = +window.getComputedStyle(jackat).top.replace("px","") + jackat.offsetHeight;
        jackat_position.right = jackat.offsetLeft + jackat.offsetHeight;
        jackat_position.left = jackat.offsetLeft

        //Choque com novelos
        novelos_ativos.forEach((e) => { 

            //Pega a posição do novelo específico
            let novelo_position = {};
            novelo_position.top = +window.getComputedStyle(e).top.replace("px","");
            novelo_position.bottom = +window.getComputedStyle(e).top.replace("px","") + e.offsetHeight;
            novelo_position.right = e.offsetLeft + e.offsetHeight;
            novelo_position.left = e.offsetLeft

            //Posição de choque
            if (novelo_position.left <= position_h_choque && novelo_position.left >= jackat_position.left) {
              
                //Condição para choque com novelo
                if (jackat_position.bottom >= novelo_position.top && jackat_position.top <= novelo_position.bottom) {
               
                    //Soma novelo coletado
                    novelos_coletados += 1;

                    //Calcula porcentagem completa
                    meta_pct = Math.round((novelos_coletados * 100) / meta_novelos);                    
                    console.log(novelos_coletados + " de " + meta_novelos + " (" + meta_pct + "%)");

                    //Determina tamanho da máscara do placar
                    var placar_size = 100 - meta_pct;

                    //Ajusta exibição do plarcarplacar_mask.width
                    placar_mask.style.width = placar_size+"%";
                    
                    //Remove o novelo coletado do cenário.
                    e.remove();
                    novelo_pick_sound.play();

                }

            }

        });


        //Choque com obstáculos (game-over)
        obstaculos_ativos.forEach((e) => { 

            //Pega a posição do obstaculo específico
            let obstaculo_position = {};
            obstaculo_position.top = +window.getComputedStyle(e).top.replace("px","");
            obstaculo_position.bottom = +window.getComputedStyle(e).top.replace("px","") + e.offsetHeight;
            obstaculo_position.right = e.offsetLeft + e.offsetHeight;
            obstaculo_position.left = e.offsetLeft

            //Posição de choque
            if (obstaculo_position.left <= position_h_choque && obstaculo_position.left >= jackat_position.left) {
              
                //Condição para choque com obstaculo

                //Obs: Falta inserir condição para a posição final do objeto. Aqui está constando apenas a posição inicial
                //Por exemplo, considera choque apenas com a cabeça do cachorro, e não com a cauda.

                if (jackat_position.bottom >= obstaculo_position.top && jackat_position.top <= obstaculo_position.bottom) {
               
                    //Aciona rotina de game over
                    game_over(e);                   

                }

            }

        });


        //Fim do tempo de jogo (depois de decorrido o tempo de quatro estrações e não existirem mais novemos ou obstáculos na tela)
        if (play_time >= (season_duration*4) && novelos_ativos.length == 0 && obstaculos_ativos.length == 0) {
            the_end();
        }

    },10);

}