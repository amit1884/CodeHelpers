const formatAmount = (val) => {
  val.split('.')[1] == '00' ? val = val.split('.')[0] : val;
  return val;
};

export function currencyFormat(num){
    var val = Math.abs(num)
    if (val >= 10000000) {
      let amount = (val / 10000000).toFixed(2);
      val = formatAmount(amount) + ' Cr';
    } else if (val >= 100000) {
      let amount = (val / 100000).toFixed(2);
      val = formatAmount(amount) + ' L';
    } else if (val >= 1000) {
      let amount = (val / 1000).toFixed(2);
        val = formatAmount(amount) + ' K';
    } 
    return val;
  }

 export function currencyFormatInWords(num){
    var val = Math.abs(num)
    if (val >= 10000000) {
      val = (val / 10000000).toFixed(2) + ' Crore';
    } else if (val >= 100000) {
      val = (val / 100000).toFixed(2) + ' Lakhs';
    } else if (val >= 1000) {
        val = (val / 1000).toFixed(2) + ' K';
    } 
    return val;
  }

  export function commaSaperatedCurrency(num){
   return (Number(num)).toLocaleString();
  }  

  export function currencyFormatInWordsSingleDecimal(num){
    var val = Math.abs(num)
    if (val >= 10000000) {
      val = (val / 10000000).toFixed(1) + ' Crore';
    } else if (val >= 100000) {
      val = (val / 100000).toFixed(1) + ' Lakhs';
    } else if (val >= 1000) {
        val = (val / 1000).toFixed(1) + ' K';
    } 
    return val;
  }