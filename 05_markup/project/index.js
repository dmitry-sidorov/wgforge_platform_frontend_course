const body = document.querySelector('body');
const sections = document.querySelectorAll('section');
const turret = document.getElementById('turret');
const movingTank = document.getElementById('movingTank');

body.addEventListener('click', event => {
  body.classList.add('toggle');
});

for (let section of sections) {
  section.addEventListener('mouseenter', event => {
    const directionSelector = event.target.dataset.turretDirection;
    const lastIndex = turret.classList.length - 1;
    const previousDirection = turret.classList[lastIndex];
    const currentDirection = `tank_turret__${directionSelector}`;
    if (previousDirection !== currentDirection) {
      if (turret.classList.length > 1) {
        turret.classList.remove(previousDirection);
      }
      turret.classList.add(currentDirection);
    }
  });
}

let lastScrollTop = 0;
sections[0].addEventListener('scroll', event => {
  let currentTop = event.target.scrollTop;
  let diff = currentTop - lastScrollTop;
  let diffCorrected = currentTop - lastScrollTop - 1020;
  let duration = Math.round(diff / 50) / 10;
  movingTank.style.transform = `translateX(${diffCorrected}px)`;
  movingTank.style.transition = `transform ${duration}s ease`;
});