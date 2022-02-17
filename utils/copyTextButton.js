const CopyTextButton = (event) => {
  const { target } = event;
  if (target && target.tagName.toLowerCase() === 'button' && target.className.includes('js-cms-text-copy')) {
    const str = target.dataset.text;
    const newTabUrl = target.dataset.url;
    target.innerHTML = 'COPIED';
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    window.open(`${newTabUrl}`);
  }
};

export default CopyTextButton;
