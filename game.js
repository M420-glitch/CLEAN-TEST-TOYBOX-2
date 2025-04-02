document.addEventListener('DOMContentLoaded', () => {
  const draggables = document.querySelectorAll('.draggable');
  const dropAreas = document.querySelectorAll('.drop-area');
  const dragArea = document.getElementById('drag-area');
  const messageBox = document.getElementById('completion-message');
  const resultText = document.getElementById('result-text');
  const tryAgainBtn = document.getElementById('try-again');

  let isDragging = false;
  let activeItem = null;
  let touchStartX = 0;
  let touchStartY = 0;

  // Desktop drag
  draggables.forEach(dragItem => {
    dragItem.addEventListener('dragstart', (event) => {
      isDragging = true;
      activeItem = dragItem;
      event.dataTransfer.setData('text/plain', dragItem.id);
    });
  });

  dropAreas.forEach(dropArea => {
    dropArea.addEventListener('dragover', (event) => event.preventDefault());

    dropArea.addEventListener('drop', (event) => {
      event.preventDefault();
      if (!isDragging || !activeItem) return;
      dropArea.appendChild(activeItem);
      activeItem.style.position = 'static';
      isDragging = false;
      activeItem = null;
      checkCompletion();
    });
  });

  // Mobile drag
  draggables.forEach(dragItem => {
    dragItem.addEventListener('touchstart', (event) => {
      isDragging = true;
      activeItem = dragItem;

      const rect = dragItem.getBoundingClientRect();
      touchStartX = event.touches[0].clientX - rect.left;
      touchStartY = event.touches[0].clientY - rect.top;

      document.body.appendChild(dragItem);
      dragItem.classList.add('drag-floating');

      dropAreas.forEach(zone => zone.style.pointerEvents = 'none');
    });

    dragItem.addEventListener('touchmove', (event) => {
      if (!isDragging || !activeItem) return;
      event.preventDefault();

      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;

      activeItem.style.left = (touchX - touchStartX) + 'px';
      activeItem.style.top = (touchY - touchStartY) + 'px';
    }, { passive: false });

    dragItem.addEventListener('touchend', () => {
      if (!isDragging || !activeItem) return;

      const dragRect = activeItem.getBoundingClientRect();
      let placed = false;

      dropAreas.forEach(dropArea => {
        const dropRect = dropArea.getBoundingClientRect();
        const centerX = dragRect.left + dragRect.width / 2;
        const centerY = dragRect.top + dragRect.height / 2;

        const isInside =
          centerX >= dropRect.left &&
          centerX <= dropRect.right &&
          centerY >= dropRect.top &&
          centerY <= dropRect.bottom;

        if (isInside) {
          dropArea.appendChild(activeItem);
          activeItem.style.position = 'static';
          activeItem.classList.remove('drag-floating');
          placed = true;
        }
      });

      if (!placed) {
        dragArea.appendChild(activeItem);
        Object.assign(activeItem.style, {
          position: 'absolute',
          left: '',
          top: '',
          zIndex: 1000
        });
        activeItem.classList.remove('drag-floating');
      }

      dropAreas.forEach(zone => zone.style.pointerEvents = '');
      isDragging = false;
      activeItem = null;
      checkCompletion();
    });
  });

  function checkCompletion() {
    const drag1 = document.getElementById('drag1');
    const drag2 = document.getElementById('drag2');

    const inCorrectPlace =
      drag1.parentElement.id === drag1.dataset.target &&
      drag2.parentElement.id === drag2.dataset.target;

    const allPlaced = [drag1, drag2].every(el =>
      el.parentElement.classList.contains('drop-area')
    );

    if (allPlaced) {
      messageBox.style.display = 'block';
      if (inCorrectPlace) {
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
      left: '20px', top: '20px', position: 'absolute', zIndex: 1000
    });

    Object.assign(drag2.style, {
      left: '100px', top: '20px', position: 'absolute', zIndex: 1000
    });

    messageBox.style.display = 'none';
    messageBox.classList.remove('fail');
  });
});
