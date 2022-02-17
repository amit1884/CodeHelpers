// https://medium.com/medwing-engineering-product-design/hacking-next-js-for-better-pagespeed-scores-6c651d19f218

import { Head } from 'next/document';

class HeadCustom extends Head {
  // https://github.com/zeit/next.js/blob/d467e040d51ce1f8d2bf050d729677b6dd99cb96/packages/next/pages/_document.tsx#L187
  getCssLinks() {
    const { assetPrefix, files } = this.context;
    const cssFiles = files && files.length ? files.filter(f => /\.css$/.test(f)) : [];

    const cssLinkElements = [];
    cssFiles.forEach((file) => {
      cssLinkElements.push(
        <link
          key={file}
          nonce={this.props.nonce}
          rel="stylesheet"
          href={`${assetPrefix}/_next/${encodeURI(file)}`}
          crossOrigin={this.props.crossOrigin}
        />
      );
    });

    return cssLinkElements.length === 0 ? null : cssLinkElements;
  }

  getPreloadMainLinks(...args) {
    // const { assetPrefix, files } = this.context;
    // const jsFiles = files && files.length ? files.filter(f => /\.js$/.test(f)) : [];

    // const jsLinkElements = [];
    // jsFiles.forEach((file) => {
    //   jsLinkElements.push(
    //     <link
    //       key={file}
    //       nonce={this.props.nonce}
    //       rel="preload"
    //       href={`${assetPrefix}/_next/${encodeURI(file)}`}
    //       crossOrigin={this.props.crossOrigin}
    //       as="script"
    //     />
    //   );
    // });

    // return jsLinkElements.length === 0 ? null : jsLinkElements;
    return [];
  }

  getPreloadDynamicChunks() {
    return [];
  }
}

export default HeadCustom;
