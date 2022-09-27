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






































