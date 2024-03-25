 // Get canvas and context
 const canvas = document.getElementById('canvas');
 const ctx = canvas.getContext('2d');

 // Array to store falling meteors
 const meteors = [];

 // Meteor class
 class Meteor {
     constructor(x, y, speedX, speedY, size) {
         this.x = x;
         this.y = y;
         this.speedX = speedX;
         this.speedY = speedY;
         this.size = size;
         this.burning = true;
         this.tail = []; // Array to store tail segments
         this.tailLength = 50; // Length of the tail
     }

     // Draw the meteor
     draw() {
         // Draw tail
         this.tail.forEach((tailSegment, index) => {
             ctx.beginPath();
             ctx.arc(tailSegment.x, tailSegment.y, this.size * (1 - index / this.tailLength), 0, Math.PI * 2);
             ctx.fillStyle = `white`;
             ctx.fill();
         });

         // Draw meteor head
         ctx.beginPath();
         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
         ctx.fillStyle = this.burning ? 'lightgrey' : 'gray';
         ctx.fill();
     }

     // Update meteor's position
     update() {
         // Update tail
         this.tail.unshift({ x: this.x, y: this.y });
         if (this.tail.length > this.tailLength) {
             this.tail.pop();
         }

         // Update position
         this.x += this.speedX;
         this.y += this.speedY;

         // Check if meteor reached the bottom
         if (this.y > canvas.height + this.size) {
             playExplosionSound();
             meteors.splice(meteors.indexOf(this), 1);
             return; // Exit update function early to avoid further drawing
         }

         // Draw the meteor
         this.draw();
     }

     // Check if meteor was clicked
     checkClick(mouseX, mouseY) {
         const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
         return distance < this.size;
     }
 }

 // Function to generate random meteor
 function createMeteor() {
     const x = Math.random() * canvas.width;
     const y = -10;
     const speedX = Math.random() * 3 - 2; // Random horizontal speed between -2 and 1
     const speedY = Math.random() * 1 + 0.5; // Random vertical speed between 0.5 and 1
     const size = Math.random() * 10 + 5; // Adjust size range for more variation
     const meteor = new Meteor(x, y, speedX, speedY, size);
     meteors.push(meteor);
 }

 // Draw night sky
 function drawSky() {
     ctx.fillStyle = '#000';
     ctx.fillRect(0, 0, canvas.width, canvas.height);
 }

 // Draw moon
 function drawMoon() {
     ctx.beginPath();
     ctx.arc(100, 100, 50, 0, Math.PI * 2);
     ctx.fillStyle = 'lightyellow';
     ctx.fill();
 }

 // Draw mountains
 function drawMountains() {
     ctx.fillStyle = '#333';
     ctx.beginPath();
     ctx.moveTo(0, canvas.height);
     ctx.lineTo(200, 100);
     ctx.lineTo(400, canvas.height);
     ctx.closePath();
     ctx.fill();

     ctx.beginPath();
     ctx.moveTo(200, canvas.height);
     ctx.lineTo(500, 50);
     ctx.lineTo(800, canvas.height);
     ctx.closePath();
     ctx.fill();
 }

 // Draw landscape including meteors
 function drawLandscape() {
     drawMountains();
     drawMoon();
     meteors.forEach(meteor => meteor.update());
 }

 // Render the scene
 function render() {
     drawSky();
     drawLandscape();
 }

 // Create a falling meteor every 3 seconds
 setInterval(createMeteor, 3000);

 // Start rendering
 setInterval(render, 1000 / 60);

 // Function to play explosion sound
 function playExplosionSound() {
     const explosionSound = document.getElementById('explosionSound');
     explosionSound.currentTime = 0;
     explosionSound.play();
 }

 // Click event listener
 canvas.addEventListener('click', function (event) {
     const rect = canvas.getBoundingClientRect();
     const mouseX = event.clientX - rect.left;
     const mouseY = event.clientY - rect.top;

     meteors.forEach((meteor, index) => {
         if (meteor.checkClick(mouseX, mouseY)) {
             // Remove the meteor when clicked
             meteors.splice(index, 1);
         }
     });
 });