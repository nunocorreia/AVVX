// http://www.openprocessing.org/sketch/74380

void avvx_init() { return "slash"; }
void avvx_resize(canvasWidth, canvasHeight) { size(canvasWidth, canvasHeight); }

Slash[] slash;
int nb=20;
color[] colors = {color(255,255,255), color(0, 158, 224), color(244, 229, 0)};
 
void setup() {
    size(window.innerWidth, window.innerHeight);
     
    slash=new Slash[nb];
    for(int i=0; i<nb; i++){
        slash[i]=new Slash(colors[i%3]);
    }
}
 
void draw() {
    externals.context.clearRect(0,0,width,height);// part of the canvasAPI that creates a clear rect
     
    for (int i=0;i<nb;i++) {
        slash[i].draw();
    }
    for (int i=0;i<nb;i++) {
        slash[i].draw();
    }
}
 
void mousePressed() {
    for(int i=0; i<nb; i++){
        slash[i].initSlash();
    }
}
 
class Slash {
    float x1, x2, y1, y2, tarX1, tarX2, tarY1, tarY2, easing = random(0.01,0.1);
    int timer, tMax, taille=35, delta=240;
    boolean vertical;
    color c;
 
    Slash(color _c) {
        c=_c;
        initSlash();
    }
 
    void initSlash() {
        timer=0;
        tMax= (int) random(60, 150);
        vertical=random(1)>.5;
 
        x1=x2=(int)random(1, int(width/40)-1)*40;
        y1=y2=(int)random(1, int(height/40)-1)*40;
 
        if(x1<width/2) tarX2=x1+delta;
        else tarX2=x1-delta;
 
        if(y1<height/2) tarY2=y1+delta;
        else tarY2=y1-delta;
    }
 
    void draw() {
        x2=ease(x2, tarX2, easing);
        y2=ease(y2, tarY2, easing);
        if (abs(x2-tarX2)<=1) {
            timer++;
 
            if (timer>tMax) {
                tarX1=tarX2;
                tarY1=tarY2;
                x1=ease(x1, tarX1, easing);//
                y1=ease(y1, tarY1, easing);
 
                if (abs(x1-tarX1)<=1) {
                    initSlash();
                }
            }
        }
 
        noStroke();
        fill(c,200);
        if (vertical) quad(x1, y1-taille, x1, y1+taille, x2, y2+taille, x2, y2-taille);
        else quad(x1-taille, y1, x1+taille, y1, x2+taille, y2, x2-taille, y2);
    }
 
    // a snippet function i often use for animation easing
    float ease(float value, float target, float easingVal) {
        float d = target - value;
        if (abs(d)>1) value+= d*easingVal;
        return value;
    }
}
