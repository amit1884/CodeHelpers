import { UrlGenPossibleLocations } from '~/utils/checkSaPage';

const urlFormatter = (val) => `/${val.replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase()}`;
const stringFormatter = (val) => val ? val.replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase() : val;

const collegeTabs = ['admission', 'courses-fees', 'reviews', 'department', 'cutoff', 'placement', 'ranking', 'gallery', 'scholarship', 'faculty', 'affiliated-colleges', 'news', 'hostel'];

const urlGenerator = {
  examLink(link) {
    link = urlFormatter(link);
    return `${link}`;
  },
  courseLink(link) {
    link = urlFormatter(link);
    return `${link}`;
  },
  courseDir(name = '', silo = '') {
    if (name) {
      name = stringFormatter(name);
    }
    if (silo) {
      silo = stringFormatter(silo);
      if (silo === 'overview') {
        silo = '';
      }
    }
    const pathName = '/courses/[course]';
    if (silo == '') {
      return { pathname: pathName, query: { course: name } };
    }
    return { pathname: pathName, query: { course: name, silo } };
  },

  examDir(name, silo = '') {
    name = stringFormatter(name);
    // name = `${name}-exam`;
    if (silo) {
      silo = stringFormatter(silo);
      if (silo === 'overview') {
        silo = '';
      }
    }

    let pathName;
    switch (silo) {
      // case "news":
      //   pathName = "/exam/news"
      //   break;
      default:
        pathName = '/exams/[exam]';
        break;
    }
    if (silo == '') {
      return { pathname: pathName, query: { exam: name } };
      //   return "/[exam]";
    }
    return { pathname: pathName, query: { exam: name, silo } };

    // return "/[exam]";
  },
  examNewsDir(link) {
    const url = `/news/${link}`;
    const match = link.match(/^e-(?<id>\d+)-.+/);

    const pathname = '/news/e-[slug]';
    let examId = '';
    if (match) {
      const {
        groups: { id },
      } = match;
      examId = id;
    }
    return { pathname, query: { examId, url } };
  },
  examNewsLink(link) {
    link = urlFormatter(link);
    return `/news${link}`;
  },
  collegeDir(collegeType, name = '', silo = '') {
    if (name) {
      name = stringFormatter(name);
    }
    if (silo) {
      silo = stringFormatter(silo);
      if (silo === 'home') {
        silo = '';
      }
    }
    let pathName = `/${collegeType || 'college'}/[college]`;
    const collegeId = name.split('-')[0];
    if (silo == '') {
      return { pathname: pathName, query: { college: name, collegeType, collegeId } };
    }
    const otherSilo = silo.split('?')[0];
    if (collegeTabs.includes(otherSilo)) {
      pathName += `/${otherSilo}`;
      if(subSilo){
        pathName+=`/${subSilo}`;
      }
    } else {
      pathName += '/[tab]';
    }
    return {
      pathname: pathName,
      query: {
        college: name, collegeType, silo, collegeId,
      },
    };
  },
  authorDir() {
    return '/author/[author]';
  },
  authorLink(link) {
    link = urlFormatter(link);
    return `${link}`;
  },
  newsDir() {
    return '/news/[news]';
  },
  gNewsDir() {
    return '/news/g-[news]';
  },
  newsLink(link) {
    link = urlFormatter(link);
    return `${link}`;
  },
  collegeLink(link) {
    link = urlFormatter(link);
    return `${link}`;
  },
  collegeDir(collegeType, name = '', silo = '', subSilo = '') {
    if (name) {
      name = stringFormatter(name);
    }
    if (silo) {
      silo = stringFormatter(silo);
      if (silo === 'home') {
        silo = '';
      }
    }
    let pathName = `/${collegeType || 'college'}/[college]`;
    const collegeId = name.split('-')[0];

    if (silo == '') {
      return { pathname: pathName, query: { college: name, collegeType, collegeId } };
    }
    const otherSilo = silo.split('?')[0];
    if (collegeTabs.includes(otherSilo)) {
      pathName += `/${otherSilo}`;
      if(silo=== 'cutoff' && subSilo){
        pathName += `/[silo]`;
      }
    } else {
      pathName += '/[tab]';
    }
    return {
      pathname: pathName,
      query: {
        college: name, collegeType, silo, collegeId,
      },
    };
  },

  nicheArticleDir(name = '', silo = '') {
    const pathName = '/[studyabroad]/article/[specificarticles]';
    return { pathname: pathName };
  },
  saLinkDir(shortForm = '', silo = '') {
    const tabs = silo.toLowerCase();

    const possibleConstantTabs = [
      'programs',
      'admission',
      'ranking',
      'gallery',
      'reviews',
      'news',
      'scholarship',
      'job-opportunities',
      'hostel',
      'acceptance-rate',
    ];

    if (possibleConstantTabs.includes(tabs)) {
      return `/[studyabroad]/college/[college]/${tabs}`;
    }
    if (tabs == 'home') {
      return '/[studyabroad]/college/[college]';
    }
    return '/[studyabroad]/college/[college]/[tabs]';
  },
  saDir(splitUrl) {
    if (splitUrl[1] == 'college') {
      const possibleConstantTabs = [
        'programs',
        'admission',
        'ranking',
        'gallery',
        'reviews',
        'news',
        'scholarship',
        'job-opportunities',
        'hostel',
        'acceptance-rate',
      ];

      if (possibleConstantTabs.includes(splitUrl[3])) {
        return `/[studyabroad]/college/[college]/${splitUrl[3]}`;
      }
      if (splitUrl[3]) {
        return '/[studyabroad]/college/[college]/[tabs]';
      }
      return '/[studyabroad]/college/[college]';
    }
    if (splitUrl[1] == 'article') {
      return '/[studyabroad]/article/[specificarticles]';
    }
    if (splitUrl[1] == 'reviews') {
      return '/[studyabroad]/reviews/[specificreviews]';
    }
    if (splitUrl.length < 2 && PossibleLocations.includes(splitUrl[0])) {
      return '/[studyabroad]';
    }
  },
  instituteDir(name = '', silo = '') {
    if (name) {
      name = stringFormatter(name);
    }
    if (silo) {
      silo = stringFormatter(silo);
      if (silo == 'info') {
        silo = '';
      }
    }
    const pathName = '/institute/[institute]';
    if (silo == '') {
      return { pathname: pathName, query: { institute: name } };
    }
    return { pathname: `${pathName}/${silo}`, query: { institute: name } };
  },

  scholarshipDir(url) {
    if (url && url.includes('-') && (/[0-9]/gm).test(url.split('-')[0])) {
      return '/scholarship/[singlepage]';
    }
    if (url && url.includes('page-') && url.startsWith('page-')) {
      return '/scholarship/[singlepage]';
    }
    return '/scholarship';
  },

};

/**
 * @description  to get the page directory from next js pages folder.
 * @param {string} url - could be relative url or abolsute url.
 * @returns {boolean|object} - if absolute url return false
 *                             else {pathname, query}
 */

const PossibleLocations = UrlGenPossibleLocations;
export const getPageDir = (url) => {
  const isAbosluteUrl = /https?:\/\/.+/.test(url);

  if (isAbosluteUrl) return false;
  // const splitUrl = url.split("/");
  const splitUrl = url.split('?')[0].split('/');
  if (PossibleLocations.includes(splitUrl[0])) {
    if (splitUrl[1] === 'scholarship') {
      const path = `/[studyabroad]${urlGenerator.scholarshipDir(splitUrl[2])}`;
      return path;
    }
    const path = urlGenerator.saDir(splitUrl);
    return path;
  }
  if (splitUrl[0] === 'scholarship') {
    const path = urlGenerator.scholarshipDir(splitUrl[1]);
    return path;
  }
  if (splitUrl[0] == 'exams') {
    const path = urlGenerator.examDir(splitUrl[1], splitUrl[2]);
    return path;
  } if (splitUrl[0]=="news") {
    if(splitUrl[1].indexOf("e-")==0)
    {
      return { pathname: "/news/e-[slug]", query: {url:"/"+url} };
    } 
    if(splitUrl[1].indexOf("c-")==0){
      return {pathname : '/news/c-[slug]', query:{college: splitUrl[1].substr(2) }};
    }
    
      return false;
    
  } if(splitUrl[0]=='college' || splitUrl[0]=='university'){
    let path = urlGenerator.collegeDir(splitUrl[0], splitUrl[1], splitUrl[2],splitUrl[3]);
    return path;
  }

  if(splitUrl[0]=='course' || splitUrl[0] == 'courses'){
    let path = urlGenerator.courseDir(splitUrl[1],splitUrl[2]);
    return path;
  }
  if(splitUrl[0]=='college' || splitUrl[0]=='university'){
    let path = urlGenerator.collegeDir(splitUrl[0], splitUrl[1], splitUrl[2],splitUrl[3]);
    return path;
  }
  if(splitUrl[0]=='admission'){
    return { pathname: '/admission', query: { url: "/"+url}}
  } 
  if(splitUrl[0]=="reviews"){
    if(splitUrl[1]){
      return "/reviews/[review]";
    }
      return "/reviews";
    
  }
  if (splitUrl[0]=="reviews") {
    if (splitUrl[1]) {
      return '/reviews/[review]';
    }
    return '/reviews';
  }

  if (splitUrl[0] == 'institute') {
    const path = urlGenerator.instituteDir(splitUrl[1], splitUrl[2]);
    return path;
  }

  if (splitUrl[0] == 'qna') {
    if (splitUrl[2]) {
      return '/qna/question/[question]';
    } if (splitUrl[1]) {
      return '/qna/page-[pageNo]';
    }
    return '/qna';
  }

  if (splitUrl[0] == 'comparison') {
    return { pathname: '/comparison/[article]', query: { url } };
  }

  if (splitUrl[0] === 'author') {
    return { pathname: '/author' };
  }

  if (splitUrl[0] == 'social') {
    if (splitUrl[1]) {
      return { pathname: '/social/[id]' };
    }
    return { pathname: '/social' };
  }
  if (splitUrl[0] === 'common-application-form') {
    return '/common-application-form';
  }
  if (splitUrl[0] === 'caf-college') {
    return '/caf-college/[college]';
  }

  return false;
};
export default urlGenerator;
