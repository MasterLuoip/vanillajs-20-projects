// 1.Check if left the window or tab
setInterval(checkFocus, 200);

function checkFocus() {
  const tabChangeStatusEl = document.getElementById('tabChangedstatus');

  if (!document.hasFocus()) {
    tabChangeStatusEl.textContent = 'Warning! You have changed the page!';
    tabChangeStatusEl.style.color = 'red';
  }
}

// 2. Check if the window size if full size
function isMaxScreen() {
  const fullScreenStatus = document.getElementById('fullScreenText');
  const result =
    screen.availHeight - window.outerHeight <= 0 &&
    screen.availWidth - window.outerWidth <= 0;
  if (result) {
    fullScreenStatus.textContent = 'You are in full screen view';
    fullScreenStatus.style.color = 'green';
  } else {
    fullScreenStatus.textContent =
      'You are not in full screen view, please max you browser!';
    fullScreenStatus.style.color = 'red';
  }
}
isMaxScreen();
window.addEventListener('resize', (event) => {
  isMaxScreen();
});

// 3. Check if paste content into the text field
const handTypingTextInput = document.getElementById('handTypingInput');
const handTypingStatus = document.getElementById('handTypingStatus');
handTypingTextInput.addEventListener('input', (event) => {
  if (event.inputType === 'insertFromPaste') {
    handTypingStatus.textContent = 'You just pasted a text!';
    handTypingStatus.style.color = 'red';
  }
});
// 5. Screen recording
const screenRecordVideo = document.getElementById('screenRecordVideo');
const startBtn = document.getElementById('startBtn');
const endBtn = document.getElementById('endBtn');

let recorder, stream;
async function startRecording() {
  // 1. show a popup to choose screen to record
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: 'screen' },
  });
  // 2. Record the Stream
  recorder = new MediaRecorder(stream);

  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);

  // 3. Convert the Recording to a Blob
  recorder.onstop = (e) => {
    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    screenRecordVideo.src = URL.createObjectURL(completeBlob);
  };

  recorder.start();
}
startBtn.addEventListener('click', () => {
  startBtn.setAttribute('disabled', true);
  stopBtn.removeAttribute('disabled');

  startRecording();
});
stopBtn.addEventListener('click', () => {
  stopBtn.setAttribute('disabled', true);
  startBtn.removeAttribute('disabled');

  recorder.stop();
  stream.getVideoTracks()[0].stop();
});

//6. Camera recording
let preview = document.getElementById('preview');
let cameraRecording = document.getElementById('cameraVideo');
let cameraStartBtn = document.getElementById('cameraStartBtn');
let cameraStopBtn = document.getElementById('cameraStopBtn');

function wait(delayInMS) {
  return new Promise((resolve) => setTimeout(resolve, delayInMS));
}

let cameraRecorder;
function startCameraRecording(stream) {
  cameraRecorder = new MediaRecorder(stream);
  let data = [];

  cameraRecorder.ondataavailable = (event) => data.push(event.data);
  cameraRecorder.start();

  let stopped = new Promise((resolve, reject) => {
    cameraRecorder.onstop = resolve;
    cameraRecorder.onerror = (event) => reject(event.name);
  });

  return Promise.all([stopped]).then(() => data);
}

cameraStartBtn.addEventListener(
  'click',
  function () {
    cameraRecording.src = '';
    cameraStartBtn.setAttribute('disabled', true);
    cameraStopBtn.removeAttribute('disabled');
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        preview.srcObject = stream;
        preview.captureStream =
          preview.captureStream || preview.mozCaptureStream;
        return new Promise((resolve) => (preview.onplaying = resolve));
      })
      .then(() => startCameraRecording(preview.captureStream()))
      .then((recordedChunks) => {
        let recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
        cameraRecording.src = URL.createObjectURL(recordedBlob);
      })
      .catch(console.error);
  },
  false
);

cameraStopBtn.addEventListener('click', () => {
  cameraStopBtn.setAttribute('disabled', true);
  cameraStartBtn.removeAttribute('disabled');
  cameraRecorder.stop();
});
