import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import createSlider from '../../scripts/slider.js';

function setCarouselItems(number) {
  document.querySelector('.carousel > ul')?.style.setProperty('--items-per-view', number);
}

// backgroundImage, text, style, ctaLabel, ctaStyle, ctaLink
const CARD_COLUMNS = 6;

export default function decorate(block) {
  let i = 0;
  setCarouselItems(2);
  const slider = document.createElement('ul');
  const leftContent = document.createElement('div');

  // Find the first row index that should be a carousel item
  let carouselStartIndex = -1;
  [...block.children].forEach((row, index) => {
    if (row.children.length === CARD_COLUMNS && carouselStartIndex === -1) {
      carouselStartIndex = index;
    }
  });

  if (carouselStartIndex === -1) {
    carouselStartIndex = 4;
  }

  [...block.children].forEach((row) => {
    if (i >= carouselStartIndex) {
      const li = document.createElement('li');
      const styleDiv = row.children[2];
      const styleParagraph = styleDiv?.querySelector('p');
      const cardStyle = styleParagraph?.textContent?.trim() || 'default';
      if (cardStyle && cardStyle !== 'default') {
        li.className = cardStyle;
      }

      const ctaLabel = row.children[3]?.querySelector('p')?.textContent?.trim() || '';
      const ctaStyle = row.children[4]?.querySelector('p')?.textContent?.trim() || 'link';
      const ctaLink = row.children[5]?.querySelector('a[href]')?.getAttribute('href') || '';

      moveInstrumentation(row, li);
      while (row.firstElementChild) li.append(row.firstElementChild);

      [...li.children].forEach((div, index) => {
        if (index === 0) {
          div.className = 'cards-card-image';
        } else if (index === 1) {
          div.className = 'cards-card-body';
        } else {
          // style, ctaLabel, ctaStyle, ctaLink: config fields, not rendered directly
          div.className = 'cards-config';
          const p = div.querySelector('p');
          if (p) {
            p.style.display = 'none';
          }
        }
      });

      if (ctaLink) {
        const cardBody = li.querySelector('.cards-card-body');
        const buttonContainer = document.createElement('p');
        buttonContainer.className = `button-container ${ctaStyle}`;
        const link = document.createElement('a');
        link.href = ctaLink;
        link.className = 'button';
        link.textContent = ctaLabel || ctaLink;
        buttonContainer.append(link);
        cardBody?.append(buttonContainer);
      }

      slider.append(li);
    } else {
      const hasImage = row.querySelector('img') || row.querySelector('picture');
      if (!hasImage) {
        if (row.firstElementChild?.firstElementChild) {
          leftContent.append(row.firstElementChild.firstElementChild);
        }
        if (row.firstElementChild) {
          const first = row.firstElementChild.firstElementChild;
          if (first) leftContent.append(first);
        }
        leftContent.className = 'default-content-wrapper';
      }
    }
    i += 1;
  });

  slider.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  const base = parseInt(block?.dataset?.headingLevel, 10);
  const ariaLevel = Number.isFinite(base) ? Math.min(Math.max(base, 1) + 1, 6) : 3;
  slider.querySelectorAll('h4,h5,h6').forEach((node) => {
    node.setAttribute('role', 'heading');
    node.setAttribute('aria-level', String(ariaLevel));
  });

  block.textContent = '';
  block.parentNode.parentNode.prepend(leftContent);
  block.append(slider);
  createSlider(block);
}
