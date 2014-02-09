var TYPE_HEAD = 4;
var TYPE_TAIL = 8;
var TYPE_BODY = 0;

var DIR_R = 1;
var DIR_D = 2;
var DIR_L = 3;
var DIR_U = 4;

if (!(console.log)) {
	console.log = function(){};
}

if (!Math.sign) Math.sign = function(x) {
	return (x > 0 ? 1 : (x < 0 ? -1 : 0));
}

Math.absmin = function(x, y) {
	if (Math.abs(x) < Math.abs(y)) return x; else return y;
}

function wrap(v, max) {
	return (v + max) % max;
}

Grid = function(width, height) {
	var me = this;
	var space = width * height;
	this.width = width;
	this.height = height;
	
	this.wrapped = true;
	//Init
	(function() {
		var x, y;
		me.data = [];
		for (x = 0; x < width; x++) {
			me.data[x] = [];
			for (y = 0; y < height; y++) {
				me.data[x][y] = null;
			}
		}
	})();
	
	this.setCanvas = function(ctx) {
		this.ctx = ctx;
		this.cellw = this.ctx.canvas.width / width;
		this.cellh = this.ctx.canvas.height / height;
		this.cellw = this.cellh = Math.min(this.cellw, this.cellh);
		this.ctx.canvas.width = width * this.cellw;
		this.ctx.canvas.height = height * this.cellh;
	}
	
	
	
	this.getSpace = function() {
		return space;
	}
	
	this.wrapX = function(x) {
		return (x + width ) % width;
	}
	
	this.wrapY = function(y) {
		return (y + height ) % height;
	}
	
	this.Xdist = function(x1, x2) {
		return Math.absmin(x2 - x1, x2 - (x1 - width));
	}
	
	this.Ydist = function(y1, y2) {
		return Math.absmin(y2 - y1, y2 - (y1 - height));
	}
	
	this.set = function(x, y, data) {
		if (space == 0) return -1;
		if (this.wrapped) {
			x = wrap(x, width);
			y = wrap(y, height);
		}
		if (this.data[x][y]) {
			return 1;
		}
		space--;
		this.data[x][y] = data;
	}
	
	this.unset = function(x, y) {
		if (this.wrapped) {
			x = wrap(x, width);
			y = wrap(y, height);
		}
		space ++;
		this.data[x][y] = null;
	}
	
	this.get = function(x, y, data) {
		if (this.wrapped) {
			x = wrap(x, width);
			y = wrap(y, height);
		}
		return this.data[x][y];
	}
	
	this.nextCoords = function(coord, dir) {
		c = null;
		switch(dir) {
			case DIR_U:
				c = [coord[0], coord[1]-1];
				break;
			case DIR_D:
				c = [coord[0], coord[1] + 1];
				break;
			case DIR_L:
				c = [coord[0] - 1, coord[1]];
				break;
			case DIR_R:
				c = [coord[0] + 1, coord[1]];
				break;
		}

		c[0] = this.wrapX(c[0])
		c[1] = this.wrapY(c[1])

		return c;
	}
	
	this.render = function(ctx) {
		var xx, yy, cellw, cellh;
		cellw = this.cellw;
		cellh = this.cellh;
		/*
		for (xx = 0; xx < width; xx++ ) {
			for (yy = 0; yy < height; yy++ ) {
				ctx.strokeRect(xx * cellw, yy * cellh, cellw, cellh);
			}
		}*/
		ctx.beginPath();
		ctx.strokeStyle = '#EEE';
		///*
		for (xx = 0; xx <= width; xx++) {
			ctx.moveTo(xx * cellw, 0);
			ctx.lineTo(xx * cellw, height * cellh);
			for (yy = 0; yy <= height; yy++) {
				ctx.moveTo(0, yy * cellh);
				ctx.lineTo(width * cellw, yy * cellh);
			}
		}
		//*/
		//ctx.closePath();
		ctx.stroke();
		
		ctx.strokeStyle = 'black';
		ctx.strokeRect(1, 1, width * cellw, height * cellh);
	}
}

Food = function(grid, objects, x, y) {
	this.name = "food"
	this.x = wrap(x, grid.width);
	this.y = wrap(y, grid.height);
	grid.set(x, y, this);
	this.render = function(ctx) {
		var w = grid.cellw;
		var h = grid.cellh;
		ctx.fillStyle = 'red';
		ctx.fillRect(w * this.x+2, h * this.y+2, w - 4, h - 4);
	}
	
	this.randomPos = function() {
		var fail = 1;
		var px = this.x;
		var py = this.y;
		if (grid.getSpace() == -1) {
			grid.unset(px, py);
			return;
		}
		
		while (fail == 1) {
			this.x = Math.floor(Math.random() * (grid.width));
			this.y = Math.floor(Math.random() * (grid.height));
			if (grid.get(this.x, this.y)) continue;
			fail = grid.set(this.x, this.y, this);
			//console.log(fail);
			//break;
		}
		fail = grid.unset(px, py);
		return this;
	}
	
	this.step = function(){}
}

SnakeBody = function(grid, snake, dir, x, y, type) {
	this.type = type;
	this.x = wrap(x, grid.width);
	this.y = wrap(y, grid.height);
	this.type = (type === 1 || type === -1 ? type : 0);
	this.dir = dir;
	this.snake = snake;
	this.name = 'snake';
	grid.set(x, y, this);
	
	this.remove = function() {
		grid.unset(x, y);
		this.snake = null;
	}
	
	this.setType = function(type) {
		this.type = type;
	}
	
	this.nextCoords = function(d) {
		d = (d == undefined ? this.dir : d);
		switch(d) {
			case DIR_U:
				return [this.x, this.y-1];
				break;
			case DIR_D:
				return [this.x, this.y + 1];
				break;
			case DIR_L:
				return [this.x - 1, this.y];
				break;
			case DIR_R:
				return [this.x + 1, this.y];
				break;
		}
	}
	
	this.getScreenCoords = function() {
		
		return {
			x: this.x * grid.cellw,
			y: this.y * grid.cellh,
			w: grid.cellw,
			h: grid.cellh,
			dir: this.dir
		}
	}
	
	
}

Ball = function(grid, objects, start_x, start_y) {
	var that = this;
	var speed = 4;
	this.x = start_x;
	this.y = start_y;
	this.name = 'ball';
	this.xvel = 1;
	this.yvel = 1;
	var grd;
	
	this.scoreFunction = null;
	
	var k = 1;
	
	this.step = function() {
		if ((k = ((k+1) % speed)) != 1) return;
		
		var nxvel = this.xvel, nyvel = this.yvel;
		var collision; 
		var cols = [
			grid.get(this.x + this.xvel, this.y + this.yvel),
			grid.get(this.x + this.xvel, this.y),
			grid.get(this.x - this.xvel, this.y),
			grid.get(this.x, this.y + this.yvel),
			grid.get(this.x, this.y - this.yvel)
		];
		
		
		if (cols[0]) {
			nxvel = -this.xvel;
			nyvel = -this.yvel;
		}
		if (cols[1]) {
			nxvel = - this.xvel;
			if (!cols[3]) {
				nyvel = this.yvel;
			}
		}
		if (cols[3]) {
			nyvel = -this.yvel;
			if (!cols[1]) {
				nxvel = this.xvel;
			}
		}
		this.xvel = nxvel;
		this.yvel = nyvel;
		
		
		
		var nx = this.x + this.xvel;
		var ny = this.y + this.yvel;
		
		if (!grid.get(nx, ny)) {
			this.move(nx, ny);
		}

		
	}
	
	this.nextCoords = function() {
		var nx = this.x + this.xvel;
		var ny = this.y + this.yvel;
		return [nx, ny];
	}
	
	this.render = function(ctx) {
		var w = grid.cellw;
		var h = grid.cellh;

			
		//ctx.fillStyle = 'blue';
		ctx.save();
		var scale = Math.min(w/2.0, h/2.0);
		

		if (!grd) {
			grd = ctx.createRadialGradient(0, 0, 0, 0, 0,1);
			grd.addColorStop(0, '#49F');
			grd.addColorStop(0.6, '#36E');
			grd.addColorStop(1, '#14A');
		}
		ctx.translate(w * this.x + w/2.0, h * this.y + h/2.0);
		ctx.scale(scale, scale);
		ctx.fillStyle = grd;
		ctx.beginPath();
		ctx.arc(0, 0, 1, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
		//ctx.fillRect(w * this.x, h * this.y, w, h);
	}
	
	this.move = function(nx, ny) {
		var scored = -1;
		if (this.scoreFunction != null) {
			
			if (this.x <= 0) {	
				scored = 0;
				nx = Math.ceil(grid.width / 2.0);
				ny = Math.ceil(grid.height/ 2.0);
				//return;
			}
			else if (this.x >= grid.width - 1) {
				scored = 1;
				nx = Math.ceil(grid.width / 2.0);
				ny = Math.ceil(grid.height/ 2.0);
				//return;
			}
		}
		if (grid.get(nx, ny)) {
			return false;
		}
		if (scored >= 0) {this.scoreFunction(scored); this.xvel = - this.xvel;};
		grid.unset(this.x, this.y);
		this.x = grid.wrapX(nx);
		this.y = grid.wrapY(ny);
		grid.set(this.x, this.y, this);
		return true;
	}
	
}

Snake = function(grid, objects, start_x, start_y) {
	var parts = [];
	var cmdqueue = [];
	var grow = 3;
	this.name = "snake";
	this.fillStyle = 'green';
	this.x = start_x;
	this.y = start_y;
	this.isAI = false;
	var target, tx, ty;
	parts.push(new SnakeBody(grid, this, DIR_U, start_x, start_y, TYPE_HEAD));
	parts.push(new SnakeBody(grid, this, DIR_U, start_x, start_y  + 1, TYPE_TAIL));
	
	this.shrink = function() {
		if (parts.length == 0) return;
		parts.pop().remove();
		if (parts.length > 1) parts[parts.length - 1].setType(TYPE_TAIL);
		if (parts.length == 0 && (this.onDeath)) {
			this.onDeath();
		}
	}
	
	this.count = function() {
		return parts.length;
	}
	
	this.AI = function() {
		var o, i, dist = 9999;
		var dir = parts[0].dir;
		var xdist = 999, ydist = 999;
		
		var westside = this.fillStyle == "purple";
		var eastside = this.fillStyle == "green";
		
		var urgency = 1.0;
		
		for (i = 0; i < objects.length; i++) {
			o = objects[i];
			if (o.name == "food" || o.name == "ball") {
				var ox = o.x, oy = o.y;
				var nydist = grid.Ydist(this.y, oy);
				var nxdist = grid.Xdist(this.x, ox);
				var nx = ox;
				var ny = oy;
				if (o.name == "ball") {
					//TODO: Change this!
					if (!(westside || eastside)) continue;
					if (westside && this.x >= ox) {
						ox -=1;
						if (o.xvel > 0) continue;
					}
					else if (eastside && this.x <= ox) {
						ox +=1;
						if (o.xvel < 0) continue;
					}
					
					
					var pathdist = Math.abs(nxdist) + Math.abs(nydist);
					var max = pathdist;
					var balltime = 0;
					var bx = ox, by = oy;
					for (balltime = 0; balltime < max * 2; balltime+=2) {
						var bydist = grid.Ydist(this.y, by);
						var bxdist = grid.Xdist(this.x, bx);
						pathdist = Math.abs((Math.abs(bydist) + Math.abs(bxdist)) - balltime);
						if (pathdist < 3) {
							nxdist = bxdist;
							nydist = bydist;
							break;
						}
						nx = bx += o.xvel;
						ny = by += o.yvel;
					}
					if ((bx <= pathdist && westside + 3) || (bx >= pathdist && eastside + 3)) {
						urgency = 12.0;
					}
					if ((o.xvel < 0 && westside || o.yvel > 0 && eastside)) urgency *= 2.0; else urgency /=10.0;
					
				}

				var ndist = Math.abs(nxdist) + Math.abs(nydist);
				ndist /= urgency;
				if (ndist < dist) {
					dist = ndist;
					xdist = nxdist;
					ydist = nydist;
					tx = nx;
					ty = ny;
					target = o;
				}
			}
		}
		
		if (Math.sign(xdist) != this.getXVel()) {
			if (this.getXVel() == 0) {
				dir = this.XVelToDir(Math.sign(xdist));
			}
			else {
				dir = this.YVelToDir(Math.sign(ydist));
			}
		}
		else if (Math.sign(ydist) != this.getYVel()) {
			if (this.getYVel() == 0) {
				dir = this.YVelToDir(Math.sign(ydist));
			}
			else {
				dir = this.XVelToDir(Math.sign(xdist));
			}
		}
		
		var nc = parts[0].nextCoords(dir); 
		var tdir = dir;
		var col = grid.get(nc[0], nc[1]);

		var isOkDir = function() {
			if (!col) return true;
			if (col.name == 'snake') return false;
			if (col.name == 'ball') {
				var nnc, ncol;
				if ((dir != DIR_R && westside) || (dir != DIR_L && eastside)) return false;

				nnc = grid.nextCoords(nc, dir);
				ncol = grid.get(nnc[0], nnc[1]);

				// TODO: not false if ncol is a snake tail.
				if (ncol) return false;
			}
			return true
		};
		//if (eastside && col && col.name == "ball") console.log(dir != DIR_L);
		while (isOkDir() == false) {
			dir = dir + 1 > 4 ? 1 : dir + 1;
			nc = parts[0].nextCoords(dir); 
			if (dir == tdir) break;
			col = grid.get(nc[0], nc[1]);
		}
		this.queueCmd(dir);
	}
	
	this.getXVel = function() {return parts[0].dir == DIR_R ? 1 : (parts[0].dir == DIR_L ? -1 : 0);}
	this.getYVel = function() {return parts[0].dir == DIR_D ? 1 : (parts[0].dir == DIR_U ? -1 : 0);}
	this.XVelToDir = function(v) { return (v == 1 ? DIR_R : DIR_L);}
	this.YVelToDir = function(v) { return (dir = v == 1 ? DIR_D : DIR_U);}
	
	this.step = function() {
		var n, c, cdir, collision, move = 1;
		if (!parts[0]) return;
		if (grow === 0) {
			this.shrink();
		}
		else {
			grow --;
		}
			
		if (!parts[0]) {
			return;
		}
		
		parts[0].setType(TYPE_BODY);
		
		if (this.isAI) this.AI();
		
		if ((cdir = cmdqueue.shift()) != undefined) {
			var d = parts[0].dir;
			if (!(d == DIR_R && cdir == DIR_L || 
					d == DIR_L && cdir == DIR_R || 
					d == DIR_U && cdir == DIR_D || 
					d == DIR_D && cdir == DIR_U || 
					d == cdir)) {
				parts[0].dir = cdir;
			}
		}

		c = parts[0].nextCoords();
		var collision; 
		if (collision = grid.get(c[0], c[1])) {
			if (collision.name == 'food') {
				grow++;
				collision.randomPos();
			}
			else if (collision.name == 'snake') {
				this.shrink();
				move = 0;
			}
			else if (collision.name == 'ball') {
				if (!collision.move(collision.x - (parts[0].x - c[0]), collision.y - (parts[0].y - c[1]))) move = 0;
			}
		}
		if (move) parts.unshift(new SnakeBody(grid, this, parts[0].dir, c[0], c[1], TYPE_HEAD));
		if (parts[0]) {
			this.x = parts[0].x;
			this.y = parts[0].y;
		}
	}

	this.drawShape = function(ctx) {
		for (i = 0; i < parts.length; i++) {
			ctx.fillRect(grid.cellw * parts[i].x, grid.cellh * parts[i].y, grid.cellw, grid.cellh);
		}
	}
	
	this.render = function(ctx) {
		if (!parts[0]) return;
		
		var i;
		ctx.translate(2, 2);
		ctx.fillStyle = 'black';
		this.drawShape(ctx);
		
		ctx.translate(-2, -2);
		ctx.fillStyle = this.fillStyle ;
		this.drawShape(ctx);
		
		var p = parts[0].getScreenCoords();
		
		ctx.fillStyle = 'white';
		ctx.save();
		ctx.translate(p.x + p.w/2, p.y + p.h/2);
		ctx.rotate((p.dir - 1) * (Math.PI / 2));
		ctx.fillRect(p.w / 4, p.h/4, p.w/8, p.h/8);
		ctx.fillRect(p.w / 4, -p.h/4, p.w/8, -p.h/8);
		ctx.restore();
		
		// Uncomment to draw the AI snake's desired direction
		/*
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(p.x + p.w/2, p.y+p.h/2);
		ctx.lineTo(tx * p.w + p.w/2, ty * p.h + p.h/2);
		ctx.stroke();
		*/
	}
	
	this.queueCmd = function(dir) {
		cmdqueue.push(dir);
	}
	
	this.kill = function() {
		if (this.keylistener) {
			window.removeEventListener('keydown', this.keylistener, true) 
		}
		parts = [];
	}
	
}


KeysToSnake1 = function(snake) {
	snake.keylistener = window.addEventListener('keydown', function(evt) {
		switch (evt.keyCode) {
			case 38:  /* Up arrow  */
				snake.queueCmd(DIR_U);
				if (evt.preventDefault) evt.preventDefault();
				return false;
			case 40:  /* Down arrow */
				snake.queueCmd(DIR_D);
				if (evt.preventDefault) evt.preventDefault();
				return false;
			case 37:  /* Left arrow */
				snake.queueCmd(DIR_L);
				break;
			case 39:  /* Right arrow */
				snake.queueCmd(DIR_R);
				break;
		}
	}, true);
	
}

KeysToSnake2 = function(snake) {
	snake.keylistener = window.addEventListener('keydown', function(evt) {
		switch (evt.keyCode) {
			case 87:  /* W */
				snake.queueCmd(DIR_U);
				break;
			case 83:  /* S */
				snake.queueCmd(DIR_D);
				break;
			case 65:  /* A */
				snake.queueCmd(DIR_L);
				break;
			case 68:  /* Right arrow */
				snake.queueCmd(DIR_R);
				break;
		}
	}, true);
	
}



Game = function(canvas_id) {
	var grid;
	var objects = [];
	var canvas, ctx;
	var playing = true;
	var stepfunc, renderfunc;
	var ticktime;
	
	canvas = document.getElementById(canvas_id);
	ctx = canvas.getContext('2d');
	
	this.StartMainLoop = function() {
		stepfunc = function() {
			var i;
			for (i = 0; i < objects.length; i++) {
				if (objects[i].step) objects[i].step();
			}
			if (playing === true) steptimer = setTimeout(stepfunc, ticktime);
			renderfunc();
		}
		steptimer = setTimeout(stepfunc, 1);
		
		renderfunc  = function() {
			var i;
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			for (i = 0; i < objects.length; i++) {
				if (objects[i].render) objects[i].render(ctx);
			}
			//rendertimer = setTimeout(renderfunc, 30);
		}
		
		
	}
	
	this.End = function() {
		playing = false;
		for (i = 0; i < objects.length; i++) {
				if (objects[i].kill) objects[i].kill();
		}
		objects = [];
	}
	
	this.Begin = function(opts) {
		var snake0, snake1, steptimer, rendertimer, ball;
		
		var cols = opts.cols || 60;
		var rows = opts.rows || 36;
		var speed = opts.speed || 90;
		var food = opts.food || 3;
		var ondeath = opts.ondeath ? opts.ondeath : function() {window.location.reload();};
		
		window.addEventListener('keydown', function(evt) {
			if (evt.keyCode == 88) { /* X */
				ondeath();
			}
		});
		
		grid = new Grid(cols, rows);
		ticktime = speed;
		//Grid!
		objects.push(grid);
		
		//Ball!
		ball = new Ball(grid, objects, Math.ceil(cols/2.0), 4);
		ball.scoreFunction = function(side) {
			var s = side == 0 ? snake0 : snake1;
			var c = Math.ceil(s.count() * (2.0/3.0));
			for( var i = 0; i < c ; i++) {
				s.shrink();
			}
			//s.shrink();
		}
		
		//Snake 0
		snake0 = new Snake(grid, objects, ball.x+1, ball.y + 2);
		KeysToSnake1(snake0);
		objects.push(snake0);
		snake0.fillStyle = 'purple';
		snake0.isAI = (opts.snake0AI !== undefined ? opts.snake0AI : false);
		
		//Snake 1
		snake1 = new Snake(grid, objects, ball.x-1 , ball.y + 2);
		KeysToSnake2(snake1);
		objects.push(snake1);
		snake1.isAI = (opts.snake1AI !== undefined ? opts.snake1AI : false);
		
		
		snake0.onDeath = snake1.onDeath = ondeath;
		

		//Food!
		for (var f = 0; f < food; f++) {
			objects.push(new Food(grid, objects, 4, 5).randomPos());
		}
		
		

		objects.push(ball);
		
		grid.setCanvas(ctx);

		this.StartMainLoop();
		
		//rendertimer = setTimeout(renderfunc, 1);
		
		return this;
	}
}
