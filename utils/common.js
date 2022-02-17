export function fixedFirstName(name, limit) {
  let firstName;
  if (name) {
    firstName = name.split(' ')[0];
  } else {
    firstName = "";
  }
  if (firstName.length > limit) {
    return firstName.slice(0, limit);
  } else {
    return firstName;
  }
}

export function getIsServer() {
  return typeof window === 'undefined';
}

export function capitalizeFirstLetter(string) {

  return string.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

export function resizeImage(path, width = null, height = null) {

    return imageGumletResize(path, width, height);
    // return imageKitResize(path, width, height);

  
}

function imageGumletResize(path, width = null, height = null) {
  if (width && height) {
    return `${path}?w=${width}&h=${height}&mode=stretch`;
  } else if (width) {
    return `${path}?w=${width}`;
  } else if (height) {
    return `${path}?h=${width}`;
  } else {
    return path;
  }
}


function imageKitResize(path, width = null, height = null) {
  if (width && height) {
    return `${path}?tr=w-${width},h-${height},c-force`;
  } else if (width) {
    return `${path}?w=${width}`;
  } else if (height) {
    return `${path}?h=${width}`;
  } else {
    return path;
  }
}


export default function generateLeadData(source, source_page, college = {}, course = {},
  others = {}, msg = '') {

  let params = {
      'lead_type': source,
      'source': source_page
  }
  const imagePathCollege = process.env.NEXT_PUBLIC_IMAGE_PATH_COLLEGE;

  if (others) {
      ['stream_id','exam_id','level','is_new_leadform'].map((fieldName)=>{
          if(others[fieldName]){
              params[fieldName] = others[fieldName];
          }
      })
 
      if (others['exam_data']) {
          let exam_data = others['exam_data'];
          params['exam_id'] = exam_data['exam_id'];
          if (exam_data['entrance_name']) {
              params['leadSubtitle'] = exam_data['entrance_name'];
          }
          if (exam_data['logo']) {
              params['leadImage'] = resizeImage(`${imagePathCollege}images/logos/${exam_data['logo']}`, 70, 70);
          }
      }
  }

  if (msg){
      params['msg'] = msg;
  }
      
  return params;
}


export function osHandler(){
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
  }
  if (/android/i.test(userAgent)) {
      return "Android";
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
  }
  return "unknown";
}

export function replaceCharAt(string, replaceChar, index) {
  return string.substr(0, index) + replaceChar + string.substr(index + 1);
}

export function maxLen(str, len) {
  if (str.length > len) return `${str.substr(0, len)}...`;
  return str;
}

export function addIteminIndex(arr, item, index = null) {
  const newArr = [...arr];
  if (!index || index >= newArr.length) {
    newArr.push(item);
  } else {
    newArr[index] = item;
  }

  return newArr;
}