function getTickets() {
    
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // URL do endpoint
    const url = 'http://localhost:5052/api/Categories';

    // Seleciona a tabela no DOM
    const table = document.querySelector('.table');
    
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
                actionsCell.innerHTML = '<button class="btn btn-primary" onclick="openEditModalCategory(\'' + item.id + '\', \'' + item.name + '\')">Editar</button><button class="btn btn-danger" onclick="deleteCategory(\'' + item.id + '\')">Excluir</button>';
            });
        })
        .catch(error => {
            // Em caso de erro, você pode lidar com o erro retornado
            console.error(error);
        });
}

async function CreateTicket() {
    const categoryName = document.getElementById('categoryNameInput').value;

    try {
        const response = await axios.post('http://localhost:5052/api/Categories', {
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
    location.reload();
}

async function deleteTicket(ticketId) {
    try {
        const confirmation = confirm("Tem certeza que deseja apagar esta categoria?");

        if (!confirmation) {
            return;
        }

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/Categories/${ticketId}`;

        const response = await axios.delete(url, { headers });

        console.log('Categoria apagada com sucesso:', response.data);

        // Atualizar a tabela ou realizar outras ações necessárias após a exclusão da categoria
        getCategories()

    } catch (error) {
        console.error('Erro ao apagar categoria:', error);
        alert("Erro ao apagar categoria");
    }
    location.reload();

}