/**
 *  Independent Outlier Archive
 *
 *  Copyright (c) 2014-2015 Chandrasekhar Ramakrishnan
 *
 *  Released under GPL license.
 */

 /**
  * Implementation of the component that displays stats about the selected releases.
  */
define(["react"], function(React) {

  /**
   * @function Unpack data from a join
   */
  function unpack(d) { return d;}

  var StatsClass = React.createClass({

    drawChart: function(container, hist, bins, labels) {

      var margin = this.props.chartMargin;
      var numBins = bins.length - 1;
      var width = this.props.chartWidth, height = this.props.chartHeight;

      var blockWidth = Math.floor(width / numBins);
      var y = d3.scale.linear()
        .domain([0, d3.max(hist, function(d) { return d.y })])
        .range([height, 0]);
      var svg = container.selectAll("svg").data([0]);
      svg.enter().append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var barg = svg.selectAll("g.bar")
        .data(hist);
      barg.enter()
        .append("g")
          .attr("class", "bar")
          .attr("transform", function(d, i) { return "translate(" + (i * blockWidth) + "," + y(d.y) + ")"; });
      barg.transition().duration(1000)
        .attr("transform", function(d, i) { return "translate(" + (i * blockWidth) + "," + y(d.y) + ")"; });

      var bar = barg.selectAll("rect")
        .data(function(d) { return [d] });
      bar.enter()
        .append("rect")
        .attr("x", 1)
        .attr("y", function(d) { return height - y(d.y) })
        .attr("width", blockWidth - 1)
        .attr("height", 1);
      bar.transition().duration(1000)
        .attr("y", 0)
        .attr("height", function(d) { return height - y(d.y) });

      var textData = labels.map(function(d, i) { return {bar: hist[i], label: d} });
      var textg = svg.selectAll("g.graphlabel")
        .data(textData);

      var shouldRotate = labels[0].length > 2;
      function textTransform(d, i) {
        var yTranslate = (height - 2);
        var xTranslate = blockWidth * (i + 0.5);
        if (shouldRotate) xTranslate += 4;
        return "translate(" + xTranslate + "," + yTranslate + ")";
      }

      var textgEnter = textg.enter().append("g")
        .attr("class", "graphlabel")
        .attr("transform", textTransform);

    //  CHART FILTERING
    //    .on("click", function(d, i) { console.log(hist); });

      var text = textg.selectAll("text")
        .data(function(d, i) { return [d] });
      var textEnter = text.enter()
          .append("text");
      (shouldRotate) ?
        textEnter.attr("transform", "rotate(-90)") :
        textEnter.attr("text-anchor", "middle");

      text.text(function(d) { return d.label });

    },

    drawPriceInfo: function(products, allProducts, priceContainer, priceMedianContainer) {
      function pricesToConsider(list) {
        return list
          .filter(function(d) { return "FALSE" == d["Historic"]})
          .map(function(d) { return d["Price"] })
          .filter(function(d) { return d > 0 });
      }
      var prices = pricesToConsider(products);
      var sortedPrices = prices.sort(d3.ascending);
      var allPrices = pricesToConsider(allProducts);
      var allSortedPrices = allPrices.sort(d3.ascending);

      var quartiles = [0.0, 0.25, 0.5, 0.75, 1.0];
      var quintiles = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
      var bins = quintiles.map(function(q) { return d3.quantile(allSortedPrices, q) - 1 });
      bins[bins.length - 1] = bins[bins.length - 1] + 1;
      var hist = d3.layout.histogram().bins(bins)(sortedPrices);
      var labels = [];
      var numberFormat = d3.format(".0f")
      bins.reduce(function(prev, next) { labels.push("$" + numberFormat(prev) + " - " + (numberFormat(next) - 1)); return next; });

      this.drawChart(priceContainer, hist, bins, labels);

      var median = d3.median(prices);
      median = d3.format("3.0f")(median);
      var medianContainer = priceMedianContainer.data([median]);
      medianContainer.text(function(d) { return "Median: $" + d });
    },

    drawMonthInfo: function(products, monthContainer) {
      function monthsToConsider(list) {
        return list
          .filter(function(d) { return "FALSE" == d["Historic"] && null != d.releaseDate})
          .map(function(d) { return d.releaseDate.getMonth() });
      }
      var labels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
      var months = monthsToConsider(products);
      var bins = [0,1,2,3,4,5,6,7,8,9,10,11,12];
      var hist = d3.layout.histogram().bins(bins)(months);
      this.drawChart(monthContainer, hist, bins, labels);
    },

    drawWeekdayInfo: function(products, weekdayContainer) {
      function daysToConsider(list) {
        return list
          .filter(function(d) { return "FALSE" == d["Historic"] && null != d.releaseDate})
          .map(function(d) { return d.releaseDate.getDay() });
      }

      var labels = ["S", "M", "T", "W", "T", "F", "S"];
      var days = daysToConsider(products);
      var bins = [0,1,2,3,4,5,6,7];
      var hist = d3.layout.histogram().bins(bins)(days);
      this.drawChart(weekdayContainer, hist, bins, labels);
    },

    // CHART FILTERING -- Use this version of draw weekday info to get the actual items as the data in the histogram
    drawWeekdayInfoValuer: function(products, weekdayContainer) {
      function daysToConsider(list) {
        return list
          .filter(function(d) { return "FALSE" == d["Historic"] && null != d.releaseDate});
      }

      function valuer(d) { return d.releaseDate.getDay(); }

      var labels = ["S", "M", "T", "W", "T", "F", "S"];
      var days = daysToConsider(products);
      var bins = [0,1,2,3,4,5,6,7];
      var hist = d3.layout.histogram().value(valuer).bins(bins)(days);
      this.drawChart(weekdayContainer, hist, bins, labels);
    },

    componentDidMount: function() {
      // Just update the component
      this.componentDidUpdate();
    },

    componentDidUpdate: function() {
      var products = this.props.presenter.filteredProducts;
      var allProducts = this.props.presenter.products;

      this.drawPriceInfo(products, allProducts, d3.select("#price-container"), d3.select("#price-median-container"));
      this.drawMonthInfo(products, d3.select("#month-container"));
      this.drawWeekdayInfo(products, d3.select("#weekday-container"));
    },

    render: function() {
      var statsStructure = [
        {name: "Price", subs: ["price-container", "price-median-container"]},
        {name: "Month", subs: ["month-container"]},
        {name: "Weekday", subs: ["weekday-container"]}
      ];
      var stats = statsStructure.map(function(d) {
        var title = React.DOM.h4(null, d.name);
        var statElts = d.subs.map(function(s) { return React.DOM.span({id: s}) });
        statElts.unshift(title);
        return React.DOM.div({id: d, className: 'col-xs-4 col-md-4', style: {width: '110px'}}, statElts);
      });

      var statsGroup = React.DOM.div({className:'row'}, stats);
      var title = React.DOM.h3(null, 'Stats');
      var column = React.DOM.div({className: 'col-xs-6 col-md-6'}, [title, statsGroup]);
      return column;
    }
  });

  var Stats = React.createFactory(StatsClass)

  return { stats: Stats }
})
