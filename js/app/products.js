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
define(["react"], function(React) {

  /**
   * @function Unpack data from a join
   */
  function unpack(d) { return d;}

  function rowLabel(d) {
    if (d.links.length > 0) return "";
    if (d.images.length > 0) return "";
    return d.label;
  }

  var ProductsTableClass = React.createClass({
    displayName: 'ProductsTable',

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

    var images = td.selectAll("img")
        .data(function(d) { return d.images});
      images.enter().append("img")
        .attr("class", "img-responsive")
      images
        .attr("src", function(d) { return d.src })
    },

    isShowLabels: function() { return this.props.showLabels },
    isDrawLinks: function() { return this.props.drawLinks },

    componentDidMount: function() {
      // Just update the component
      this.componentDidUpdate();
    },

    componentDidUpdate: function() {
      var products = this.props.products;
      this.drawProductTable(d3.select("#products-table"), products);
    },

    render: function() {
      return React.DOM.table({id: 'products-table', className: 'table' });
    }
  });
  var ProductsTable = React.createFactory(ProductsTableClass);

  var ProductsGridClass = React.createClass({
    displayName: 'ProductsGrid',

    drawProductList: function(productsList, products) {
      // Split the products into groups depending on the size of the screen
      // Check props.images_per_col
      var list = productsList.selectAll("li").data(products);
      var presenter = this.props.presenter;
      list
        .enter().append("li")
          .classed("col-lg-2 col-md-2 col-sm-3 col-xs-4", true)
          .style("list-style", "none")
          .style("margin-bottom", "25px");
      list.exit().transition(1000).style("opacity", 0).remove();
      var imageContainers = list.selectAll("a.image")
          .data(function(d) { return [d]});
      imageContainers
        .enter().append("a")
          .classed("image", true);
      imageContainers
        .attr("href", function(d) { return "#product/" + d["Product"].replace(/\//g, "%2F")})
        .on("click", function(d) {
          d3.event.preventDefault();
          presenter.clickedProduct("product/" + d["Product"].replace(/\//g, "%2F"))
        });
      if (this.isShowLabels()) imageContainers.text(function(d) { return d["Product"]})
      var images = imageContainers.selectAll("img").data(function(d) { return [d["Image"]]});
      images
          .enter()
        .append("img")
          .classed("img-responsive", true);
      images
        .attr("src", function(d) { return d });
    },

    isShowLabels: function() { return this.props.showLabels },
    isDrawLinks: function() { return this.props.drawLinks },

    componentDidMount: function() {
      // Just update the component
      this.componentDidUpdate();
    },

    componentDidUpdate: function() {
      var products = this.props.products;
      this.drawProductList(d3.select("#products-list"), products);
    },

    render: function() {
      return React.DOM.ul({
        id: 'products-list', className: 'row',
        style: { padding: "0 0 0 0", margin: "0 0 0 0" }
      });
    }
  });
  var ProductsGrid = React.createFactory(ProductsGridClass);

  var ProductsClass = React.createClass({
    displayName: 'Products',

    isTableMode: function() { return this.props.mode == "table" },
    isGridMode: function() { return this.props.mode == "grid" },

    render: function() {
      var title = React.DOM.h3({key: 'productsTitle'}, "Products");
      var elts = [title];
      if (this.isTableMode()) {
        var table = ProductsTable(_.extend({key: 'productsTable'}, this.props));
        elts.push(table);
      } else {
        var list = ProductsGrid(_.extend({key: 'productsList'}, this.props));
        elts.push(list);
      }
      var column = React.DOM.div({key: 'productsColumn', className: 'col-xs-12 col-md-12'}, elts);
      var row = React.DOM.div({key: 'productsRow', className: 'row'}, [column]);
      return row;
    }
  });
  var Products = React.createFactory(ProductsClass);

  var ReleasesClass = React.createClass({
    displayName: 'Releases',

    productTableHeaders: function() {
      return ["Image", "Price", "Colors", "Release"];
    },

    productTableColumns: function(row, headers) {
      var showImages = this.props.showImages;
      var imageColumnIdx = (showImages) ? 0 : -1;
      return headers.map(function(d, i) {
        var links = [];
        var images = [];
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

    var images = td.selectAll("img")
        .data(function(d) { return d.images});
      images.enter().append("img")
        .attr("height", "100")
        ;
      images
        .attr("src", function(d) { return d.src })
    },

    componentDidMount: function() {
      // Just update the component
      this.componentDidUpdate();
    },

    componentDidUpdate: function() {
      var products = this.props.products;
      this.drawProductTable(d3.select("#products-table"), products);
    },

    render: function() {
      var title = React.DOM.h3({key: 'productsTitle'}, "Releases");
      var elts = [title];
      var table = React.DOM.table({key: 'productsTable', id: 'products-table', className: 'table' });
      elts.push(table);
      var column = React.DOM.div({key: 'productsColumn', className: 'col-xs-12 col-md-12'}, elts);
      var row = React.DOM.div({key: 'productsRow', className: 'row'}, [column]);
      return row;
    }
  });
  var Releases = React.createFactory(ReleasesClass);

  return {
    Products: Products,
    ProductsGrid: ProductsGrid,
    ProductsTable: ProductsTable,
    Releases: Releases
  };
})
