document.addEventListener('DOMContentLoaded', () => {
  const draggables = document.querySelectorAll('.draggable');
  const dropAreas = document.querySelectorAll('.drop-area');
  const completionMessage = document.getElementById('completion-message');

  let isDragging = false;
  let activeItem = null;
  let touchStartX = 0;
  let touchStartY = 0;

  // Drag for Desktop
  draggables.forEach(dragItem => {
    dragItem.addEventListener('dragstart', (event) => {
      isDragging = true;
      activeItem = dragItem;
      event.dataTransfer.setData('text/plain', dragItem.id);
    });
  });

  dropAreas.forEach(dropArea => {
    dropArea.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

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

  // Touch for Mobile
  draggables.forEach(dragItem => {
    dragItem.addEventListener('touchstart', (event) => {
      isDragging = true;
      activeItem = dragItem;
      touchStartX = event.touches[0].clientX - dragItem.offsetLeft;
      touchStartY = event.touches[0].clientY - dragItem.offsetTop;
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

        const isInside = (
          centerX >= dropRect.left &&
          centerX <= dropRect.right &&
          centerY >= dropRect.top &&
          centerY <= dropRect.bottom
        );

        if (isInside) {
          dropArea.appendChild(activeItem);
          activeItem.style.position = 'static';
          placed = true;
        }
      });

      if (!placed) {
        activeItem.style.left = '';
        activeItem.style.top = '';
      }

      isDragging = false;
      activeItem = null;
      checkCompletion();
    });
  });

  function checkCompletion() {
    const droppedCount =
      Array.from(dropAreas).reduce((acc, area) => acc + area.querySelectorAll('.draggable').length, 0);
    if (droppedCount === 2) {
      completionMessage.style.display = 'block';
    }
  }
});
