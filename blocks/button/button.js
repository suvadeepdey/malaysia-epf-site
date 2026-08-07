import { moveInstrumentation } from '../../scripts/scripts.js';

const STYLES = ['link', 'primary-button', 'secondary-button', 'dark-button'];

/**
 * loads and decorates the button block
 * @param {Element} block The button block
 */
export default function decorate(block) {
  const [labelRow, linkRow, styleRow] = [...block.children];

  const label = labelRow?.textContent?.trim() || '';
  const href = linkRow?.querySelector('a')?.getAttribute('href') || linkRow?.textContent?.trim() || '';
  const style = styleRow?.textContent?.trim() || 'primary-button';

  const link = document.createElement('a');
  link.className = `button ${STYLES.includes(style) ? style : 'primary-button'}`;
  link.href = href || '#';
  link.textContent = label || href;
  if (labelRow) moveInstrumentation(labelRow, link);

  block.textContent = '';
  block.append(link);
}
