const five = require("johnny-five");
const board = new five.Board({
  repl: false
});

board.on("ready", () => {
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

  // Scorebord
  // const $scorePlayer1 = document.getElementById("score-player1");
  // const $scorePlayer2 = document.getElementById("score-player2");

  // const $streakPlayer1 = document.getElementById("streak-player1");
  // const $streakPlayer2 = document.getElementById("streak-player2");

  scorePlayer1 = 0;
  scorePlayer2 = 0;

  streakPlayer1 = 1;
  streakPlayer2 = 1;

  // $scorePlayer1.textContent = scorePlayer1;
  // $scorePlayer2.textContent = scorePlayer2;

  // $streakPlayer1.textContent = streakPlayer1;
  // $streakPlayer2.textContent = streakPlayer2;

  // Led array voor elke speler
  let ledsPlayer1 = [button1, button2, button3];
  let ledsPlayer2 = [button4, button5, button6];

  // Laatste item in array om zelfde te voorkomen
  let lastInLedsPlayer1 = ledsPlayer1[2];
  let lastInLedsPlayer2 = ledsPlayer2[2];

  // Shuffle functie
  const shuffle = (array, last) => {
    const voorlopig = array.sort(() => Math.random() - 0.5);
    if (voorlopig[0] === last) {
      shuffle(array, last);
    } else {
      array = voorlopig;
    }
  };

  shuffle(ledsPlayer1, lastInLedsPlayer1);
  shuffle(ledsPlayer2, lastInLedsPlayer2);

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

  // Eerste led voor elke speler gaat aan
  turnLedOn(ledsPlayer1[0]);
  turnLedOn(ledsPlayer2[0]);

  // Button listeners
  button1.on("press", function() {
    if (ledsPlayer1[0] === button1) {
      scorePlayer1 += streakPlayer1;
      if (streakPlayer1 < 3) {
        streakPlayer1++;
      }
      // $scorePlayer1.textContent = scorePlayer1;
      // $streakPlayer1.textContent = streakPlayer1;
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
        // $streakPlayer1.textContent = streakPlayer1;
      }
    }
  });

  button2.on("press", function() {
    if (ledsPlayer1[0] === button2) {
      scorePlayer1 += streakPlayer1;
      if (streakPlayer1 < 3) {
        streakPlayer1++;
      }
      // $scorePlayer1.textContent = scorePlayer1;
      // $streakPlayer1.textContent = streakPlayer1;
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
        // $streakPlayer1.textContent = streakPlayer1;
      }
    }
  });

  button3.on("press", function() {
    if (ledsPlayer1[0] === button3) {
      scorePlayer1 += streakPlayer1;
      if (streakPlayer1 < 3) {
        streakPlayer1++;
      }
      // $scorePlayer1.textContent = scorePlayer1;
      // $streakPlayer1.textContent = streakPlayer1;
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
        // $streakPlayer1.textContent = streakPlayer1;
      }
    }
  });

  button4.on("press", function() {
    if (ledsPlayer2[0] === button4) {
      scorePlayer2 += streakPlayer2;
      if (streakPlayer2 < 3) {
        streakPlayer2++;
      }
      // $scorePlayer2.textContent = scorePlayer2;
      // $streakPlayer2.textContent = streakPlayer2;
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
        // $streakPlayer2.textContent = streakPlayer2;
      }
    }
  });

  button5.on("press", function() {
    if (ledsPlayer2[0] === button5) {
      scorePlayer2 += streakPlayer2;
      if (streakPlayer2 < 3) {
        streakPlayer2++;
      }
      // $scorePlayer2.textContent = scorePlayer2;
      // $streakPlayer2.textContent = streakPlayer2;
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
        // $streakPlayer2.textContent = streakPlayer2;
      }
    }
  });

  button6.on("press", function() {
    if (ledsPlayer2[0] === button6) {
      scorePlayer2 += streakPlayer2;
      if (streakPlayer2 < 3) {
        streakPlayer2++;
      }
      // $scorePlayer2.textContent = scorePlayer2;
      // $streakPlayer2.textContent = streakPlayer2;
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
        // $streakPlayer2.textContent = streakPlayer2;
      }
    }
  });
});
