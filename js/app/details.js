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
define(["react", "app/stats"], function(React, stats) {

  var DetailsHeaderClass = React.createClass({
    displayName: 'DetailsHeader',
    render: function() {
      var title = React.DOM.h3({key: 'title'}, null, this.props.product["Product"]);
      var outlierLink = React.DOM.a({key: 'outlierLink', href: this.props.product["InSitu"]}, "Outlier");
      var googleUrl = "https://google.com/search?q=" + encodeURI(this.props.product["Product"]);
      var googleLink = React.DOM.a({key: 'googleLink', href: googleUrl }, "Google");
      var column = React.DOM.div({key:'headerGroup', className: 'col-xs-6 col-md-6'}, [title, outlierLink, " / ", googleLink]);
      return React.DOM.div({className: 'row'}, [ column ]);
    }
  });

  var DetailsHeader = React.createFactory(DetailsHeaderClass);

  var DetailsStatsClass = React.createClass({
    displayName: 'DetailsStats',
    render: function() {
      var product = this.props.product;
      var prices = product.releases.map(function(d) { return d["Price"] });
      var minPrice = d3.min(prices);
      var maxPrice = d3.max(prices);
      var priceString = "Price: " + ((minPrice == maxPrice) ? "" + minPrice : "" + minPrice + " - " + maxPrice);
      var price = React.DOM.p({key: "price"}, null, priceString);
      var priceColumn = React.DOM.div({key:'priceColumn', className: 'col-xs-3 col-md-3'}, [price]);

      var statProps = _.extend({key: 'monthStats', products: product.releases}, this.props);
      statProps.products = product.releases;
      console.log(statProps);
      var statsDisplay = [stats.monthStats(statProps)];
      var statsGroup = React.DOM.div({key: 'statsGroup', className:'row'}, statsDisplay);
      var statsColumn = React.DOM.div({key: 'statsColumn', className: 'col-xs-6 col-md-6'}, [statsGroup]);
      return React.DOM.div({className: 'row'}, [ priceColumn, statsColumn]);
    }
  });

  var DetailsStats = React.createFactory(DetailsStatsClass);

  var DetailsClass = React.createClass({
    displayName: 'Details',
    render: function() {
      return React.DOM.div(null, [
        DetailsHeader(_.extend({key: "header"}, this.props)),
        DetailsStats(_.extend({key: "stats"}, this.props))
      ]);
    }
  });

  var Details = React.createFactory(DetailsClass);

  return { details: Details }
})