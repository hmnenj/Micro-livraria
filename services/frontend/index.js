//Função para criar e retornar um elemento HTML representando um produto
function newBook(book) {
    //Cria uma div para o livro e adiciona a classe de coluna
    const div = document.createElement('div');
    div.className = 'column is-4';

    //Define o conteúdo HTML interno da div com os dados do livro
    div.innerHTML = `
    <div class="card is-shady">
        <div class="card-image">
            <figure class="image is-3by2">
                <img
                     src="${book.photo}"
                     alt="${book.name}" 
                     class="modal-button"
                />
            </figure>
        </div>

        <div class="card-content">
            <div class="content book" data-id="${book.id}"> 
                <div class="book-meta">
                    <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                    <p class="is-size-6"> Disponível em estoque: ${book.quantity}</p> 
                    <h4 class="is-size-3 tittle">${book.name}</h4> 
                    <p class="subtitle">${book.author}</p> 
                </div>

                <div class="field has-addons>
                    <div class="control">
                        <input class="input" type="text" placeholder="Digite o CEP"/>
                    </div>

                    <div class="control">
                        <a class="button button-shipping is-primary" data-id="${book.id}"> Calcular Frete </a>
                    </div>
                </div>

                <button class="button button-buy is-fullwidth">Comprar</button>

            </div>
        </div>
    </div>`;

    //Retorna o elemento montado
    return div;
}

//Função para calcular o frete com base no ID do livro e no CEP
function calculateShipping(id, cep) {
    fetch(`http://localhost:3000/shipping/${cep}`) //Faz requisição para a API de frete
        .then((data) => {
            if (data.ok) {
                return data.json(); //Converte a resposta para JSON se estiver ok
            }
            throw data.json(); //Caso contrário, lança erro
        })
        .then((data) => {
            //Mostra o valor do frete
            Swal.fire({
                title: 'Frete',
                text: `O frete é: R$${data.value.toFixed(2)}`,
                icon: 'success',
                confirmButtonColor: 'hsl(342, 100%, 90%)',
                color: 'hsl(342, 100%, 20%)'
            });
        })
        .catch((err) => {
            //Mostra erro se a requisição falhar
            Swal.fire({
                title: 'Erro',
                text: 'Erro ao consultar frete',
                icon: 'error',
                confirmButtonColor: 'hsl(342, 100%, 90%)',
                color: 'hsl(342, 100%, 20%)'
            });
            console.log(err);
        });
}

//Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function () {
    const books = document.querySelector('.books'); //Seleciona o container onde os livros serão exibidos

    //Busca os produtos (livros) do servidor
    fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json(); //Converte a resposta para JSON se estiver ok
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                //Para cada livro, cria e adiciona o elemento ao container
                data.forEach((book) => {
                    books.appendChild(newBook(book));
                });

                //Adiciona evento de clique aos botões de calcular frete
                document.querySelectorAll('.button-shipping').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id'); // Pega o ID do livro
                        const cep = document.querySelector(`.book[data-id="${id}"] input`).value; //Pega o CEP digitado
                        calculateShipping(id, cep); //Chama a função de frete
                    });
                });

                //Adiciona evento de clique aos botões de compra
                document.querySelectorAll('.button-buy').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        Swal.fire({
                            title: 'Compra de livro',
                            text: 'Sua compra foi realizada com sucesso',
                            icon: 'success',
                            confirmButtonColor: 'hsl(342, 100%, 90%)',
                            color: 'hsl(342, 100%, 20%)'
                        });
                    });
                });
            }
        })

        .catch((err) => {
            //Em caso de erro ao carregar os produtos
            Swal.fire({
                title: 'Erro',
                text: 'Erro ao listar os produtos',
                icon: 'error',
                confirmButtonColor: 'hsl(342, 100%, 90%)',
                color: 'hsl(342, 100%, 20%)'
            });
            console.log(err);
        });
});

function searchBook() {
const id = document.getElementById('bookId').value;

    if (!id) {
        Swal.fire({
            title: 'Erro',
            text: 'Digite um ID válido!',
            icon: 'warning',
            confirmButtonColor: 'hsl(342, 100%, 90%)',
            color: 'hsl(342, 100%, 20%)'
        });
        return;
    }

    fetch(`http://localhost:3000/product/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Livro não encontrado');
            }
            return response.json();
        })
        .then(book => {
            Swal.fire({
                title: 'Livro encontrado',
                html: `
                Nome: ${book.name} <br>
                Autor: ${book.author} <br>
                Preço: R$${book.price.toFixed(2)} <br>
                Estoque: ${book.quantity}
                `,
                icon: 'success',
                confirmButtonColor: 'hsl(342, 100%, 90%)',
                color: 'hsl(342, 100%, 20%)'
            });
        })
        .catch(error => {
            console.error(error);
            Swal.fire({
                title: 'Erro',
                text: 'Livro não encontrado',
                icon: 'error',
                confirmButtonColor: 'hsl(342, 100%, 90%)',
                color: 'hsl(342, 100%, 20%)'
            });

        });
}
