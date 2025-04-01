document.addEventListener('DOMContentLoaded', () => {
  const draggables = document.querySelectorAll('.draggable');
  const dropzones = document.querySelectorAll('.grow-slot');
  const completionButtons = document.getElementById('completion-buttons');

  let isDragging = false;
  let draggedItem = null;
  let touchOffsetX = 0;
  let touchOffsetY = 0;
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
      draggedItem.style.position = 'absolute';
      draggedItem.style.left = touch.clientX - (draggedItem.offsetWidth / 2) + 'px';
      draggedItem.style.top = touch.clientY - (draggedItem.offsetHeight / 2) + 'px';
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
});
