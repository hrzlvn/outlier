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
              <h5>Guide</h5>
                <div id="guide-text">
                  <p>The clothsography shows most Outlier releases made in the period from April 2011 to {this.props.endmonth} {this.props.endyear}, and a few from earlier as well.</p>
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

  // <div class="row" style="padding: 10px 0px 0px 0px;">
  //
  // </div>
  // <div class="row">
  //   <div class="col-md-8">
  //     <h2>Outlier Clothsography</h2>
  //     <p>I am not someone who follows the fashion industry or knows much about clothing, but I like <a href="http://www.outlier.cc">Outlier</a>'s products a lot. For several reasons, I put a lot of consideration into every Outlier order I make, and I felt like I needed more data in order to better make my purchase decisions.</p>
  //     <p>First, though I think their prices are reasonable given the quality of what you get, their clothes and accessories are expensive enough that I do not buy items just on a lark. Second, as you can see in the data, Outlier releases new products at a furious pace. I consider buying just about everything they put out, but I neither have the money or closet space to afford that. And finally, sometimes I am looking for something specific, say, a new jacket. If I think Outlier is going to put out something that fits the bill within a reasonable timeframe, I'm inclined to hold out and wait for it.</p>
  //     <p>So, for these reasons, I wanted to get a handle on Outlier's product release cycle to budget and make informed decisions about my purchases. Maybe you will find it useful as well.</p>
  //     <p>If you have any comments, suggestions, or additional data, <a href="https://twitter.com/ciyer">drop me a line</a>.
  //     </p>
  //   </div>
  // </div>
  //
  // <hr>
  //
  // <footer>
  //   <p>&copy;illposed 2014</p>
  // </footer>
