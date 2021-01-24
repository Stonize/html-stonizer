FROM node:14.10.1 As development

WORKDIR /app

ENV DOCKER_TAG 0.0.2

# Install chromium for puppeter
RUN apt-get update && \
    apt-get install -y libx11-xcb-dev && \
    apt-get install -y gconf-service libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
    libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
    libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
    libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxss1 libxtst6 libappindicator1 libnss3 libasound2 \
    libatk1.0-0 libc6 ca-certificates fonts-liberation lsb-release xdg-utils wget

COPY *.json /app/
RUN npm install

COPY src /app/src
RUN npm run build

CMD ["npm", "run", "start:prod"]
