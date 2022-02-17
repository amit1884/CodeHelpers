import { checkRedirection } from "~/utils/checkRedirection";
import { getArticleData } from "~/api";
import { availableLang, lastPathWithoutLang } from "./languages";
import { has, isEmpty } from "lodash";
import { setLangData } from "~/rdx/actions/langAction";
import { Base64 } from "./base64";
import { getIsServer } from "./common";


export default async function getArticlesInitialProps(ctx) {
  const { asPath, query: { news: silo = "" } } = ctx;
  const [URL] = asPath.split('?'); // to remove query params
  const processedURL = URL.charAt(0) === '/' ? URL.substring(1) : URL;
  let responseApi;

  if(availableLang(ctx.asPath, ctx.pathname)){
    let lang = availableLang(ctx.asPath, ctx.pathname);
    const lastItem = lastPathWithoutLang(ctx.asPath, ctx.pathname);
    const encoded = Base64(`language_code=${lang}`, getIsServer());
    const apiUrl = `${ctx.asPath.split('/')[1]}/${lastItem}?data=${encoded}`;
    responseApi = await getArticleData(apiUrl)
  } else {
    responseApi = await getArticleData(processedURL);
  }

  const lang = responseApi && has(responseApi, 'data.news_language') && !isEmpty(responseApi.data.news_language) ? responseApi.data.news_language.substring(0, 2).toLowerCase() : '';
  ctx.store.dispatch(setLangData({lang:lang}));

  const articleData = responseApi.data;
  const pageName = articleData.page_name;
  const articleRedirection = checkRedirection(articleData);
  const errorCode = articleData.status > 200 ? articleData.status : false;

  if (articleRedirection) {
    return articleRedirection;
  }
  return { articleData, errorCode, silo, pageName, pathname: URL, lang };
}