const theGameButton = document.querySelector('#the-game');
console.log(theGameButton);
theGameButton.addEventListener('click', e => {
  renderAboutGamePage();
});

const cancelButton = document.querySelector('.nav-mobile_section.cancel-button');
cancelButton.addEventListener('click', e => {
  renderSectionNames();
  renderNavMobile();
  renderArticles();
  renderBackgrounds();

});

function renderAboutGamePage() {
  renderSectionNames();
  renderNavMobile();
  renderArticles();
  renderBackgrounds();

}
function renderSectionNames() {
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => {
    if (hasDisplayNoneClass(header)) {
      header.classList.remove('display-none');
    } else {
      header.classList.add('display-none');
    }
  });
 
}

function renderNavMobile() {
  const navMobile = document.querySelectorAll('.nav-mobile img');
  navMobile.forEach(nav => {
    renderVisibility(nav);
  });
}

function renderArticles() {
  const articles = document.querySelectorAll('.article');
  console.log(articles);
  articles.forEach(article => {
    renderVisibility(article);
  });
  const sectionGame = document.querySelector('.section_game');
  sectionGame.classList.forEach(className => {
    if (className === 'section__open') {
      sectionGame.classList.remove('section__open');
    } else {
      sectionGame.classList.add('section__open');
    }
  });

}

function renderBackgrounds() {
  const backgrounds = document.querySelectorAll('.bg div');
  backgrounds.forEach(background => {
    renderVisibility(background);
  });
  const bg = document.querySelector('.bg');
  let hasWOTBackground = false;
  bg.classList.forEach(className => {
    if (className === 'bg-game_wot') {
      hasWOTBackground = true;
    }
  });
  if (hasWOTBackground) {
    bg.classList.remove('bg-game_wot');
  } else {
    bg.classList.add('bg-game_wot');
  }
  
}

function hasDisplayNoneClass(node) {
  let hasDisplayNone = false;
  node.classList.forEach(className => {
    if (className === 'display-none') {
      hasDisplayNone = true;
    }
  });
  return hasDisplayNone;
}

function renderVisibility(node) {
  if (hasDisplayNoneClass(node)) {
    node.classList.remove('display-none');
  } else {
    node.classList.add('display-none');
  }
}

