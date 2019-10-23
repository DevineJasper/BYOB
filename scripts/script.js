{

  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  let vertices = [],
    indices = [],
    fragments = [];

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

  let gameOver = false;



  const init = () => {
    document.addEventListener(`click`, handleClick);

    drawRandomPoints();
    getPlayerKey(1);
    getPlayerKey(2);

    document.addEventListener("keydown", e => {
      if (gameOver === false) {
        if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39) {
          //console.log(e.keyCode);
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
          //console.log(e.keyCode);
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

    });
  };

  const getPlayerKey = player => {

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


  const drawRandomPoints = () => {

    ctx.clearRect(0, 0, 3840, 1080);


    vertices = [];
    indices = [];
    fragments = [];


    ctx.fillStyle = 'rgb(0,0,0)'; // sets the color to fill in the rectangle with
    console.log(`draw points`);
    for (i = 0; i < 10; i++) {
      console.log(`points`);

      vertices.push([Math.floor(Math.random() * 3840), Math.floor(Math.random() * 1080)]);

    }

    // vertical
    for (i = 0; i < 10; i++) {
      console.log(`points`);

      vertices.push([0, Math.floor(Math.random() * 3840)]);
      vertices.push([3840, Math.floor(Math.random() * 3840)]);
    }

    // horizontal
    for (i = 0; i < 20; i++) {
      vertices.push([Math.floor(Math.random() * 3840), 0]);
      vertices.push([Math.floor(Math.random() * 3840), 1080]);


      console.log(`points`);
    }

    // draw corner points
    vertices.push([0, 0]);
    vertices.push([3840, 0]);
    vertices.push([3840, 1080]);
    vertices.push([0, 1080]);


    console.log(`vertices`, vertices);


    indices = Delaunay.triangulate(vertices);

    console.log(`indices`, indices);

    for (let i = 0; i < indices.length; i += 3) {
      fragments.push(new Fragment(
        vertices[indices[i + 0]],
        vertices[indices[i + 1]],
        vertices[indices[i + 2]]
      ));
    }


    for (let i = 0; i < 18; i++) {
      let h = 237,
        s = '100%',
        l = `${randomRange(20, 40)}%`;
      colorsPlayer1.push([h, s, l]);
    }

    for (let i = 0; i < 18; i++) {
      let h = 303,
        s = '100%',
        l = `${randomRange(20, 40)}%`;
      colorsPlayer2.push([h, s, l]);
    }

    fragmentIndex = 0;
    inverseIndex = fragments.length - 1;

  }

  const drawTriangles = player => {

    // console.log(`testman`);
    // console.log(fragmentIndex);
    // console.log(inverseIndex);

    if (fragmentIndex >= inverseIndex + 1) {
      console.log(`kapot`);
      return;
      gameOver = true;
    }

    if (player === 1) {
      let color = colorsPlayer1[Math.floor(Math.random() * colorsPlayer1.length)];

      console.log(`Fragmentindex`, fragmentIndex);
      fragments[fragmentIndex].draw(color);

    }

    if (player === 2) {
      let color = colorsPlayer2[Math.floor(Math.random() * colorsPlayer2.length)];
      console.log(`inverseIndex`, inverseIndex);
      fragments[inverseIndex].draw(color);

    }
  }

  class Fragment {
    constructor(v0, v1, v2) {
      this.v0 = v0;
      this.v1 = v1;
      this.v2 = v2;
      this.tri = [v0, v1, v2];

      this.fillOffsetX1 = 0;
      this.fillOffsetY1 = 0;
      this.fillOffsetX2 = 0;
      this.fillOffsetY2 = 0;

      this.mouseOver = false;
      this.visible = true;

      this.calculateDeltas();
    }

    calculateDeltas() {
      this.fillOffsetX1 = this.v1[0] - this.v0[0];
      this.fillOffsetY1 = this.v1[1] - this.v0[1];
      this.fillOffsetX2 = this.v2[0] - this.v0[0];
      this.fillOffsetY2 = this.v2[1] - this.v0[1];
    }

    draw(color) {
      if (this.visible === false) return;

      ctx.fillStyle = `hsl(${color})`; // sets the color to fill in the rectangle with
      ctx.strokeStyle = `hsl(${color})`; // sets the color to fill in the rectangle with


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

  init();

}