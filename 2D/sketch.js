const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: 'A4', // A4, A3, postcard, letter, etc...
  pixelsPerInch: 300,
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'orange';
    context.fillRect(0, 0, width, height);

    // Start drawing
    context.beginPath();
    context.arc(width / 2, height / 2, width * 0.2, 0, Math.PI * 2, false);

    // fill the inside
    context.fillStyle= 'red';
    context.fill();

    // stroke (the border color and width);
    context.strokeStyle = 'blue';
    context.lineWidth = width * 0.02;
    context.stroke();
  };
};

canvasSketch(sketch, settings);
