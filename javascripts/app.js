function encode(e){var o=e,n=encodeURIComponent(o).replace(/'/g,"%27").replace(/"/g,"%22");return n}function decode(e){var o=e,n=decodeURIComponent(o.replace(/\+/g," "));return n}function prepareBackbonePushState(){Backbone.history&&Backbone.history._hasPushState&&$(document).delegate("a[href^='/']","click",function(e){var o=$(this).attr("href"),n=this.protocol+"//";o.slice(n.length)!==n&&(e.preventDefault(),Backbone.history.navigate(o,!0))})}!function(){"use strict";var e="undefined"!=typeof window?window:global;if("function"!=typeof e.require){var o={},n={},t=function(e,o){return{}.hasOwnProperty.call(e,o)},i=function(e,o){var n,t,i=[];n=/^\.\.?(\/|$)/.test(o)?[e,o].join("/").split("/"):o.split("/");for(var l=0,a=n.length;a>l;l++)t=n[l],".."===t?i.pop():"."!==t&&""!==t&&i.push(t);return i.join("/")},l=function(e){return e.split("/").slice(0,-1).join("/")},a=function(o){return function(n){var t=l(o),a=i(t,n);return e.require(a,o)}},s=function(e,o){var t={id:e,exports:{}};return n[e]=t,o(t.exports,a(e),t),t.exports},r=function(e,l){var a=i(e,".");if(null==l&&(l="/"),t(n,a))return n[a].exports;if(t(o,a))return s(a,o[a]);var r=i(a,"./index");if(t(n,r))return n[r].exports;if(t(o,r))return s(r,o[r]);throw new Error('Cannot find module "'+e+'" from "'+l+'"')},c=function(e,n){if("object"==typeof e)for(var i in e)t(e,i)&&(o[i]=e[i]);else o[e]=n},u=function(){var e=[];for(var n in o)t(o,n)&&e.push(n);return e};e.require=r,e.require.define=c,e.require.register=c,e.require.list=u,e.require.brunch=!0}}(),window.Diskupon={DealCategory:{All:-11,New:-22,Hot:-33,EndingSoon:-44,ByCategory:-55,Honeymoon:-66},API_HOST:"diskupon.api",requestUrl:function(e){return"/"===e.substring(0,1)?"//"+this.API_HOST+e:"//"+this.API_HOST+"/api/"+e}},function(e){e.App=new Marionette.Application;var o=e.App;o.regionManager=new Marionette.RegionManager,o.regionManager.addRegions({Header:"#dsk_header",RegionSelector:"#dsk_pick_region",TopMenu:"#dsk_topMenu",TopMenuInner:"#dsk_topMenu_Inner",TopMenuInnerMobile:"#dsk_topMenu_Inner_Mobile",Main:"#dsk_main",Affiliates:"#dsk_affiliates",Footer:"#dsk_footer"}),o.on("start",function(){Backbone.history&&(Backbone.history.start({pushState:!0}),prepareBackbonePushState())}),o.vent.on("submodule:start",function(e,n,t){for(var i=0;i<e.length;i++){var l=e[i];l!==n?o.module(l).stop():o.module(l).start(t)}});var n=o.regionManager.get("Header").el;$(document).on("click",n+" #dsk_searchDeals_submit",function(e){return $(n+" #dsk_searchDeals_form").submit(),e.preventDefault(),!1}),$(document).on("submit",n+" #dsk_searchDeals_form",function(e){var o=$(n+" #dsk_searchDeals_query").val().trim();if(o){var t=encode(o);window.location.href="/kupons/search/"+t}return e.preventDefault(),!1}),$(document).on("click",".dsk-topMenuInnerMobile li a",function(){var e=$(".dsk-navtoggle").hasClass("collapsed");e||$(".dsk-navtoggle").trigger("click")}),o.SelectedRegionId={get:function(){var e=localStorage.getItem("ds_regionid");null===e&&(e="2");var o=parseInt(e,10);return o},set:function(e){localStorage.setItem("ds_regionid",e.toString())}}}(window.Diskupon),function(e,o){var n=function(){return{showHeader:function(){o.RegionSelector.controller.show(),o.TopMenu.controller.show()},showAffiliates:function(){o.Affiliates.controller.show()},showHomePage:function(){this.showHeader(),this.showAffiliates(),o.Deals.controller.showTopDealsGroupByCategory()},showAllKuponsPage:function(){o.TopMenu.controller.listenTo(o.TopMenu.controller,"topmenu:shown",function(){o.TopMenu.controller.trigger("topmenu:changeactivemenuitem",e.DealCategory.All)}),this.showHeader(),this.showAffiliates(),o.Deals.controller.showDealsList({categoryId:e.DealCategory.All,searchQuery:""})},showNewKuponsPage:function(){o.TopMenu.controller.listenTo(o.TopMenu.controller,"topmenu:shown",function(){o.TopMenu.controller.trigger("topmenu:changeactivemenuitem",e.DealCategory.New)}),this.showHeader(),this.showAffiliates(),o.Deals.controller.showDealsList({categoryId:e.DealCategory.New,searchQuery:""})},showEndingSoonKuponsPage:function(){o.TopMenu.controller.listenTo(o.TopMenu.controller,"topmenu:shown",function(){o.TopMenu.controller.trigger("topmenu:changeactivemenuitem",e.DealCategory.EndingSoon)}),this.showHeader(),this.showAffiliates(),o.Deals.controller.showDealsList(e.DealCategory.EndingSoon)},showHotKuponsPage:function(){o.TopMenu.controller.listenTo(o.TopMenu.controller,"topmenu:shown",function(){o.TopMenu.controller.trigger("topmenu:changeactivemenuitem",e.DealCategory.Hot)}),this.showHeader(),this.showAffiliates(),o.Deals.controller.showDealsList({categoryId:e.DealCategory.Hot,searchQuery:""})},showKuponsByCategory:function(n){o.TopMenu.controller.listenTo(o.TopMenu.controller,"topmenu:shown",function(){o.TopMenu.controller.trigger("topmenu:changeactivemenuitem",e.DealCategory.ByCategory,n)}),this.showHeader(),this.showAffiliates(),o.Deals.controller.showDealsList({categoryId:n,searchQuery:""})},showHoneymoon:function(){o.TopMenu.controller.listenTo(o.TopMenu.controller,"topmenu:shown",function(){o.TopMenu.controller.trigger("topmenu:changeactivemenuitem",e.DealCategory.Honeymoon)}),this.showHeader(),this.showAffiliates()},showKuponDetails:function(e){this.showHeader(),this.showAffiliates(),o.Deals.controller.showDealDetails(e)},searchForKupons:function(n){o.TopMenu.controller.listenTo(o.TopMenu.controller,"topmenu:shown",function(){o.TopMenu.controller.trigger("topmenu:changeactivemenuitem",e.DealCategory.All)}),this.showHeader(),this.showAffiliates(),o.Deals.controller.showDealsList({categoryId:e.DealCategory.All,searchQuery:n})}}}();e.AppRouter=Backbone.Marionette.AppRouter.extend({execute:function(){}}),o.addInitializer(function(){new e.AppRouter({controller:n,appRoutes:{"":"showHomePage","kupons/all":"showAllKuponsPage","kupons/new":"showNewKuponsPage","kupons/endingsoon":"showEndingSoonKuponsPage","kupons/hot":"showHotKuponsPage","kupons/category/:id/:name":"showKuponsByCategory","kupons/honeymoon":"showHoneymoon","kupons/details/:id/:name":"showKuponDetails","kupons/search/:query":"searchForKupons"}})})}(window.Diskupon,window.Diskupon.App),function(e){e.App.module("Affiliates",function(e,o,n,t,i,l){e.AffiliatesView=t.ItemView.extend({template:tpl_affiliates,tagName:"div",className:"",events:{},onRender:function(){this.$el.find("#affiliates_stream").flexslider({animation:"slide",controlNav:!1,animationLoop:!0,slideshow:!0,itemWidth:150})}}),e.Controller=t.Controller.extend({initialize:function(e){l.bindAll(this,"show"),this.AffiliatesRegion=e.AffiliatesRegion},show:function(){var o=new e.AffiliatesView({});this.AffiliatesRegion.show(o)}}),e.addInitializer(function(){e.controller=new e.Controller({AffiliatesRegion:o.regionManager.get("Affiliates")})})})}(window.Diskupon),function(e){e.App.module("HomeSlides",function(e,o,n,t,i,l){this.startWithParent=!1,e.on("start",function(){}),e.HomeSlidesView=t.ItemView.extend({template:tpl_home_slides,tagName:"div",className:"",events:{},onRender:function(){}}),e.Controller=t.Controller.extend({initialize:function(e){l.bindAll(this,"show"),this.HomeSlidesRegion=e.HomeSlidesRegion},show:function(){var o=new e.HomeSlidesView({});this.HomeSlidesRegion.show(o)}}),e.addInitializer(function(o){e.controller=new e.Controller({HomeSlidesRegion:o.HomeSlidesRegion})})})}(window.Diskupon),function(e){e.App.module("RegionSelector",function(e,o,n,t,i,l){e.SelectRegionView=t.ItemView.extend({template:tpl_region_selector,tagName:"span",className:"dsk-regionPicker",events:{"change #dsk_select_region":"regionChanged"},onRender:function(){this.$el.find("#dsk_select_region").val(o.SelectedRegionId.get())},regionChanged:function(e){e.preventDefault();var o=parseInt(i(e.currentTarget).val(),10);this.trigger("region:changed",o)}}),e.Controller=t.Controller.extend({initialize:function(e){l.bindAll(this,"show","_regionChanged"),this.RegionSelectorRegion=e.RegionSelectorRegion},show:function(){var n=this,t=new o.Deals.Repository,i=t.getRegions();i.done(function(o){var t=new e.SelectRegionView({collection:o});n.listenTo(t,"region:changed",n._regionChanged),n.RegionSelectorRegion.show(t)})},_regionChanged:function(e){this.trigger("region:changed",e)}}),e.addInitializer(function(){e.controller=new e.Controller({RegionSelectorRegion:o.regionManager.get("RegionSelector")}),e.controller.listenTo(e.controller,"region:changed",function(e){o.SelectedRegionId.set(e),window.location.href="/"})})})}(window.Diskupon),function(e){e.App.module("TopMenu",function(e,o,n,t,i,l){e.TopMenuItemView=t.ItemView.extend({tagName:"li",template:tpl_top_menu,onBeforeRender:function(){var e=this.model.get("SubCategories");e&&e.length>0?(this.$el.addClass("dropdown"),this.model.set("HasSubCategories",!0)):this.model.set("HasSubCategories",!1);var o=parseInt(this.model.get("CategoryId"),10);this.$el.attr("data-key",o)}}),e.TopMenuCollectionView=t.CollectionView.extend({tagName:"ul",className:"nav nav-pills dsk-topMenuInner",itemView:e.TopMenuItemView,initialize:function(e){l.bindAll(this,"setActiveMenuItem"),this.activeTopMenuKey=e.activeTopMenuKey,this.activeTopMenuSubKey=e.activeTopMenuSubKey},onRender:function(){},setActiveMenuItem:function(e){this.$el.find(".active").removeClass("active"),e&&this.$el.find('[data-key="'+e+'"]').addClass("active")}}),e.TopMenuMobileItemView=t.ItemView.extend({tagName:"li",template:tpl_top_menu_mobile,onBeforeRender:function(){var e=this.model.get("SubCategories");e&&e.length>0?(this.$el.addClass("dropdown"),this.model.set("HasSubCategories",!0)):this.model.set("HasSubCategories",!1);var o=parseInt(this.model.get("CategoryId"),10);this.$el.attr("data-key",o)}}),e.TopMenuMobileCollectionView=t.CollectionView.extend({tagName:"ul",className:"nav nav-pills dsk-topMenuInnerMobile",itemView:e.TopMenuMobileItemView,initialize:function(e){l.bindAll(this,"setActiveMenuItem"),this.activeTopMenuKey=e.activeTopMenuKey,this.activeTopMenuSubKey=e.activeTopMenuSubKey},onRender:function(){},setActiveMenuItem:function(e,o){this.$el.find(".active").removeClass("active");var n=0;o?n=o:e&&(n=e),n&&this.$el.find('[data-key="'+n+'"]').addClass("active")}}),e.Controller=t.Controller.extend({initialize:function(e){l.bindAll(this,"show","setActiveMenuItem"),this.TopMenuRegion=e.TopMenuRegion,this.TopMenuRegionMobile=e.TopMenuRegionMobile,this.TopMenuView=void 0,this.TopMenuMobileView=void 0},show:function(){var n=this,t=new o.Deals.Repository,i=t.getDealCategories();i.done(function(o){var t=new e.TopMenuCollectionView({collection:o});n.TopMenuView=t,n.TopMenuRegion.show(t);var i=new e.TopMenuMobileCollectionView({collection:o});n.TopMenuMobileView=i,n.TopMenuRegionMobile.show(i),n.trigger("topmenu:shown")}),i.fail(function(){}),i.always(function(){})},setActiveMenuItem:function(e,o){this.TopMenuView.setActiveMenuItem(e,o),this.TopMenuMobileView.setActiveMenuItem(e,o)}}),e.addInitializer(function(){e.controller=new e.Controller({TopMenuRegion:o.regionManager.get("TopMenuInner"),TopMenuRegionMobile:o.regionManager.get("TopMenuInnerMobile")}),e.controller.listenTo(e.controller,"topmenu:changeactivemenuitem",function(o,n){e.controller.setActiveMenuItem(o,n)})})})}(window.Diskupon),function(e){e.App.module("Deals",function(o,n,t,i,l,a){o.DealModel=t.Model.extend({initialize:function(){},url:e.requestUrl("deals"),getDeal:function(e){this.fetch({data:l.param(e)})}}),o.DealCollection=t.Collection.extend({model:o.DealModel,url:e.requestUrl("deals"),search:function(e){this.fetch({reset:!0,data:l.param(e)})}}),o.DealCategoryModel=t.Model.extend({initialize:function(){}}),o.DealCategoryCollection=t.Collection.extend({model:o.DealCategoryModel,url:e.requestUrl("dealcategories")}),o.RegionModel=t.Model.extend({initialize:function(){}}),o.RegionCollection=t.Collection.extend({model:o.RegionModel,url:e.requestUrl("regions")}),o.Repository=i.Controller.extend({initialize:function(){a.bindAll(this,"search"),this.defaultSearchParams={RegionId:1,CategoryId:1,PageSize:65e3,PageNumber:1,SearchQuery:""}},search:function(e){var n=l.extend({},this.defaultSearchParams,e),t=l.Deferred(),i=new o.DealCollection;return i.on("reset",function(e){t.resolve(e)}),i.search(n),t.promise()},getOne:function(e){var n=new o.DealModel,t=l.Deferred();return n.on("change",function(e){t.resolve(e)}),n.getDeal({DealId:e}),t.promise()},getDealCategories:function(){var e=l.Deferred(),n=new o.DealCategoryCollection;return n.on("reset",function(o){e.resolve(o)}),n.fetch({reset:!0}),e.promise()},getRegions:function(){var e=l.Deferred(),n=new o.RegionCollection;return n.on("reset",function(o){e.resolve(o)}),n.fetch({reset:!0}),e.promise()}})})}(window.Diskupon),function(e){function o(){u=$("#map-canvas").parent().width(),$("#map-canvas").css("width","100%"),$("#map-canvas").css("height","400px")}function n(e,n,t){s=e,r=n,c=t,o(),i=new google.maps.Geocoder;var u=new google.maps.LatLng(s,r),g={zoom:16,center:u};l=new google.maps.Map(document.getElementById("map-canvas"),g),google.maps.event.addListenerOnce(l,"idle",function(){d.open(l,a)})}function t(){var e=new google.maps.LatLng(s,r);i.geocode({latLng:e},function(o,n){n==google.maps.GeocoderStatus.OK?o[1]?(a=new google.maps.Marker({position:e,map:l}),d.setOptions({maxWidth:u/2}),d.setContent(c)):console.log("No results found"):console.log("Geocoder failed due to: "+n)})}if("undefined"==typeof google)return e.init=function(){},e.draw=function(){},!1;var i,l,a,s,r,c,u,d=new google.maps.InfoWindow;e.init=n,e.draw=t}(window.Diskupon.gmapsapi=window.Diskupon.gmapsapi||{}),function(e){e.App.module("Deals.Details",function(o,n,t,i,l,a){this.startWithParent=!1,o.on("start",function(){}),o.DealsDetailsView=i.ItemView.extend({template:tpl_deal_details,tagName:"div",className:"dsk-dealDetails",onRender:function(){var e=this;this.$el.find("#deal_images_navs").flexslider({animation:"slide",controlNav:!1,animationLoop:!1,slideshow:!1,itemWidth:100,asNavFor:"#deal_images"}),this.$el.find("#deal_images").flexslider({animation:"slide",controlNav:!1,animationLoop:!1,slideshow:!1,sync:"#deal_images_navs"}),this.$el.find(".sliderMain-imgContainer").imgLiquid(),this.$el.find("#map-canvas").show("fast",function(){var o=e.model.get("PrimaryKupon");if(window.hehe=o,o.KuponLocation){var n="<h4>"+o.KuponLocation.LocationName+"</h4>                                   <p>"+o.KuponLocation.LocationAddress+"</p>                                  ";window.Diskupon.gmapsapi.init(o.KuponLocation.Latitude,o.KuponLocation.Longitude,n),window.Diskupon.gmapsapi.draw()}})}}),o.Controller=i.Controller.extend({initialize:function(e){a.bindAll(this,"showDealsDetails","renderDealsDetails"),this.DealsDetailsRegion=e.DealsDetailsRegion,this.DealsDetailsMobileRegion=e.DealsDetailsMobileRegion,this.DealId=0},renderDealsDetails:function(e){var n=new o.DealsDetailsView({model:e});this.DealsDetailsRegion.show(n),this.trigger("dealdetails:detailsshown",e.toJSON())},showDealsDetails:function(){var e=this,o=new n.Deals.Repository,t=o.getOne(this.DealId);t.done(function(o){e.renderDealsDetails(o)})}}),o.addInitializer(function(t){o.controller=new o.Controller({DealsDetailsRegion:t.DealsDetailsRegion,DealsDetailsMobileRegion:t.DealsDetailsMobileRegion}),o.controller.listenTo(o.controller,"dealdetails:detailsshown",function(o){n.TopMenu.controller.trigger("topmenu:changeactivemenuitem",e.DealCategory.ByCategory,o.DealCategoryId)})}),o.addFinalizer(function(){o.controller.close(),delete o.controller})})}(window.Diskupon),function(e){e.App.module("Deals.List",function(o,n,t,i,l,a){this.startWithParent=!1,o.on("start",function(){}),o.DealsListItemView=i.ItemView.extend({template:tpl_deals_item,tagName:"div",className:"dsk-dealContainer pull-left"}),o.DealsListCollectionView=i.CollectionView.extend({tagName:"div",className:"dsk-listOfDeals clearfix",itemView:o.DealsListItemView,onRender:function(){this.$el.find(".dsk-di-cover").lazyload({}),this.$el.find(".dsk-dealItem").hover(function(){l(this).addClass("hover")},function(){l(this).removeClass("hover")})}}),o.DealsListMobileItemView=i.ItemView.extend({template:tpl_deals_item_mobile,tagName:"div",className:"dsk-dealContainer-mobile clearfix"}),o.DealsListMobileCollectionView=i.CollectionView.extend({tagName:"div",className:"dsk-listOfDeals-mobile clearfix",itemView:o.DealsListMobileItemView,onRender:function(){this.$el.find(".dsk-di-cover-mobile").lazyload({})}}),o.Controller=i.Controller.extend({initialize:function(o){a.bindAll(this,"showDeals","renderDeals"),this.DealsListRegion=o.DealsListRegion,this.DealsListMobileRegion=o.DealsListMobileRegion,this.SearchParams={RegionId:1,CategoryId:e.DealCategory.All,PageNumber:1,SearchQuery:""}},renderDeals:function(e){if(l(this.DealsListRegion.el).is(":visible")){var n=new o.DealsListCollectionView({collection:e});this.DealsListRegion.show(n),this.trigger("dealslist:listshown")}if(l(this.DealsListMobileRegion.el).is(":visible")){var t=new o.DealsListMobileCollectionView({collection:e});this.DealsListMobileRegion.show(t),this.trigger("dealslist:listmobileshown")}},showDeals:function(){var e=this,o=new n.Deals.Repository;this.SearchParams.RegionId=n.SelectedRegionId.get();var t=o.search(this.SearchParams);t.done(function(o){e.renderDeals(o)})}}),o.addInitializer(function(e){o.controller=new o.Controller({DealsListRegion:e.DealsListRegion,DealsListMobileRegion:e.DealsListMobileRegion}),o.controller.listenTo(o.controller,"dealslist:listshown",function(){l(window).trigger("scroll")}),o.controller.listenTo(o.controller,"dealslist:listmobileshown",function(){l(window).trigger("scroll")})}),o.addFinalizer(function(){o.controller.close(),delete o.controller})})}(window.Diskupon),function(e){e.App.module("Deals",function(o,n,t,i,l,a){var s=t.Marionette.Layout.extend({template:"#dealListPageLayout_template",regions:{HomeSlides:"#dsk_homeSlides",MainContent:"#dsk_content",MainContentMobile:"#dsk_content_mobile"},className:"container"}),r=t.Marionette.Layout.extend({template:"#dealDetailsPageLayout_template",regions:{MainContent:"#dsk_content",MainContentMobile:"#dsk_content_mobile"},className:"container"}),c=["Deals.List","Deals.Details"];o.on("start",function(){o.listLayout=new s,o.detailsLayout=new r}),o.Controller=i.Controller.extend({initialize:function(){a.bindAll(this,"showDealsList","showDealDetails")},_renderListLayout:function(){o.listLayout.render(),n.regionManager.get("Main").show(o.listLayout)},_renderDetailsLayout:function(){o.detailsLayout.render(),n.regionManager.get("Main").show(o.detailsLayout)},_startListSubmodule:function(){var e={DealsListRegion:o.listLayout.MainContent,DealsListMobileRegion:o.listLayout.MainContentMobile};n.vent.trigger("submodule:start",c,"Deals.List",e)},_startDetailsModule:function(){var e={DealsDetailsRegion:o.detailsLayout.MainContent,DealsDetailsMobileRegion:o.detailsLayout.MainContentMobile};n.vent.trigger("submodule:start",c,"Deals.Details",e)},_startHomeSlidesModule:function(){var e={HomeSlidesRegion:o.listLayout.HomeSlides};n.module("HomeSlides").start(e)},showDealsList:function(o){var t={categoryId:e.DealCategory.All,searchQuery:""};o=l.extend({},t,o),this._renderListLayout(),this._startHomeSlidesModule(),this._startListSubmodule(),n.Deals.List.controller.SearchParams.CategoryId=o.categoryId,n.Deals.List.controller.SearchParams.SearchQuery=o.searchQuery,n.Deals.List.controller.showDeals(),n.HomeSlides.controller.show()},showDealDetails:function(e){this._renderDetailsLayout(),this._startDetailsModule(),n.Deals.Details.controller.DealId=e,n.Deals.Details.controller.showDealsDetails()},showTopDealsGroupByCategory:function(){this._renderListLayout(),this._startHomeSlidesModule(),n.HomeSlides.controller.show()}}),o.addInitializer(function(){o.controller=new o.Controller({})}),o.addFinalizer(function(){o.controller.close(),delete o.controller})})}(window.Diskupon),Backbone.ajax=function(){var e=Array.prototype.slice.call(arguments);return e[0]&&(e[0].type="POST"),Backbone.$.ajax.apply(Backbone.$,e)},function(e){e(document).ajaxStart(function(){NProgress&&NProgress.start()}),e(document).ajaxStop(function(){NProgress&&NProgress.done(!0)})}(jQuery),window.onerror=function(e){console.log(e),NProgress&&NProgress.done(!0)};