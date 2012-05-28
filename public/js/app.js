$(document).ready(function() {
  CrimeFighter.buildVisualization();
});

CrimeFighter = {};

CrimeFighter.getJSONFromServer = function() {
  $.getJSON("/get_crime_json", {}, function(data) {
    CrimeFighter.rawCrimes = data
  });
};

CrimeFighter.rawCrimeToArray = function(crimes) {
  if (crimes || CrimeFighter.rawCrimes) {
    var crimeRecords = crimes || CrimeFighter.rawCrimes;
    var ary = [];
    for (var crime in crimeRecords) {
      var crimeRecord = crimeRecords[crime];
      ary.push(crimeRecord);
    }
    return ary;
  }
  return false;
};

CrimeFighter.setupDataContainers = function() {
  var crimeContainer = CrimeFighter.rawCrimeToArray();
  if (crimeContainer) {
    CrimeFighter.CrimeCrossfilter = crossfilter(crimeContainer);
  }
};

CrimeFighter.dimensionByCrimeType = function() {
  if (CrimeFighter.crimeCrossfilter) {
    return CrimeFighter.CrimeCrossfilter.dimension(function(crimeRecord) { return crimeRecord.crime; });
  }
};

CrimeFighter.parseDateStrings = function(crimes) {
  var crimeArray = CrimeFighter.rawCrimeToArray(crimes);
  for (var i = 0; i < crimeArray.length; i++) {
    record = crimeArray[i];
    fullDate = record.date.split(" ")[0];
    splitDate = fullDate.split("/");
    record.date = new Date(fullDate);
  }
  return crimeArray;
}

CrimeFighter.buildVisualization = function() {
  var tableCellString = function(d) {
    return "<td>" + d.crime + "</td>" +
      "<td>" + d.address + "</td>" +
      "<td>" + d.date.toDateString() + "</td>";
  };

  d3.json("../crimes.json", function(crimes) { 
    var crimeArray = CrimeFighter.parseDateStrings(crimes);
    var crime = crossfilter(crimeArray),
        all = crime.groupAll(),
        date = crime.dimension(function(d) { return d3.time.day(d.date); }),
        dates = date.group();
    d3.select("tbody").selectAll("tbody")
      .data(crimeArray).enter().append("tr")
      .html(function(d) { 
        return tableCellString(d);
      });
  });
}
