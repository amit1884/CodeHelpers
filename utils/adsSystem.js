import { getAdsData } from '~/api';

const CDAPI_HOST = process.env.NEXT_PUBLIC_ADS_URL;
const ADMISSION_YEAR = '2021';
const PAGE_TYPE_GLOBAL = 'global';

const adsPushupScript = (function () {
  let scriptAdded = false;
  return function (scriptId) {
    if (!scriptAdded) {
      const s = document.createElement('script');
      s.src = `//cdn.adpushup.com/${scriptId}/adpushup.js`;
      s.type = 'text/javascript';
      s.async = true;
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(s);
      scriptAdded = true;
    }
  };
}());

const toCheck = (function () {
  return {
    // add js-invalid-para class to all invalid para element
    toAddClass(validLength, className) {
      const invalidChildNodes = document.querySelectorAll(
        `.${className} table p , .${className}ul p`, `.${className}p>img`,
      );

      [].forEach.call(invalidChildNodes, (child) => {
        child.classList.add('js-invalid-para');
      });

      return this.getValidNodes(validLength, className);
    },

    getValidNodes(validLength, className) {
      // to select all not invalid para element
      const validPara = document.querySelectorAll(
        `.${className} p:not(.js-invalid-para)`,
      );
      const validAry = [];
      // validAry contain para with length greater than the valid length
      [].forEach.call(validPara, (child) => {
        child.innerText.length > validLength ? validAry.push(child) : '';
      });

      // returns the validAry

      return validAry;
    },
  };
}());

const automateAds = (function (is_mobile) {
  // global vars
  // containers
  let sidebarSlotEl;
  let headerSlotEl;
  let bodySlots;
  let nativeLinkSlots;
  let mobileBodySlotOffset;

  let adsImpression = [];
  let uniqueAdsIds = [];

  let uniqueADS = [];

  var is_mobile;

  // cache styles
  const renderedStyle = {};

  let ADS = null;
  let adParameter;
  let watchfunction = null;
  const timeUnderViewport = 1000; // in milli second
  const timeToHitViewportLog = 2000; // in milli second

  let adsPosition = null;

  const priority = ['ad_code', 'banner', 'liveForm', 'nativeLink', 'nativeLinkGlobal'];

  function sort(ads) {
    return ads.sort((a, b) => (a - b));
  }

  return {
    init(isMobile, adsParam, micrositeBlock = 0) {
      is_mobile = isMobile;
      if (is_mobile) {
        adsPosition = ['header', 'body', 'footer'];
      } else {
        adsPosition = ['header', 'body', 'left_side_bar', 'right_side_bar', 'footer'];
      }

      // reset dependent variables
      ADS = {
        style: [],
        header: {},
        body: {},
        left_side_bar: {},
        right_side_bar: {},
        footer: {},
      };

      adsImpression = [];
      uniqueAdsIds = [];

      uniqueADS = [];
      adParameter = adsParam;

      this.removeFooterSlot();
      // Only removing dynamic body which has been added between the page and remaining body slot(footer etc.) can't removed.
      this.removeDynamicBodySlot();
      if (typeof watchfunction === 'function' && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(watchfunction);
        watchfunction = null;
      }

      // for college page (desktop) these ads need to be cleared
      // on tab changes as it lies outside the rendering tab area
      if (sidebarSlotEl) {
        [].forEach.call(sidebarSlotEl, (slotEl) => {
          slotEl.innerHTML = '';
        });
      }

      if (headerSlotEl) headerSlotEl.innerHTML = '';

      // removing all footer ads if placed
      let footerAds = document.querySelectorAll('.footerslot');
      [].forEach.call(footerAds, (container) => {
        container.parentElement.removeChild(container);
      });
      footerAds = null;
      // container elements for ads
      sidebarSlotEl = document.querySelectorAll('.sideBarSlot');
      headerSlotEl = document.querySelector('h1.top-heading, h1.listing_title, #headerslot_0'); // desktop, mobile, college
      bodySlots = document.querySelectorAll('.content-section .content-side , .page_center_body_listing, .automate_client_img_snippet');
      nativeLinkSlots = document.querySelectorAll('[class^="menu native_links_"], [class^="manipal_links native_links_"]');
      mobileBodySlotOffset = document.querySelectorAll('.left_side_snipp > .page_center_body_listing').length;

      if (adsParam.length) {
        automateAds.loadAds(adsParam, micrositeBlock);
      }
    },
    /* sends an ajax to load the ads and render them */
    loadAds(adsParam, micrositeBlock) {
      if (adsParam.indexOf('page=college') > -1) {
        const slugEl = document.querySelectorAll('.course_snipp_body.new, .course_snipp_body'); // Desktop , Mobile
        if (slugEl.length) {
          const slug_id = [];
          [].forEach.call(slugEl, (slug, index) => {
            if (slug.dataset.slug) slug_id.push(slug.dataset.slug);
          });
          adsParam += `&slug=${slug_id.filter(automateAds.unique).join()}`;
        }
      }

      if (micrositeBlock != '1') {
        let url = 'get-images';
        url += `${adsParam}&unid=${Date.now()}`;
        getAdsData(url).then((res) => {
          try {
            automateAds.onSuccess(res);
          } catch (error) {
            console.error(error);
          }
        });
      }
      setTimeout(() => {
        this.removeHeaderShimmer();
      }, 2000);
    },
    /* On succes of ajax, checks if the container is body or others and calls
    respective functions for rendering */
    onSuccess(allAdsData) {
      // let allAdsData = JSON.parse(this.responseText);

      const responseKeys = Object.keys(allAdsData)[0];

      const adPage = allAdsData[responseKeys];

      const pageSpecificAds = adPage.adsData;
      const globalAds = adPage.globalAdsData;

      const adsParams = new URLSearchParams(adParameter);
      if (adPage) {
        if (pageSpecificAds) {
          for (const key in pageSpecificAds) {
            const adType = pageSpecificAds[key];
            for (const position in adType) {
              if (key === 'live_form') {
                automateAds.generateLiveForm(adType[position], position, adsParams.get('page'));
              } else if (key === 'native_link') {
                automateAds.generateNativeLink(adType[position], position, adsParams.get('page'));
              } else {
                automateAds.generateAd(key, adType[position], position, adsParams.get('page'));
              }
            }
          }
        }
        if (globalAds) {
          for (const key in globalAds) {
            const adType = globalAds[key];
            for (const position in adType) {
              if (key === 'live_form') {
                automateAds.generateLiveForm(adType[position], position, 'global');
              } else if (key === 'native_link') {
                automateAds.generateNativeLink(adType[position], position, 'global');
              } else {
                automateAds.generateAd(key, adType[position], position, 'global');
              }
            }
          }
        }

        // resolve position & slot conflicts
        automateAds.resolvePriority();

        automateAds.renderAds(adsParams.get('page'), adsParams.get('tab'));
      }
      automateAds.logImpression();
      automateAds.watchViewportImpression();
    },

    unique(value, index, self) {
      return (value && self.indexOf(value) === index);
    },

    resolvePriority: function () {
      /* 
        Priority rule for adcode, banner & liveform in case of pagetype conflict
          - pageAds > global

        Priority rule for adcode, banner & liveform  in case of slot conflict
          - liveform > adcode > banner

        so over all priority rule is 
          - PageAds Liveform > PageAds Adcode > PageAds Banner > Global Liveform > Global Adcode > Global Banner
      */

      adsPosition.forEach((position) => {
        if (ADS[position]) {
          
          const adCodes = ADS[position]['ad_code'] || {};
          const banners = ADS[position]['banner'] || {};
          const liveforms = ADS[position]['liveForm'] || {};
          /*
            Sorted By Priority Type Since
            liveform > ad_code > banner
          */
          const adPriorityConflict = ['liveForm', 'ad_code', 'banner'];
          const adCodeRanks = Object.keys(adCodes);
          const bannerRanks = Object.keys(banners);
          const liveformsRanks = Object.keys(liveforms);
          /*
            Get Ranks Of The Ads For a Position
            Always Extract in Sorted Priority as it
            eliminates Extra Order Check
          */
          const ranksArray = [ ...liveformsRanks, ...adCodeRanks, ...bannerRanks];
          /* Available Ranks Should Be flitered By Uniqueness */
          const availableRanks = ranksArray.filter(automateAds.unique);

          /* Loop over Available Ranks */
          availableRanks.forEach((rank) => {
            
            //const liveformsranklength = liveforms[rank].length || Object.keys(liveforms[rank]).length || 0;
            /* Get Ranks of Conflicting Ads For a Particular Position */
            let duplicateRanks = [];
            liveformsRanks.indexOf(rank) >= 0 && duplicateRanks.push(0);
            adCodeRanks.indexOf(rank) >= 0 && duplicateRanks.push(1);
            bannerRanks.indexOf(rank) >= 0 && duplicateRanks.push(2);

            /*
              Only Need To Sort the ADS if Duplicate Ranks Array > 1 else Since only 1 is present 
              Sorting Not Required
            */
            if( duplicateRanks.length > 1){
              /* 
                adsQueue Variable keeps the data sorted about Ads Having Same Ranks 
                DuplicateRanks Will Have Always Array Sorted in Priority Order
                But not on pageType
              */
              const adsQueue = duplicateRanks.map((index) => {
                return adPriorityConflict[index];
              });
              /*
                Sorting Based on pageType Ads For 
              */
              adsQueue.sort((a, b)=>{
                /* 
                  Get Both The Types of Ads to Be
                  Sorted.
                */
                const adTypeFirst = ADS[position][a];
                const adTypeSecond = ADS[position][b];

                /* Get Both the pageTypes of Both The ADS */
                let pageTypeFirst, pageTypeSecond;
                /* 
                  Data Can be Of Type Array Or An Object 
                  So cast them Accordingly
                */
                if( Array.isArray(adTypeFirst[rank]) )
                  pageTypeFirst = adTypeFirst[rank] && adTypeFirst[rank].length && adTypeFirst[rank][0].dataset.pageType || "";
                else{
                  const ObjectData = adTypeFirst[rank] || "";
                  pageTypeFirst = ObjectData[Object.keys(ObjectData)[0]].dataset.pageType || "";
                }
                if( Array.isArray(adTypeSecond[rank]) )
                  pageTypeSecond = adTypeSecond[rank] && adTypeSecond[rank].length && adTypeSecond[rank][0].dataset.pageType || "";
                else{
                  const ObjectData = adTypeSecond[rank] || "";
                  pageTypeSecond = ObjectData[Object.keys(ObjectData)[0]]?.dataset.pageType || "";
                }
                /* 
                  if both are present then there is a conflict
                  so based on priority rules defined above it will be resolved
                */
                if(pageTypeFirst == PAGE_TYPE_GLOBAL && pageTypeSecond == PAGE_TYPE_GLOBAL){
                  return 0;
                }
                /* 
                  if Only One is Global
                  then other should be of Top Priority Since
                  Global Type Has lesser Priority
                */
                else if(pageTypeFirst == PAGE_TYPE_GLOBAL){
                  return 1;
                }
                /* 
                  if Only One is Global
                  then other should be of Top Priority Since
                  Global Type Has lesser Priority
                */
                else if(pageTypeSecond == PAGE_TYPE_GLOBAL){
                  return -1;
                }
                /* 
                  Else if None is Global
                  then since its already sorted according
                  to Ad priority it should be returned
                */
                else{
                  return 0;
                }
              });
              /* 
                Filter the Ads Other than the First Element
                in the Queue
              */
              adsQueue.forEach((ele, index)=>{
                if(index!=0){
                  delete ADS[position][ele][rank];
                }
              });
            }
          })
        }
      })
    },

    renderAds: function (page, tab) {
      var styles = ADS.style.filter(automateAds.unique);

      styles.forEach((style) => {
        document.body.insertAdjacentHTML('beforeend', style);
      });

      if (headerSlotEl) {
        headerSlotEl.innerHTML = '';
      }
      // run through slots

      adsPosition.forEach((position, sidx) => {
        if (ADS[position]) {
          priority.forEach((adsType, idx) => {
            if (ADS[position][adsType]) {
              const ranks = sort(Object.keys(ADS[position][adsType]));

              // only possible in case of nativeLink
              ranks.forEach((rank, ridx) => {
                const subRanks = sort(Object.keys(ADS[position][adsType][rank]));

                // get slot container according to rank and slot
                const slotEl = automateAds.getRankedContainer(position, rank, page, tab, adsType);

                if (slotEl || slotEl.length) {
                  let body = null;
                  if (adsType == 'liveForm') {
                    const liveFormsContainer = document.createElement('div');
                    liveFormsContainer.className = 'live_form_container clearfix';

                    const heading = document.createElement('h4');

                    if (is_mobile) {
                      heading.innerHTML = `<span class="icon">
                      <svg><use href="#icon-live_form_sponsored_icon"/></svg>
                      </span> SPONSORED APPLICATION FORMS ${ADMISSION_YEAR}`;
                    } else {
                      heading.innerHTML = `<span class="live-form-heading--icon"><svg><use href="#icon-live_form_sponsored_icon"/></svg></span> Latest Application Forms ${ADMISSION_YEAR}`;
                    }

                    liveFormsContainer.appendChild(heading);

                    slotEl.insertAdjacentElement('beforeend', liveFormsContainer);

                    body = document.createElement('div');

                    liveFormsContainer.appendChild(body);
                  }

                  subRanks.forEach((subRank, sridx) => {
                    if (adsType == 'nativeLink' || adsType == 'nativeLinkGlobal') {
                      let globalPlaced = false;

                      [].forEach.call(slotEl, (slotElItem) => {
                        // verify if slotElItem is a valid node in DOM
                        if (slotElItem.parentElement) {
                          const nativeSlotEl = slotElItem.querySelector(`.nativeLink_${subRank}`);

                          // first check if nativeLinkSlot is empty or not
                          // if empty non-global native link will be placed first
                          // if this slot is still empty then global nativelink can be placed
                          if (!nativeSlotEl.children.length && !globalPlaced) {
                            if (adsType == 'nativeLinkGlobal') globalPlaced = true;
                            // need to clone ads because there are more than 1 slot with same slug_id
                            const adsEl = ADS[position][adsType][rank][subRank].cloneNode(true);
                            nativeSlotEl.insertAdjacentElement('beforeend', adsEl);

                            if (is_mobile) nativeSlotEl.style.paddingTop = '10px';

                            adsImpression.push(adsEl.dataset.adsId);
                            adsEl.children[0].addEventListener('click', automateAds.logClick(adsEl.dataset.adsId));
                          }
                        }
                      });
                    } else {
                      const adsEl = ADS[position][adsType][rank][subRank];
                      // if liveform then push into liveform container
                      if (adsType == 'liveForm' && body) {
                        body.insertAdjacentElement('beforeend', adsEl);
                      } else if (adsType == 'ad_code') {
                        if (adsEl.dataset.script) {
                          // adsense
                          const ad_html = adsEl.children[0].innerHTML;
                          adsEl.children[0].innerHTML = '';
                          // loads adspushup scripts just before rendering any adcode
                          if (!window.adpushup) {
                            adsPushupScript(adpushupId);
                          }

                          setTimeout(() => {
                            postscribe(`#ads_viewport_${adsEl.dataset.adsId}`, ad_html);
                          }, 200);
                        }
                        slotEl.insertAdjacentElement('beforeend', adsEl);
                      } else {
                        slotEl.insertAdjacentElement('beforeend', adsEl);
                      }

                      adsImpression.push(adsEl.dataset.adsId);
                      // most of time children points to anchor tag (excecption - adCode)
                      adsEl.children[0].addEventListener('click', automateAds.logClick(adsEl.dataset.adsId), true);
                    }
                  });
                } else {
                  console.log('slot not found for : ', position, rank, page, adsType);
                }
              });
            }
          });
        }
      });
    },

    getRankedContainer(slot, rank, page, tab, adsType) {
      // if globale native links return all native link slots
      if (adsType == 'nativeLinkGlobal') return (nativeLinkSlots.length ? nativeLinkSlots : false);

      if (adsType == 'nativeLink') {
        if (nativeLinkSlots.length) {
          // get all native link slots with same slug id
          // because there can be more than on slug_snippet on a page
          var div = [].filter.call(nativeLinkSlots, (nativeLinkEl) => (nativeLinkEl.className.indexOf(rank) > -1));

          return div;
        } return false;
      }
      const id = `${slot}slot_${rank || 0}`;
      // search if ranked slot has been added to DOM
      var div = document.getElementById(id);
      if (div) {
        // if ranked slot found in DOM return it
        return adsType == 'banner' && div.querySelector('[data-ads-type="ad_code"]') ? false : div;
      }
      // if ranked slot not found in DOM create slot
      div = document.createElement('div');
      div.id = id;

      if (slot == 'header' && headerSlotEl) {
        headerSlotEl.insertAdjacentElement('afterend', div);
        return div;
      }
      if (slot == 'body' && bodySlots.length) {
        if (page == 'listing' || page == 'newslisting' || (page == 'coursearticle' && tab == 'cutoff')) {
          const containerClass = is_mobile && page == 'listing' ? ' container' : '';

          div.className = `bodyslot bodyslot-dynamic clearfix${containerClass}`;

          if (is_mobile && bodySlots[rank]) {
            // place befor rank as rank is 1 indexed and bodyslot is 0 index
            if (rank % 2 == 0) {
              // place after checking next rank
              let indexOfCard = 0;
              if (page == 'listing') {
                indexOfCard = rank;// New non-grid offset not required
              } else {
                indexOfCard = Math.floor((rank - 1) / 2) + mobileBodySlotOffset;// Grid view offset calculation
              }

              bodySlots[indexOfCard]
                    && bodySlots[indexOfCard].insertAdjacentElement('beforebegin', div);
            } else if (tab == 'cutoff') {
              bodySlots[rank].insertAdjacentElement('afterend', div);
            } else {
              let indexOfCard = 0;
              if (page == 'listing') {
                indexOfCard = rank;// New non-grid offset not required
              } else {
                indexOfCard = Math.floor((rank - 1) / 2);// Grid view offset calculation
              }
              bodySlots[indexOfCard]
                    && bodySlots[indexOfCard].insertAdjacentElement('beforebegin', div);
            }
            return div;
          } if (bodySlots[rank * 3]) {
            // place befor rank as rank is 1 indexed and bodyslot is 0 index
            bodySlots[rank * 3].insertAdjacentElement('beforebegin', div);
            return div;
          }
        }

        if (page == 'college' && tab !== 'admission') {
          div.className = 'bodyslot';
          if (bodySlots[rank]) {
            bodySlots[rank].insertAdjacentElement('beforebegin', div);
            return div;
          }
        }

        if (page === 'examarticle' || page === 'admissionarticle' || page === 'coursearticle' || (page === 'college' && tab === 'admission')) {
          div.className = 'bodyslot';

          if (bodySlots[0] && tab !== 'top_colleges_in_india_accepting' && tab !== 'exams-news-tab') {
            const validParaLength = 300;
            const validNodes = toCheck.toAddClass(validParaLength, 'content-side');

            if (validNodes[rank - 1]) {
              validNodes[rank - 1].insertAdjacentElement('afterend', div);
              return div;
            }
          } else if ((tab === 'top_colleges_in_india_accepting' || (tab === 'exams-news-tab' && !is_mobile)) && bodySlots[rank * 4]) {
            bodySlots[rank * 4].insertAdjacentElement('beforebegin', div);
            return div;
          } else if (tab === 'exams-news-tab' && is_mobile) {
            if (bodySlots[rank]) {
              bodySlots[rank].insertAdjacentElement('beforebegin', div);
              return div;
            }
          }
        }
        if (page === 'examlisting' || page === 'courselisting') {
          div.className = 'bodyslot';
          if (bodySlots[rank]) {
            bodySlots[rank].insertAdjacentElement('beforebegin', div);
            return div;
          }
        }
      }

      const adElement = automateAds.generateAds(slot, div, id);
      if (adElement) return adElement;

      if (div.parentElement) return div;
      return false;
    },
    generateAds(slot, div, id) {
      const availableSlots = ['footer', 'right_side_bar', 'left_side_bar'];
      if (availableSlots.includes(slot)) {
        const place = document.querySelector(`.page-min-height .${id}`);
        if (place) {
          // insert ads befor ranked slot
          place.insertAdjacentElement('beforebegin', div);
          div.className = `${slot}slot`;
          return div;
        }
      }
      return false;
    },
    // common function for generating banners and adCode
    generateAd(adType, ads, position, page) {
      if (!ADS[position][adType]) ADS[position][adType] = {};

      const ranks = sort(Object.keys(ads));
      
      ranks.forEach((rank) => {
        if (page != 'global' || (page == 'global' && !ADS[position][adType][rank])) {
          
          if (!ADS[position][adType][rank]) {
            ADS[position][adType][rank] = [];
          }

          let adsRanked = [];
          if (position === 'header') {
            adsRanked = ads;
          } else {
            adsRanked = ads[rank];
          }

          adsRanked.forEach((ad) => {
            ADS.style.push(ad.style);
            const container = document.createElement('div');
            container.dataset.adsId = ad.ads_id;
            container.dataset.adsType = adType;
            container.dataset.pageType = page;

            if (ad.banner.indexOf('</script>') !== -1) {
              container.insertAdjacentHTML('beforeend', `<div>${ad.banner}</div>`);
              container.dataset.script = true;
            } else {
              // anchor tag
              container.insertAdjacentHTML('beforeend', ad.banner);
            }
            if (position === 'header') {
              container.className = `ads_header_${adType}_container`;
            }
            if (position === 'body') {
              container.className = `ads_body_${adType}_container clearfix`;
            }
            if (position === 'left_side_bar' || position === 'right_side_bar') {
              container.className = `ads_side_bar_${adType}_container clearfix`;
            }
            if (position === 'footer') {
              container.className = `ads_footer_${adType}_container clearfix`;
            }
            if (container.children[0]) {
              container.children[0].id = `ads_viewport_${ad.ads_id}`;
              container.children[0].dataset.id = ad.ads_id;
              ADS[position][adType][rank].push(container);
            }
          });
        }
      });
    },

    generateLiveForm(ads, type, page) {
      if (type == 'body') {
        if (!ADS.body.liveForm) ADS.body.liveForm = {};

        const ranks = sort(Object.keys(ads));

        ranks.forEach((rank, index) => {
          const adsRanked = ads[rank];

          if (!ADS.body.liveForm[rank]) ADS.body.liveForm[rank] = {};

          const subRanks = sort(Object.keys(adsRanked));

          subRanks.forEach((subRank, subIndex) => {
            if (page != 'global' || (page == 'global' && !ADS.body.liveForm[rank][subRank])) {
              const adsSubRanked = adsRanked[subRank];
              adsSubRanked.forEach((ad, adIndex) => {
                ADS.style.push(ad.style);

                const container = document.createElement('div');
                container.className = 'ads_body_live_form_container clearfix';
                // wrap the ads into container to hold some data in data-*
                container.dataset.adsId = ad.ads_id;
                if(page == 'global')
                    container.dataset.pageType = page;
                container.insertAdjacentHTML('beforeend', ad.banner);

                if (container.children[0]) {
                  container.children[0].id = `ads_viewport_${ad.ads_id}`;
                  container.children[0].dataset.id = ad.ads_id;
                  

                  // this will replace any global form placed on this slot
                  ADS.body.liveForm[rank][subRank] = container;
                }
              });
            }
          });
        });
      }
    },

    generateNativeLink(ads, type, page) {
      if (type == 'body') {
        const nativeLinkType = (page == 'global' ? 'nativeLinkGlobal' : 'nativeLink');

        if (!ADS.body[nativeLinkType]) ADS.body[nativeLinkType] = {};

        const slug = Object.keys(ads);

        slug.forEach((slug) => {
          const ad_slot = ads[slug];

          if (!ADS.body[nativeLinkType][slug]) ADS.body[nativeLinkType][slug] = {};

          const slots = sort(Object.keys(ad_slot));

          slots.forEach((slot, index) => {
            if (!ADS.body[nativeLinkType][slug][slot]) ADS.body[nativeLinkType][slug][slot] = [];

            const adsRanked = ad_slot[slot];

            // contain html & styles
            adsRanked.forEach((ad, index) => {
              const span = document.createElement('span');
              span.className = 'ads_native_link_college_container';

              span.insertAdjacentHTML('afterbegin', ad.banner);

              if (span.children[0]) {
                span.dataset.adsId = ad.ads_id;
                span.children[0].id = `ads_viewport_${ad.ads_id}`;
                span.children[0].dataset.id = ad.ads_id;

                ADS.body[nativeLinkType][slug][slot] = span;
              }
            });
          });
        });
      }
    },

    logImpression() {
      uniqueAdsIds = adsImpression.join().split(',').filter(automateAds.unique);

      if (uniqueAdsIds.length) {
        const data = `data=${uniqueAdsIds.join()}`;

        automateAds.ajaxCall(`${CDAPI_HOST}image-analytics/impress-log`, `type=nonvp&${data}`, (res) => {
          console.log('ads impression logged successfully');
        });
      }
    },

    logClick(id) {
      return function () {
        automateAds.ajaxCall(`${CDAPI_HOST}image-analytics/click-log`, `data=${id}`, (res) => {
          console.log('ads clicked at ', id);
        });
      };
    },

    watchViewportImpression() {
      if (uniqueAdsIds.length) {
        const viewData = {};
        let now = Date.now();
        let tempIds = [];

        uniqueADS = uniqueAdsIds.map((val, i) => {
          const ad = document.getElementById(`ads_viewport_${val}`);
          if (ad) {
            viewData[`ads_viewport_${val}`] = {
              visible: false,
              logged: false,
              lastSeen: now,
            };

            return ad;
          }
        });

        if (uniqueADS && uniqueADS.length) {
          let scheduledToWatch = false;
          let lastSheduled = 0;

          var watchfunction = function () {
            now = Date.now();

            if ((now - lastSheduled) > 250) {
              scheduledToWatch = true;
              lastSheduled = now;
            }

            if (uniqueADS.length) {
              if (scheduledToWatch) {
                scheduledToWatch = false;

                uniqueADS.forEach((ad, i) => {
                  if (ad && ad.id) {
                    const box = ad.getBoundingClientRect();

                    const isVisible = (
                      box.top >= 0
                      // box.left >= 0 &&
                      // box.right <= (window.innerWidth || document.documentElement.clientWidth) &&
                      && box.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                    );

                    if (isVisible) {
                      if (!viewData[ad.id].visible) {
                        viewData[ad.id].lastSeen = now;
                      }

                      viewData[ad.id].visible = true;

                      if (!viewData[ad.id].logged && (now - viewData[ad.id].lastSeen) > timeUnderViewport) {
                        tempIds.push(ad.dataset.id);

                        viewData[ad.id].logged = true;
                      }
                    } else if (viewData[ad.id].visible) {
                      viewData[ad.id].visible = false;
                      viewData[ad.id].lastSeen = now;
                    }
                  }
                });
              }

              window.requestAnimationFrame(watchfunction);
            } else {
              window.cancelAnimationFrame(watchfunction);
            }
          };

          var logCounter = setInterval((function () {
            return function () {
              if (tempIds.length) {
                // new add entered in viewport

                automateAds.ajaxCall(`${CDAPI_HOST}image-analytics/impress-log`, `type=vp&data=${tempIds.join()}`, (res) => {
                  {}
                });

                uniqueADS = uniqueADS.filter((ad, index) => tempIds.indexOf(ad.dataset.id) == -1);

                tempIds = [];
              }

              if (!uniqueADS.length) {
                clearInterval(logCounter);
              }
            };
          }(tempIds)), timeToHitViewportLog);
        }

        if (window && window.requestAnimationFrame) {
          window.requestAnimationFrame(watchfunction);
        }
      }
    },

    removeFooterSlot() {
      this.removeSlotContainer('.footerslot');
    },
    removeDynamicBodySlot(){
      this.removeSlotContainer('.bodyslot-dynamic');
    },
    removeSlotContainer(className){
      const footerSlots = document.querySelectorAll(className);
      if (footerSlots.length) {
        [].forEach.call(footerSlots, (el) => {
          el.remove();
        });
      }
    },

    removeHeaderShimmer: function(){
      if(headerSlotEl && !headerSlotEl.querySelector("[class^='ads']")){
        // let adsParams = new URLSearchParams(adParameter);
        // if(dataForAdLog && dataForAdLog.is_mobile && adsParams.get('page') == 'college'){
        //   $changeClass({remove:'header_ads_loader headerslot-fixedheight', add: 'd-none'},headerSlotEl);
        // }
        // else{
        headerSlotEl.classList.add('d-none');
        // }
      }
    },

    ajaxCall(url, data, callback) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      // xhr.setRequestHeader("Content-type", "application/json;");
      xhr.withCredentials = true;
      xhr.send(data);
      xhr.onreadystatechange = function () {
        /* status code 4 -> request finished and response is ready and 200 -> OK */
        // Check the response is complete
        if (xhr.readyState === 4) {
          // Check the status code of the response is successful
          if (xhr.status === 200) {
            callback.call(xhr);
          }
        }
      };
    },
  };
}());

export default automateAds;
