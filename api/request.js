import fetch from 'isomorphic-unfetch';
import isEmpty from 'lodash/isEmpty';
import cookie from 'js-cookie';
import { createQueryString, createMultiPartFormData } from '~/utils';

// status codes
export const STATUS_CODES = {
  OK: 200,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,

};

//   Parse the json
const parseJSON = async (response) => {
  try {
    const res = await response.json();
    return res;
  } catch (e) {
    // console.log("invalid non json response", e);
    return {};
  }
};

// Method to set and get the header options

const getRequestOptions = (token = '', method, contentType = 'application/json', formData = '', additionalHeaders) => {
  let options = {
    method,
    cache: 'no-cache',
    timeout: 30 * 1000,
  };
  // if method is post, send the data in options
  if (method == 'POST') {
    options = {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        // Authorization: `Basic ZGV2LXNlcnZlcjpDb2xEdW5pYUAxMjM=`,
        Accept: 'application/json',
        'Content-Type': contentType,
        // "cookie": `collDunia=${token}`
      },
      // credentials: 'include',
      body: formData,
    };
  }
  // if methods is get and token is not empty , set authorization header
  else if (method == 'GET') {
    if (token) {
      options = {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': contentType,
        },
        // credentials: 'include'
      };
    }
  }

  if (additionalHeaders) {
    options.headers = { ...options.headers, ...additionalHeaders };
  }
  if (contentType === 'multipart/form-data') {
    delete options.headers['Content-Type'];
  }
  return options;
};

// Make form data according to method type i.e, GET or POST
const makeFormdata = (additionalData, methodType, contentType = 'application/json') => {
  let formData = '';
  if (methodType == 'GET') {
    if (!isEmpty(additionalData)) {
      formData = createQueryString(additionalData);
    }
  } else if (methodType == 'POST') {
    if (contentType == 'application/x-www-form-urlencoded') {
      // formData = new FormData();
      formData = createQueryString(additionalData);
    } else if (contentType == 'application/json') {
      formData = JSON.stringify(additionalData);
    } else if (contentType === 'multipart/form-data') {
      formData = createMultiPartFormData(additionalData);
    }
  }
  return formData;
};

// Method to handle the errors

const handleResponse = async (withStatusCode = false, response) => {
  if (withStatusCode) {
    let resposeCode;
    try {
      resposeCode = response.status;
    } catch (e) {
      resposeCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
    // console.log("dsasdsa",response.status);
    if (response.status >= STATUS_CODES.OK && response.status <= STATUS_CODES.MOVED_PERMANENTLY) {
      return { statusCode: resposeCode, data: await parseJSON(response) };
    }
    return { statusCode: resposeCode, data: {} };
  }

  if (response.status >= STATUS_CODES.OK && response.status < STATUS_CODES.MULTIPLE_CHOICES) {
    const data = await parseJSON(response);
    return data;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;

  // const resp = await checkStatus(response);
  // return parseJSON(resp);
};

// Method for get request
// const isProd = process.env.NODE_ENV === 'production';
// const buff = Buffer.from('dev-server:ColDunia@123');
// const base64data = buff.toString('base64');
// const base64data = 'ZGV2LXNlcnZlcjpDb2xEdW5pYUAxMjM='; // for all developers it is same base64(dev-server:ColDunia@123)

const getMethod = async (url = '', additionalData = {}, token = '', withStatusCode = false, headerOptions = {}) => {
  // console.log(url);
  let formData = makeFormdata(additionalData, 'GET'); // Make form data from the user data
  formData = formData ? `?${formData}` : formData;

  // if (!isProd) {
  //   headerOptions['Authorization'] = `Basic ${base64data}`;
  // }

  try {
    const requestOptions = getRequestOptions(token, 'GET', 'application/json', '', headerOptions); // Get the header options

    const response = await fetch(`${url}${formData}`, requestOptions); // Fetch request to get the response from server

    const result = await handleResponse(withStatusCode, response); // Handling errors

    return result;
  } catch (error) {
    console.log('request failed-------------------->', error);
    return withStatusCode ? { statusCode: 500, data: {} } : {};
  }
};

// Method for post request

const postMethod = async (url = '', additionalData = {}, contentType = 'application/json', token = '', headerOptions) => {
  // console.log(`post request sent to ${url} with data ${JSON.stringify(additionalData)}`);

  // if request is client side get token from cookie if it is server side it must be passed
  if (token == '' && cookie.get(process.env.NEXT_PUBLIC_LOGIN_COOKIE)) {
    token = cookie.get(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  }

  const formData = makeFormdata(additionalData, 'POST', contentType); // Make form data from the user data
  try {
    const requestOptions = getRequestOptions(token, 'POST', contentType, formData, headerOptions);
    const response = await fetch(`${url}`, requestOptions); // Fetch request to get the response from server
    const resp = await handleResponse(false, response); // Check the response status

    return resp; // Sending the result
  } catch (error) {
    console.log('request failed', error);
    return {};
  }
};

const fileUpload = async (url, data, token) => {
  if (token == '' && cookie.get(process.env.NEXT_PUBLIC_LOGIN_COOKIE)) {
    token = cookie.get(process.env.NEXT_PUBLIC_LOGIN_COOKIE);
  }

  const options = {
    method: 'POST',
    body: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    return response.json();
  } catch (error) {
    console.log('request failed', error);
    return {};
  }
};

export const apiRequest = {
  get: getMethod,
  post: postMethod,
  upload: fileUpload,
};
