var app = angular.module("sampleApp", ["firebase","ngAnimate"]);
app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item, key) {
            if (key != "$id" && key != "$priority") {
                filtered.push(item);
            }
        });
        filtered.sort(function(a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
});
app.filter('firstCharacterUpper',function(){
    return function(message){
    if(message){
      var firstchar = message.charAt(0).toUpperCase();
        return firstchar;
        }
    };
});
app.filter('absolutemoment',function(){
            return function(time){
                console.log(time);
                if(time!=null){
             var prettyTime = moment(time).format('MMMM Do, h:mm a');
                return prettyTime;
                }
        };
        });
app.filter('moment', function() {
    return function(time) {
        console.log(time);
        if (time != null) {
         refTime = new moment(time);    
         var currentDate = new moment();
    if (currentDate.isSame(refTime, 'day'))
        return refTime.format('h:mm a');
    else if (currentDate.isSame(refTime, 'year'))
        return refTime.format("MMM DD");
    else
        return refTime.format("MM/DD/YYYY");
        }
    };
});
app.filter('camelCase',function(){
    return function(ccstring){
            if(ccstring){
                var split = ccstring.split(' ');
                for (var i = 0, len = split.length; i < len; i++) {
                    split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1);
                }
                ccstring= split.join(' ');
                return ccstring;
                }
            }
});
app.controller("ProfileCtrl", ["$scope", "$firebaseObject", "$firebaseAuth","$timeout", function($scope, $firebaseObject, $firebaseAuth,$timeout) {
    var config = {
        apiKey: "AIzaSyDRz5Witr78NFCXpN_l32F7TjJ052FuFBE",
        authDomain: "project-8948854633251931668.firebaseapp.com",
        databaseURL: "https://project-8948854633251931668.firebaseio.com",
        storageBucket: "",
    };
    firebase.initializeApp(config);
    var authRef = firebase.auth();
    $scope.authObj = $firebaseAuth(authRef);
    var messagesRef = "";
    var messages = "";
    var deletedMessages = "";
    $scope.callMail = function() {
        messagesRef = firebase.database();
        messages = $firebaseObject(messagesRef.ref().child('EmailContainer'));
        deletedMessages = $firebaseObject(messagesRef.ref().child('DeletedMail'));
        messages.$bindTo($scope, 'EmailContainer');
        deletedMessages.$bindTo($scope, 'deletedMail');
        messages.$loaded().then(function(data) {
            console.log($scope.EmailContainer);
        });
        deletedMessages.$loaded().then(function(data) {
            console.log($scope.deletedMail);
            console.log('DeletedMessages');
        });
    };
    $scope.markAsRead = function(emailMessage) {
        console.log(emailMessage.updateTime);
        $scope.EmailContainer['email' + emailMessage.updateTime].read = true;
    }
    $scope.removeEmail = function(message) {
        $scope.deletedMail['email' + message.updateTime] = message;
        $firebaseObject(messagesRef.ref().child('EmailContainer').child('email' + message.updateTime)).$remove();
    }
    $scope.abc = "asdhf";
    $scope.deleteData = function() {
        $scope.authObj.$signOut()
            console.log("$scope.authObj.$getAuth()");
            console.log($scope.authObj.$getAuth());
            $scope.displaylogin=true;
    };
    $scope.messagectrl=function(message){
      console.log("inside the messagectrl");
      $scope.openMessage = message;
      $scope.specificmessage===true?$scope.specificmessage=false:$scope.specificmessage=true;
    };
    $scope.showerrormessage=function(errmsg){
        $scope.finalerrormessage=errmsg;
        $scope.showmessage=true;
        $timeout(function(){
            $scope.showmessage=false;
            $scope.finalerrormessage="";
        },3000);
    }
    console.log("$scope.authObj");
    console.log($scope.authObj);
    $scope.login = function() {
        console.log("inside the login");
        $scope.displaylogin = true;
        if ($scope.email && $scope.password) {
            $scope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password)
                .then(function(authData) {
                    console.log('hello there');
                    $scope.callMail();
                    $scope.authData = authData;
                    $scope.displaylogin = false;
                    $scope.email=""; $scope.password="";
                }).catch(function(error) {
                    console.error("Authentication failed:", error.message);
                    $scope.showerrormessage(error.message);
                });
        }
        else{
            $scope.showerrormessage("Email and password cannot be empty");
        }
    };
    $scope.authObj.$getAuth() ? $scope.callMail() : $scope.login();

}]);