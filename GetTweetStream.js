/* 
    Created by: @mi_balle
    This node file gets a stream of tweets by reading them from the twitter streaming API,
    store them in a local file with a predefined size and finally save the file to a blob
    repository in the cloud.
*/

/* -- Used Packages -- */
var config = require('./config');
var Twit = require('twit');
var azure = require('azure-storage');
var fs = require('fs');

/* -- Constants -- */
var twTermsArray = config.capture.twTermsArray;
var oFolder = config.capture.outputFolder;
var maxFileSizeMB = config.capture.maxCaptureSizeMB;

/* -- Global Variables -- */
var newFile = true;
var oFileName = '';
var lFileName = '';
var oFullPath = oFolder + oFileName;
var useAzure = process.env.AZURE_STORAGE_CONNECTION_STRING === '' ? false : true;

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
    if(newFile && lFileName !== '') {
        azureUploadBlob();
    }
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
    lFileName = oFileName;
    oFileName = Date.now().toString() + '.json';
    oFullPath = oFolder + oFileName;
    fs.appendFileSync(oFullPath, '', function(err) {
        if(err) {
            console.log('[ERR] Error when writing the file ' + oFileName);
        }
    });
    console.log('[INFO] New file: ' + oFileName);
}

function azureUploadBlob() {
    console.log('[INFO] Uploading ' + lFileName + ' to Azure');
    var azureBlob = azure.createBlobService();
    azureBlob.createBlockBlobFromLocalFile(config.azure.container, config.azure.folder + lFileName, oFolder + lFileName, function(err) {
        if(err) {
            console.log('[ERROR] Azure Blob Upload Failed for ' + lFileName + '\n\tErrDetails: ' + err.message);
        } else {
            console.log('[INFO] File ' + lFileName + ' uploaded correctly to Azure Storage');
        }
    });
}