$(document).ready(function() {
  CrimeFighter.getJSONFromServer();
  window.setTimeout(CrimeFighter.setupDataContainers, 500);
});

CrimeFighter = {};

CrimeFighter.getJSONFromServer = function() {
  $.getJSON("/get_crime_json", {}, function(data) {
    CrimeFighter.rawCrimes = data
  });
};

CrimeFighter.rawCrimeToArray = function() {
  if (CrimeFighter.rawCrimes) {
    var ary = [];
    for (var crime in CrimeFighter.rawCrimes) {
      ary.push(CrimeFighter.rawCrimes[crime]);
    }
    return ary;
  }
  return false;
};

CrimeFighter.setupDataContainers = function() {
  var crimeContainer = CrimeFighter.rawCrimeToArray();
  if (crimeContainer) {
    CrimeFighter.crimeCrossfilter = crossfilter(crimeContainer);
  }
};

CrimeFighter.dimensionByCrimeType = function() {
  if (CrimeFighter.crimeCrossfilter) {
    return CrimeFighter.crimeCrossfilter.dimension(function(crime) { crime.crime; });
  }
};
