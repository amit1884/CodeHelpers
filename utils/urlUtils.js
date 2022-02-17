export function removePageQuery(url = '') {
  if (/page=[1-9][0-9]*/g.test(url)) {
    if (/page=[1-9][0-9]*&/g.test(url)) {
      return url.replace(/page=[1-9][0-9]*&/g,'');
    }
    return url.replace(/page=[1-9][0-9]*/g,'');
  }
  return url;
}
