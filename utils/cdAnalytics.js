"use strict";
var AnalyticsHandler = (function () {
    var PAGE_NAME;
    var gaToBeFired=true;
    var eventNotFiredForDynamicRoutes=["exams_listing"]
    return {
        init: function () {
            var theParent = document.body;
            theParent.addEventListener("click", AnalyticsHandler.linkClicked, false);
        },
        updatePageName:function(page_name,fireGaEvent){
            PAGE_NAME=page_name;
            gaToBeFired=fireGaEvent;
        },
        linkClicked: function(e){
            // e.stopPropagation();
            var clickedItem = e.target;
            while(clickedItem !== e.currentTarget){
                if (clickedItem.tagName.toLowerCase() === 'a') {

                    var title = '';
                    var href = '';
                    var rank = 0;

                    if(clickedItem.href){
                        href = clickedItem.getAttribute("href");
                    }

                    title = clickedItem.text.slice(0, 100);

                    if(clickedItem.text == ''){
                        if(clickedItem.getElementsByTagName('img').length > 0){
                            title = clickedItem.getElementsByTagName('img')[0].src;
                        }else{
                            title = clickedItem.innerHTML.slice(0, 200);
                        }
                    }
                    var allLinks = document.querySelectorAll('a[href="'+href+'"]');
                    var array_links = [].map.call(allLinks ,function(value, index) {
                        return value;
                    });
                    if(allLinks.length >= 1){
                        rank = array_links.indexOf(clickedItem)+1;
                        href = href+'_'+rank;
                    }
                    if (typeof PAGE_NAME !== 'undefined' && PAGE_NAME.indexOf('Exam_Page_') > -1){
                        PAGE_NAME = "Exam";
                    }
                    if (typeof PAGE_NAME === 'undefined'){
                        PAGE_NAME = 'Link Clicked';
                    }
                    // console.log(PAGE_NAME,title,href,rank);
                    if(gaToBeFired&&!eventNotFiredForDynamicRoutes.includes(PAGE_NAME))
                    {
                        window.ga('send', 'event', PAGE_NAME, title, href, rank, {nonInteraction: true});
                    }
                    break;
                }else{
                    clickedItem = clickedItem.parentNode;
                }
            }
        }
    }
})();

export default AnalyticsHandler;