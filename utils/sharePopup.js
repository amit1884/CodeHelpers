export default function showSharePopup(e, href) {
  // console.log(href);

  if (e) e.preventDefault();
  window.open(
    href,
    'ShareWindow',
    `height=450, width=550, top=${
      (screen.height - 296) / 2
    }, left=${
      (screen.width - 580) / 2
    }, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`,
  );
}
