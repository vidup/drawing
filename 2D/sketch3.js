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
 * We're adding the noise concept: pseudo random where close parameters
 * actually give close results, but as a "whole" or as a global picture,
 * it's pretty random.
 */

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const createGrid = () => {
    const points = [];
    const COUNT = 40;

    const colorCount = random.rangeFloor(2, 6);
    const palette = random.shuffle(random.pick(palettes));

    // Creating the 2D Grid, 5x5
    for (let x = 0; x < COUNT; x++) {
        for (let y = 0; y < COUNT; y++) {
            const u = COUNT <= 1 ? 0.5 : x / (COUNT - 1);
            const v = COUNT <= 1 ? 0.5 : y / (COUNT - 1);

            const frequency = 1.25;
            const randomness = random.noise2D(u * frequency, v * frequency);

            const randomRadius = (randomness * 0.5) + 0.5; // range from -1_1 to 0_1
            const radius = randomRadius * 0.15;
            const rotation = randomness;
            points.push({
                color: random.pick(palette),
                position: [u, v],
                radius,
                rotation,
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
    points
        .filter(binomial)
        .forEach((data) => {
            const {color, position, radius, rotation} = data;
            const [u, v] = position;
            // Now using u and v (0, 0.2) or (0.4, 0.6) etc... to create pixel sizes
            const x = lerp(MARGIN, width - MARGIN, u); // (minimum, maximum, y);
            const y = lerp(MARGIN, height - MARGIN, v);

            context.save()

            
            context.fillStyle = color;
            context.font = `${Math.max(30, radius * width)}px "Arial"`
            context.translate(x, y); // Moving the the grid coordinate to translate the character from x,y point
            context.rotate(rotation); // radian
                context.fillText('-', 0, 0); // We're already in the spot
            console.log(radius * width);
            context.restore();
    });
  };
};

canvasSketch(sketch, settings);