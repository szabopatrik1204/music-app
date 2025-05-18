# music-app

**DOCKER BUILD:** 
- sudo docker build -t mongo_db_6.0.9 .

**DOCKER RUN:**
- sudo docker run -p 6000:27017 -it --name mongo_container_6.0.9 -d mongo_db_6.0.9

**BACKEND**
- cd music-app\server

- npm install

**build backend**
- npm run build

**run backend**
- npm run start

**FRONTEND**
- cd music-app\client\my-first-project

- npm install

**build and run frontend**
- ng serve