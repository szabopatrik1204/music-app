# music-app-devops

**JENKINS** 
cd devops

sudo docker build -t my-jenkins -f Dockerfile_jenkins .

mkdir -p jenkins_home

sudo docker run -it --rm \
  --name my-jenkins \
  --network devops_default \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  my-jenkins

