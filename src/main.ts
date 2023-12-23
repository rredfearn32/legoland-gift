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
import { generateBlocks } from "./utils";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.querySelector("#matter") as HTMLInputElement,
  engine: engine,
  options: {
    height: screenHeight,
    width: screenWidth,
    background: "rgb(239, 68, 68, 0)",
    wireframes: false,
  },
});

const platform = Bodies.rectangle(
  screenWidth / 2,
  screenHeight / 2 + 50 * 5,
  screenWidth,
  100,
  {
    isStatic: true,
    render: {
      fillStyle: "transparent",
    },
  }
);
const ground = Bodies.rectangle(
  screenWidth / 2,
  screenHeight + 50,
  screenWidth,
  100,
  {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }
);
const ceiling = Bodies.rectangle(screenWidth / 2, -100, screenWidth, 100, {
  isStatic: true,
});
const leftWall = Bodies.rectangle(
  -50,
  screenHeight - 1,
  100,
  screenHeight * 2,
  {
    isStatic: true,
  }
);
const rightWall = Bodies.rectangle(
  screenWidth + 50,
  screenHeight - 1,
  100,
  screenHeight * 2,
  {
    isStatic: true,
  }
);

const blocks: Body[] = generateBlocks(screenHeight, screenWidth);

// add all of the bodies to the world
Composite.add(engine.world, [
  ...blocks,
  ground,
  platform,
  ceiling,
  leftWall,
  rightWall,
]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

let childLimit = 0;

document.onkeydown = (event) => {
  if (event.key === "e") {
    if (childLimit < 2) {
      Composite.add(engine.world, generateBlocks(screenHeight, screenWidth));
    }
    childLimit++;
  }
};

render.canvas.onclick = () => {
  document.querySelector("#content")?.classList.remove("hidden");
  Composite.remove(engine.world, platform);

  blocks.forEach((i) => {
    Sleeping.set(i, false);
    render.options.background = "rgba(255,255,255,0)";
    const isNegative = Math.random() < 0.5;

    const randomX = Math.random() * (isNegative ? -1 : 1);
    const randomY = Math.random() * (isNegative ? -1 : 1);
    i.force = { x: randomX / 3, y: randomY / 3 };
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
