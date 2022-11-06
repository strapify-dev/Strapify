# webflow-to-svelte (working name)

## How to Run
#### nvm
  - you must install nvm since strapi requries Node version 16 or lower but the server requires a much newer version to use the fetch api

#### Strapi

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
  - and start the webpack dev server in another terminal
    ```shell
    npm run bundlehot
    ```
    
#### Frontned UI
  - cd into client folder and run the following commands
    ```shell
    npm install
    ```
    ```shell
    npm run dev
    ```
  - the app will be available on localhost:8080
  
## Usage
### frontend GUI
 - ensure the frontend GUI has been started
 - enter the url and click "Scrape"
 - the extracted website can then be found in server/output
 - if the node server is running you can visit the site at localhost:3000/
 
![frontend-gui](https://user-images.githubusercontent.com/113685729/200182129-25880491-7126-4070-b852-248fc312ecfa.png)

### postman
  - make a POST request containing the webflow url to http://localhost:3000/test

  - give the content type header like so
  ![header](https://user-images.githubusercontent.com/113685729/200182226-32a0c6b7-87ee-4b08-be60-b3f77585f54a.png)

  - give the body data like so
  ![body](https://user-images.githubusercontent.com/113685729/200182228-9f9dcec9-f5be-4b3a-8012-65202beecaff.png)
