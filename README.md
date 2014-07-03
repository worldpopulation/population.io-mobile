# Population.io

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

## Prepare

* For the first run, copy *app/assets* whole folder into dist folder, so it becomes *dist/assets*

## Run

* Navigate to *PROJECT_ROOT* and start the server by using `gulp`

        $ gulp

* Open http://localhost:1983

## Deploy

* Add `.ftppass` file to your *PROJECT_ROOT* and enter ftp credentials

        {
          "keyMain": {
            "user": USER,
            "pass": PASS
          }
        }

* Run `gulp deploy`