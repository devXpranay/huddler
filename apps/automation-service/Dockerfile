FROM ultrafunk/undetected-chromedriver

WORKDIR /app

COPY package.json package-lock.json ./

RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g typescript && \
    npm install && \
    apt-get clean && \
    apt-get install -y google-chrome-stable fonts-liberation libnss3 libatk-bridge2.0-0 libxcomposite1 libasound2 libgbm1 libgtk-3-0 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN npm install ws

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]