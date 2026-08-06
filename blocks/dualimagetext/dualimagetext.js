/**
 * loads and decorates the dual image text block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const [imageCell, eyebrowCell, headingCell, qrCell] = [...block.firstElementChild.children];

  const backgroundPicture = imageCell?.querySelector('picture');
  const qrPicture = qrCell?.querySelector('picture');

  const content = document.createElement('div');
  content.className = 'dualimagetext-content';

  if (eyebrowCell?.textContent.trim()) {
    eyebrowCell.className = 'dualimagetext-eyebrow';
    content.append(eyebrowCell);
  }

  if (headingCell?.textContent.trim()) {
    headingCell.className = 'dualimagetext-heading';
    content.append(headingCell);
  }

  if (qrPicture) {
    const qrWrapper = document.createElement('div');
    qrWrapper.className = 'dualimagetext-qr';
    qrWrapper.append(qrPicture);
    content.append(qrWrapper);
  }

  block.innerHTML = '';

  if (backgroundPicture) {
    const backgroundWrapper = document.createElement('div');
    backgroundWrapper.className = 'dualimagetext-background';
    backgroundWrapper.append(backgroundPicture);
    block.append(backgroundWrapper);
  }

  if (content.children.length) block.append(content);
}
