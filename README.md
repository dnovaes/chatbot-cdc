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
1. sudo add-apt-repository ppa:openjdk-r/ppa
2. sudo apt-get update
3. sudo apt-get install openjdk-8-jdk
```

###### Node 6.X:
```
sudo apt-get install curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

###### Git:
```
git clone https://github.com/terciodejesus/chatbot-cdc
cd chatbot-cdc/website
npm install
```

## Executando a aplicação

###### Pra começar a rodar aplicação, vá para pasta 'website' do sistema e digite o comandos:

```
npm start
```

###### Para testar a aplicação abra o navegador e acesse o link:

`http://localhost:3000`

## Links:

Documentos com desenvolvimento do projeto: (requisitos, testes, arquitetura..):<br>
http://goo.gl/5bSDbb

Acesso a aplicação externamente:</br>
https://blooming-eyrie-81507.herokuapp.com
