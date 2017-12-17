require('dotenv').load();
var config = {};

/* -- Config Sections -- */
config.capture = {};
config.twitter = {};
config.azure = {};

/* -- Capture Settings -- */
config.capture.maxCaptureSizeMB = 0.5;    // 0.064 = 64KB, 1 = 1MB...
config.capture.outputFolder = '/home/miballe/cap2017/';
config.capture.twTermsArray = ['#AI', '#ML', '#nodejs', '#node', '@twitter'];

/* -- Twitter App Info (https://apps.twitter.com), taken from the .env file -- */
config.twitter.consumerKey = process.env.TW_CONSUMER_KEY || 'NoValue';
config.twitter.consumerSecret =  process.env.TW_CONSUMER_SECRET || 'NoValue';
config.twitter.accessToken = process.env.TW_ACCESS_TOKEN || 'NoValue';
config.twitter.accessTokenSecret =  process.env.TW_ACCESS_TOKEN_SECRET || 'NoValue';

/* -- Azure storage settings -- */
// The connection string is set in .env (AZURE_STORAGE_CONNECTION_STRING)
config.azure.url = 'https://twsimpleview.blob.core.windows.net/';
config.azure.container = 'incomingtw';
config.azure.folder = '';
config.azure.key = process.env.AZURE_STORAGE_KEY || 'NoValue';

module.exports = config;