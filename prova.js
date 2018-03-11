// Anonymous "self-invoking" function
(function() {
  // Load the script
  var script = document.createElement("SCRIPT");
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
  script.type = 'text/javascript';
  script.onload = function() {
      var $ = window.jQuery;
      // Use $ here...
      var generatedNums = bingo.selectedNumbers;
      var generatedNums = data.bingoNums;
      /*         generatedNums.sort();
      givenNums.sort();
      alert(generatedNums + " : " + generatedNums.length );
      alert(givenNums + " : " + givenNums.length); */
      var difference = $(givenNums).not(generatedNums).get();
      //var difference = array_diff(generatedNums, generatedNums);
      alert(" the difference is " + difference);
      
    };
})();
