// resource for handling cookies taken from here:
// https://github.com/carlos-peru/next-with-api/blob/master/lib/session.js

import cookie from 'js-cookie';

const domainName = process.env.NEXT_PUBLIC_DOMAIN;
export const setCookie = (key, value, days = 1, domain = domainName) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: days,
      path: '/',
      domain,
    });
  }
};

export const removeCookie = (key, options = { expires: 1 }) => {
  if (process.browser) {
    cookie.remove(key, { ...options, path: '/', domain: domainName });
  }
};

export const getCookie = (key, req) => (process.browser
  ? getCookieFromBrowser(key)
  : getCookieFromServer(key, req));

export const getCookieFromBrowser = (key) => cookie.get(key);

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split('=')[1];
};
