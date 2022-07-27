var mario, mario_running, mario_collided;
var bg, bgImage;
var brickGroup, brickImage;
var coinsGroup, coinImage;
var coinScore=0;
var gameState="PLAY";

function preload(){
  mario_running =  loadAnimation("images/mar1.png","images/mar2.png","images/mar3.png",
  "images/mar4.png","images/mar5.png","images/mar6.png","images/mar7.png");
  bgImage = loadImage("images/bgnew.jpg");
  brickImage = loadImage("images/brick.png");
  coinSound = loadSound("sounds/coinSound.mp3");
  coinImage = loadAnimation("images/con1.png",
  "images/con2.png","images/con3.png",
  "images/con4.png","images/con5.png","images/con6.png");

  mushObstacleImage = loadAnimation("images/mush1.png",
  "images/mush2.png","images/mush3.png","images/mush4.png",
  "images/mush5.png","images/mush6.png",);
  turtleObstacleImage = loadAnimation("images/tur1.png",
  "images/tur2.png","images/tur3.png","images/tur4.png",
  "images/tur5.png",);

  jumpSound = loadSound("sounds/jump.mp3");
  mario_collided = loadAnimation("images/dead.png");
  
  dieSound = loadSound("sounds/dieSound.mp3");
  restartImg = loadImage("images/restart.png");

}

function setup() {
  createCanvas(1000, 600);

  //create background sprite
  bg = createSprite(580,300);
  bg.addImage(bgImage);
  bg.scale =0.5;
  

  //create Mario sprite
  mario = createSprite(200,505,20,50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);

  //create ground sprite
  ground = createSprite(200,585,400,10);
  ground.visible = false;

  //create groups
  bricksGroup = new Group();
  coinsGroup = new Group();
  obstaclesGroup = new Group();

  restart = createSprite(500,300)
  restart.addImage(restartImg)
  restart.visible = false

  
}

function draw() {
 
  if (gameState==="PLAY"){
    mario.setCollider("rectangle",0,0,200,500);
    mario.scale =0.3;
    bg.velocityX = -6;
   //scroll background 
  if (bg.x < 100){
    bg.x=bg.width/4;
  }
  //prevent mario moving out with the bricks
  if(mario.x<200){
    mario.x=200;
  }
 //prevent mario moving out from top
  if(mario.y<50){
    mario.y=50;
  }
//jump with space
  if(keyDown("space") ) {
    mario.velocityY = -16;
  }
  //gravity
  mario.velocityY = mario.velocityY + 0.5;
 
  //call the function to generate bricks
  generateBricks();

  //Make Mario step(collide) on bricks  
  for(var i = 0 ; i< (bricksGroup).length ;i++){
    var temp = (bricksGroup).get(i) ;
    
    if (temp.isTouching(mario)) {
       mario.collide(temp);
      }     
    }

    //call the function to generate coins
    generateCoins();

    //Make Mario catch the coin
    for(var i = 0 ; i< (coinsGroup).length ;i++){
      var temp = (coinsGroup).get(i) ;
      
      if (temp.isTouching(mario)) {
        //play sound when coin in caught
        coinSound.play();
        //increase score when coin is caught
        coinScore++;
        //destroy coin once it is caught
        temp.destroy();
        temp=null;
        }
          
      }

      //call the function to generate Obstacles
      generateObstacles();

      if(obstaclesGroup.isTouching(mario)){
        dieSound.play();
        gameState = "END";
       }
    } //end of if(gameState === "PLAY")
    else if (gameState === "END") { 
      bg.velocityX = 0;
      mario.velocityY = 0;  
      mario.velocityX = 0; 
      obstaclesGroup.setVelocityXEach(0);
      coinsGroup.setVelocityXEach(0);
      bricksGroup.setVelocityXEach(0);
      obstaclesGroup.setLifetimeEach(-1);
      coinsGroup.setLifetimeEach(-1);
      bricksGroup.setLifetimeEach(-1);
      mario.changeAnimation("collided",mario_collided);
      mario.scale=0.4;
      mario.setCollider("rectangle",0,0,300,10);
      mario.y=570;
      restart.visible=true;
  

    }
   
    //prevent Mario from falling down due to gravity
  mario.collide(ground);

  //draw sprites on screen
  drawSprites();
  textSize(20);
  fill("brown");
  //display score
  text("Coins Collected: "+ coinScore, 500,50);
  
}


function generateBricks() {
  if (frameCount % 70 === 0) {
    var brick = createSprite(1200,120,40,10);
    brick.y = random(50,450);
    brick.addImage(brickImage);
    brick.scale = 0.5;
    brick.velocityX = -4;
    brick.lifetime =250;
    bricksGroup.add(brick);
  }
}

function generateCoins() {
  if (frameCount % 50 === 0) {
    var coin = createSprite(1200,120,40,10);
    coin.addAnimation("coin", coinImage);
    coin.y = random(80,350);
    coin.scale = 0.1;
    coin.velocityX = -5;
    coin.lifetime = 1200;
    coinsGroup.add(coin);
  }
}


function generateObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(1200,545,10,40);
    obstacle.velocityX = -5;
    obstacle.scale=0.2;
    var rand= Math.round(random(1,2));
    switch(rand){
    case 1:
        obstacle.addAnimation("mush",mushObstacleImage);
        break;
    case 2:
      obstacle.addAnimation("turtle", turtleObstacleImage);
        break;
    default:
        break;    
    }
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}


