# chatbot-cdc

## Pré-Requisitos:

- Arquitetura x64
- Java 8 (1.8.0+)
- NodeJs 6.11 +

Obs:
> A minimum of 3GB RAM assigned to Docker Elasticsearch alone needs at least 2GB of RAM to run.

## Instalação:

#### Ubuntu:

###### Java JDK 8:
```
sudo apt-update
sudo apt-get install openjdk-8-jdk
```

###### Node 6.X:
```
apt-get installcurl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

###### Git:
```
git clone https://github.com/terciodejesus/chatbot-cdc`
```

## Executando o servidor-aplicação

###### Pra começar a rodar os servidores (elasticsearch e o website) digite o comando:

`npm start`

###### Para testar a aplicação abra o navegador e acesse o link:

`http://localhost:3000`
