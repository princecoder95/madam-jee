let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  prevX = 0;
  prevY = 0;
  currentPaperX = 0;
  currentPaperY = 0;
  rotation = Math.random() * 30 - 15;

  init(paper) {
    // Mouse events for desktop
    paper.addEventListener('mousedown', (e) => {
      this.handleStart(e.clientX, e.clientY, paper);
    });

    // Touch events for mobile
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleStart(e.touches[0].clientX, e.touches[0].clientY, paper);
    });

    // Mouse move for desktop
    document.addEventListener('mousemove', (e) => {
      this.handleMove(e.clientX, e.clientY, paper);
    });

    // Touch move for mobile
    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.handleMove(e.touches[0].clientX, e.touches[0].clientY, paper);
    });

    // End events
    window.addEventListener('mouseup', () => {
      this.handleEnd();
    });

    window.addEventListener('touchend', () => {
      this.handleEnd();
    });

    // Prevent context menu
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  handleStart(clientX, clientY, paper) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    paper.style.zIndex = highestZ;
    highestZ += 1;

    this.startX = clientX;
    this.startY = clientY;
    this.prevX = clientX;
    this.prevY = clientY;
  }

  handleMove(clientX, clientY, paper) {
    if (!this.holdingPaper) return;

    this.currentX = clientX;
    this.currentY = clientY;

    // Calculate movement
    const deltaX = this.currentX - this.prevX;
    const deltaY = this.currentY - this.prevY;

    // Update paper position
    this.currentPaperX += deltaX;
    this.currentPaperY += deltaY;

    this.prevX = this.currentX;
    this.prevY = this.currentY;

    // Apply transform - only translation, keep original rotation
    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }

  handleEnd() {
    this.holdingPaper = false;
  }
}

// Initialize all papers
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

// Add CSS for better mobile experience
const style = document.createElement('style');
style.textContent = `
  .paper {
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    cursor: grab;
  }
  
  .paper:active {
    cursor: grabbing;
  }
  
  body {
    margin: 0;
    padding: 20px;
    overflow: hidden;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
    width: 100vw;
    height: 100vh;
  }
  
  * {
    box-sizing: border-box;
  }
`;
document.head.appendChild(style);
