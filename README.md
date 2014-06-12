# Population.io

##Installation

1. clone the repo

2. install node.js

3. install dependencies

		npm install -g bower
		npm install -g gulp
		
		npm install
		bower install

4. start gulp

		cd your/project/folder
		gulp
		open http://localhost:1983

5. clean dist folder
    gulp clean

6. run jshint on app/scripts folder files
    gulp jshint
    
7. For the first run, copy app/assets whole folder into dist folder, so it becomes dist/assets.