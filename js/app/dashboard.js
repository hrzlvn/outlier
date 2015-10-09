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
define(["react", "app/filters", "app/stats"], function(React, filters, stats) {

  /**
   * @function Unpack data from a join
   */
  function unpack(d) { return d;}

  var DashboardClass = React.createClass({
    displayName: 'Dashboard',
    render: function() {
      var row =
        React.DOM.div(
            {className: 'row'},
            [ filters.filters(_.extend({key: 'dashboardFilters'}, this.props)),
              stats.stats(_.extend({key: 'dashboardStats'}, this.props)) ]);
      return row;
    }
  });

  var Dashboard = React.createFactory(DashboardClass)

  return { dashboard: Dashboard }
})
