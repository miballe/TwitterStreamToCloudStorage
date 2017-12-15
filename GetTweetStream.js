/* 
    Created by: @mi_balle
    This node file gets a stream of tweets by reading them from the twitter streaming API,
    store them in a local file with a predefined size and finally save the file to a blob
    repository in the cloud.
*/

/* -- Used Packages -- */
var config = require('./config');
var Twit = require('twit')
var fs = require('fs');

/* -- Constants -- */
var twTermsArray = config.capture.twTermsArray;
var oFolder = config.capture.outputFolder;
var maxFileSizeMB = config.capture.maxCaptureSizeMB;

/* -- Global Variables -- */
var newFile = true;
var oFileName = '';
var oFullPath = oFolder + oFileName;

/*-- Initialize the first output file -- */
assignNewFileName();

var twConn = new Twit({
    consumer_key: config.twitter.consumerKey, 
    consumer_secret: config.twitter.consumerSecret, 
    access_token: config.twitter.accessToken, 
    access_token_secret: config.twitter.accessTokenSecret 
});
var stream = twConn.stream('statuses/filter', { track: twTermsArray });
console.log("[INFO] Now receiving Tweets...");

/* -- Handler when a tweet is received -- */
stream.on('tweet', function (tweet) {
    CheckFileSize();
    SaveTweet(tweet);
});

/* -- Handler if the process is finished with Ctrl+C -- */
process.on('SIGINT', function(){
    EndFile();
    process.exit();
});

/* -- Appends a tweet to the current file -- */
function SaveTweet(tweet) {
    let fLine = '';
    if(newFile) {
        fLine = '[\n' + JSON.stringify(tweet);
        newFile = false;
    } else {
        fLine = ',\n' + JSON.stringify(tweet);
    }
    fs.appendFileSync(oFullPath, fLine);
}

/* -- Writes an array-end bracket -- */
function EndFile() {
    fs.appendFileSync(oFullPath, '\n]');
}

/* -- Checks the file for max size and start a new one if necessary -- */
function CheckFileSize() {
    let stats = fs.statSync(oFullPath);
    if((stats.size / 1024000) > maxFileSizeMB) {
        EndFile();
        newFile = true;
        assignNewFileName();
    }
}

/* -- Assigns a new file name from the current date-time -- */
function assignNewFileName(){
    oFileName = Date.now().toString() + '.json';
    oFullPath = oFolder + oFileName;
    fs.appendFileSync(oFullPath, '');
    console.log('[INFO] New file: ' + oFileName);
}
