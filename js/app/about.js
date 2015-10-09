/**
 *  Independent Outlier Archive
 *
 *  Copyright (c) 2014-2015 Chandrasekhar Ramakrishnan
 *
 *  Released under GPL license.
 */

 /**
  * Implementation of the about information.
  */

import React from 'react'

var Guide = React.createClass({
  render: function() {
    return (<div className="col-md-8">
              <h3>Guide</h3>
                <div id="guide-text">
                  <p>The clothsography shows most <a href="http://www.outlier.cc">Outlier</a> releases made in the period from April 2011 to {this.props.endmonth} {this.props.endyear}, and a few from earlier as well.</p>
                  <p>
                    To focus on certain kinds of items, turn on one or more of the filters from the far left. For example, to see just shirts for women, expand <strong>Clothes</strong> and select <strong>Shirts</strong> then expand <strong>Men/Women/Unisex</strong> and select <strong>Women</strong>.
                  </p>
                  <p>
                    The data on release dates is from <a href="http://milled.com/outlier">Milled/Outlier</a> and <a href="https://twitter.com/outlier">twitter</a>; price data is mostly from the Outlier web site; any mistakes are mine alone. If you spot something, let <a href="https://twitter.com/ciyer">me know</a>.
                  </p>
                </div>
            </div>)
  }
});


var AboutClass = React.createClass({
  displayName: 'About',
  render: function() {
    return (<div className='row' style={{padding: "10px 0px 0px 0px"}}><Guide {...this.props} /></div>)
  }
});

var About = React.createFactory(AboutClass);

export default { about: About }
