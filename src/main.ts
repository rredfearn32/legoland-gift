import {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Body,
  Sleeping,
  Mouse,
  MouseConstraint,
} from "matter-js";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const isSleeping = true;

const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "navy",
  "violet",
  "pink",
  "grey",
  "turquoise",
];

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.querySelector("#matter") as HTMLInputElement,
  engine: engine,
  options: {
    height: screenHeight,
    width: screenWidth,
    background: "rgba(255,255,255,1)",
    wireframes: false,
  },
});

const ground = Bodies.rectangle(
  screenWidth / 2,
  screenHeight + 50,
  screenWidth,
  100,
  {
    isStatic: true,
  }
);
const ceiling = Bodies.rectangle(screenWidth / 2, -100, screenWidth, 100, {
  isStatic: true,
});
const leftWall = Bodies.rectangle(0, screenHeight - 1, 1, screenHeight * 2, {
  isStatic: true,
});
const rightWall = Bodies.rectangle(
  screenWidth,
  screenHeight - 1,
  1,
  screenHeight * 2,
  {
    isStatic: true,
  }
);

const blocks: Body[] = [];

const height = 50,
  width = 100;

let positionCountX = 0;

for (let i = 0; i < 6; i++) {
  let positionCountY = 0;
  for (let j = 0; j < 10; j++) {
    let x;

    if (i < 3) {
      x = screenWidth / 2 - width / 2 - positionCountX * width;
    } else {
      if (positionCountX === 3) {
        positionCountX = 0;
      }
      x = screenWidth / 2 + width / 2 + positionCountX * width;
    }

    let y;

    if (j < 5) {
      y = screenHeight / 2 - height / 2 - positionCountY * height;
    } else {
      if (positionCountY === 5) {
        positionCountY = 0;
      }
      y = screenHeight / 2 + height / 2 + positionCountY * height;
    }

    const chosenColor = colors[Math.floor(Math.random() * 10)];

    blocks.push(
      Bodies.rectangle(x, y, width, height, {
        isSleeping,
        render: {
          sprite: {
            texture: `/assets/images/${
              colors[Math.floor(Math.random() * 10)]
            }.png`,
            xScale: 0.405,
            yScale: 0.409,
          },
          fillStyle: chosenColor,
          lineWidth: 0,
        },
      })
    );

    positionCountY++;
  }

  positionCountX++;
}

// add all of the bodies to the world
Composite.add(engine.world, [...blocks, ground, ceiling, leftWall, rightWall]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

render.canvas.onclick = () => {
  blocks.forEach((i) => {
    Sleeping.set(i, false);
    render.options.background = "rgba(255,255,255,0)";
    const isNegative = Math.random() < 0.5;

    const randomX = Math.random() * (isNegative ? -1 : 1);
    const randomY = Math.random() * (isNegative ? -1 : 1);
    i.force = { x: randomX / 5, y: randomY / 5 };
  });

  render.canvas.onclick = () => {};

  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

  Composite.add(engine.world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;
};
