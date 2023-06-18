function getRegistrationsActivities() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // URL do endpoint
    const url = 'http://localhost:5052/api/RegistrationsActivity';

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
                const activityCell = newRow.insertCell();
                const eventCell = newRow.insertCell();
                const actionsCell = newRow.insertCell();

                // Obter o nome do activity com base no ID
                axios
                    .get(`http://localhost:5052/api/Activities/${item.activityId}`, { headers })
                    .then(response => {
                        const activity = response.data;
                        activityCell.textContent = activity.name;
                    })
                    .catch(error => {
                        console.error('Error retrieving activity:', error);
                    });

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

                actionsCell.innerHTML = `<button class="btn btn-primary" onclick="deleteRegistrationActivity('${item.activityId}')">Unsubscribe</button>`;
            });
        })
        .catch(error => {
            // Em caso de erro, você pode lidar com o erro retornado
            console.error(error);
        });
}

async function RegistrationActivity() {
    const activity = document.getElementById('activity').value;

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await axios.post('http://localhost:5052/api/RegistrationsActivity', {
            activityId: activity
        }, { headers });

        console.log('Registration Activity criada com sucesso:', response.data);

        // Fechar o modal
        const modal = document.getElementById('registrationActivityModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    } catch (error) {
        console.error('Erro ao criar Registration Event:', error);
        alert("Precisa de se inscrever no evento primeiro.");
    }
    getRegistrationsActivities()
}

async function deleteRegistrationActivity(activityId) {
    try {
        const confirmation = confirm("Deseja sair do activity?");

        if (!confirmation) {
            return;
        }

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/RegistrationsActivity/${activityId}`;

        const response = await axios.delete(url, { headers });

        console.log('Saiu com sucesso:', response.data);

    } catch (error) {
        console.error('Erro ao sair da activity:', error);
        alert("Não tem permissões suficientes para executar esta operação.");
    }
    getRegistrationsActivities()
}

function openAddRegistrationActivity() {
    const activityDropdown = document.getElementById("activity");
    activityDropdown.innerHTML = "";
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

            // Obter o evento selecionado por defeito
            const selectedEventId = eventDropdown.value;

            axios.get("http://localhost:5052/api/Activities", { headers })
                .then(response => {
                    const activities = response.data;
                    activities.forEach(activity => {
                        if (activity.eventId === selectedEventId) {
                            const option = document.createElement("option");
                            option.value = activity.id;
                            option.text = activity.name;
                            activityDropdown.appendChild(option);
                        }
                    });
                })
                .catch(error => {
                    console.error("Error while fetching activities:", error);
                });
        })
        .catch(error => {
            console.error("Error while fetching events:", error);
        });

    eventDropdown.addEventListener("change", () => {
        const selectedEventId = eventDropdown.value;

        axios.get("http://localhost:5052/api/Activities", { headers })
            .then(response => {
                activityDropdown.innerHTML = "";
                const activities = response.data;
                activities.forEach(activity => {
                    if (activity.eventId === selectedEventId) {
                        const option = document.createElement("option");
                        option.value = activity.id;
                        option.text = activity.name;
                        activityDropdown.appendChild(option);
                    }
                });
            })
            .catch(error => {
                console.error("Error while fetching activities:", error);
            });
    });
    
    var addEventModal = new bootstrap.Modal(document.getElementById('registrationActivityModal'));
    addEventModal.show();
}
