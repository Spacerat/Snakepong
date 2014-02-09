<!DOCTYPE html>

<html>
	<head>
		<style type="text/css">
			body {
				font-family: 'Lucida Sans Unicode','Lucida Grande','Lucida Sans','DejaVu Sans Condensed',sans-serif;
				background-color: #EEE;
				overflow: hidden;
				margin: 0;
				line-height: 1.2em;
			}
			
			h1 {
				text-align: center;
			}
		
			@media screen and (view-mode: fullscreen) {
				h1 {
					display: none;
				}
			}
		
			span.food {
				background-color: red;
			}
			span.ball {
				background-color: blue;
				color: white;
			}
			span.snake2 {
				background-color: green;
			}
			span.snake1 {
				background-color: purple;
				color: white;
			}
			ul.definitions > li span {
				display: inline-block;
				width: 3em;
			}
			
			#topdiv {
				margin-left: auto;
				margin-right: auto;
				width: 1000px;
				position:relative;
			}
			
			#topdiv + div {
				clear: both;
			}
			
			#topdiv > div {
				float: left;
			}
			
			#notice {
				margin: 20px;
				width: 960px;
				height: 560px;
				
				position: absolute;
				background-color: rgba(100,50,200,0.9);
				border-radius: 30px;
				box-shadow: 3px 3px 1px rgba(5, 0, 20, 0.8);
				color: #EEE;
				font-size: 14px;
			}
			
			#notice > div {
				width: 440px;
				float: left;
				margin: 20px;
			}
			
			#footer {
				position: absolute;
				bottom: 0;
				z-index: -1;
				text-align: center;
				width: 100%;
				border-top: #444;
				background-color: #E2E2E2;
				color: #999;
				font-size: small;
			}

		</style>
		<script type="text/javascript" src="cookies.js" ></script>
		<script type="text/javascript" src="snakepong.js" ></script>
		<script type="text/javascript">
			window.onload = function() {
				var cookies = new CookieHandler();
				var thegame;
				
				document.options.cols.value = cookies.getIntCookieOrDefault("cols", 30);
				document.options.rows.value = cookies.getIntCookieOrDefault("rows", 18);
				document.options.speed.value = cookies.getIntCookieOrDefault("speed", 300);
				document.options.food.value = cookies.getIntCookieOrDefault("food", 3);
				document.resize.width.value = cookies.getIntCookieOrDefault("width", 1000);
				document.resize.height.value = cookies.getIntCookieOrDefault("height", 600);
				
				var begin = function(snake1AI, snake0AI) {
					var opts = {
						cols: Math.max(parseInt(document.options.cols.value,10), 5),
						rows: Math.max(parseInt(document.options.rows.value,10), 3),
						speed: Math.max(parseInt(document.options.speed.value,10), 1),
						food: Math.max(parseInt(document.options.food.value,10), 0),
						ondeath: function() {
							document.getElementById("notice").style.visibility = "visible";
						},
						snake1AI: snake1AI,
						snake0AI: snake0AI
					}
					opts.food = Math.min(opts.food, opts.cols * opts.rows - 3);
					thegame = new Game("canv").Begin(opts);
					cookies.setCookie("cols", opts.cols);
					cookies.setCookie("rows", opts.rows);
					cookies.setCookie("speed", opts.speed);
					cookies.setCookie("food", opts.food);
					cookies.setCookie("width", opts.width);
					cookies.setCookie("height", opts.height);
				};
				
				var resize = function(w, h) {
					document.getElementById("canv").width = w;
					document.getElementById("canv").height = h;
					document.getElementById("topdiv").style.width = w+"px";
					document.getElementById("topdiv").style.height = h+"px";
				};
				
				(function() {
					begin(true, true);
				})();
				
				document.options.begin.onclick = function() {
					if (thegame) thegame.End();
					begin(document.options.ai1.checked, document.options.ai0.checked);
					//thegame = new Game("canv").Begin(40, 20);
					document.getElementById("notice").style.visibility = "hidden";
					
				}
				
				document.resize.doresize.onclick = function() {
					var w = parseInt(document.resize.width.value, 10);
					var h = parseInt(document.resize.height.value, 10);
					resize(w, h);
				}
				
				document.resize.fullscr.onclick = function() {
					var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
					
					var cols = parseInt(document.options.cols.value,10);
					var rows = parseInt(document.options.rows.value,10);
					
					var cellsize = Math.min(x / cols, y / rows);

					document.resize.width.value = cols * cellsize;
					document.resize.height.value = rows * cellsize;


					resize(document.resize.width.value, document.resize.height.value);
					//document.getElementById("title").style.display = 'none';
				}
				document.options.begin.focus();
			}			
		</script>
		<title>Snakepong</title>
	</head>
	<body>
		
		<div id=topdiv>
			<div>
				<canvas id="canv" width=1000 height=600>
					PLZ GET GUD BROWZER
				</canvas>
			</div>
			<div id=notice>
				<h1 id=title> SnakePong</h1>
				<div id=instructions>
					<h2> Instructions </h2>
					<ul class=definitions>
						<li> <span class=food>Red</span> = Food </li>
						<li> <span class=ball>Blue</span> = Ball </li>
						<li> <span class=snake1>Purple</span> = Snake 1. Controls: Arrow keys</li>
						<li> <span class=snake2>Green</span> = Snake 2. Controls: WASD</li>
						<li> <strong> X key </strong> = End game</li>
					</ul>
					<h4> How to play </h4>
					<p> Use the arrow or WASD keys to manouver your snake. When a snake hits the side of the grid, it wraps around to the other side. </p>
					<p>	<span class=snake1>Snake 1's</span> must protect the <em>left</em> side of the grid, and <span class=snake2>Snake 2</span> the <em>right.</em></p>
					<p> The <span class=ball>ball</span> travels around the grid. If it hits the left or right sides (the goals), the respective snake loses 2/3 of their length.</p>
					<p>	Each player should collect <span class=food>food</span> with their snake to grow it. If a snake hits itself or another snake, it shrinks. When a snake loses all of its body parts, the other snake wins. </p>
				</div>
				<div id=optspanel>
					<h2> Resize </h2>
					<form name=resize>
						<input type=button name=fullscr value="Expand to fill window" title="Expand the size of the canvas to the available window size as much as possible, while conserving the set number of rows/columns and keeping square grid cells." /><br>
						<div style="display: none;">
							<input type=number name=width id=width value=1000 min=0 /><label for=width>Width</label><br>
							<input type=number name=height id=height value=500 min=0 /><label for=height>Height</label><br>
							<input type=button name=doresize value=Resize /><br>
						</div>
					</form>
					<h2> Options </h2>
					<form name=options>
						<input type=number name=cols id=cols value=60 min=5 /><label for=cols>Columns</label><br>
						<input type=number name=rows id=rows value=36 min=5 /><label for=rows>Rows</label><br>
						<input type=number name=speed id=speed value=300 min=1 /><label for=speed>Tick time</label><br>
						<input type=number name=food id=food value=2 min=0 /><label for=food>Food quantity</label><br>
						<input type=checkbox name=ai0 id=ai0 /><label for=ai0>Purple AI</label><br>
						<input type=checkbox name=ai1 id=ai1 checked/><label for=ai1>Green AI</label><br>
						<input type=button name=begin value=Start />
					</form>
				</div>
			</div>
		</div>
		<div id=footer>
			Written by <a href="http://spacerat.meteornet.net">Joseph Atkins-Turkish</a>
		</div>
	</body>
</html>