require('dotenv').load();
var config = {};

/* -- Config Sections -- */
config.capture = {};
config.twitter = {};
config.azure = {};

/* -- Capture Settings -- */
config.capture.maxCaptureSizeMB = 16;    // 0.064 = 64KB, 1 = 1MB...
config.capture.outputFolder = '/mnt/c/temp/twcap/';
config.capture.twTermsArray = ['#21D'];

/* -- Twitter App Info (https://apps.twitter.com), taken from the .env file -- */
config.twitter.consumerKey = process.env.TW_CONSUMER_KEY || 'NoValue';
config.twitter.consumerSecret =  process.env.TW_CONSUMER_SECRET || 'NoValue';
config.twitter.accessToken = process.env.TW_ACCESS_TOKEN || 'NoValue';
config.twitter.accessTokenSecret =  process.env.TW_ACCESS_TOKEN_SECRET || 'NoValue';

/* -- Azure storage settings -- */
config.azure.url = '';
config.azure.container = '';
config.azure.folder = '';
config.azure.key = process.env.AZURE_STORAGE_KEY || 'NoValue';

module.exports = config;