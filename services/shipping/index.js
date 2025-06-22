// Importa a biblioteca gRPC
const grpc = require('@grpc/grpc-js');

// Importa a biblioteca para carregar o arquivo .proto
const protoLoader = require('@grpc/proto-loader');

// Carrega e processa o arquivo shipping.proto
const packageDefinition = protoLoader.loadSync('proto/shipping.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

// Carrega o pacote com base na definição
const shippingProto = grpc.loadPackageDefinition(packageDefinition);

// Cria uma nova instância do servidor gRPC
const server = new grpc.Server();

// Adiciona o serviço ShippingService ao servidor
server.addService(shippingProto.ShippingService.service, {
    GetShippingRate: (_, callback) => {
        const shippingValue = Math.random() * 100 + 1;
        callback(null, {
            value: shippingValue,
        });
    },
});

// Inicia o servidor na porta 3001
server.bindAsync('0.0.0.0:3001', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Shipping Service running at http://127.0.0.1:3001');
});
