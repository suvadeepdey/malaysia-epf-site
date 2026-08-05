import {
  loadCSS,
} from './aem.js';

loadCSS(`${window.hlx.codeBasePath}/styles/slider.css`);

// Handling Next / Previous Arrow Image
function arrowIcon(props) {
  const icon = document.createElement('img');
  icon.src = `${window.hlx.codeBasePath}/icons/${props}.svg`;
  icon.alt = `${props}`;
  icon.loading = 'lazy';
  icon.dataset.iconName = `${props}`;
  return icon;
}

// Handling Anchor Tag
function arrow(props) {
  const p = document.createElement('p');
  p.className = 'button-container';
  const anchor = document.createElement('button');
  anchor.className = `button ${props}`;
  anchor.title = `${props}`;
  anchor.type = 'button';
  anchor.append(arrowIcon(props));
  p.append(anchor);
  return p;
}

// Builds the pagination dots shown above the slider
function dots(itemList) {
  const ol = document.createElement('ol');
  ol.className = 'carousel-dots';
  itemList.forEach((item, index) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Go to slide ${index + 1}`);
    if (index === 0) button.classList.add('active');
    li.append(button);
    ol.append(li);
  });
  return ol;
}

export default async function createSlider(block) {
  const nextBtn = 'next';
  const prevBtn = 'prev';
  const itemList = [...block.querySelectorAll(':scope > ul > li')];
  const dotsList = dots(itemList);
  block.append(dotsList);
  block.append(arrow(`${nextBtn}`));
  block.append(arrow(`${prevBtn}`));

  // Call function after page load, scoped to this carousel instance
  const moveRightBtns = block.querySelectorAll(`.${nextBtn}`);
  const moveLeftBtns = block.querySelectorAll(`.${prevBtn}`);
  const dotButtons = [...dotsList.querySelectorAll('button')];
  const observerOptions = {
    rootMargin: '0px',
    threshold: 0.25,
  };

  function moveDirection(carousel, itemWidth, option) {
    const carouselItems = carousel.querySelector('ul');
    carouselItems.style.transition = 'all 0.5s ease-in-out';
    if (option === '+') {
      carouselItems.style.transform = `translateX(-${itemWidth}px)`;
      setTimeout(() => {
        carouselItems.style.transition = 'none';
        carouselItems.style.transform = 'translateX(0)';
        carouselItems.scrollLeft += itemWidth;
      }, 500);
    } else {
      carouselItems.style.transform = `translateX(${itemWidth}px)`;
      setTimeout(() => {
        carouselItems.style.transition = 'none';
        carouselItems.style.transform = 'translateX(0)';
        carouselItems.scrollLeft -= itemWidth;
      }, 500);
    }
  }

  // Button Event Handler
  moveLeftBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const carousel = btn.closest('.carousel-container').querySelector('.carousel');
      const carouselItems = carousel.querySelector('ul');
      const totalItems = carouselItems.children.length || 1;
      const itemWidth = parseInt(carouselItems.scrollWidth / totalItems, 10);
      moveDirection(carousel, itemWidth, '-');
    }, true);
  });

  moveRightBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const carousel = btn.closest('.carousel-container').querySelector('.carousel');
      const carouselItems = carousel.querySelector('ul');
      const totalItems = carouselItems.children.length || 1;
      const itemWidth = parseInt(carouselItems.scrollWidth / totalItems, 10);
      moveDirection(carousel, itemWidth, '+');
    }, true);
  });

  // Dot Event Handler
  dotButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const carousel = btn.closest('.carousel-container').querySelector('.carousel');
      const carouselItems = carousel.querySelector('ul');
      const totalItems = carouselItems.children.length || 1;
      const itemWidth = parseInt(carouselItems.scrollWidth / totalItems, 10);
      carouselItems.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
    });
  });

  // Observer Callback Function
  const callBack = (entries) => {
    const dir = document.documentElement.dir || 'ltr';

    entries.forEach((entry) => {
      const { target } = entry;
      target.style.transition = 'opacity 0.3s ease-in-out';
      if (entry.intersectionRatio >= 0.25) {
        target.classList.remove('opacity');
        target.classList.add('active');
      } else {
        target.classList.remove('active');
        target.classList.add('opacity');
      }
    });

    const items = itemList;
    const isFirstActive = items[0]?.classList.contains('active');
    const isLastActive = items[items.length - 1]?.classList.contains('active');
    const disableLeftBtn = dir === 'rtl' ? isLastActive : isFirstActive;
    const disableRightBtn = dir === 'rtl' ? isFirstActive : isLastActive;

    moveLeftBtns.forEach((btn) => { btn.disabled = disableLeftBtn; });
    moveRightBtns.forEach((btn) => { btn.disabled = disableRightBtn; });

    const activeIndex = items.findIndex((item) => item.classList.contains('active'));
    dotButtons.forEach((btn, index) => {
      btn.classList.toggle('active', index === activeIndex);
    });
  };

  // Create Observer instance
  const observer = new IntersectionObserver(callBack, observerOptions);

  // Apply observer on each item
  itemList.forEach((item) => {
    observer.observe(item);
  });
}
