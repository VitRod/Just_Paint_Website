
// DomStrings
const { body } = document;
const brush = document.getElementById('brush');
const bucket = document.getElementById('bucket');
const eraser = document.getElementById('eraser');
const brushSlider = document.getElementById('brush-slider');
const brushSize = document.getElementById('brush-size');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const colorSelector = document.getElementById('bucket-color');


// Global variables 
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const context = canvas.getContext('2d');
let isEraser = false;
let isDrawing = false;
let currentColor = 'ffffff';
let currentBackground = 'ffffff';
let currentTool = 'brush';
let currentSize = 10;
let drawnArray = [];
let partialDrawnArray = [];
let steps = 10;
let stepsIdentifier = [];
redoBtn.disabled = true;
undoBtn.disabled = true;



// cursors
const curBrush = 'icons/paint.png';
const curBucket = 'icons/fill-drip.png';
const curEraser = 'icons/erase_icon.png';
canvas.style.cursor = `url('${curBrush}'), auto`; 

/**
 * Functions
 */

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = `#${currentBackground}`;  
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas); 

};  

// Formatting Brush Size
function displayBrushSize(currentSize) {
  if(currentSize >= 10){
    brushSize.innerText = currentSize;
  } else{
    brushSize.innerText = `0${currentSize}`;
  }  
}



// Draw what is stored in DrawnArray

function restoreCanvas(arr) {
  for (let i = 1; i < arr.length; i++) {
    context.beginPath();
    context.moveTo(arr[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = arr[i].size;
    context.lineCap = 'round';
    if (arr[i].erase) {
      context.strokeStyle = `#${currentBackground}`;
    } else {
      context.strokeStyle = `#${drawnArray[i].color}`;
    }
    context.lineTo(arr[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  if(partialDrawnArray.length > 0 ){
    drawnArray.push(line);
    partialDrawnArray.push(line);
  } else {
    drawnArray.push(line);
  }
  
  
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

/**
 * Event Listners
 */

// Mouse Up
canvas.addEventListener('mouseup', () => {
  isDrawing = false;  
});

// Select current color
colorSelector.addEventListener('change', ()=>{
  currentColor = colorSelector.value;  
});

// Select Brush tool
brush.addEventListener('click', (event) =>{
  canvas.style.cursor = `url('${curBrush}'), auto`;
  currentTool = 'brush';
  isEraser = false;
  currentColor = colorSelector.value;
});

// Select Bucket tool
bucket.addEventListener('click', (event) =>{
  canvas.style.cursor = `url('${curBucket}'), auto`;
  currentTool = 'bucket'
});

// Select Eraser tool
eraser.addEventListener('click', (event) =>{
  canvas.style.cursor = `url('${curEraser}'), auto`;
  currentTool = 'eraser';
  isEraser = true;  
  currentColor = currentBackground;  
  currentSize = brushSlider.value;
});

// Setting Brush Size
brushSlider.addEventListener('change', () => {
  currentSize = brushSlider.value;
  displayBrushSize(currentSize);
});


// UNDO functionality
undoBtn.addEventListener('click', () =>{  
  createCanvas();
  redo.disabled = false;

  //creat partial drawn array based on how many steps to back(skipping the undefined values)
  stepsIdentifier = [];
  if (partialDrawnArray.length === 0) {    
    for (let i = drawnArray.length -1; i < drawnArray.length; i--) {
      if(drawnArray[i].color !== undefined ){
        stepsIdentifier.push(drawnArray[i]);
      }
      if(stepsIdentifier.length === steps){
        break;
      }      
    }
  } else {
    for (let i = partialDrawnArray.length -1; i >= 0 ; i--) {
      if(partialDrawnArray[i].color !== undefined ){
        stepsIdentifier.push(partialDrawnArray[i]);
      }
      if(stepsIdentifier.length === steps){
        break;
      }
    }  
  };  

  if(stepsIdentifier.length < steps){
    partialDrawnArray = [];
  } else {
    let tillToUndo = drawnArray.indexOf(stepsIdentifier[stepsIdentifier.length - 1]);
    partialDrawnArray = drawnArray.slice(0, tillToUndo);
  }  

  // restore canvas with partial drawnArray 
  restoreCanvas(partialDrawnArray);  

  if(partialDrawnArray.length === 0){
    undoBtn.disabled = true;
    eraser.disabled = true;
    canvas.style.cursor = `url('${curBrush}'), auto`;
    currentTool = 'brush';
    isEraser = false;
    currentColor = colorSelector.value;
  };   
});

// Redo functionality
redoBtn.addEventListener('click', () =>{
  
  undoBtn.disabled = false;
  eraser.disabled = false;
  //creat partial drawn array based on how many steps to forward(skipping the undefined values)
  stepsIdentifier = [];
  if (partialDrawnArray.length === 0) {    
    for (let i = 0; i < drawnArray.length; i++) {
      if(drawnArray[i].color !== undefined ){
        stepsIdentifier.push(drawnArray[i]);
      }
      if(stepsIdentifier.length === steps){
        break;
      }      
    }
  } else {
    for (let i = partialDrawnArray.length -1; i < drawnArray.length ; i++) {
      if(drawnArray[i].color !== undefined ){
        stepsIdentifier.push(drawnArray[i]);
      }
      if(stepsIdentifier.length === steps){
        break;
      }
    }  
  };  

  if(stepsIdentifier.length < steps){
    partialDrawnArray = [...drawnArray];
  } else {
    let tillToUndo = drawnArray.indexOf(stepsIdentifier[stepsIdentifier.length - 1]);
    partialDrawnArray = drawnArray.slice(0, tillToUndo);
  }
  
  // Re-store canvas fro partial drawnArray
  restoreCanvas(partialDrawnArray); 
  
  if(drawnArray.length === partialDrawnArray.length){
    redoBtn.disabled = true;
  }
     
});

canvas.addEventListener('mousedown', ()=>{
    if(currentTool === 'bucket'){
    currentBackground = currentColor;
    createCanvas();
    if(partialDrawnArray.length > 0){
      restoreCanvas(partialDrawnArray);
    } else if(partialDrawnArray.length === 0 && redoBtn.disabled === false){
      restoreCanvas(partialDrawnArray);
    } else {
      restoreCanvas(drawnArray);
    }
    
  } else{ 
    isDrawing = true;
    const currentPosition = getMousePosition(event);  
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = currentSize;
    context.lineCap = 'round';
    context.strokeStyle = `#${currentColor}`;
  }
});


// Mouse Move
canvas.addEventListener('mousemove', (event) => {
  
  if (isDrawing) {        
    const currentPosition = getMousePosition(event);    
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
     if(partialDrawnArray.length > 0){
      drawnArray = [...partialDrawnArray];       
      partialDrawnArray = [];       
      storeDrawn(
        currentPosition.x,
        currentPosition.y,
        currentSize,
        currentColor,
        isEraser,
      );
    } else if(partialDrawnArray.length === 0 && redoBtn.disabled === false){
      drawnArray = [];       
      partialDrawnArray = [];            
      storeDrawn(
        currentPosition.x,
        currentPosition.y,
        currentSize,
        currentColor,
        isEraser,
      );
    } else{
      
      storeDrawn(
        currentPosition.x,
        currentPosition.y,
        currentSize,
        currentColor,
        isEraser,
      );
    }
    undoBtn.disabled = false;
    redoBtn.disabled = true;
    eraser.disabled = false; 
  
  }  else {
    storeDrawn(undefined);
  } 
  
});


// Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];
  partialDrawnArray = [];
  new Snackbar("Canvas Cleared", {timeout: 1500});  
});

// Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
  localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));
  new Snackbar("Canvas Saved", {timeout: 1500});  
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem('savedCanvas')) {
    drawnArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas(drawnArray);
    new Snackbar("Canvas Loaded", {timeout: 1500});
  } else {
    new Snackbar("Nothing To Load", {timeout: 1500});
  }
});

// Clear Local Storage
clearStorageBtn.addEventListener('click', () => {
  localStorage.removeItem('savedCanvas');
  new Snackbar("Local Storage Cleared", {timeout: 1500});
});

// Download Image
downloadBtn.addEventListener('click', () => {
  downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
  downloadBtn.download = 'paint.jpeg';
   console.log('download clicked') ;
});

/**
 * On Load
 */
createCanvas();
