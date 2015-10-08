/**
 *  Independent Outlier Archive
 *
 *  Copyright (c) 2014-2015 Chandrasekhar Ramakrishnan
 *
 *  Released under GPL license.
 */

 /**
  * Implementation of the top-level logic for the archive.
  */
define(["d3", "react", "react-dom", "enquire", "backbone", "app/model", "app/dashboard", "app/products"],
  function(d3, React, ReactDOM, enquire, Backbone, modelmodule, dashboard, products) {

  OaiRouter = Backbone.Router.extend({
    routes: {
      "about":  "about",
      "product/:product": "product"
    }
  });

   /**
    * @class
    */
  function OaiPresenter() {
    this.model = new modelmodule.model();
    this.endMonthContainer = d3.select("#endmonth");
    this.endYearContainer = d3.select("#endyear");

    var _this = this;
    this.router = new OaiRouter();
    this.router.presenter = this;
    this.router.on("route:product", function(product) { _this.showProductPage(product) });
    this.router.on("route:about", function() { _this.showAboutPage() });

    var margin = {top: 0, right: 0, bottom: 0, left: 0};
    this.chartMargin = margin;
    this.chartWidth = 100 - margin.left - margin.right;
    this.chartHeight = 100 - margin.top - margin.bottom;
  }

  OaiPresenter.prototype.updateEndDateInfo = function() {
    var lastEntry = this.model.products[0]
    var lastEntryDate = lastEntry.releaseDate
    this.endMonthContainer.text(modelmodule.monthFormatter(lastEntryDate));
    this.endYearContainer.text(modelmodule.yearFormatter(lastEntryDate));
  };

  OaiPresenter.prototype.update = function() {
    this.clothes = this.model.clothes;
    this.accessories = this.model.accessories;
    this.fabrics = this.model.fabrics;
    this.mwu = this.model.mwu;
    this.products = this.model.products;
    this.filteredProducts = this.model.filteredProducts;

    ReactDOM.render(dashboard.dashboard({
        model: this.model, presenter: this,
        chartMargin: this.chartMargin, chartWidth: this.chartWidth, chartHeight: this.chartHeight
      }), $("#dashboard-container")[0]);
    ReactDOM.render(products.products({
        model: this.model, presenter: presenter, mode: "list", showImages: true, showLabels: true
      }), $("#products-container")[0]);
    this.updateEndDateInfo();
  }

  OaiPresenter.prototype.showProductPage = function(product) {
    // Show the product details page
    console.log(["showProductPage", product])
  }

  OaiPresenter.prototype.showAboutPage = function() {
    // Show the about page
    console.log(["showAboutPage"])
  }

  OaiPresenter.prototype.clearFilters = function() {
    this.model.clearFilters();
    // Remove the active state from all buttons
    d3.select('#filters').selectAll("button").classed("active", false)
    this.update();
  }

  OaiPresenter.prototype.initialDraw = function() {
    this.update();
    var _this = this;
    $('#clear-button').on("click", function(e) { _this.clearFilters() });
  };

  OaiPresenter.prototype.clickedProduct = function(d) {
    this.router.navigate(d, {trigger: true});
  }

  OaiPresenter.prototype.loadData = function(callback) {
    this.model.loadData(callback);
  }

  OaiPresenter.prototype.toggleFilter = function (d) {
    this.model.toggleFilter(d);
    this.update();
  };

  var presenter = new OaiPresenter();
  Backbone.history.start({root: "/outlier/"});


  function enterApp() {
    // Use this to configure the grid
    // enquire
    //   .register("(min-width: 768px)", {match: function() { console.log("sm")}})
    //   .register("(min-width: 992px)", {match: function() { console.log("md")}});
    presenter.loadData(function(rows) { presenter.initialDraw(); });
  }

  return { enter: enterApp }
});
