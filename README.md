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
    
#### Frontned UI
  - todo
  
## Usage
  - todo
