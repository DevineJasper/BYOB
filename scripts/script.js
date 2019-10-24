{

  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  let vertices = [],
    indices = [],
    fragments = [],
    centers = [],
    newFragments = [];

  let colorsPlayer1 = [],
    colorsPlayer2 = [];

  let player1Buttons = [
    { buttonName: "left", buttonValue: 37 },
    { buttonName: "up", buttonValue: 38 },
    { buttonName: "right", buttonValue: 39 },
  ]

  let player2Buttons = [
    { buttonName: "a", buttonValue: 65 },
    { buttonName: "w", buttonValue: 87 },
    { buttonName: "d", buttonValue: 68 },
  ]

  let player1Key;
  let player2Key;

  let fragmentIndex;
  let inverseIndex;

  let drawArray = [];

  let gridSize = [10, 6];



  let gameOver = false;



  const init = () => {
    document.addEventListener(`click`, handleClick);

    // Draw the random points
    drawRandomPoints();
    generateColors();

    // Assign each player a starting key
    getPlayerKey(1);
    getPlayerKey(2);


    // Handle keydown events
    document.addEventListener("keydown", handleKeyPress);

    //ctx.context.globalCompositeOperation = 'lighter';

    // Execute the draw function
    draw();
  };

  // - Handle the key presses and draw triangles when the correct key is pressed
  const handleKeyPress = e => {
    console.log(`test`);
    if (gameOver === false) {
      if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39) {
        if (e.keyCode === player1Key.buttonValue) {
          console.log(`Player 1: Juiste toets`);
          getPlayerKey(1);

          // TEKEN HIER HET VOLGENDE DEELTJE
          drawTriangles(1);

          fragmentIndex++;

        } else {
          console.log(`Player 1: FOUT!!!`);
        }
      }

      if (e.keyCode === 65 || e.keyCode === 87 || e.keyCode === 68) {
        if (e.keyCode === player2Key.buttonValue) {
          console.log(`Player 2: Juiste toets`);
          getPlayerKey(2);

          // TEKEN HIER HET VOLGENDE DEELTJE
          drawTriangles(2);

          inverseIndex--;

        } else {
          console.log(`Player 2: FOUT!!!`);
        }
      }
    }
  }

  const getPlayerKey = player => {
    // Pick a random key for each player
    if (player === 1) {
      player1Key = player1Buttons[Math.floor(Math.random() * player1Buttons.length)];
    }

    if (player === 2) {
      player2Key = player2Buttons[Math.floor(Math.random() * player2Buttons.length)];
    }

    if (player1Key && player2Key) {
      console.log(`player 1:`, player1Key.buttonName.toUpperCase());
      console.log(`player 2:`, player2Key.buttonName.toUpperCase());
    }
  }

  // -- CREATE THE POINTS --
  const drawRandomPoints = () => {

    // Clear the canvas;
    ctx.clearRect(0, 0, 3840, 1080);

    // clear the arrays for the vertices, indices and fragments of the triangles;
    vertices = [];
    indices = [];
    fragments = [];

    ctx.fillStyle = 'rgb(0,0,0)'; // sets the color to fill in the rectangle with
    console.log(`draw points`);

    // generate random points
    for (i = 0; i < gridSize[0] + 1; i++) {
      for (j = 0; j < gridSize[1] + 1; j++) {
        vertices.push([
          i * canvas.width / gridSize[0] + randomRange(-150, 150),
          j * canvas.height / gridSize[1] + randomRange(-150, 150)
        ]);
      }
    }

    // draw corner points
    vertices.push([0, 0]);
    vertices.push([canvas.width, 0]);
    vertices.push([canvas.width, canvas.height]);
    vertices.push([0, canvas.height]);

    // Generate the triangles
    indices = Delaunay.triangulate(vertices);

    // Create fragments
    for (let i = 0; i < indices.length; i += 3) {
      fragments.push(new Fragment(
        vertices[indices[i + 0]],
        vertices[indices[i + 1]],
        vertices[indices[i + 2]]
      ));
    }

    // Sort the fragments
    sortTriangles(fragments);

    // Calculate starting points of both sides
    fragmentIndex = 0;
    inverseIndex = fragments.length - 1;
  }

  // -- Generate the colors --
  const generateColors = () => {

    for (let i = 0; i < 18; i++) {
      let h = 237,
        s = '100%',
        l = `${Math.round(randomRange(20, 40))}%`,
        a = 1;
      colorsPlayer1.push([h, s, l, a]);
    }

    for (let i = 0; i < 18; i++) {
      let h = 303,
        s = '100%',
        l = `${Math.round(randomRange(20, 40))}%`,
        a = 1;
      colorsPlayer2.push([h, s, l, a]);
    }
  }

  // -- Sort the triangles --
  const sortTriangles = fragments => {
    console.log(`fragments in sort`, fragments);

    newFragments = fragments.sort((a, b) => {
      //sort by x, secondary by y
      return a.centerPointX == b.centerPointX ? a.centerPointY - b.centerPointY : a.centerPointX - b.centerPointX;
    });
    console.log(`NEW FRAGMENTS`, newFragments);


  }

  // -- Draw triangles with interval --
  // const timeout = () => {
  //   setTimeout(() => {

  //     if (fragmentIndex >= inverseIndex + 1) {
  //       console.log(`kapot`);
  //       return;
  //       gameOver = true;
  //     }

  //     if (fragmentIndex <= (fragments.length / 2)) {
  //       let color = colorsPlayer1[Math.floor(Math.random() * colorsPlayer1.length)];
  //       //console.log(fragmentIndex);
  //       //newFragments[fragmentIndex].draw(color);
  //       //drawQueuedShapes(drawArray);
  //       //fadeIn(newFragments[fragmentIndex], color, 100);
  //       fragmentIndex++;
  //     }

  //     if (inverseIndex >= (fragments.length / 2)) {
  //       let color = colorsPlayer2[Math.floor(Math.random() * colorsPlayer2.length)];
  //       //console.log(inverseIndex);
  //       //newFragments[inverseIndex].draw(color);
  //       //drawQueuedShapes(drawArray);
  //       drawArray.push(newFragments)
  //       //fadeIn(newFragments[inverseIndex], color, 100);
  //       inverseIndex--;
  //     }
  //     timeout();
  //   }, 20);
  // }

  // const fadeIn = (fragment, color, initialColor, opacity) => {
  //   let steps = 100;
  //   let initialColorTest = initialColor;
  //   console.log(`LUMINANCE`, initialColorTest[2]);
  //   let startValue = 100;
  //   // let h = 0,
  //   //   s = '0%',
  //   //   l = `100%`;
  //   console.log(color);
  //   let timeOut;
  //   timeOut = setTimeout(() => {
  //     // if (fragmentIndex >= inverseIndex + 1) {
  //     //   console.log(`kapot`);
  //     //   return;
  //     //   gameOver = true;
  //     // }

  //     if (startValue >= initialColor) {
  //       //fragment.draw(color);
  //       let newColor = color[2].replace(/%/g, "");
  //       console.log(`gesliced kleur`, newColor);
  //       parseFloat(newColor);
  //       startValue -= 1;
  //       newColor = `${newColor}%`;
  //       console.log(`new new color`, newColor);
  //       //fragment.draw([h, s, l, opacity]);
  //       //console.log(`OPACITY`, opacity);
  //       //fadeIn(fragment, color, initialColorTest, opacity);
  //     } else {
  //       console.log(`BANAAAN`);
  //       fragment.draw(color);
  //       clearTimeout(timeOut);
  //     }
  //   }, 100);

  // }
  // const fadeIn = (fragment, color, initialValue) => {
  //   let timeOut;
  //   let drawColor;
  //   console.log(`fragment`, fragment);
  //   console.log(`color`, color);
  //   console.log(`initialvalue`, initialValue);
  //   let currentLuminanceValue = color[2].replace(/%/g, "");
  //   parseFloat(currentLuminanceValue);
  //   timeOut = setTimeout(() => {
  //     if (initialValue >= currentLuminanceValue) {
  //       let drawColor = [color[0], color[1], `${initialValue}%`, color[3]];
  //       //drawColor = `${newColor}%`;
  //       //fragment.draw(drawColor);
  //       initialValue -= 3;
  //       //console.log(`deze if werkt man`);
  //       drawArray.push({ fragment: fragment, color: drawColor });
  //       fadeIn(fragment, color, initialValue);
  //     }
  //   }, 1);
  // }

  // -- Draw the triangles based on player input
  const drawTriangles = player => {

    if (fragmentIndex >= inverseIndex + 1) {
      console.log(`STOP`);
      return;
      gameOver = true;
    }

    if (player === 1) {
      let color = colorsPlayer1[Math.floor(Math.random() * colorsPlayer1.length)];

      console.log(`Fragmentindex`, fragmentIndex);
      //newFragments[fragmentIndex].draw(color);
      drawArray.push({ fragment: [newFragments[fragmentIndex]], color: color });

    }

    if (player === 2) {
      let color = colorsPlayer2[Math.floor(Math.random() * colorsPlayer2.length)];
      console.log(`inverseIndex`, inverseIndex);
      //newFragments[inverseIndex].draw(color);
      drawArray.push({ fragment: [newFragments[inverseIndex]], color: color });
    }
  }

  class Fragment {
    constructor(v0, v1, v2) {
      this.v0 = v0;
      this.v1 = v1;
      this.v2 = v2;
      this.tri = [v0, v1, v2];
      this.centerpointX = 0;
      this.centerpointY = 0;


      this.fillOffsetX1 = 0;
      this.fillOffsetY1 = 0;
      this.fillOffsetX2 = 0;
      this.fillOffsetY2 = 0;

      this.visible = true;

      this.calculateDeltas();
      this.calculateCenters();
    }

    calculateDeltas() {
      this.fillOffsetX1 = this.v1[0] - this.v0[0];
      this.fillOffsetY1 = this.v1[1] - this.v0[1];
      this.fillOffsetX2 = this.v2[0] - this.v0[0];
      this.fillOffsetY2 = this.v2[1] - this.v0[1];
    }

    calculateCenters() {
      this.centerPointX = (this.tri[0][0] + this.tri[1][0] + this.tri[2][0]) / 3;
      this.centerPointY = (this.tri[0][1] + this.tri[1][1] + this.tri[2][1]) / 3;

    }

    draw(color) {
      if (this.visible === false) return;

      ctx.fillStyle = `hsla(${color})`; // sets the color to fill in the rectangle with
      ctx.strokeStyle = `hsla(${color})`; // sets the color to fill in the rectangle with
      //ctx.strokeStyle = `rgb(255, 255, 255)`; // sets the color to fill in the rectangle with
      //ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(this.v0[0], this.v0[1]);
      ctx.lineTo(this.v0[0] + this.fillOffsetX1, this.v0[1] + this.fillOffsetY1);
      ctx.lineTo(this.v0[0] + this.fillOffsetX2, this.v0[1] + this.fillOffsetY2);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }

  const randomRange = (min, max) => {
    return min + Math.random() * (max - min);
  }

  const handleClick = () => {
    drawRandomPoints();
  }

  const drawQueuedShapes = shapes => {
    //console.log(`ik test de queue functie`);
  }

  const draw = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.keys(drawArray).forEach((item) => {
      //console.log(`key`, item); // key
      //console.log(`value`, drawArray[item]); // value

      //console.log(drawArray[item].fragment[0].centerPointX);

      drawArray[item].fragment[0].draw(drawArray[item].color);
    });

    // drawArray.forEach(fragment => {
    //   fragment.
    // })

    //console.log(`drawArray`, drawArray);

    requestAnimationFrame(draw);

  }

  var lastLoop = new Date();
  function gameLoop() {
    var thisLoop = new Date();
    var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
    console.log(fps);
  }

  init();

}