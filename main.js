// Get canvas and set up 2D context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Define game variables
const tileSize = 32;
const playerSize = 20;
const playerSpeed = 4;

// Define the player object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

// Define the town layout as an array of buildings
const town1 = [
  { x: 100, y: 100, width: 50, height: 50, color: 'red' },
  { x: 200, y: 200, width: 60, height: 60, color: 'blue' },
  { x: 300, y: 300, width: 40, height: 40, color: 'green' },
  { x: 350, y: 350, width: 10, height: 10, color: 'black' },
];

const town2 = [
  { x: 100, y: 100, width: 60, height: 60, color: 'purple' },
  { x: 200, y: 200, width: 50, height: 50, color: 'orange' },
  { x: 300, y: 300, width: 40, height: 40, color: 'yellow' },
  { x: 20, y: canvas.height / 2, width: 20, height: 20, color: 'black' },
];

// Current town variable
let currentTown = town1;

const sheep = {
  x: 150,
  y: 150,
  size: 20,
  speed: 1,
  wanderTimer: 0,
  direction: { x: 0, y: 0 },
  baaTimer: 0,
};

const npc = {
  x: 350,
  y: 100,
  size: 20,
  dialogue: ['Hello, stranger', 'How are you'],
  dialogueIndex: -1,
};

// Handle user input
document.addEventListener('keydown', (e) => {
  // ...
  if (e.key === ' ') {
    const distanceToSheep = Math.sqrt(Math.pow(player.x - sheep.x, 2) + Math.pow(player.y - sheep.y, 2));
    if (distanceToSheep <= 50) {
      sheep.baaTimer = 180; // 180 frames (3 seconds)
    }

    const distanceToNpc = Math.sqrt(Math.pow(player.x - npc.x, 2) + Math.pow(player.y - npc.y, 2));
    if (distanceToNpc <= 50) {
      npc.dialogueIndex = (npc.dialogueIndex + 1) % (npc.dialogue.length + 1);
      if (npc.dialogueIndex === npc.dialogue.length) {
        npc.dialogueIndex = -1;
      }
    }
  }
});

// Handle user input
document.addEventListener('keydown', (e) => {
  if (e.key === 'w') player.y -= playerSpeed;
  if (e.key === 'a') player.x -= playerSpeed;
  if (e.key === 's') player.y += playerSpeed;
  if (e.key === 'd') player.x += playerSpeed;
});

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (npc.dialogueIndex >= 0) {
    ctx.fillStyle = "rgba(128, 128, 128, 0.8)";
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(npc.dialogue[npc.dialogueIndex], 10, canvas.height - 50);
  }

  if (sheep.wanderTimer === 0) {
    sheep.direction = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    sheep.wanderTimer = Math.floor(Math.random() * 60) + 60;
  } else {
    sheep.wanderTimer--;
  }

  sheep.x += sheep.direction.x * sheep.speed;
  sheep.y += sheep.direction.y * sheep.speed;


  // Draw the buildings
  currentTown.forEach((building) => {
    ctx.fillStyle = building.color;
    ctx.fillRect(building.x, building.y, building.width, building.height);
  });

  // Check for collisions and adjust player position
  currentTown.forEach((building) => {
    if (sheep.x + sheep.size > building.x && sheep.x < building.x + building.width && sheep.y + sheep.size > building.y && sheep.y < building.y + building.height) {
      if (sheep.x < building.x) sheep.x = building.x - sheep.size;
      if (sheep.x > building.x + building.width) sheep.x = building.x + building.width;
      if (sheep.y < building.y) sheep.y = building.y - sheep.size;
      if (sheep.y > building.y + building.height) sheep.y = building.y + building.height;
    }
   // Check for building collision for all buildings except the black square
    if (player.x + playerSize > building.x && player.x < building.x + building.width && player.y + playerSize > building.y && player.y < building.y + building.height && building.color !== 'black') {
      if (player.x < building.x) player.x = building.x - playerSize;
      if (player.x > building.x + building.width) player.x = building.x + building.width;
      if (player.y < building.y) player.y = building.y - playerSize;
      if (player.y > building.y + building.height) player.y = building.y + building.height;
    }


    // Check for black square collision and switch towns
    if (building.color === 'black' && player.x + playerSize > building.x && player.x < building.x + building.width && player.y + playerSize > building.y && player.y < building.y + building.height) {
      if (currentTown === town1) {
        currentTown = town2;
        player.x = 40;
      } else {
        currentTown = town1;
        player.x = canvas.width - 60;
      }
      player.y = canvas.height / 2;
    }
  });

  // Draw the player
  ctx.fillStyle = "black";
  ctx.fillRect(player.x, player.y, playerSize, playerSize);

  // Draw the sheep
  ctx.fillStyle = "white";
  ctx.fillRect(sheep.x, sheep.y, sheep.size, sheep.size);
  ctx.strokeStyle = "black";
  ctx.strokeRect(sheep.x, sheep.y, sheep.size, sheep.size);

  ctx.fillStyle = "brown";
  ctx.fillRect(npc.x, npc.y, npc.size, npc.size);

  if (sheep.baaTimer > 0) {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Baa!', sheep.x, sheep.y - 10);
    sheep.baaTimer--;
  }

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
