g.add("img/ui/start-button.png");
g.add("img/ui/credits-button.png");
g.add("img/ui/bg.png");

function MainScene() {
	
	this.bg = new Sprite("img/ui/bg.png");
	
	this.entities = [
			new Button("img/ui/start-button.png", 
						"img/ui/start-button.png", 
						game.width / 2 - 400, 
						game.height / 2 - 225, 
						function() {
							game.scene = scenes.levelselection;
						}),
			new Button("img/ui/credits-button.png", 
						"img/ui/credits-button.png", 
						game.width / 2 - 400, 
						game.height / 2 + 25,
						function() {
							game.scene = scenes.credits;
						}
					),
	];	
}

MainScene.prototype = new Scene();