const express = require('express');
const cors = require('cors');
const path = require('path');


// Importações corretas dos serviços gRPC
const shipping = require('./shipping');
const inventory = require('./inventory');

const app = express();

// Habilita CORS para permitir requisições do frontend
app.use(cors());

// Serve arquivos estáticos da interface (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota inicial: pode mostrar uma mensagem ou carregar o index.html automaticamente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Rota para retornar todos os produtos
app.get('/products', (req, res) => {
  inventory.searchAllProducts(null, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Algo falhou' });
    } else {
      res.json(data.products);
    }
  });
});

// Rota para consultar o frete com base no CEP
app.get('/shipping/:cep', (req, res) => {
  shipping.GetShippingRate({ cep: req.params.cep }, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Algo falhou' });
    } else {
      res.json({
        cep: req.params.cep,
        value: data.value,
      });
    }
  });
});

app.get('/product/:id', (req, res, next) => {
  // Chama método do microsserviço.
  inventory.SearchProductByID({ id: req.params.id }, (err, product) => {
    // Se ocorrer algum erro de comunicação
    // com o microsserviço, retorna para o navegador.
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'something failed :(' });
    } else {
      // Caso contrário, retorna resultado do
      // microsserviço (um arquivo JSON) com os dados
      // do produto pesquisado
      res.json(product);
    }
  });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Serviço de Controller rodando em http://127.0.0.1:3000');
});
