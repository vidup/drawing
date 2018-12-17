const canvasSketch = require('canvas-sketch');
const palettes = require('nice-color-palettes');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
// lerp is linear interpolation

const settings = {
  dimensions: [2048, 2048], // A4, A3, postcard, letter, etc...
  pixelsPerInch: 300,
};

/**
 * We're working in U*V space, which means we're not manipulating pixels,
 * But a scale form 0 to 1
 */

const createGrid = () => {
    const points = [];
    const COUNT = 40;

    const colorCount = random.rangeFloor(2, 6);
    const palette = random.shuffle(random.pick(palettes))
        .slice(0, colorCount);

    // Creating the 2D Grid, 5x5
    for (let x = 0; x < COUNT; x++) {
        for (let y = 0; y < COUNT; y++) {
            const u = COUNT <= 1 ? 0.5 : x / (COUNT - 1);
            const v = COUNT <= 1 ? 0.5 : y / (COUNT - 1);
            points.push({
                color: random.pick(palette),
                position: [u, v],
                radius: Math.abs(random.gaussian() * 0.01),
            });
        }
    }

    return points;
}

const MARGIN = 400;
const binomial = (() => random.value() >= 0.5);

const sketch = () => {
    // I like the seed 512 palette
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const points = createGrid();
    random.setSeed(512);
    points
        .filter(binomial)
        .forEach((data) => {
            const {color, position, radius} = data;
            const [u, v] = position;
            // Now using u and v (0, 0.2) or (0.4, 0.6) etc... to create pixel sizes
            const x = lerp(MARGIN, width - MARGIN, u); // (minimum, maximum, y);
            const y = lerp(MARGIN, height - MARGIN, v);

            context.beginPath();
            context.arc(x, y, radius * width, 0, Math.PI * 2, false);
            context.fillStyle = color;
            context.fill()
    });
  };
};

canvasSketch(sketch, settings);
