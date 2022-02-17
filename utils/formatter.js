// select every link which doesn't start with prepp.in or collegedunia.com
const externalLinkReg = /<a.*?href="https?:\/\/(?!(www\.)?(prepp\.in|collegedunia\.com)).+?>(.+?)<\/a>/g;

/**
 * @param {string} content - could be html or simple text.
 * @returns {string} replace all anchor tag with its content/text only
 */
export function removeExternalLink(content) {
  // replacing anchor tag content with its innerText only
  return content ? content.replace(externalLinkReg, '$3') : ''; // $3 means 3rd group in regex
}