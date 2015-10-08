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
define(["d3", "react", "enquire", "backbone", "app/dashboard", "app/products"], function(d3, React, enquire, Backbone, dashboard, products) {

  var dateParser = d3.time.format("%Y-%m-%d");
  var dateFormatter = d3.time.format("%b %d %Y");
  var monthFormatter = d3.time.format("%B")
  var yearFormatter = d3.time.format("%Y")

  /**
   * @class
   */
  function OaiModel() {
    this.products = [];
    this.filteredProducts = [];
    this.categories = [];
    this.clothes = [];
    this.accessories = [];
    this.fabrics = [];
    this.orFilters = [];
    this.andFilters = [];
    this.mwu = [];
    this.reup = [];
  }

  function cleanCsvRow(d) {
    var price = d["Price"];
    if (price.length > 0) d["Price"] = +d["Price"];

    var release = d["Release"];
    if (release.length > 0) {
      var releaseDate = dateParser.parse(d["Release"]);
      d.releaseDate = releaseDate;
      d["Release"] = dateFormatter(releaseDate);
    } else {
      d.releaseDate = null;
    }

    return d;
  }

  // Load the data then invoke the callback
  OaiModel.prototype.loadData = function(callback) {
    var _this = this;
    d3.csv("outlier-data.csv")
      .row(cleanCsvRow)
      .get(function(err, rows) {
        if (err) {
          console.log(err);
          return;
        }
        _this.initializeProducts(rows);
        callback(rows);
      })
  }

  OaiModel.prototype.initializeProducts = function(rows) {
    this.products = rows;
    this.filteredProducts = this.products;
    this.orFilters = [];
    this.andFilters = [];

    var fabricsMap = {}, typeCategoriesMap = {}, mwuMap = {}, reupMap = {};
    this.products.forEach(function(d) {
      var cat = typeCategoriesMap[d["Category"]];
      if (!cat) { cat = {}; typeCategoriesMap[d["Category"]] = cat; }
      cat[d["Type"]] = true;
      fabricsMap[d["Fabric"]] = true;
      mwuMap[d["MWU"]] = true;
      reupMap[d["Re-up"]] = true;
    });

    var categories = {};
    for (cat in typeCategoriesMap) {
      var filters, types = [];
      this.initializeFilterCodes(types, typeCategoriesMap[cat]);
      filters = types.map(function(type) {
        return {
          isOn: false,
          category: cat,
          type: type,
          isHit: function(d) { return type == d["Type"] }
        }
      });
      categories[cat] = filters;
      this.orFilters = this.orFilters.concat(filters);
    }
    this.clothes = categories["Clothes"];
    this.accessories = categories["Accessory"];

    var fabrics = [];
    this.initializeFilterCodes(fabrics, fabricsMap);
    this.fabrics = fabrics.map(function(fabric) {
      return {
        isOn: false,
        category: "Fabric",
        type: fabric,
        isHit: function(d) { return fabric == d["Fabric"] }
      }
    });
    this.orFilters = this.orFilters.concat(this.fabrics);

    var mwu = [];
    this.initializeFilterCodes(mwu, mwuMap);
    this.mwu = mwu.map(function(option) {
      return {
        isOn: false,
        category: "Male/Female/Unisex",
        type: option,
        isHit: function(d) { return option == d["MWU"] }
      }
    });
    this.andFilters = this.andFilters.concat(this.mwu);

    var reup = [];
    this.initializeFilterCodes(reup, reupMap);
    this.reup = reup.map(function(option) {
      var type = option;
      if (option == "TRUE") type = 'Yes';
      if (option == "FALSE") type = 'No';
      return {
        isOn: false,
        category: "Re-Up?",
        catName: "reup",
        type: type,
        isHit: function(d) { return option == d["Re-up"] }
      }
    });
    this.andFilters = this.andFilters.concat(this.reup);
  };

  OaiModel.prototype.initializeFilterCodes = function(coll, map) {
    for (key in map) {
      coll.push(key);
    }
    coll.sort(d3.ascending);
  };

  OaiModel.prototype.toggleFilter = function(filter) {
    filter.isOn = !filter.isOn;
    var _this = this;
    var onFilters = this.orFilters.filter(function(d) { return d.isOn });
    if (onFilters.length < 1) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(function(d) {
        var hits = 0;
        onFilters.forEach(function(filter) {
          if (filter.isHit(d)) ++hits;
        });
        return hits > 0;
      });
    }

    var onAndFilters = this.andFilters.filter(function(d) { return d.isOn });
    if (onAndFilters.length < 1) return;

    var runAndFiltersInOrMode = (onFilters.length < 1);
    this.filteredProducts = this.filteredProducts.filter(function(d) {
      var hits = 0;
      onAndFilters.forEach(function(filter) {
        if (filter.isHit(d)) ++hits;
      });
      return (runAndFiltersInOrMode) ? hits > 0 : hits == onAndFilters.length;
    });

  };

  OaiModel.prototype.clearFilters = function() {
    this.orFilters.forEach(function(d) { d.isOn = false; });
    this.andFilters.forEach(function(d) { d.isOn = false; });
    this.filteredProducts = this.products;
  };

  OaiRouter = Backbone.Router.extend({
    routes: {
      "about":  "about",
      "product/:product": "product"
    }
  });

   /**
    * @class
    */
  function OaiPresenter(model) {
    this.model = model;
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

  /**
   * @function Unpack data from a join
   */
  function unpack(d) { return d;}

  OaiPresenter.prototype.updateEndDateInfo = function() {
    var lastEntry = this.model.products[0]
    var lastEntryDate = lastEntry.releaseDate
    this.endMonthContainer.text(monthFormatter(lastEntryDate));
    this.endYearContainer.text(yearFormatter(lastEntryDate));
  };

  OaiPresenter.prototype.update = function() {
    React.render(dashboard.dashboard({
        model: model, presenter: presenter,
        chartMargin: this.chartMargin, chartWidth: this.chartWidth, chartHeight: this.chartHeight
      }), $("#dashboard-container")[0]);
    React.render(products.products({
        model: model, presenter: presenter, mode: "list", showImages: true, showLabels: true
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

  var model = new OaiModel();
  var presenter = new OaiPresenter(model);
  Backbone.history.start({root: "/outlier/"});


  function enterApp() {
    model.loadData(function(rows) { presenter.initialDraw(); });
  }

  return { enter: enterApp }
});
