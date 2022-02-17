// when query params comes in data
export function Base64(data, isServer = false) {
  const urlParams = new URLSearchParams(data);
  const entries = urlParams.entries(); // returns an iterator of decoded [key,value] tuples
  const params = paramsToObject(entries);
  const paramsString = JSON.stringify(params);
  // console.log(paramsString,params);
  let base64data = '';
  if (isServer) {
    const buff = eval('Buffer').from(paramsString);
    base64data = buff.toString('base64');
  } else {
    base64data = btoa(paramsString);
  }
  return base64data;
}

function paramsToObject(entries) {
  const result = {};
  for (const [key, value] of entries) {
    // each 'entry' is a [key, value] tupple
    result[key] = value;
  }
  return result;
}

// when object comes in data
export function convertDataToBase64String(data, isServer = false) {
  const paramsString = JSON.stringify(data);
  // console.log(paramsString,params);
  let base64data = '';
  if (isServer) {
    const buff = eval('Buffer').from(paramsString);
    base64data = buff.toString('base64');
  } else {
    base64data = btoa(paramsString);
  }
  return base64data;
}

