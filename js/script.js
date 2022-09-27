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






























