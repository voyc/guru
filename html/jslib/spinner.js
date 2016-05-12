function Spinner(canvas) {
	this.canvas = canvas;

	this.startAngle = .15;
	this.endAngle = 1.75;
	this.colorBody = '#00f';
	this.colorTriangle = '#00f';

	// calculated to fill containing canvas	
	this.radius;
	this.arrowStrength;
	this.triangleSide;  
	this.context;
	this.x;
	this.y;
}

Spinner.prototype = {
	spin: function() {
		addClass(this.canvas, 'spinning');
	},
	stop: function() {
		removeClass(this.canvas, 'spinning');
	},
	draw: function() {
		this.context = this.canvas.getContext('2d');

		// canvas.width is NOT equal to canvas.style.width
		// canvas.style.width is the size of the html element
		// canvas.width is the size of the drawing surface
		// The drawing surface is scaled into the size of the HTML element.
		// By default, canvas.width=300px, canvas.height=150px.

		// the following are in pixels
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;

		// the following are in pixels
		this.radius = parseInt(Math.min(this.canvas.width, this.canvas.height)) * .35;
		this.arrowStrength = this.radius * .5;
		this.triangleSide = this.radius * .5;  

		this.x = this.canvas.width / 2; //the center on X axis
		this.y = this.canvas.height / 2; //the center on Y axis
		var pi = Math.PI;
	    this.drawArrowBody( this.startAngle * pi, this.endAngle * pi, this.arrowStrength);
	    this.drawTriangle( this.endAngle * pi );
	},
	drawArrowBody: function( startAngle, endAngle, arrowStrength ){
		var counterClockwise = false;
		this.context.beginPath();
		this.context.arc( this.x, this.y, this.radius, startAngle, endAngle, counterClockwise );
		this.context.lineWidth = arrowStrength;   
		this.context.strokeStyle = this.colorBody;
		this.context.stroke();
		this.context.closePath();
	},
	
	drawTriangle: function(endAngle){
	    //First the center of the triangle base (where we start to draw the triangle)
		var canterBaseArrowX = this.x + this.radius * Math.cos( endAngle );
		var canterBaseArrowY = this.y + this.radius * Math.sin( endAngle );
	    
		this.context.beginPath();
	    
	    //We move to the center of the base
		this.context.moveTo( canterBaseArrowX, canterBaseArrowY ); 
	
	    //Let's calculate the first point, easy!
		var ax = canterBaseArrowX + (this.triangleSide / 2 ) * Math.cos( endAngle );
		var ay = canterBaseArrowY + (this.triangleSide / 2 ) * Math.sin( endAngle );
		this.context.lineTo ( ax, ay );
	    
	    //Now time to get mad: the farest triangle point from the arrow body
		var bx = canterBaseArrowX + ( Math.sqrt( 3 ) / 2 ) * this.triangleSide * ( Math.sin( -endAngle ));
		var by = canterBaseArrowY + ( Math.sqrt( 3 ) / 2 ) * this.triangleSide * ( Math.cos( -endAngle ));
		this.context.lineTo(bx,by);
	    
	    //Easy , like the a point
		var cx = canterBaseArrowX - ( this.triangleSide / 2 ) * Math.cos( endAngle );
		var cy = canterBaseArrowY - ( this.triangleSide / 2 ) * Math.sin( endAngle );
		this.context.lineTo( cx,cy );
	    
	    //and back to the origin, the center of the triangle base.
		this.context.lineTo( canterBaseArrowX, canterBaseArrowY );
	    
	    this.context.lineWidth = this.arrowStrength;  
	   
	    //Stroke it with color!
	    this.context.strokeStyle = this.colorTriangle;
		this.context.stroke();
		this.context.closePath();
	}
}
