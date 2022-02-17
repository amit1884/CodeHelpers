import Router from 'next/router';
import { getIsServer } from '~/utils/common';
import { getDashboardData } from '~/api';
import { checkRedirection } from './checkRedirection';
import { isEmpty } from 'lodash';

const BASE_URL = process.env.NEXT_PUBLIC_CD_BASE;

const getToken = (ctx) => {
  const { token } = ctx.store.getState().authentication;
  if (getIsServer()) {
    if (!token) {
      ctx.res.writeHead(301, {
        Location: '/login',
      });
      ctx.res.end();
      ctx.res.finished = true;
      return {};
    }
  } else if (!token) {
    setTimeout(() => {
      Router.push('/login');
    }, 0);
  }

  return token;
};

const dashboardInitialProps = async (ctx, silo) => {
  const { asPath, query } = ctx;
  const { step = 1 } = query;
  const [URL] = asPath.split('?'); // to remove query params
  const stepQuery = step > 1 || (asPath.includes('/get-pending-applications') && query.step == 1 ) ? `?step=${step}` : '';
  const processedURL = URL.charAt(0) === '/' ? URL.substring(1, URL.length) + stepQuery : URL + stepQuery;
  const token = getToken(ctx);
  let obj = {};
  if (processedURL === 'dashboard/download-application' && query.q) {
    obj = {
      "status": 301,
      "target": `${BASE_URL}${processedURL}?q=${query.q}`,
    };
  }

  const data = !isEmpty(obj) ? obj : await getDashboardData(processedURL, token);
  const pageName = "Dashboard";
  const articleRedirection = checkRedirection(data);
  const errorCode = data.status > 200 ? data.status : false;

  if (articleRedirection) return articleRedirection;
  return {
    data, pageName, articleRedirection, errorCode, silo,
  };
};

export default dashboardInitialProps;
