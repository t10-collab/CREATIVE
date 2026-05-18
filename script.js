// script.js

const rhythmArea = document.getElementById("rhythmArea");
const beatCountText = document.getElementById("beatCount");

const playBtn = document.getElementById("playBtn");
const clearBtn = document.getElementById("clearBtn");

const tempoValue = document.getElementById("tempoValue");
const minusTempo = document.getElementById("minusTempo");
const plusTempo = document.getElementById("plusTempo");

let tempo = 88;

let rhythm = [];
let totalBeat = 0;

// 음표 정보
const noteData = {
  quarter: {
    symbol: "♩",
    beat: 1,
    soundCount: 1,
    duration: 1
  },

  eighthSingle: {
    symbol: "♪",
    beat: 0.5,
    soundCount: 1,
    duration: 0.5
  },

  eighthPair: {
    symbol: "♫",
    beat: 1,
    soundCount: 2,
    duration: 0.5
  },

  sixteenthPair: {
    symbol: "𝅘𝅥𝅯𝅘𝅥𝅯",
    beat: 0.5,
    soundCount: 2,
    duration: 0.25
  }
};

// 음표 추가
document.querySelectorAll(".note-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    const note = noteData[type];

    if (totalBeat + note.beat > 4) {
      alert("4/4박자를 초과합니다!");
      return;
    }

    rhythm.push(type);
    totalBeat += note.beat;

    renderRhythm();
  });
});

// 화면 렌더링
function renderRhythm() {
  rhythmArea.innerHTML = "";

  rhythm.forEach(type => {
    const div = document.createElement("div");
    div.className = "rhythm-item";
    div.textContent = noteData[type].symbol;

    rhythmArea.appendChild(div);
  });

  beatCountText.textContent = totalBeat;
}

// 템포 조절
minusTempo.addEventListener("click", () => {
  if (tempo > 40) {
    tempo--;
    tempoValue.textContent = tempo;
  }
});

plusTempo.addEventListener("click", () => {
  if (tempo < 200) {
    tempo++;
    tempoValue.textContent = tempo;
  }
});

// 전체 삭제
clearBtn.addEventListener("click", () => {
  rhythm = [];
  totalBeat = 0;
  renderRhythm();
});

// 소리 생성
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClick(time) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.frequency.value = 880;
  osc.type = "square";

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(0.2, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

  osc.start(time);
  osc.stop(time + 0.08);
}

// 리듬 재생
playBtn.addEventListener("click", async () => {

  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  const quarterTime = 60 / tempo;

  let currentTime = audioCtx.currentTime;

  rhythm.forEach(type => {

    const note = noteData[type];

    for (let i = 0; i < note.soundCount; i++) {

      playClick(currentTime);

      currentTime += quarterTime * note.duration;
    }
  });
});
