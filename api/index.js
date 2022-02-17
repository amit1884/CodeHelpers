import { getCookieFromBrowser } from '~/utils/cookie';
import { apiRequest } from './request';
// // const BASE_URL = "https://api.myjson.com/bins/";
// const BASE_URL = "http://localhost:4000/";
// // const BASE_URL = "http://192.168.103.165:4000/";
// // const CD_URL = "https://stage2.collegedunia.com/edapi/";
// const CD_URL = "http://192.168.103.80/edapi/";
// const BIN_URL = "https://api.myjson.com/bins/";
// const CD_URL_ATUL = "http://192.168.102.213";
// // zlq0c
// // //home page
// // export const UPCOMING_EXAMS_URL = `${BASE_URL}tdobw`;
// // export const GROUPS_MENU_URL = `${BASE_URL}ufw3o`;
// // // export const ALL_EXAMS_URL = `${BASE_URL}c1mfy`;
// // // https://api.myjson.com/bins/ru3py
// // export const MENU_URL = `${BASE_URL}ru3py`;

// // // https://api.myjson.com/bins/c1mfy

// // const API_CMS_ROOT = process.env.REACT_APP_CMS_API_ROOT;

// const BASE_URL = "http://localhost:4000/";

// const CD_URL = "https://stage2.collegedunia.com/edapi/";
let BASE_URL = process.env.NEXT_PUBLIC_EXAMDUNIA_SSR_URL;
const CLIENT_URL = process.env.NEXT_PUBLIC_EXAMDUNIA_URL;
let CD_URL = process.env.NEXT_PUBLIC_CD_SSR_URL;
const CLIENT_CD_URL = process.env.NEXT_PUBLIC_CD_URL;
const CD_BASE = process.env.NEXT_PUBLIC_CD_BASE;
const CD_API = process.env.NEXT_PUBLIC_WEB_API_URL;
const CD_ADS_URL = process.env.NEXT_PUBLIC_ADS_URL;
const CLIENT_API_BASE = process.env.NEXT_PUBLIC_API_BASE;
// let API_BASE = process.env.NEXT_PUBLIC_API_BASE_SSR;
const LEADFORM_DIR = process.env.NEXT_PUBLIC_LEADFORM_DATA_DIRECTORY;
let WEB_API_URL = process.env.NEXT_PUBLIC_WEB_API_SSR_URL;
const CLIENT_WEB_API_URL = process.env.NEXT_PUBLIC_WEB_API_URL;
const NEXT_BASE_HREF = process.env.NEXT_PUBLIC_BASE_URL;
const LEADFORM_JSON_URL = process.env.NEXT_PUBLIC_IMAGE_HOST;
export const updateBaseUrl = () => {
  BASE_URL = CLIENT_URL;
  CD_URL = CLIENT_CD_URL;
  WEB_API_URL = CLIENT_WEB_API_URL;
  // API_BASE = CLIENT_API_BASE;
};
// let token = null;

// const config = (options = {}) => ({
//   method: options.method || 'GET',
//   headers: {
//     Authorization: `Bearer ${options.token || token}`,
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
//   timeout: 30 * 1000,
//   cache: 'no-cache',
//   body: JSON.stringifyoptions.params
// });

// global
export const getGlobalData = () => apiRequest.get(`${BASE_URL}globaldata`);

// home page
export const getGlobalNotification = () => apiRequest.get(`${CD_URL}fetchglobalnotifications`);
export const getHomePageData = () => apiRequest.get(`${BASE_URL}homepage`);

// single exam
export const getSingleExamPageData = (examName) => apiRequest.get(`${BASE_URL}exams/${examName}`);
export const getNotification = (data) => apiRequest.post(`${CD_BASE}notification/fetch-notification`, data, 'application/x-www-form-urlencoded');

// lead
export const getLeadForm = (token) => apiRequest.get(`${BASE_URL}c/lead-form`, {}, token);
export const leadClick = (data, url, headerOptions) => apiRequest.post(`${CD_BASE}auth/${url}`, data, 'application/x-www-form-urlencoded', '', headerOptions);
export const submitLeadForm = (data, headerOptions) => apiRequest.post(`${CD_BASE}auth/capture-lead`, data, 'application/x-www-form-urlencoded', '', headerOptions);
export const submitLoanLeadForm = (data, headerOptions) => apiRequest.post(`${CD_BASE}auth/capture-loan-lead`, data, 'application/x-www-form-urlencoded', '', headerOptions);
export const submitPartialLeadForm = (data, url, headerOptions) => apiRequest.post(`${CD_BASE}auth/${url}`, data, 'application/x-www-form-urlencoded', '', headerOptions);
export const submitSaLeadForm = (data, headerOptions) => apiRequest.post(`${CD_BASE}auth/sa-capture-lead`, data, 'application/x-www-form-urlencoded', '', headerOptions);
export const submitInstituteLeadForm = (data, headerOptions) => apiRequest.post(`${CD_BASE}auth/institute-capture-lead-api`, data, 'application/x-www-form-urlencoded', '', headerOptions);
export const submitRpLeadForm = (data, headerOptions) => apiRequest.post(`${CD_BASE}auth/capture-exam-rp-lead`, data, 'application/x-www-form-urlencoded', '', headerOptions);
export const submitLeadFormStep = (url,data, headerOptions) => apiRequest.post(`${url}`, data, 'application/x-www-form-urlencoded', '', headerOptions);
export const getSelectSearch = (url) => apiRequest.get(`${WEB_API_URL}nc/${url}`);
// news
export const getSingleExamNewsData = (newsSlug, withStatusCode) => apiRequest.get(`${BASE_URL}news/${newsSlug}`, {}, '', withStatusCode);
export const getNewsHomeData = (params = {}) => {
  const { pageNo, type, isMobile } = params;
  let URL = `${WEB_API_URL}news`;
  if (type) { URL = `${URL}/${type}`; }
  if (type === 'exams') { URL = `${WEB_API_URL}exams/news`; }
  if (pageNo) { URL = `${URL}/page-${pageNo}`; }
  if (isMobile) { URL = `${URL}?mobile=true`; }
  return apiRequest.get(URL);
};

// comments
export const getPageComments = (data, token) => apiRequest.post(`${CD_URL}getcomments`, data, 'application/x-www-form-urlencoded', token);
export const getPaginatedComment = (data) => apiRequest.post(`${CD_URL}get-comment-for-page`, data, 'application/x-www-form-urlencoded');
export const followComment = (followType, commentId, token) => apiRequest.post(`${CD_URL}follow-comment`, { follow_type: followType, comment_id: commentId }, 'application/x-www-form-urlencoded', token);
export const addComment = (data) => apiRequest.post(`${CD_URL}insert-comment`, data, 'application/x-www-form-urlencoded');
export const addFirstComment = (data) => apiRequest.post(`${CD_URL}insert-first-comment`, data, 'application/x-www-form-urlencoded');
export const addReply = (data, token) => apiRequest.post(`${CD_URL}post-reply`, data, 'application/x-www-form-urlencoded', token);

// auth
export const userLogin = (credentials) => apiRequest.post(`${CD_BASE}auth/login`, credentials, 'application/x-www-form-urlencoded');
export const getUserData = (token, withStatusCode, headers) => apiRequest.get(`${CD_URL}col-user`, {}, token, withStatusCode, headers);
export const register = (data) => apiRequest.post(`${CD_BASE}auth/register`, data, 'application/x-www-form-urlencoded');
export const updateRegister = (data, headerOptions) => apiRequest.post(`${CD_BASE}auth/update-register`, data, 'application/x-www-form-urlencoded', '', headerOptions);
export const forgotPassword = (email) => apiRequest.post(`${CD_BASE}auth/reset-password`, email, 'application/x-www-form-urlencoded');
export const userLogout = (token) => apiRequest.post(`${CD_BASE}auth/logout`, { is_ajax: 1 }, 'application/x-www-form-urlencoded', token);

// author
export const getSingleAuthorData = (authorData, query) => apiRequest.get(`${WEB_API_URL}author/${authorData}`, query);

// search
export const globalSearch = (query) => apiRequest.get(`${CD_URL}search`, query);

// ads
export const getAdsData = (query) => apiRequest.get(`${CD_ADS_URL}${query}`);

// export const getGlobalData = () => apiRequest.get("ru3py");

// // export const getGlobalNotification = () => apiRequest.get(`${BIN_URL}zlq0c`);

// listing
export const listingData = (query) => apiRequest.get(`${BASE_URL}news/${query}`);
export const notificationListing = (query) => apiRequest.post(`${CD_URL}notification-listing`, query, 'application/x-www-form-urlencoded');

// collegedunia

// exam

export const getExamCategoryData = () => apiRequest.get(`${BASE_URL}c/nge/exams`);
// exam listing

export const getExamsListingData = (query) => apiRequest.get(`${BASE_URL}c/nge/exams/${query}`, {}, '', true);
export const getPreppGuidesData = (query) => apiRequest.get(`${BASE_URL}c/prepp-guide/collegedunia/${query}`, {}, '', true);

export const getSingleExamNews = (query) => apiRequest.get(`${BASE_URL}c${query}`);

export const getExamsListingFilteredData = (query, data) => apiRequest.post(`${BASE_URL}nc/nge/exams/${query}`, data);
export const submitUserRank = (examId, data) => apiRequest.post(`${BASE_URL}nc/nge/exams/${examId}/rank-predictor/predict`, data);
export const fetchFilterData = (examId, data) => apiRequest.post(`${BASE_URL}nc/nge/exams/${examId}/rank-predictor/listing/filters`, data);
export const fetchCollgeList = (examId, data) => apiRequest.post(`${BASE_URL}nc/nge/exams/${examId}/rank-predictor/listing/data`, data);
// singleexam
export const getSingleExamTabData = (examId, silo, withStatusCode) => apiRequest.get(`${BASE_URL}c/nge/exams/${examId}/${silo}`, {}, '', withStatusCode);

export const userFormData = (query) => apiRequest.post(`${CD_BASE}email-subscribe/insert-to-subscribe-news-letter`, query, 'application/x-www-form-urlencoded');

// download
export const sendAppLink = (query) => apiRequest.get(`${CD_BASE}/auth/send-app-link?phone_no=${query}&banner=newheaderbanner&link=http://onelink.to/k3jxtm`);

// search

export const getExamSearchData = (query) => apiRequest.get(`${BASE_URL}nc/nge/search/exams`, query);
export const getGlobalSearchData = (query) => apiRequest.get(`${CD_BASE}global-search?term=${query}`);
export const getSaSearchData = (countryID, searchType, query) => apiRequest.get(`${CD_BASE}e-search/autocomplete-sb?search_type=${searchType}&countryId=${countryID}&term=${query}`);

// want to know more form
export const knowMoreFormData = (query) => apiRequest.post(`${BASE_URL}nc/nge/survey/feedback`, query);

// notification
export const updateNotificationImpression = (data) => apiRequest.post(`${CD_BASE}notification/update-view-port-impression`, data, 'application/x-www-form-urlencoded');
export const notificationClickImpression = (data) => apiRequest.post(`${CD_BASE}notification/update-click-count`, data, 'application/x-www-form-urlencoded');

// college admission
export const getCollegeAdmission = (query) => apiRequest.get(`${WEB_API_URL}${query}`, {}, '', true, { 'Api-request': true });

// colleges
export const getCollegeData = (query) => apiRequest.get(`${WEB_API_URL}${query}`, {}, '', true, { 'Api-request': true });
export const getCoursesData = (query) => apiRequest.get(`${WEB_API_URL}nc/college/course-search${query}`, {}, '', true, { 'Api-request': true });
export const saveMissingInfo = (query) => apiRequest.post(`${CD_BASE}auth/edit-info`, query);
export const sendVote = (data) => apiRequest.post(`${CD_BASE}qna/vote`, data, 'application/x-www-form-urlencoded');
export const reportQnaData = (data) => apiRequest.post(`${CD_BASE}qna/report`, data, 'application/x-www-form-urlencoded');

// Coursehomepage
export const getCourseHomepageData = () => apiRequest.get(`${WEB_API_URL}courses`, {}, '', false, { 'Api-Request': true });
export const getCourseSearchData = (query) => apiRequest.get(`${CD_BASE}course-manager/search-courses?term=${query}`, {}, '', false);

// To test the redirection logic .Make sure to inlcude withStatusCode = true in your api hit.
// Refer about.js page to view this api hit in action.
// Refer _app.js file to check the logic behind

// missing info api
export const sendMissingInfo = (data) => apiRequest.post(`${CD_BASE}auth/edit-info`, data, 'application/x-www-form-urlencoded');
// course page data
export const getCourseData = (query) => apiRequest.get(`${WEB_API_URL}courses/${query}`, {}, '', true, { 'Api-request': true });
export const getCourseDataWithSilo = (course, silo) => apiRequest.get(`${WEB_API_URL}courses/${course}/${silo}`, {}, '', true, { 'Api-request': true });

// OTP handler
export const sendOTP = (data) => apiRequest.post(`${CD_BASE}auth/request-otp`, data, 'application/x-www-form-urlencoded');
export const verifyOTP = (data) => apiRequest.post(`${CD_BASE}auth/otp-verification`, data, 'application/x-www-form-urlencoded');

// Admission Homepage data
export const getAdmissionData = (query, data) => apiRequest.get(`${WEB_API_URL}${query}`, data, 'application/x-www-form-urlencoded');
export const getAdmissionSearchData = (query) => apiRequest.get(`${WEB_API_URL}admission/search-admission-college?term=${query}`);

// institute page data
export const getInstituteData = (query) => apiRequest.get(`${WEB_API_URL}institute/${query}`, {}, '', false, { 'Api-request': true });
export const getInstituteDataWithSilo = (institute, silo, data) => apiRequest.get(`${WEB_API_URL}institute/${institute}/${silo}`, data, '', false, { 'Api-request': true });

// social
export const getSocialData = (url) => apiRequest.get(`${WEB_API_URL}${url}`);
export const getSocialSingleData = (query) => apiRequest.get(`${WEB_API_URL}social/${query}`);
export const updateClickSingleSocial = (query) => apiRequest.get(`${WEB_API_URL}social/${query}/updateClick`);
// lor / sop article api or news alert or global news
export const getArticleData = (url) => apiRequest.get(`${WEB_API_URL}${url}`, {}, '', true);

export const getCollegeListingData = (data, headers = {}) => apiRequest.get(`${WEB_API_URL}listing?data=${data}`, {}, '', false, headers);
export const getListingFilters = (data, headers = {}) => apiRequest.get(`${WEB_API_URL}${'listing-filters'}?data=${data}`, {}, '', false, headers);
export const getListingUrl = (data) => apiRequest.get(`${WEB_API_URL}${'listing-url'}?data=${data}`);

// studyabroad home page data
export const getSaHomePageData = (url) => apiRequest.get(`${WEB_API_URL}${url}/home`);

// studyabroad college data
export const getSaCollegeData = (query) => apiRequest.get(`${WEB_API_URL}${query}`, {}, '', true);
export const getSaProgramSearchData = (query) => apiRequest.get(`${WEB_API_URL}${query}`);
export const saReviewLikeDislike = (ajaxObj) => apiRequest.post(`${WEB_API_URL}nc/sa/like-dislike/reviews`, ajaxObj, 'application/x-www-form-urlencoded');
export const getSaReviewFilterData = (query) => apiRequest.get(`${WEB_API_URL}study-abroad/get-college-reviews?${query}`);
export const saProgramFiltersData = (query) => apiRequest.get(`${WEB_API_URL}${query}`);

// single review data
export const getReviewData = (url) => apiRequest.get(`${WEB_API_URL}${url}`, {}, '', true);

export const reviewLikeDislike = (query) => apiRequest.post(`${WEB_API_URL}nc/reviews/like-dislike`, query, 'application/x-www-form-urlencoded');

// reviews home page
export const getReviewsData = (query = '') => apiRequest.get(`${WEB_API_URL}reviews${query}`);
export const getCollegeSearchResult = (query = '') => apiRequest.get(`${CD_BASE}e-search/autocomplete?id=1&review_flag=1&type=college&term=${query}`);
export const getSingleIndiaReviewData = (url) => apiRequest.get(`${WEB_API_URL}${url}`, {}, '');
export const ReportFormData = (query) => apiRequest.post(`${WEB_API_URL}nc/reviews/report`, query, 'application/x-www-form-urlencoded');

// leadform data for institute
export const getInstituteLeadFormData = (filename) => fetch(`${process.env.NEXT_PUBLIC_LEADFORM_DATA_DIRECTORY}${filename}`).then((res) => res.json());
export const instituteReviewLikeDislike = (query) => apiRequest.post(`${WEB_API_URL}nc/institute/like-dislike`, query, 'application/x-www-form-urlencoded');

// studyabroad listing
// export const getSaCollegeListingData = (data, headers = {}) => apiRequest.get(`${WEB_API_URL}sa/listing?data=${data}`, {}, '', false, headers);
// export const getSaListingFilters = (data, headers = {}) => apiRequest.get(`${WEB_API_URL}sa/listing-filters?data=${data}`, {}, '', false, headers);
// export const getSaListingUrl = (data) => apiRequest.get(`${WEB_API_URL}sa/listing-url?data=${data}`);

// comparison data
export const getComparisonData = (url) => apiRequest.get(`${WEB_API_URL}${url}`);

// institute listing
export const getInstituteListingData = (data, headers = {}) => apiRequest.get(`${WEB_API_URL}listing-institute?data=${data}`, {}, '', false, headers);
export const getInstituteListingFilters = (data, headers = {}) => apiRequest.get(`${WEB_API_URL}listing-institute-filters?data=${data}`, {}, '', false, headers);
export const getInsituteListingUrl = (data) => apiRequest.get(`${WEB_API_URL}listing-institute-url?data=${data}`);

// leadform json file
export const getLeadFormData = (filename) => fetch(`${LEADFORM_JSON_URL}${LEADFORM_DIR}${filename}`).then((res) => res.json());

// Qna Data
export const getQnaData = (query = '') => apiRequest.get(`${WEB_API_URL}qna${query}`);
export const getQnaSingleData = (query = '') => apiRequest.get(`${WEB_API_URL}qna/question/${query}`);
export const sendQnaVote = (data) => apiRequest.post(`${WEB_API_URL}nc/qna/vote`, data, 'application/x-www-form-urlencoded');
export const getQnaSearchData = (query) => apiRequest.get(`${WEB_API_URL}nc/qna/question-search${query}`);
export const qnaFollowData = (data) => apiRequest.post(`${WEB_API_URL}nc/qna/follow`, data, 'application/x-www-form-urlencoded');
export const qnaReportData = (data) => apiRequest.post(`${WEB_API_URL}nc/qna/report`, data, 'application/x-www-form-urlencoded');
export const submitAnswerData = (query) => apiRequest.post(`${WEB_API_URL}nc/qna/submit`, query, 'application/x-www-form-urlencoded');
// studyabroad listing
export const getSaCollegeListingData = (data, headers = {}) => apiRequest.get(`${WEB_API_URL}listing-sa?data=${data}`, {}, '', false, headers);
export const getSaListingFilters = (data, headers = {}) => apiRequest.get(`${WEB_API_URL}listing-filters-sa?data=${data}`, {}, '', false, headers);
export const getSaListingUrl = (data) => apiRequest.get(`${WEB_API_URL}listing-url-sa?data=${data}`);


// write-review homepage data
export const getWriteReviewPageData = (data) => apiRequest.get(`${WEB_API_URL}nc/write-review`, data);
export const getWriteReviewLoginJSON = (q,token) => apiRequest.get(`${WEB_API_URL}nc/write-review/login-json${q}`,{},token);
export const getStepJson = (id, stepObj, token) => apiRequest.get(`${WEB_API_URL}nc/write-review/${id}`, stepObj, token);
export const getReviewExamSearch = (url) => apiRequest.get(`${WEB_API_URL}${url}`);
export const checkReferalCode = (data, token) => apiRequest.post(`${WEB_API_URL}nc/write-review/apply-referral`, data, 'application/x-www-form-urlencoded', token);
export const checkPhoneNoExists = (data) => apiRequest.post(`${WEB_API_URL}nc/write-review/check-user`, data, 'application/x-www-form-urlencoded');
export const getUploadDocs = (id, obj, token) => apiRequest.get(`${WEB_API_URL}nc/write-review/upload-document/${id}`, obj, token, true);
export const submitDocument = (obj, token) => apiRequest.post(`${WEB_API_URL}nc/write-review/submit-document`, obj, 'multipart/form-data', token);
export const updateDocument = (obj, token) => apiRequest.post(`${WEB_API_URL}nc/write-review/update-document`, obj, 'multipart/form-data', token);
export const registerAmbassador = (data, token) => apiRequest.post(`${WEB_API_URL}nc/write-review/register-ambassador`, data, 'application/x-www-form-urlencoded', token);

// write-review store temp review
export const storeTempReview = (obj, token) => apiRequest.post(`${WEB_API_URL}nc/write-review/store-temp`, obj, 'application/x-www-form-urlencoded', token);

// write-review search
export const writeReviewSearch = (obj) => apiRequest.get(`${WEB_API_URL}nc/write-review/get-ajax-data`, obj, 'application/x-www-form-urlencoded');
// education loam
export const getEducationLoanData = () => apiRequest.get(`${WEB_API_URL}education-loan`);
export const getSingleEducationData = (query) => apiRequest.get(`${WEB_API_URL}education-loan/${query}`);
export const getSingleBankData = (data) => apiRequest.get(`${WEB_API_URL}education-loan/addbanktocomparetable?data=${data}`);
export const userLoanData = (query) => apiRequest.post(`${WEB_API_URL}nc/education-loan/insertloansubscriber`, query, 'application/x-www-form-urlencoded');

// admission offers
export const getCollegesList = (query) => apiRequest.get(`${WEB_API_URL}nc/write-review/get-ajax-data?entity=college&q=${query}`);
export const getCitiesList = (query) => apiRequest.get(`${WEB_API_URL}nc/admission-offers/city-search?data=${query}`);

export const claimAdmissionPrize = (data) => apiRequest.post(`${WEB_API_URL}nc/admission-offers/submit`, data, 'multipart/form-data');
export const submitPartialData = (data) => apiRequest.post(`${WEB_API_URL}nc/admission-offers/partial-submit`, data, 'application/x-www-form-urlencoded');
export const verifyAttributionOtp = (data) => apiRequest.post(`${WEB_API_URL}nc/admission-offers/otp`, data, 'application/x-www-form-urlencoded');
export const resendAttributionOtp = (data) => apiRequest.post(`${WEB_API_URL}nc/admission-offers/resend-otp`, data, 'application/x-www-form-urlencoded');

// dashboard
export const changeProfilePicture = async (data) => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.upload(`${WEB_API_URL}nc/dashboard/update-profile`, data, token);
};

export const getDashboardData = (url, token) => apiRequest.get(`${WEB_API_URL}nc/${url}`, {}, token);

export const makeReviewAnonymous = (data) => apiRequest.post(`${WEB_API_URL}nc/review/update-reviews-anonymity-status`, data, 'application/x-www-form-urlencoded');

export const saveProfileInfo = (url, data) => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.post(`${WEB_API_URL}nc/${url}`, data, 'application/x-www-form-urlencoded', token);
};

export const searchColleges = (term) => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.get(`${WEB_API_URL}nc/common-application-form/search-college?q=${term}`, {}, token);
};

export const addToCart = (data) => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.post(`${WEB_API_URL}nc/common-application-form/add-to-cart`, data, 'application/x-www-form-urlencoded', token);
};

export const getCourseTag = () => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.get(`${WEB_API_URL}nc/dashboard/get-college-courses`, {}, token);
};

export const removeFromCart = (data) => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.post(`${WEB_API_URL}nc/dashboard/remove-from-cart`, data, 'application/x-www-form-urlencoded', token);
};

export const getCourseList = (collegeId, courseTag) => apiRequest.get(`${WEB_API_URL}nc/dashboard/get-courses?college_id=${collegeId}&course_tag=${courseTag}`);

export const addPassportPic = async (data) => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.upload(`${WEB_API_URL}nc/common-application-form/upload-file`, data, token);
};

export const submitCAF = (data) => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.post(`${WEB_API_URL}nc/dashboard/submit-caf`, data, 'application/x-www-form-urlencoded', token);
};

export const applyCouponApi = (data) => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.post(`${WEB_API_URL}nc/common-application-form/verify-coupon`, data, 'application/x-www-form-urlencoded', token);
};

export const blockUnblockUser = (data) => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.post(`${WEB_API_URL}nc/dashboard/block-unblock-user`, data, 'application/x-www-form-urlencoded', token);
};

export const paymentConfirmation = (data) => {
  const token = getCookieFromBrowser(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  return apiRequest.post(`${WEB_API_URL}nc/dashboard/payment-confirmation`, data, 'application/x-www-form-urlencoded', token);
};

// CAF Homepage
export const getCAFData = (query) => apiRequest.get(`${WEB_API_URL}common-application-form${query}`);
export const srchCAFCollege = (query) => apiRequest.get(`${WEB_API_URL}nc/common-application-form/search-college?q=${query}`);

// CAF Collegepage
export const getCAFCollegeData = (query) => apiRequest.get(`${WEB_API_URL}caf-college/${query}`);
// scholarship single api data and listing page data
export const getScholarshipSingleData = (url) => apiRequest.get(`${WEB_API_URL}${url}`, {}, '', true);

// export const getScholarshiplistingData = (url) => apiRequest.get(`${WEB_API_URL}${url}`,{},"",true);
export const getScholarshipFilterData = (data) => apiRequest.get(`${WEB_API_URL}scholarship?data=${data}`, {}, '', true);
// contact-us

export const submitContactUsForm = (data) => apiRequest.post(`${WEB_API_URL}nc/contact/contact-us`, data, 'application/x-www-form-urlencoded');

export const GetNPSUrl = (query, token) => apiRequest.get(`${CD_BASE}nps/get-banner${query}`, {}, token);
export const SaveNPSData = (data, token) => apiRequest.post(`${CD_BASE}nps/store-response`, data, 'application/x-www-form-urlencoded', token);
export const SaveTempNPSData = (data, token) => apiRequest.post(`${CD_BASE}nps/temp-store-response`, data, 'application/x-www-form-urlencoded', token);

// Rank predictor
export const getRankPredictorData = () => apiRequest.get(`${WEB_API_URL}rank-predictor`);
// Career page

export const CareerFormData = (data) => apiRequest.post(`${CD_BASE}auth/career-openings`, data, 'multipart/form-data');
