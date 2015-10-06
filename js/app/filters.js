/**
 *  Independent Outlier Archive
 *
 *  Copyright (c) 2014-2015 Chandrasekhar Ramakrishnan
 *
 *  Released under GPL license.
 */

/**
 * Implementation of the component that handles filtering in the UI.
 */
define(["react/react"], function(React) {

  /**
   * @function Unpack data from a join
   */
  function unpack(d) { return d;}

  var FiltersClass = React.createClass({

    drawFilter: function(container, categoryDescription) {
      var _this = this;
      var toggles, group, panelCollapse, category, link;

      function onFiltersCount(d) {
        return d.filters.map(function(f) { return f.isOn ?  1 : 0 }).reduce(function(sum, b) { return b + sum });
      }

      category = container.selectAll("h5.panel-title").data([categoryDescription]);
      category.enter()
        .append("h5")
          .attr("class", "panel-title");
      link = category.selectAll("a").data(function(d) { return [d] });
      link.enter()
        .append("a")
          .attr("data-toggle", "collapse")
          .attr("data-parent", "#filters")
          .attr("href", function(d) { return "#collapse-" + d.catName; });
      link.text(function(d) {
        var count = onFiltersCount(d);
        return (count > 0) ?
          d.category + " (" + count + ")" :
          d.category;
      });

      panelCollapse = container.selectAll("div.panel-collapse").data([categoryDescription]);
      panelCollapse.enter()
        .append("div")
          .attr("class", "panel-collapse collapse")
          .attr("id", function(d) { return "collapse-" + d.catName; });
      var buttonGroupClass = 'btn-group';
      group = panelCollapse.selectAll("div." + buttonGroupClass).data(function(d) { return [d.filters] });
      group.enter().append("div")
        .attr("class", buttonGroupClass + " btn-group-xs");
      toggles = group.selectAll("button").data(unpack);
      toggles.enter()
        .append("button")
        .attr("class", "btn btn-default")
        .attr("data-toggle", "button")
        .on("click", function(d) { _this.props.model.toggleFilter(d); _this.props.presenter.update(); })
        .text(function(d) { return d.type; });
    },

    componentDidMount: function() {
      // Just update the component
      this.componentDidUpdate();
    },

    componentDidUpdate: function() {
      this.drawFilter(d3.select("#clothes-filter"), {category: "Clothes", catName: "clothes", filters: this.props.model.clothes});
      this.drawFilter(d3.select("#accessory-filter"), {category: "Objects", catName: "accessories", filters: this.props.model.accessories});
      this.drawFilter(d3.select("#fabric-filter"), {category: "Fabric", catName: "fabric", filters: this.props.model.fabrics});
      this.drawFilter(d3.select("#mwu-filter"), {category: "Men/Woman/Unisex", catName: "mwu", filters: this.props.model.mwu});
    },

    render: function() {
      var filterIds = ["clothes-filter", "accessory-filter", "fabric-filter", "mwu-filter"];
      var filters = filterIds.map(function(d) { return React.DOM.div({id: d, className: 'panel'})} );
      var panelGroup = React.DOM.div({className:'panel-group', id:'filters'}, filters);
      var clearButton = React.DOM.button({
        className:'btn btn-xs btn-default', id:'clear-button', type:'button'
      }, 'Clear All');
      var clearGroup = React.DOM.div({style: {paddingBottom: "10px"}}, clearButton);

      var title = React.DOM.h3(null, 'Filter');
      var column = React.DOM.div({className: 'col-xs-6 col-md-6'}, [title, clearGroup, panelGroup]);
      return column;
    }
  });

  var Filters = React.createFactory(FiltersClass)

  return { filters: Filters }
})
