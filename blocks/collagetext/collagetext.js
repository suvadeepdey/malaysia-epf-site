import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * loads and decorates the collage text block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'collagetext-list';

  [...block.children].forEach((row) => {
    const [imageDiv, categoryDiv, headingDiv, linkDiv, sizeDiv] = [...row.children];

    const li = document.createElement('li');
    const size = sizeDiv?.textContent?.trim() || 'size-medium';
    li.className = `collagetext-item ${size}`;
    moveInstrumentation(row, li);

    const picture = imageDiv?.querySelector('picture');
    if (picture) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'collagetext-item-image';
      imageWrapper.append(picture);
      li.append(imageWrapper);
    }

    const content = document.createElement('div');
    content.className = 'collagetext-item-content';

    if (categoryDiv?.textContent?.trim()) {
      categoryDiv.className = 'collagetext-item-category';
      content.append(categoryDiv);
    }

    if (headingDiv?.textContent?.trim()) {
      headingDiv.className = 'collagetext-item-heading';
      content.append(headingDiv);
    }

    li.append(content);

    const href = linkDiv?.querySelector('a')?.getAttribute('href');
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.className = 'collagetext-item-link';
      const label = headingDiv?.textContent?.trim() || categoryDiv?.textContent?.trim();
      if (label) link.setAttribute('aria-label', label);
      link.append(...li.children);
      li.append(link);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPicture.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPicture);
  });

  block.textContent = '';
  block.append(ul);
}
