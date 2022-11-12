# Civiconnect Strapify

The Civiconnect Strapify project is an automated solution for webflow site exporting with injected code for Strapi CMS compatibility.

## Data Attribute Syntax (WIP)

### Core Attributes:
| Attribute Name | Example Value | Max Allowed Per Element | Description |
| --- | --- | --- | --- |
| strapi&#x2011;collection&#x2011;name | book | 1 | Added to a container to specify that child elements will use data from the given collection's fields. |
| strapi&#x2011;field&#x2011;name | author | inf | Specifies a field (in the collection specified on a parent with strapi-collection-name) from which data will be pulled. By default, strapify will infer what should be done with the data based on the element type and the Strapi field type. Text elements would have their inner content set whereas image elements would have the src set to a link to an image. |
| strapi&#x2011;into | alt_text&nbsp;->&nbsp;alt | inf | Specifies that the Strapi data (alt_text), should be given as a value to an html attribute (alt). |

### Array and Component Attributes:
| Attribute Name | Example Value | Max Allowed Per Element | Description |
| --- | --- | --- | --- |
| strapi&#x2011;field&#x2011;name | component_name.field_name | inf | See strapi-field-name above. Uses a field of a component rather than a top level field. |
| strapi&#x2011;field&#x2011;name | field_name[0] | inf | See strapi-field-name above. Uses an element from an field with an array (media type for example) at a specific index (0 in the example). |
| strapi&#x2011;field&#x2011;name | field_name[] | inf | See strapi-field-name immediately above. When no index is given to the array, the element with this attribute will be duplicated with injected data for each element in the array. |
| strapi&#x2011;into | component_name.field_name&nbsp;->&nbsp;alt | inf | Specifies that the Strapi data from a component field should be given as a value to an html attribute (alt). |
| strapi&#x2011;into | field_name[0]&nbsp;->&nbsp;alt | inf | Specifies that the Strapi data at a specific index for a strapi data array should be given as a value to an html attribute (alt). |
| strapi&#x2011;into | field_name[]&nbsp;->&nbsp;alt | inf | Used to apply strapi-into with elements that are duplicated for each array element in a strapi field of type array. Must be used in conjunction with strapi-field-name with the empty array index as shown above. |

### strapi-into reserved keywords (WIP):
- TEXT (strapi-into="field_name -> TEXT")
- IMAGE (strapi-into="field_name -> IMAGE")
TODO

## Marking Webflow elements for Strapi injection
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

The Civiconnect strapify application will use these data attributes to inject Strapi content into the website at runtime.


## How to Run
#### nvm
  - you must install nvm since strapi requries Node version 16 or lower but the server requires a much newer version to use the fetch api
    - Windows: https://github.com/coreybutler/nvm-windows
    - Linux: https://github.com/nvm-sh/nvm

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

### frontend UI
 - ensure the frontend GUI has been started
 - enter the url and click "Scrape"
 - the extracted website can then be found in server/output
 - if the node server is running you can visit the site at localhost:3000/
 
![frontend-gui](https://user-images.githubusercontent.com/113685729/200182129-25880491-7126-4070-b852-248fc312ecfa.png)

### postman
  - make a POST request containing the webflow url to http://localhost:3000/api/test

  - give the content type header like so
  ![header](https://user-images.githubusercontent.com/113685729/200182226-32a0c6b7-87ee-4b08-be60-b3f77585f54a.png)

  - give the body data like so
  ![body](https://user-images.githubusercontent.com/113685729/200182228-9f9dcec9-f5be-4b3a-8012-65202beecaff.png)
  
the extracted website can then be found in server/output
