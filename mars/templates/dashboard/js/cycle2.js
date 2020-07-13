/*!
* jQuery Cycle2; version: 2.1.6 build: 20141007
* http://jquery.malsup.com/cycle2/
* Copyright (c) 2014 M. Alsup; Dual licensed: MIT/GPL
*/
// !function(a){"use strict";function b(a){return(a||"").toLowerCase()}var c="2.1.6";a.fn.cycle=function(c){var d;return 0!==this.length||a.isReady?this.each(function(){var d,e,f,g,h=a(this),i=a.fn.cycle.log;if(!h.data("cycle.opts")){(h.data("cycle-log")===!1||c&&c.log===!1||e&&e.log===!1)&&(i=a.noop),i("--c2 init--"),d=h.data();for(var j in d)d.hasOwnProperty(j)&&/^cycle[A-Z]+/.test(j)&&(g=d[j],f=j.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,b),i(f+":",g,"("+typeof g+")"),d[f]=g);e=a.extend({},a.fn.cycle.defaults,d,c||{}),e.timeoutId=0,e.paused=e.paused||!1,e.container=h,e._maxZ=e.maxZ,e.API=a.extend({_container:h},a.fn.cycle.API),e.API.log=i,e.API.trigger=function(a,b){return e.container.trigger(a,b),e.API},h.data("cycle.opts",e),h.data("cycle.API",e.API),e.API.trigger("cycle-bootstrap",[e,e.API]),e.API.addInitialSlides(),e.API.preInitSlideshow(),e.slides.length&&e.API.initSlideshow()}}):(d={s:this.selector,c:this.context},a.fn.cycle.log("requeuing slideshow (dom not ready)"),a(function(){a(d.s,d.c).cycle(c)}),this)},a.fn.cycle.API={opts:function(){return this._container.data("cycle.opts")},addInitialSlides:function(){var b=this.opts(),c=b.slides;b.slideCount=0,b.slides=a(),c=c.jquery?c:b.container.find(c),b.random&&c.sort(function(){return Math.random()-.5}),b.API.add(c)},preInitSlideshow:function(){var b=this.opts();b.API.trigger("cycle-pre-initialize",[b]);var c=a.fn.cycle.transitions[b.fx];c&&a.isFunction(c.preInit)&&c.preInit(b),b._preInitialized=!0},postInitSlideshow:function(){var b=this.opts();b.API.trigger("cycle-post-initialize",[b]);var c=a.fn.cycle.transitions[b.fx];c&&a.isFunction(c.postInit)&&c.postInit(b)},initSlideshow:function(){var b,c=this.opts(),d=c.container;c.API.calcFirstSlide(),"static"==c.container.css("position")&&c.container.css("position","relative"),a(c.slides[c.currSlide]).css({opacity:1,display:"block",visibility:"visible"}),c.API.stackSlides(c.slides[c.currSlide],c.slides[c.nextSlide],!c.reverse),c.pauseOnHover&&(c.pauseOnHover!==!0&&(d=a(c.pauseOnHover)),d.hover(function(){c.API.pause(!0)},function(){c.API.resume(!0)})),c.timeout&&(b=c.API.getSlideOpts(c.currSlide),c.API.queueTransition(b,b.timeout+c.delay)),c._initialized=!0,c.API.updateView(!0),c.API.trigger("cycle-initialized",[c]),c.API.postInitSlideshow()},pause:function(b){var c=this.opts(),d=c.API.getSlideOpts(),e=c.hoverPaused||c.paused;b?c.hoverPaused=!0:c.paused=!0,e||(c.container.addClass("cycle-paused"),c.API.trigger("cycle-paused",[c]).log("cycle-paused"),d.timeout&&(clearTimeout(c.timeoutId),c.timeoutId=0,c._remainingTimeout-=a.now()-c._lastQueue,(c._remainingTimeout<0||isNaN(c._remainingTimeout))&&(c._remainingTimeout=void 0)))},resume:function(a){var b=this.opts(),c=!b.hoverPaused&&!b.paused;a?b.hoverPaused=!1:b.paused=!1,c||(b.container.removeClass("cycle-paused"),0===b.slides.filter(":animated").length&&b.API.queueTransition(b.API.getSlideOpts(),b._remainingTimeout),b.API.trigger("cycle-resumed",[b,b._remainingTimeout]).log("cycle-resumed"))},add:function(b,c){var d,e=this.opts(),f=e.slideCount,g=!1;"string"==a.type(b)&&(b=a.trim(b)),a(b).each(function(){var b,d=a(this);c?e.container.prepend(d):e.container.append(d),e.slideCount++,b=e.API.buildSlideOpts(d),e.slides=c?a(d).add(e.slides):e.slides.add(d),e.API.initSlide(b,d,--e._maxZ),d.data("cycle.opts",b),e.API.trigger("cycle-slide-added",[e,b,d])}),e.API.updateView(!0),g=e._preInitialized&&2>f&&e.slideCount>=1,g&&(e._initialized?e.timeout&&(d=e.slides.length,e.nextSlide=e.reverse?d-1:1,e.timeoutId||e.API.queueTransition(e)):e.API.initSlideshow())},calcFirstSlide:function(){var a,b=this.opts();a=parseInt(b.startingSlide||0,10),(a>=b.slides.length||0>a)&&(a=0),b.currSlide=a,b.reverse?(b.nextSlide=a-1,b.nextSlide<0&&(b.nextSlide=b.slides.length-1)):(b.nextSlide=a+1,b.nextSlide==b.slides.length&&(b.nextSlide=0))},calcNextSlide:function(){var a,b=this.opts();b.reverse?(a=b.nextSlide-1<0,b.nextSlide=a?b.slideCount-1:b.nextSlide-1,b.currSlide=a?0:b.nextSlide+1):(a=b.nextSlide+1==b.slides.length,b.nextSlide=a?0:b.nextSlide+1,b.currSlide=a?b.slides.length-1:b.nextSlide-1)},calcTx:function(b,c){var d,e=b;return e._tempFx?d=a.fn.cycle.transitions[e._tempFx]:c&&e.manualFx&&(d=a.fn.cycle.transitions[e.manualFx]),d||(d=a.fn.cycle.transitions[e.fx]),e._tempFx=null,this.opts()._tempFx=null,d||(d=a.fn.cycle.transitions.fade,e.API.log('Transition "'+e.fx+'" not found.  Using fade.')),d},prepareTx:function(a,b){var c,d,e,f,g,h=this.opts();return h.slideCount<2?void(h.timeoutId=0):(!a||h.busy&&!h.manualTrump||(h.API.stopTransition(),h.busy=!1,clearTimeout(h.timeoutId),h.timeoutId=0),void(h.busy||(0!==h.timeoutId||a)&&(d=h.slides[h.currSlide],e=h.slides[h.nextSlide],f=h.API.getSlideOpts(h.nextSlide),g=h.API.calcTx(f,a),h._tx=g,a&&void 0!==f.manualSpeed&&(f.speed=f.manualSpeed),h.nextSlide!=h.currSlide&&(a||!h.paused&&!h.hoverPaused&&h.timeout)?(h.API.trigger("cycle-before",[f,d,e,b]),g.before&&g.before(f,d,e,b),c=function(){h.busy=!1,h.container.data("cycle.opts")&&(g.after&&g.after(f,d,e,b),h.API.trigger("cycle-after",[f,d,e,b]),h.API.queueTransition(f),h.API.updateView(!0))},h.busy=!0,g.transition?g.transition(f,d,e,b,c):h.API.doTransition(f,d,e,b,c),h.API.calcNextSlide(),h.API.updateView()):h.API.queueTransition(f))))},doTransition:function(b,c,d,e,f){var g=b,h=a(c),i=a(d),j=function(){i.animate(g.animIn||{opacity:1},g.speed,g.easeIn||g.easing,f)};i.css(g.cssBefore||{}),h.animate(g.animOut||{},g.speed,g.easeOut||g.easing,function(){h.css(g.cssAfter||{}),g.sync||j()}),g.sync&&j()},queueTransition:function(b,c){var d=this.opts(),e=void 0!==c?c:b.timeout;return 0===d.nextSlide&&0===--d.loop?(d.API.log("terminating; loop=0"),d.timeout=0,e?setTimeout(function(){d.API.trigger("cycle-finished",[d])},e):d.API.trigger("cycle-finished",[d]),void(d.nextSlide=d.currSlide)):void 0!==d.continueAuto&&(d.continueAuto===!1||a.isFunction(d.continueAuto)&&d.continueAuto()===!1)?(d.API.log("terminating automatic transitions"),d.timeout=0,void(d.timeoutId&&clearTimeout(d.timeoutId))):void(e&&(d._lastQueue=a.now(),void 0===c&&(d._remainingTimeout=b.timeout),d.paused||d.hoverPaused||(d.timeoutId=setTimeout(function(){d.API.prepareTx(!1,!d.reverse)},e))))},stopTransition:function(){var a=this.opts();a.slides.filter(":animated").length&&(a.slides.stop(!1,!0),a.API.trigger("cycle-transition-stopped",[a])),a._tx&&a._tx.stopTransition&&a._tx.stopTransition(a)},advanceSlide:function(a){var b=this.opts();return clearTimeout(b.timeoutId),b.timeoutId=0,b.nextSlide=b.currSlide+a,b.nextSlide<0?b.nextSlide=b.slides.length-1:b.nextSlide>=b.slides.length&&(b.nextSlide=0),b.API.prepareTx(!0,a>=0),!1},buildSlideOpts:function(c){var d,e,f=this.opts(),g=c.data()||{};for(var h in g)g.hasOwnProperty(h)&&/^cycle[A-Z]+/.test(h)&&(d=g[h],e=h.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,b),f.API.log("["+(f.slideCount-1)+"]",e+":",d,"("+typeof d+")"),g[e]=d);g=a.extend({},a.fn.cycle.defaults,f,g),g.slideNum=f.slideCount;try{delete g.API,delete g.slideCount,delete g.currSlide,delete g.nextSlide,delete g.slides}catch(i){}return g},getSlideOpts:function(b){var c=this.opts();void 0===b&&(b=c.currSlide);var d=c.slides[b],e=a(d).data("cycle.opts");return a.extend({},c,e)},initSlide:function(b,c,d){var e=this.opts();c.css(b.slideCss||{}),d>0&&c.css("zIndex",d),isNaN(b.speed)&&(b.speed=a.fx.speeds[b.speed]||a.fx.speeds._default),b.sync||(b.speed=b.speed/2),c.addClass(e.slideClass)},updateView:function(a,b){var c=this.opts();if(c._initialized){var d=c.API.getSlideOpts(),e=c.slides[c.currSlide];!a&&b!==!0&&(c.API.trigger("cycle-update-view-before",[c,d,e]),c.updateView<0)||(c.slideActiveClass&&c.slides.removeClass(c.slideActiveClass).eq(c.currSlide).addClass(c.slideActiveClass),a&&c.hideNonActive&&c.slides.filter(":not(."+c.slideActiveClass+")").css("visibility","hidden"),0===c.updateView&&setTimeout(function(){c.API.trigger("cycle-update-view",[c,d,e,a])},d.speed/(c.sync?2:1)),0!==c.updateView&&c.API.trigger("cycle-update-view",[c,d,e,a]),a&&c.API.trigger("cycle-update-view-after",[c,d,e]))}},getComponent:function(b){var c=this.opts(),d=c[b];return"string"==typeof d?/^\s*[\>|\+|~]/.test(d)?c.container.find(d):a(d):d.jquery?d:a(d)},stackSlides:function(b,c,d){var e=this.opts();b||(b=e.slides[e.currSlide],c=e.slides[e.nextSlide],d=!e.reverse),a(b).css("zIndex",e.maxZ);var f,g=e.maxZ-2,h=e.slideCount;if(d){for(f=e.currSlide+1;h>f;f++)a(e.slides[f]).css("zIndex",g--);for(f=0;f<e.currSlide;f++)a(e.slides[f]).css("zIndex",g--)}else{for(f=e.currSlide-1;f>=0;f--)a(e.slides[f]).css("zIndex",g--);for(f=h-1;f>e.currSlide;f--)a(e.slides[f]).css("zIndex",g--)}a(c).css("zIndex",e.maxZ-1)},getSlideIndex:function(a){return this.opts().slides.index(a)}},a.fn.cycle.log=function(){window.console&&console.log&&console.log("[cycle2] "+Array.prototype.join.call(arguments," "))},a.fn.cycle.version=function(){return"Cycle2: "+c},a.fn.cycle.transitions={custom:{},none:{before:function(a,b,c,d){a.API.stackSlides(c,b,d),a.cssBefore={opacity:1,visibility:"visible",display:"block"}}},fade:{before:function(b,c,d,e){var f=b.API.getSlideOpts(b.nextSlide).slideCss||{};b.API.stackSlides(c,d,e),b.cssBefore=a.extend(f,{opacity:0,visibility:"visible",display:"block"}),b.animIn={opacity:1},b.animOut={opacity:0}}},fadeout:{before:function(b,c,d,e){var f=b.API.getSlideOpts(b.nextSlide).slideCss||{};b.API.stackSlides(c,d,e),b.cssBefore=a.extend(f,{opacity:1,visibility:"visible",display:"block"}),b.animOut={opacity:0}}},scrollHorz:{before:function(a,b,c,d){a.API.stackSlides(b,c,d);var e=a.container.css("overflow","hidden").width();a.cssBefore={left:d?e:-e,top:0,opacity:1,visibility:"visible",display:"block"},a.cssAfter={zIndex:a._maxZ-2,left:0},a.animIn={left:0},a.animOut={left:d?-e:e}}}},a.fn.cycle.defaults={allowWrap:!0,autoSelector:".cycle-slideshow[data-cycle-auto-init!=false]",delay:0,easing:null,fx:"fade",hideNonActive:!0,loop:0,manualFx:void 0,manualSpeed:void 0,manualTrump:!0,maxZ:100,pauseOnHover:!1,reverse:!1,slideActiveClass:"cycle-slide-active",slideClass:"cycle-slide",slideCss:{position:"absolute",top:0,left:0},slides:"> img",speed:500,startingSlide:0,sync:!0,timeout:4e3,updateView:0},a(document).ready(function(){a(a.fn.cycle.defaults.autoSelector).cycle()})}(jQuery),/*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130913 */
// function(a){"use strict";function b(b,d){var e,f,g,h=d.autoHeight;if("container"==h)f=a(d.slides[d.currSlide]).outerHeight(),d.container.height(f);else if(d._autoHeightRatio)d.container.height(d.container.width()/d._autoHeightRatio);else if("calc"===h||"number"==a.type(h)&&h>=0){if(g="calc"===h?c(b,d):h>=d.slides.length?0:h,g==d._sentinelIndex)return;d._sentinelIndex=g,d._sentinel&&d._sentinel.remove(),e=a(d.slides[g].cloneNode(!0)),e.removeAttr("id name rel").find("[id],[name],[rel]").removeAttr("id name rel"),e.css({position:"static",visibility:"hidden",display:"block"}).prependTo(d.container).addClass("cycle-sentinel cycle-slide").removeClass("cycle-slide-active"),e.find("*").css("visibility","hidden"),d._sentinel=e}}function c(b,c){var d=0,e=-1;return c.slides.each(function(b){var c=a(this).height();c>e&&(e=c,d=b)}),d}function d(b,c,d,e){var f=a(e).outerHeight();c.container.animate({height:f},c.autoHeightSpeed,c.autoHeightEasing)}function e(c,f){f._autoHeightOnResize&&(a(window).off("resize orientationchange",f._autoHeightOnResize),f._autoHeightOnResize=null),f.container.off("cycle-slide-added cycle-slide-removed",b),f.container.off("cycle-destroyed",e),f.container.off("cycle-before",d),f._sentinel&&(f._sentinel.remove(),f._sentinel=null)}a.extend(a.fn.cycle.defaults,{autoHeight:0,autoHeightSpeed:250,autoHeightEasing:null}),a(document).on("cycle-initialized",function(c,f){function g(){b(c,f)}var h,i=f.autoHeight,j=a.type(i),k=null;("string"===j||"number"===j)&&(f.container.on("cycle-slide-added cycle-slide-removed",b),f.container.on("cycle-destroyed",e),"container"==i?f.container.on("cycle-before",d):"string"===j&&/\d+\:\d+/.test(i)&&(h=i.match(/(\d+)\:(\d+)/),h=h[1]/h[2],f._autoHeightRatio=h),"number"!==j&&(f._autoHeightOnResize=function(){clearTimeout(k),k=setTimeout(g,50)},a(window).on("resize orientationchange",f._autoHeightOnResize)),setTimeout(g,30))})}(jQuery),/*! caption plugin for Cycle2;  version: 20130306 */
// function(a){"use strict";a.extend(a.fn.cycle.defaults,{caption:"> .cycle-caption",captionTemplate:"{{slideNum}} / {{slideCount}}",overlay:"> .cycle-overlay",overlayTemplate:"<div>{{title}}</div><div>{{desc}}</div>",captionModule:"caption"}),a(document).on("cycle-update-view",function(b,c,d,e){if("caption"===c.captionModule){a.each(["caption","overlay"],function(){var a=this,b=d[a+"Template"],f=c.API.getComponent(a);f.length&&b?(f.html(c.API.tmpl(b,d,c,e)),f.show()):f.hide()})}}),a(document).on("cycle-destroyed",function(b,c){var d;a.each(["caption","overlay"],function(){var a=this,b=c[a+"Template"];c[a]&&b&&(d=c.API.getComponent("caption"),d.empty())})})}(jQuery),/*! command plugin for Cycle2;  version: 20140415 */
// function(a){"use strict";var b=a.fn.cycle;a.fn.cycle=function(c){var d,e,f,g=a.makeArray(arguments);return"number"==a.type(c)?this.cycle("goto",c):"string"==a.type(c)?this.each(function(){var h;return d=c,f=a(this).data("cycle.opts"),void 0===f?void b.log('slideshow must be initialized before sending commands; "'+d+'" ignored'):(d="goto"==d?"jump":d,e=f.API[d],a.isFunction(e)?(h=a.makeArray(g),h.shift(),e.apply(f.API,h)):void b.log("unknown command: ",d))}):b.apply(this,arguments)},a.extend(a.fn.cycle,b),a.extend(b.API,{next:function(){var a=this.opts();if(!a.busy||a.manualTrump){var b=a.reverse?-1:1;a.allowWrap===!1&&a.currSlide+b>=a.slideCount||(a.API.advanceSlide(b),a.API.trigger("cycle-next",[a]).log("cycle-next"))}},prev:function(){var a=this.opts();if(!a.busy||a.manualTrump){var b=a.reverse?1:-1;a.allowWrap===!1&&a.currSlide+b<0||(a.API.advanceSlide(b),a.API.trigger("cycle-prev",[a]).log("cycle-prev"))}},destroy:function(){this.stop();var b=this.opts(),c=a.isFunction(a._data)?a._data:a.noop;clearTimeout(b.timeoutId),b.timeoutId=0,b.API.stop(),b.API.trigger("cycle-destroyed",[b]).log("cycle-destroyed"),b.container.removeData(),c(b.container[0],"parsedAttrs",!1),b.retainStylesOnDestroy||(b.container.removeAttr("style"),b.slides.removeAttr("style"),b.slides.removeClass(b.slideActiveClass)),b.slides.each(function(){var d=a(this);d.removeData(),d.removeClass(b.slideClass),c(this,"parsedAttrs",!1)})},jump:function(a,b){var c,d=this.opts();if(!d.busy||d.manualTrump){var e=parseInt(a,10);if(isNaN(e)||0>e||e>=d.slides.length)return void d.API.log("goto: invalid slide index: "+e);if(e==d.currSlide)return void d.API.log("goto: skipping, already on slide",e);d.nextSlide=e,clearTimeout(d.timeoutId),d.timeoutId=0,d.API.log("goto: ",e," (zero-index)"),c=d.currSlide<d.nextSlide,d._tempFx=b,d.API.prepareTx(!0,c)}},stop:function(){var b=this.opts(),c=b.container;clearTimeout(b.timeoutId),b.timeoutId=0,b.API.stopTransition(),b.pauseOnHover&&(b.pauseOnHover!==!0&&(c=a(b.pauseOnHover)),c.off("mouseenter mouseleave")),b.API.trigger("cycle-stopped",[b]).log("cycle-stopped")},reinit:function(){var a=this.opts();a.API.destroy(),a.container.cycle()},remove:function(b){for(var c,d,e=this.opts(),f=[],g=1,h=0;h<e.slides.length;h++)c=e.slides[h],h==b?d=c:(f.push(c),a(c).data("cycle.opts").slideNum=g,g++);d&&(e.slides=a(f),e.slideCount--,a(d).remove(),b==e.currSlide?e.API.advanceSlide(1):b<e.currSlide?e.currSlide--:e.currSlide++,e.API.trigger("cycle-slide-removed",[e,b,d]).log("cycle-slide-removed"),e.API.updateView())}}),a(document).on("click.cycle","[data-cycle-cmd]",function(b){b.preventDefault();var c=a(this),d=c.data("cycle-cmd"),e=c.data("cycle-context")||".cycle-slideshow";a(e).cycle(d,c.data("cycle-arg"))})}(jQuery),/*! hash plugin for Cycle2;  version: 20130905 */
// function(a){"use strict";function b(b,c){var d;return b._hashFence?void(b._hashFence=!1):(d=window.location.hash.substring(1),void b.slides.each(function(e){if(a(this).data("cycle-hash")==d){if(c===!0)b.startingSlide=e;else{var f=b.currSlide<e;b.nextSlide=e,b.API.prepareTx(!0,f)}return!1}}))}a(document).on("cycle-pre-initialize",function(c,d){b(d,!0),d._onHashChange=function(){b(d,!1)},a(window).on("hashchange",d._onHashChange)}),a(document).on("cycle-update-view",function(a,b,c){c.hash&&"#"+c.hash!=window.location.hash&&(b._hashFence=!0,window.location.hash=c.hash)}),a(document).on("cycle-destroyed",function(b,c){c._onHashChange&&a(window).off("hashchange",c._onHashChange)})}(jQuery),/*! loader plugin for Cycle2;  version: 20131121 */
// function(a){"use strict";a.extend(a.fn.cycle.defaults,{loader:!1}),a(document).on("cycle-bootstrap",function(b,c){function d(b,d){function f(b){var f;"wait"==c.loader?(h.push(b),0===j&&(h.sort(g),e.apply(c.API,[h,d]),c.container.removeClass("cycle-loading"))):(f=a(c.slides[c.currSlide]),e.apply(c.API,[b,d]),f.show(),c.container.removeClass("cycle-loading"))}function g(a,b){return a.data("index")-b.data("index")}var h=[];if("string"==a.type(b))b=a.trim(b);else if("array"===a.type(b))for(var i=0;i<b.length;i++)b[i]=a(b[i])[0];b=a(b);var j=b.length;j&&(b.css("visibility","hidden").appendTo("body").each(function(b){function g(){0===--i&&(--j,f(k))}var i=0,k=a(this),l=k.is("img")?k:k.find("img");return k.data("index",b),l=l.filter(":not(.cycle-loader-ignore)").filter(':not([src=""])'),l.length?(i=l.length,void l.each(function(){this.complete?g():a(this).load(function(){g()}).on("error",function(){0===--i&&(c.API.log("slide skipped; img not loaded:",this.src),0===--j&&"wait"==c.loader&&e.apply(c.API,[h,d]))})})):(--j,void h.push(k))}),j&&c.container.addClass("cycle-loading"))}var e;c.loader&&(e=c.API.add,c.API.add=d)})}(jQuery),/*! pager plugin for Cycle2;  version: 20140415 */
// function(a){"use strict";function b(b,c,d){var e,f=b.API.getComponent("pager");f.each(function(){var f=a(this);if(c.pagerTemplate){var g=b.API.tmpl(c.pagerTemplate,c,b,d[0]);e=a(g).appendTo(f)}else e=f.children().eq(b.slideCount-1);e.on(b.pagerEvent,function(a){b.pagerEventBubble||a.preventDefault(),b.API.page(f,a.currentTarget)})})}function c(a,b){var c=this.opts();if(!c.busy||c.manualTrump){var d=a.children().index(b),e=d,f=c.currSlide<e;c.currSlide!=e&&(c.nextSlide=e,c._tempFx=c.pagerFx,c.API.prepareTx(!0,f),c.API.trigger("cycle-pager-activated",[c,a,b]))}}a.extend(a.fn.cycle.defaults,{pager:"> .cycle-pager",pagerActiveClass:"cycle-pager-active",pagerEvent:"click.cycle",pagerEventBubble:void 0,pagerTemplate:"<span>&bull;</span>"}),a(document).on("cycle-bootstrap",function(a,c,d){d.buildPagerLink=b}),a(document).on("cycle-slide-added",function(a,b,d,e){b.pager&&(b.API.buildPagerLink(b,d,e),b.API.page=c)}),a(document).on("cycle-slide-removed",function(b,c,d){if(c.pager){var e=c.API.getComponent("pager");e.each(function(){var b=a(this);a(b.children()[d]).remove()})}}),a(document).on("cycle-update-view",function(b,c){var d;c.pager&&(d=c.API.getComponent("pager"),d.each(function(){a(this).children().removeClass(c.pagerActiveClass).eq(c.currSlide).addClass(c.pagerActiveClass)}))}),a(document).on("cycle-destroyed",function(a,b){var c=b.API.getComponent("pager");c&&(c.children().off(b.pagerEvent),b.pagerTemplate&&c.empty())})}(jQuery),/*! prevnext plugin for Cycle2;  version: 20140408 */
// function(a){"use strict";a.extend(a.fn.cycle.defaults,{next:"> .cycle-next",nextEvent:"click.cycle",disabledClass:"disabled",prev:"> .cycle-prev",prevEvent:"click.cycle",swipe:!1}),a(document).on("cycle-initialized",function(a,b){if(b.API.getComponent("next").on(b.nextEvent,function(a){a.preventDefault(),b.API.next()}),b.API.getComponent("prev").on(b.prevEvent,function(a){a.preventDefault(),b.API.prev()}),b.swipe){var c=b.swipeVert?"swipeUp.cycle":"swipeLeft.cycle swipeleft.cycle",d=b.swipeVert?"swipeDown.cycle":"swipeRight.cycle swiperight.cycle";b.container.on(c,function(){b._tempFx=b.swipeFx,b.API.next()}),b.container.on(d,function(){b._tempFx=b.swipeFx,b.API.prev()})}}),a(document).on("cycle-update-view",function(a,b){if(!b.allowWrap){var c=b.disabledClass,d=b.API.getComponent("next"),e=b.API.getComponent("prev"),f=b._prevBoundry||0,g=void 0!==b._nextBoundry?b._nextBoundry:b.slideCount-1;b.currSlide==g?d.addClass(c).prop("disabled",!0):d.removeClass(c).prop("disabled",!1),b.currSlide===f?e.addClass(c).prop("disabled",!0):e.removeClass(c).prop("disabled",!1)}}),a(document).on("cycle-destroyed",function(a,b){b.API.getComponent("prev").off(b.nextEvent),b.API.getComponent("next").off(b.prevEvent),b.container.off("swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle")})}(jQuery),/*! progressive loader plugin for Cycle2;  version: 20130315 */
// function(a){"use strict";a.extend(a.fn.cycle.defaults,{progressive:!1}),a(document).on("cycle-pre-initialize",function(b,c){if(c.progressive){var d,e,f=c.API,g=f.next,h=f.prev,i=f.prepareTx,j=a.type(c.progressive);if("array"==j)d=c.progressive;else if(a.isFunction(c.progressive))d=c.progressive(c);else if("string"==j){if(e=a(c.progressive),d=a.trim(e.html()),!d)return;if(/^(\[)/.test(d))try{d=a.parseJSON(d)}catch(k){return void f.log("error parsing progressive slides",k)}else d=d.split(new RegExp(e.data("cycle-split")||"\n")),d[d.length-1]||d.pop()}i&&(f.prepareTx=function(a,b){var e,f;return a||0===d.length?void i.apply(c.API,[a,b]):void(b&&c.currSlide==c.slideCount-1?(f=d[0],d=d.slice(1),c.container.one("cycle-slide-added",function(a,b){setTimeout(function(){b.API.advanceSlide(1)},50)}),c.API.add(f)):b||0!==c.currSlide?i.apply(c.API,[a,b]):(e=d.length-1,f=d[e],d=d.slice(0,e),c.container.one("cycle-slide-added",function(a,b){setTimeout(function(){b.currSlide=1,b.API.advanceSlide(-1)},50)}),c.API.add(f,!0)))}),g&&(f.next=function(){var a=this.opts();if(d.length&&a.currSlide==a.slideCount-1){var b=d[0];d=d.slice(1),a.container.one("cycle-slide-added",function(a,b){g.apply(b.API),b.container.removeClass("cycle-loading")}),a.container.addClass("cycle-loading"),a.API.add(b)}else g.apply(a.API)}),h&&(f.prev=function(){var a=this.opts();if(d.length&&0===a.currSlide){var b=d.length-1,c=d[b];d=d.slice(0,b),a.container.one("cycle-slide-added",function(a,b){b.currSlide=1,b.API.advanceSlide(-1),b.container.removeClass("cycle-loading")}),a.container.addClass("cycle-loading"),a.API.add(c,!0)}else h.apply(a.API)})}})}(jQuery),/*! tmpl plugin for Cycle2;  version: 20121227 */
// function(a){"use strict";a.extend(a.fn.cycle.defaults,{tmplRegex:"{{((.)?.*?)}}"}),a.extend(a.fn.cycle.API,{tmpl:function(b,c){var d=new RegExp(c.tmplRegex||a.fn.cycle.defaults.tmplRegex,"g"),e=a.makeArray(arguments);return e.shift(),b.replace(d,function(b,c){var d,f,g,h,i=c.split(".");for(d=0;d<e.length;d++)if(g=e[d]){if(i.length>1)for(h=g,f=0;f<i.length;f++)g=h,h=h[i[f]]||c;else h=g[c];if(a.isFunction(h))return h.apply(g,e);if(void 0!==h&&null!==h&&h!=c)return h}return c})}})}(jQuery);
// //# sourceMappingURL=jquery.cycle2.js.map

/*!
* jQuery Cycle2; version: 2.1.6 build: 20141007
* http://jquery.malsup.com/cycle2/
* Copyright (c) 2014 M. Alsup; Dual licensed: MIT/GPL
*/
// !function(a){"use strict";function b(a){return(a||"").toLowerCase()}var c="2.1.6";a.fn.cycle=function(c){var d;return 0!==this.length||a.isReady?this.each(function(){var d,e,f,g,h=a(this),i=a.fn.cycle.log;if(!h.data("cycle.opts")){(h.data("cycle-log")===!1||c&&c.log===!1||e&&e.log===!1)&&(i=a.noop),i("--c2 init--"),d=h.data();for(var j in d)d.hasOwnProperty(j)&&/^cycle[A-Z]+/.test(j)&&(g=d[j],f=j.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,b),i(f+":",g,"("+typeof g+")"),d[f]=g);e=a.extend({},a.fn.cycle.defaults,d,c||{}),e.timeoutId=0,e.paused=e.paused||!1,e.container=h,e._maxZ=e.maxZ,e.API=a.extend({_container:h},a.fn.cycle.API),e.API.log=i,e.API.trigger=function(a,b){return e.container.trigger(a,b),e.API},h.data("cycle.opts",e),h.data("cycle.API",e.API),e.API.trigger("cycle-bootstrap",[e,e.API]),e.API.addInitialSlides(),e.API.preInitSlideshow(),e.slides.length&&e.API.initSlideshow()}}):(d={s:this.selector,c:this.context},a.fn.cycle.log("requeuing slideshow (dom not ready)"),a(function(){a(d.s,d.c).cycle(c)}),this)},a.fn.cycle.API={opts:function(){return this._container.data("cycle.opts")},addInitialSlides:function(){var b=this.opts(),c=b.slides;b.slideCount=0,b.slides=a(),c=c.jquery?c:b.container.find(c),b.random&&c.sort(function(){return Math.random()-.5}),b.API.add(c)},preInitSlideshow:function(){var b=this.opts();b.API.trigger("cycle-pre-initialize",[b]);var c=a.fn.cycle.transitions[b.fx];c&&a.isFunction(c.preInit)&&c.preInit(b),b._preInitialized=!0},postInitSlideshow:function(){var b=this.opts();b.API.trigger("cycle-post-initialize",[b]);var c=a.fn.cycle.transitions[b.fx];c&&a.isFunction(c.postInit)&&c.postInit(b)},initSlideshow:function(){var b,c=this.opts(),d=c.container;c.API.calcFirstSlide(),"static"==c.container.css("position")&&c.container.css("position","relative"),a(c.slides[c.currSlide]).css({opacity:1,display:"block",visibility:"visible"}),c.API.stackSlides(c.slides[c.currSlide],c.slides[c.nextSlide],!c.reverse),c.pauseOnHover&&(c.pauseOnHover!==!0&&(d=a(c.pauseOnHover)),d.hover(function(){c.API.pause(!0)},function(){c.API.resume(!0)})),c.timeout&&(b=c.API.getSlideOpts(c.currSlide),c.API.queueTransition(b,b.timeout+c.delay)),c._initialized=!0,c.API.updateView(!0),c.API.trigger("cycle-initialized",[c]),c.API.postInitSlideshow()},pause:function(b){var c=this.opts(),d=c.API.getSlideOpts(),e=c.hoverPaused||c.paused;b?c.hoverPaused=!0:c.paused=!0,e||(c.container.addClass("cycle-paused"),c.API.trigger("cycle-paused",[c]).log("cycle-paused"),d.timeout&&(clearTimeout(c.timeoutId),c.timeoutId=0,c._remainingTimeout-=a.now()-c._lastQueue,(c._remainingTimeout<0||isNaN(c._remainingTimeout))&&(c._remainingTimeout=void 0)))},resume:function(a){var b=this.opts(),c=!b.hoverPaused&&!b.paused;a?b.hoverPaused=!1:b.paused=!1,c||(b.container.removeClass("cycle-paused"),0===b.slides.filter(":animated").length&&b.API.queueTransition(b.API.getSlideOpts(),b._remainingTimeout),b.API.trigger("cycle-resumed",[b,b._remainingTimeout]).log("cycle-resumed"))},add:function(b,c){var d,e=this.opts(),f=e.slideCount,g=!1;"string"==a.type(b)&&(b=a.trim(b)),a(b).each(function(){var b,d=a(this);c?e.container.prepend(d):e.container.append(d),e.slideCount++,b=e.API.buildSlideOpts(d),e.slides=c?a(d).add(e.slides):e.slides.add(d),e.API.initSlide(b,d,--e._maxZ),d.data("cycle.opts",b),e.API.trigger("cycle-slide-added",[e,b,d])}),e.API.updateView(!0),g=e._preInitialized&&2>f&&e.slideCount>=1,g&&(e._initialized?e.timeout&&(d=e.slides.length,e.nextSlide=e.reverse?d-1:1,e.timeoutId||e.API.queueTransition(e)):e.API.initSlideshow())},calcFirstSlide:function(){var a,b=this.opts();a=parseInt(b.startingSlide||0,10),(a>=b.slides.length||0>a)&&(a=0),b.currSlide=a,b.reverse?(b.nextSlide=a-1,b.nextSlide<0&&(b.nextSlide=b.slides.length-1)):(b.nextSlide=a+1,b.nextSlide==b.slides.length&&(b.nextSlide=0))},calcNextSlide:function(){var a,b=this.opts();b.reverse?(a=b.nextSlide-1<0,b.nextSlide=a?b.slideCount-1:b.nextSlide-1,b.currSlide=a?0:b.nextSlide+1):(a=b.nextSlide+1==b.slides.length,b.nextSlide=a?0:b.nextSlide+1,b.currSlide=a?b.slides.length-1:b.nextSlide-1)},calcTx:function(b,c){var d,e=b;return e._tempFx?d=a.fn.cycle.transitions[e._tempFx]:c&&e.manualFx&&(d=a.fn.cycle.transitions[e.manualFx]),d||(d=a.fn.cycle.transitions[e.fx]),e._tempFx=null,this.opts()._tempFx=null,d||(d=a.fn.cycle.transitions.fade,e.API.log('Transition "'+e.fx+'" not found.  Using fade.')),d},prepareTx:function(a,b){var c,d,e,f,g,h=this.opts();return h.slideCount<2?void(h.timeoutId=0):(!a||h.busy&&!h.manualTrump||(h.API.stopTransition(),h.busy=!1,clearTimeout(h.timeoutId),h.timeoutId=0),void(h.busy||(0!==h.timeoutId||a)&&(d=h.slides[h.currSlide],e=h.slides[h.nextSlide],f=h.API.getSlideOpts(h.nextSlide),g=h.API.calcTx(f,a),h._tx=g,a&&void 0!==f.manualSpeed&&(f.speed=f.manualSpeed),h.nextSlide!=h.currSlide&&(a||!h.paused&&!h.hoverPaused&&h.timeout)?(h.API.trigger("cycle-before",[f,d,e,b]),g.before&&g.before(f,d,e,b),c=function(){h.busy=!1,h.container.data("cycle.opts")&&(g.after&&g.after(f,d,e,b),h.API.trigger("cycle-after",[f,d,e,b]),h.API.queueTransition(f),h.API.updateView(!0))},h.busy=!0,g.transition?g.transition(f,d,e,b,c):h.API.doTransition(f,d,e,b,c),h.API.calcNextSlide(),h.API.updateView()):h.API.queueTransition(f))))},doTransition:function(b,c,d,e,f){var g=b,h=a(c),i=a(d),j=function(){i.animate(g.animIn||{opacity:1},g.speed,g.easeIn||g.easing,f)};i.css(g.cssBefore||{}),h.animate(g.animOut||{},g.speed,g.easeOut||g.easing,function(){h.css(g.cssAfter||{}),g.sync||j()}),g.sync&&j()},queueTransition:function(b,c){var d=this.opts(),e=void 0!==c?c:b.timeout;return 0===d.nextSlide&&0===--d.loop?(d.API.log("terminating; loop=0"),d.timeout=0,e?setTimeout(function(){d.API.trigger("cycle-finished",[d])},e):d.API.trigger("cycle-finished",[d]),void(d.nextSlide=d.currSlide)):void 0!==d.continueAuto&&(d.continueAuto===!1||a.isFunction(d.continueAuto)&&d.continueAuto()===!1)?(d.API.log("terminating automatic transitions"),d.timeout=0,void(d.timeoutId&&clearTimeout(d.timeoutId))):void(e&&(d._lastQueue=a.now(),void 0===c&&(d._remainingTimeout=b.timeout),d.paused||d.hoverPaused||(d.timeoutId=setTimeout(function(){d.API.prepareTx(!1,!d.reverse)},e))))},stopTransition:function(){var a=this.opts();a.slides.filter(":animated").length&&(a.slides.stop(!1,!0),a.API.trigger("cycle-transition-stopped",[a])),a._tx&&a._tx.stopTransition&&a._tx.stopTransition(a)},advanceSlide:function(a){var b=this.opts();return clearTimeout(b.timeoutId),b.timeoutId=0,b.nextSlide=b.currSlide+a,b.nextSlide<0?b.nextSlide=b.slides.length-1:b.nextSlide>=b.slides.length&&(b.nextSlide=0),b.API.prepareTx(!0,a>=0),!1},buildSlideOpts:function(c){var d,e,f=this.opts(),g=c.data()||{};for(var h in g)g.hasOwnProperty(h)&&/^cycle[A-Z]+/.test(h)&&(d=g[h],e=h.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,b),f.API.log("["+(f.slideCount-1)+"]",e+":",d,"("+typeof d+")"),g[e]=d);g=a.extend({},a.fn.cycle.defaults,f,g),g.slideNum=f.slideCount;try{delete g.API,delete g.slideCount,delete g.currSlide,delete g.nextSlide,delete g.slides}catch(i){}return g},getSlideOpts:function(b){var c=this.opts();void 0===b&&(b=c.currSlide);var d=c.slides[b],e=a(d).data("cycle.opts");return a.extend({},c,e)},initSlide:function(b,c,d){var e=this.opts();c.css(b.slideCss||{}),d>0&&c.css("zIndex",d),isNaN(b.speed)&&(b.speed=a.fx.speeds[b.speed]||a.fx.speeds._default),b.sync||(b.speed=b.speed/2),c.addClass(e.slideClass)},updateView:function(a,b){var c=this.opts();if(c._initialized){var d=c.API.getSlideOpts(),e=c.slides[c.currSlide];!a&&b!==!0&&(c.API.trigger("cycle-update-view-before",[c,d,e]),c.updateView<0)||(c.slideActiveClass&&c.slides.removeClass(c.slideActiveClass).eq(c.currSlide).addClass(c.slideActiveClass),a&&c.hideNonActive&&c.slides.filter(":not(."+c.slideActiveClass+")").css("visibility","hidden"),0===c.updateView&&setTimeout(function(){c.API.trigger("cycle-update-view",[c,d,e,a])},d.speed/(c.sync?2:1)),0!==c.updateView&&c.API.trigger("cycle-update-view",[c,d,e,a]),a&&c.API.trigger("cycle-update-view-after",[c,d,e]))}},getComponent:function(b){var c=this.opts(),d=c[b];return"string"==typeof d?/^\s*[\>|\+|~]/.test(d)?c.container.find(d):a(d):d.jquery?d:a(d)},stackSlides:function(b,c,d){var e=this.opts();b||(b=e.slides[e.currSlide],c=e.slides[e.nextSlide],d=!e.reverse),a(b).css("zIndex",e.maxZ);var f,g=e.maxZ-2,h=e.slideCount;if(d){for(f=e.currSlide+1;h>f;f++)a(e.slides[f]).css("zIndex",g--);for(f=0;f<e.currSlide;f++)a(e.slides[f]).css("zIndex",g--)}else{for(f=e.currSlide-1;f>=0;f--)a(e.slides[f]).css("zIndex",g--);for(f=h-1;f>e.currSlide;f--)a(e.slides[f]).css("zIndex",g--)}a(c).css("zIndex",e.maxZ-1)},getSlideIndex:function(a){return this.opts().slides.index(a)}},a.fn.cycle.log=function(){window.console&&console.log&&console.log("[cycle2] "+Array.prototype.join.call(arguments," "))},a.fn.cycle.version=function(){return"Cycle2: "+c},a.fn.cycle.transitions={custom:{},none:{before:function(a,b,c,d){a.API.stackSlides(c,b,d),a.cssBefore={opacity:1,visibility:"visible",display:"block"}}},fade:{before:function(b,c,d,e){var f=b.API.getSlideOpts(b.nextSlide).slideCss||{};b.API.stackSlides(c,d,e),b.cssBefore=a.extend(f,{opacity:0,visibility:"visible",display:"block"}),b.animIn={opacity:1},b.animOut={opacity:0}}},fadeout:{before:function(b,c,d,e){var f=b.API.getSlideOpts(b.nextSlide).slideCss||{};b.API.stackSlides(c,d,e),b.cssBefore=a.extend(f,{opacity:1,visibility:"visible",display:"block"}),b.animOut={opacity:0}}},scrollHorz:{before:function(a,b,c,d){a.API.stackSlides(b,c,d);var e=a.container.css("overflow","hidden").width();a.cssBefore={left:d?e:-e,top:0,opacity:1,visibility:"visible",display:"block"},a.cssAfter={zIndex:a._maxZ-2,left:0},a.animIn={left:0},a.animOut={left:d?-e:e}}}},a.fn.cycle.defaults={allowWrap:!0,autoSelector:".cycle-slideshow[data-cycle-auto-init!=false]",delay:0,easing:null,fx:"fade",hideNonActive:!0,loop:0,manualFx:void 0,manualSpeed:void 0,manualTrump:!0,maxZ:100,pauseOnHover:!1,reverse:!1,slideActiveClass:"cycle-slide-active",slideClass:"cycle-slide",slideCss:{position:"absolute",top:0,left:0},slides:"> img",speed:500,startingSlide:0,sync:!0,timeout:4e3,updateView:0},a(document).ready(function(){a(a.fn.cycle.defaults.autoSelector).cycle()})}(jQuery),/*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130913 */
// function(a){"use strict";function b(b,d){var e,f,g,h=d.autoHeight;if("container"==h)f=a(d.slides[d.currSlide]).outerHeight(),d.container.height(f);else if(d._autoHeightRatio)d.container.height(d.container.width()/d._autoHeightRatio);else if("calc"===h||"number"==a.type(h)&&h>=0){if(g="calc"===h?c(b,d):h>=d.slides.length?0:h,g==d._sentinelIndex)return;d._sentinelIndex=g,d._sentinel&&d._sentinel.remove(),e=a(d.slides[g].cloneNode(!0)),e.removeAttr("id name rel").find("[id],[name],[rel]").removeAttr("id name rel"),e.css({position:"static",visibility:"hidden",display:"block"}).prependTo(d.container).addClass("cycle-sentinel cycle-slide").removeClass("cycle-slide-active"),e.find("*").css("visibility","hidden"),d._sentinel=e}}function c(b,c){var d=0,e=-1;return c.slides.each(function(b){var c=a(this).height();c>e&&(e=c,d=b)}),d}function d(b,c,d,e){var f=a(e).outerHeight();c.container.animate({height:f},c.autoHeightSpeed,c.autoHeightEasing)}function e(c,f){f._autoHeightOnResize&&(a(window).off("resize orientationchange",f._autoHeightOnResize),f._autoHeightOnResize=null),f.container.off("cycle-slide-added cycle-slide-removed",b),f.container.off("cycle-destroyed",e),f.container.off("cycle-before",d),f._sentinel&&(f._sentinel.remove(),f._sentinel=null)}a.extend(a.fn.cycle.defaults,{autoHeight:0,autoHeightSpeed:250,autoHeightEasing:null}),a(document).on("cycle-initialized",function(c,f){function g(){b(c,f)}var h,i=f.autoHeight,j=a.type(i),k=null;("string"===j||"number"===j)&&(f.container.on("cycle-slide-added cycle-slide-removed",b),f.container.on("cycle-destroyed",e),"container"==i?f.container.on("cycle-before",d):"string"===j&&/\d+\:\d+/.test(i)&&(h=i.match(/(\d+)\:(\d+)/),h=h[1]/h[2],f._autoHeightRatio=h),"number"!==j&&(f._autoHeightOnResize=function(){clearTimeout(k),k=setTimeout(g,50)},a(window).on("resize orientationchange",f._autoHeightOnResize)),setTimeout(g,30))})}(jQuery),/*! caption plugin for Cycle2;  version: 20130306 */
// function(a){"use strict";a.extend(a.fn.cycle.defaults,{caption:"> .cycle-caption",captionTemplate:"{{slideNum}} / {{slideCount}}",overlay:"> .cycle-overlay",overlayTemplate:"<div>{{title}}</div><div>{{desc}}</div>",captionModule:"caption"}),a(document).on("cycle-update-view",function(b,c,d,e){if("caption"===c.captionModule){a.each(["caption","overlay"],function(){var a=this,b=d[a+"Template"],f=c.API.getComponent(a);f.length&&b?(f.html(c.API.tmpl(b,d,c,e)),f.show()):f.hide()})}}),a(document).on("cycle-destroyed",function(b,c){var d;a.each(["caption","overlay"],function(){var a=this,b=c[a+"Template"];c[a]&&b&&(d=c.API.getComponent("caption"),d.empty())})})}(jQuery),/*! command plugin for Cycle2;  version: 20140415 */
// function(a){"use strict";var b=a.fn.cycle;a.fn.cycle=function(c){var d,e,f,g=a.makeArray(arguments);return"number"==a.type(c)?this.cycle("goto",c):"string"==a.type(c)?this.each(function(){var h;return d=c,f=a(this).data("cycle.opts"),void 0===f?void b.log('slideshow must be initialized before sending commands; "'+d+'" ignored'):(d="goto"==d?"jump":d,e=f.API[d],a.isFunction(e)?(h=a.makeArray(g),h.shift(),e.apply(f.API,h)):void b.log("unknown command: ",d))}):b.apply(this,arguments)},a.extend(a.fn.cycle,b),a.extend(b.API,{next:function(){var a=this.opts();if(!a.busy||a.manualTrump){var b=a.reverse?-1:1;a.allowWrap===!1&&a.currSlide+b>=a.slideCount||(a.API.advanceSlide(b),a.API.trigger("cycle-next",[a]).log("cycle-next"))}},prev:function(){var a=this.opts();if(!a.busy||a.manualTrump){var b=a.reverse?1:-1;a.allowWrap===!1&&a.currSlide+b<0||(a.API.advanceSlide(b),a.API.trigger("cycle-prev",[a]).log("cycle-prev"))}},destroy:function(){this.stop();var b=this.opts(),c=a.isFunction(a._data)?a._data:a.noop;clearTimeout(b.timeoutId),b.timeoutId=0,b.API.stop(),b.API.trigger("cycle-destroyed",[b]).log("cycle-destroyed"),b.container.removeData(),c(b.container[0],"parsedAttrs",!1),b.retainStylesOnDestroy||(b.container.removeAttr("style"),b.slides.removeAttr("style"),b.slides.removeClass(b.slideActiveClass)),b.slides.each(function(){var d=a(this);d.removeData(),d.removeClass(b.slideClass),c(this,"parsedAttrs",!1)})},jump:function(a,b){var c,d=this.opts();if(!d.busy||d.manualTrump){var e=parseInt(a,10);if(isNaN(e)||0>e||e>=d.slides.length)return void d.API.log("goto: invalid slide index: "+e);if(e==d.currSlide)return void d.API.log("goto: skipping, already on slide",e);d.nextSlide=e,clearTimeout(d.timeoutId),d.timeoutId=0,d.API.log("goto: ",e," (zero-index)"),c=d.currSlide<d.nextSlide,d._tempFx=b,d.API.prepareTx(!0,c)}},stop:function(){var b=this.opts(),c=b.container;clearTimeout(b.timeoutId),b.timeoutId=0,b.API.stopTransition(),b.pauseOnHover&&(b.pauseOnHover!==!0&&(c=a(b.pauseOnHover)),c.off("mouseenter mouseleave")),b.API.trigger("cycle-stopped",[b]).log("cycle-stopped")},reinit:function(){var a=this.opts();a.API.destroy(),a.container.cycle()},remove:function(b){for(var c,d,e=this.opts(),f=[],g=1,h=0;h<e.slides.length;h++)c=e.slides[h],h==b?d=c:(f.push(c),a(c).data("cycle.opts").slideNum=g,g++);d&&(e.slides=a(f),e.slideCount--,a(d).remove(),b==e.currSlide?e.API.advanceSlide(1):b<e.currSlide?e.currSlide--:e.currSlide++,e.API.trigger("cycle-slide-removed",[e,b,d]).log("cycle-slide-removed"),e.API.updateView())}}),a(document).on("click.cycle","[data-cycle-cmd]",function(b){b.preventDefault();var c=a(this),d=c.data("cycle-cmd"),e=c.data("cycle-context")||".cycle-slideshow";a(e).cycle(d,c.data("cycle-arg"))})}(jQuery),/*! hash plugin for Cycle2;  version: 20130905 */
// function(a){"use strict";function b(b,c){var d;return b._hashFence?void(b._hashFence=!1):(d=window.location.hash.substring(1),void b.slides.each(function(e){if(a(this).data("cycle-hash")==d){if(c===!0)b.startingSlide=e;else{var f=b.currSlide<e;b.nextSlide=e,b.API.prepareTx(!0,f)}return!1}}))}a(document).on("cycle-pre-initialize",function(c,d){b(d,!0),d._onHashChange=function(){b(d,!1)},a(window).on("hashchange",d._onHashChange)}),a(document).on("cycle-update-view",function(a,b,c){c.hash&&"#"+c.hash!=window.location.hash&&(b._hashFence=!0,window.location.hash=c.hash)}),a(document).on("cycle-destroyed",function(b,c){c._onHashChange&&a(window).off("hashchange",c._onHashChange)})}(jQuery),/*! loader plugin for Cycle2;  version: 20131121 */
// function(a){"use strict";a.extend(a.fn.cycle.defaults,{loader:!1}),a(document).on("cycle-bootstrap",function(b,c){function d(b,d){function f(b){var f;"wait"==c.loader?(h.push(b),0===j&&(h.sort(g),e.apply(c.API,[h,d]),c.container.removeClass("cycle-loading"))):(f=a(c.slides[c.currSlide]),e.apply(c.API,[b,d]),f.show(),c.container.removeClass("cycle-loading"))}function g(a,b){return a.data("index")-b.data("index")}var h=[];if("string"==a.type(b))b=a.trim(b);else if("array"===a.type(b))for(var i=0;i<b.length;i++)b[i]=a(b[i])[0];b=a(b);var j=b.length;j&&(b.css("visibility","hidden").appendTo("body").each(function(b){function g(){0===--i&&(--j,f(k))}var i=0,k=a(this),l=k.is("img")?k:k.find("img");return k.data("index",b),l=l.filter(":not(.cycle-loader-ignore)").filter(':not([src=""])'),l.length?(i=l.length,void l.each(function(){this.complete?g():a(this).load(function(){g()}).on("error",function(){0===--i&&(c.API.log("slide skipped; img not loaded:",this.src),0===--j&&"wait"==c.loader&&e.apply(c.API,[h,d]))})})):(--j,void h.push(k))}),j&&c.container.addClass("cycle-loading"))}var e;c.loader&&(e=c.API.add,c.API.add=d)})}(jQuery),/*! pager plugin for Cycle2;  version: 20140415 */
// function(a){"use strict";function b(b,c,d){var e,f=b.API.getComponent("pager");f.each(function(){var f=a(this);if(c.pagerTemplate){var g=b.API.tmpl(c.pagerTemplate,c,b,d[0]);e=a(g).appendTo(f)}else e=f.children().eq(b.slideCount-1);e.on(b.pagerEvent,function(a){b.pagerEventBubble||a.preventDefault(),b.API.page(f,a.currentTarget)})})}function c(a,b){var c=this.opts();if(!c.busy||c.manualTrump){var d=a.children().index(b),e=d,f=c.currSlide<e;c.currSlide!=e&&(c.nextSlide=e,c._tempFx=c.pagerFx,c.API.prepareTx(!0,f),c.API.trigger("cycle-pager-activated",[c,a,b]))}}a.extend(a.fn.cycle.defaults,{pager:"> .cycle-pager",pagerActiveClass:"cycle-pager-active",pagerEvent:"click.cycle",pagerEventBubble:void 0,pagerTemplate:"<span>&bull;</span>"}),a(document).on("cycle-bootstrap",function(a,c,d){d.buildPagerLink=b}),a(document).on("cycle-slide-added",function(a,b,d,e){b.pager&&(b.API.buildPagerLink(b,d,e),b.API.page=c)}),a(document).on("cycle-slide-removed",function(b,c,d){if(c.pager){var e=c.API.getComponent("pager");e.each(function(){var b=a(this);a(b.children()[d]).remove()})}}),a(document).on("cycle-update-view",function(b,c){var d;c.pager&&(d=c.API.getComponent("pager"),d.each(function(){a(this).children().removeClass(c.pagerActiveClass).eq(c.currSlide).addClass(c.pagerActiveClass)}))}),a(document).on("cycle-destroyed",function(a,b){var c=b.API.getComponent("pager");c&&(c.children().off(b.pagerEvent),b.pagerTemplate&&c.empty())})}(jQuery),/*! prevnext plugin for Cycle2;  version: 20140408 */
// function(a){"use strict";a.extend(a.fn.cycle.defaults,{next:"> .cycle-next",nextEvent:"click.cycle",disabledClass:"disabled",prev:"> .cycle-prev",prevEvent:"click.cycle",swipe:!1}),a(document).on("cycle-initialized",function(a,b){if(b.API.getComponent("next").on(b.nextEvent,function(a){a.preventDefault(),b.API.next()}),b.API.getComponent("prev").on(b.prevEvent,function(a){a.preventDefault(),b.API.prev()}),b.swipe){var c=b.swipeVert?"swipeUp.cycle":"swipeLeft.cycle swipeleft.cycle",d=b.swipeVert?"swipeDown.cycle":"swipeRight.cycle swiperight.cycle";b.container.on(c,function(){b._tempFx=b.swipeFx,b.API.next()}),b.container.on(d,function(){b._tempFx=b.swipeFx,b.API.prev()})}}),a(document).on("cycle-update-view",function(a,b){if(!b.allowWrap){var c=b.disabledClass,d=b.API.getComponent("next"),e=b.API.getComponent("prev"),f=b._prevBoundry||0,g=void 0!==b._nextBoundry?b._nextBoundry:b.slideCount-1;b.currSlide==g?d.addClass(c).prop("disabled",!0):d.removeClass(c).prop("disabled",!1),b.currSlide===f?e.addClass(c).prop("disabled",!0):e.removeClass(c).prop("disabled",!1)}}),a(document).on("cycle-destroyed",function(a,b){b.API.getComponent("prev").off(b.nextEvent),b.API.getComponent("next").off(b.prevEvent),b.container.off("swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle")})}(jQuery),/*! progressive loader plugin for Cycle2;  version: 20130315 */
// function(a){"use strict";a.extend(a.fn.cycle.defaults,{progressive:!1}),a(document).on("cycle-pre-initialize",function(b,c){if(c.progressive){var d,e,f=c.API,g=f.next,h=f.prev,i=f.prepareTx,j=a.type(c.progressive);if("array"==j)d=c.progressive;else if(a.isFunction(c.progressive))d=c.progressive(c);else if("string"==j){if(e=a(c.progressive),d=a.trim(e.html()),!d)return;if(/^(\[)/.test(d))try{d=a.parseJSON(d)}catch(k){return void f.log("error parsing progressive slides",k)}else d=d.split(new RegExp(e.data("cycle-split")||"\n")),d[d.length-1]||d.pop()}i&&(f.prepareTx=function(a,b){var e,f;return a||0===d.length?void i.apply(c.API,[a,b]):void(b&&c.currSlide==c.slideCount-1?(f=d[0],d=d.slice(1),c.container.one("cycle-slide-added",function(a,b){setTimeout(function(){b.API.advanceSlide(1)},50)}),c.API.add(f)):b||0!==c.currSlide?i.apply(c.API,[a,b]):(e=d.length-1,f=d[e],d=d.slice(0,e),c.container.one("cycle-slide-added",function(a,b){setTimeout(function(){b.currSlide=1,b.API.advanceSlide(-1)},50)}),c.API.add(f,!0)))}),g&&(f.next=function(){var a=this.opts();if(d.length&&a.currSlide==a.slideCount-1){var b=d[0];d=d.slice(1),a.container.one("cycle-slide-added",function(a,b){g.apply(b.API),b.container.removeClass("cycle-loading")}),a.container.addClass("cycle-loading"),a.API.add(b)}else g.apply(a.API)}),h&&(f.prev=function(){var a=this.opts();if(d.length&&0===a.currSlide){var b=d.length-1,c=d[b];d=d.slice(0,b),a.container.one("cycle-slide-added",function(a,b){b.currSlide=1,b.API.advanceSlide(-1),b.container.removeClass("cycle-loading")}),a.container.addClass("cycle-loading"),a.API.add(c,!0)}else h.apply(a.API)})}})}(jQuery),/*! tmpl plugin for Cycle2;  version: 20121227 */
// function(a){"use strict";a.extend(a.fn.cycle.defaults,{tmplRegex:"{{((.)?.*?)}}"}),a.extend(a.fn.cycle.API,{tmpl:function(b,c){var d=new RegExp(c.tmplRegex||a.fn.cycle.defaults.tmplRegex,"g"),e=a.makeArray(arguments);return e.shift(),b.replace(d,function(b,c){var d,f,g,h,i=c.split(".");for(d=0;d<e.length;d++)if(g=e[d]){if(i.length>1)for(h=g,f=0;f<i.length;f++)g=h,h=h[i[f]]||c;else h=g[c];if(a.isFunction(h))return h.apply(g,e);if(void 0!==h&&null!==h&&h!=c)return h}return c})}})}(jQuery);


/*!
* jQuery Cycle2; version: 2.1.6 build: 20141007
* http://jquery.malsup.com/cycle2/
* Copyright (c) 2014 M. Alsup; Dual licensed: MIT/GPL
*/

/* Cycle2 core engine */
;(function($) {
    "use strict";
    
    var version = '2.1.6';
    
    $.fn.cycle = function( options ) {
        // fix mistakes with the ready state
        var o;
        if ( this.length === 0 && !$.isReady ) {
            o = { s: this.selector, c: this.context };
            $.fn.cycle.log('requeuing slideshow (dom not ready)');
            $(function() {
                $( o.s, o.c ).cycle(options);
            });
            return this;
        }
    
        return this.each(function() {
            var data, opts, shortName, val;
            var container = $(this);
            var log = $.fn.cycle.log;
    
            if ( container.data('cycle.opts') )
                return; // already initialized
    
            if ( container.data('cycle-log') === false || 
                ( options && options.log === false ) ||
                ( opts && opts.log === false) ) {
                log = $.noop;
            }
    
            log('--c2 init--');
            data = container.data();
            for (var p in data) {
                // allow props to be accessed sans 'cycle' prefix and log the overrides
                if (data.hasOwnProperty(p) && /^cycle[A-Z]+/.test(p) ) {
                    val = data[p];
                    shortName = p.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, lowerCase);
                    log(shortName+':', val, '('+typeof val +')');
                    data[shortName] = val;
                }
            }
    
            opts = $.extend( {}, $.fn.cycle.defaults, data, options || {});
    
            opts.timeoutId = 0;
            opts.paused = opts.paused || false; // #57
            opts.container = container;
            opts._maxZ = opts.maxZ;
    
            opts.API = $.extend ( { _container: container }, $.fn.cycle.API );
            opts.API.log = log;
            opts.API.trigger = function( eventName, args ) {
                opts.container.trigger( eventName, args );
                return opts.API;
            };
    
            container.data( 'cycle.opts', opts );
            container.data( 'cycle.API', opts.API );
    
            // opportunity for plugins to modify opts and API
            opts.API.trigger('cycle-bootstrap', [ opts, opts.API ]);
    
            opts.API.addInitialSlides();
            opts.API.preInitSlideshow();
    
            if ( opts.slides.length )
                opts.API.initSlideshow();
        });
    };
    
    $.fn.cycle.API = {
        opts: function() {
            return this._container.data( 'cycle.opts' );
        },
        addInitialSlides: function() {
            var opts = this.opts();
            var slides = opts.slides;
            opts.slideCount = 0;
            opts.slides = $(); // empty set
            
            // add slides that already exist
            slides = slides.jquery ? slides : opts.container.find( slides );
    
            if ( opts.random ) {
                slides.sort(function() {return Math.random() - 0.5;});
            }
    
            opts.API.add( slides );
        },
    
        preInitSlideshow: function() {
            var opts = this.opts();
            opts.API.trigger('cycle-pre-initialize', [ opts ]);
            var tx = $.fn.cycle.transitions[opts.fx];
            if (tx && $.isFunction(tx.preInit))
                tx.preInit( opts );
            opts._preInitialized = true;
        },
    
        postInitSlideshow: function() {
            var opts = this.opts();
            opts.API.trigger('cycle-post-initialize', [ opts ]);
            var tx = $.fn.cycle.transitions[opts.fx];
            if (tx && $.isFunction(tx.postInit))
                tx.postInit( opts );
        },
    
        initSlideshow: function() {
            var opts = this.opts();
            var pauseObj = opts.container;
            var slideOpts;
            opts.API.calcFirstSlide();
    
            if ( opts.container.css('position') == 'static' )
                opts.container.css('position', 'relative');
    
            $(opts.slides[opts.currSlide]).css({
                opacity: 1,
                display: 'block',
                visibility: 'visible'
            });
            opts.API.stackSlides( opts.slides[opts.currSlide], opts.slides[opts.nextSlide], !opts.reverse );
    
            if ( opts.pauseOnHover ) {
                // allow pauseOnHover to specify an element
                if ( opts.pauseOnHover !== true )
                    pauseObj = $( opts.pauseOnHover );
    
                pauseObj.hover(
                    function(){ opts.API.pause( true ); }, 
                    function(){ opts.API.resume( true ); }
                );
            }
    
            // stage initial transition
            if ( opts.timeout ) {
                slideOpts = opts.API.getSlideOpts( opts.currSlide );
                opts.API.queueTransition( slideOpts, slideOpts.timeout + opts.delay );
            }
    
            opts._initialized = true;
            opts.API.updateView( true );
            opts.API.trigger('cycle-initialized', [ opts ]);
            opts.API.postInitSlideshow();
        },
    
        pause: function( hover ) {
            var opts = this.opts(),
                slideOpts = opts.API.getSlideOpts(),
                alreadyPaused = opts.hoverPaused || opts.paused;
    
            if ( hover )
                opts.hoverPaused = true; 
            else
                opts.paused = true;
    
            if ( ! alreadyPaused ) {
                opts.container.addClass('cycle-paused');
                opts.API.trigger('cycle-paused', [ opts ]).log('cycle-paused');
    
                if ( slideOpts.timeout ) {
                    clearTimeout( opts.timeoutId );
                    opts.timeoutId = 0;
                    
                    // determine how much time is left for the current slide
                    opts._remainingTimeout -= ( $.now() - opts._lastQueue );
                    if ( opts._remainingTimeout < 0 || isNaN(opts._remainingTimeout) )
                        opts._remainingTimeout = undefined;
                }
            }
        },
    
        resume: function( hover ) {
            var opts = this.opts(),
                alreadyResumed = !opts.hoverPaused && !opts.paused,
                remaining;
    
            if ( hover )
                opts.hoverPaused = false; 
            else
                opts.paused = false;
    
        
            if ( ! alreadyResumed ) {
                opts.container.removeClass('cycle-paused');
                // #gh-230; if an animation is in progress then don't queue a new transition; it will
                // happen naturally
                if ( opts.slides.filter(':animated').length === 0 )
                    opts.API.queueTransition( opts.API.getSlideOpts(), opts._remainingTimeout );
                opts.API.trigger('cycle-resumed', [ opts, opts._remainingTimeout ] ).log('cycle-resumed');
            }
        },
    
        add: function( slides, prepend ) {
            var opts = this.opts();
            var oldSlideCount = opts.slideCount;
            var startSlideshow = false;
            var len;
    
            if ( $.type(slides) == 'string')
                slides = $.trim( slides );
    
            $( slides ).each(function(i) {
                var slideOpts;
                var slide = $(this);
    
                if ( prepend )
                    opts.container.prepend( slide );
                else
                    opts.container.append( slide );
    
                opts.slideCount++;
                slideOpts = opts.API.buildSlideOpts( slide );
    
                if ( prepend )
                    opts.slides = $( slide ).add( opts.slides );
                else
                    opts.slides = opts.slides.add( slide );
    
                opts.API.initSlide( slideOpts, slide, --opts._maxZ );
    
                slide.data('cycle.opts', slideOpts);
                opts.API.trigger('cycle-slide-added', [ opts, slideOpts, slide ]);
            });
    
            opts.API.updateView( true );
    
            startSlideshow = opts._preInitialized && (oldSlideCount < 2 && opts.slideCount >= 1);
            if ( startSlideshow ) {
                if ( !opts._initialized )
                    opts.API.initSlideshow();
                else if ( opts.timeout ) {
                    len = opts.slides.length;
                    opts.nextSlide = opts.reverse ? len - 1 : 1;
                    if ( !opts.timeoutId ) {
                        opts.API.queueTransition( opts );
                    }
                }
            }
        },
    
        calcFirstSlide: function() {
            var opts = this.opts();
            var firstSlideIndex;
            firstSlideIndex = parseInt( opts.startingSlide || 0, 10 );
            if (firstSlideIndex >= opts.slides.length || firstSlideIndex < 0)
                firstSlideIndex = 0;
    
            opts.currSlide = firstSlideIndex;
            if ( opts.reverse ) {
                opts.nextSlide = firstSlideIndex - 1;
                if (opts.nextSlide < 0)
                    opts.nextSlide = opts.slides.length - 1;
            }
            else {
                opts.nextSlide = firstSlideIndex + 1;
                if (opts.nextSlide == opts.slides.length)
                    opts.nextSlide = 0;
            }
        },
    
        calcNextSlide: function() {
            var opts = this.opts();
            var roll;
            if ( opts.reverse ) {
                roll = (opts.nextSlide - 1) < 0;
                opts.nextSlide = roll ? opts.slideCount - 1 : opts.nextSlide-1;
                opts.currSlide = roll ? 0 : opts.nextSlide+1;
            }
            else {
                roll = (opts.nextSlide + 1) == opts.slides.length;
                opts.nextSlide = roll ? 0 : opts.nextSlide+1;
                opts.currSlide = roll ? opts.slides.length-1 : opts.nextSlide-1;
            }
        },
    
        calcTx: function( slideOpts, manual ) {
            var opts = slideOpts;
            var tx;
    
            if ( opts._tempFx )
                tx = $.fn.cycle.transitions[opts._tempFx];
            else if ( manual && opts.manualFx )
                tx = $.fn.cycle.transitions[opts.manualFx];
    
            if ( !tx )
                tx = $.fn.cycle.transitions[opts.fx];
    
            opts._tempFx = null;
            this.opts()._tempFx = null;
    
            if (!tx) {
                tx = $.fn.cycle.transitions.fade;
                opts.API.log('Transition "' + opts.fx + '" not found.  Using fade.');
            }
            return tx;
        },
    
        prepareTx: function( manual, fwd ) {
            var opts = this.opts();
            var after, curr, next, slideOpts, tx;
    
            if ( opts.slideCount < 2 ) {
                opts.timeoutId = 0;
                return;
            }
            if ( manual && ( !opts.busy || opts.manualTrump ) ) {
                opts.API.stopTransition();
                opts.busy = false;
                clearTimeout(opts.timeoutId);
                opts.timeoutId = 0;
            }
            if ( opts.busy )
                return;
            if ( opts.timeoutId === 0 && !manual )
                return;
    
            curr = opts.slides[opts.currSlide];
            next = opts.slides[opts.nextSlide];
            slideOpts = opts.API.getSlideOpts( opts.nextSlide );
            tx = opts.API.calcTx( slideOpts, manual );
    
            opts._tx = tx;
    
            if ( manual && slideOpts.manualSpeed !== undefined )
                slideOpts.speed = slideOpts.manualSpeed;
    
            // if ( opts.nextSlide === opts.currSlide )
            //     opts.API.calcNextSlide();
    
            // ensure that:
            //      1. advancing to a different slide
            //      2. this is either a manual event (prev/next, pager, cmd) or 
            //              a timer event and slideshow is not paused
            if ( opts.nextSlide != opts.currSlide && 
                (manual || (!opts.paused && !opts.hoverPaused && opts.timeout) )) { // #62
    
                opts.API.trigger('cycle-before', [ slideOpts, curr, next, fwd ]);
                if ( tx.before )
                    tx.before( slideOpts, curr, next, fwd );
    
                after = function() {
                    opts.busy = false;
                    // #76; bail if slideshow has been destroyed
                    if (! opts.container.data( 'cycle.opts' ) )
                        return;
    
                    if (tx.after)
                        tx.after( slideOpts, curr, next, fwd );
                    opts.API.trigger('cycle-after', [ slideOpts, curr, next, fwd ]);
                    opts.API.queueTransition( slideOpts);
                    opts.API.updateView( true );
                };
    
                opts.busy = true;
                if (tx.transition)
                    tx.transition(slideOpts, curr, next, fwd, after);
                else
                    opts.API.doTransition( slideOpts, curr, next, fwd, after);
    
                opts.API.calcNextSlide();
                opts.API.updateView();
            } else {
                opts.API.queueTransition( slideOpts );
            }
        },
    
        // perform the actual animation
        doTransition: function( slideOpts, currEl, nextEl, fwd, callback) {
            var opts = slideOpts;
            var curr = $(currEl), next = $(nextEl);
            var fn = function() {
                // make sure animIn has something so that callback doesn't trigger immediately
                next.animate(opts.animIn || { opacity: 1}, opts.speed, opts.easeIn || opts.easing, callback);
            };
    
            next.css(opts.cssBefore || {});
            curr.animate(opts.animOut || {}, opts.speed, opts.easeOut || opts.easing, function() {
                curr.css(opts.cssAfter || {});
                if (!opts.sync) {
                    fn();
                }
            });
            if (opts.sync) {
                fn();
            }
        },
    
        queueTransition: function( slideOpts, specificTimeout ) {
            var opts = this.opts();
            var timeout = specificTimeout !== undefined ? specificTimeout : slideOpts.timeout;
            if (opts.nextSlide === 0 && --opts.loop === 0) {
                opts.API.log('terminating; loop=0');
                opts.timeout = 0;
                if ( timeout ) {
                    setTimeout(function() {
                        opts.API.trigger('cycle-finished', [ opts ]);
                    }, timeout);
                }
                else {
                    opts.API.trigger('cycle-finished', [ opts ]);
                }
                // reset nextSlide
                opts.nextSlide = opts.currSlide;
                return;
            }
            if ( opts.continueAuto !== undefined ) {
                if ( opts.continueAuto === false || 
                    ($.isFunction(opts.continueAuto) && opts.continueAuto() === false )) {
                    opts.API.log('terminating automatic transitions');
                    opts.timeout = 0;
                    if ( opts.timeoutId )
                        clearTimeout(opts.timeoutId);
                    return;
                }
            }
            if ( timeout ) {
                opts._lastQueue = $.now();
                if ( specificTimeout === undefined )
                    opts._remainingTimeout = slideOpts.timeout;
    
                if ( !opts.paused && ! opts.hoverPaused ) {
                    opts.timeoutId = setTimeout(function() { 
                        opts.API.prepareTx( false, !opts.reverse ); 
                    }, timeout );
                }
            }
        },
    
        stopTransition: function() {
            var opts = this.opts();
            if ( opts.slides.filter(':animated').length ) {
                opts.slides.stop(false, true);
                opts.API.trigger('cycle-transition-stopped', [ opts ]);
            }
    
            if ( opts._tx && opts._tx.stopTransition )
                opts._tx.stopTransition( opts );
        },
    
        // advance slide forward or back
        advanceSlide: function( val ) {
            var opts = this.opts();
            clearTimeout(opts.timeoutId);
            opts.timeoutId = 0;
            opts.nextSlide = opts.currSlide + val;
            
            if (opts.nextSlide < 0)
                opts.nextSlide = opts.slides.length - 1;
            else if (opts.nextSlide >= opts.slides.length)
                opts.nextSlide = 0;
    
            opts.API.prepareTx( true,  val >= 0 );
            return false;
        },
    
        buildSlideOpts: function( slide ) {
            var opts = this.opts();
            var val, shortName;
            var slideOpts = slide.data() || {};
            for (var p in slideOpts) {
                // allow props to be accessed sans 'cycle' prefix and log the overrides
                if (slideOpts.hasOwnProperty(p) && /^cycle[A-Z]+/.test(p) ) {
                    val = slideOpts[p];
                    shortName = p.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, lowerCase);
                    opts.API.log('['+(opts.slideCount-1)+']', shortName+':', val, '('+typeof val +')');
                    slideOpts[shortName] = val;
                }
            }
    
            slideOpts = $.extend( {}, $.fn.cycle.defaults, opts, slideOpts );
            slideOpts.slideNum = opts.slideCount;
    
            try {
                // these props should always be read from the master state object
                delete slideOpts.API;
                delete slideOpts.slideCount;
                delete slideOpts.currSlide;
                delete slideOpts.nextSlide;
                delete slideOpts.slides;
            } catch(e) {
                // no op
            }
            return slideOpts;
        },
    
        getSlideOpts: function( index ) {
            var opts = this.opts();
            if ( index === undefined )
                index = opts.currSlide;
    
            var slide = opts.slides[index];
            var slideOpts = $(slide).data('cycle.opts');
            return $.extend( {}, opts, slideOpts );
        },
        
        initSlide: function( slideOpts, slide, suggestedZindex ) {
            var opts = this.opts();
            slide.css( slideOpts.slideCss || {} );
            if ( suggestedZindex > 0 )
                slide.css( 'zIndex', suggestedZindex );
    
            // ensure that speed settings are sane
            if ( isNaN( slideOpts.speed ) )
                slideOpts.speed = $.fx.speeds[slideOpts.speed] || $.fx.speeds._default;
            if ( !slideOpts.sync )
                slideOpts.speed = slideOpts.speed / 2;
    
            slide.addClass( opts.slideClass );
        },
    
        updateView: function( isAfter, isDuring, forceEvent ) {
            var opts = this.opts();
            if ( !opts._initialized )
                return;
            var slideOpts = opts.API.getSlideOpts();
            var currSlide = opts.slides[ opts.currSlide ];
    
            if ( ! isAfter && isDuring !== true ) {
                opts.API.trigger('cycle-update-view-before', [ opts, slideOpts, currSlide ]);
                if ( opts.updateView < 0 )
                    return;
            }
    
            if ( opts.slideActiveClass ) {
                opts.slides.removeClass( opts.slideActiveClass )
                    .eq( opts.currSlide ).addClass( opts.slideActiveClass );
            }
    
            if ( isAfter && opts.hideNonActive )
                opts.slides.filter( ':not(.' + opts.slideActiveClass + ')' ).css('visibility', 'hidden');
    
            if ( opts.updateView === 0 ) {
                setTimeout(function() {
                    opts.API.trigger('cycle-update-view', [ opts, slideOpts, currSlide, isAfter ]);
                }, slideOpts.speed / (opts.sync ? 2 : 1) );
            }
    
            if ( opts.updateView !== 0 )
                opts.API.trigger('cycle-update-view', [ opts, slideOpts, currSlide, isAfter ]);
            
            if ( isAfter )
                opts.API.trigger('cycle-update-view-after', [ opts, slideOpts, currSlide ]);
        },
    
        getComponent: function( name ) {
            var opts = this.opts();
            var selector = opts[name];
            if (typeof selector === 'string') {
                // if selector is a child, sibling combinator, adjancent selector then use find, otherwise query full dom
                return (/^\s*[\>|\+|~]/).test( selector ) ? opts.container.find( selector ) : $( selector );
            }
            if (selector.jquery)
                return selector;
            
            return $(selector);
        },
    
        stackSlides: function( curr, next, fwd ) {
            var opts = this.opts();
            if ( !curr ) {
                curr = opts.slides[opts.currSlide];
                next = opts.slides[opts.nextSlide];
                fwd = !opts.reverse;
            }
    
            // reset the zIndex for the common case:
            // curr slide on top,  next slide beneath, and the rest in order to be shown
            $(curr).css('zIndex', opts.maxZ);
    
            var i;
            var z = opts.maxZ - 2;
            var len = opts.slideCount;
            if (fwd) {
                for ( i = opts.currSlide + 1; i < len; i++ )
                    $( opts.slides[i] ).css( 'zIndex', z-- );
                for ( i = 0; i < opts.currSlide; i++ )
                    $( opts.slides[i] ).css( 'zIndex', z-- );
            }
            else {
                for ( i = opts.currSlide - 1; i >= 0; i-- )
                    $( opts.slides[i] ).css( 'zIndex', z-- );
                for ( i = len - 1; i > opts.currSlide; i-- )
                    $( opts.slides[i] ).css( 'zIndex', z-- );
            }
    
            $(next).css('zIndex', opts.maxZ - 1);
        },
    
        getSlideIndex: function( el ) {
            return this.opts().slides.index( el );
        }
    
    }; // API
    
    // default logger
    $.fn.cycle.log = function log() {
        /*global console:true */
        if (window.console && console.log)
            console.log('[cycle2] ' + Array.prototype.join.call(arguments, ' ') );
    };
    
    $.fn.cycle.version = function() { return 'Cycle2: ' + version; };
    
    // helper functions
    
    function lowerCase(s) {
        return (s || '').toLowerCase();
    }
    
    // expose transition object
    $.fn.cycle.transitions = {
        custom: {
        },
        none: {
            before: function( opts, curr, next, fwd ) {
                opts.API.stackSlides( next, curr, fwd );
                opts.cssBefore = { opacity: 1, visibility: 'visible', display: 'block' };
            }
        },
        fade: {
            before: function( opts, curr, next, fwd ) {
                var css = opts.API.getSlideOpts( opts.nextSlide ).slideCss || {};
                opts.API.stackSlides( curr, next, fwd );
                opts.cssBefore = $.extend(css, { opacity: 0, visibility: 'visible', display: 'block' });
                opts.animIn = { opacity: 1 };
                opts.animOut = { opacity: 0 };
            }
        },
        fadeout: {
            before: function( opts , curr, next, fwd ) {
                var css = opts.API.getSlideOpts( opts.nextSlide ).slideCss || {};
                opts.API.stackSlides( curr, next, fwd );
                opts.cssBefore = $.extend(css, { opacity: 1, visibility: 'visible', display: 'block' });
                opts.animOut = { opacity: 0 };
            }
        },
        scrollHorz: {
            before: function( opts, curr, next, fwd ) {
                opts.API.stackSlides( curr, next, fwd );
                var w = opts.container.css('overflow','hidden').width();
                opts.cssBefore = { left: fwd ? w : - w, top: 0, opacity: 1, visibility: 'visible', display: 'block' };
                opts.cssAfter = { zIndex: opts._maxZ - 2, left: 0 };
                opts.animIn = { left: 0 };
                opts.animOut = { left: fwd ? -w : w };
            }
        }
    };
    
    // @see: http://jquery.malsup.com/cycle2/api
    $.fn.cycle.defaults = {
        allowWrap:        true,
        autoSelector:     '.cycle-slideshow[data-cycle-auto-init!=false]',
        delay:            0,
        easing:           null,
        fx:              'fade',
        hideNonActive:    true,
        loop:             0,
        manualFx:         undefined,
        manualSpeed:      undefined,
        manualTrump:      true,
        maxZ:             100,
        pauseOnHover:     false,
        reverse:          false,
        slideActiveClass: 'cycle-slide-active',
        slideClass:       'cycle-slide',
        slideCss:         { position: 'absolute', top: 0, left: 0 },
        slides:          '> img',
        speed:            500,
        startingSlide:    0,
        sync:             true,
        timeout:          4000,
        updateView:       0
    };
    
    // automatically find and run slideshows
    $(document).ready(function() {
        $( $.fn.cycle.defaults.autoSelector ).cycle();
    });
    
    })(jQuery);
    
    /*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130913 */
    (function($) {
    "use strict";
    
    $.extend($.fn.cycle.defaults, {
        autoHeight: 0, // setting this option to false disables autoHeight logic
        autoHeightSpeed: 250,
        autoHeightEasing: null
    });    
    
    $(document).on( 'cycle-initialized', function( e, opts ) {
        var autoHeight = opts.autoHeight;
        var t = $.type( autoHeight );
        var resizeThrottle = null;
        var ratio;
    
        if ( t !== 'string' && t !== 'number' )
            return;
    
        // bind events
        opts.container.on( 'cycle-slide-added cycle-slide-removed', initAutoHeight );
        opts.container.on( 'cycle-destroyed', onDestroy );
    
        if ( autoHeight == 'container' ) {
            opts.container.on( 'cycle-before', onBefore );
        }
        else if ( t === 'string' && /\d+\:\d+/.test( autoHeight ) ) { 
            // use ratio
            ratio = autoHeight.match(/(\d+)\:(\d+)/);
            ratio = ratio[1] / ratio[2];
            opts._autoHeightRatio = ratio;
        }
    
        // if autoHeight is a number then we don't need to recalculate the sentinel
        // index on resize
        if ( t !== 'number' ) {
            // bind unique resize handler per slideshow (so it can be 'off-ed' in onDestroy)
            opts._autoHeightOnResize = function () {
                clearTimeout( resizeThrottle );
                resizeThrottle = setTimeout( onResize, 50 );
            };
    
            $(window).on( 'resize orientationchange', opts._autoHeightOnResize );
        }
    
        setTimeout( onResize, 30 );
    
        function onResize() {
            initAutoHeight( e, opts );
        }
    });
    
    function initAutoHeight( e, opts ) {
        var clone, height, sentinelIndex;
        var autoHeight = opts.autoHeight;
    
        if ( autoHeight == 'container' ) {
            height = $( opts.slides[ opts.currSlide ] ).outerHeight();
            opts.container.height( height );
        }
        else if ( opts._autoHeightRatio ) { 
            opts.container.height( opts.container.width() / opts._autoHeightRatio );
        }
        else if ( autoHeight === 'calc' || ( $.type( autoHeight ) == 'number' && autoHeight >= 0 ) ) {
            if ( autoHeight === 'calc' )
                sentinelIndex = calcSentinelIndex( e, opts );
            else if ( autoHeight >= opts.slides.length )
                sentinelIndex = 0;
            else 
                sentinelIndex = autoHeight;
    
            // only recreate sentinel if index is different
            if ( sentinelIndex == opts._sentinelIndex )
                return;
    
            opts._sentinelIndex = sentinelIndex;
            if ( opts._sentinel )
                opts._sentinel.remove();
    
            // clone existing slide as sentinel
            clone = $( opts.slides[ sentinelIndex ].cloneNode(true) );
            
            // #50; remove special attributes from cloned content
            clone.removeAttr( 'id name rel' ).find( '[id],[name],[rel]' ).removeAttr( 'id name rel' );
    
            clone.css({
                position: 'static',
                visibility: 'hidden',
                display: 'block'
            }).prependTo( opts.container ).addClass('cycle-sentinel cycle-slide').removeClass('cycle-slide-active');
            clone.find( '*' ).css( 'visibility', 'hidden' );
    
            opts._sentinel = clone;
        }
    }    
    
    function calcSentinelIndex( e, opts ) {
        var index = 0, max = -1;
    
        // calculate tallest slide index
        opts.slides.each(function(i) {
            var h = $(this).height();
            if ( h > max ) {
                max = h;
                index = i;
            }
        });
        return index;
    }
    
    function onBefore( e, opts, outgoing, incoming, forward ) {
        var h = $(incoming).outerHeight();
        opts.container.animate( { height: h }, opts.autoHeightSpeed, opts.autoHeightEasing );
    }
    
    function onDestroy( e, opts ) {
        if ( opts._autoHeightOnResize ) {
            $(window).off( 'resize orientationchange', opts._autoHeightOnResize );
            opts._autoHeightOnResize = null;
        }
        opts.container.off( 'cycle-slide-added cycle-slide-removed', initAutoHeight );
        opts.container.off( 'cycle-destroyed', onDestroy );
        opts.container.off( 'cycle-before', onBefore );
    
        if ( opts._sentinel ) {
            opts._sentinel.remove();
            opts._sentinel = null;
        }
    }
    
    })(jQuery);
    
    /*! caption plugin for Cycle2;  version: 20130306 */
    (function($) {
    "use strict";
    
    $.extend($.fn.cycle.defaults, {
        caption:          '> .cycle-caption',
        captionTemplate:  '{{slideNum}} / {{slideCount}}',
        overlay:          '> .cycle-overlay',
        overlayTemplate:  '<div>{{title}}</div><div>{{desc}}</div>',
        captionModule:    'caption'
    });    
    
    $(document).on( 'cycle-update-view', function( e, opts, slideOpts, currSlide ) {
        if ( opts.captionModule !== 'caption' )
            return;
        var el;
        $.each(['caption','overlay'], function() {
            var name = this; 
            var template = slideOpts[name+'Template'];
            var el = opts.API.getComponent( name );
            if( el.length && template ) {
                el.html( opts.API.tmpl( template, slideOpts, opts, currSlide ) );
                el.show();
            }
            else {
                el.hide();
            }
        });
    });
    
    $(document).on( 'cycle-destroyed', function( e, opts ) {
        var el;
        $.each(['caption','overlay'], function() {
            var name = this, template = opts[name+'Template'];
            if ( opts[name] && template ) {
                el = opts.API.getComponent( 'caption' );
                el.empty();
            }
        });
    });
    
    })(jQuery);
    
    /*! command plugin for Cycle2;  version: 20140415 */
    (function($) {
    "use strict";
    
    var c2 = $.fn.cycle;
    
    $.fn.cycle = function( options ) {
        var cmd, cmdFn, opts;
        var args = $.makeArray( arguments );
    
        if ( $.type( options ) == 'number' ) {
            return this.cycle( 'goto', options );
        }
    
        if ( $.type( options ) == 'string' ) {
            return this.each(function() {
                var cmdArgs;
                cmd = options;
                opts = $(this).data('cycle.opts');
    
                if ( opts === undefined ) {
                    c2.log('slideshow must be initialized before sending commands; "' + cmd + '" ignored');
                    return;
                }
                else {
                    cmd = cmd == 'goto' ? 'jump' : cmd; // issue #3; change 'goto' to 'jump' internally
                    cmdFn = opts.API[ cmd ];
                    if ( $.isFunction( cmdFn )) {
                        cmdArgs = $.makeArray( args );
                        cmdArgs.shift();
                        return cmdFn.apply( opts.API, cmdArgs );
                    }
                    else {
                        c2.log( 'unknown command: ', cmd );
                    }
                }
            });
        }
        else {
            return c2.apply( this, arguments );
        }
    };
    
    // copy props
    $.extend( $.fn.cycle, c2 );
    
    $.extend( c2.API, {
        next: function() {
            var opts = this.opts();
            if ( opts.busy && ! opts.manualTrump )
                return;
    
            var count = opts.reverse ? -1 : 1;
            if ( opts.allowWrap === false && ( opts.currSlide + count ) >= opts.slideCount )
                return;
    
            opts.API.advanceSlide( count );
            opts.API.trigger('cycle-next', [ opts ]).log('cycle-next');
        },
    
        prev: function() {
            var opts = this.opts();
            if ( opts.busy && ! opts.manualTrump )
                return;
            var count = opts.reverse ? 1 : -1;
            if ( opts.allowWrap === false && ( opts.currSlide + count ) < 0 )
                return;
    
            opts.API.advanceSlide( count );
            opts.API.trigger('cycle-prev', [ opts ]).log('cycle-prev');
        },
    
        destroy: function() {
            this.stop(); //#204
    
            var opts = this.opts();
            var clean = $.isFunction( $._data ) ? $._data : $.noop;  // hack for #184 and #201
            clearTimeout(opts.timeoutId);
            opts.timeoutId = 0;
            opts.API.stop();
            opts.API.trigger( 'cycle-destroyed', [ opts ] ).log('cycle-destroyed');
            opts.container.removeData();
            clean( opts.container[0], 'parsedAttrs', false );
    
            // #75; remove inline styles
            if ( ! opts.retainStylesOnDestroy ) {
                opts.container.removeAttr( 'style' );
                opts.slides.removeAttr( 'style' );
                opts.slides.removeClass( opts.slideActiveClass );
            }
            opts.slides.each(function() {
                var slide = $(this);
                slide.removeData();
                slide.removeClass( opts.slideClass );
                clean( this, 'parsedAttrs', false );
            });
        },
    
        jump: function( index, fx ) {
            // go to the requested slide
            var fwd;
            var opts = this.opts();
            if ( opts.busy && ! opts.manualTrump )
                return;
            var num = parseInt( index, 10 );
            if (isNaN(num) || num < 0 || num >= opts.slides.length) {
                opts.API.log('goto: invalid slide index: ' + num);
                return;
            }
            if (num == opts.currSlide) {
                opts.API.log('goto: skipping, already on slide', num);
                return;
            }
            opts.nextSlide = num;
            clearTimeout(opts.timeoutId);
            opts.timeoutId = 0;
            opts.API.log('goto: ', num, ' (zero-index)');
            fwd = opts.currSlide < opts.nextSlide;
            opts._tempFx = fx;
            opts.API.prepareTx( true, fwd );
        },
    
        stop: function() {
            var opts = this.opts();
            var pauseObj = opts.container;
            clearTimeout(opts.timeoutId);
            opts.timeoutId = 0;
            opts.API.stopTransition();
            if ( opts.pauseOnHover ) {
                if ( opts.pauseOnHover !== true )
                    pauseObj = $( opts.pauseOnHover );
                pauseObj.off('mouseenter mouseleave');
            }
            opts.API.trigger('cycle-stopped', [ opts ]).log('cycle-stopped');
        },
    
        reinit: function() {
            var opts = this.opts();
            opts.API.destroy();
            opts.container.cycle();
        },
    
        remove: function( index ) {
            var opts = this.opts();
            var slide, slideToRemove, slides = [], slideNum = 1;
            for ( var i=0; i < opts.slides.length; i++ ) {
                slide = opts.slides[i];
                if ( i == index ) {
                    slideToRemove = slide;
                }
                else {
                    slides.push( slide );
                    $( slide ).data('cycle.opts').slideNum = slideNum;
                    slideNum++;
                }
            }
            if ( slideToRemove ) {
                opts.slides = $( slides );
                opts.slideCount--;
                $( slideToRemove ).remove();
                if (index == opts.currSlide)
                    opts.API.advanceSlide( 1 );
                else if ( index < opts.currSlide )
                    opts.currSlide--;
                else
                    opts.currSlide++;
    
                opts.API.trigger('cycle-slide-removed', [ opts, index, slideToRemove ]).log('cycle-slide-removed');
                opts.API.updateView();
            }
        }
    
    });
    
    // listen for clicks on elements with data-cycle-cmd attribute
    $(document).on('click.cycle', '[data-cycle-cmd]', function(e) {
        // issue cycle command
        e.preventDefault();
        var el = $(this);
        var command = el.data('cycle-cmd');
        var context = el.data('cycle-context') || '.cycle-slideshow';
        $(context).cycle(command, el.data('cycle-arg'));
    });
    
    
    })(jQuery);
    
    /*! hash plugin for Cycle2;  version: 20130905 */
    (function($) {
    "use strict";
    
    $(document).on( 'cycle-pre-initialize', function( e, opts ) {
        onHashChange( opts, true );
    
        opts._onHashChange = function() {
            onHashChange( opts, false );
        };
    
        $( window ).on( 'hashchange', opts._onHashChange);
    });
    
    $(document).on( 'cycle-update-view', function( e, opts, slideOpts ) {
        if ( slideOpts.hash && ( '#' + slideOpts.hash ) != window.location.hash ) {
            opts._hashFence = true;
            window.location.hash = slideOpts.hash;
        }
    });
    
    $(document).on( 'cycle-destroyed', function( e, opts) {
        if ( opts._onHashChange ) {
            $( window ).off( 'hashchange', opts._onHashChange );
        }
    });
    
    function onHashChange( opts, setStartingSlide ) {
        var hash;
        if ( opts._hashFence ) {
            opts._hashFence = false;
            return;
        }
        
        hash = window.location.hash.substring(1);
    
        opts.slides.each(function(i) {
            if ( $(this).data( 'cycle-hash' ) == hash ) {
                if ( setStartingSlide === true ) {
                    opts.startingSlide = i;
                }
                else {
                    var fwd = opts.currSlide < i;
                    opts.nextSlide = i;
                    opts.API.prepareTx( true, fwd );
                }
                return false;
            }
        });
    }
    
    })(jQuery);
    
    /*! loader plugin for Cycle2;  version: 20131121 */
    (function($) {
    "use strict";
    
    $.extend($.fn.cycle.defaults, {
        loader: false
    });
    
    $(document).on( 'cycle-bootstrap', function( e, opts ) {
        var addFn;
    
        if ( !opts.loader )
            return;
    
        // override API.add for this slideshow
        addFn = opts.API.add;
        opts.API.add = add;
    
        function add( slides, prepend ) {
            var slideArr = [];
            if ( $.type( slides ) == 'string' )
                slides = $.trim( slides );
            else if ( $.type( slides) === 'array' ) {
                for (var i=0; i < slides.length; i++ )
                    slides[i] = $(slides[i])[0];
            }
    
            slides = $( slides );
            var slideCount = slides.length;
    
            if ( ! slideCount )
                return;
    
            slides.css('visibility','hidden').appendTo('body').each(function(i) { // appendTo fixes #56
                var count = 0;
                var slide = $(this);
                var images = slide.is('img') ? slide : slide.find('img');
                slide.data('index', i);
                // allow some images to be marked as unimportant (and filter out images w/o src value)
                images = images.filter(':not(.cycle-loader-ignore)').filter(':not([src=""])');
                if ( ! images.length ) {
                    --slideCount;
                    slideArr.push( slide );
                    return;
                }
    
                count = images.length;
                images.each(function() {
                    // add images that are already loaded
                    if ( this.complete ) {
                        imageLoaded();
                    }
                    else {
                        $(this).load(function() {
                            imageLoaded();
                        }).on("error", function() {
                            if ( --count === 0 ) {
                                // ignore this slide
                                opts.API.log('slide skipped; img not loaded:', this.src);
                                if ( --slideCount === 0 && opts.loader == 'wait') {
                                    addFn.apply( opts.API, [ slideArr, prepend ] );
                                }
                            }
                        });
                    }
                });
    
                function imageLoaded() {
                    if ( --count === 0 ) {
                        --slideCount;
                        addSlide( slide );
                    }
                }
            });
    
            if ( slideCount )
                opts.container.addClass('cycle-loading');
            
    
            function addSlide( slide ) {
                var curr;
                if ( opts.loader == 'wait' ) {
                    slideArr.push( slide );
                    if ( slideCount === 0 ) {
                        // #59; sort slides into original markup order
                        slideArr.sort( sorter );
                        addFn.apply( opts.API, [ slideArr, prepend ] );
                        opts.container.removeClass('cycle-loading');
                    }
                }
                else {
                    curr = $(opts.slides[opts.currSlide]);
                    addFn.apply( opts.API, [ slide, prepend ] );
                    curr.show();
                    opts.container.removeClass('cycle-loading');
                }
            }
    
            function sorter(a, b) {
                return a.data('index') - b.data('index');
            }
        }
    });
    
    })(jQuery);
    
    /*! pager plugin for Cycle2;  version: 20140415 */
    (function($) {
    "use strict";
    
    $.extend($.fn.cycle.defaults, {
        pager:            '> .cycle-pager',
        pagerActiveClass: 'cycle-pager-active',
        pagerEvent:       'click.cycle',
        pagerEventBubble: undefined,
        pagerTemplate:    '<span>&bull;</span>'
    });
    
    $(document).on( 'cycle-bootstrap', function( e, opts, API ) {
        // add method to API
        API.buildPagerLink = buildPagerLink;
    });
    
    $(document).on( 'cycle-slide-added', function( e, opts, slideOpts, slideAdded ) {
        if ( opts.pager ) {
            opts.API.buildPagerLink ( opts, slideOpts, slideAdded );
            opts.API.page = page;
        }
    });
    
    $(document).on( 'cycle-slide-removed', function( e, opts, index, slideRemoved ) {
        if ( opts.pager ) {
            var pagers = opts.API.getComponent( 'pager' );
            pagers.each(function() {
                var pager = $(this);
                $( pager.children()[index] ).remove();
            });
        }
    });
    
    $(document).on( 'cycle-update-view', function( e, opts, slideOpts ) {
        var pagers;
    
        if ( opts.pager ) {
            pagers = opts.API.getComponent( 'pager' );
            pagers.each(function() {
               $(this).children().removeClass( opts.pagerActiveClass )
                .eq( opts.currSlide ).addClass( opts.pagerActiveClass );
            });
        }
    });
    
    $(document).on( 'cycle-destroyed', function( e, opts ) {
        var pager = opts.API.getComponent( 'pager' );
    
        if ( pager ) {
            pager.children().off( opts.pagerEvent ); // #202
            if ( opts.pagerTemplate )
                pager.empty();
        }
    });
    
    function buildPagerLink( opts, slideOpts, slide ) {
        var pagerLink;
        var pagers = opts.API.getComponent( 'pager' );
        pagers.each(function() {
            var pager = $(this);
            if ( slideOpts.pagerTemplate ) {
                var markup = opts.API.tmpl( slideOpts.pagerTemplate, slideOpts, opts, slide[0] );
                pagerLink = $( markup ).appendTo( pager );
            }
            else {
                pagerLink = pager.children().eq( opts.slideCount - 1 );
            }
            pagerLink.on( opts.pagerEvent, function(e) {
                if ( ! opts.pagerEventBubble )
                    e.preventDefault();
                opts.API.page( pager, e.currentTarget);
            });
        });
    }
    
    function page( pager, target ) {
        /*jshint validthis:true */
        var opts = this.opts();
        if ( opts.busy && ! opts.manualTrump )
            return;
    
        var index = pager.children().index( target );
        var nextSlide = index;
        var fwd = opts.currSlide < nextSlide;
        if (opts.currSlide == nextSlide) {
            return; // no op, clicked pager for the currently displayed slide
        }
        opts.nextSlide = nextSlide;
        opts._tempFx = opts.pagerFx;
        opts.API.prepareTx( true, fwd );
        opts.API.trigger('cycle-pager-activated', [opts, pager, target ]);
    }
    
    })(jQuery);
    
    /*! prevnext plugin for Cycle2;  version: 20140408 */
    (function($) {
    "use strict";
    
    $.extend($.fn.cycle.defaults, {
        next:           '> .cycle-next',
        nextEvent:      'click.cycle',
        disabledClass:  'disabled',
        prev:           '> .cycle-prev',
        prevEvent:      'click.cycle',
        swipe:          false
    });
    
    $(document).on( 'cycle-initialized', function( e, opts ) {
        opts.API.getComponent( 'next' ).on( opts.nextEvent, function(e) {
            e.preventDefault();
            opts.API.next();
        });
    
        opts.API.getComponent( 'prev' ).on( opts.prevEvent, function(e) {
            e.preventDefault();
            opts.API.prev();
        });
    
        if ( opts.swipe ) {
            var nextEvent = opts.swipeVert ? 'swipeUp.cycle' : 'swipeLeft.cycle swipeleft.cycle';
            var prevEvent = opts.swipeVert ? 'swipeDown.cycle' : 'swipeRight.cycle swiperight.cycle';
            opts.container.on( nextEvent, function(e) {
                opts._tempFx = opts.swipeFx;
                opts.API.next();
            });
            opts.container.on( prevEvent, function() {
                opts._tempFx = opts.swipeFx;
                opts.API.prev();
            });
        }
    });
    
    $(document).on( 'cycle-update-view', function( e, opts, slideOpts, currSlide ) {
        if ( opts.allowWrap )
            return;
    
        var cls = opts.disabledClass;
        var next = opts.API.getComponent( 'next' );
        var prev = opts.API.getComponent( 'prev' );
        var prevBoundry = opts._prevBoundry || 0;
        var nextBoundry = (opts._nextBoundry !== undefined)?opts._nextBoundry:opts.slideCount - 1;
    
        if ( opts.currSlide == nextBoundry )
            next.addClass( cls ).prop( 'disabled', true );
        else
            next.removeClass( cls ).prop( 'disabled', false );
    
        if ( opts.currSlide === prevBoundry )
            prev.addClass( cls ).prop( 'disabled', true );
        else
            prev.removeClass( cls ).prop( 'disabled', false );
    });
    
    
    $(document).on( 'cycle-destroyed', function( e, opts ) {
        opts.API.getComponent( 'prev' ).off( opts.nextEvent );
        opts.API.getComponent( 'next' ).off( opts.prevEvent );
        opts.container.off( 'swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle' );
    });
    
    })(jQuery);
    
    /*! progressive loader plugin for Cycle2;  version: 20130315 */
    (function($) {
    "use strict";
    
    $.extend($.fn.cycle.defaults, {
        progressive: false
    });
    
    $(document).on( 'cycle-pre-initialize', function( e, opts ) {
        if ( !opts.progressive )
            return;
    
        var API = opts.API;
        var nextFn = API.next;
        var prevFn = API.prev;
        var prepareTxFn = API.prepareTx;
        var type = $.type( opts.progressive );
        var slides, scriptEl;
    
        if ( type == 'array' ) {
            slides = opts.progressive;
        }
        else if ($.isFunction( opts.progressive ) ) {
            slides = opts.progressive( opts );
        }
        else if ( type == 'string' ) {
            scriptEl = $( opts.progressive );
            slides = $.trim( scriptEl.html() );
            if ( !slides )
                return;
            // is it json array?
            if ( /^(\[)/.test( slides ) ) {
                try {
                    slides = $.parseJSON( slides );
                }
                catch(err) {
                    API.log( 'error parsing progressive slides', err );
                    return;
                }
            }
            else {
                // plain text, split on delimeter
                slides = slides.split( new RegExp( scriptEl.data('cycle-split') || '\n') );
                
                // #95; look for empty slide
                if ( ! slides[ slides.length - 1 ] )
                    slides.pop();
            }
        }
    
    
    
        if ( prepareTxFn ) {
            API.prepareTx = function( manual, fwd ) {
                var index, slide;
    
                if ( manual || slides.length === 0 ) {
                    prepareTxFn.apply( opts.API, [ manual, fwd ] );
                    return;
                }
    
                if ( fwd && opts.currSlide == ( opts.slideCount-1) ) {
                    slide = slides[ 0 ];
                    slides = slides.slice( 1 );
                    opts.container.one('cycle-slide-added', function(e, opts ) {
                        setTimeout(function() {
                            opts.API.advanceSlide( 1 );
                        },50);
                    });
                    opts.API.add( slide );
                }
                else if ( !fwd && opts.currSlide === 0 ) {
                    index = slides.length-1;
                    slide = slides[ index ];
                    slides = slides.slice( 0, index );
                    opts.container.one('cycle-slide-added', function(e, opts ) {
                        setTimeout(function() {
                            opts.currSlide = 1;
                            opts.API.advanceSlide( -1 );
                        },50);
                    });
                    opts.API.add( slide, true );
                }
                else {
                    prepareTxFn.apply( opts.API, [ manual, fwd ] );
                }
            };
        }
    
        if ( nextFn ) {
            API.next = function() {
                var opts = this.opts();
                if ( slides.length && opts.currSlide == ( opts.slideCount - 1 ) ) {
                    var slide = slides[ 0 ];
                    slides = slides.slice( 1 );
                    opts.container.one('cycle-slide-added', function(e, opts ) {
                        nextFn.apply( opts.API );
                        opts.container.removeClass('cycle-loading');
                    });
                    opts.container.addClass('cycle-loading');
                    opts.API.add( slide );
                }
                else {
                    nextFn.apply( opts.API );    
                }
            };
        }
        
        if ( prevFn ) {
            API.prev = function() {
                var opts = this.opts();
                if ( slides.length && opts.currSlide === 0 ) {
                    var index = slides.length-1;
                    var slide = slides[ index ];
                    slides = slides.slice( 0, index );
                    opts.container.one('cycle-slide-added', function(e, opts ) {
                        opts.currSlide = 1;
                        opts.API.advanceSlide( -1 );
                        opts.container.removeClass('cycle-loading');
                    });
                    opts.container.addClass('cycle-loading');
                    opts.API.add( slide, true );
                }
                else {
                    prevFn.apply( opts.API );
                }
            };
        }
    });
    
    })(jQuery);
    
    /*! tmpl plugin for Cycle2;  version: 20121227 */
    (function($) {
    "use strict";
    
    $.extend($.fn.cycle.defaults, {
        tmplRegex: '{{((.)?.*?)}}'
    });
    
    $.extend($.fn.cycle.API, {
        tmpl: function( str, opts /*, ... */) {
            var regex = new RegExp( opts.tmplRegex || $.fn.cycle.defaults.tmplRegex, 'g' );
            var args = $.makeArray( arguments );
            args.shift();
            return str.replace(regex, function(_, str) {
                var i, j, obj, prop, names = str.split('.');
                for (i=0; i < args.length; i++) {
                    obj = args[i];
                    if ( ! obj )
                        continue;
                    if (names.length > 1) {
                        prop = obj;
                        for (j=0; j < names.length; j++) {
                            obj = prop;
                            prop = prop[ names[j] ] || str;
                        }
                    } else {
                        prop = obj[str];
                    }
    
                    if ($.isFunction(prop))
                        return prop.apply(obj, args);
                    if (prop !== undefined && prop !== null && prop != str)
                        return prop;
                }
                return str;
            });
        }
    });    
    
    })(jQuery);

    /*! css3 flip transition plugin for Cycle2;  version: 20140128 */
/*! originally written by Laubeee (https://github.com/Laubeee) */
(function($) {
    "use strict";
    
    var backface,
        style = document.createElement('div').style,
        tx = $.fn.cycle.transitions,
        supported = style.transform !== undefined ||
            style.MozTransform !== undefined ||
            style.webkitTransform !== undefined ||
            style.oTransform !== undefined ||
            style.msTransform !== undefined;
    
    if ( supported && style.msTransform !== undefined ) {
        style.msTransform = 'rotateY(0deg)';
        if ( ! style.msTransform )
            supported = false;
    }
    
    if ( supported ) {
        tx.flipHorz = getTransition( getRotate('Y') );
        tx.flipVert = getTransition( getRotate('X') );
        backface = {
            '-webkit-backface-visibility': 'hidden',
            '-moz-backface-visibility': 'hidden',
            '-o-backface-visibility': 'hidden',
            'backface-visibility': 'hidden'
        };
    }
    else {
        // fallback to scroll tx for browsers that don't support transforms
        tx.flipHorz = tx.scrollHorz;
        tx.flipVert = tx.scrollVert || tx.scrollHorz;
    }
    
        
    function getTransition( rotateFn ) {
        // return C2 transition object
        return {
            preInit: function( opts ) {
                opts.slides.css( backface );
            },
            transition: function( slideOpts, currEl, nextEl, fwd, callback ) {
                var opts = slideOpts,
                    curr = $(currEl), 
                    next = $(nextEl),
                    speed = opts.speed / 2;
    
                // css before transition start
                rotateFn.call(next, -90);
                next.css({
                    'display': 'block',
                    'visibility': 'visible',
                    'background-position': '-90px',
                    'opacity': 1
                });
    
                curr.css('background-position', '0px');
    
                curr.animate({ backgroundPosition: 90 }, {
                    step: rotateFn,
                    duration: speed,
                    easing: opts.easeOut || opts.easing,
                    complete: function() {
                        slideOpts.API.updateView( false, true );
                        next.animate({ backgroundPosition: 0 }, {
                            step: rotateFn,
                            duration: speed,
                            easing: opts.easeIn || opts.easing,
                            complete: callback
                        });
                    }
                });
            }
        };
    }
    
    function getRotate( dir ) {
        return function( degrees ) {
            /*jshint validthis:true */
            var el = $(this);
            el.css({
                '-webkit-transform': 'rotate'+dir+'('+degrees+'deg)',
                '-moz-transform': 'rotate'+dir+'('+degrees+'deg)', 
                '-ms-transform': 'rotate'+dir+'('+degrees+'deg)',
                '-o-transform': 'rotate'+dir+'('+degrees+'deg)',
                'transform': 'rotate'+dir+'('+degrees+'deg)'
            });
        };
    }
    
    })(jQuery);


    