require.config({
  urlArgs: "bust=" +  (new Date()).getTime()
});

requirejs(["app/app"], function(app) {
  $(document).ready(app.enter)
});
