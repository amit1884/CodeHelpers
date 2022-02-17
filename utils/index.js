import { useState } from 'react';
import has from 'lodash/has';

export const isObject = (obj) => obj !== null && typeof obj === 'object';

export function setNestedObjectValues(object, value, visited = new WeakMap(), response = {}) {
  for (const k of Object.keys(object)) {
    const val = object[k];
    if (isObject(val)) {
      if (!visited.get(val)) {
        visited.set(val, true);
        response[k] = Array.isArray(val) ? [] : {};
        setNestedObjectValues(val, value, visited, response[k]);
      }
    } else {
      response[k] = value;
    }
  }
  return response;
}

export function useMergeState(initialState) {
  const [state, setState] = useState(initialState);
  const setMergedState = (newState) => setState((prevState) => ({ ...prevState, ...newState }));
  return [state, setMergedState];
}

export function shuffleArray(array) {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/*
`gobble`, given a positive, non-zero `limit`, deletes
characters from the beginning of `haystack` until `needle` has
been encountered and deleted `limit` times or no more instances
of `needle` exist; then it returns what remains. If `limit` is
zero or negative, delete from the beginning only until `-(limit)`
occurrences or less of `needle` remain.
>2x faster than a RegExp or split solution
*/
export function gobble(haystack, needle, limit = 0) {
  let remain = limit;
  if (limit <= 0) { // set remain to count of delim - num to leave
    let i = 0;
    while (i < haystack.length) {
      const found = haystack.indexOf(needle, i);
      if (found === -1) {
        break;
      }
      remain++;
      i = found + needle.length;
    }
  }

  let i = 0;
  while (remain > 0) {
    const found = haystack.indexOf(needle, i);
    if (found === -1) {
      break;
    }
    remain--;
    i = found + needle.length;
  }
  return haystack.slice(i);
}

export function createQueryString(obj, rules = {}, params = []) {
  const { hasOwnProperty } = Object.prototype;

  if (!isObject(obj)) {
    return '';
  }

  for (const property in obj) {
    if (hasOwnProperty.call(obj, property)) {
      const value = obj[property];
      if (isObject(value) && (Array.isArray(value) === false)) {
        createQueryString(value, rules, params);
      } else if (rules.removeEmptyKeys) {
        if (value !== '' && (Array.isArray(value) === false)) {
          params.push(`${encodeURIComponent(property)}=${encodeURIComponent(value)}`);
        } else if (value.length > 0) {
          params.push(`${encodeURIComponent(property)}=${encodeURIComponent(value)}`);
        }
      } else {
        params.push(`${encodeURIComponent(property)}=${encodeURIComponent(value)}`);
      }
    }
  }
  return params.join('&');
}

export function deepEqual(object1, object2, options = {}) {
  function compareNonObjectsValues(p1, p2) {
    if (options.strictEquality) {
      return p1 !== p2;
    }
    return p1 != p2;
  }

  if (!object1 || !object2) {
    return false;
  }

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2, options)
      || !areObjects && compareNonObjectsValues(val1, val2)
    ) {
      return false;
    }
  }

  return true;
}

export function isAbsolutePath(url) {
  const result = /https?:\/\/.+/.test(url);
  return result;
}

export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom
      <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * @description  to get the silo on second position for SSR case.
 * @param {array} menu - could be array of object.
 * @param {string} silo - could be string.
 * @returns {array} - return array in which selected silo object is at second position
 */
export function formatNavLinks(menu = [], silo) {
  let selectedIndex = 0;
  const navLinks = menu;
  for (let i = 0; i < navLinks.length; i++) {
    if (has(navLinks[i], 'links')) {
      for (let j = 0; j < navLinks[i].links.length; j++) {
        if (navLinks[i].links[j].silo === silo) {
          selectedIndex = i;
          break;
        }
      }
    } else if (navLinks[i].silo === silo) {
      selectedIndex = i;
      break;
    }
  }
  if (silo && silo !== 'overview' && selectedIndex) {
    const selectedSilo = navLinks[selectedIndex];
    navLinks[selectedIndex] = { ...navLinks[1] };
    navLinks[1] = { ...selectedSilo };
  }
  return navLinks;
}
export function formatQueryStringToObject(url) {
  let queryParams = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    const params = queryString.split('&');
    params.forEach((param) => {
      const key = param.split('=')[0];
      const value = param.split('=')[1];
      queryParams = {
        ...queryParams,
        [key]: value,
      };
    });
  }
  return queryParams;
}
export function cropText(text, length) {
  return (text?.length > length) ? `${text?.substring(0, length)}...` : text;
}

export function createMultiPartFormData(data = {}) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
}
