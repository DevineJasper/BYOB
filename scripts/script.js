{

  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  const backgroundCanvas = document.getElementById('c2');
  const backgroundCtx = backgroundCanvas.getContext('2d');

  const newCanvas = document.getElementById('c3');
  const newCtx = newCanvas.getContext('2d');

  let vertices = [],
    indices = [],
    fragments = [],
    newFragments = [];

  let colorsPlayer1 = [],
    colorsPlayer2 = [],
    blueTriangles = [],
    pinkTriangles = [],
    newBlueArray = [],
    newPinkArray = [],
    curve = [];

  let player1Buttons = [
    { buttonName: "left", buttonValue: 37 },
    { buttonName: "up", buttonValue: 38 },
    { buttonName: "right", buttonValue: 39 },
  ];

  let player2Buttons = [
    { buttonName: "a", buttonValue: 65 },
    { buttonName: "w", buttonValue: 87 },
    { buttonName: "d", buttonValue: 68 },
  ];

  let player1Key, player2Key;

  let fragmentIndex, inverseIndex, sweepIndexLeft, sweepIndexRight;

  let gridSize = [29, 9];

  let gameOver = false;
  let colorTriggered = false;

  let offset = 0;

  let offsetSweep = true;

  // NIEUW END GAME BOOLS
  let pinkSweepEnded, blueSweepEnded = false;

  // PRUTS CODE LED ANIMATIE
  let timeSincePress = 0;
  let animationTriggered = false;

  let point1 = 120;
  let point2 = 380;
  let point3 = 422;
  let point4 = 471;
  let point5 = 900;


  const init = () => {
    document.addEventListener(`click`, handleClick);

    // Draw the random points
    drawRandomPoints();
    generateColors();

    // Assign each player a starting key
    getPlayerKey(1);
    getPlayerKey(2);

    easeInOutQuad();
    // Handle keydown events
    document.addEventListener("keydown", handleKeyPress);

    // Blend mode
    ctx.globalCompositeOperation = 'lighter';

    // Execute the draw function
    draw();
  };

  // - Handle the key presses and draw triangles when the correct key is pressed
  const handleKeyPress = e => {
    if (e.keyCode === 32) {
      console.log(`opnieuw starten`);
    }

    if (gameOver === false) {

      if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39) {
        // PRUTS CODE LED ANIMATIE
        timeSincePress = 0;
        animationTriggered = false;
        // EINDE PRUTS
        if (e.keyCode === player1Key.buttonValue) {
          console.log(`Player 1: Juiste toets`);
          getPlayerKey(1);

          setIntervalX(() => {

            if (gameOver === false) {
              drawTriangles(1);
              fragmentIndex++;
            } else {
              console.log(`STOP`);
            }
            console.log(`fragment: `, fragmentIndex);
            console.log(`inverse: `, inverseIndex);
          }, 100, 2);


        } else {
          console.log(`Player 1: FOUT!!!`);
        }
      }

      if (e.keyCode === 65 || e.keyCode === 87 || e.keyCode === 68) {
        // PRUTS CODE LED ANIMATIE
        timeSincePress = 0;
        animationTriggered = true;
        // EINDE PRUTS

        if (e.keyCode === player2Key.buttonValue) {
          console.log(`Player 2: Juiste toets`);
          getPlayerKey(2);

          setIntervalX(() => {

            if (gameOver === false) {
              drawTriangles(2);
              inverseIndex--;
            } else {
              console.log(`STOP`);
            }

            console.log(`fragment: `, fragmentIndex);
            console.log(`inverse: `, inverseIndex);

          }, 100, 2);


        } else {
          console.log(`Player 2: FOUT!!!`);
        }
      }


    }
  }

  const setIntervalX = (callback, delay, repetitions) => {
    let x = 0;
    let intervalID = window.setInterval(() => {

      callback();

      if (++x === repetitions) {
        window.clearInterval(intervalID);
      }
    }, delay);
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

    // // generate random points INSIDE the canvas -- STANDARD
    // for (i = 1; i < gridSize[0]; i++) {
    //   for (j = 1; j < gridSize[1]; j++) {
    //     vertices.push([
    //       i * canvas.width / gridSize[0] + randomRange(-150, 150),
    //       j * canvas.height / gridSize[1] + randomRange(-150, 150)
    //     ]);
    //   }
    // }

    // generate random points INSIDE the canvas -- TOP
    for (i = 1; i < gridSize[0]; i++) {
      for (j = point1; j < point2; j += 100) {
        vertices.push([
          i * canvas.width / gridSize[0] + randomRange(-10, 10),
          j + randomRange(-10, 10)
        ]);
      }
    }

    // generate random points INSIDE the canvas -- BALK
    for (i = 1; i < gridSize[0]; i++) {
      for (j = point2; j < point3; j += 42) {
        vertices.push([
          i * canvas.width / gridSize[0] + randomRange(-10, 10),
          j + randomRange(-10, 10)
        ]);
      }
    }

    // generate random points INSIDE the canvas -- AFDAK
    for (i = 1; i < gridSize[0]; i++) {
      for (j = point3; j < point4; j += 15) {
        vertices.push([
          i * canvas.width / gridSize[0] + randomRange(-10, 10),
          j + randomRange(-10, 10)
        ]);
      }
    }

    // generate random points INSIDE the canvas -- BOTTOM
    for (i = 1; i < gridSize[0]; i++) {
      for (j = point4; j < point5; j += 100) {
        vertices.push([
          i * canvas.width / gridSize[0] + randomRange(-10, 10),
          j + randomRange(-10, 10)
        ]);
      }
    }

    // generate random ALONG SIDE PART 1
    for (j = point1; j < point2; j += 100) {
      vertices.push([
        0,
        j + randomRange(-10, 10),
      ]);
      vertices.push([
        3840,
        j + randomRange(-10, 10),
      ]);
    }

    // generate random ALONG SIDE PART 1
    for (j = point2; j < point3; j += 42) {
      vertices.push([
        0,
        j + randomRange(-10, 10),
      ]);
      vertices.push([
        3840,
        j + randomRange(-10, 10),
      ]);
    }

    // generate random ALONG SIDE PART 1
    for (j = point3; j < point4; j += 15) {
      vertices.push([
        0,
        j + randomRange(-10, 10),
      ]);
      vertices.push([
        3840,
        j + randomRange(-10, 10),
      ]);
    }

    // generate random ALONG SIDE PART 1
    for (j = point4; j < point5; j += 100) {
      vertices.push([
        0,
        j + randomRange(-10, 10),
      ]);
      vertices.push([
        3840,
        j + randomRange(-10, 10),
      ]);
    }

    // // Draw points along top and bottom side -- DISTORT -- X
    // for (i = 1; i < gridSize[0]; i++) {
    //   vertices.push([
    //     i * canvas.width / gridSize[0],
    //     point1
    //   ])
    //   vertices.push([
    //     i * canvas.width / gridSize[0],
    //     point5
    //   ])
    // }

    // // Draw points along top and bottom side -- DISTORTED MID -- y
    // for (i = 1; i < gridSize[0]; i++) {
    //   for (j = point2; j < point3; j += 42) {
    //     vertices.push([
    //       0,
    //       j
    //     ])
    //     vertices.push([
    //       3840,
    //       j
    //     ])
    //   }
    // }

    // // Draw points along top and bottom side -- DISTORTED MID -- y
    // for (i = 1; i < gridSize[0]; i++) {
    //   for (j = point3; j < point4; j += 15) {
    //     vertices.push([
    //       0,
    //       j
    //     ])
    //     vertices.push([
    //       3840,
    //       j
    //     ])
    //   }
    // }

    // // Draw points along top and bottom side -- DISTORTED TOP -- y
    // for (i = 1; i < gridSize[0]; i++) {
    //   for (j = point1; j < point2; j += 100) {
    //     vertices.push([
    //       0,
    //       j
    //     ])
    //     vertices.push([
    //       3840,
    //       j
    //     ]);
    //   }
    // }

    // // Draw points along top and bottom side -- DISTORTED BOT -- y
    // for (i = 1; i < gridSize[0]; i++) {
    //   for (j = point4; j < point5; j += 100) {
    //     vertices.push([
    //       0,
    //       j
    //     ])
    //     vertices.push([
    //       3840,
    //       j
    //     ]);
    //   }
    // }

    // Draw points along top and bottom side -- DISTORT
    // for (j = 1; j < gridSize[1]; j++) {
    //   vertices.push([
    //     0,
    //     j * canvas.height / gridSize[1]
    //   ])
    //   vertices.push([
    //     canvas.width,
    //     j * canvas.height / gridSize[1]
    //   ])
    // }


    // // Draw points along top and bottom side
    // for (i = 1; i < gridSize[0]; i++) {
    //   vertices.push([
    //     i * canvas.width / gridSize[0] + randomRange(-150, 150),
    //     0
    //   ])
    //   vertices.push([
    //     i * canvas.width / gridSize[0] + randomRange(-150, 150),
    //     canvas.height
    //   ])
    // }

    // // Draw points along top and bottom side
    // for (j = 1; j < gridSize[1]; j++) {
    //   vertices.push([
    //     0,
    //     j * canvas.height / gridSize[1] + randomRange(-150, 150)
    //   ])
    //   vertices.push([
    //     canvas.width,
    //     j * canvas.height / gridSize[1] + randomRange(-150, 150)
    //   ])
    // }

    // draw corner points
    vertices.push([0, point1]);
    vertices.push([canvas.width, point1]);
    vertices.push([canvas.width, point5]);
    vertices.push([0, point5]);

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
    console.log(vertices);

    // Calculate starting points of both sides
    fragmentIndex = 0;
    inverseIndex = fragments.length;
    drawGrid();

  }

  // -- Generate the colors --
  const generateColors = () => {

    for (let i = 0; i < 5; i++) {
      let h = 237,
        s = '100%',
        l = `${20 + i * 4}%`,
        a = 1;
      colorsPlayer1.push([h, s, l, a]);
    }

    for (let i = 0; i < 5; i++) {
      let h = 303,
        s = '100%',
        l = `${20 + i * 4}%`,
        a = 1;
      colorsPlayer2.push([h, s, l, a]);
    }
    // l = `${Math.round(randomRange(20, 40))}%`,
  }

  // -- Sort the triangles --
  const sortTriangles = fragments => {
    console.log(`fragments voor sort`, fragments);


    fragments.sort((a, b) => {
      //sort by x, secondary by y
      return a.centerPointX == b.centerPointX ? a.centerPointY - b.centerPointY : a.centerPointX - b.centerPointX;
    });
    console.log(`oude fragmnets`, fragments);
    console.log(`NEW FRAGMENTS`, newFragments);
  }

  // -- Draw the triangles based on player input
  const drawTriangles = player => {

    if (player === 1) {
      let color = colorsPlayer1[Math.floor(Math.random() * colorsPlayer1.length)];
      blueTriangles.push({ fragment: [fragments[fragmentIndex]], color: color });
      //blueTriangles.push(fragments[fragmentIndex]);
    }

    if (player === 2) {
      let color = colorsPlayer2[Math.floor(Math.random() * colorsPlayer2.length)];
      pinkTriangles.push({ fragment: [fragments[inverseIndex - 1]], color: color });
      //pinkTriangles.push(fragments[inverseIndex - 1]);

    }
  }

  class Fragment {
    constructor(v0, v1, v2) {
      this.v0 = v0;
      this.v1 = v1;
      this.v2 = v2;
      this.tri = [v0, v1, v2];
      this.centerPointX = 0;
      this.centerPointY = 0;

      this.startOpacity = 0;

      this.fillOffsetX1 = 0;
      this.fillOffsetY1 = 0;
      this.fillOffsetX2 = 0;
      this.fillOffsetY2 = 0;

      this.visible = true;

      //this.calculateDeltas();
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

      if (this.startOpacity <= 0.99) {
        this.startOpacity += 0.04;
        Math.round(this.startOpacity * 100) / 100
      } else {
        this.startOpacity = 1;
      }

      ctx.globalAlpha = this.startOpacity;

      ctx.fillStyle = `hsla(${color})`;
      ctx.strokeStyle = `hsla(${color})`;

      ctx.lineWidth = 3;

      //ctx.strokeStyle = `rgb(255, 255, 255)`; // sets the color to fill in the rectangle with
      ctx.lineWidth = 3;

      // glow effect
      // ctx.shadowColor = `rgba(255, 255, 255, 0.3)` // string
      // ctx.shadowOffsetX = 0; // integer
      // ctx.shadowOffsetY = 0; // integer
      // ctx.shadowBlur = 30; // integer

      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(this.v0[0], this.v0[1]);
      ctx.lineTo(this.v1[0], this.v1[1]);
      ctx.lineTo(this.v2[0], this.v2[1]);
      // ctx.lineTo(this.v0[0] + this.fillOffsetX1, this.v0[1] + this.fillOffsetY1);
      // ctx.lineTo(this.v0[0] + this.fillOffsetX2, this.v0[1] + this.fillOffsetY2);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }

    drawBg() {

      backgroundCtx.fillStyle = `rgb(15, 15, 15)`;
      backgroundCtx.strokeStyle = `rgb(150, 150, 150)`;
      backgroundCtx.lineWidth = 3;

      // glow effect
      // backgroundCtx.shadowColor = `rgba(255, 255, 255, 0.1)` // string
      // backgroundCtx.shadowOffsetX = 0; // integer
      // backgroundCtx.shadowOffsetY = 0; // integer
      // backgroundCtx.shadowBlur = 40; // integer

      backgroundCtx.beginPath();
      backgroundCtx.lineCap = "round";
      backgroundCtx.lineJoin = 'round';
      backgroundCtx.moveTo(this.v0[0], this.v0[1]);
      backgroundCtx.lineTo(this.v1[0], this.v1[1]);
      backgroundCtx.lineTo(this.v2[0], this.v2[1]);
      // backgroundCtx.lineTo(this.v0[0] + this.fillOffsetX1, this.v0[1] + this.fillOffsetY1);
      // backgroundCtx.lineTo(this.v0[0] + this.fillOffsetX2, this.v0[1] + this.fillOffsetY2);
      backgroundCtx.closePath();
      backgroundCtx.stroke();
      backgroundCtx.fill();
    }
  }

  // - Calculate a random range between two numbers
  const randomRange = (min, max) => {
    return min + Math.random() * (max - min);
  }

  // - Generate new points on click
  const handleClick = () => {
    vertices = [],
      indices = [],
      fragments = [],
      newFragments = [],
      drawArray = [],
      blueTriangles = [],
      pinkTriangles = [],
      newBlueArray = [],
      newPinkArray = [];

    colorTriggered = false;

    drawRandomPoints();
    gameOver = false;
  }

  const drawGrid = () => {

    backgroundCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (offsetSweep === true) {
      if (offset < 119) {
        offset += 1;
      } else {
        offsetSweep = false;
      }
    }

    if (offsetSweep === false) {

      if (offset > 0) {
        offset -= 1;
      } else {
        offsetSweep = true;
      }
    }

    fragments.forEach((fragment) => {
      if (fragment.v0[0] === 0 || fragment.v1[0] === 0 || fragment.v2[0] === 0 || fragment.v0[1] === 0 || fragment.v1[1] === 0 || fragment.v2[1] === 0 || fragment.v0[0] === canvas.width || fragment.v1[0] === canvas.width || fragment.v2[0] === canvas.width || fragment.v0[1] === canvas.height || fragment.v1[1] === canvas.height || fragment.v2[1] === canvas.height) {
      } else {
        fragment.v0[0] = fragment.v0[0] + ((curve[offset]) / 1920);
        fragment.v0[1] = fragment.v0[1] + ((curve[offset]) / 1920);
        fragment.v1[0] = fragment.v1[0] + ((curve[offset]) / 1920);
        fragment.v1[1] = fragment.v1[1] + ((curve[offset]) / 1920);
        fragment.v2[0] = fragment.v2[0] + ((curve[offset]) / 1920);
        fragment.v2[1] = fragment.v2[1] + ((curve[offset]) / 1920);
      }

      fragment.drawBg();

    })
  }

  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  var steps = 120
  var speed = 1
  for (var i = 0; i < steps; i++) {
    var stepValue = easeInOutQuad(i, 0, speed * steps, steps);
    curve.push(stepValue - 60);
  }

  const colorSweep = () => {

    sweepIndexLeft = 0;
    sweepIndexRight = 0;

    // NIEUWE END GAME CODE
    if (pinkTriangles.length === 0) {
      pinkSweepEnded = true;
      handleSweepEnd();
    }

    if (blueTriangles.length === 0) {
      blueSweepEnded = true;
      handleSweepEnd();
    }


    setIntervalX(() => {
      if (sweepIndexLeft < pinkTriangles.length) {
        sweepIndexLeft++;
        pinkTriangles[pinkTriangles.length - sweepIndexLeft].color = newPinkArray[pinkTriangles.length - sweepIndexLeft];

        // NIEUWE END GAME CODE
        if (sweepIndexLeft === pinkTriangles.length) {
          console.log(`sweep pink klaar`);
          pinkSweepEnded = true;
          handleSweepEnd();
        }
      }

    }, 20, pinkTriangles.length);

    setIntervalX(() => {
      if (sweepIndexRight < blueTriangles.length) {
        sweepIndexRight++;
        blueTriangles[blueTriangles.length - sweepIndexRight].color = newBlueArray[blueTriangles.length - sweepIndexRight];

        // NIEUWE END GAME CODE
        if (sweepIndexRight === blueTriangles.length) {
          console.log(`sweep blauw klaar`);
          blueSweepEnded = true;
          handleSweepEnd();
        }
      }
    }, 20, blueTriangles.length);


  }

  // NIEUWE END GAME CODE
  const handleSweepEnd = () => {
    if (blueSweepEnded === true && pinkSweepEnded === true) {
      console.log(`all sweeps ended, restart the game`);

      setIntervalX(() => {
        restartGame();
        console.log(`voer restartgame code uit`);
      }, 2000, 1);
    }
  }

  // NIEUWE END GAME CODE
  const restartGame = () => {
    vertices = [],
      indices = [],
      fragments = [],
      newFragments = [],
      drawArray = [],
      blueTriangles = [],
      pinkTriangles = [],
      newBlueArray = [],
      newPinkArray = [];
    blueSweepEnded = false;
    pinkSweepEnded = false;

    colorTriggered = false;

    gameOver = false;

    colorsPlayer1 = [],
      colorsPlayer2 = [];

    generateColors();
    drawRandomPoints();
    getPlayerKey(1);
    getPlayerKey(2);

    timeSincePress = 0;


  }

  const generateNewColors = (blue, pink) => {
    // Genereer nieuwe color array
    colorTriggered = true;
    console.log(`banaan bro`);
    console.log(`BLAUWE`, blue);
    console.log(`roze`, pink);


    for (let i = 0; i < blue.length; i++) {
      let h = 237 + (i * (33 / blue.length)),
        s = '100%',
        l = `30%`,
        a = 1;
      newBlueArray.push([h, s, l, a]);
    }

    for (let i = 0; i < pink.length; i++) {
      let h = 303 - (i * (33 / pink.length)),
        s = '100%',
        l = `30%`,
        a = 1;
      newPinkArray.push([h, s, l, a]);
    }

    console.log(newBlueArray);
    console.log(newPinkArray);

    colorSweep();
  }

  // PRUTS CODE LED ANIMATIE
  playIdleAnimation = () => {
    animationTriggered = true;
    console.log(`dit zou maar 1 keer moeten loggen broer`);

    // Speel de animatie af

  }



  // -- Draw loop
  const draw = () => {

    // PRUTS CODE LED ANIM

    timeSincePress++;

    if (timeSincePress >= 1000 * 60) {
      console.log(`5 seconden idle`);

      if (animationTriggered === false) {
        playIdleAnimation();
      }
    }
    // EINDE PRUTS CODE LED ANIM


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    newCtx.clearRect(0, 0, canvas.width, canvas.height);
    newCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    newCtx.fillRect(0, 380, 3840, 42);

    newCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
    newCtx.fillRect(0, 422, 3840, 49);
    newCtx.fill();


    drawGrid();

    Object.keys(blueTriangles).forEach((item) => {
      blueTriangles[item].fragment[0].draw(blueTriangles[item].color);
      //console.log(`ik blijf tekenen bro`);
    });

    Object.keys(pinkTriangles).forEach((item) => {
      pinkTriangles[item].fragment[0].draw(pinkTriangles[item].color);
      //console.log(`ik blijf tekenen bro`);
    });

    if (fragmentIndex >= inverseIndex) {
      gameOver = true;
      if (colorTriggered === false) {
        generateNewColors(blueTriangles, pinkTriangles);
      }
    }

    requestAnimationFrame(draw);
  }

  init();

}