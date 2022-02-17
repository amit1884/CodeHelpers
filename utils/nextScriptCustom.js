// https://medium.com/medwing-engineering-product-design/hacking-next-js-for-better-pagespeed-scores-6c651d19f218
import { compact, flatten } from 'lodash';

import { NextScript } from 'next/document';

class NextScriptCustom extends NextScript {
  render() {
    const orgNextScripts = flatten(super.render()?.props.children);

    const scripts = compact(
      orgNextScripts?.map((child) => {
        if (child && child.props && child.props.id === '__NEXT_DATA__') {
          return {
            props: { ...child.props },
            content: child.props.dangerouslySetInnerHTML.__html
          };
        }

        if (child && child.type === 'script') {
          return {
            props: { ...child.props },
            content: ''
          };
        }

        return null;
      })
    );

    const initialFilterer = props => !props.src || !props.src.includes('chunk');
    // const preloadFilterer = props => props.src && /pages|webpack|main|framework|commons/.test(props.src);
    const initialLoadScripts = scripts?.filter(({ props }) => initialFilterer(props));
    const chunkedScripts = scripts?.filter(({ props }) => !initialFilterer(props));
    // const preloadScripts = chunkedScripts.filter(({ props }) => preloadFilterer(props));
    // const nonPreloadScripts = chunkedScripts.filter(({ props }) => !preloadFilterer(props));

    const jsContent = `
      var chunkedScripts = ${JSON.stringify(chunkedScripts)};
      setTimeout(() => {
        chunkedScripts.map((script) => {
          if (!script || !script.props) return;
          try {
            var scriptTag = document.createElement('script');
  
            scriptTag.src = decodeURI(script.props.src);
            scriptTag.noModule = script.props.noModule;
            scriptTag.async = script.props.async;
            scriptTag.defer = script.props.defer;
            
            if (script.props.id) scriptTag.id = script.props.id;
            if (script.content) scriptTag.innerHTML = script.content;
            document.body.appendChild(scriptTag);
          }
          catch(err) {
            console.log(err);
          }
        });
      // 1800ms seems like when PageSpeed Insights stop waiting for more js       
      }, 1800);
    `;

    return (
      <>
        {
          initialLoadScripts.map(({ props }, index) => (
            <script key={`script_${index}`} {...props} src={props.src} />
          ))
        }

        <script id="__NEXT_SCRIPT_CUSTOM" defer dangerouslySetInnerHTML={{ __html: jsContent }} />

      </>
    );
  }
}

export default NextScriptCustom;