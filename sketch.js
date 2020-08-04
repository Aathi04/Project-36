var dog, happyDog, dogImg,happyDogImg
var bedRoomImg, washRoomImg, gardenImg
var database
var foodS,foodStock
var feed, addFood
var fedTime,lastFed
var readState
var gameState

function preload(){
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/happydog.png");
  bedRoomImg = loadImage("images/bedRoom.png");
  washRoomImg = loadImage("images/washRoom.png");
  gardenImg = loadImage("images/garden.png");
}

function setup() {
  createCanvas(800, 800);

  database = firebase.database();

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })
  
  dog = createSprite(600,200,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.7;
  
  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  

}

function draw() { 
  background(46,139,87);

  currentTime = hour()
  if(currentTime==(lastFed + 1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed + 2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else {
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}