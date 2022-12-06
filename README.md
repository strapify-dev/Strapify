# Strapify

Strapify is a javascript tool for the automatic client side injection of Strapi CMS data into a website.

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
