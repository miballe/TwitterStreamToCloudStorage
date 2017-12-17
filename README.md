# Tweeter Stream to Cloud Storage
Node.js project that captures a Twitter Stream based on a set of terms, hash tags or mentions, and saves them to a local JSON file. Then, that file is uploaded to a cloud storage that may be located in Azure, Amazon Web Services - AWS, Google Cloud Platform - GCP.

This commonly is the starting point for later analysis using Machine Learning techniques, or simply to store them to later be queried and visualized in tools such as Tableau, Power BI, QuickSight, etc.

The main aim of this project is to provide a cost-effective option compared the commonly suggested architectures that require a higher spending with a sophisticated set of components not necessary for small to medium scenarios. 

# Prerequisites
1. node.js v7 or higher (not tested in lower versions)
2. npm
3. git command

# Installation
As easy as 1, 2, 3 :)

## Clone this repository and install dependencies
To clone the repository, if using the git command, run...

```zsh
$ git clone https://github.com/miballe/TwitterStreamToCloudStorage.git
```

Then, change to the newly created directory (most likely `TwitterStreamToCloudStorage`). With the following command npm figures out the dependencies and install the necessary libraries...

```zsh
$ cd TwitterStreamToCloudStorage
$ npm install
```

After this command you'll see a node_modules folder with the downloaded libraries.

## Change the configuration settings
There are two files where some settings have to be set. Sensitive values like Twitter or cloud storage account secrets are designed to be writen in the file `.env` which is doesn't exist with such name in the current git repository. So, the first task is to rename the file `dotenv` to `.env`.

Then, in the `.env` file replace each `<< Value >>` tag with the value you get from the Twitter app or the cloud provider.

```zsh
TW_CONSUMER_KEY=a886sdf8922ffg23gb7bh
...
```

Now, settings have to be set in the `config.js` file. Just ensure you have the necessary write permissions in the output folder. 

```js
config.capture.maxCaptureSizeMB = 16;
config.capture.outputFolder = '/user/myuser/twcaptures/';
config.capture.twTermsArray = ['#AI', '#ML', '#nodejs', '#node', '@twitter'];
```

Keep in mind that, depending on the expected amount of tweets per minute or hour, you can set a file size value in a way that the app will write the file in the cloud storage with a frequency enough to have an almost-real-time experience.

## Run the app
Now the app can be started interactively in the console, or if you're interested in keep it running during a long time, it may be a better idea to run it in the background.

Interactive in the console...
```zsh
$ npm start
```

Running in background...
```zsh
$ npm start > twactivity.log &
```

# Current work
I'm aware that the app still don't have the expected support to write to all types of common cloud storages. Azure is working at the moment. AWS and GCP work is in progress. So, in the roadmap...
1. Support of AWS and GCP repositories
2. Logger
3. Tweets pre-processing
4. Compress the ended file and move it to an archive folder


