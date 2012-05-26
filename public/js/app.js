$(document).ready(function() {
  CrimeFighter.getJSONFromServer();
});

CrimeFighter = {};

CrimeFighter.getJSONFromServer = function() {
  $.getJSON("/get_crime_json", {}, function(data) {
    console.log(data);
  });
};
