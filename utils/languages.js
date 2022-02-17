export const languageCode = [
  'hi', 'ur', 'as', 'bn', 'bh', 'gu', 'kn', 'ks', 'ml', 'mr', 'sa', 'ta', 'te', 'pa', 'en'
];

export const availableLang = (url, route='') => {
  let lang = '';
  let urlArray = url.split('/');
  const items = urlArray[urlArray.length-1].split('-');
  let language = '';

  if(route == '/news/[news]'){
    let firstPart = items.slice(0, items.length-2);
     language = firstPart[firstPart.length - 1];
  } else {
     language = items[items.length - 1];
  }

  if(languageCode.includes(language)){
    lang = language;
  }
  return lang;
}

export const lastPathWithoutLang = (url, route='') => {
  let path = '';
  let urlArray = url.split('/');
  const items = urlArray[urlArray.length-1].split('-');

  if(route == '/news/[news]'){
    let firstPart = items.slice(0, items.length-2).slice(0, -1);
    let lastPart = items.slice(items.length-2);
    path = [...firstPart, ...lastPart].join('-');
  } else {
    path = items.slice(0, -1).join('-');
  }
  return path;
}
