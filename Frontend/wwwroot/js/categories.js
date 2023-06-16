function getCategories() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // URL do endpoint
    const url = 'http://localhost:5052/api/Category';

    // Seleciona a tabela no DOM
    const table = document.querySelector('.table');

    // Limpar os dados da tabela (remover todas as linhas)
    while (table.tBodies[0].firstChild) {
        table.tBodies[0].firstChild.remove();
    }

    // Fazendo a solicitação GET usando Axios
    axios.get(url, { headers })
        .then(response => {
            const data = response.data;

            // Percorre os dados retornados
            data.forEach(item => {
                // Cria uma nova linha na tabela
                const newRow = table.insertRow();

                // Cria as células para as colunas "Name" e "Actions"
                const nameCell = newRow.insertCell();
                const actionsCell = newRow.insertCell();

                // Define o conteúdo das células
                nameCell.textContent = item.name;
                actionsCell.innerHTML = '<button onclick="openEditModal(\'' + item.id + '\')" >Editar</button><button onclick="deleteCategory(\'' + item.id + '\')" >Excluir</button>';
            });
        })
        .catch(error => {
            // Em caso de erro, você pode lidar com o erro retornado
            console.error(error);
        });
}


async function CreateCategory() {
    const categoryName = document.getElementById('categoryNameInput').value;

    try {
        const response = await axios.post('http://localhost:5052/api/Category', {
            name: categoryName
        });

        console.log('Categoria criada com sucesso:', response.data);

        getCategories()

        // Fechar o modal
        const modal = document.getElementById('exampleModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        alert("Erro ao criar categoria")
    }
}

async function deleteCategory(categoryId) {
    try {
        const confirmation = confirm("Tem certeza que deseja apagar esta categoria?");

        if (!confirmation) {
            return;
        }

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/Category/${categoryId}`;

        const response = await axios.delete(url, { headers });

        console.log('Categoria apagada com sucesso:', response.data);

        // Atualizar a tabela ou realizar outras ações necessárias após a exclusão da categoria
        getCategories()

    } catch (error) {
        console.error('Erro ao apagar categoria:', error);
        alert("Erro ao apagar categoria");
    }
}

function updateCategory(){
    alert("teste")
}