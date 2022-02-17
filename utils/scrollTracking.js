var ScrollTracking = (function () {
	var slot = 25;
	var sections = new Object();
	var greatest_slot = 1;
	var scrollPercent='';
	return{
        init:function(){
            var h = document.documentElement, 
			b = document.body,
			st = 'scrollTop',
			sh = 'scrollHeight',
			oh = 'offsetHeight';
		for(var i=1;i<=(100/slot);i++){
			sections[i] = 0;
		}
		function debounce(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		}
		var scrollHandler = debounce(function() {
			var percent = (h[st]||b[st]||h[oh]||b[oh]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
			percent=percent>100 ? 0 : percent;
			var section = percent/slot;
			if(section < (100/slot))
				section = Math.floor(section)+1;
			else
				section = Math.floor(section);
			if(greatest_slot < section){
				greatest_slot = section;
			}
		
			if(sections[section] == 0){
				// scrollPercent = section*slot;
				// console.log("event fired "+(scrollPercent-slot) +"-" +scrollPercent);
				sections[section] = 1;
			}
		}, 250);
			window.addEventListener('scroll', scrollHandler);
			window.addEventListener('beforeunload',this.scrollGaEvent);
		},
		reinit:function(){
			scrollPercent='';
			sections=new Object();
			greatest_slot = 1;
			for(var i=1;i<=(100/slot);i++){
				sections[i] = 0;
			}

		},
		scrollGaEvent:function(){
			for(var i=1;i<=(100/slot);i++){
				if(sections[i] == 1){
					greatest_slot = i;
				}
			}
			scrollPercent = greatest_slot*slot;
			if(scrollPercent>=0&&slot)
			window.ga('send','event','PageScroll','<<'+ (scrollPercent-slot) +"%-" +scrollPercent +'%>>',{nonInteraction:true});
		}	
    }
})();

export default ScrollTracking;