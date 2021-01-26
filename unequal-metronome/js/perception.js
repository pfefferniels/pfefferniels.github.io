
document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("space");
  const ctx = canvas.getContext("2d");
  ctx.font = "16px Arial";

  var datasets = []
  var average = []

  const audioRecording = document.getElementById('audioRecording');

  var recording = false;
  var startTime = 0;
  var startY = 0;
  var startX = 0;
  var data = [];
  var firstTime = true;
  var lastY = 0;
  var lastX = 0;
  var lastT = 0;
  const INTERVAL = 100;

  canvas.addEventListener("mousemove", function(e) {
    if (!recording) {
      //ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText("not recording", 10, 20);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const canvasY = Math.round(e.clientY - rect.top);
    const canvasX = Math.round(e.clientX - rect.left);

    if (recording) {
      lastY = canvasY;
      lastX = canvasX;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Y: " + (canvasY) + " X:" + (canvasX), 10, 40);
  });

  function saveLast() {
    if (recording) {
      lastT += INTERVAL;
      data.push({
        t: lastT,
        x: lastX,
        y: lastY
      })
    }
  }

  window.setInterval(saveLast, INTERVAL);

  document.addEventListener("keyup", function(e) {
    if (e.keyCode === 32) { // 'space'
      if (!recording) {
        audioRecording.play();
        startTime = Date.now();
      } else {
        audioRecording.pause();
        audioRecording.fastSeek(0.0);
        datasets.push(data);
        data = []
        lastT = 0;

      }

      recording = !recording;
    } else if (e.keyCode === 69) { // 'e'
      const output = document.getElementById('output');
      for (let i=0; i<datasets.length; i++) {
        const div = document.createElement('div');

        for (let j=0; j<datasets[i].length; j++) {
          let span = document.createElement("span");
          span.textContent = (datasets[i][j].t + ", " + datasets[i][j].y);
          div.appendChild(document.createElement("br"));
          div.appendChild(span);
        }
        output.appendChild(div);
      }
    } else if (e.keyCode === 65) { // 'a'
      for (let i=0; i<datasets[0].length; i++) {
        let avgX = 0, avgY = 0;
        for (let j=0; j<datasets.length; j++) {
          if (datasets[j][i]) {
            avgX += datasets[j][i].x;
            avgY += datasets[j][i].y;
          }
        }
        avgX = (avgX/datasets.length);
        avgY = (avgY/datasets.length);

        average.push({
          t: datasets[0][i].t,
          x: Math.floor(avgX),
          y: Math.floor(avgY)
        })
      }

      const output = document.getElementById('output');
      for (let i=0; i<average.length-1; i++) {
        let span = document.createElement("span");
        span.textContent = (average[i].t + ", " + average[i].x + ", " + average[i].y);
        output.appendChild(document.createElement("br"));
        output.appendChild(span);

        ctx.beginPath();
        ctx.moveTo(average[i].x, average[i].y);
        ctx.lineTo(average[i+1].x, average[i+1].y);
        ctx.stroke();
      }
    }
  })
});
