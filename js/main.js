/**
 *  Independent Outlier Archive
 *
 *  Copyright (c) 2014-2015 Chandrasekhar Ramakrishnan
 *
 *  Released under GPL license.
 */


// Development config
require.config({
  "urlArgs": "bust=" +  (new Date()).getTime(),
  "paths": {
    "backbone": "backbone/backbone",
    "d3": "d3/d3",
    "enquire": "enquire/enquire",
    "jquery": "jquery/jquery",
    "react": "react/react",
    "underscore": "underscore/underscore"
  }
});

// Production config
// require.config({
//   "paths": {
//     "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min",
//     "d3": "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min"
//   }
// });

requirejs(["app/app"], function(app) {
  $(document).ready(app.enter)
});
