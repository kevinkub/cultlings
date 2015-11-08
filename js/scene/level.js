g.add('img/level/bg.png');

function LevelScene( i ) {
	var self = this;
	
	var level = levels[i];
	this.bg = new Sprite('img/level/bg.png');
	this.i = i;

	if( level.spell ) {
		var overlay = new SpellOverlay(level.spell);
		overlay.setPosition(350, 250);
		overlay.setSize(this.getArea().width()-700, this.getArea().height()-500);
		
		var goButton = new Placeholder();
		goButton.color = 'rgba(0,0,0,.2)';
		goButton.setPosition(overlay.position.x + overlay.getArea().width()/2 - 200, overlay.position.y + overlay.getArea().height() - 200);
		goButton.setSize(400, 160);
		goButton.onClick = function(){
			self.blocking = [];
			s.play('sound/button.wav');
			AddBackbutton(scenes.levelselection, self.entities);
		};
		
		var text = new Text("Start");
		text.color = "#333333";
		text.size = goButton.size;
		text.position = new V2(overlay.position.x + overlay.getArea().width()/2, overlay.position.y + overlay.getArea().height()-100);
		
		this.blocking = [overlay, goButton, text];
	
	} else {
		AddBackbutton(scenes.levelselection, this.entities);
	}

	this.entities = [
		this.level = new Level(level, this),
		this.mix = new ThermoMix(level.shuffle ? this.shuffle(level.ingredients) : level.ingredients, this)
	];
}

LevelScene.prototype = new Scene();

LevelScene.prototype.shuffle = function( ingredients ) {
	var keys = [];
	var shuffled = {};

	for( var i in ingredients )
		keys.push(i);

	keys = shuffle(keys);

	for( var i = 0; i < keys.length; i++ )
		shuffled[keys[i]] = ingredients[keys[i]];

	console.log( 'everey day im shufflein...');
	console.log( ingredients, shuffled );

	return shuffled;
};