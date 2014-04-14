(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
/********************************/
/*
/* Diskupon Starts Here
/*
/********************************/
window.Diskupon = {
    DealCategory: {
        All: -11,
        New: -22,
        Hot: -33,
        EndingSoon: -44,
        ByCategory: -55,
        Honeymoon: -66
    },
    //API_HOST: 'diskupon.api',
    API_HOST: 'diskupon.apphb.com',
    requestUrl: function (slug) {
        if (slug.substring(0, 1) === '/') {
            return '//' + this.API_HOST + slug;
        } else {
            return '//' + this.API_HOST + '/api/' + slug;
        }
    }
};

(function (diskupon) {
    diskupon.App = new Marionette.Application();
    var App = diskupon.App;

    /*** regions and layouts ***/
    App.regionManager = new Marionette.RegionManager();
    App.regionManager.addRegions({
        Header: '#dsk_header',
        RegionSelector: '#dsk_pick_region',
        TopMenu: '#dsk_topMenu',
        TopMenuInner: '#dsk_topMenu_Inner',
        TopMenuInnerMobile: '#dsk_topMenu_Inner_Mobile',
        Main: '#dsk_main',
        Affiliates: '#dsk_affiliates',
        Footer: '#dsk_footer'
    });

    /*** event handlers ***/
    App.on('start', function () {
        if (Backbone.history){
            Backbone.history.start({ pushState: true });
            prepareBackbonePushState();
        }
    });


    /**************************************************************************************/
    // todo: we can move this to a view
    var headerElementId = App.regionManager.get('Header').el;
    $(document).on('click', (headerElementId + ' #dsk_searchDeals_submit'), function (e) {
        $(headerElementId + ' #dsk_searchDeals_form').submit();
        e.preventDefault();
        return false;
    });
    $(document).on('submit', (headerElementId + ' #dsk_searchDeals_form'), function (e) {
        var query = $(headerElementId + ' #dsk_searchDeals_query').val().trim();
        if (query) {
            var encodedQuery = encode(query);
            window.location.href = '/kupons/search/' + encodedQuery;
            //Backbone.history.navigate('/kupons/search/' + encodedQuery, true);
        }
        e.preventDefault();
        return false;
    });
    $(document).on('click', '.dsk-topMenuInnerMobile li a', function (e) {
        var isCollapsed = $('.dsk-navtoggle').hasClass('collapsed');
        if (!isCollapsed) {
            $('.dsk-navtoggle').trigger('click');
        }
    });
    $(window).load(function () {
        // not sure.. so comment :D
        //diskupon.GlobalEvents.tickRelayoutMasonry();
    });
    $(window).resize(function () {
        if (typeof window.msnry !== 'undefined') {
            window.msnry.layout();
        }
    });
    // end todo
    /**************************************************************************************/


    /*** others ***/
    App.SelectedRegionId = {
        get: function () {
            var ls = App.Storage.getItem('ds_regionid');
            if (ls === null) {
                ls = '2'; // change this with jakarta id
            }
            var selectedRegionId = parseInt(ls, 10);
            return selectedRegionId;
        },
        set: function (value) {
            App.Storage.setItem('ds_regionid', value.toString());
        }
    };

    // can be cookie? but now localStorage
    App.Storage = {};
    var lsStorage = {
        setItem: function (key, value) {
            localStorage.setItem(key, value);
        },
        getItem: function (key) {
            return localStorage.getItem(key);
        }
    };
    var dStorage = {
        setItem: function (key, value) {
        },
        getItem: function (key) {
            return '';
        }
    };
    if (typeof localStorage !== 'undefined') {
        App.Storage = lsStorage;
    } else {
        App.Storage = dStorage;
    }

} (window.Diskupon));
;(function (diskupon, App) {

    diskupon.AppRouter = Backbone.Marionette.AppRouter.extend({

    });

    App.addInitializer(function () {
        new diskupon.AppRouter({
            controller: window.AppRouterController,
            appRoutes: {
                "": "showHomePage",
                "kupons/all": "showAllKuponsPage",
                "kupons/new": "showNewKuponsPage",
                "kupons/endingsoon": "showEndingSoonKuponsPage",
                "kupons/hot": "showHotKuponsPage",
                "kupons/category/:id/:name": "showKuponsByCategory",
                "kupons/honeymoon": "showHoneymoon",
                "kupons/details/:id/:name": "showKuponDetails",
                "kupons/search/:query": "searchForKupons",
                "checkout": "checkout"
            }
        });
    });

} (window.Diskupon, window.Diskupon.App));
;(function (arc, diskupon, App) {

    var cc = {
        checkout: function () {
            this.showHeader();
            this.showAffiliates();
            App.Cart.controller.checkout();
        }
    };

    $.extend(arc, cc);

} (window.AppRouterController = window.AppRouterController || {}, window.Diskupon, window.Diskupon.App));
;(function (arc, diskupon, App) {

    var ec = {
        stopHeaderModules: function () {
            App.module('RegionSelector').stop();
            App.module('TopMenu').stop();
            App.Cart.controller.stopCartLinkModule();
        },

        startHeaderModules: function (options) {
            App.module('RegionSelector').start();
            App.module('TopMenu').start(options);
            App.Cart.controller.startCartLinkModule();
        },

        showHeader: function (options) {
            this.stopHeaderModules();
            this.startHeaderModules(options);

            App.Cart.controller.showCartLink();
            App.RegionSelector.controller.show();
            App.TopMenu.controller.show();
        },

        showAffiliates: function () {
            App.module('Affiliates').stop();
            App.module('Affiliates').start();

            App.Affiliates.controller.show();
        }
    };

    $.extend(arc, ec);

} (window.AppRouterController = window.AppRouterController || {}, window.Diskupon, window.Diskupon.App));
;(function (arc, diskupon, App) {

    var kr = {
        showHomePage: function () {
            this.showHeader();
            this.showAffiliates();
            App.Deals.controller.showTopDealsGroupByCategory();
        },

        showAllKuponsPage: function () {
            this.showHeader({
                CategoryId: diskupon.DealCategory.All
            });
            this.showAffiliates();
            App.Deals.controller.showDealsList({
                categoryId: diskupon.DealCategory.All,
                searchQuery: ''
            });
        },

        showNewKuponsPage: function () {
            this.showHeader({
                CategoryId: diskupon.DealCategory.New
            });
            this.showAffiliates();
            App.Deals.controller.showDealsList({
                categoryId: diskupon.DealCategory.New,
                searchQuery: ''
            });
        },

        showEndingSoonKuponsPage: function () {
            this.showHeader({
                CategoryId: diskupon.DealCategory.EndingSoon
            });
            this.showAffiliates();
            App.Deals.controller.showDealsList({
                categoryId: diskupon.DealCategory.EndingSoon,
                searchQuery: ''
            });
        },

        showHotKuponsPage: function () {
            this.showHeader({
                CategoryId: diskupon.DealCategory.Hot
            });
            this.showAffiliates();
            App.Deals.controller.showDealsList({
                categoryId: diskupon.DealCategory.Hot,
                searchQuery: ''
            });
        },

        showKuponsByCategory: function (id, name) {
            this.showHeader({
                CategoryId: diskupon.DealCategory.ByCategory,
                SubCategoryId: id
            });
            this.showAffiliates();
            App.Deals.controller.showDealsList({
                categoryId: id,
                searchQuery: ''
            });
        },

        showHoneymoon: function () {
            this.showHeader({
                CategoryId: diskupon.DealCategory.Honeymoon
            });
            this.showAffiliates();
        },

        showKuponDetails: function (id, name) {
            this.showHeader();
            this.showAffiliates();
            App.Deals.controller.showDealDetails(id);
        },

        searchForKupons: function (query) {
            this.showHeader({
                CategoryId: diskupon.DealCategory.All
            });
            this.showAffiliates();
            App.Deals.controller.showDealsList({
                categoryId: diskupon.DealCategory.All,
                searchQuery: query
            });
        }
    };

    $.extend(arc, kr);

} (window.AppRouterController = window.AppRouterController || {}, window.Diskupon, window.Diskupon.App));
;(function (diskupon) {
    diskupon.App.module("Cart", function (Cart, App, Backbone, Marionette, $, _) {

        var CartSummaryModel = Backbone.Model.extend({
            idAttribute: 'CartSummaryItemId',
            url: '/api/v1/cartsummary',
            initialize: function () {
                if (typeof Backbone.Memento !== 'undefined') {
                    this.memento = new Backbone.Memento(this);
                    //this.restart = this.memento.restart;
                }
            },
            deleteData: function (params) {
                //this.memento.store();
                var dis = this;
                var d = $.Deferred();
                this.destroy({
                    data: {
                        CartSummaryItemId: this.id,
                        KuponId: this.get('KuponId'),
                        CartInfo: params
                    },
                    wait: true,
                    //processData: true,
                    success: function (model, response, options) {
                        d.resolve();
                    },
                    error: function (model, xhr, options) {
                        d.reject();
                    }
                });
                return d.promise();
            },
            saveDataChanges: function (params) {
                var dis = this;
                var data = this.changedAttributes();
                data.CartInfo = params;
                this.save(data, {
                    wait: true,
                    success: function (model, response, options) {
                    },
                    error: function (model, response, options) {
                        dis.memento.restore();
                    }
                });
            },
            substractQty: function (params) {
                this.memento.store();

                /*** update ***/
                var qty = parseInt(this.get('QtyBought'), 10);
                if (qty <= 0) {
                    return false;
                }
                qty--;
                var ppu = this.get('PricePerUnit');
                var price = Math.ceil(qty * ppu);
                this.set({ QtyBought: qty, Price: price });
                /*** end update ***/

                this.saveDataChanges(params);
            },
            addQty: function (params) {
                this.memento.store();

                /*** update ***/
                var qty = parseInt(this.get('QtyBought'), 10);
                qty++;
                var ppu = this.get('PricePerUnit');
                var price = Math.ceil(qty * ppu);
                this.set({ QtyBought: qty, Price: price });
                /*** end update ***/

                this.saveDataChanges(params);
            }
        });

        var CartSummaryCollection = Backbone.Collection.extend({
            model: CartSummaryModel,
            url: '/api/v1/cartsummary',
            getData: function (params) {
                this.fetch({ reset: true, data: $.param(params) });
            },
            subTotal: function () {
                var st = 0;
                this.each(function (m) {
                    st += parseInt(m.get('Price'), 10);
                });
                return st;
            },
            qtyTotal: function () {
                var q = 0;
                this.each(function (m) {
                    q += parseInt(m.get('QtyBought'), 10);
                });
                return q;
            }
        });

        var CartTotalModel = Backbone.Model.extend({
            url: '/api/v1/carttotal',
            getData: function (params) {
                this.fetch({ reset: true, data: $.param(params) });
            }
        });

        /*
            Cart model:
            CartId,
            CartToken,
            CustomerId,
            CartTimestamp,
            CartItems,
            CreatedDate,
            UpdatedDate
        */
        var CartModel = Backbone.Model.extend({
            url: '/api/v1/cart',
            fetchById: function (cartId) {
                this.fetch({ reset: true, data: $.param({ CartId: cartId }) });
            }
        });

        /*
            Cart Item Model:
            CartItemId,
            CartId,
            DealId,
            KuponId,
            QtyBought,
            CreatedDate,
            UpdatedDate
        */
        // var CartItemModel = Backbone.Model.extend({
        //     idAttribute: 'CartItemId',
        //     url: '/api/v1/cart',
        //     initialize: function () {
        //         if (typeof Backbone.Memento !== 'undefined') {
        //             this.memento = new Backbone.Memento(this);
        //         }
        //     }
        // });

        /*** Repositories ***/
        Cart.Repository = Marionette.Controller.extend({
            initialize: function () {
                //_.bindAll(this, 'search');
            },

            getCartSummary: function (params) {
                var deferred = $.Deferred();

                var cisColl = new CartSummaryCollection();
                cisColl.on('reset', function (cis) {
                    deferred.resolve(cis);
                });
                cisColl.getData(params);

                return deferred.promise();
            },

            getCartTotal: function (params) {
                var deferred = $.Deferred();

                var ctModel = new CartTotalModel();
                ctModel.on('change', function (cartTotal) {
                    deferred.resolve(cartTotal);
                });
                ctModel.getData(params);

                return deferred.promise();
            },

            addKuponToCart: function (params, success, fail) {
                var params2 = {
                    CartInfo: params.CartInfo,
                    DealId: params.DealId,
                    SelectedKupons: params.SelectedKupons
                };
                var cb = function (data, textStatus, jqXHR) {
                    if (typeof success === 'function') {
                        success(data);
                    }
                };
                var f = function () {
                    if (typeof fail === 'function') {
                        fail();
                    }
                };
                var a = function () {

                };
                $.post('/api/v1/addtocart', params2, cb, 'json').fail(f).always(a);
            },

            getCart: function (cartId) {
                var deferred = $.Deferred();

                var cModel = new CartModel();
                cModel.on('change', function (cartModel) {
                    deferred.resolve(cartModel);
                });
                cModel.fetchById(cartId);

                return deferred.promise();
            }
        });

    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.App.module("Cart.CartLink", function (CartLink, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        CartLink.CartSummaryEmptyView = Marionette.ItemView.extend({
            template: tpl_cart_summary_empty
        });

        /// item view for cart summary
        CartLink.CartSummaryItemView = Marionette.ItemView.extend({
            tagName: 'li',
            className: 'media dsk-csi',
            template: tpl_cart_summary_item,
            events: {
                'click .dsk-csi-addQty': 'addQty',
                'click .dsk-csi-substractQty': 'substractQty',
                'click .dsk-csi-del': 'deleteSummaryCartItem'
            },
            initialize: function () {
                this.model.on('change', this.render, this);
            },
            /// add qty of an item, trigger event to parent view
            addQty: function (e) {
                e.preventDefault();
                this.trigger('cartsummaryitem:qtyadded');
            },
            /// substract qty of an item, trigger event to parent view
            substractQty: function (e) {
                e.preventDefault();
                this.trigger('cartsummaryitem:qtysubstracted');
            },
            /// delete the cart item, trigger event to parent view
            deleteSummaryCartItem: function (e) {
                e.preventDefault();
                this.trigger('cartsummaryitem:deleted');
            }
        });

        /// cart summary view, holding list of cart items in a summary view
        CartLink.CartSummaryView = Marionette.CompositeView.extend({
            itemView: CartLink.CartSummaryItemView,
            template: tpl_cart_summary,
            itemViewContainer: '#dsk_cartList',
            emptyView: CartLink.CartSummaryEmptyView,
            onRender: function () {
                var dis = this;
                this.checkListStatus();
                this.renderCartTotals();
                // refresh the cart total after open
                this.trigger('cartsummary:updatecarttotal');
            },
            checkListStatus: function () {
                if (this.collection.length > 0) {
                    this.trigger('cartsummary:notempty');
                } else {
                    this.trigger('cartsummary:empty');
                }
            },
            renderCartTotals: function () {
                //2 items : 2,324,534
                var ct = this.collection.qtyTotal() + ' items, subtotal: ' + accounting.formatNumber(this.collection.subTotal(), 0);
                this.$el.find('.dsk-cartTotals p span').html(ct);
            }
        });

        CartLink.CartLinkView = Marionette.ItemView.extend({
            template: tpl_cart_link,
            events: {
                'click #dsk_showCartSummary': 'showCartSummaryModal',
                'click #dsk_checkoutButton': 'navigateCheckout',
                'click #dsk_closeCartButton': 'closeThisView'
            },
            initialize: function () {
                _.bindAll(this, 'showCartSummaryModal');
                this.csView = null;
                this.csRegion = null;
            },
            closeThisView: function () {
                this.$el.find('button.close').trigger('click');
            },
            navigateCheckout: function () {
                //window.location.href = '/checkout';
                this.$el.find('button.close').trigger('click');
                Backbone.history.navigate('/checkout', true);
            },
            closeCartSummaryView: function () {
                if (this.csView) {
                    this.csView.close();
                }
            },
            showLoader: function () {
                this.$el.find('#cartSummaryModal .loader').show();
            },
            hideLoader: function () {
                this.$el.find('#cartSummaryModal .loader').hide();
            },
            showError: function () {
                this.$el.find('#cartSummaryModal .error-cart').show();
            },
            hideError: function () {
                this.$el.find('#cartSummaryModal .error-cart').hide();
            },
            showCartSummaryView: function (data) {
                var dis = this;
                /// data is a backbone collection
                var models = data;
                // hide error message
                this.hideError();

                // prepare viewing are and view
                var cartSummaryRegion = Backbone.Marionette.Region.extend({
                    el: this.$el.find('#cartSummaryModal #dsk_cartSummaryContainer')
                });

                var cartSummaryView = new CartLink.CartSummaryView({
                    collection: models
                });

                cartSummaryView.on('itemview:cartsummaryitem:qtyadded', function (itemView) {
                    dis.trigger('cartsummary:item:qtyadded', itemView);
                });

                cartSummaryView.on('itemview:cartsummaryitem:qtysubstracted', function (itemView) {
                    dis.trigger('cartsummary:item:qtysubstracted', itemView);
                });

                cartSummaryView.on('itemview:cartsummaryitem:deleted', function (itemView) {
                    dis.trigger('cartsummary:item:deleted', itemView);
                });

                cartSummaryView.on('cartsummary:updatecarttotal', function (itemView) {
                    dis.trigger('cartsummary:demandcarttotal');
                });

                cartSummaryView.on('cartsummary:notempty', function () {
                    dis.$el.find('#dsk_checkoutButton').prop('disabled', false);
                    dis.$el.find('#dsk_closeCartButton').prop('disabled', false);
                });

                cartSummaryView.on('cartsummary:empty', function () {
                    dis.$el.find('#dsk_checkoutButton').prop('disabled', true);
                    dis.$el.find('#dsk_closeCartButton').prop('disabled', true);
                });

                this.csView = cartSummaryView;
                this.csRegion = new cartSummaryRegion();
                this.csRegion.show(this.csView);
            },
            onRender: function () {
                var dis = this;
                var a = this.$el.find('#cartSummaryModal');

                a.modal({ show: false });

                a.on('show.bs.modal', function () {
                    dis.closeCartSummaryView();
                    dis.showLoader();
                });

                a.on('shown.bs.modal', function () {
                    dis.trigger('cartsummary:shown');
                });

                this.trigger('cartsummary:demandcarttotal');
            },
            renderCartCount: function (cartTotalModel) {
                var q = 0,
                    k = 0,
                    j = {};
                if (this.csView) {
                    this.csView.collection.each(function (m) {
                        q += parseInt(m.QtyBought, 10);
                    });
                    j = {
                        Kinds: this.csView.collection.length,
                        Qty: q
                    };
                } else {
                    _.each(cartTotalModel.attributes, function (m) {
                        q += parseInt(m.QtyBought, 10);
                        k++;
                    });
                    j = {
                        Kinds: k,
                        Qty: q
                    };
                }
                this.$el.find('#dsk_showCartSummary .badge').html(j.Kinds);
            },
            renderCartCountEmpty: function () {
                this.$el.find('#dsk_showCartSummary .badge').html('0');
            },
            showCartSummaryModal: function (e) {
                if (typeof e !== 'undefined') {
                    e.preventDefault();
                }
                var a = this.$el.find('#cartSummaryModal');
                a.modal('show');
            }
        });

        CartLink.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'show', 'setupEventListeners');
                this.ContainerRegion = options.ContainerRegion;
                this.View = null;
            },

            setupEventListeners: function (cartLinkView) {
                var dis = this;
                // cart link view event - user/customer demand to show cart summary
                this.listenTo(cartLinkView, 'cartsummary:shown', function () {
                    var ci = App.Cart.controller.getCartInfo();
                    dis.getCartSummary({
                        cartInfo: ci,
                        success: function (data) {
                            cartLinkView.showCartSummaryView(data);
                        },
                        fail: function () {
                            cartLinkView.showError();
                        },
                        done: function () {
                            cartLinkView.hideLoader();
                        }
                    });
                });
                // cart total badge besides cart link
                this.listenTo(cartLinkView, 'cartsummary:demandcarttotal', function () {
                    dis.updateCartCount();
                });
                this.listenTo(cartLinkView, 'cartsummary:item:qtyadded', function (itemView) {
                    var ci = App.Cart.controller.getCartInfo();
                    itemView.model.addQty(ci);
                    cartLinkView.csView.renderCartTotals();
                    cartLinkView.trigger('cartsummary:demandcarttotal');
                });
                this.listenTo(cartLinkView, 'cartsummary:item:qtysubstracted', function (itemView) {
                    var ci = App.Cart.controller.getCartInfo();
                    itemView.model.substractQty(ci);
                    cartLinkView.csView.renderCartTotals();
                    cartLinkView.trigger('cartsummary:demandcarttotal');
                });
                this.listenTo(cartLinkView, 'cartsummary:item:deleted', function (itemView) {
                    var ci = App.Cart.controller.getCartInfo();
                    var p = itemView.model.deleteData(ci);
                    p.done(function () {
                        itemView.close();
                        cartLinkView.trigger('cartsummary:demandcarttotal');
                    });
                    p.always(function () {
                        cartLinkView.csView.checkListStatus();
                        cartLinkView.csView.renderCartTotals();
                    });
                });
            },

            show: function () {
                var cartLinkView = new CartLink.CartLinkView({
                    el: $("#dsk_cartLinkSection")
                });
                this.View = cartLinkView;
                this.setupEventListeners(cartLinkView);
                this.ContainerRegion.attachView(cartLinkView);
                this.ContainerRegion.show(cartLinkView);
            },

            getCartSummary: function (params) {
                var repo = new App.Cart.Repository();
                var promise = repo.getCartSummary(params.cartInfo);
                promise.done(function (cartSummaryItems) {
                    if (typeof params.success === 'function') {
                        params.success(cartSummaryItems);
                    }
                });
                promise.fail(function () {
                    if (typeof params.fail === 'function') {
                        params.fail();
                    }
                });
                promise.always(function () {
                    if (typeof params.done === 'function') {
                        params.done();
                    }
                });
            },

            getCartTotal: function (params) {
                var repo = new App.Cart.Repository();
                var promise = repo.getCartTotal(params.cartInfo);
                promise.done(function (cartTotal) {
                    if (typeof params.success === 'function') {
                        params.success(cartTotal);
                    }
                });
                promise.fail(function () {
                    if (typeof params.fail === 'function') {
                        params.fail();
                    }
                });
                promise.always(function () {
                    if (typeof params.done === 'function') {
                        params.done();
                    }
                });
            },

            updateCartCount: function () {
                var ci = App.Cart.controller.getCartInfo(),
                    cartLinkView = this.View;
                this.getCartTotal({
                    cartInfo: ci,
                    success: function (data) {
                        if (cartLinkView) {
                            cartLinkView.renderCartCount(data);
                        }
                    },
                    fail: function () {
                        if (cartLinkView) {
                            cartLinkView.renderCartCountEmpty(data);
                        }
                    }
                });
            }
        });

        CartLink.addInitializer(function () {
            CartLink.controller = new CartLink.Controller({
                ContainerRegion: App.regionManager.get('Header')
            });
            App.vent.on("selectkuponandbuy:gotocart", function () {
                window.scroll(0, 0);
                if (CartLink.controller.View) {
                    CartLink.controller.View.showCartSummaryModal();
                }
            });
            App.commands.setHandler('updatecartcountaftersuccessfuladdtocart', function () {
                CartLink.controller.updateCartCount();
            });
        });

    });
} (window.Diskupon));


;(function (diskupon) {
    diskupon.App.module("Cart.CartList", function (CartList, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        var CartListView = Marionette.ItemView.extend({
            template: tpl_cart_list,
            className: 'dsk-vcCartList',
            events: {

            },
            initialize: function () {
                //_.bindAll(this, 'showCartSummaryModal');
            }
        });

        CartList.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'show', 'renderCartList');
                this.Region = options.Region;
            },
            renderCartList: function (cartModel) {
                var view = new CartListView({
                    model: cartModel
                });
                this.Region.show(view);
            },
            show: function () {
                var dis = this;
                var repo = new App.Cart.Repository();
                var promise = repo.getCart(234);
                promise.done(function (cartModel) {
                    dis.renderCartList(cartModel);
                });
                promise.fail(function () {

                });
            }
        });

        CartList.addInitializer(function (args) {
            CartList.controller = new CartList.Controller({
                Region: args.Region
            });
        });

    });
} (window.Diskupon));


;(function (diskupon) {
    diskupon.App.module("Cart", function (Cart, App, Backbone, Marionette, $, _) {

        function generateCartInfo () {
            // dummy param sent to server, meaning this is a new cart, will generate new token, timestamp, etc
            var cartInfo = {
                CartId: parseInt((-1 * chance.natural({ max: 2147483647 })), 10),
                Token: chance.guid(), // cart identifier
                Timestamp: moment().utc().valueOf(), // timestamp used to validate cart
                UserId: parseInt((-1 * chance.natural({ max: 2147483647 })), 10) // userid of current logged in member. If no member / guest, return < 0
            };
            return cartInfo;
        }

        Cart.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                //_.bindAll(this);
            },

            startCartLinkModule: function () {
                App.module('Cart.CartLink').start();
            },

            stopCartLinkModule: function () {
                App.module('Cart.CartLink').stop();
            },

            getCartInfo: function () {
                var inStorage = App.Storage.getItem('ds_cartInfo'),
                    jCartInfo,
                    emptyStorage = false;

                if (!inStorage) { // localstorage is null
                    emptyStorage = true;
                } else {
                    var is = JSON.parse(inStorage);
                    if ($.isEmptyObject(is)) {
                        emptyStorage = true;
                    }
                }

                if (emptyStorage) {
                    jCartInfo = generateCartInfo();
                    var sCartInfo = JSON.stringify(jCartInfo);
                    App.Storage.setItem('ds_cartInfo', sCartInfo);
                }

                inStorage = App.Storage.getItem('ds_cartInfo');
                jCartInfo = JSON.parse(inStorage);
                return jCartInfo;
            },

            storeCartInfo: function (jCartInfo) {
                var sCartInfo = JSON.stringify(jCartInfo);
                App.Storage.setItem('ds_cartInfo', sCartInfo);
            },

            showCartLink: function () {
                Cart.CartLink.controller.show();
            },

            addKuponToCart: function (params) {
                var dis = this,
                    cartInfo = this.getCartInfo(),
                    repo = new App.Cart.Repository();
                var params2 = {
                    CartInfo: cartInfo,
                    DealId: params.Deal.DealId,
                    SelectedKupons: params.SelectedKupons
                };
                repo.addKuponToCart(params2, function (data) {
                    // data suppose to be CartInfo
                    var ci = {
                        CartId: data.CartId,
                        Token: data.Token,
                        Timestamp: data.Timestamp,
                        UserId: data.UserId
                    };
                    dis.storeCartInfo(ci);
                    App.commands.execute('updatecartcountaftersuccessfuladdtocart');
                    App.vent.trigger("selectkuponandbuy:success");

                }, function () {
                    // add kupon to cart fail, show message?
                    App.vent.trigger("selectkuponandbuy:failed");
                });
            },

            checkout: function () {
                App.module('Checkout').stop();
                App.module('Checkout').start();

                App.Checkout.controller.show();
            }
        });

        Cart.addInitializer(function () {
            Cart.controller = new Cart.Controller({
            });
            App.commands.setHandler('addkupontocart', function (params) {
                Cart.controller.addKuponToCart(params);
            });
        });

        Cart.addFinalizer(function () {
            Cart.controller.close();
            delete Cart.controller;
        });

    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.App.module("Checkout", function (Checkout, App, Backbone, Marionette, $, _) {

        var PaymentMethodsModel = Backbone.Model.extend({
            url: '/api/v1/paymentmethods',
            initialize: function () {
                // if (typeof Backbone.Memento !== 'undefined') {
                //     this.memento = new Backbone.Memento(this);

                // }
            },
            getData: function () {
                // this.fetch({ reset: true, data: $.param({}) });
                this.fetch({ reset: true });
            }
        });

        /*** Repositories ***/
        Checkout.Repository = Marionette.Controller.extend({
            initialize: function () {
                //_.bindAll(this, 'search');
            },

            getPaymentMethods: function () {
                var deferred = $.Deferred();

                var model = new PaymentMethodsModel();
                model.on('change', function (remodel) {
                    deferred.resolve(remodel);
                });
                cModel.getData();

                return deferred.promise();
            }
        });

    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.App.module("Checkout", function (Checkout, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        var CheckoutLayout = Marionette.Layout.extend({
            template: tpl_checkout,
            regions: {
                CartList: '#dsk_vcCartList',
                PaymentMethods: '#dsk_vcPaymentMethods',
                CustomerDetails: '#dsk_vcCustomerDetails'
            },
            onShow: function () {
                this.$el.find('#dsk_vcAgreeTC').iCheck({
                    checkboxClass: 'icheckbox_flat-green',
                    radioClass: 'iradio_flat-green',
                    increaseArea: '20%'
                });
            }
        });

        Checkout.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'show', 'startAndShowCartList', 'startAndShowPaymentMethods');
                this.Layout = new CheckoutLayout();
            },
            startAndShowCartList: function () {
                App.module('Cart.CartList').stop();
                App.module('Cart.CartList').start({
                    Region: this.Layout.CartList
                });

                App.Cart.CartList.controller.show();
            },
            startAndShowPaymentMethods: function () {
                App.module('Checkout.PaymentMethods').stop();
                App.module('Checkout.PaymentMethods').start({
                    Region: this.Layout.PaymentMethods
                });

                App.Checkout.PaymentMethods.controller.show();
            },
            show: function () {
                // render layout
                this.Layout.render();
                App.regionManager.get('Main').show(this.Layout);

                this.startAndShowCartList();
                this.startAndShowPaymentMethods();
            }
        });

        Checkout.addInitializer(function () {
            Checkout.controller = new Checkout.Controller({

            });
        });

    });
} (window.Diskupon));


;(function (diskupon) {
    diskupon.App.module("Checkout.PaymentMethods", function (PaymentMethods, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        var PaymentMethodsView = Marionette.ItemView.extend({
            template: tpl_payment_methods,
            className: 'dsk-vcPaymentMethods',
            events: {

            },
            initialize: function () {
            },
            onShow: function () {
                this.$el.find('.rb-paymentMethod').iCheck({
                    checkboxClass: 'icheckbox_flat-green',
                    radioClass: 'iradio_flat-green',
                    increaseArea: '20%'
                });
            }
        });

        PaymentMethods.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'show', 'renderPaymentMethods');
                this.Region = options.Region;
            },
            renderPaymentMethods: function (model) {
                var view = new PaymentMethodsView({
                    model: model
                });
                this.Region.show(view);
            },
            show: function () {
                var dis = this;
                // var repo = new App.Checkout.Repository();
                // var promise = repo.getPaymentMethods();
                // promise.done(function (model) {
                //     dis.renderPaymentMethods(model);
                // });
                // promise.fail(function () {

                // });
                dis.renderPaymentMethods();
            }
        });

        PaymentMethods.addInitializer(function (args) {
            PaymentMethods.controller = new PaymentMethods.Controller({
                Region: args.Region
            });
        });

    });
} (window.Diskupon));


;(function (diskupon) {
    diskupon.App.module("Affiliates", function (Affiliates, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        Affiliates.AffiliatesView = Marionette.ItemView.extend({
            template: tpl_affiliates,
            tagName: 'div',
            className: '',
            events: {

            },
            onRender: function () {
                this.$el.find('#affiliates_stream').flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: true,
                    slideshow: true,
                    itemWidth: 150,
                    pauseOnAction: false,
                    pauseOnHover: false,
                    pausePlay: false,
                    slideshowSpeed: 6000
                });
            }
        });

        Affiliates.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'show');
                this.AffiliatesRegion = options.AffiliatesRegion;
            },

            show: function () {
                var view = new Affiliates.AffiliatesView({
                });
                this.AffiliatesRegion.show(view);
            }
        });

        Affiliates.addInitializer(function () {
            Affiliates.controller = new Affiliates.Controller({
                AffiliatesRegion: App.regionManager.get('Affiliates')
            });
        });

    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.App.module("HomeSlides", function (HomeSlides, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        HomeSlides.on('start', function () {

        });

        HomeSlides.HomeSlidesView = Marionette.ItemView.extend({
            template: tpl_home_slides,
            tagName: 'div',
            className: '',
            events: {

            },
            onRender: function () {

            }
        });

        HomeSlides.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'show');
                this.HomeSlidesRegion = options.HomeSlidesRegion;
            },

            show: function () {
                var view = new HomeSlides.HomeSlidesView({
                });
                this.HomeSlidesRegion.show(view);
            }
        });

        HomeSlides.addInitializer(function (args) {
            HomeSlides.controller = new HomeSlides.Controller({
                HomeSlidesRegion: args.HomeSlidesRegion
            });
        });

    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.App.module("RegionSelector", function (RegionSelector, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        RegionSelector.SelectRegionView = Marionette.ItemView.extend({
            template: tpl_region_selector,
            tagName: 'span',
            className: 'dsk-regionPicker',
            events: {
                'change #dsk_select_region': 'regionChanged'
            },
            onRender: function () {
                this.$el.find('#dsk_select_region').val(App.SelectedRegionId.get());
            },
            regionChanged: function (e) {
                e.preventDefault();
                var selectedRegionId = parseInt($(e.currentTarget).val(), 10);
                // trigger view event
                this.trigger('region:changed', selectedRegionId);
            }
        });

        RegionSelector.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'show', 'regionChanged');
                this.RegionSelectorRegion = options.RegionSelectorRegion;
            },

            show: function () {
                var that = this,
                    repo = new App.Deals.Repository();

                var promise = repo.getRegions();
                promise.done(function (regions) {
                    var view = new RegionSelector.SelectRegionView({
                        collection: regions
                    });

                    // add listener for view event
                    that.listenTo(view, 'region:changed', that.regionChanged);

                    that.RegionSelectorRegion.show(view);
                });
            },

            /*** event handler ***/
            regionChanged: function (selectedRegionId) {
                //this.trigger('region:changed', selectedRegionId);
                App.SelectedRegionId.set(selectedRegionId);
                window.location.href = '/';
            }
        });

        RegionSelector.addInitializer(function () {
            RegionSelector.controller = new RegionSelector.Controller({
                RegionSelectorRegion: App.regionManager.get('RegionSelector')
            });
        });

    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.App.module("TopMenu", function (TopMenu, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        TopMenu.TopMenuItemView = Marionette.ItemView.extend({
            tagName: 'li',
            template: tpl_top_menu,
            onBeforeRender: function() {
                var subCategories = this.model.get('SubCategories');
                if (subCategories && subCategories.length > 0) {
                    this.$el.addClass('dropdown');
                    this.model.set('HasSubCategories', true);
                } else {
                    this.model.set('HasSubCategories', false);
                }

                var catId = parseInt(this.model.get('CategoryId'), 10);
                this.$el.attr('data-key', catId);
            }
        });

        TopMenu.TopMenuCollectionView = Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav nav-pills dsk-topMenuInner',
            itemView: TopMenu.TopMenuItemView,
            initialize: function (options) {
                _.bindAll(this, 'setActiveMenuItem');
                this.activeTopMenuKey = options.activeTopMenuKey;
                this.activeTopMenuSubKey = options.activeTopMenuSubKey;
            },
            onRender: function () {

            },
            onShow: function () {
                this.trigger('topmenuview:shown');
            },
            setActiveMenuItem: function (activeTopMenuKey, activeTopMenuSubKey) {
                this.$el.find('.active').removeClass('active');
                if (activeTopMenuKey) {
                    this.$el.find('[data-key="' + activeTopMenuKey + '"]').addClass('active');
                }
            }
        });

        /******* top menu for mobile *******/
        TopMenu.TopMenuMobileItemView = Marionette.ItemView.extend({
            tagName: 'li',
            template: tpl_top_menu_mobile,
            onBeforeRender: function() {
                var subCategories = this.model.get('SubCategories');
                if (subCategories && subCategories.length > 0) {
                    this.$el.addClass('dropdown');
                    this.model.set('HasSubCategories', true);
                } else {
                    this.model.set('HasSubCategories', false);
                }

                var catId = parseInt(this.model.get('CategoryId'), 10);
                this.$el.attr('data-key', catId);
            }
        });

        TopMenu.TopMenuMobileCollectionView = Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav nav-pills dsk-topMenuInnerMobile',
            itemView: TopMenu.TopMenuMobileItemView,
            initialize: function (options) {
                _.bindAll(this, 'setActiveMenuItem');
                this.activeTopMenuKey = options.activeTopMenuKey;
                this.activeTopMenuSubKey = options.activeTopMenuSubKey;
            },
            onRender: function () {

            },
            onShow: function () {
                this.trigger('topmenumobileview:shown');
            },
            setActiveMenuItem: function (activeTopMenuKey, activeTopMenuSubKey) {
                this.$el.find('.active').removeClass('active');
                var key = 0;
                if (activeTopMenuSubKey) {
                    key = activeTopMenuSubKey;
                } else if (activeTopMenuKey) {
                    key = activeTopMenuKey;
                }
                if (key) {
                    this.$el.find('[data-key="' + key + '"]').addClass('active');
                }
            }
        });

        TopMenu.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'show', 'setActiveMenuItem');
                this.TopMenuRegion = options.TopMenuRegion;
                this.TopMenuRegionMobile = options.TopMenuRegionMobile;
                this.TopMenuView = undefined;
                this.TopMenuMobileView = undefined;
                this.CategoryId = options.CategoryId;
                this.SubCategoryId = options.SubCategoryId;
            },

            show: function () {
                var that = this;
                var repo = new App.Deals.Repository();
                // fetch data
                var promise = repo.getDealCategories();
                promise.done(function (categories) {
                    /*** in order ***/
                    var view = new TopMenu.TopMenuCollectionView({
                        collection: categories
                    });
                    that.listenTo(view, 'topmenuview:shown', function () {
                        that.setActiveMenuItem(that.CategoryId, that.SubCategoryId);
                    });
                    that.TopMenuView = view;
                    that.TopMenuRegion.show(view);

                    var mobileView = new TopMenu.TopMenuMobileCollectionView({
                        collection: categories
                    });
                    that.listenTo(mobileView, 'topmenumobileview:shown', function () {
                        that.setActiveMenuItem(that.CategoryId, that.SubCategoryId);
                    });
                    that.TopMenuMobileView = mobileView;
                    that.TopMenuRegionMobile.show(mobileView);
                    /*** end in order ***/
                });
                promise.fail(function () {
                });
                promise.always(function () {
                });
            },

            setActiveMenuItem: function (activeTopMenuKey, activeTopMenuSubKey) {
                if (typeof this.TopMenuView !== 'undefined') {
                    this.TopMenuView.setActiveMenuItem(activeTopMenuKey, activeTopMenuSubKey);
                }
                if (typeof this.TopMenuMobileView !== 'undefined') {
                    this.TopMenuMobileView.setActiveMenuItem(activeTopMenuKey, activeTopMenuSubKey);
                }
            }
        });

        TopMenu.addInitializer(function (args) {
            var defs = {
                CategoryId: '',
                SubCategoryId: 0
            };
            var args2 = $.extend({}, defs, args);
            TopMenu.controller = new TopMenu.Controller({
                TopMenuRegion: App.regionManager.get('TopMenuInner'),
                TopMenuRegionMobile: App.regionManager.get('TopMenuInnerMobile'),
                CategoryId: args2.CategoryId,
                SubCategoryId: args2.SubCategoryId
            });
        });
    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.App.module("Deals", function (Deals, App, Backbone, Marionette, $, _) {

        Deals.DealModel = Backbone.Model.extend({
            initialize: function () {
            },
            url: diskupon.requestUrl('deals'),
            getDeal: function (params) {
                this.fetch({ data: $.param(params) });
            }
        });

        Deals.DealCollection = Backbone.Collection.extend({
            model: Deals.DealModel,
            url: diskupon.requestUrl('deals'),
            search: function (searchParam) {
                this.fetch({ reset: true, data: $.param(searchParam) });
            }
        });

        Deals.DealCategoryModel = Backbone.Model.extend({
            initialize: function () {
            }
        });

        Deals.DealCategoryCollection = Backbone.Collection.extend({
            model: Deals.DealCategoryModel,
            url: diskupon.requestUrl('dealcategories')
        });

        Deals.RegionModel = Backbone.Model.extend({
            initialize: function () {
            }
        });

        Deals.RegionCollection = Backbone.Collection.extend({
            model: Deals.RegionModel,
            url: diskupon.requestUrl('regions')
        });

        Deals.Repository = Marionette.Controller.extend({
            initialize: function () {
                _.bindAll(this, 'search');

                this.defaultSearchParams = {
                    RegionId: 1, // jakarta
                    CategoryId: 1, // all kupons
                    PageSize: 65000, // num of records per page
                    PageNumber: 1, // 1-based
                    SearchQuery: ''
                };
            },

            search: function (options) {
                var searchParam = $.extend({}, this.defaultSearchParams, options),
                    deferred = $.Deferred(),
                    dealCollection = new Deals.DealCollection();

                dealCollection.on('reset', function (deals) {
                    deferred.resolve(deals);
                });

                dealCollection.search(searchParam);

                return deferred.promise();
            },

            getOne: function (id) {
                var dealModel = new Deals.DealModel(),
                    deferred = $.Deferred();

                dealModel.on('change', function (deal) {
                    deferred.resolve(deal);
                });

                dealModel.getDeal({ DealId: id });

                return deferred.promise();
            },

            getDealCategories: function () {
                var deferred = $.Deferred(),
                    categoryCollection = new Deals.DealCategoryCollection();

                categoryCollection.on('reset', function (categories) {
                    deferred.resolve(categories);
                });

                categoryCollection.fetch({ reset: true });

                return deferred.promise();
            },

            getRegions: function () {
                var deferred = $.Deferred(),
                    regionCollection = new Deals.RegionCollection();

                regionCollection.on('reset', function (regions) {
                    deferred.resolve(regions);
                });

                regionCollection.fetch({ reset: true });

                return deferred.promise();
            }
        });

    });
} (window.Diskupon));
;(function (diskupon) {

    diskupon.App.module("Deals.Details", function (DealsDetails, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        DealsDetails.on('start', function () {

        });

        /*** TODO: since this is too big, separate into regions and sub views for modularity ***/
        DealsDetails.DealsDetailsView = Marionette.ItemView.extend({
            template: tpl_deal_details,
            tagName: 'div',
            className: 'dsk-dealDetails',
            events: {
                'click #buyThis': 'buyThisClicked'
            },
            buyThisClicked: function (e) {
                e.preventDefault();
                this.trigger('dealdetails:buy');
            },
            onRender: function () {
            },
            setupSlideShow: function () {
                // slider for deal images
                this.$el.find('#deal_images_navs').flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    itemWidth: 100,
                    asNavFor: '#deal_images'
                });

                this.$el.find('#deal_images').flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    sync: "#deal_images_navs"
                });
                // end slider

                // image to occupy 100% container
                this.$el.find('.sliderMain-imgContainer').imgLiquid();
            },
            setupMap: function () {
                var that = this;
                // google maps for location
                if (typeof Maplace !== 'undefined') {
                    var mapOptions = {
                        disableDefaultUI: true,
                        // zoom: 10,
                        // center: latlng
                    };
                    var jlocations = this.model.toJSON().Locations;
                    var locs = _.map(jlocations, function (item) {
                        var ct = '<strong>' + item.LocationName + '</strong>' +
                                 '<p>' + item.LocationAddress + '</p>' +
                                 '<i>&nbsp;</i>';
                        return {
                            zoom: 12,
                            lat: item.Latitude,
                            lon: item.Longitude,
                            title: ct,
                            html: ct,
                            // icon: 'http://maps.google.com/mapfiles/markerA.png'
                        };
                    });
                    new Maplace({
                        locations: locs,
                        map_div: '#map_canvas',
                        controls_div: '#map_controls',
                        controls_type: 'list',
                        controls_on_map: false,
                        controls_position: google.maps.ControlPosition.BOTTOM_LEFT,
                        view_all: false,
                        start: 5,
                        map_options: mapOptions,
                        afterShow: function (index, location, marker) {
                            that.trigger('dealdetails:mapshown');
                        }
                    }).Load();
                }
            },
            loadMap: function () {
                var dis = this;
                yepnope({
                    test: window.google,
                    yep: ['/libs/maplace.min.js'],
                    complete: function () {
                        dis.setupMap();
                    }
                });
                if (typeof window.google === 'undefined') {
                    this.trigger('dealdetails:mapshown');
                }
            },
            setupMasonry: function () {
                // masonry for deal details sections
                var container = this.$el.find('.dsk-dd-detailsContainer').get(0);
                var msnry = new Masonry(container, {
                    itemSelector: '.dsk-dd-details'
                });
                // don't comment this, used in window.load
                window.msnry = msnry;
                diskupon.GlobalEvents.tickRelayoutMasonry();
            },
            setupPopover: function () {
                var dis = this;
                var elem = tpl_kupon_selector(this.model.toJSON());
                this.$el.find("#buyThis").popover({
                    title: 'Choose your Kupon:<button type="button" id="close" class="close" onclick="$(&quot;#buyThis&quot;).popover(&quot;hide&quot;);">&times;</button>',
                    content: elem,
                    html: true,
                    placement: 'bottom',
                    trigger: 'manual'
                });
                this.$el.find("#buyThis").on('shown.bs.popover', function () {
                    dis.$el.find('.chooser').iCheck({
                        checkboxClass: 'icheckbox_flat-green',
                        radioClass: 'iradio_flat-green',
                        increaseArea: '20%'
                    });
                    dis.$el.find('#dsk_kselectorBuy').prop('disabled', false);
                });
            },
            setupPopoverEvents: function () {
                var dis = this;
                this.$el.find('.dsk-dd-buy').on('click', '#dsk_kselectorBuy', function (e) {
                    e.preventDefault();
                    var checkedElem = dis.$el.find('input[name="selected_kupon"]:checked');
                    if (checkedElem.length <= 0) {
                        return false;
                    } else {
                        var selectedKupons = [];
                        $.each(checkedElem, function(idx, item) {
                            var kid = $(item).val();
                            var qty = $(item).closest('.list-group-item').find('input[type="text"].kpQty').val();
                            selectedKupons.push({
                                KuponId: kid,
                                Qty: qty
                            });
                        });
                        dis.trigger('dealdetails:selectkuponandbuy', { SelectedKupons: selectedKupons, Deal: dis.model.toJSON() });
                    }
                });
                this.$el.find('.dsk-dd-buy').on('click', '#dsk_kselectorCancel', function (e) {
                    e.preventDefault();
                    dis.$el.find("#buyThis").popover('hide');
                });
                this.$el.find('.dsk-dd-buy').on('click', '#ks_gotocart', function (e) {
                    e.preventDefault();
                    App.vent.trigger('selectkuponandbuy:gotocart');
                    dis.hideKuponSelector();
                });
                this.$el.find('.dsk-dd-buy').on('click', '.ks-close', function (e) {
                    e.preventDefault();
                    dis.hideKuponSelector();
                });
                this.$el.find('.dsk-dd-buy').on('blur', '.kpQty', function () {
                    var p = parseInt($(this).val(), 10);
                    if(isNaN(p)) {
                        $(this).val(0);
                    }
                });
            },
            blockKuponSelector: function () {
                this.$el.find('.popover-content').block({
                    message: '<h1>adding to cart</h1>',
                    fadeIn: 700
                });
            },
            unblockKuponSelector: function () {
                this.$el.find('.popover-content').unblock({
                    fadeOut: 700
                });
            },
            showKuponSelector: function () {
                this.$el.find("#buyThis").popover('toggle');
            },
            hideKuponSelector: function () {
                this.$el.find("#buyThis").popover('hide');
            },
            onShow: function () {
                this.setupSlideShow();
                this.loadMap();
                this.setupPopover();
                this.setupPopoverEvents();
            }
        });

        var DealDetailsPageLayout = Backbone.Marionette.Layout.extend({
            template: tpl_deal_details_page, //"#dealDetailsPageLayout_template",
            regions: {
                MainContent: '#dsk_content',
            },
            className: 'container'
        });

        DealsDetails.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'showDealsDetails', 'renderDealsDetails', 'renderDetailsLayout');
                this.Layout = new DealDetailsPageLayout();
                this.DealId = 0;
            },

            renderDetailsLayout: function () {
                this.Layout.render();
                App.regionManager.get('Main').show(this.Layout);
            },

            renderDealsDetails: function (deal) {
                var dis = this;
                var view = new DealsDetails.DealsDetailsView({
                    model: deal
                });
                this.listenTo(view, 'dealdetails:buy', function () {
                    dis.buyThisDealHandler(view);
                });
                this.listenTo(view, 'dealdetails:selectkuponandbuy', function (params) {
                    App.vent.on("selectkuponandbuy:success", function () {
                        setTimeout(function () {
                            var sm = 'item was added to cart<br/><br/>' +
                                     '<button type="button" id="ks_gotocart" class="wisteria-flat-button btn-xs">go to cart&nbsp;<i class="fa fa-arrow-up"></i></button>' +
                                     '&nbsp;&nbsp;&nbsp;' +
                                     '<button type="button" class="ks-close carrot-flat-button btn-xs">keep shopping&nbsp;<i class="fa fa-times"></i></button>';
                            view.$el.find('.blockUI.blockMsg h1').html(sm);
                            // var em = 'item(s) was not added to cart<br/>refresh page<br/>and try again<br/><br/>' +
                            //          '<button type="button" class="ks-close carrot-flat-button btn-xs">keep shopping&nbsp;<i class="fa fa-times"></i></button>';
                            view.$el.find('.blockUI.blockMsg h1').html(em);
                        }, 1000);
                    });
                    App.vent.on("selectkuponandbuy:failed", function () {
                        setTimeout(function () {
                            var em = 'item(s) was not added to cart<br/>refresh page<br/>and try again<br/><br/>' +
                                     '<button type="button" class="ks-close carrot-flat-button btn-xs">keep shopping&nbsp;<i class="fa fa-times"></i></button>';
                            view.$el.find('.blockUI.blockMsg h1').html(em);
                        }, 1000);
                    });
                    view.blockKuponSelector();
                    App.commands.execute('addkupontocart', params);
                });
                this.listenTo(view, 'dealdetails:mapshown', function () {
                    view.setupMasonry();
                });
                this.Layout.MainContent.show(view);

                // set active menu
                var dealModel = deal.toJSON();
                App.TopMenu.controller.setActiveMenuItem(diskupon.DealCategory.ByCategory, dealModel.DealCategoryId);
            },

            showDealsDetails: function () {
                var that = this;
                var repo = new App.Deals.Repository();
                var promise = repo.getOne(this.DealId);
                promise.done(function (deal) {
                    that.renderDetailsLayout();
                    that.renderDealsDetails(deal);
                });
            },

            buyThisDealHandler: function (view) {
                var jmodel = view.model.toJSON();
                view.showKuponSelector();
            }
        });

        DealsDetails.addInitializer(function (args) {
            DealsDetails.controller = new DealsDetails.Controller({
            });
        });

        DealsDetails.addFinalizer(function () {
            DealsDetails.controller.close();
            delete DealsDetails.controller;
        });

    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.App.module("Deals.List", function (DealsList, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        DealsList.on('start', function () {
        });

        DealsList.DealsListItemView = Marionette.ItemView.extend({
            template: tpl_deals_item,
            tagName: 'div',
            className: 'dsk-dealContainer pull-left'
        });

        DealsList.DealsListCollectionView = Marionette.CollectionView.extend({
            tagName: 'div',
            className: 'dsk-listOfDeals clearfix',
            itemView: DealsList.DealsListItemView,
            onRender: function () {
                this.$el.find('.dsk-di-cover').lazyload({
                    //effect: 'fadeIn'
                });
                this.$el.find('.dsk-dealItem').hover(function () {
                    $(this).addClass('hover');
                }, function () {
                    $(this).removeClass('hover');
                });
            }
        });

        /**** mobile version view ****/
        DealsList.DealsListMobileItemView = Marionette.ItemView.extend({
            template: tpl_deals_item_mobile,
            tagName: 'div',
            className: 'dsk-dealContainer-mobile clearfix'
        });

        DealsList.DealsListMobileCollectionView = Marionette.CollectionView.extend({
            tagName: 'div',
            className: 'dsk-listOfDeals-mobile clearfix',
            itemView: DealsList.DealsListMobileItemView,
            onRender: function () {
                this.$el.find('.dsk-di-cover-mobile').lazyload({
                    //effect: 'fadeIn'
                });
            }
        });

        var DealListPageLayout = Backbone.Marionette.Layout.extend({
            template: tpl_deals_list_page, //"#dealListPageLayout_template",
            regions: {
                HomeSlides: '#dsk_homeSlides',
                MainContent: '#dsk_content',
                MainContentMobile: '#dsk_content_mobile'
            },
            className: 'container'
        });

        DealsList.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'showDeals', 'renderDeals');
                this.SearchParams = {
                    RegionId: 1, // jakarta
                    CategoryId: diskupon.DealCategory.All, // all kupons
                    PageNumber: 1, // 1-based
                    SearchQuery: ''
                };
                this.Layout = new DealListPageLayout();
            },

            renderListLayout: function () {
                this.Layout.render();
                App.regionManager.get('Main').show(this.Layout);
            },

            renderHomeSlides: function () {
                App.module("HomeSlides").start({ HomeSlidesRegion: this.Layout.HomeSlides });
                App.HomeSlides.controller.show();
                App.module("HomeSlides").stop();
            },

            renderDeals: function (deals) {
                if ($(this.Layout.MainContent.el).is(':visible')) {
                    var colView = new DealsList.DealsListCollectionView({
                        collection: deals
                    });
                    this.Layout.MainContent.show(colView);
                    this.trigger('dealslist:listshown');
                }

                if ($(this.Layout.MainContentMobile.el).is(':visible')) {
                    var mobileColView = new DealsList.DealsListMobileCollectionView({
                        collection: deals
                    });
                    this.Layout.MainContentMobile.show(mobileColView);
                    this.trigger('dealslist:listmobileshown');
                }
            },

            showDeals: function () {
                var that = this;
                var repo = new App.Deals.Repository();

                // fetch data
                this.SearchParams.RegionId = App.SelectedRegionId.get();

                var promise = repo.search(this.SearchParams);
                promise.done(function (deals) {
                    // render the data
                    that.renderListLayout();
                    that.renderHomeSlides();
                    that.renderDeals(deals);
                });
            }
        });

        DealsList.addInitializer(function (args) {
            DealsList.controller = new DealsList.Controller({
            });

            DealsList.controller.on('dealslist:listshown', function () {
                $(window).trigger('scroll');
            });

            DealsList.controller.on('dealslist:listmobileshown', function () {
                $(window).trigger('scroll');
            });
        });

        DealsList.addFinalizer(function () {
            DealsList.controller.close();
            delete DealsList.controller;
        });

    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.App.module("Deals", function (Deals, App, Backbone, Marionette, $, _) {

        Deals.on('start', function () {

        });

        Deals.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll(this, 'showDealsList', 'showDealDetails');
            },

            stopSubmodule: function () {
                App.module('Deals.List').stop();
                App.module('Deals.Details').stop();
                App.module('Deals.TopDeals').stop();
            },

            startListSubmodule: function () {
                this.stopSubmodule();

                App.module('Deals.List').start();
            },

            startDetailsModule: function () {
                this.stopSubmodule();

                App.module('Deals.Details').start();
            },

            startTopDealsModule: function () {
                this.stopSubmodule();

                App.module('Deals.TopDeals').start();
            },

            showDealsList: function (options) {
                this.startListSubmodule();

                var defaultOptions = {
                    categoryId: diskupon.DealCategory.All,
                    searchQuery: ''
                };
                options = $.extend({}, defaultOptions, options);

                Deals.List.controller.SearchParams.CategoryId = options.categoryId;
                Deals.List.controller.SearchParams.SearchQuery = options.searchQuery;
                Deals.List.controller.showDeals();
            },

            showDealDetails: function (dealId) {
                this.startDetailsModule();

                Deals.Details.controller.DealId = dealId;
                Deals.Details.controller.showDealsDetails();
            },

            showTopDealsGroupByCategory: function () {
                this.startTopDealsModule();

                Deals.TopDeals.controller.showTopDeals();
            }
        });

        Deals.addInitializer(function () {
            Deals.controller = new Deals.Controller({
            });
        });

        Deals.addFinalizer(function () {
            Deals.controller.close();
            delete Deals.controller;
        });

    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.App.module("Deals.TopDeals", function (TopDeals, App, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        var TopDealsPageLayout = Backbone.Marionette.Layout.extend({
            template: tpl_top_deals_page,
            regions: {
                HomeSlides: '#dsk_homeSlides',
                MainContent: '#dsk_content',
                MainContentMobile: '#dsk_content_mobile'
            },
            className: 'container'
        });


        TopDeals.Controller = Marionette.Controller.extend({
            initialize: function (options) {
                //_.bindAll(this, 'showDeals', 'renderDeals');

                this.Layout = new TopDealsPageLayout();
            },

            renderTopDealsLayout: function () {
                this.Layout.render();
                App.regionManager.get('Main').show(this.Layout);
            },

            renderHomeSlides: function () {
                App.module("HomeSlides").start({ HomeSlidesRegion: this.Layout.HomeSlides });
                App.HomeSlides.controller.show();
                App.module("HomeSlides").stop();
            },

            showTopDeals: function () {
                this.renderTopDealsLayout();
                this.renderHomeSlides();
            }
        });

        TopDeals.addInitializer(function (args) {
            TopDeals.controller = new TopDeals.Controller({
            });

        });

        TopDeals.addFinalizer(function () {
            TopDeals.controller.close();
            delete TopDeals.controller;
        });

    });
} (window.Diskupon));
;(function (diskupon) {
    diskupon.GlobalEvents = {
        tickRelayoutMasonry: function () {
            if (typeof window.msnry !== 'undefined') {
                window.msnry.layout();
                var times = 0;
                var msnryTimeout = window.setInterval(function () {
                    //console.log('masonry relayout');
                    window.msnry.layout();
                    times++;
                    if (times > 30) {
                        window.clearInterval(msnryTimeout);
                    }
                }, 300);
            }
        }
    };
} (window.Diskupon));
;/**************************/
/*
/* move these methods below to another library
/*
/***************************/

/*** backbone force use POST when fetching ***/
// Backbone.ajax = function () {
//     var args = Array.prototype.slice.call(arguments);
//     if (args[0]) {
//         args[0].type = 'POST';
//     }
//     return Backbone.$.ajax.apply(Backbone.$, args);
// };

// /*** override native console ***/
// (function(){
//     var nativeConsoleLog = console.log;
//     console.log = function (message) {
//         // DO MESSAGE HERE.
//         //nativeConsoleLog.apply(console, arguments);
//         return false;
//     };
// })();

(function ($) {
    if (NProgress) {
        //NProgress.configure({ ease: 'ease', speed: 500 });
        //NProgress.configure({ trickle: false });
        //NProgress.configure({ trickleRate: 0.02, trickleSpeed: 100 });
    }

    $(document).ajaxStart(function () {
        if (NProgress) {
            NProgress.start();
        }
    });
    $(document).ajaxStop(function () {
        if (NProgress) {
            NProgress.done(true);
        }
    });
}(jQuery));

window.onerror = function (message, url, lineNumber) {
    console.log(message);
    if (NProgress) {
        NProgress.done(true);
    }
};
;function encode (value) {
    var unencoded = value;
    var encoded = encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
    return encoded;
}

function decode(value) {
    var encoded = value;
    var decoded = decodeURIComponent(encoded.replace(/\+/g, " "));
    return decoded;
}

/*** make push state for backbone, intercept anchor click ***/
function prepareBackbonePushState () {
    // Use absolute URLs  to navigate to anything not in your Router.
    // Only need this for pushState enabled browsers
    if (Backbone.history && Backbone.history._hasPushState) {
        // Use delegation to avoid initial DOM selection and allow all matching elements to bubble
        $(document).delegate("a[href^='/']", "click", function (evt) {
            //console.log('hijacked!!!');
            // Get the anchor href and protcol
            var href = $(this).attr("href");
            var protocol = this.protocol + "//";
            // Ensure the protocol is not part of URL, meaning its relative.
            // Stop the event bubbling to ensure the link will not cause a page refresh.
            if (href.slice(protocol.length) !== protocol) {
                evt.preventDefault();
                // Note by using Backbone.history.navigate, router events will not be
                // triggered.  If this is a problem, change this to navigate on your
                // router.
                Backbone.history.navigate(href, true);
            }
        });
    }
}

// function randomString (length) {
//     var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     var result = '';
//     for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
//     return result;
// }

;
//# sourceMappingURL=app.js.map