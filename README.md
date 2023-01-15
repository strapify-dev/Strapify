# Strapify

Strapify is a javascript tool for the automatic client side injection of Strapi CMS data into a website.

WIP documentation https://observant-bed-47f.notion.site/Strapify-newest-3c7d220c5c6e4306baad33b1d2890f94

## How to Run For Development
For a website with files stored locally, build Strapify and add /strapify/bundle/main.js to your HTML file.

For a website which is hosted, such as a Webflow site, it is easiest to develop Strapify using the development server and client, which will allow you to scrape the site and add the Strapify script with a single button press.

#### Strapify
  - cd into the /strapify folder and install npm deps
    ```shell
    npm install
    ```
  - install peggy (must be installed globally) and build the peggy parser with
    ```shell
    npm install -g peggy
    npm run buildpeggy
    ```
  - and start webpack with hot reloding in another terminal (used to bundle the source scripts) with
    ```shell
    npm run bundlehot
    ```
    

#### Development Server
  - cd into the /test-server folder and install npm deps
    ```shell
    npm install
    ```
  - run the server with 
    ```shell
    npm run starthot
    ```
    
    
#### Development Client
  - cd into the /test-client folder and install npm deps
    ```shell
    npm install
    ```
  - run the client with 
    ```shell
    npm run dev
    ```
the app will be available on localhost:8080. You can test it with these links:
- webflow: https://strapify-demo.webflow.io/
- strapi: http://54.163.229.233:1337
  
  
## How to build
For development builds cd into /strapify and run the following commands
```shell
npm install -g peggy
npm run buildpeggy
```
```shell
npm run bundle
```
the script can then be found in /strapify/bundle/main.js

For production builds cd into /strapify and run the following commands
```shell
npm install -g peggy
npm run buildpeggy
```
```shell
npm run bundleprod
```
the script can then be found in /strapify/bundle/strapify.js

## How to make changes
The source files for Strapify are found in /strapify/src. Make any changes and build.

## Testing
Strapify uses Jest for testing. Some functions are unit tested as usual but since Strapify is all about modifying the DOM, we use a more elaborate system that requires manual human validation initially, and then automated difference testing afterwards.

This system involves three directories
  1. /strapify/tests/html-templates (place any tests you make in here)
  2. /strapify/tests/html-tests-unvalidated (never add anything here)
  3. /strapify/tests/html-tests-validated (move files from html-tests-unvalidated to this directory after manual validation)

The DOM based testing process is as follows: 
  1. create any tests and add them to the html-templates directory
  2. run the tests in DOM.test.js. This will result in a file for each template, with the same name as the template, being created in html-tests-unvalidated. These files contain a dump of the DOM after Strapify runs.
  3. if the test has not been manually validated, the test will fail. In this case, open the test file in html-tests-unvalidated and validate that everything is correct. You must disable javascript when you open the file in a browser. If everything is ok, move it to html-tests-validated and run Jest again
  4. if a validated file does exist, the dumped DOM will be compared to the content of the validated file to detect any differences.
  
  This system allows for unexpected changes in behaviour to be detected automatically. 
