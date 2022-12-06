# Strapify

Strapify is a javascript tool for the automatic client side injection of Strapi CMS data into a website.

WIP documentation https://raykeating.notion.site/Strapify-d812afd09595478fbb48b71c320e68be

## How to Run For Development
It is easiest to develop Strapify using the development server and development client, which will hot reload changes.

#### Development Server
  - cd into server folder and run the following commands
    ```shell
    npm install
    ```
  - run the server with 
    ```shell
    npm run buildhot
    ```
  - and start webpack with hot realoding in another terminal (used to bundle the source scripts) with
    ```shell
    npm run bundlehot
    ```
  - if any changes are made to strapify-parser.js.pegjs, you must rebuild the peggy parser with
    ```shell
    npm run buildpeggy
    ```
    
#### Development Client
  - cd into client folder and run the following commands
    ```shell
    npm install
    ```
    ```shell
    npm run dev
    ```
  - the app will be available on localhost:8080
  
  you can test it with these links 
  - webflow: https://strapify-demo.webflow.io/
  - strapi: http://54.163.229.233:1337
  
  
## How to build
For development builds cd into /server and run the following commands
```shell
npm run buildpeggy
```
```shell
npm run bundle
```
the script can then be foundin /server/bundle/main.js

For production builds cd into /server and run the following commands
```shell
npm run buildpeggy
```
```shell
npm run bundleprod
```
the script can then be foundin /server/bundle/strapify.js

## How to make changes
The source files for Strapify are found in /server/strapify-src. Make any changes and build.
