FROM node:alpine
# define local dentro da maquina VM
WORKDIR /usr/app
# copia arquivo especifoc para o endereço acima
COPY package*.json ./
#executa esse comando
RUN npm install
#copia toda a pasta agora
COPY . .
EXPOSE 3000
CMD [ "npm","start" ]