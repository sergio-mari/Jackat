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



/*-----------------------------------------------------
CONFIGURAÇÕES
------------------------------------------------------*/

//URL do jogo
const game_url = "https://jackat.midiadigital.info"
const season_duration = 60; //Tempo de duração de cada seção em segundos.
const velocidade_predios = 20000; //em milessegundos
var velocidade_cenario = 3000; //em milessegundos
const velocidade_rato = 2500; //em milessegundos
const velocidade_pulo = 1000; //em milessegundos
const position_h_choque = (board_width * 20) / 100; //porcentagem da largura da tela





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
function random_time(max,qtd) {

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
    for (i = 0; i < qtd; i++) {
        times.push(arr[i]);
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
  musica_jogo_sound.volume=0.4;
  musica_jogo_sound.loop="true";
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

    //Animação da cidade
    const anima_predios = [];
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
                duration: velocidade_predios,
                iterations: Infinity
            }
        )
    ));

    //Animação do cenario
    const anima_cenario = [];
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
                duration: velocidade_cenario,
                iterations: Infinity
            }
        )
    ));

    const stop_animations = () => {
        anima_predios.forEach((e) => { e.pause() });
        anima_cenario.forEach((e) => { e.pause() });
    };

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
        ['verao',15,15,["cachorro","balao"]],
        ['outono',10,20,["cachorro","passaro"]],
        ['inverno',5,25,["floco_neve","boneco_neve_1","boneco_neve_2"]]
    ];

    //Mudança de estações (muda o cenário)
    function season_change() {

        if (season_atual < seasons.length) {

            //Seleciona estação atual
            var leaving = document.querySelector("#cenario_" + seasons[season_atual][0]);

            //Avança para próxima estação
            season_atual += 1;

            //Seleciona próxima estação
            var entering = document.querySelector("#cenario_" + seasons[season_atual][0]);

            //Revela próxima estação
            entering.classList.add("current");
            console.log(seasons[season_atual][0]);

            //Oculta estação atual
            //setTimeout(function(){ leaving.classList.remove("current"); }, 500);
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
    var jump_locked = false;
    const jump_exec = () => {

        if (jump_locked) {
            return; 
        } else {

            //Bloqueia pulo
            jump_locked = true;

            //Executa pulo
            jackat_jump();

            //Desbloqueia o pulo
            setTimeout(() => { jump_locked = false; },(velocidade_pulo-50)); 

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


    //Novelos
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
        var position_novelo = Math.floor(Math.random() * (75 - 15) + 15);
        um_novelo.style.bottom = position_novelo + "%";

        //Insere o novelo no frame da missão na posição inicial
        fr_missao.appendChild(um_novelo);

        //Animação do novelo
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
                duration: velocidade_cenario + velocidade_cenario*0.1,
                iterations: 1
            }
        );

        //Apaga o novelo
        setTimeout(function(){
            um_novelo.style.display = 'none';
            um_novelo.remove();
        }, velocidade_cenario + velocidade_cenario*0.1,);

    }


    //Spawn de obstáculos
    function spawn_obstaculos() {

        //Escolhe um novelo aleatóriamente
        const obstaculo = Math.floor(Math.random() * seasons[season_atual][3].length);

        //Cria o objeto com o obstáculo
        const um_obstaculo = document.createElement("div");
        um_obstaculo.classList.add("obstaculo");        
        um_obstaculo.classList.add(seasons[season_atual][3][obstaculo]);

        //Insere o novelo no frame da missão na posição inicial
        fr_missao.appendChild(um_obstaculo);

        //Animação do novelo
        um_obstaculo.animate(
            [
                //Keyframes
                {
                    left: 100 + "%"
                },
                {                    
                    left: "-"+ um_obstaculo.clientWidth +"px"
                }
            ],
            {
                duration: velocidade_cenario + velocidade_cenario*0.2,
                iterations: 1
            }
        );

        //Apaga o obstáculo
        setTimeout(function(){
            um_obstaculo.style.display = 'none';
            um_obstaculo.remove();
        }, velocidade_cenario + velocidade_cenario*0.2,);

    }


    //Contagem do tempo de jogo (ações que acontecem com tempo determinado)
    var play_time = 0;
    var season_time = 0;
    var season_atual = 0;

    const time_progress = () => {

        if (play_time <= ((season_duration*4)-1)) {

            //Avanço do tempo
            play_time += 1;
            season_time += 1;
            console.log(play_time+"/"+season_time);

            //Determina os tempos de aparecimento dos novelos
            var novelos_times = random_time(season_duration,seasons[season_atual][1]);

            //Determina os tempos de aparecimento dos obstaculos
            var obstaculos_times = random_time(season_duration,seasons[season_atual][2]);

            //Muda de estação
            if (season_time >= season_duration) {

                //Muda o cenário
                season_change();

                //Determina tempos de aparecimento dos novelos na nova estação
                novelos_times = random_time(season_duration,seasons[season_atual][1]);

                //Determina os tempos de aparecimento dos obstaculos na nova estação
                obstaculos_times = random_time(season_duration,seasons[season_atual][2]);

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


            //Quando termina a animação do personagem
            jackat_final.onfinish = (event) => {

                //Remove o div do personagem
                jackat.style.display = 'none';
                jackat.remove();

                //Informa resultado?

            }

        };     
        
    }



    /*-----------------------------------------------------
    O JOGO
    Loop de execução do jogo
    ------------------------------------------------------*/
    const loop = setInterval(() => {

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
               
                    console.log("pegou");
                    e.remove();
                  novelo_pick_sound.play();

                } else {
                    console.log("passou");
                }

            }

        });


        //Choque com obstáculos (game-over)



        //Fim do tempo de jogo (depois de decorrido o tempo de quatro estrações e não existirem mais novemos ou obstáculos na tela)
        if (play_time >= (season_duration*4) && novelos_ativos.length == 0 && obstaculos_ativos.length) {
            the_end();
        }

    },10);


    //PROVISÓRIO - CARREGA TELA FINAL
    document.addEventListener('keydown', event => {

        if (event.code === 'Enter') {
            the_end();
        }
    
    });

}