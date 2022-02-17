const gaFilter = (type, filter, value) => {
  window.ga('send', 'event', filter, type, window.location.href, value, { nonInteraction: true });
};

export default gaFilter;
