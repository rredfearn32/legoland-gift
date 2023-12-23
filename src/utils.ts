import { Bodies } from "matter-js";

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

export const generateBlocks = (screenHeight: number, screenWidth: number) => {
  const blocks = [],
    height = 50,
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

      blocks.push(
        Bodies.rectangle(x, y, width, height, {
          render: {
            sprite: {
              texture: `/assets/images/${
                colors[Math.floor(Math.random() * 10)]
              }.png`,
              xScale: 0.405,
              yScale: 0.409,
            },
            lineWidth: 0,
          },
        })
      );

      positionCountY++;
    }

    positionCountX++;
  }
  return blocks;
};
