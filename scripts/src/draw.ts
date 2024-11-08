const canvas = document.getElementById("plotCanvas") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");

const centerX = canvas?.width ? canvas.width / 2 : 0;
const centerY = canvas?.height ? canvas.height / 2 : 0;
const scale = 28;

function drawAxes() {
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.moveTo(canvas.width - 10, centerY - 5);
    ctx.lineTo(canvas.width, centerY);
    ctx.lineTo(canvas.width - 10, centerY + 5);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("X", canvas.width - 14, centerY + 19);
    ctx.fillText("Y", centerX + 10, 14);
}

function drawCircle(R: number) {
    if (!ctx) return;
    ctx.fillStyle = "#731c1a";
    ctx.beginPath();
    ctx.arc(centerX, centerY, R * scale, -Math.PI, -Math.PI / 2);
    ctx.lineTo(centerX, centerY);
    ctx.fill();
    ctx.closePath();
}

function drawTriangle(R: number) {
    if (!ctx) return;
    ctx.fillStyle = "#731c1a";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + (R / 2) * scale);
    ctx.lineTo(centerX - R * scale, centerY);
    ctx.fill();
    ctx.closePath();
}

function drawSquare(R: number) {
    if (!ctx) return;
    ctx.fillStyle = "#731c1a";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + (R / 2) * scale);
    ctx.lineTo(centerX + R * scale, centerY + (R / 2) * scale);
    ctx.lineTo(centerX + R * scale, centerY);
    ctx.fill();
    ctx.closePath();
}

function drawPoint(x: number, y: number) {
    if (!ctx) return;
    ctx.strokeStyle = "#6df914";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX + x * scale, centerY - y * scale, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}

export function drawGraphics(x: number, y: number, r: number) {
    // Validate canvas and context
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSquare(r);
    drawCircle(r);
    drawTriangle(r);
    drawAxes();
    drawPoint(x, y);
}
