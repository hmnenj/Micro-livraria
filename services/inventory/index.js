//Importa a biblioteca gRPC para node.js
const grpc = require('@grpc/grpc-js');

//Importa a biblioteca que carrega arquivos .proto (interface do serviço gRPC)
const protoLoader = require('@grpc/proto-loader');

//Importa a lista de produtos de um arquivo JSON local
const products = require('./products.json');

//Carrega a definiçao do protocolo gRPC do arquivo .proto
const packageDefinition = protoLoader.loadSync('proto/inventory.proto', {
    keepCase: true, //Mantém o estilo de case original do .proto
    longs: String, //Converte valores longos para strings
    enums: String, //Converte enums para strings
    arrays: true, //Garante que campos repetidos sejam arrays
});

//Constroi o objeto do pacote gRPC a partir da definição carregada
const inventoryProto = grpc.loadPackageDefinition(packageDefinition);

//Cria um novo servidor gRPC
const server = new grpc.Server();

//Registra o serviço InverntoryService no servidor, implementando seus métodos
server.addService(inventoryProto.InventoryService.service, {
    // Implementação de método searchAllProducts
    // Esse método ignora o request(_) e retorna a lista de produtos
    searchAllProducts: (_, callback) => {
        callback(null, {
            products: products, //Retorna todos os produtos carregados do JSON 
        });
    },
    SearchProductByID: (payload, callback) => {
        callback(
            null,
            products.find((product) => product.id == payload.request.id)
        );
    },
});

//Inicia o servidor gRPC na porta 3002 e exibe uma mensagem de status no console
server.bindAsync('127.0.0.1:3002', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Inventory Service running at http://127.0.0.1:3002');
});
