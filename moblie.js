let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  initialPinchDistance = 0;
  initialRotation = 0;
  touchCount = 0;

  init(paper) {
    // Touch move event
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      
      this.touchCount = e.touches.length;
      
      if (this.touchCount === 1) {
        // Single finger - move
        this.handleMove(e, paper);
      } else if (this.touchCount === 2) {
        // Two fingers - rotate/scale
        this.handleRotate(e, paper);
      }
    });

    // Touch start event
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      
      if (this.holdingPaper) return;
      
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.touchCount = e.touches.length;
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
      
      if (this.touchCount === 2) {
        this.rotating = true;
        this.initialRotation = this.rotation;
        this.initialPinchDistance = this.getPinchDistance(e);
      }
    });

    // Touch end event
    paper.addEventListener('touchend', (e) => {
      this.holdingPaper = false;
      
      if (e.touches.length === 0) {
        this.rotating = false;
        this.touchCount = 0;
      } else if (e.touches.length === 1) {
        // Switch from rotate to move if one finger remains
        this.touchCount = 1;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.prevTouchX = this.touchStartX;
        this.prevTouchY = this.touchStartY;
      }
    });

    // Prevent context menu on long press
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  handleMove(e, paper) {
    if (!this.holdingPaper) return;
    
    this.touchMoveX = e.touches[0].clientX;
    this.touchMoveY = e.touches[0].clientY;
    
    this.velX = this.touchMoveX - this.prevTouchX;
    this.velY = this.touchMoveY - this.prevTouchY;
    
    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;
    
    this.prevTouchX = this.touchMoveX;
    this.prevTouchY = this.touchMoveY;

    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }

  handleRotate(e, paper) {
    if (!this.holdingPaper || !this.rotating) return;
    
    const currentDistance = this.getPinchDistance(e);
    const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    
    // Calculate rotation angle
    const deltaX1 = e.touches[0].clientX - centerX;
    const deltaY1 = e.touches[0].clientY - centerY;
    const angle = Math.atan2(deltaY1, deltaX1) * (180 / Math.PI);
    
    this.rotation = this.initialRotation + angle;
    
    // Update position based on pinch center movement
    if (this.initialPinchDistance > 0) {
      const scale = currentDistance / this.initialPinchDistance;
      // You can add scale transformation here if needed
    }
    
    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }

  getPinchDistance(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// Initialize all papers
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

// Add some CSS to make it work better on mobile
const style = document.createElement('style');
style.textContent = `
  .paper {
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }
  
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    touch-action: none;
  }
`;
document.head.appendChild(style);
