/* 
    Created by: @mi_balle
    This node file gets a stream of tweets by reading them from the twitter streaming API,
    store them in a local file with a predefined size and finally save the file to a blob
    repository in the cloud.
*/

/* -- Used Packages -- */
var Twit = require('twit')
var fs = require('fs');

/* -- Constants -- */
const twConsumerKey = '<< Consumer Key >>';
const twConsmerSecret = '<< Consumer Secret >>';
const twAccessToken = '<< Access Token >>';
const twAccessTokenSecret = '<< Access Token Secret >>';
const twTermsArray = ['#HashTag1', '#HashTag2', '@user1', '@user2', 'term1', 'term2'];
const oFolder = '/folder/sub1/sub2/';
const maxFileSizeMB = 64;

/* -- Global Variables -- */
var newFile = true;
var oFileName = 'abc.json';
var oFullPath = oFolder + oFileName;
/*-- Initialize the first output file -- */
assignNewFileName();


var twConn = new Twit({ consumer_key: twConsumerKey, consumer_secret: twConsmerSecret, access_token: twAccessToken, access_token_secret: twAccessTokenSecret });
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
    if(stats.size / 1024000 > maxFileSizeMB) {
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
