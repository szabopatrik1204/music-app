FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive
ARG DEPLOY_USER=deploy

RUN apt-get update && apt-get install -y \
    openssh-server \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    sudo \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/run/sshd

RUN groupadd -r ${DEPLOY_USER} && useradd -r -m -g ${DEPLOY_USER} ${DEPLOY_USER} \
    && mkdir -p /home/${DEPLOY_USER}/.ssh \
    && chown -R ${DEPLOY_USER}:${DEPLOY_USER} /home/${DEPLOY_USER} \
    && chmod 700 /home/${DEPLOY_USER}/.ssh

RUN echo "${DEPLOY_USER} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy && chmod 440 /etc/sudoers.d/deploy

RUN DOCKER_CLI_VERSION="24.0.5" \
    && curl -fsSL "https://download.docker.com/linux/static/stable/$(uname -m)/docker-${DOCKER_CLI_VERSION}.tgz" \
        -o /tmp/docker.tgz \
    && tar -xzf /tmp/docker.tgz -C /usr/local/bin --strip-components=1 docker/docker \
    && rm /tmp/docker.tgz \
    && chmod +x /usr/local/bin/docker

RUN apt-get update && apt-get install -y unzip && rm -rf /var/lib/apt/lists/* \
    && DOCKER_COMPOSE_VERSION="v2.20.2" \
    && mkdir -p /usr/local/libexec/docker/cli-plugins \
    && curl -fsSL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/libexec/docker/cli-plugins/docker-compose \
    && chmod +x /usr/local/libexec/docker/cli-plugins/docker-compose

RUN mkdir /workspace && chown ${DEPLOY_USER}:${DEPLOY_USER} /workspace
WORKDIR /workspace

EXPOSE 22

COPY start-deploy.sh /usr/local/bin/start-deploy.sh
RUN chmod +x /usr/local/bin/start-deploy.sh

USER ${DEPLOY_USER}

ENTRYPOINT ["/usr/local/bin/start-deploy.sh"]