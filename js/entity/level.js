g.add("img/level/platform_dummy.png");
g.add("img/level/ladder_dummy.png");
g.add("img/altar.png");
g.add("img/spawn.png");
g.add('img/spells/poof.png');

function Level( level, parent ) {
	var self = this;
	var data = level.map;
	var spawn = level.spawnNumber;

	var cooldown = 0;
	var killed = 0;
	var sacrificed = 0;

	this.map = [];
	this.spell = null;

	this.position = new V2(48, 0);
	this.size = new V2(m.w * m.t, m.h * m.t);

	this.start = new V2(0, 0);
	this.goal  = new V2(0, 0);

	var canvas = document.createElement("canvas");
	canvas.width = this.size.x;
	canvas.height = this.size.y;

	var ctx = canvas.getContext("2d");
	var imgLadder = g["img/level/ladder_dummy.png"];
	var imgPlatform = g["img/level/platform_dummy.png"];
	var imgFrames = Math.floor( imgPlatform.width / m.t );

	function placeTile( x, y, f ) {
		ctx.drawImage(imgPlatform, f*m.t, 0, m.t, m.t, x*m.t, y*m.t, m.t, m.t );
	}

	function checkLevelComplete() {
		if( killed + sacrificed >=  level.spawnNumber ) {
			var stars = ( sacrificed >= level.bronze ) + ( sacrificed >= level.silver ) + ( sacrificed >= level.gold );
			parent.blocking = [new FinishedOverlay( stars, parent.i )];
			s.play(stars == 0 ? 'sound/loose.mp3' : 'sound/win.mp3');
		}
	}

	this.killKultling = function() {
		killed++;
		checkLevelComplete();
	};

	this.sacrificeKultling = function() {
		sacrificed++;
		checkLevelComplete();
	};

	this.getTile = function( x, y ) {
		if( x < 0 || x > m.w-1 || y < 0 || y > m.h-1 ) return null;
		return this.map[x][y];
	};

	this.setSpell = function( spell ) {
		if( parent.hint ) parent.hint.visible = true;
		parent.ready.sprite = new AnimationSprite('img/spells/spell_ready_'+spell+'.png', 10);
		parent.ready.visible = true;
		this.spell = spell;
	};

	this.loot = function() {
		parent.mix.addLoot(level.loot);
	};

	this.consumeSpell = function( spell ) {
		if( spell == this.spell ) {
			if( parent.hint ) parent.hint.visible = false;
			this.spell = null;
			parent.ready.visible = false;
			s.play('sound/spell.mp3');
			return true;
		}

		return false;
	};

	this.onClick = function(pos) {
		if( this.spell) {
			var tilePos = pos.dif(new V2(m.t/2, m.t/2));
			tilePos.grid(m.t, m.t);

			if( tilePos.y < m.h-1 && this.map[tilePos.x][tilePos.y] == null && this.map[tilePos.x][tilePos.y+1] == "platform"  ) {
				if( this.consumeSpell('wall')) {
					var wall =  new Stone(this, tilePos.x, tilePos.y);
					this.map[tilePos.x][tilePos.y] = wall;
					this.entities.push(wall);
					this.entities.push( new Animation('img/spells/poof.png', tilePos.prd(m.t), 5, 100, this ));
				}
			}
		}
	};

	this.entities = [{
		draw: function(ctx) { ctx.drawImage( canvas, 0, 0 ); },
		update: function(delta) {
			if( spawn ) {
				cooldown -= delta;
				if (cooldown < 0) {
					self.entities.push(new Kultling(self));
					cooldown = level.spawnRate;
					spawn--;
				}
			}
		}
	}];


	// Generate map images and convert entities
	for (var x = 0; x < m.w; x++) {
		this.map[x] = [];

		for (var y = 0; y < m.h; y++) {
			//ctx.strokeRect(x * m.t, y * m.t, m.t, m.t );
			this.map[x][y] = null;

			if (data[x][y].p) {
				this.map[x][y] = "platform";
				var t = 0;

				if (x > 0 && data[x - 1][y].p) t += 2;
				if (x < m.w - 1 && data[x + 1][y].p) t += 1;

				if (t == 1) placeTile(x, y, 0);
				else if (t == 2) placeTile(x, y, imgFrames - 1);
				else placeTile(x, y, rand(1, imgFrames - 2));
			}

			switch( data[x][y].e ) {
				case 'ladder_up': ctx.drawImage(imgLadder, x * m.t, y * m.t); this.map[x][y] = 'ladder_up'; break;
				case 'ladder_down': ctx.drawImage(imgLadder, x * m.t, y * m.t); this.map[x][y] = 'ladder_down'; break;
				case 'start': this.start = new V2(x, y); break;
				case 'goal': this.goal = new V2(x, y); this.map[x][y] = 'goal'; break;
				case 'fire': this.entities.push( this.map[x][y] = new Fire( self, x, y )); break;
				case 'water': this.entities.push( this.map[x][y] = new Water( self, x, y )); break;
				case 'stone': this.entities.push( this.map[x][y] = new Stone( self, x, y )); break;
				case 'thorns': this.entities.push( this.map[x][y] = new Thorns( self, x, y )); break;
				case 'saw': this.entities.push( this.map[x][y] = new Saw( self, x, y )); break;
				case 'rock': this.entities.push( this.map[x][y] = new Rock( self, x, y )); break;
				case 'chest': this.entities.push( this.map[x][y] = new Chest( self, x, y )); break;
			}
		}
	}

	// display start and goal
	this.entities.push(new AnimatedImage("img/altar.png", this.goal.prd(m.t).dif(new V2(64,0)), 3, 200));
	this.entities.push(new AnimatedImage("img/spawn.png", this.start.prd(m.t), 8, 160 ));
}

Level.prototype = new Entity();