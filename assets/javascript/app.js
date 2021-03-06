// Initialize Firebase
var config = {
    apiKey: "AIzaSyB4A3AfOPX-fnUxNup5ks8WFq-2wDJWVzY",
    authDomain: "train-scheduler-6fff5.firebaseapp.com",
    databaseURL: "https://train-scheduler-6fff5.firebaseio.com",
    projectId: "train-scheduler-6fff5",
    storageBucket: "train-scheduler-6fff5.appspot.com",
    messagingSenderId: "816666300082"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // Add train
  $('#submit').on("click", function (event) {
    event.preventDefault();

    // Grab Inputs
    var trainName = $('#trainName').val().trim();
    var trainDes = $('#destinationInput').val().trim();
    var trainStart = moment($("#trainTime").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var trainFreq = $("#frequency").val().trim();

    // Local temp obj to hold data
    var newTrain = {
        name: trainName,
        destination: trainDes,
        start: trainStart,
        frequency: trainFreq
    };

    // Upload train data to database
    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);

    // Clear inputs
    $("#trainName").val("");
    $("#destinationInput").val("");
    $("#trainTime").val("");
    $("#frequency").val("");
  });

  // Add train to database and html
  database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());

    var trainName = snapshot.val().name;
    var trainDes = snapshot.val().destination;
    var trainStart = snapshot.val().start;
    var trainFreq = snapshot.val().frequency;

    
    //calculate difference between times
    var difference = moment().diff(moment.unix(trainStart), "minutes");
    //time apart(remainder)
		var timeRemain = moment().diff(moment.unix(trainStart), "minutes") % trainFreq;
    // Calculate minutes away
    var minAway = trainFreq - timeRemain;
    //next arrival
		var nextArrival = moment().add(minAway, "m").format("hh:mm A"); 
    
    // Create new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDes),
        $("<td>").text(trainFreq),
        $("<td>").text(nextArrival),
        $("<td>").text(minAway),
    );

    // Append new row
    $("#train-table > tbody").append(newRow);

  });