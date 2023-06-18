function getTotalParticipantsCount() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // URL do endpoint
    const url = 'http://localhost:5052/api/EventReports/total-participants-count';

    // Encontre o elemento de texto do primeiro card
    const totalParticipantsCard = document.querySelector('.card-text');

    // Fazendo a solicitação GET usando Axios
    axios
        .get(url, { headers })
        .then(response => {
            // Define o número total de inscrições no HTML
            totalParticipantsCard.textContent = `${response.data}`;
            console.log(response.data)
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

function getTopEvents() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const table = document.querySelector('.table');

    const tableRows = table.querySelectorAll('tr');

    // Começa a remoção a partir do segundo elemento (índice 1)
    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].remove();
    }

    axios.get("http://localhost:5052/api/EventReports/most-popular-events", { headers })
        .then(response => {
            response.data.forEach(event => {
                const newRow = table.insertRow();
                const nameCell = newRow.insertCell();
                nameCell.textContent = event.name;
            });
            
        })
        .catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
}

function getCategoriesAndEventCounts() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const categoryTable = document.getElementById('category-table');
    const tableBody = categoryTable.querySelector('tbody');

    // Limpa as linhas da tabela antes de popular novamente
    tableBody.innerHTML = '';

    // Obtém todas as categorias
    axios.get('http://localhost:5052/api/Categories', { headers })
        .then(response => {
            const categories = response.data;

            // Para cada categoria, obter o número de eventos por categoria
            categories.forEach(category => {
                axios.get(`http://localhost:5052/api/EventReports/event-count-by-category/${category.id}`, { headers })
                    .then(eventCountResponse => {
                        const newRow = tableBody.insertRow();
                        const categoryCell = newRow.insertCell();
                        const eventCountCell = newRow.insertCell();

                        categoryCell.textContent = category.name;
                        eventCountCell.textContent = eventCountResponse.data;
                    })
                    .catch(error => {
                        if (error.response.status === 401 || error.response.status === 403) {
                            alert("Não tem permissões para aceder a este recurso.");
                        } else {
                            alert(error.response.data.message);
                        }
                    });
            });
        })
        .catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
}

function getMyEvents() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };
    
    fetch('http://localhost:5052/api/Events/LoggedUser', { headers })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('my-events-table').getElementsByTagName('tbody')[0];

            data.forEach(event => {
                const row = tableBody.insertRow();
                const eventNameCell = row.insertCell();
                const detailsCell = row.insertCell();

                eventNameCell.innerHTML = event.name;
                detailsCell.innerHTML = `<button class="btn btn-primary" onclick="showEventDetails('${event.id}')">Details</button>`;
            });
        })
        .catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
}

function showEventDetails(eventId) {
    // Faz uma solicitação GET para obter os detalhes do evento
    const eventUrl = `http://localhost:5052/api/Events/${eventId}`;
    axios.get(eventUrl)
        .then(response => {
            const event = response.data;

            // Obtém os usuários registrados para o evento
            const registeredUsersUrl = `http://localhost:5052/api/Events/${eventId}/RegisteredUsers`;
            axios.get(registeredUsersUrl)
                .then(response => {
                    const registeredUsers = response.data;

                    // Preenche o modal com os detalhes do evento e a lista de usuários registrados
                    // ...

                    // Abre o modal de edição usando o Bootstrap
                    const modal = new bootstrap.Modal(EventDetailsModal);
                    modal.show();
                })
                .catch(error => {
                    if (error.response.status === 401 || error.response.status === 403) {
                        alert("Não tem permissões para aceder a este recurso.");
                    } else {
                        alert(error.response.data.message);
                    }
                });
        })
        .catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
}