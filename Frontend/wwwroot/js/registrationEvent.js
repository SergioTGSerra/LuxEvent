function getRegistrationsEvents() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // URL do endpoint
    const url = 'http://localhost:5052/api/RegistrationsEvent';

    // Seleciona a tabela no DOM
    const table = document.querySelector('.table');
    const tableRows = table.querySelectorAll('tr');

    // Começa a remoção a partir do segundo elemento (índice 1)
    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].remove();
    }

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
                const eventCell = newRow.insertCell();
                const actionsCell = newRow.insertCell();

                // Obter o nome do evento com base no ID
                axios
                    .get(`http://localhost:5052/api/Events/${item.eventId}`, { headers })
                    .then(response => {
                        const event = response.data;
                        eventCell.textContent = event.name;
                    })
                    .catch(error => {
                        if (error.response.status === 401 || error.response.status === 403) {
                            alert("Não tem permissões para aceder a este recurso.");
                        } else {
                            alert(error.response.data.message);
                        }
                    });

                actionsCell.innerHTML = `<button class="btn btn-primary" onclick="deleteRegistrationEvent('${item.eventId}')">Unsubscribe</button>`;
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

async function RegistrationEvent() {
    const event = document.getElementById('event').value;

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await axios.post('http://localhost:5052/api/RegistrationsEvent', {
            eventId: event
        }, { headers });

        console.log('Registration Event criada com sucesso:', response.data);

        // Fechar o modal
        const modal = document.getElementById('registrationEventModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
    getRegistrationsEvents()
}

async function deleteRegistrationEvent(eventId) {
    try {
        const confirmation = confirm("Deseja sair do evento?");

        if (!confirmation) {
            return;
        }

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/RegistrationsEvent/${eventId}`;

        const response = await axios.delete(url, { headers });

        console.log('Saiu com sucesso:', response.data);

    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
    getRegistrationsEvents()
}

function openAddRegistrationEvent() {
    const eventDropdown = document.getElementById("event");
    eventDropdown.innerHTML = "";


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
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
    var addEventModal = new bootstrap.Modal(document.getElementById('registrationEventModal'));
    addEventModal.show();
}
