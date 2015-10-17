# Population.io-Mobile

## Setup

* Clone the repository
* Install node.js ([nodejs.org](http://nodejs.org))
* Install package manager `bower`

        $ npm install -g bower

* Install build system `gulp`

        $ npm install -g gulp

* Install dependencies

        $ npm install
        $ bower install


## Run

* Navigate to *PROJECT_ROOT* and start the server by using `gulp`

        $ gulp

* Open http://localhost:1983
* If you want to run the mobile app in your local desktop browser, then make sure to emulate a mobile device (otherwise you might be forwarded to Population.io, the desktop version)

## Deploy

* Add `.ftppass` file to your *PROJECT_ROOT* and enter ftp credentials

        {
          "keyMain": {
            "user": USER,
            "pass": PASS
          }
        }

* Run `gulp deploy`

## Config Files

* Add `config.json` file to your *PROJECT_ROOT* and enter missing credentials

        {
          "local": {
            "EnvironmentConfig": {
              "mailauth":"AUTH",
              "friendmail":"AUTH"
            }
          },
          "production": {
            "EnvironmentConfig": {
              "mailauth":"AUTH",
              "friendmail":"AUTH"
            }
          }
        }
        
* Add seperate `config.json` into your *PHPMAIL_DIRECTORY* and enter missing credentials

        {
          "phpmail": {
            "EnvironmentConfig": {
              "mailauth":"AUTH",
              "friendmail":"AUTH",
              "host":"SMTP",
              "username" : "USER",
              "password" : "PASS",
              "subject" : "SUBJECT"
            }
          }
        }
