/*-----------------------------------------------------
CONFIGURAÇÕES
------------------------------------------------------*/
//URL do jogo
const game_url = "https://jackat.midiadigital.info"
const season_duration = 7; //Tempo de duração de cada seção em segundos.
const velocidade_predios = 20000; //em milessegundos
var velocidade_cenario = 3000; //em milessegundos
const velocidade_rato = 2500; //em milessegundos
const velocidade_pulo = 1000; //em milessegundos

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
const jackat_jump_sound = new Audio('sounds/jackat-jump.wav');



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



/*-----------------------------------------------------
OCULTA TODOS OS FRAMES
Função que oculta todos os frames (reset).
------------------------------------------------------*/
function reset_frames() {

    document.querySelectorAll('.frame').forEach(function(el) {
        el.style.display = 'none';
    });

}



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
        document.getElementById('pText').innerHTML = "Oh não, ele foi roubado!";
        bt_back.style.visibility = "visible";
        bt_next.style.visibility = "visible";
    }

    if(f == 2){
        document.getElementById('pText').innerHTML = "Precisamos ajudá-lo a coletar novos novelos para sobreviver ao frio.";
        bt_back.style.visibility = "visible";
        bt_next.style.visibility = "visible";
    }

    if(f == 3){
        document.getElementById('pText').innerHTML = "Passe por todas as estaçoes coletando os novelos para chegar quentinho ao inverno.";
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
//Carrega fundos
const bg_predios = document.querySelectorAll(".bg_predios");
const bg_cenario = document.querySelectorAll(".bg_cenario");
const caixa = document.querySelector("#caixa");

//Execução da tela de missão
const missao = () => {

    //Animação da cidade
    bg_predios.forEach(element => element.animate(
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
    );

    //Animação do cenario
    bg_cenario.forEach(element => element.animate(
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
    );

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


    //Comandos de teclado
    var jump_locked = false;
    const command_exec = (e) => {

        if (e.code === 'Space') {

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
    }

    //Comandos de teclado    
    document.addEventListener('keydown', command_exec);


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


    //Função que leva para a tela final
    const the_end = () => {

        //Pega a posição atual dos prédios
        const predios_transit = document.querySelector("#fr_missao .current .bg_predios");
        predios_transit_position = window.getComputedStyle(predios_transit).getPropertyValue('background-position');

        //Pega a posição atual dos cenario
        const cenario_transit = document.querySelector("#fr_missao .current .bg_predios");
        cenario_transit_position = window.getComputedStyle(cenario_transit).getPropertyValue('background-position');

        //Desabilita comandos
        document.removeEventListener('keydown', command_exec);

        //Para contegem de tempo
        clearInterval(time_count);

        //Para o loop do jogo
        clearInterval(loop);

        //Carrega tela final
        final(predios_transit_position,cenario_transit_position);        
        
    }


    //Loop de detecção das ações do jogo
    const loop = setInterval(() => {

        //Captura posição de todos os novelos na tela
        const novelos_ativos = document.querySelectorAll(".novelo");

        //Captura posição de todos os obstáculos na tela
        const obstaculos_ativos = document.querySelectorAll(".obstaculo");

        //Choque com novelos


        //Choque com obstáculos (game-over)


        //Fim do tempo de jogo
        if (play_time >= (season_duration*4)) {
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



/*-----------------------------------------------------
FINAL
Ao cumprir a missão, carrega o frame final.
------------------------------------------------------*/

//Carrega elementos
const fr_final = document.querySelector("#fr_final");
const jackat_final = fr_final.querySelector(".jackat");

//Execução da tela de Partida
function final(predios_position,cenario_position) {

    //Ajusta posição dos predios
    const predios_final = fr_final.querySelector(".current .bg_predios_final");
    predios_final.style.backgroundPosition=predios_position;

    //Ajusta posição do cenario
    const cenario_final = fr_final.querySelector(".current .bg_cenario_final");
    cenario_final.style.backgroundPosition=cenario_position;
    console.log(cenario_position);


    //Oculta demais frames
    reset_frames();

    //Carrega o frame final
    fr_final.style.display = 'block';

    //Animação do personagem
    jackat_final.animate(
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

    //Permanece na tela de partida pelo tempo de movimento do personagem
    setTimeout(() => {

        //Para a animação do personagem
        jackat_final.style.display = 'none';
        jackat_final.remove();

    },velocidade_cenario);    

}