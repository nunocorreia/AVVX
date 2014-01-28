//
// Janos Erdos Jr. (avvx mods + motion by Jari)
// http://studio.sketchpad.cc/sp/pad/view/ro.9I1UKv8Dl9FQM/rev.946
//

// ----> start of avvx interface ---------------------------------------------

void avvx_init()
{
	return "spiral";	// behavior name shown in topleft corner
}

void avvx_exit()
{
}

void avvx_resize(canvasWidth, canvasHeight)
{
	// -- update width and height of drawing surface
	w = canvasWidth;
	h = canvasHeight;
	size(w,h);
}

void avvx_updateText(s1, s2)
{
	// -- return text info shown at the top left corner
	s1.add("x speed: " + speedX);
	s1.add("y speed: " + speedY);
	s2.add("use arrows to change the speed");
	s2.add("hit 'c' to randomize colors");
}

void avvx_interaction(type, param)
{
	// -- change speed and colors
	int dx = 0, dy = 0;
	if (type == "trigger") switch(param)
	{
		case 40: if (speedY > 0) dy = -1; break; // down
		case 38: dy = 1; break; // up
		case 39: dx = 1; break; // right
		case 37: if (speedX > 0) dx = -1; break; // left
		case 67: cr = color(Math.random()*255, Math.random()*255, Math.random()*255); break; // 'c'
		default: return false;
	}
	if (dx != 0) speedX += dx;
	else if (dy != 0) speedY += dy;
	return true;
}

// <--- end of avvx interface ------------------------------------------------


//
// standard processing sketch starts here
//
int mx,my,w,h;
int speedX = 10;
int speedY = 10;
int dirX = 1;
int dirY = 1;

var s = 154;
color cr = color(70,84,170);

void setup()
{
	size(window.innerWidth, window.innerHeight);
	mx = window.innerWidth / 2;
	my = window.innerHeight / 2;
	fill(255);
	noStroke();
}

void updatePosition()
{
	mx += speedX * dirX;
	my += speedY * dirY;
	if (mx < 0 || mx > w) { dirX *= -1; }
	if (my < 0 || my > h) { dirY *= -1; }
}

void draw()
{
	updatePosition();
	background(0,0);

    var off = s * sqrt(3);
    for(int i = -2; i < 7; i++)
	{
        for(int j = -2; j < 7; j++)
		{
			float x = i*s*2 + (j%2 == 0 ? 0:s), y = j*off;
			PVector a = disort(x, y), b = disort(x+s, y+off), c = disort(x-s, y+off);
        
			fill(cr, 255-dist(x,y, mx, my)/3);       
			beginShape();
				duplaspiral(a.x, a.y, b.x, b.y);
				duplaspiral(b.x, b.y, c.x, c.y);
				duplaspiral(c.x, c.y, a.x, a.y);
			endShape();
        }
	}
}

PVector disort(float x, float y)
{
    float erz = 27;    
    float d = dist(x,y, mx, my), dd = sqrt(d)/erz;
    
    if (d==0) return new PVector(x,y);    
    return new PVector(x+(mx-x)/dd,y+(my-y)/dd);
}

void duplaspiral(float x1, float y1, float x2, float y2)
{
	final float d = dist(x1,y1,x2,y2), a = atan2(x1-x2,y1-y2);
	final float phi = 2; //1.6180339887;
	final float A = 2.15, B=1;
 
	float radius = 0, d1 = d/phi, d1log=A*log(d1*B);
	for(var radius = 1; radius < d1; radius++)
	{
		float aa = a+A*log(radius*B)-d1log-PI;
		vertex(x1+sin(aa)*radius, y1+cos(aa)*radius);
	}

	float d2 = d-d/phi, d2log=A*log(d1*B);
	for(var radius = d2; radius > 1; radius--)
	{
		float aa = a+A*log(radius*B)-d1log;
		vertex(x2+sin(aa)*radius, y2+cos(aa)*radius);
	}
}

