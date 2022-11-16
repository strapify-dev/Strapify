# Civiconnect Strapify

The Civiconnect Strapify project is an automated solution for webflow site exporting with injected code for Strapi CMS functionality.

## Data Attribute Syntax
TODO

## Marking Webflow elements for Strapi injection (outdated syntax)
Suppose we have a strapi collection type called Cards with the following fields: 
  - Header (text)
  - Subheader (text)
  - Image (single media)

In webflow we could make an element to contain the cards and a template element to represent a card:

![image](https://user-images.githubusercontent.com/113685729/200185275-a276f1d0-e8bb-427b-99aa-37cff98b31bc.png)

Notice the card element contains child elements corresponding to each of our strapi fields. To mark the cards element as the collection container, we add a custom data attribute in Webflow called strapi-collection, equal to the collection name:

![image](https://user-images.githubusercontent.com/113685729/200185539-47ed0e36-dfae-43bd-ab26-462814d231eb.png)

And then we mark the child elements to accept data from strapi by adding a custom data attribute called field-id, equal to the field id in Strapi:
  - header
  
    ![image](https://user-images.githubusercontent.com/113685729/200185685-a3fbbc0f-794a-404f-b2e6-efc5a9cb7891.png)
   
  - subheader
  
    ![image](https://user-images.githubusercontent.com/113685729/200185721-f7ba638c-17bd-44ec-9858-dd448c9be349.png)

  
  - image
  
    ![image](https://user-images.githubusercontent.com/113685729/200185734-a1694823-def8-408b-8879-2c731d913060.png)

The Civiconnect strapify application will use these data attributes to inject Strapi content into the website on the client side.


## How to Run
#### nvm
  - you must install nvm since strapi requries Node version 16 or lower but the server requires a much newer version to use the fetch api
    - Windows: https://github.com/coreybutler/nvm-windows
    - Linux: https://github.com/nvm-sh/nvm

#### Strapi (optional; you can just use a remote strapi instance)

  - cd into strapi folder and run the following commands
    ```shell
    nvm install 16.17.1
    ```
    ```shell
    nvm use 16.17.1
    ```
    ```shell
    npm install
    ```
  - create a file .env in strapi folder
  - copy contents of .env.example to .env
  
    replace the following line in .env: 
    ```javscript
    APP_KEYS="toBeModified1,toBeModified2"
    ```
    with something like: 
    ```javscript
    APP_KEYS="myKeyA,myKeyB"
    ```
  - build the strapi project
    ```shell
    npm run build
    ```
  - run the server for development
    ```shell
    npm run develop
    ```
  
#### Node Server
  - cd into server folder and run the following commands
    ```shell
    nvm install 19.0.1
    ```
    ```shell
    nvm use 19.0.1
    ```
    ```shell
    npm install
    ```
  - run the server with 
    ```shell
    npm run buildhot
    ```
  - and start webpack with hot realoding in another terminal (used to bundle the injector.js script) with
    ```shell
    npm run bundlehot
    ```
    
#### Frontend UI
  - cd into client folder and run the following commands
    ```shell
    npm install
    ```
    ```shell
    npm run dev
    ```
  - the app will be available on localhost:8080
  
## Usage
Ensure that the Strapi server is running and the desired content has been added. Also ensure that the custom data attributes have been created in the Webflow project.

The website can be built with either the frontend UI or by making a POST request.

### frontend UI (outdated)
 - ensure the frontend GUI has been started
 - enter the url and click "Scrape"
 - the extracted website can then be found in server/output
 - if the node server is running you can visit the site at localhost:3000/
 
![frontend-gui](https://user-images.githubusercontent.com/113685729/200182129-25880491-7126-4070-b852-248fc312ecfa.png)
