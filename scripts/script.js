{

  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  const backgroundCanvas = document.getElementById('c2');
  const backgroundCtx = backgroundCanvas.getContext('2d');

  let vertices = [],
    indices = [],
    fragments = [],
    newFragments = [],
    drawArray = [];

  let colorsPlayer1 = [],
    colorsPlayer2 = [];

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

  let fragmentIndex, inverseIndex;

  let gridSize = [10, 6];

  let gameOver = false;

  let offset = 0;

  let offsetSweep = true;

  let curve = []




  const init = () => {
    document.addEventListener(`click`, handleClick);

    //drawGrid();


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
    //ctx.globalCompositeOperation = 'lighter';

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
        if (e.keyCode === player1Key.buttonValue) {
          console.log(`Player 1: Juiste toets`);
          getPlayerKey(1);

          setIntervalX(function () {
            drawTriangles(1);
            fragmentIndex++;
            console.log(`aantal triangles test`);
          }, 100, 2);






        } else {
          console.log(`Player 1: FOUT!!!`);
        }
      }

      if (e.keyCode === 65 || e.keyCode === 87 || e.keyCode === 68) {
        if (e.keyCode === player2Key.buttonValue) {
          console.log(`Player 2: Juiste toets`);
          getPlayerKey(2);

          setIntervalX(() => {
            drawTriangles(2);
            inverseIndex--;
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
    vertices = [];
    indices = [];
    fragments = [];
    newFragments = [];
    drawArray = [];

    // generate random points INSIDE the canvas
    for (i = 1; i < gridSize[0]; i++) {
      for (j = 1; j < gridSize[1]; j++) {
        vertices.push([
          i * canvas.width / gridSize[0] + randomRange(-150, 150),
          j * canvas.height / gridSize[1] + randomRange(-150, 150)
        ]);
      }
    }

    // Draw points along top and bottom side
    for (i = 1; i < gridSize[0]; i++) {
      vertices.push([
        i * canvas.width / gridSize[0] + randomRange(-150, 150),
        0
      ])
      vertices.push([
        i * canvas.width / gridSize[0] + randomRange(-150, 150),
        canvas.height
      ])
    }

    // Draw points along top and bottom side
    for (j = 1; j < gridSize[1]; j++) {
      vertices.push([
        0,
        j * canvas.height / gridSize[1] + randomRange(-150, 150)
      ])
      vertices.push([
        canvas.width,
        j * canvas.height / gridSize[1] + randomRange(-150, 150)
      ])
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
    drawGrid();
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
    console.log(`fragments voor sort`, fragments);


    newFragments = fragments.sort((a, b) => {
      //sort by x, secondary by y
      return a.centerPointX == b.centerPointX ? a.centerPointY - b.centerPointY : a.centerPointX - b.centerPointX;
    });
    console.log(`oude fragmnets`, fragments);
    console.log(`NEW FRAGMENTS`, newFragments);
  }

  // -- Draw the triangles based on player input
  const drawTriangles = player => {

    if (fragmentIndex >= inverseIndex + 1) {
      console.log(`STOP`);
      gameOver = true;
      return;
    }

    if (player === 1) {
      let color = colorsPlayer1[Math.floor(Math.random() * colorsPlayer1.length)];
      drawArray.push({ fragment: [newFragments[fragmentIndex]], color: color });

    }

    if (player === 2) {
      let color = colorsPlayer2[Math.floor(Math.random() * colorsPlayer2.length)];
      drawArray.push({ fragment: [newFragments[inverseIndex]], color: color });
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
      //ctx.lineWidth = 3;

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
    drawRandomPoints();
    gameOver = false;
  }

  const drawGrid = () => {

    backgroundCtx.clearRect(0, 0, canvas.width, canvas.height);
    // for (let x = 0; x < canvas.width; x += 120) {
    //   for (let y = 0; y < canvas.height; y += 120) {
    //     backgroundCtx.moveTo(0, y);
    //     backgroundCtx.lineTo(3840, y);
    //     backgroundCtx.moveTo(x, 0);
    //     backgroundCtx.lineTo(x, 1080);
    //   }
    // }

    // backgroundCtx.lineWidth = 0.05;
    // backgroundCtx.strokeStyle = "#0054FF";
    // backgroundCtx.stroke();

    // console.log(`test`);
    // console.log(newFragments);

    if (offsetSweep === true) {
      if (offset < 119) {
        //console.log(`looptest broo`);

        offset += 1;
        //console.log(curve[offset]);


        //console.log(`tweede test broer`);
      } else {
        offsetSweep = false;
      }
    }

    if (offsetSweep === false) {

      if (offset > 0) {
        //console.log(`looptest`);
        offset -= 1;

        //console.log(curve[offset]);

      } else {
        offsetSweep = true;
      }
    }

    //console.log(offsetX);


    fragments.forEach(fragment => {

      if (fragment.v0[0] === 0 || fragment.v1[0] === 0 || fragment.v2[0] === 0 || fragment.v0[1] === 0 || fragment.v1[1] === 0 || fragment.v2[1] === 0 || fragment.v0[0] === canvas.width || fragment.v1[0] === canvas.width || fragment.v2[0] === canvas.width || fragment.v0[1] === canvas.height || fragment.v1[1] === canvas.height || fragment.v2[1] === canvas.height) {
      } else {
        fragment.v0[0] = fragment.v0[0] + (curve[offset] / 1920);
        fragment.v0[1] = fragment.v0[1] + (curve[offset] / 1920);
        fragment.v1[0] = fragment.v1[0] + (curve[offset] / 1920);
        fragment.v1[1] = fragment.v1[1] + (curve[offset] / 1920);
        fragment.v2[0] = fragment.v2[0] + (curve[offset] / 1920);
        fragment.v2[1] = fragment.v2[1] + (curve[offset] / 1920);
      }

      fragment.drawBg();
    })

    //console.log(fragments.fragmentIndex);
  }

  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
    //return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  };

  var steps = 120
  var speed = 1
  for (var i = 0; i < steps; i++) {
    var stepValue = easeInOutQuad(i, 0, speed * steps, steps);
    curve.push(stepValue - 60);
  }

  console.log(curve); // [0, 50, 200, 350, 400]

  // -- Draw loop
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    Object.keys(drawArray).forEach((item) => {
      drawArray[item].fragment[0].draw(drawArray[item].color);
    });

    requestAnimationFrame(draw);
  }

  init();

}