const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let penSize = document.getElementById("penSize").value;
let penColor = document.getElementById("penColor").value;
let drawingData = [];
let undoData = [];
let canChangeBackground = true; 
canvas.style.backgroundColor="white"

let originalBackgroundColor = canvas.style.backgroundColor;

canvas.style.position = "absolute";
canvas.style.right = "0";
canvas.style.top = "0";
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight-140;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
});

canvas.addEventListener("mousemove", draw);

canvas.addEventListener("mouseup", () => {
    if (isDrawing) {
        isDrawing = false;
        drawingData.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
});

function draw(e) {
    if (!isDrawing) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

document.getElementById("penSize").addEventListener("input", () => {
    penSize = document.getElementById("penSize").value;
});

document.getElementById("penColor").addEventListener("input", () => {
    penColor = document.getElementById("penColor").value;
});

document.getElementById("save").addEventListener("click", () => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.fillStyle = canvas.style.backgroundColor;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.href = tempCanvas.toDataURL("image/png");
    link.download = "drawing.png";
    link.click();
});


document.getElementById("eraser-img").addEventListener("click", () => {
    penColor = originalBackgroundColor; 
    penSize = 20;
});

document.getElementById("undo-button").addEventListener("click", () => {
    if (drawingData.length > 0) {
        undoData.push(drawingData.pop());
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (drawingData.length > 0) {
            ctx.putImageData(drawingData[drawingData.length - 1], 0, 0);
        }
    }
});

document.getElementById("bg-button").addEventListener("click", () => {
    val = canvas.style.backgroundColor = penColor;
    originalBackgroundColor = val; 
    canChangeBackground = false;
});
