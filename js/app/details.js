/**
 *  Independent Outlier Archive
 *
 *  Copyright (c) 2014-2015 Chandrasekhar Ramakrishnan
 *
 *  Released under GPL license.
 */

 /**
  * Implementation of the component that implements the product details page.
  */
define(["react", "app/stats", "app/products"], function(React, stats, products) {

  var DetailsHeaderClass = React.createClass({
    displayName: 'DetailsHeader',
    render: function() {
      var title = React.DOM.h3({key: 'title'}, null, this.props.product["Product"]);
      var outlierLink = React.DOM.a({key: 'outlierLink', href: this.props.product["InSitu"]}, "Outlier");
      var googleUrl = "https://google.com/search?q=" + encodeURI(this.props.product["Product"]);
      var googleLink = React.DOM.a({key: 'googleLink', href: googleUrl }, "Google");
      var product = this.props.product;
      var prices = product.releases.map(function(d) { return d["Price"] });
      var minPrice = d3.min(prices);
      var maxPrice = d3.max(prices);
      var priceString = "Price: " + ((minPrice == maxPrice) ? "" + minPrice : "" + minPrice + " - " + maxPrice);
      var price = React.DOM.p({key: "price"}, null, priceString);
      var column = React.DOM.div(
        {key:'headerGroup', className: 'col-xs-6 col-md-6'},
        [title, outlierLink, " / ", googleLink, price]);
      return React.DOM.div({className: 'row'}, [ column ]);
    }
  });
  var DetailsHeader = React.createFactory(DetailsHeaderClass);

  var DetailsStatsClass = React.createClass({
    displayName: 'DetailsStats',

    uniqueImageReleases: function() {
      var product = this.props.product;
      var releases = product.releases;
      var uniqueImageReleases = {};
      releases.forEach(function(d) {
        var key = d["Image"];
        if (!uniqueImageReleases[key]) uniqueImageReleases[key] = d;
      });
      var values = $.map(uniqueImageReleases, function(v,k) { return v });
      values.sort(function(a, b) { return b["Release"] - a["Release"]});
      return values;
    },

    render: function() {
      var product = this.props.product;
      var passOnProps = _.omit(this.props, ["products", "showLabels"]);
      passOnProps.products = product.releases;
      var statsDisplay = [stats.monthStats(_.extend({key: 'monthStats'}, passOnProps))];
      var statsGroup = React.DOM.div({key: 'statsGroup', className:'row'}, statsDisplay);
      var statsColumn = React.DOM.div({key: 'statsColumn', className: 'col-xs-6 col-md-6'}, [statsGroup, imagesColumn]);
      var productsGridProps = _.extend(
        {key: 'imagesGrid', mode: "grid", showImages: true, drawLinks: false, showLabels: false},
        passOnProps,
        {products: this.uniqueImageReleases(product.releases)});
      var imagesColumn = React.DOM.div(
        {key: 'imagesColumn', className: 'col-xs-6 col-md-6'},
        [
          React.DOM.h4({key: 'productsTitle'}, "Images"),
          products.productsGrid(productsGridProps)
        ]
      );
      return React.DOM.div({className: 'row'}, [ statsColumn, imagesColumn ]);
    }
  });
  var DetailsStats = React.createFactory(DetailsStatsClass);

  var DetailsReleasesClass = React.createClass({
    displayName: 'DetailsReleases',
    render: function() {
      var product = this.props.product;
      var passOnProps = _.omit(this.props, ["products", "mode", "showImages"]);
      passOnProps.products = product.releases;
      var imagesColumn = React.DOM.div(
        {key: 'releasesColumn', className: 'col-xs-12 col-md-12'},
        [products.releases(_.extend(
          {key: 'releasesTable', mode: "list", showImages: false, drawLinks: true},
          passOnProps)
        )]
      );
      return React.DOM.div({className: 'row'}, [imagesColumn]);
    }
  });
  var DetailsReleases = React.createFactory(DetailsReleasesClass);

  var DetailsClass = React.createClass({
    displayName: 'Details',
    render: function() {
      return React.DOM.div(null, [
        DetailsHeader(_.extend({key: "header"}, this.props)),
        DetailsStats(_.extend({key: "stats"}, this.props)),
        DetailsReleases(_.extend({key: "releases"}, this.props))
      ]);
    }
  });

  var Details = React.createFactory(DetailsClass);

  return { details: Details }
})
