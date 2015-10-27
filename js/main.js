//Objeto importantes de canvas.
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

// Objeto nave
var nave = {
	x : 100,
	y : canvas.height - 100,
	width : 50,
	height : 50
};
var juego = {
	estado : 'iniciando'
};
var teclado = {};
// array para los disparos
var disparos = [];
var enemigos = [];
// Definir variables.
var fondo;

// funciones
function loadMedia() {
	fondo = new Image();
	fondo.src = '../img/space.jpg';
	fondo.onload = function() {
		var intervalo = window.setInterval(frameLoop, 1000 / 55);
	}
}
function dibujarEnemigos() {
	for ( var i in enemigos) {
		var enemigo = enemigos[i];
		ctx.save();
		console.log("enemigo1: " + i);
		if (enemigo.estado == 'vivo') {
			ctx.fillStyle = 'red';
		}
		if (enemigo.estado == 'muerto') {
			ctx.fillStyle = 'black';
		}
		ctx.fillRect(enemigo.x, enemigo.y, enemigo.width, enemigo.height);
	}
}
function dibujarFondo() {
	ctx.drawImage(fondo, 0, 0);
}
function dibujarNave() {
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.fillRect(nave.x, nave.y, nave.width, nave.height);
	ctx.restore();
}
function agregarEventosTeclado() {
	agregarEvento(document, 'keydown', function(e) {
		// ponemos en true la tecla presionada
		teclado[e.keyCode] = true;
	});
	agregarEvento(document, 'keyup', function(e) {
		// ponemos en false la tecla que dejo de ser presionada
		teclado[e.keyCode] = false;
	});
	function agregarEvento(elemento, nombreEvento, funcion) {
		if (elemento.addEventListener) {
			elemento.addEventListener(nombreEvento, funcion, false);
		} else if (elemento.attachEvent) {
			elemento.attachEvent(nombreEvento, funcion)
		}
	}
}
function moverNave() {
	if (teclado[37]) {
		// tecla a la izquierda
		nave.x -= 6;
		if (nave.x < 0) {
			nave.x = 0;
		}
	}
	if (teclado[39]) {
		// tecla a la derecha
		var limite = canvas.width - nave.width;
		nave.x += 6;
		if (nave.x > limite) {
			nave.x = limite;
		}
	}
	if (teclado[32]) {
		if (!teclado.fire) {
			fire();
			teclado.fire = true;
		}
	} else {
		teclado.fire = false;
	}
}
function actualizarEnemigos() {
	if (juego.estado == 'iniciando') {
		for (var i = 0; i < 10; i++) {
			enemigos.push({
				x: 10+(i*50),
				y: 10,
				height: 40,
				widht: 40,
				estado: 'vivo',
				contador: 0
			});
		}
		juego.estado = 'jugando';
		console.log("ingreso: " + enemigos);
	}
	for ( var i in enemigos) {
		var enemigo = enemigos[i];
		if (!enemigo) {
			continue;
		}
		if (enemigo && enemigo.estado == 'vivo') {
			enemigo.contador++;
			enemigo.x += Math.sin(enemigo.contador * Math.PI/90)*5;
		}
	}
}
function moverDisparos() {
	for ( var i in disparos) {
		var disparo = disparos[i];
		disparo.y -= 2;
	}
	disparos = disparos.filter(function() {
		return disparo.y > 0;
	});
}
function fire() {
	disparos.push({
		x : nave.x + 20,
		y : nave.y - 10,
		width : 10,
		height : 30
	});
}
function dibujarDisparos() {
	ctx.save();
	ctx.fillStyle = 'white';
	for ( var i in disparos) {
		var disparo = disparos[i];
		ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
	}
	ctx.restore();
}
function frameLoop() {
	moverNave();
	actualizarEnemigos();
	moverDisparos();
	dibujarFondo();
	dibujarEnemigos();
	dibujarDisparos();
	dibujarNave();
}

// ejecutar funciones
agregarEventosTeclado();
loadMedia();