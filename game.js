document.addEventListener('DOMContentLoaded', () => {
  const draggables = document.querySelectorAll('.draggable');
  const dropAreas = document.querySelectorAll('.drop-area');
  const dragArea = document.getElementById('drag-area');
  const messageBox = document.getElementById('completion-message');
  const resultText = document.getElementById('result-text');
  const tryAgainBtn = document.getElementById('try-again');

  let activeClone = null;
  let activeOriginal = null;
  let offsetX = 0;
  let offsetY = 0;

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
      let dropped = false;

      dropAreas.forEach(drop => {
        const dropRect = drop.getBoundingClientRect();
        const centerX = cloneRect.left + cloneRect.width / 2;
        const centerY = cloneRect.top + cloneRect.height / 2;

        const isInside =
          centerX >= dropRect.left &&
          centerX <= dropRect.right &&
          centerY >= dropRect.top &&
          centerY <= dropRect.bottom;

        if (isInside) {
          drop.appendChild(activeOriginal);
          activeOriginal.style.position = 'static';
          dropped = true;
        }
      });

      if (!dropped) {
        dragArea.appendChild(activeOriginal);
        activeOriginal.style.left = '';
        activeOriginal.style.top = '';
        activeOriginal.style.position = 'absolute';
      }

      document.body.removeChild(activeClone);
      activeClone = null;
      activeOriginal = null;

      checkCompletion();
    });
  });

  function moveClone(x, y) {
    activeClone.style.left = (x - offsetX) + 'px';
    activeClone.style.top = (y - offsetY) + 'px';
  }

  function checkCompletion() {
    const drag1 = document.getElementById('drag1');
    const drag2 = document.getElementById('drag2');

    const correct =
      drag1.parentElement.id === drag1.dataset.target &&
      drag2.parentElement.id === drag2.dataset.target;

    const allPlaced = [drag1, drag2].every(el =>
      el.parentElement.classList.contains('drop-area')
    );

    if (allPlaced) {
      messageBox.style.display = 'block';
      if (correct) {
        resultText.textContent = "✅ Success! Both items correctly placed.";
        messageBox.classList.remove('fail');
      } else {
        resultText.textContent = "❌ Incorrect match. Try again.";
        messageBox.classList.add('fail');
      }
    }
  }

  tryAgainBtn.addEventListener('click', () => {
    const drag1 = document.getElementById('drag1');
    const drag2 = document.getElementById('drag2');

    dragArea.appendChild(drag1);
    dragArea.appendChild(drag2);

    Object.assign(drag1.style, {
      left: '20px', top: '20px', position: 'absolute'
    });

    Object.assign(drag2.style, {
      left: '100px', top: '20px', position: 'absolute'
    });

    messageBox.style.display = 'none';
    messageBox.classList.remove('fail');
  });
});
