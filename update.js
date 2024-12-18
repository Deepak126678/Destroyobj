/**
  `canvas` For selecting the html canvas element
 */
const canvas = document.getElementById("myCanvas"); 
/**
 *  `ctx` For geting the context of the canvas
 */
const ctx = canvas.getContext("2d");
/**
 *  `button` For selecting the button html element with Id "createCircle"
 */
const button = document.getElementById("createCircle");
/**
 * `fileInput` For selecting the input type="file"  html element
 */
const fileInput = document.getElementById("fileInput");
/**
 * `destroyButton` To select the Destroy button in html
 */
const destroyButton = document.getElementById("DestroyObject");
/**
 * `background` Variable for storing background image
 */
let backgroundImage = null; 
/**
 * `selectedCircle` Circle currently selected for destruction or dragging
 */
let selectedCircle = null; 
/**
 * `isDragging` Variable to track if the circle is being dragged
 */
let isDragging = false; 
/**
 * `offsetX` ForDragging the obj in x axis
 * `offsetY` ForDragging the obj in y axis
 */
let offsetX, offsetY;

/**
 * Circle Class with properties and methods
 */
class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.moonRadius = 5;
    this.orbitRadius = this.radius + 10;
    this.angle = Math.random() * Math.PI * 2;
    this.orbitSpeed = 0.02;
  }

  /**
   * @draw Function for drawing the circle  with circle parameter
   */
  draw() {
    const gradient = ctx.createRadialGradient(
      this.x - this.radius / 3,
      this.y - this.radius / 3,
      0,
      this.x,
      this.y,
      this.radius
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.3, this.color);
    gradient.addColorStop(1, "black");

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();

    this.updateMoonPosition();
  }
  /**
   * @updateMoonPosition  Function for revolving the moon around the sun  by geting theangle of revolution of x axis and 
   * y axis
   */
  updateMoonPosition() {
    this.angle += this.orbitSpeed;
    const moonX = this.x + Math.cos(this.angle) * this.orbitRadius;
    const moonY = this.y + Math.sin(this.angle) * this.orbitRadius;

    ctx.beginPath();
    ctx.arc(moonX, moonY, this.moonRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
  /**
   * @containsPoint Cheaks wheather the mouse is in circle
   * @param {Number} mouseX 
   * @param {Number} mouseY  
   * @returns {Boolean} we are returning the bool if the 
   */
  containsPoint(mouseX, mouseY) {
    return Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2) <= this.radius;
  }
}


 

    /**
     * @circle_set The circle set for storing circle Objects
     */
    circle_set = new Set();
  
  /**
   * 
   * @param {Circle} circle  Function for adding new circle in the circle_set
   */
  function addCircle(circle) {
    circle_set.add(circle);
  }
  /**
   * @drawCircles Function For Drawing every object of the set
   */
  function drawCircles() {
    this.circle_set.forEach((circle) => circle.draw());
  }
  /**
   * 
   * @param {Number} mouseX :Position of the mouse in x axis
   * @param {Number} mouseY Position of the mouse in Y axis
   * @returns 
   */
  function getCircleAtPoint(mouseX, mouseY) {
    for (const circle of this.circle_set) {
      if (circle.containsPoint(mouseX, mouseY)) return circle;
    }
    return null;
  }
  /**
   * @destroyCircle Function to destroy the object
   * @param {Circle} circle 
   */
   function destroyCircle(circle){
    this.circle_set.delete(circle);
  }
/**
 * File Input: Upload and load background image
 */
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => (backgroundImage = img);
});


button.addEventListener("click", () => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const radius = Math.random() * 20 + 10;
  const color = `hsl(${Math.random() * 360}, 70%, 50%)`;

  const newCircle = new Circle(x, y, radius, color);
  addCircle(newCircle);
});

/**
 *EventListner for mousedown Function
 */
canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  const circle = getCircleAtPoint(mouseX, mouseY);

  if (circle) {
    // Select the circle for dragging or destruction
    selectedCircle = circle;
    offsetX = mouseX - circle.x;
    offsetY = mouseY - circle.y;
    isDragging = true; // Start dragging the circle
  }
});

/**
 * Mouse Move: Dragging the circle while the mouse is down
 */
canvas.addEventListener("mousemove", (e) => {
  if (isDragging && selectedCircle) {
    selectedCircle.x = e.offsetX - offsetX;
    selectedCircle.y = e.offsetY - offsetY;
  }
});

/**
 * Mouse Up: Stop dragging
 */
canvas.addEventListener("mouseup", () => {
  isDragging = false; // Stop dragging
});

/**
 * Destroy Button: Destroy the selected circle after 5 seconds
 */
destroyButton.addEventListener("click", () => {
  if (!selectedCircle) {
   // alert("No circle selected to destroy!");
    return;
  }

  const circleToDestroy = selectedCircle; // Capture the currently selected circle
  selectedCircle = null; // Clear the selection

  
  setTimeout(() => {
    destroyCircle(circleToDestroy);
  
  }, 7000);
});

/**
 * Animation Loop
 */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background image if uploaded
  if (backgroundImage) {
    const aspectRatio = backgroundImage.width / backgroundImage.height;
    let newWidth = canvas.width;
    let newHeight = canvas.width / aspectRatio;

    if (newHeight > canvas.height) {
      newHeight = canvas.height;
      newWidth = canvas.height * aspectRatio;
    }

    const offsetX = (canvas.width - newWidth) / 2;
    const offsetY = (canvas.height - newHeight) / 2;

    ctx.drawImage(backgroundImage, offsetX, offsetY, newWidth, newHeight);
  }

  // Draw all circles
  drawCircles();

  requestAnimationFrame(animate);
}

// Start animation
animate();;
