function start() {
	$("#inicio").hide(); //Oculta a div inicio
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>"); //Novas divs sao criadas na div fundoGame
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
	$("#fundoGame").append("<div id='placar'></div>");
	$("#fundoGame").append("<div id='energia'></div>");

	//Principais variáveis do jogo
	var jogo = {}
	var TECLA = { //para o Apache
		W: 87, //movimento para cima (87: código da tecla; vide tabela)
		S: 83, //movimento para baixo
		D: 68 //efetua disparos
	}
	var velocidade=5; //para o helicoptero inimigo
	var posicaoY = parseInt(Math.random() * 334); //para o helicoptero inimigo
	var podeAtirar=true; //indica que pode atirar
	var fimdejogo=false; //identifica se o jogo finalizou
	var pontos=0; //placar do jogo (pontos)
	var salvos=0; //placar do jogo (Soldados resgatados)
	var perdidos=0; //placar do jogo (Soldados mortos)
	var energiaAtual=3; //placar do jogo (Energia do Apache)

	var somDisparo=document.getElementById("somDisparo");
	var somExplosao=document.getElementById("somExplosao");
	var musica=document.getElementById("musica");
	var somGameover=document.getElementById("somGameover");
	var somPerdido=document.getElementById("somPerdido");
	var somResgate=document.getElementById("somResgate");

	jogo.pressionou = []; //Verifica se o usuário pressionou alguma tecla
		
	$(document).keydown(function(e) { //usuário pressionou alguma tecla	
		jogo.pressionou[e.which] = true;
	});
		
	$(document).keyup(function(e) { //usuário nao pressionou tecla	
		jogo.pressionou[e.which] = false;
	});

	jogo.timer = setInterval(loop, 30); //inicia o loop, com a funcao sendo executada a cada 30s

	musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);

	//Funcoes do jogo
	function loop() { //Game Loop
		movefundo();
		movejogador(); //apache	
		moveinimigo1(); //helicoptero inimigo
		moveinimigo2(); //caminhao inimigo
		moveamigo(); //soldado amigo
		colisao(); //detecta as colisoes entre os elementos
		placar();
		energia();
		musica.play(); //musica de fundo
	}
		
	function movefundo() { //Função que movimenta o fundo do jogo	
		esquerda = parseInt($("#fundoGame").css("background-position")); //esquerda valor inicial 0;
		$("#fundoGame").css("background-position",esquerda-1); //atualiza a posicao atual (sempre subtrai 1px)
	} 

	function movejogador() { //Função que movimenta (verticamente) o Apache	
		if (jogo.pressionou[TECLA.W]) {
			var topo = parseInt($("#jogador").css("top"));
			if (topo<=0) { //evita valores negativos		
				$("#jogador").css("top",topo+10);
			} else {
				$("#jogador").css("top",topo-10); //subtrai para subir (valor no topo da pagina é 0!)
			}		
		}	
		if (jogo.pressionou[TECLA.S]) {		
			var topo = parseInt($("#jogador").css("top"));
			if (topo>=434) { //evita valores positivos que saem da tela do jogo
				$("#jogador").css("top",topo-10);				
			} else {
				$("#jogador").css("top",topo+10); //soma para descer
			}			
		}	
		if (jogo.pressionou[TECLA.D]) {		
			disparo(); //usa arma do apache	
		}
	} 

	function moveinimigo1() { //Função que movimenta (verticalmente e horizontalmente) o Helicoptero Inimigo randomicamente
		posicaoX = parseInt($("#inimigo1").css("left")); //X: horizontalmente, Y: verticalmente
		$("#inimigo1").css("left",posicaoX-velocidade);
		$("#inimigo1").css("top",posicaoY);		
		if (posicaoX<=0) { //chega ao inicio, volta para o fim
			posicaoY = parseInt(Math.random() * 334); //fornece um valor randomico verticalmente (altura diferente)
			$("#inimigo1").css("left",694);
			$("#inimigo1").css("top",posicaoY);			
		}
	}

	function moveinimigo2() { //Função que movimenta (horizontalmente) o Caminhao Inimigo
		posicaoX = parseInt($("#inimigo2").css("left"));
		$("#inimigo2").css("left",posicaoX-3);
		if (posicaoX<=0) {	//chega ao inicio, volta para o fim	
			$("#inimigo2").css("left",775);				
		}
	} 

	function moveamigo() { //Função que movimenta (horizontalmente) o Soldado amigo
		posicaoX = parseInt($("#amigo").css("left"));
		$("#amigo").css("left",posicaoX+1);				
		if (posicaoX>906) {	//chega ao fim, volta para o inicio		
			$("#amigo").css("left",0);					
		}
	}

	function disparo() {	
		if (podeAtirar==true) {	
			somDisparo.play(); 
			podeAtirar=false; //somente permite um tiro por vez, ate o tiro sair da tela
			topo = parseInt($("#jogador").css("top")) //posicao vertical do apache
			posicaoX= parseInt($("#jogador").css("left")) //posicao horizontal do apache
			tiroX = posicaoX + 185; //posicao horizontal de onde saira o tiro do apache
			topoTiro=topo+50; //posicao veritical de onde saira o tiro do apache
			$("#fundoGame").append("<div id='disparo'></div");
			$("#disparo").css("top",topoTiro); //posicao da div disparo vertical
			$("#disparo").css("left",tiroX); //posicao da div disparo horizontal	
			var tempoDisparo=window.setInterval(executaDisparo, 30); //faz com que o tiro se mova na tela, com um tempo para cada disparo
		} 
		function executaDisparo() {
			posicaoX = parseInt($("#disparo").css("left")); //posicao inicial do disparo
			$("#disparo").css("left",posicaoX+15); //velocidade com que o tiro se move na tela
			if (posicaoX>900) {	//quando o tiro chega no final da tela, div do tiro sera removido				
				window.clearInterval(tempoDisparo); 
				tempoDisparo=null;
				$("#disparo").remove(); //remove div
				podeAtirar=true; //permite novo tiro					
			}
		}
	} 

	function colisao() {
		var colisao1 = ($("#jogador").collision($("#inimigo1"))); //colisao: Apache x Helicoptero Inimigo 
		//console.log(colisao1);
		var colisao2 = ($("#jogador").collision($("#inimigo2"))); //colisao: Apache x Caminhao Inimigo 
		var colisao3 = ($("#disparo").collision($("#inimigo1"))); //explosao: Apache missel x Helicoptero Inimigo 
		var colisao4 = ($("#disparo").collision($("#inimigo2"))); //explosao: Apache missel x Caminhao Inimigo 
		var colisao5 = ($("#jogador").collision($("#amigo"))); //resgate: Apache x Soldado amigo 
		var colisao6 = ($("#inimigo2").collision($("#amigo"))); //atropelamento: Soldado amigo x Caminhao Inimigo 

		if (colisao1.length>0) { //Houve colisao	
			inimigo1X = parseInt($("#inimigo1").css("left")); //captura as posicoes do Inimigo (horizontal)
			inimigo1Y = parseInt($("#inimigo1").css("top")); //captura as posicoes do Inimigo (vertical)
			somExplosao.play();
			explosao1(inimigo1X,inimigo1Y); //local na tela em que ocorre a explosao
		
			posicaoY = parseInt(Math.random() * 334); //Helicoptero Inimigo assume nova posica na tela, evitando continuar apos colidir
			$("#inimigo1").css("left",694);
			$("#inimigo1").css("top",posicaoY); //Posicao aleatoria na vertical
			energiaAtual--;
		}
		if (colisao2.length>0) { //Houve colisao
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			somExplosao.play();
			explosao2(inimigo2X,inimigo2Y);
					
			$("#inimigo2").remove();			
			reposicionaInimigo2(); //Caminhao Inimigo reaparece apos 5s, nao sendo reposicionado automaticamente (como Helicoptero Inimigo)	
			energiaAtual--;	
		}
		if (colisao3.length>0) { //Houve explosao
			inimigo1X = parseInt($("#inimigo1").css("left")); //captura as posicoes do Inimigo (horizontal)
			inimigo1Y = parseInt($("#inimigo1").css("top")); //captura as posicoes do Inimigo (vertical)	
			somExplosao.play();		
			explosao1(inimigo1X,inimigo1Y);
			$("#disparo").css("left",950); //evitar que o missel continue na tela apos a explosao (vide executaDisparo)
				
			posicaoY = parseInt(Math.random() * 334); //apos a explosao o Helicoptero Inimigo ressurge na tela em outra posicao
			$("#inimigo1").css("left",694);
			$("#inimigo1").css("top",posicaoY);	
			pontos=pontos+100;
			velocidade=velocidade+0.5;
		}
		if (colisao4.length>0) { //Houve explosao		
			inimigo2X = parseInt($("#inimigo2").css("left")); //captura as posicoes do Inimigo (horizontal)
			inimigo2Y = parseInt($("#inimigo2").css("top")); //captura as posicoes do Inimigo (vertical)
			somExplosao.play();
			$("#inimigo2").remove();
		
			explosao2(inimigo2X,inimigo2Y);
			$("#disparo").css("left",950); //evitar que o missel continue na tela apos a explosao (vide executaDisparo)	
			reposicionaInimigo2(); //Caminhao Inimigo reaparece apos 5s, nao sendo reposicionado automaticamente (como Helicoptero Inimigo)		
			pontos=pontos+50;
		}
		if (colisao5.length>0) { //Houve resgate	
			somResgate.play();
			reposicionaAmigo(); //Soldado amigo reaparece apos 6s, nao sendo reposicionado automaticamente
			$("#amigo").remove();
			salvos++;
		}
		if (colisao6.length>0) { //Houve atropelamento    
			amigoX = parseInt($("#amigo").css("left"));
			amigoY = parseInt($("#amigo").css("top"));
			somPerdido.play();
			explosao3(amigoX,amigoY);
			$("#amigo").remove();				
			reposicionaAmigo();	//Soldado amigo reaparece apos 6s, nao sendo reposicionado automaticamente
			perdidos++;		
		}
	}

	function explosao1(inimigo1X,inimigo1Y) { //explosao: Apache x Helicoptero Inimigo 
		$("#fundoGame").append("<div id='explosao1'></div");
		$("#explosao1").css("background-image", "url(img/explosao.png)"); //coloca imagem aqui, pois nao funciona em todos navegadores se colocado no arquivo css
		var div=$("#explosao1");
		div.css("top", inimigo1Y); //explosao ocorre no mesmo local aonde ocorre colisao entre o Apache e Helicoptero Inimigo 
		div.css("left", inimigo1X);
		div.animate({width:200, opacity:0}, "slow"); //div cresce em tamanho e depois desaparece
		
		var tempoExplosao=window.setInterval(removeExplosao, 1000);	//remove a explosao apos 1s
		function removeExplosao() {			
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao=null;			
		}		
	}

	function explosao2(inimigo2X,inimigo2Y) { //explosao: Apache x Caminhao Inimigo 
		$("#fundoGame").append("<div id='explosao2'></div");
		$("#explosao2").css("background-image", "url(img/explosao.png)");
		var div2=$("#explosao2");
		div2.css("top", inimigo2Y);
		div2.css("left", inimigo2X);
		div2.animate({width:200, opacity:0}, "slow");
		
		var tempoExplosao2=window.setInterval(removeExplosao2, 1000);	
		function removeExplosao2() {			
				div2.remove();
				window.clearInterval(tempoExplosao2);
				tempoExplosao2=null;			
		}
	}

	function explosao3(amigoX,amigoY) { //atropelamento: Soldado amigo x Caminhao Inimigo 
		$("#fundoGame").append("<div id='explosao3' class='anima4'></div");
		$("#explosao3").css("top",amigoY);
		$("#explosao3").css("left",amigoX);
		var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
		function resetaExplosao3() {
			$("#explosao3").remove();
			window.clearInterval(tempoExplosao3);
			tempoExplosao3=null;			
		}	
	}

	function reposicionaInimigo2() { //Tem que criar uma funcao a parte por problema no Firefox	
		var tempoColisao4=window.setInterval(reposiciona4, 5000);
			
		function reposiciona4() {
			window.clearInterval(tempoColisao4);
			tempoColisao4=null;			
			if (fimdejogo==false) {	//o Caminhao Inimigo somente reaparece com o jogo ainda funcionando		
				$("#fundoGame").append("<div id=inimigo2></div");			
			}			
		}	
	}	

	function reposicionaAmigo() { //Tem que criar uma funcao a parte por problema no Firefox
		var tempoAmigo=window.setInterval(reposiciona6, 6000);
		
		function reposiciona6() {
			window.clearInterval(tempoAmigo);
			tempoAmigo=null;
				
			if (fimdejogo==false) { //o Soldado amigo somente reaparece com o jogo ainda funcionando			
				$("#fundoGame").append("<div id='amigo' class='anima3'></div>");		
			}		
		}	
	}

	function placar() {	
		$("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");	
	} 

	function energia() {	
		if (energiaAtual==3) {		
			$("#energia").css("background-image", "url(img/energia3.png)");
		}
		if (energiaAtual==2) {		
			$("#energia").css("background-image", "url(img/energia2.png)");
		}
		if (energiaAtual==1) {		
			$("#energia").css("background-image", "url(img/energia1.png)");
		}
		if (energiaAtual==0) {		
			$("#energia").css("background-image", "url(img/energia0.png)");		
			gameOver();
		}
	}

	function gameOver() {
		fimdejogo=true;
		musica.pause();
		somGameover.play();	
		window.clearInterval(jogo.timer); //fim do loop
		jogo.timer=null;
		
		$("#jogador").remove();
		$("#inimigo1").remove();
		$("#inimigo2").remove();
		$("#amigo").remove();	
		$("#fundoGame").append("<div id='fim'></div>");	
		$("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>"); //botao para reiniciar o jogo
	}
} //Fim da start

function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start(); 
}