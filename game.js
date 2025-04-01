window.addEventListener("DOMContentLoaded", () => {
  playerState.load();
  document.getElementById("xp-value").textContent = playerState.getXP();

  // Add console logs to check which CSS is applied
  if (window.matchMedia("(min-width: 769px)").matches) {
    console.log("desktopstyle.css is applied");
  } else if (
    window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches
  ) {
    console.log("portraitstyle.css is applied");
  } else if (
    window.matchMedia("(max-width: 1024px) and (orientation: landscape)").matches
  ) {
    console.log("landscapestyle.css is applied");
  }
});

let dragged = null;
let taskComplete = false;
const correctItems = ['seed', 'water-can', 'sun'];
let placedItems = [];

document.querySelectorAll('.draggable').forEach(el => {
  el.addEventListener('dragstart', e => {
    dragged = e.target;
    setTimeout(() => {
      e.target.style.visibility = 'hidden';
    }, 0);
  });

  el.addEventListener('dragend', e => {
    e.target.style.visibility = 'visible';
  });
});

document.getElementById('game-area').addEventListener('dragover', e => {
  e.preventDefault();
});

document.querySelectorAll('.grow-slot').forEach(slot => {
  slot.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  slot.addEventListener('drop', e => {
    e.preventDefault();

    if (!dragged) return;
    if (slot.children.length > 0) return;

    dragged.style.position = 'relative';
    dragged.style.left = '0px';
    dragged.style.top = '0px';
    dragged.style.width = '80px';
    dragged.style.zIndex = 1;
    dragged.style.margin = 'auto';
    dragged.setAttribute('draggable', 'false');

    slot.appendChild(dragged);
    placedItems.push(dragged.id);

    if (placedItems.length === 3) checkGrowResult();
    dragged = null;
  });
});

function checkGrowResult() {
  const gameAreaEl = document.getElementById('game-area');
  const xpEl = document.getElementById('xp-value');
  const messageEl = document.getElementById('game-message');

  const isValid = correctItems.every(item => placedItems.includes(item));

  messageEl.textContent = '';
  messageEl.className = 'game-message';

  if (isValid) {
    gameAreaEl.classList.add('complete');
    gameAreaEl.style.borderColor = '#28a745';

    if (!playerState.isCompleted("2")) {
      let currentXP = playerState.getXP();
      currentXP += 5;
      playerState.setXP(currentXP);
      playerState.markCompleted("2");
      xpEl.textContent = currentXP;

      xpEl.classList.add('xp-flash');
      setTimeout(() => xpEl.classList.remove('xp-flash'), 500);
    }

    // ✅ Show buttons regardless of XP state
    console.log("Before setting display: block");
    document.getElementById('completion-buttons').style.display = 'block';
    console.log("After setting display: block");
    messageEl.textContent = "✅ Crops successfully planted!";
    messageEl.classList.add("success");

    setTimeout(() => {
      gameAreaEl.classList.remove('complete');
      gameAreaEl.style.borderColor = '#555';
    }, 1000);
  } else {
    gameAreaEl.style.borderColor = '#b00020';
    messageEl.textContent = "❌ Something’s not right in the soil... Try again.";

    setTimeout(() => {
      gameAreaEl.style.borderColor = '#555';
      messageEl.textContent = '';

      placedItems = [];
      document.querySelectorAll('.grow-slot').forEach(slot => {
        const item = slot.querySelector('img');
        if (item) {
          document.getElementById('toolbox').appendChild(item);
          item.setAttribute('draggable', 'true');
          item.style.position = 'static';
          item.style.margin = '10px';
        }
      });
    }, 1000);
  }
}

document.getElementById('btn-continue').addEventListener('click', () => {
  window.location.href = '../Toybox-3/index.html';
});

document.getElementById('btn-exit').addEventListener('click', () => {
  console.log('Exit Toybox');
});

function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
