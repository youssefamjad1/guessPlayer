document.addEventListener('DOMContentLoaded', function () {
    // Function to create a single firework
    function createFirework() {
      const firework = document.createElement('div');
      firework.className = 'firework';
      document.body.appendChild(firework);
  
      // Randomize starting position
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
  
      firework.style.left = startX + 'px';
      firework.style.top = startY + 'px';
  
      // Use Anime.js for complex animation
      anime({
        targets: firework,
        translateY: -window.innerHeight,
        easing: 'easeInOutQuad',
        duration: 1500,
        complete: function () {
          firework.remove();
        },
      });
    }
  
    // Function to create multiple fireworks
    function createFireworks() {
      for (let i = 0; i < 10; i++) {
        createFirework();
      }
    }
  
    // Trigger fireworks when the page is loaded
    if (document.getElementById('celebrationMessage')) {
      createFireworks();
    }
  });
  