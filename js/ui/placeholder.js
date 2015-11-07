function Placeholder(x, y, width, height, color) {
	this.position = new V2(x || 0, y || 0);
	this.size = new V2(width || 0, height || 0);
	this.color = color || 'yellow';
	
	this.draw = function(ctx) {
		var area = this.getArea();
		ctx.fillStyle = this.color;
		ctx.fillRect(area.p1.x, area.p1.y, area.width(), area.height());
	}
}

Placeholder.prototype = new Entity();