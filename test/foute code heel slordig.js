{
  const five = require("johnny-five");
  const board = new five.Board({
    repl: false
  });

  board.on("ready", () => {
    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d");

    const backgroundCanvas = document.getElementById("c2");
    const backgroundCtx = backgroundCanvas.getContext("2d");

    let vertices = [],
      indices = [],
      fragments = [];

    let colorsPlayer1 = [],
      colorsPlayer2 = [],
      blueTriangles = [],
      pinkTriangles = [],
      newBlueArray = [],
      newPinkArray = [];

    let streakPlayer1 = 1,
      streakPlayer2 = 1;

    const led1 = new five.Led(2);
    const button1 = new five.Button(3);
    const led2 = new five.Led(4);
    const button2 = new five.Button(5);
    const led3 = new five.Led(6);
    const button3 = new five.Button(7);

    const led4 = new five.Led(8);
    const button4 = new five.Button(9);
    const led5 = new five.Led(10);
    const button5 = new five.Button(11);
    const led6 = new five.Led(12);
    const button6 = new five.Button(13);

    let ledsPlayer1 = [button1, button2, button3],
      ledsPlayer2 = [button4, button5, button6];

    let lastInLedsPlayer1 = ledsPlayer1[2],
      lastInLedsPlayer2 = ledsPlayer2[2];

    let fragmentIndex, inverseIndex, sweepIndexLeft, sweepIndexRight;

    let gridSize = [10, 6];

    let gameOver = false;
    let colorTriggered = false;

    let offset = 0;

    let offsetSweep = true;

    let curve = [];

    let waitingScreen = false,
      stopWaitingScreen = false;

    let weGaanStarten = false;

    const init = () => {
      document.addEventListener(`click`, handleClick);

      // Shuffle playerleds
      shuffle(ledsPlayer1, lastInLedsPlayer1);
      shuffle(ledsPlayer2, lastInLedsPlayer2);

      // Draw the random points
      drawRandomPoints();
      generateColors();

      // Assign each player a starting key
      if (gameOver === false) {
        getPlayersKey();

        setIntervalX(
          () => {
            waitingScreen = true;
            showWaitingScreen();
          },
          1000,
          1
        );
      }

      easeInOutQuad();

      ctx.globalCompositeOperation = "lighter";

      // Execute the draw function
      draw();
    };

    const showWaitingScreen = () => {
      turnAllLedsOff();
      if (stopWaitingScreen === true && waitingScreen === false) {
        startGame();
        return null;
      } else {
        currentLed = 1;
        setIntervalX(
          () => {
            if (currentLed <= 6) {
              switch (currentLed) {
                case 1:
                  turnAllLedsOff();
                  led3.on();
                  break;
                case 2:
                  turnAllLedsOff();
                  led2.on();
                  break;
                case 3:
                  turnAllLedsOff();
                  led1.on();
                  break;
                case 4:
                  turnAllLedsOff();
                  led4.on();
                  break;
                case 5:
                  turnAllLedsOff();
                  led5.on();
                  break;
                case 6:
                  turnAllLedsOff();
                  led6.on();
                  break;
              }
              currentLed++;
            } else if (currentLed <= 10) {
              switch (currentLed) {
                case 10:
                  turnAllLedsOff();
                  led2.on();
                  break;
                case 9:
                  turnAllLedsOff();
                  led1.on();
                  break;
                case 8:
                  turnAllLedsOff();
                  led4.on();
                  break;
                case 7:
                  turnAllLedsOff();
                  led5.on();
                  break;
              }
              currentLed++;
            } else if (currentLed === 11) {
              showWaitingScreen();
            }
          },
          200,
          11
        );
      }
    };

    // Shuffle arrays
    const shuffle = (array, last) => {
      const shuffleArray = array.sort(() => Math.random() - 0.5);
      if (shuffleArray[0] === last) {
        shuffle(array, last);
      } else {
        array = shuffleArray;
      }
    };

    if (gameOver === false) {
      button1.on("press", function() {
        console.log("fragment", fragmentIndex);
        console.log("inverse", inverseIndex);
        if (waitingScreen === false && stopWaitingScreen === true) {
          if (ledsPlayer1[0] === button1) {
            setIntervalX(
              () => {
                drawTriangles(1);
                fragmentIndex++;
              },
              100,
              streakPlayer1
            );
            if (streakPlayer1 < 3) {
              streakPlayer1++;
            }

            turnLedOff(ledsPlayer1[0]);
            lastInLedsPlayer1 = ledsPlayer1[0];
            ledsPlayer1.splice(0, 1);
            if (ledsPlayer1.length === 0) {
              ledsPlayer1 = [button1, button2, button3];
              shuffle(ledsPlayer1, lastInLedsPlayer1);
            }
            turnLedOn(ledsPlayer1[0]);
          } else {
            if (streakPlayer1 > 1) {
              streakPlayer1 = 1;
            }
          }
        } else {
          stopWaitingScreen = true;
          waitingScreen = false;
          startGame();
        }
      });

      button2.on("press", function() {
        console.log("fragment", fragmentIndex);
        console.log("inverse", inverseIndex);
        if (waitingScreen === false && stopWaitingScreen === true) {
          if (ledsPlayer1[0] === button2) {
            setIntervalX(
              () => {
                drawTriangles(1);
                fragmentIndex++;
              },
              100,
              streakPlayer1
            );
            if (streakPlayer1 < 3) {
              streakPlayer1++;
            }
            turnLedOff(ledsPlayer1[0]);
            lastInLedsPlayer1 = ledsPlayer1[0];
            ledsPlayer1.splice(0, 1);
            if (ledsPlayer1.length === 0) {
              ledsPlayer1 = [button1, button2, button3];
              shuffle(ledsPlayer1, lastInLedsPlayer1);
            }
            turnLedOn(ledsPlayer1[0]);
          } else {
            if (streakPlayer1 > 1) {
              streakPlayer1 = 1;
            }
          }
        } else {
          stopWaitingScreen = true;
          waitingScreen = false;
          startGame();
        }
      });

      button3.on("press", function() {
        console.log("fragment", fragmentIndex);
        console.log("inverse", inverseIndex);
        if (waitingScreen === false && stopWaitingScreen === true) {
          if (ledsPlayer1[0] === button3) {
            setIntervalX(
              () => {
                drawTriangles(1);
                fragmentIndex++;
              },
              100,
              streakPlayer1
            );
            if (streakPlayer1 < 3) {
              streakPlayer1++;
            }
            turnLedOff(ledsPlayer1[0]);
            lastInLedsPlayer1 = ledsPlayer1[0];
            ledsPlayer1.splice(0, 1);
            if (ledsPlayer1.length === 0) {
              ledsPlayer1 = [button1, button2, button3];
              shuffle(ledsPlayer1, lastInLedsPlayer1);
            }
            turnLedOn(ledsPlayer1[0]);
          } else {
            if (streakPlayer1 > 1) {
              streakPlayer1 = 1;
            }
          }
        } else {
          stopWaitingScreen = true;
          waitingScreen = false;
          startGame();
        }
      });

      button4.on("press", function() {
        console.log("fragment", fragmentIndex);
        console.log("inverse", inverseIndex);
        if (waitingScreen === false && stopWaitingScreen === true) {
          if (ledsPlayer2[0] === button4) {
            setIntervalX(
              () => {
                drawTriangles(2);
                inverseIndex--;
              },
              100,
              streakPlayer2
            );
            if (streakPlayer2 < 3) {
              streakPlayer2++;
            }
            turnLedOff(ledsPlayer2[0]);
            lastInLedsPlayer2 = ledsPlayer2[0];
            ledsPlayer2.splice(0, 1);
            if (ledsPlayer2.length === 0) {
              ledsPlayer2 = [button4, button5, button6];
              shuffle(ledsPlayer2, lastInLedsPlayer2);
            }
            turnLedOn(ledsPlayer2[0]);
          } else {
            if (streakPlayer2 > 1) {
              streakPlayer2 = 1;
            }
          }
        } else {
          stopWaitingScreen = true;
          waitingScreen = false;
          startGame();
        }
      });

      button5.on("press", function() {
        console.log("fragment", fragmentIndex);
        console.log("inverse", inverseIndex);
        if (waitingScreen === false && stopWaitingScreen === true) {
          if (ledsPlayer2[0] === button5) {
            setIntervalX(
              () => {
                drawTriangles(2);
                inverseIndex--;
              },
              100,
              streakPlayer2
            );
            if (streakPlayer2 < 3) {
              streakPlayer2++;
            }
            turnLedOff(ledsPlayer2[0]);
            lastInLedsPlayer2 = ledsPlayer2[0];
            ledsPlayer2.splice(0, 1);
            if (ledsPlayer2.length === 0) {
              ledsPlayer2 = [button4, button5, button6];
              shuffle(ledsPlayer2, lastInLedsPlayer2);
            }
            turnLedOn(ledsPlayer2[0]);
          } else {
            if (streakPlayer2 > 1) {
              streakPlayer2 = 1;
            }
          }
        } else {
          stopWaitingScreen = true;
          waitingScreen = false;
          startGame();
        }
      });

      button6.on("press", function() {
        console.log("fragment", fragmentIndex);
        console.log("inverse", inverseIndex);
        if (waitingScreen === false && stopWaitingScreen === true) {
          if (ledsPlayer2[0] === button6) {
            setIntervalX(
              () => {
                drawTriangles(2);
                inverseIndex--;
              },
              100,
              streakPlayer2
            );
            if (streakPlayer2 < 3) {
              streakPlayer2++;
            }
            turnLedOff(ledsPlayer2[0]);
            lastInLedsPlayer2 = ledsPlayer2[0];
            ledsPlayer2.splice(0, 1);
            if (ledsPlayer2.length === 0) {
              ledsPlayer2 = [button4, button5, button6];
              shuffle(ledsPlayer2, lastInLedsPlayer2);
            }
            turnLedOn(ledsPlayer2[0]);
          } else {
            if (streakPlayer2 > 1) {
              streakPlayer2 = 1;
            }
          }
        } else {
          stopWaitingScreen = true;
          waitingScreen = false;
          startGame();
        }
      });
    }

    const startGame = () => {
      (vertices = []),
        (indices = []),
        (fragments = []),
        (newFragments = []),
        (drawArray = []),
        (blueTriangles = []),
        (pinkTriangles = []),
        (newBlueArray = []),
        (newPinkArray = []);

      colorTriggered = false;
      drawRandomPoints();
      gameOver = false;
      turnAllLedsOff();
      streakPlayer1 = 1;
      streakPlayer2 = 1;
      ledsPlayer1 = [button1, button2, button3];
      ledsPlayer2 = [button4, button5, button6];
      getPlayersKey();
      // waitingScreenInterval = setInterval(showWaitingScreen, 1000);
      // setIntervalX(
      //   () => {
      //     showWaitingScreen();
      //   },
      //   1000,
      //   1
      // );
    };

    const setIntervalX = (callback, delay, repetitions) => {
      let x = 0;
      let intervalID = window.setInterval(() => {
        callback();

        if (++x === repetitions) {
          window.clearInterval(intervalID);
        }
      }, delay);
    };

    const getPlayersKey = () => {
      turnLedOn(ledsPlayer1[0]);
      turnLedOn(ledsPlayer2[0]);
    };

    // Functies om leds aan of uit te zetten
    const turnLedOn = button => {
      switch (button) {
        case button1:
          led1.on();
          break;
        case button2:
          led2.on();
          break;
        case button3:
          led3.on();
          break;
        case button4:
          led4.on();
          break;
        case button5:
          led5.on();
          break;
        case button6:
          led6.on();
          break;
      }
    };

    const turnLedOff = button => {
      switch (button) {
        case button1:
          led1.off();
          break;
        case button2:
          led2.off();
          break;
        case button3:
          led3.off();
          break;
        case button4:
          led4.off();
          break;
        case button5:
          led5.off();
          break;
        case button6:
          led6.off();
          break;
      }
    };

    // -- CREATE THE POINTS --
    const drawRandomPoints = () => {
      // Clear the canvas;
      ctx.clearRect(0, 0, 3840, 1080);

      // generate random points INSIDE the canvas
      for (i = 1; i < gridSize[0]; i++) {
        for (j = 1; j < gridSize[1]; j++) {
          vertices.push([
            (i * canvas.width) / gridSize[0] + randomRange(-150, 150),
            (j * canvas.height) / gridSize[1] + randomRange(-150, 150)
          ]);
        }
      }

      // Draw points along top and bottom side
      for (i = 1; i < gridSize[0]; i++) {
        vertices.push([
          (i * canvas.width) / gridSize[0] + randomRange(-150, 150),
          0
        ]);
        vertices.push([
          (i * canvas.width) / gridSize[0] + randomRange(-150, 150),
          canvas.height
        ]);
      }

      // Draw points along top and bottom side
      for (j = 1; j < gridSize[1]; j++) {
        vertices.push([
          0,
          (j * canvas.height) / gridSize[1] + randomRange(-150, 150)
        ]);
        vertices.push([
          canvas.width,
          (j * canvas.height) / gridSize[1] + randomRange(-150, 150)
        ]);
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
        fragments.push(
          new Fragment(
            vertices[indices[i + 0]],
            vertices[indices[i + 1]],
            vertices[indices[i + 2]]
          )
        );
      }

      // Sort the fragments
      sortTriangles(fragments);

      // Calculate starting points of both sides
      fragmentIndex = 0;
      inverseIndex = fragments.length;
      drawGrid();
    };

    // -- Generate the colors --
    const generateColors = () => {
      for (let i = 0; i < 5; i++) {
        let h = 237,
          s = "100%",
          l = `${20 + i * 4}%`,
          a = 1;
        colorsPlayer1.push([h, s, l, a]);
      }

      for (let i = 0; i < 5; i++) {
        let h = 303,
          s = "100%",
          l = `${20 + i * 4}%`,
          a = 1;
        colorsPlayer2.push([h, s, l, a]);
      }
    };

    // -- Sort the triangles --
    const sortTriangles = fragments => {
      fragments.sort((a, b) => {
        //sort by x, secondary by y
        return a.centerPointX == b.centerPointX
          ? a.centerPointY - b.centerPointY
          : a.centerPointX - b.centerPointX;
      });
    };

    // -- Draw the triangles based on player input
    const drawTriangles = player => {
      if (player === 1) {
        let color =
          colorsPlayer1[Math.floor(Math.random() * colorsPlayer1.length)];
        blueTriangles.push({
          fragment: [fragments[fragmentIndex]],
          color: color
        });
      }

      if (player === 2) {
        let color =
          colorsPlayer2[Math.floor(Math.random() * colorsPlayer2.length)];
        pinkTriangles.push({
          fragment: [fragments[inverseIndex - 1]],
          color: color
        });
      }
    };

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

        this.calculateCenters();
      }

      calculateDeltas() {
        this.fillOffsetX1 = this.v1[0] - this.v0[0];
        this.fillOffsetY1 = this.v1[1] - this.v0[1];
        this.fillOffsetX2 = this.v2[0] - this.v0[0];
        this.fillOffsetY2 = this.v2[1] - this.v0[1];
      }

      calculateCenters() {
        this.centerPointX =
          (this.tri[0][0] + this.tri[1][0] + this.tri[2][0]) / 3;
        this.centerPointY =
          (this.tri[0][1] + this.tri[1][1] + this.tri[2][1]) / 3;
      }

      draw(color) {
        if (this.visible === false) return;

        if (this.startOpacity <= 0.99) {
          this.startOpacity += 0.04;
          Math.round(this.startOpacity * 100) / 100;
        } else {
          this.startOpacity = 1;
        }

        ctx.globalAlpha = this.startOpacity;

        ctx.fillStyle = `hsla(${color})`;
        ctx.strokeStyle = `hsla(${color})`;

        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(this.v0[0], this.v0[1]);
        ctx.lineTo(this.v1[0], this.v1[1]);
        ctx.lineTo(this.v2[0], this.v2[1]);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }

      drawBg() {
        backgroundCtx.fillStyle = `rgb(15, 15, 15)`;
        backgroundCtx.strokeStyle = `rgb(150, 150, 150)`;
        backgroundCtx.lineWidth = 3;
        backgroundCtx.beginPath();
        backgroundCtx.lineCap = "round";
        backgroundCtx.lineJoin = "round";
        backgroundCtx.moveTo(this.v0[0], this.v0[1]);
        backgroundCtx.lineTo(this.v1[0], this.v1[1]);
        backgroundCtx.lineTo(this.v2[0], this.v2[1]);
        backgroundCtx.closePath();
        backgroundCtx.stroke();
        backgroundCtx.fill();
      }
    }

    // - Calculate a random range between two numbers
    const randomRange = (min, max) => {
      return min + Math.random() * (max - min);
    };

    // - Generate new points on click
    const handleClick = () => {
      (vertices = []),
        (indices = []),
        (fragments = []),
        (newFragments = []),
        (drawArray = []),
        (blueTriangles = []),
        (pinkTriangles = []),
        (newBlueArray = []),
        (newPinkArray = []);

      colorTriggered = false;
      drawRandomPoints();
      gameOver = false;
      turnAllLedsOff();
      streakPlayer1 = 1;
      streakPlayer2 = 1;
      ledsPlayer1 = [button1, button2, button3];
      ledsPlayer2 = [button4, button5, button6];
      getPlayersKey();
    };

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

      fragments.forEach(fragment => {
        if (
          fragment.v0[0] === 0 ||
          fragment.v1[0] === 0 ||
          fragment.v2[0] === 0 ||
          fragment.v0[1] === 0 ||
          fragment.v1[1] === 0 ||
          fragment.v2[1] === 0 ||
          fragment.v0[0] === canvas.width ||
          fragment.v1[0] === canvas.width ||
          fragment.v2[0] === canvas.width ||
          fragment.v0[1] === canvas.height ||
          fragment.v1[1] === canvas.height ||
          fragment.v2[1] === canvas.height
        ) {
        } else {
          fragment.v0[0] = fragment.v0[0] + curve[offset] / 1920;
          fragment.v0[1] = fragment.v0[1] + curve[offset] / 1920;
          fragment.v1[0] = fragment.v1[0] + curve[offset] / 1920;
          fragment.v1[1] = fragment.v1[1] + curve[offset] / 1920;
          fragment.v2[0] = fragment.v2[0] + curve[offset] / 1920;
          fragment.v2[1] = fragment.v2[1] + curve[offset] / 1920;
        }

        fragment.drawBg();
      });
    };

    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    var steps = 120;
    var speed = 1;
    for (var i = 0; i < steps; i++) {
      var stepValue = easeInOutQuad(i, 0, speed * steps, steps);
      curve.push(stepValue - 60);
    }

    const colorSweep = () => {
      sweepIndexLeft = 0;
      sweepIndexRight = 0;

      setIntervalX(
        () => {
          if (sweepIndexLeft < pinkTriangles.length) {
            sweepIndexLeft++;
            pinkTriangles[pinkTriangles.length - sweepIndexLeft].color =
              newPinkArray[pinkTriangles.length - sweepIndexLeft];
          }
        },
        20,
        pinkTriangles.length
      );

      setIntervalX(
        () => {
          if (sweepIndexRight < blueTriangles.length) {
            sweepIndexRight++;
            blueTriangles[blueTriangles.length - sweepIndexRight].color =
              newBlueArray[blueTriangles.length - sweepIndexRight];
          }
        },
        20,
        blueTriangles.length
      );
    };

    const generateNewColors = (blue, pink) => {
      // Genereer nieuwe color array
      colorTriggered = true;

      for (let i = 0; i < blue.length; i++) {
        let h = 237 + i * (33 / blue.length),
          s = "100%",
          l = `30%`,
          a = 1;
        newBlueArray.push([h, s, l, a]);
      }

      for (let i = 0; i < pink.length; i++) {
        let h = 303 - i * (33 / pink.length),
          s = "100%",
          l = `30%`,
          a = 1;
        newPinkArray.push([h, s, l, a]);
      }

      colorSweep();
    };

    // Draw loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGrid();

      Object.keys(blueTriangles).forEach(item => {
        blueTriangles[item].fragment[0].draw(blueTriangles[item].color);
      });

      Object.keys(pinkTriangles).forEach(item => {
        pinkTriangles[item].fragment[0].draw(pinkTriangles[item].color);
      });

      if (fragmentIndex >= inverseIndex + 2) {
        gameOver = true;
        if (colorTriggered === false) {
          generateNewColors(blueTriangles, pinkTriangles);
        }
      }

      if (weGaanStarten === true) {
        return null;
      } else {
        console.log("if false", weGaanStarten);
        if (gameOver === true) {
          if (blueTriangles.length > pinkTriangles.length) {
            blueWins();
            weGaanStarten = true;

            // setIntervalX(
            //   () => {
            //     startWaitingScreen();
            //   },
            //   2000,
            //   1
            // );
          } else {
            redWins();
            weGaanStarten = true;

            // setIntervalX(
            //   () => {
            //     startWaitingScreen();
            //   },
            //   2000,
            //   1
            // );
            // setInterval(function() {
            //   startWaitingScreen();
            // }, 5000);
          }
        }
      }

      requestAnimationFrame(draw);
    };

    // const startWaitingScreen = () => {
    //   console.log("voor", weGaanStarten);
    //   weGaanStarten = true;
    //   console.log("na", weGaanStarten);
    //   waitingScreen = true;
    //   stopWaitingScreen = false;
    //   (vertices = []),
    //     (indices = []),
    //     (fragments = []),
    //     (newFragments = []),
    //     (drawArray = []),
    //     (blueTriangles = []),
    //     (pinkTriangles = []),
    //     (newBlueArray = []),
    //     (newPinkArray = []);

    //   colorTriggered = false;
    //   drawRandomPoints();
    //   gameOver = false;
    //   turnAllLedsOff();
    //   showWaitingScreen();
    // };

    const turnAllLedsOff = () => {
      led1.off();
      led2.off();
      led3.off();
      led4.off();
      led5.off();
      led6.off();
    };
    const blueWins = () => {
      led1.on();
      led2.on();
      led3.on();
      led4.off();
      led5.off();
      led6.off();
      setIntervalX(
        () => {
          waitingScreen = true;
          stopWaitingScreen = false;
          showWaitingScreen();
        },
        2000,
        1
      );
    };

    const redWins = () => {
      led1.off();
      led2.off();
      led3.off();
      led4.on();
      led5.on();
      led6.on();
      setIntervalX(
        () => {
          waitingScreen = true;
          stopWaitingScreen = false;
          showWaitingScreen();
        },
        2000,
        1
      );
    };
    init();
  });
}
