//Importa a biblioteca gRPC para criar o arquivo .proto
const grpc = require('@grpc/grpc-js');

//Importa a biblioteca para cerrgar o arquivo .proto
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

//Carrega e processa o arquivo shipping.proto, que define o serviço e as mensagens
const packageDefinition = protoLoader.loadSync('proto/inventory.proto', {
  keepCase: true, //Mantém os nomes dos campos como estão no .proto
  longs: String, //Converte tipos longos para String
  enums: String, //Converte enums para String
  defaults: true, //Interpreta campos repeated como arrays
});

// Carrega a definição do pacote gRPC para criar objetos que representam os serviços e mensagens do .proto
const grpcObject = grpc.loadPackageDefinition(packageDefinition);

//Cria uma instância do serviço InventoryService com base na definição carregada
const InventoryService = grpcObject.InventoryService;

//Cria um cliente gRPC para o serviço de inventário, apontando para o endereço onde o serviço está rodando
const client = new InventoryService('127.0.0.1:3002', grpc.credentials.createInsecure());

//Exporta o cliente para que possa ser usado em outras partes da aplicação
module.exports = client;

