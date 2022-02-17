import { getCookieFromBrowser, setCookie } from '~/utils/cookie';

const { WEB_VITALS_TRACKING_ID } = process.env;
const { TWA_TRACKING_ID } = process.env;
const { GA_TRACKING_ID } = process.env;

export const getGaTrackingId = (type = 'default') => {
  switch (type) {
    case 'web_vitals':
      return WEB_VITALS_TRACKING_ID;
    case 'default':
      return (typeof window !== 'undefined' && window.isTwa) ? TWA_TRACKING_ID : GA_TRACKING_ID;
    default:
      return (typeof window !== 'undefined' && window.isTwa) ? TWA_TRACKING_ID : GA_TRACKING_ID;
  }
};
export const getGaTrackingName = (type) => {
  switch (type) {
    case 'web_vitals':
      return 'devTracker';
    default:
      return '';
  }
};

// // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
// export const pageview = url => {
//   window.gtag('config', getGaTrackingId(), {
//     page_path: url,
//   })
//   window.gtag('config', getGaTrackingId('web_vitals'), {
//     page_path: url,
//   })
// }

// // https://developers.google.com/analytics/devguides/collection/gtagjs/events
// export const event = ({ action, category, label, value , nonInteraction= false, send_to}) => {
//   window.gtag('event', action, {
//     event_category: category,
//     event_label: label,
//     value: value,
//     non_interaction: nonInteraction,
//     send_to: getGaTrackingId(send_to)
//   })
// }

export const pageview = (url) => {
  window.ga('set', 'page', url);
  window.ga('send', 'pageview');

  let trackerName = getGaTrackingName('web_vitals');
  trackerName = trackerName ? `${trackerName}.` : '';
  window.ga(`${trackerName}set`, 'page', url);
  window.ga(`${trackerName}send`, 'pageview');
};

export const event = ({
  action, category, label, value, nonInteraction = false, send_to = '',
}) => {
  let trackerName = getGaTrackingName(send_to);
  trackerName = trackerName ? `${trackerName}.` : '';
  window.ga(`${trackerName}send`, 'event', {
    eventCategory: category,
    eventAction: action,
    eventLabel: label,
    eventValue: value,
    nonInteraction,
  });
};
export const leadBtnEvents = (label, action, value = '', category) => {
  action = isNaN(action) && action.replace(/ /g, '_');
  value = getGATrackingValue(category);
  window.ga('send', 'event', category, action, label, value, {
    nonInteraction: true,
  });
};
const getGATrackingValue = (eventCategory) => {
  let value = '';
  switch (eventCategory) {
    case 'Popup':
      value = getValueFromCookie('popupCount');
      break;
    case 'Lead':
      value = getValueFromCookie('applyCount');
      break;
    case '3fieldform_open':
      value = getValueFromCookie('miniLeadOpenCount');
      break;
    case '3fieldform_close':
      value = getValueFromCookie('miniLeadCloseCount');
      break;
    case '3fieldform_filled':
      value = getValueFromCookie('miniLeadApplyCount');
      break;
    default:
      break;
  }
  return value;
};
const getValueFromCookie = (cookieName) => {
  let trackingCookie = getCookieFromBrowser(cookieName);
  let count = 1;
  if (trackingCookie) {
    count = ++trackingCookie;
    setCookie(cookieName, count);
  } else {
    setCookie(cookieName, 1);
  }
  return count;
};
export const pageScroll = (slot) => {
  event({
    action: slot,
    category: 'pageScroll',
    label: null,
    value: null,
  });
};
export const triggerGaEventOnLeadBtn = (label, action, value = '', category) => {
  window.ga('send', 'event', category, action, label, value, {
    nonInteraction: true,
  });
};
