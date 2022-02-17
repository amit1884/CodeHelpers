import { getCookieFromBrowser } from "~/utils/cookie";
import localStorageHandler from "~/utils/localStorageHandler";
import { createQueryString } from "~/utils";

let leadtrackhandler = {};
if (typeof window !== "undefined") {

  leadtrackhandler = (function() {

  let date = new Date();
  date.setTime(date.getTime()+(180*24*60*60*1000));  
  var cdBasUrl = process.env.NEXT_PUBLIC_CD_BASE;
  let revisitTimeOut = '';
  var ls = new localStorageHandler();
  
  return {
    setTrackingCookie: function(user_id, start_time) {
      // this needs to be called at the point of submitting leadform
      // if cookie already set and revisit time not set then update cookie with revisit time
      var cookie;
      var expired = "; expires="+date.toGMTString();
      if(!getCookieFromBrowser('vstTrk')){
        // first time leadform filled, set cookie
        var value = {user_id: user_id, start_time: start_time, last_visit_time: Math.floor((new Date()).getTime() / 1000)  }
        cookie = ['vstTrk', '=', btoa(JSON.stringify(value)) + ';expires='+expired + ';path=/'].join('');
        document.cookie = cookie;
      }else{
        // if user fills leadform again, then delete old cookie and start new cookie
        if(JSON.parse(atob(getCookieFromBrowser('vstTrk'))).user_id != user_id){
          //reset college visited history when user id changes
          document.cookie = "clg_vst" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        document.cookie = "vstTrk" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        var currenttime = Math.floor((new Date()).getTime() / 1000) ;
        var val = {user_id: user_id, start_time:currenttime, last_visit_time:currenttime}
        cookie = ['vstTrk', '=', btoa(JSON.stringify(val)) + ';expires='+expired + ';path=/'].join('');
        document.cookie = cookie;
      }
    },
    checkrevisittime : function(pageData){
      
      var threshold = 3; // 3s
      //  current time - last visit time
      if(getCookieFromBrowser('vstTrk')){
        
        if((Math.floor((new Date()).getTime() / 1000) - JSON.parse(atob(getCookieFromBrowser('vstTrk'))).last_visit_time) > threshold){
          leadtrackhandler.destroyTimeOut();
          //threshold exceeded, calling api and updatind last visit time
          revisitTimeOut = setTimeout(()=>{
            leadtrackhandler.registerRevisitApi(pageData);
          },15000);
        }
      }
      //if(cookie set but revisit time not set) {return 'firstrevisit'}
      //if(cookie and revisit time set) {return '2+ revisit'}
    },
    registerRevisitApi : function(pageData){
      // reset last visit time, here we modify last visit time after decoding cookie and deleteting old cookie
      try {
        var jsonparsed = JSON.parse(atob(getCookieFromBrowser('vstTrk'))),
            id = JSON.parse(atob(getCookieFromBrowser('vstTrk'))),
            encodedid =  { id: id.user_id },
            userInfo = ls.get('leadData'),
            courseData = JSON.parse(userInfo?.toMerge?.course_tag_id),
            // leadBtn = $getID("js-global-lead-btn") || $getC('js-open-leadform',false,'single'),
            // pageInfoData =  leadBtn.dataset.href,
            leadData = {},
            expired = "; expires="+date.toGMTString();

        jsonparsed.last_visit_time = Math.floor((new Date()).getTime() / 1000);
        document.cookie = "vstTrk" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = "vstTrk=" + btoa(JSON.stringify(jsonparsed))  + ';expires='+expired + ';path=/';
        

        leadData['name'] = userInfo.toMerge.name;
        leadData['phone_no'] = userInfo.toMerge.phone_no;
        leadData['email'] = userInfo.toMerge.email;
        leadData['country_code'] = '+91';
        leadData['city'] = JSON.parse(userInfo.toMerge.city).city;
        
        var formdata = createQueryString(pageData),
            courseTag = 0;
        
        // change this code according to pages 

        // let pageName = ALT_PAGE_NAME.toLowerCase().includes('leadform') ? PAGE_NAME : ALT_PAGE_NAME;
        // let pageName = pageData.pageName;
        // if(typeof(college_id) !== 'undefined'){
        //   formdata += '&entity_type=college&entity_id=' + college_id +'&page_name='+pageName;
        // }else{
          
        //   let info = leadtrackhandler.parseQueryString(pageInfoData);
        //   let entityName = '';
        //   let entityId = 0;
        //   if(pageName.includes('exam')){
        //     entityId = info.exam_id || 0;   
        //     entityName = 'exam';
        //   }else if(pageName.includes('course')){
        //     if(info.course_id) {
        //       courseTag = 1;
        //       formdata += $getID('js-revisit-lead-data').value;
        //     }
        //     entityId = info.course_id || 0;   
        //     entityName = 'course';
        //   }else if(pageName.includes('admission')){
        //     entityName = 'admission';
        //   }else if(pageName.includes('listing')){
        //     entityName = 'college';
        //   }else if(pageName.includes('news')){
        //     entityName = 'news';
        //   }
          
        //   formdata += '&entity_type='+entityName+'&entity_id='+entityId+'&page_name='+pageName ;
        // }

        if(courseTag == 0) {
          leadData['course_tag_id'] = courseData.course_tag_id;
          leadData['stream_id'] = courseData.stream_id;
          leadData['course_tag'] = courseData.course_tag;
        }

        for (var key in leadData) {
          if (leadData[key] != undefined && leadData[key]) {
            formdata += "&"+key+"="+leadData[key];
          }
        } 

        formdata += '&UInfo='+ JSON.stringify(encodedid)  +'&from_source=6';
      } catch(e) {
        console.log(e);
      }

      var url = cdBasUrl+'auth/revisit-trk';
      // clg_vst cookie maintains only in college page
      /*if(typeof(college_id) !== 'undefined'){
        if(getCookieFromBrowser('clg_vst')){
          // if revisit req is not first time
            var array_colleges = atob(getCookieFromBrowser('clg_vst'));
            var to_array = array_colleges.split(",");
            if(to_array.indexOf(college_id) < 0){
                //array_colleges = array_colleges + ','+ college_id ;
                to_array.push(college_id);
                globalheader.loadAjaxDropDown(url, function(){
                }, 'POST', formdata);
                leadtrackhandler.collegetrack(to_array.toString());
              }
          }else{
            //if revisit is 1st time, set college history cookie and send revisit req
              leadtrackhandler.collegetrack(college_id);
              // var encodedid =  { id: JSON.parse(atob(getCookieFromBrowser('vstTrk'))).user_id };
              // var formdata =  '&UInfo='+ JSON.stringify(encodedid) + '&entity_type=college&entity_id=' + college_id  ;
              
              globalheader.loadAjaxDropDown(url, function(){
              }, 'POST', formdata);
          }
      }else{
        
        globalheader.loadAjaxDropDown(url, function(){
        }, 'POST', formdata);
      }*/

      
      leadtrackhandler.loadAjaxDropDown(url, function(){
      }, 'POST', formdata);
    },
    collegetrack : function(college_string){
      document.cookie = "clg_vst" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      // var collegedate = new Date();
      // collegedate.setTime(collegedate.getTime()+(60*60*1000));
      // var historyExpire = "; expires="+collegedate.toGMTString();

      var now = new Date();
      var historyExpire = new Date();
      historyExpire.setFullYear(now.getFullYear());
      historyExpire.setMonth(now.getMonth());
      historyExpire.setDate(now.getDate()+1);
      historyExpire.setHours(0);
      historyExpire.setMinutes(0);
      historyExpire.setSeconds(0);

      var cookie = ['clg_vst', '=', btoa(college_string) + ';expires='+historyExpire + ';path=/'].join('');
      document.cookie = cookie;

    },
    loadAjaxDropDown: function (ajax_desktop_url, callback, method = 'GET', params = null, withCredentials = true, content_type = true, getError) {

      // trackingHandler.ajaxRequests(ajax_desktop_url, method, params);
  
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
  
        /*status code 4 -> request finished and response is ready and 200 -> OK */
        //Check the response is complete
        if (xhr.readyState === 4) {
          //Check the status code of the response is successful
          if (xhr.status === 200) {
            callback.call(xhr);
          } else {
            getError && callback.call(xhr);
          }
        } else {
          //console.log(this.responseText);
        }
      };
      xhr.open(method, encodeURI(ajax_desktop_url), true);
      if (content_type) {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      }
      let csrfToken = document.querySelector('meta[name="csrf-token"]');
      if (csrfToken) {
        xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken.getAttribute('content'));
      }
      xhr.withCredentials = withCredentials;
      xhr.send(params);
      return xhr;
    },
    parseQueryString: function(query){
      let queryString = query.split("&"),
          queryObj = {},
          arrLen = queryString.length;
      for(let i = 0; i < arrLen; i++){
        let pair = queryString[i].split("="),
            key = decodeURIComponent(pair[0]),
            value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if(typeof queryObj[key] === "undefined"){
          queryObj[key] = decodeURIComponent(value);
          // If second entry with this name
        }else if(typeof queryObj[key] === "string"){
          let arr = [queryObj[key], decodeURIComponent(value)];
          queryObj[key] = arr;
          // If third or later entry with this name
        }else{
          queryObj[key].push(decodeURIComponent(value));
        }
      }
      return queryObj;
    },
    setDefault : function(){
      if(!getCookieFromBrowser('clg_vst')){
        leadtrackhandler.collegetrack(' ');
      }
    },
    destroyTimeOut: function(){
      clearTimeout(revisitTimeOut);
    }
  }
  })();
}


export default leadtrackhandler;  