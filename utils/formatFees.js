const formatFees = (value, localeString = 'en-US') => {
  let formattedCurrency = Number(value);
  formattedCurrency = formattedCurrency.toLocaleString(localeString);
  return formattedCurrency;
};

export default formatFees;
