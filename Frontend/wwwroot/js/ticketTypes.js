function getTicketTypes() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // URL do endpoint
    const url = 'http://localhost:5052/api/TicketTypes';

    // Seleciona a tabela no DOM
    const table = document.querySelector('.table');

    const tableRows = table.querySelectorAll('tr');

    // Começa a remoção a partir do segundo elemento (índice 1)
    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].remove();
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
                actionsCell.innerHTML = `<button class="btn btn-primary" onclick="openEditModalTicketType('${item.id}', '${item.name}')">Editar</button><button class="btn btn-danger" onclick="deleteTicketType('${item.id}')">Excluir</button>`;
            });
        })
        .catch(error => {
            // Em caso de erro, você pode lidar com o erro retornado
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
}

async function createTicketType() {
    const ticketTypeName = document.getElementById('ticketTypeNameInput').value;

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await axios.post('http://localhost:5052/api/TicketTypes', {
            name: ticketTypeName
        }, { headers });

        console.log('Tipo de ingresso criado com sucesso:', response.data);

        // Fechar o modal
        const modal = document.getElementById('exampleModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        // Atualizar a tabela
        getTicketTypes();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
}

async function deleteTicketType(ticketTypeId) {
    try {
        const confirmation = confirm('Tem certeza que deseja apagar este tipo de ingresso?');

        if (!confirmation) {
            return;
        }

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/TicketTypes/${ticketTypeId}`;

        const response = await axios.delete(url, { headers });

        console.log('Tipo de ingresso apagado com sucesso:', response.data);

        // Atualizar a tabela
        getTicketTypes();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
}

async function updateTicketType() {
    // Obtenha o ID do tipo de ingresso e o novo nome do modal de edição
    const ticketTypeId = document.getElementById('editTicketTypeModal').getAttribute('data-ticket-type-id');
    const updatedName = document.getElementById('editTicketTypeNameInput').value;

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        // Crie os dados da requisição
        const data = {
            id: ticketTypeId,
            name: updatedName
        };

        // Faça a requisição PUT para atualizar o tipo de ingresso
        const response = await axios.put(`http://localhost:5052/api/TicketTypes/${ticketTypeId}`, data, { headers });

        alert('Tipo de ingresso atualizado com sucesso!');

        // Feche o modal de edição
        const editModal = document.getElementById('editTicketTypeModal');
        const modalInstance = bootstrap.Modal.getInstance(editModal);
        modalInstance.hide();

        // Atualize a tabela de tipos de ingresso
        getTicketTypes();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
}

function openEditModalTicketType(ticketTypeId, ticketTypeName) {
    // Defina o valor do input da modal de edição com o nome do tipo de ingresso
    const editTicketTypeNameInput = document.getElementById('editTicketTypeNameInput');
    editTicketTypeNameInput.value = ticketTypeName;

    // Defina o atributo "data-ticket-type-id" na modal de edição com o ID do tipo de ingresso
    const editModal = document.getElementById('editTicketTypeModal');
    editModal.setAttribute('data-ticket-type-id', ticketTypeId);

    // Abra a modal de edição usando o Bootstrap
    const modal = new bootstrap.Modal(editModal);
    modal.show();
}
