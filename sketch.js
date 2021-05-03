//Create variables here
var dog,dogImage;
var database, foodAmount;
var bowl, petFoodGroup;
var mood;


function preload()
{
	//load images here
  dogImage = loadImage("images/dogImg.png");
  happyDogImage = loadImage("images/dogImg1.png");
  bowl = loadImage("images/dogfood.png")
}

function setup() {
	createCanvas(800, 700);
  dog = createSprite(400,350);
  dog.addAnimation("dog",dogImage);
  dog.addAnimation("happy_dog",happyDogImage);
  dog.scale=0.5

  database = firebase.database();
  foodAmount = database.ref("Food");
  mood = database.ref("Mood")
  foodAmount.on("value",readAmount,showError);
  mood.on("value",readMood,showError);
  
  petFoodGroup = new Group();
}


function draw() {  

  background("mediumvioletred")
  drawSprites();
  textSize(20)
  fill(0)
  if(foodAmount>-1){
    text ("Food Available: "+ foodAmount, 100,100 );
    if(foodAmount!=0){
      text ("Press UP ARROW to feed the puppy!",400,100)
    }
    else{
      text("Press SPACE to refill stock!",450,100)
    }
    
  }

  
  if(keyWentDown("UP_ARROW")&&foodAmount>0){
    writeAmount(1);
    
    moodHappy();
    addFoodBowl();
  }

  if(keyWentDown("SPACE")&&foodAmount<=0){
    resetStock(50);
  }
  if(petFoodGroup.size()===0){
    
    moodNormal();
  }

}

function readAmount(data){

  foodAmount = data.val()
}
function showError(){
  console.log("error")
}


function writeAmount(x){
  database.ref("Food").set(
    foodAmount-x
  )
}

function resetStock(n){
  database.ref("Food").set(
    n
  ) 
}

function addFoodBowl(){
  var foodBowl = createSprite(random(10,790),random(500,680));
  foodBowl.addAnimation("foodbowl",bowl);
  foodBowl.lifetime=200;
  foodBowl.scale=0.3;
  petFoodGroup.add(foodBowl)
}

function readMood(data){
  mood = data.val();
  if(mood===0){
    moodNormal();
  }
  else if(mood===1){
    moodHappy();
  }
}
function moodHappy(){
  database.ref("Mood").set(
    1
  )

  dog.changeAnimation("happy_dog");
}
function moodNormal(){
  database.ref("Mood").set(
    0
  )

  dog.changeAnimation("dog")
}