/**
 *  Independent Outlier Archive
 *
 *  Copyright (c) 2014-2015 Chandrasekhar Ramakrishnan
 *
 *  Released under GPL license.
 */


// Use cache busting in development, but turn it off in production
require.config({
  urlArgs: "bust=" +  (new Date()).getTime()
});

requirejs(["app/app"], function(app) {
  $(document).ready(app.enter)
});
