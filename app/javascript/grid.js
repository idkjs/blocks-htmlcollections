export const COLOURS = ["red", "green", "blue", "yellow"];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

export class BlockGrid {
  constructor() {
    this.grid = [];

    for (let x = 0; x < MAX_X; x++) {
      let col = [];
      for (let y = 0; y < MAX_Y; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }

    return this;
  }

  render(el = document.querySelector("#gridEl")) {
    for (let x = 0; x < MAX_X; x++) {
      let id = "col_" + x;
      let colEl = document.createElement("div");
      colEl.className = "col";
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = MAX_Y - 1; y >= 0; y--) {
        let block = this.grid[x][y],
          id = `block_${x}x${y}`,
          blockEl = document.createElement("div");

        blockEl.id = id;
        blockEl.className = "block";
        blockEl.style.background = block.colour;
        blockEl.addEventListener("click", evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  blockClicked(e, block) {
    const blocks = document.getElementsByClassName("block");

    let getBlock = (x, y) => {
      return blocks[`block_${x}x${y}`] || null;
    };
    let removeBlock = (block, colour) => {
      block.style.background = "grey";
      block.className += " matched";
      checkBlocks(block, "y", colour);
      checkBlocks(block, "x", colour);
    };

    let getXY = el => el.id.split("_").pop().split("x").map(Number);
    let checkBlocks = (el, axis, colour) => {
      const x = getXY(el)[0];
      const y = getXY(el)[1];

      const start_x_y = axis === "x" ? x : y;
      const next_block_positions = [start_x_y + 1, start_x_y - 1];
      const MAX = axis === "x" ? MAX_X : MAX_Y;

      next_block_positions.forEach(n => {
        if (n >= 0 && n < MAX) {
          let next_block = axis === "x" ? getBlock(n, y) : getBlock(x, n);
          if (next_block !== null) {
            let next_block_colour = next_block.style.background;
            if (next_block_colour === colour && next_block_colour !== "grey") {
              removeBlock(next_block, colour);
            }
          }
        }
      });
    };

    let updateIds = () => {
      for (let x = 0; x < MAX_X; x++) {
        let y = MAX_Y - 1;
        const divs = Array.from(
          document.querySelectorAll("#col_" + x + " div")
        );
        divs.forEach(div => {
          div.id = `block_${x}x${y--}`;
        });
      }
    };
    let dropBlocks = () => {
      for (var i = 0; i < blocks.length; i++) {
        let col = blocks[i].parentElement;
        let block = blocks[i];
        if (blocks[i].attributes.class.value === "block matched") {
          let oldChild = col.removeChild(block);
          col.insertBefore(oldChild, col.firstChild);
          updateIds();
        }
      }
    };

    let target = blocks[e.target.id];

    console.log("RUNNING_COLLECTIONS");

    removeBlock(target, target.style.background);
    dropBlocks();
  }
}

window.addEventListener("DOMContentLoaded", () => new BlockGrid().render());
