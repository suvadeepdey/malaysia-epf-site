/**
 * loads and decorates the dual image text block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const [imageRow1, eyebrowRow, headingRow, imageRow2] = [...block.children];

  const buildImageWrapper = (row, extraClass) => {
    const picture = row?.querySelector('picture');
    if (!picture) return null;
    const wrapper = document.createElement('div');
    wrapper.className = `dualimagetext-image ${extraClass}`;
    wrapper.append(picture);
    return wrapper;
  };

  const image1Wrapper = buildImageWrapper(imageRow1, 'dualimagetext-image-1');
  const image2Wrapper = buildImageWrapper(imageRow2, 'dualimagetext-image-2');

  const content = document.createElement('div');
  content.className = 'dualimagetext-content';

  const eyebrowCell = eyebrowRow?.querySelector(':scope > div');
  if (eyebrowCell?.textContent.trim()) {
    eyebrowCell.className = 'dualimagetext-eyebrow';
    content.append(eyebrowCell);
  }

  const headingCell = headingRow?.querySelector(':scope > div');
  if (headingCell?.textContent.trim()) {
    headingCell.className = 'dualimagetext-heading';
    content.append(headingCell);
  }

  block.innerHTML = '';
  if (image1Wrapper) block.append(image1Wrapper);
  if (content.children.length) block.append(content);
  if (image2Wrapper) block.append(image2Wrapper);
}
