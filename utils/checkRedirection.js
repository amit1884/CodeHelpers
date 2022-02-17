import { getPageDir } from "~/utils/urlGenerator";
export const checkRedirection = (response) => {
  if (response && response.status && response.status > 300 && response.status < 311) {
    let isAbsoluteUrl = /https?:\/\/.+/.test(response.target);
    return {
      response: {
        status: response.status,
        target: response.target,
        isAbsoluteUrl,
        pagePath: !isAbsoluteUrl ? getPageDir(response.target) : false
      },
    };
  }

  return false;
};
