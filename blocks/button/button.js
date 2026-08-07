import { moveInstrumentation } from '../../scripts/scripts.js';

const STYLES = ['link', 'primary-button', 'secondary-button', 'dark-button'];

// authors may fill label/link/style either as three separate rows or as
// three columns of a single row, so drill down through single-child
// wrappers until each field's own leaf element (p or a) is reached
function getFieldLeaves(block) {
  const leaves = [];
  const collect = (el) => {
    const kids = [...el.children];
    if (kids.length === 0) {
      leaves.push(el);
    } else if (kids.length === 1) {
      collect(kids[0]);
    } else {
      kids.forEach(collect);
    }
  };
  [...block.children].forEach(collect);
  return leaves;
}

/**
 * loads and decorates the button block
 * @param {Element} block The button block
 */
export default function decorate(block) {
  const firstRow = block.children[0];
  const [labelEl, linkEl, styleEl] = getFieldLeaves(block);

  const label = labelEl?.textContent?.trim() || '';
  const href = (linkEl?.tagName === 'A' ? linkEl.getAttribute('href') : linkEl?.querySelector('a')?.getAttribute('href'))
    || linkEl?.textContent?.trim()
    || '';
  const style = styleEl?.textContent?.trim().toLowerCase() || 'primary-button';

  const link = document.createElement('a');
  link.className = `button ${STYLES.includes(style) ? style : 'primary-button'}`;
  link.href = href || '#';
  link.textContent = label || href;
  if (firstRow) moveInstrumentation(firstRow, link);

  block.textContent = '';
  block.append(link);
}
