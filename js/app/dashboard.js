/**
 *  Independent Outlier Archive
 *
 *  Copyright (c) 2014-2015 Chandrasekhar Ramakrishnan
 *
 *  Released under GPL license.
 */

 /**
  * Implementation of the component that acts as the dashboard with controls.
  */
define(["react/react", "app/filters", "app/stats"], function(React, filters, stats) {

  /**
   * @function Unpack data from a join
   */
  function unpack(d) { return d;}

  var DashboardClass = React.createClass({

    render: function() {
      var column = React.DOM.div({className: 'row'}, [filters.filters(this.props), stats.stats(this.props)]);
      return column;
    }
  });

  var Dashboard = React.createFactory(DashboardClass)

  return { dashboard: Dashboard }
})
