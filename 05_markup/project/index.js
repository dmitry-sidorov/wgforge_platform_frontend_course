const sections = document.querySelectorAll('section');
const tank = document.getElementById('tank');
const turret = document.getElementById('turret');
for (let section of sections) {
  section.addEventListener('mouseenter', event => {
    const turretDirection = event.target.dataset.turretDirection;

    turret.classList.add(`tank_turret__${turretDirection}`);
    console.log(turret.classList);
  });
}

const tank_2 = document.getElementById('tank2');

let lastPos = 0;
let lastScrollTop = 0;
section[0].addEventListener('scroll', event => {
  let curretTop = event.targer.scrollTop;
  let diff = currentTop - lastScrollTop;

  tank_2.style.transform = translate();
});