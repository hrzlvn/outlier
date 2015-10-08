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
define(["react", "underscore"], function(React, _) {

  /**
   * @function Unpack data from a join
   */
  function unpack(d) { return d;}

  var FilterClass = React.createClass({
    displayName: 'Filter',
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
        .on("click", function(d) { _this.props.presenter.toggleFilter(d); })
        .text(function(d) { return d.type; });
    },

    componentDidMount: function() {
      // Just update the component
      this.componentDidUpdate();
    },

    componentDidUpdate: function() {
      this.drawFilter(d3.select("#"+this.props.filterId), this.props);
    },

    render: function() {
      var container = React.DOM.div({id: this.props.filterId, className: 'panel'})
      return container;
    }
  });

  var Filter = React.createFactory(FilterClass);

  var FiltersClass = React.createClass({
    displayName: 'Filters',
    render: function() {
      var filterProps = [
        {filterId: "clothes-filter", category: "Clothes", catName: "clothes", filters: this.props.presenter.clothes},
        {filterId: "accessory-filter", category: "Objects", catName: "accessories", filters: this.props.presenter.accessories},
        {filterId: "fabric-filter", category: "Fabric", catName: "fabric", filters: this.props.presenter.fabrics},
        {filterId: "mwu-filter", category: "Men/Woman/Unisex", catName: "mwu", filters: this.props.presenter.mwu}
      ]
      var _this = this;
      var filters = filterProps.map(function(d) { d.key = d.filterId; _.extend(d, _this.props); return Filter(d) });
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

  var Filters = React.createFactory(FiltersClass);

  return { filters: Filters }
})
