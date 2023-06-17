function getActivities() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // URL do endpoint
    const url = 'http://localhost:5052/api/Activities';

    // Seleciona a tabela no DOM
    const table = document.querySelector('.table');

    // Fazendo a solicitação GET usando Axios
    axios
        .get(url, { headers })
        .then(response => {
            const data = response.data;

            // Percorre os dados retornados
            data.forEach(item => {
                // Cria uma nova linha na tabela
                const newRow = table.insertRow();

                // Cria as células para as colunas "Name" e "Actions"
                const nameCell = newRow.insertCell();
                const descriptionCell = newRow.insertCell();
                const eventCell = newRow.insertCell();
                const actionsCell = newRow.insertCell();

                // Define o conteúdo das células
                nameCell.textContent = item.name;
                descriptionCell.textContent = item.description;

                // Obter o nome do evento com base no ID
                axios
                    .get(`http://localhost:5052/api/Events/${item.eventId}`, { headers })
                    .then(response => {
                        const event = response.data;
                        eventCell.textContent = event.name;
                    })
                    .catch(error => {
                        console.error('Error retrieving event:', error);
                    });

                actionsCell.innerHTML = `<button class="btn btn-primary" onclick="openEditModalActivity('${item.id}', '${item.name}', '${item.description}')">Editar</button><button class="btn btn-danger" onclick="deleteActivity('${item.id}')">Excluir</button>`;
            });
        })
        .catch(error => {
            // Em caso de erro, você pode lidar com o erro retornado
            console.error(error);
        });
}

async function CreateActivity() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const event = document.getElementById('event').value;

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await axios.post('http://localhost:5052/api/Activities', {
            name: name,
            description: description,
            eventId: event
        }, { headers });

        console.log('Activity criada com sucesso:', response.data);

        getCategories();

        // Fechar o modal
        const modal = document.getElementById('exampleModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    } catch (error) {
        console.error('Erro ao criar Activity:', error);
        alert("Erro ao criar Activity");
    }
    location.reload();
}

async function deleteActivity(activityId) {
    try {
        const confirmation = confirm("Tem certeza que deseja apagar esta activity?");

        if (!confirmation) {
            return;
        }

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/Activities/${activityId}`;

        const response = await axios.delete(url, { headers });

        console.log('Activity apagada com sucesso:', response.data);

    } catch (error) {
        console.error('Erro ao apagar Activity:', error);
        alert("Erro ao apagar Activity");
    }
    location.reload();
}

async function updateActivity() {
    const activityId = document.getElementById('editActivityModal').getAttribute('data-activity-id');
    const updatedName = document.getElementById('nameEdit').value;
    const updatedDescription = document.getElementById('descriptionEdit').value;
    const updatedEvent = document.getElementById('eventEdit').value;

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await axios.put(`http://localhost:5052/api/Activities/${activityId}`, {
            id: activityId,
            name: updatedName,
            description: updatedDescription,
            eventId: updatedEvent
        }, { headers });

        console.log('Activity atualizada com sucesso:', response.data);

        // Fechar o modal
        const modal = document.getElementById('editActivityModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        // Atualizar a tabela de atividades
        getActivities();
    } catch (error) {
        console.error('Erro ao atualizar Activity:', error);
        alert("Erro ao atualizar Activity");
    }
    location.reload();
}

function openEditModalActivity(activityId, name, description) {
    // Define o valor dos campos da modal de edição com os dados da atividade
    const editNameInput = document.getElementById('nameEdit');
    const editDescriptionInput = document.getElementById('descriptionEdit');
    const editEventDropdown = document.getElementById('eventEdit');

    editNameInput.value = name;
    editDescriptionInput.value = description;

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // Obtenha o evento atual da atividade
    const eventDropdown = document.getElementById("eventEdit");
    axios.get("http://localhost:5052/api/Events", { headers })
        .then(response => {
            const events = response.data;
            events.forEach(event => {
                const option = document.createElement("option");
                option.value = event.id;
                option.text = event.name;
                eventDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error while fetching events:", error);
        });

    // Define o atributo "data-activity-id" na modal de edição com o ID da atividade
    const editModal = document.getElementById('editActivityModal');
    editModal.setAttribute('data-activity-id', activityId);

    // Abre a modal de edição usando o Bootstrap
    const modal = new bootstrap.Modal(editModal);
    modal.show();
}

function openAddActivityModal() {
    const eventDropdown = document.getElementById("event");

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    axios.get("http://localhost:5052/api/Events", { headers })
        .then(response => {
            const events = response.data;
            events.forEach(event => {
                const option = document.createElement("option");
                option.value = event.id;
                option.text = event.name;
                eventDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error while fetching events:", error);
        });
    var addEventModal = new bootstrap.Modal(document.getElementById('addEventModal'));
    addEventModal.show();
}
