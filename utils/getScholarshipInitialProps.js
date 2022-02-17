import { getScholarshipSingleData } from '~/api';
import { Base64 } from '~/utils/base64';
import { getIsServer } from '~/utils/common';
import { checkSaPage } from '~/utils/checkSaPage';
import { checkRedirection } from '~/utils/checkRedirection';

export default async function getScholarshipInitialProps(ctx) {
  let url = ctx.asPath.split('#')[0];

  if (url && /scholarship\/[0-9]+/gm.test(url)) {
    const responseAPI = await getScholarshipSingleData(url.substring(1));
    const response = responseAPI.data;
    const redirection = checkRedirection(response);
    if (redirection) {
      return redirection;
    }
    const errorCode = response.status > 200 ? response.status : false;
    return {
      response,
      errorCode,
      pageName: 'single_scholarship',
      layout: 'singlePage',
    };
  }

  const { query } = ctx;
  let page = [];
  if ('scholarshipUrl' in query && query.scholarshipUrl !== undefined) {
    page = query.scholarshipUrl.split('-');
  } else if ('singlepage' in query && query.singlepage !== undefined) {
    page = query.singlepage.split('-');
  }

  let countryName = checkSaPage(url);
  const getParams = url.split('?');

  let base64 = '';
  let params = '';
  if (getParams.length > 1) {
    params = getParams[1];
  }

  if (page.length > 1) {
    params = `${params !== '' ? `${params}&` : ''}page=${page[1]}`;
  }

  if (countryName && countryName !== 'study-abroad') {
    params = `${params !== '' ? `${params}&` : ''}country=${countryName}`;
  } else {
    countryName = '';
  }

  if (params !== '') {
    params = params.split('&').sort().join('&');
    base64 = Base64(params, getIsServer());
  }

  if (base64 !== '') {
    url = `scholarship?data=${base64}`;
  } else {
    url = 'scholarship';
  }
  const responseAPI = await getScholarshipSingleData(url);

  const response = responseAPI.data;
  const redirection = checkRedirection(response);
  if (redirection) {
    return redirection;
  }
  
  const errorCode = response.status > 200 ? response.status : false;
  return {
    response,
    errorCode,
    pageName: 'scholarship',
    countryName,
    layout: 'listing',
  };
}
