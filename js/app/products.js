/**
 *  Independent Outlier Archive
 *
 *  Copyright (c) 2014-2015 Chandrasekhar Ramakrishnan
 *
 *  Released under GPL license.
 */

 /**
  * Implementation of the products display.
  */
define(["react/react"], function(React) {

  /**
   * @function Unpack data from a join
   */
  function unpack(d) { return d;}

  function rowLabel(d) {
    if (d.links.length > 0) return "";
    if (d.images.length > 0) return "";
    return d.label;
  }

  var ProductsClass = React.createClass({
    productTableHeaders: function() {
      return (this.props.showImages) ? ["Image", "Product", "Price", "Release"] : ["Product", "Price", "Release"];
    },

    productTableColumns: function(row, headers) {
      var showImages = this.props.showImages;
      var imageColumnIdx = (showImages) ? 0 : -1;
      var productColumnIdx = (showImages) ? 1 : 0;
      return headers.map(function(d, i) {
        var links = [];
        var images = [];
        if (i == productColumnIdx && row["InSitu"].length > 0)
          links = [{label: row[d], link: row["InSitu"]}];
        if (i == imageColumnIdx && row["Image"] && row["Image"].length > 0) {
          link = null;
          if (row["InSitu"].length > 0) link = row["InSitu"].length;
          images = [{src: row["Image"], link: link }];
        }
        return {label: row[d], links: links, images: images}
      })
    },

    drawProductTable: function(productsTable, products) {
      var headers = this.productTableHeaders();
      var thead = productsTable.selectAll("thead").data([[headers]]);
      thead.enter().append("thead");
      var headerRow = thead.selectAll("tr").data(unpack);
      headerRow.enter().append("tr");
      var headerData = headerRow.selectAll("th").data(unpack);
      headerData.enter().append("th").text(unpack);

      var tbody = productsTable.selectAll("tbody").data([products]);
      tbody.enter().append("tbody");
      var tr = tbody.selectAll("tr").data(unpack);
      tr.enter().append("tr");
      tr.exit().transition(1000).style("opacity", 0).remove();
      var _this = this;
      var td = tr.selectAll("td").data(function(row) { return _this.productTableColumns(row, headers)});
      td.enter().append("td");
      td.text(rowLabel);

      var links = td.selectAll("a.product")
        .data(function(d) { return d.links});
      links.enter().append("a")
        .attr("class", "product")
        .attr("href", function(d) { return d.link })
        .text(function(d) { return d.label });

    var images = td.selectAll("a.image")
        .data(function(d) { return d.images});
      images.enter().append("img")
        .attr("src", function(d) { return d.src })
        .attr("class", "img-responsive")
    },

    drawProductList: function(productsList, products) {
      var list = productsList.selectAll("li").data(products);
      list
        .enter().append("li")
          .classed("col-lg-2 col-md-2 col-sm-3 col-xs-4", true)
          .style("list-style", "none")
          .style("margin-bottom", "25px");
      list.exit().transition(1000).style("opacity", 0).remove();
      var imageContainers = list.selectAll("a.image")
          .data(function(d) { console.log(d); return [d]})
        .enter().append("a")
          .classed("product", true);
      imageContainers
        .attr("href", function(d) { return "#" }) // d.links })
      var images = imageContainers.selectAll("img").data(function(d) { return [d["Image"]]})
          .enter()
        .append("img")
          .attr("src", function(d) { return d })
          .classed("img-responsive", true);
    },

    isTableMode: function() { return this.props.mode == "table" },

    componentDidMount: function() {
      // Just update the component
      this.componentDidUpdate();
    },

    componentDidUpdate: function() {
      var products = this.props.model.filteredProducts;
      if (this.isTableMode()) {
        this.drawProductTable(d3.select("#products-table"), products);
      } else {
        this.drawProductList(d3.select("#products-list"), products);
      }
    },

    render: function() {
      var title = React.DOM.h3(null, "Products");
      var elts = [title];
      if (this.isTableMode()) {
        var table = React.DOM.table({id: 'products-table', className: 'table' });
        elts.push(table);
      } else {
        var list = React.DOM.ul({
          id: 'products-list', className: 'row',
          style: { padding: "0 0 0 0", margin: "0 0 0 0" }
        });
        elts.push(list);
      }
      var column = React.DOM.div({className: 'col-xs-12 col-md-12'}, elts);
      var row = React.DOM.div({className: 'row'}, [column]);
      return row;
    }
  });

  var Products = React.createFactory(ProductsClass)

  return { products: Products }
})
