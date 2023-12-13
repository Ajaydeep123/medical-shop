# One Stop Medical Shop

One stop eCommerce shop for providing medical equipments and products.


## Getting Started
#### Video Guide
  - [Walkthrough](https://drive.google.com/file/d/18T9BRBusmzUUApdaF7y_c5LIaVPwshqC/view?usp=sharing)

#### Design
![image](https://github.com/Ajaydeep123/medical-shop/assets/49810031/651fc7de-c302-4c6f-9316-c629ac09226c)

#### Start the services
- Install docker desktop and docker compose
- Clone the repository
- Start docker desktop
- run the following command:
```bash
  docker-compose up 
```
- Some things to keep in mind while using this file:
⭐️ We'll need the name of our network later on, so be aware about it.
⭐️ Neo4j browser will be available on localhost:7474 and the login credentials
    for connecting with neo4j db are as follows. 
```bash
  bolt url : bolt://localhost:7687
  username: neo4j
  password: bitnami1
```
#### Populating the db via node js script
- we've create a Docker file for this process
- Steps:
```bash
  mkdir db-loading
  cd db-loading
  npm init -y
  npm i neo4j-driver dotenv
  touch app.js
  touch Dockerfile
  touch .dockerignore
  copy code from my files to yours
```
- With this Dockerfile, we have our image ready and now we need to build it and run a container
```bash
  docker build -t dataloadermonster . //builds the image
  docker run -d --network=smarter-codes_wordpressdb_net dataloadermonster //starts a container with above image.
```
📌 We're setting the network for our new container, same as the network we created during the step 1 of docker-compose up. We want to be able to query to the neo4j container that is already running in the bg. So, being in the same network is crucial to establish communication.

✅ Our dataloadermonster's container will execute the query, which will populate the neo4j db and exit from the process.
- we've create a Docker file for this process
- Steps:
```bash
  mkdir backend
  cd backend
  npm init -y
  npm i neo4j-driver dotenv randomstring 
  touch app.js
  touch Dockerfile
  touch .dockerignore
  copy code from my files to yours
```
- With this Dockerfile, we have our image ready and now we need to build it and run a container
```bash
  docker build -t backendapi . //builds the image
  docker run -d --network=smarter-codes_wordpressdb_net backendapi //starts a container with above image.
```

#### Adding product to the woocommerce store with neo4j db's data using node js

## Neo4j Visualization Video
https://github.com/Ajaydeep123/medical-shop/assets/49810031/5e5b8377-33d0-4a13-8ede-4d3af7f24eca

## Neo4j Visualization Screenshots

#### Neo4j homepage showing relations of a product node with other nodes:
![Screenshot 2023-12-10 at 4 38 06 PM](https://github.com/Ajaydeep123/medical-shop/assets/49810031/2c6600f8-1529-444d-8eb0-6a614319cb4c)
#### All the Product Nodes
![Screenshot 2023-12-10 at 4 35 26 PM](https://github.com/Ajaydeep123/medical-shop/assets/49810031/3ee936f2-116f-4d41-bd4b-c46b1fd247a6)
#### Brand Nodes
![Screenshot 2023-12-10 at 4 36 21 PM](https://github.com/Ajaydeep123/medical-shop/assets/49810031/04188f6c-3cf1-4744-9c76-86ce8be09751)
#### Manufacturer Nodes
![Screenshot 2023-12-10 at 4 36 45 PM](https://github.com/Ajaydeep123/medical-shop/assets/49810031/821ddce3-1a5b-4580-9e51-c47645c11dae)




## References
- [Woocommerce REST api](https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#introduction)
- [Loading json to neo4j](https://neo4j.com/labs/apoc/4.1/import/load-json/)
- [Fundamentals of neo4j and cypher](https://graphacademy.neo4j.com/)
- [Bitnami docker image](https://hub.docker.com/r/bitnami/neo4j)
- [Docker docs](https://docs.docker.com/)
