/*!
 * Independent Outlier Archive
 *
 * Copyright (c) 2014, 2015 Chandrasekhar Ramakrishnan
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
define(["react/react"], function(React) {
  var FiltersClass = React.createClass({
    render: function() {
      var filterIds = ["clothes-filter", "accessory-filter", "fabric-filter", "mwu-filter", "reup-filter"];
      var filters = filterIds.map(function(d) { return React.DOM.div({id: d, className: 'panel'})} );
      var panelGroup = React.DOM.div({className:'panel-group', id:'filters'}, filters);
      var clearButton = React.DOM.button({
        className:'btn btn-xs btn-default', id:'clear-button', type:'button'
      }, 'Clear All');
      var clearGroup = React.DOM.div({style: {paddingBottom: "10px"}}, clearButton);

      var title = React.DOM.h3(null, 'Filter');
      var column = React.DOM.div({className: 'col-xs-12 col-md-12'}, [title, clearGroup, panelGroup]);
      return column;
    }
  });

  var Filters = React.createFactory(FiltersClass)

  return { filters: Filters }
})
