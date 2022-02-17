export const ratingClass =(rating)=>{
  let className = '';
  let val = Number(rating);
  if(val>9) return className;
  else if(val<=9 && val>=8) return className+='light_1';
  else if(val<=8 && val>=7) return className+='light_2';
  else if(val<=7 && val>=6) return className+='light_3';
  else if(val<=6 && val>=5) return className+='light_4';
  else return className+='lightest';
}