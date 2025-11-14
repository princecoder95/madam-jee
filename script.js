let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse events for desktop
    paper.addEventListener('mousedown', (e) => {
      this.handleStart(e.clientX, e.clientY, paper, e);
    });

    // Touch events for mobile
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleStart(e.touches[0].clientX, e.touches[0].clientY, paper, e);
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

    // Mouse up for desktop
    window.addEventListener('mouseup', () => {
      this.handleEnd();
    });

    // Touch end for mobile
    window.addEventListener('touchend', () => {
      this.handleEnd();
    });

    // Context menu for right click rotation (desktop)
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (this.holdingPaper) {
        this.rotating = true;
      }
    });
  }

  handleStart(clientX, clientY, paper, event) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    paper.style.zIndex = highestZ;
    highestZ += 1;

    this.startX = clientX;
    this.startY = clientY;
    this.prevX = clientX;
    this.prevY = clientY;

    // Right mouse button or long press for rotation
    if (event.button === 2 || event.touches) {
      this.rotating = true;
    }
  }

  handleMove(clientX, clientY, paper) {
    if (!this.holdingPaper) return;

    this.currentX = clientX;
    this.currentY = clientY;

    this.velX = this.currentX - this.prevX;
    this.velY = this.currentY - this.prevY;

    // Calculate rotation based on movement direction
    const dirX = this.currentX - this.startX;
    const dirY = this.currentY - this.startY;

    if (this.rotating) {
      const angle = Math.atan2(dirY, dirX);
      let degrees = (180 * angle / Math.PI + 360) % 360;
      this.rotation = degrees;
    } else {
      // Move the paper
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
    }

    this.prevX = this.currentX;
    this.prevY = this.currentY;

    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }

  handleEnd() {
    this.holdingPaper = false;
    this.rotating = false;
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
  }
  
  body {
    margin: 0;
    padding: 20px;
    overflow: hidden;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
  }
  
  * {
    box-sizing: border-box;
  }
`;
document.head.appendChild(style);
