document.addEventListener('DOMContentLoaded', () => {
  const draggables = document.querySelectorAll('.draggable');
  const dropZone = document.getElementById('drop-zone');
  const resultBox = document.getElementById('result-box');
  const resultText = document.getElementById('result-text');
  const tryAgainBtn = document.getElementById('try-again');
  let activeClone = null;
  let activeOriginal = null;
  let offsetX = 0;
  let offsetY = 0;

  let droppedItems = [];

  draggables.forEach(el => {
    el.addEventListener('touchstart', (event) => {
      activeOriginal = el;

      const rect = el.getBoundingClientRect();
      offsetX = event.touches[0].clientX - rect.left;
      offsetY = event.touches[0].clientY - rect.top;

      activeClone = el.cloneNode(true);
      activeClone.classList.add('clone');
      document.body.appendChild(activeClone);
      moveClone(event.touches[0].clientX, event.touches[0].clientY);
    });

    el.addEventListener('touchmove', (event) => {
      if (!activeClone) return;
      event.preventDefault();
      moveClone(event.touches[0].clientX, event.touches[0].clientY);
    }, { passive: false });

    el.addEventListener('touchend', () => {
      if (!activeClone || !activeOriginal) return;

      const cloneRect = activeClone.getBoundingClientRect();
      const dropRect = dropZone.getBoundingClientRect();
      const centerX = cloneRect.left + cloneRect.width / 2;
      const centerY = cloneRect.top + cloneRect.height / 2;

      const isInside =
        centerX >= dropRect.left &&
        centerX <= dropRect.right &&
        centerY >= dropRect.top &&
        centerY <= dropRect.bottom;

      if (isInside) {
        const value = activeOriginal.dataset.value;
        if (!droppedItems.includes(value)) {
          droppedItems.push(value);
          const placed = activeOriginal.cloneNode(true);
          placed.classList.remove('draggable');
          dropZone.appendChild(placed);
        }
      }

      document.body.removeChild(activeClone);
      activeClone = null;
      activeOriginal = null;

      checkResult();
    });
  });

  function moveClone(x, y) {
    activeClone.style.left = (x - offsetX) + 'px';
    activeClone.style.top = (y - offsetY) + 'px';
  }

  function checkResult() {
    if (droppedItems.length >= 3) {
      const hasD = droppedItems.includes('D');
      const valid = droppedItems.includes('A') + droppedItems.includes('B') + droppedItems.includes('C');

      resultBox.style.display = 'block';
      resultBox.classList.remove('success', 'fail');

      if (hasD || valid < 3) {
        resultText.textContent = "❌ Incorrect! D should not be used.";
        resultBox.classList.add('fail');
      } else {
        resultText.textContent = "✅ Success! You used A, B, C correctly.";
        resultBox.classList.add('success');
      }
    }
  }

  tryAgainBtn.addEventListener('click', () => {
    dropZone.innerHTML = "Drop Items Here";
    droppedItems = [];
    resultBox.style.display = 'none';
    resultBox.classList.remove('fail', 'success');
  });
});
