const loadScript = (scriptData,callback) => {
    const existingScript = document.getElementById(scriptData.id);
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = scriptData.url;
      script.id = scriptData.id;
      document.body.appendChild(script);
      script.onload = () => { 
        if (callback) callback();
      };
    }
    if (existingScript && callback) callback();
  }; //Check how its working @ https://medium.com/better-programming/loading-third-party-scripts-dynamically-in-reactjs-458c41a7013d
  
  export default loadScript;