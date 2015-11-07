g.add('img/kultling.png');
g.add('img/kultling_tot.png');

function Kultling( parent ) {
	this.level = parent;
	this.grid = parent.start;
	this.entering = parent.start;

	this.position = this.grid.prd(m.t);
	this.sprite = new AnimationSprite('img/kultling.png', 4);
	this.counter = new Framecounter(200);

	this.speed = 50;
	this.speedLadder = 30;
	this.horizontal = this.speed;
	this.vertical = 0;
	this.falling = false;
}

Kultling.prototype.draw = function( ctx ) {
	this.sprite.draw(ctx, this.position.x, this.position.y, this.counter.frame % 4);
};

Kultling.prototype.update = function( delta ) {
	this.counter.update( delta );
	this.position.x += ( this.horizontal ) / delta;
	this.position.y += ( this.vertical ) / delta;

	var dg = this.grid.prd(m.t).dif( this.position );
	if( Math.abs(dg.x) > m.t || Math.abs(dg.y) > m.t ) {
		this.grid = this.position.clone();
		this.grid.grid(m.t, m.t);
		this.tileReached();
	}

	var de = this.entering.prd(m.t).dif( this.position );
	if( Math.abs(de.x) > m.t/2 || Math.abs(de.y) > m.t/2 ) {
		this.entering = this.position.clone();
		this.entering.grid(m.t, m.t);
		this.tileEntered();
	}
};

Kultling.prototype.die = function() {
	arrayRemove( this.level.entities, this );
	this.level.entities.push( new Animation('img/kultling_tot.png', this.position, 6, 120, this.level));
	this.level.killKultling();
};

Kultling.prototype.sacrifice = function() {
	arrayRemove( this.level.entities, this );
	this.level.entities.push( new Animation('img/kultling_tot.png', this.position, 6, 120, this.level));
	this.level.sacrificeKultling();
};

Kultling.prototype.tileEntered = function() {
	var current = this.level.getTile( this.entering.x, this.entering.y);
	if( current && current.onKultistTouch )
		current.onKultistTouch( this );

	var below = this.level.getTile( this.entering.x, this.entering.y+1);
	if( below && below.onKultistTouchBelow )
		below.onKultistTouchBelow( this );
};

Kultling.prototype.tileReached = function() {
	if( this.grid.x < 0 || this.grid.x > m.w-1 ) this.die();
	if( this.grid.y < 0 || this.grid.y > m.h-1 ) this.die();

	var current = this.level.getTile( this.grid.x, this.grid.y);
	var below = this.level.getTile( this.grid.x, this.grid.y+1);

	if( this.falling ) {
		if( below ) return this.die();
	} else if( current == 'goal' ) {
		return this.sacrifice();
	} else if( this.vertical ) {
		if( below == 'platform' || ( current != 'ladder_up' && current != 'ladder_down' ) ) {
			this.vertical = 0;
			this.horizontal = this.speed;
		}
	} else {
		if( current == 'ladder_up' ) {
			this.horizontal = 0;
			this.vertical = -this.speedLadder;
		} else if( below == 'ladder_down' ) {
			this.horizontal = 0;
			this.vertical = this.speedLadder;
		} else if( !below ) {
			this.horizontal = 0;
			this.vertical = 200;
			this.falling = true;
		}
	}

	if( current && current.onKultistCollision )
		current.onKultistCollision( this );
	if( below && below.onKultistCollisionBelow )
		below.onKultistCollisionBelow( this );
};



