document.addEventListener('DOMContentLoaded', () => {
  const draggables = document.querySelectorAll('.draggable');
  const dropzones = document.querySelectorAll('.grow-slot');
  const completionButtons = document.getElementById('completion-buttons');
  const dragItem = document.getElementById('drag1');
  const dropArea = document.getElementById('drop-area');
  const completionMessage = document.getElementById('completion-message');

  let isDragging = false;
  let draggedItem = null;
  let touchOffsetX = 0;
  let touchOffsetY = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  const correctIds = ['seed', 'water-can', 'sun'];
  const placed = new Set();

  // Function to apply portrait layout
  function applyPortraitLayout() {
    document.getElementById('game-container').style.flexDirection = 'column';
    document.getElementById('game-container').style.alignItems = 'center';
    document.getElementById('toolbox').style.flexDirection = 'row';
    document.getElementById('toolbox').style.borderLeft = 'none';
    document.getElementById('toolbox').style.borderTop = '2px solid #444';
    document.getElementById('toolbox').style.minWidth = '100%';
  }

  // Function to check orientation and apply layout
  function checkOrientation() {
    if (window.innerWidth < window.innerHeight) {
      // Portrait mode
      applyPortraitLayout();
    } else {
      // Landscape mode - force portrait layout
      applyPortraitLayout();
    }
  }

  // Initial check and apply layout
  checkOrientation();

  // Listen for orientation changes
  window.addEventListener('orientationchange', checkOrientation);

  // Desktop drag events
  draggables.forEach(drag => {
    drag.addEventListener('dragstart', e => {
      draggedItem = e.target;
      e.dataTransfer.setData('text/plain', draggedItem.id);
    });
  });

  dropzones.forEach(zone => {
    zone.addEventListener('dragover', e => e.preventDefault());

    zone.addEventListener('drop', e => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const item = document.getElementById(id);
      if (!zone.querySelector('.draggable')) {
        zone.appendChild(item);
        item.style.position = 'static';
        placed.add(id);
        checkCompletion();
      }
    });
  });

  // Mobile drag logic
  draggables.forEach(drag => {
    drag.addEventListener('touchstart', e => {
      isDragging = true;
      draggedItem = drag;
      draggedItem.style.zIndex = 999;
    });

    drag.addEventListener('touchmove', e => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = draggedItem.getBoundingClientRect();
      draggedItem.style.position = 'absolute';
      draggedItem.style.left = touch.clientX - (rect.width / 2) + 'px';
      draggedItem.style.top = touch.clientY - (rect.height / 2) + 'px';
    }, { passive: false });

    drag.addEventListener('touchend', e => {
      if (!isDragging) return;
      isDragging = false;
      draggedItem.style.position = 'static';

      const dragRect = draggedItem.getBoundingClientRect();
      for (const zone of dropzones) {
        const zoneRect = zone.getBoundingClientRect();
        const centerX = dragRect.left + dragRect.width / 2;
        const centerY = dragRect.top + dragRect.height / 2;

        if (
          centerX > zoneRect.left &&
          centerX < zoneRect.right &&
          centerY > zoneRect.top &&
          centerY > zoneRect.bottom &&
          !zone.querySelector('.draggable')
        ) {
          zone.appendChild(draggedItem);
          draggedItem.style.position = 'static';
          placed.add(draggedItem.id);
          checkCompletion();
          return;
        }
      }

      // Reset position if not placed
      draggedItem.style.left = '';
      draggedItem.style.top = '';
    });
  });

  function checkCompletion() {
    if (correctIds.every(id => placed.has(id))) {
      document.getElementById('game-area').classList.add('complete');
      completionButtons.style.display = 'block';
    }
  }

  // Desktop
  const handleDragStart = (event) => {
    isDragging = true;
    event.dataTransfer.setData('text/plain', dragItem.id);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (!isDragging) return;
    isDragging = false;

    const id = event.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(id);
    dropArea.appendChild(draggedElement);
    completionMessage.style.display = "block";
  };

  // Mobile
  const handleTouchStart = (event) => {
    isDragging = true;
    touchStartX = event.touches[0].clientX - dragItem.offsetLeft;
    touchStartY = event.touches[0].clientY - dragItem.offsetTop;
  };

  const handleTouchMove = (event) => {
    if (!isDragging) return;
    event.preventDefault();

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    dragItem.style.left = (touchX - touchStartX) + 'px';
    dragItem.style.top = (touchY - touchStartY) + 'px';
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    const dropAreaRect = dropArea.getBoundingClientRect();
    const dragItemRect = dragItem.getBoundingClientRect();

    const centerX = dragItemRect.left + dragItemRect.width / 2;
    const centerY = dragItemRect.top + dragItemRect.height / 2;

    const isInside = (
      centerX >= dropAreaRect.left &&
      centerX <= dropAreaRect.right &&
      centerY >= dropAreaRect.top &&
      centerY <= dropAreaRect.bottom
    );

    if (isInside) {
      dropArea.appendChild(dragItem);
      dragItem.style.position = 'static'; // snap into flow
      completionMessage.style.display = "block";
    } else {
      dragItem.style.left = '';
      dragItem.style.top = '';
    }
  };

  // Assign all listeners
  dragItem.addEventListener('dragstart', handleDragStart);
  dropArea.addEventListener('dragover', handleDragOver);
  dropArea.addEventListener('drop', handleDrop);

  dragItem.addEventListener('touchstart', handleTouchStart);
  dragItem.addEventListener('touchmove', handleTouchMove, { passive: false });
  dragItem.addEventListener('touchend', handleTouchEnd);
});
