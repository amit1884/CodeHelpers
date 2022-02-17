const loadScript = (scriptId,scriptUrl,callback) => {
    const existingScript = document.getElementById(scriptId);
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.id = scriptId;
      document.body.appendChild(script);
      script.onload = () => { 
        if (callback) callback();
      };
    }
    if (existingScript && callback) callback();
  };

export default loadScript;