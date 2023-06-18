function getTickets() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const headers = {
        Authorization: `Bearer ${token}`
    };
    const url = 'http://localhost:5052/api/Tickets';
    const table = document.querySelector('.table');

    const tableRows = table.querySelectorAll('tr');

    // Começa a remoção a partir do segundo elemento (índice 1)
    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].remove();
    }

    axios.get(url, { headers })
        .then(response => {
            const data = response.data;

            // Percorre os dados retornados
            data.forEach(item => {
                const newRow = table.insertRow();
                const eventCell = newRow.insertCell();
                const ticketTypeCell = newRow.insertCell();
                const priceCell = newRow.insertCell();
                const actionsCell = newRow.insertCell();

                // Obtém o nome do evento com base no eventId
                axios.get(`http://localhost:5052/api/Events/${item.eventId}`, { headers })
                    .then(eventResponse => {
                        const eventName = eventResponse.data.name;
                        eventCell.textContent = eventName;
                    })
                    .catch(error => {
                        console.error(error);
                        eventCell.textContent = 'Erro ao obter o nome do evento';
                    });

                // Obtém o tipo do ticket com base no ticketTypeId
                axios.get(`http://localhost:5052/api/TicketTypes/${item.ticketTypeId}`, { headers })
                    .then(ticketTypeResponse => {
                        const ticketTypeName = ticketTypeResponse.data.name;
                        ticketTypeCell.textContent = ticketTypeName;
                    })
                    .catch(error => {
                        console.error(error);
                        ticketTypeCell.textContent = 'Erro ao obter o tipo do ticket';
                    });

                priceCell.textContent = item.price;
                actionsCell.innerHTML = `<button class="btn btn-primary" onclick="openEditModalTicket('${item.id}', '${item.eventId}', '${item.ticketTypeId}', '${item.price}')">Editar</button><button class="btn btn-danger" onclick="deleteTicket('${item.id}')">Excluir</button>`;
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

async function CreateTicket() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const event = document.getElementById('event').value;
    const ticketType = document.getElementById('ticketType').value;
    const price = document.getElementById('price').value;

    try {
        const response = await axios.post('http://localhost:5052/api/Tickets', {
            eventId: event,
            ticketTypeId: ticketType,
            price: price
        }, { headers });

        console.log('Ticket criado com sucesso:', response.data);

        getTickets();

        // Fechar o modal
        const modal = document.getElementById('ticketModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
}

async function deleteTicket(ticketId) {
    try {
        const confirmation = confirm("Tem certeza que deseja apagar este ticket?");

        if (!confirmation) {
            return;
        }

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/Tickets/${ticketId}`;

        const response = await axios.delete(url, { headers });

        console.log('Ticket apagado com sucesso:', response.data);

        // Atualizar a tabela ou realizar outras ações necessárias após a exclusão do ticket
        getTickets();

    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
}

async function UpdateTicket() {
    const ticketId = document.getElementById('ticketModalEdit').getAttribute('ticket-id');
    const eventId = document.getElementById('ticketModalEdit').getAttribute('event-id');
    const ticketTypeId = document.getElementById('ticketModalEdit').getAttribute('ticketType-id');
    const price = document.getElementById('priceEdit').value;

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await axios.put(`http://localhost:5052/api/Tickets/${ticketId}`, {
            id: ticketId,
            eventId: eventId,
            ticketTypeId: ticketTypeId,
            price: price
        }, { headers });

        console.log('Ticket atualizado com sucesso:', response.data);

        getTickets();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
}

function openAddTicketModal() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const eventDropdown = document.getElementById("event");
    eventDropdown.innerHTML = "";
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

    const ticketTypesDropdown = document.getElementById("ticketType");
    axios.get("http://localhost:5052/api/TicketTypes", { headers })
        .then(response => {
            const ticketTypes = response.data;
            ticketTypes.forEach(ticketType => {
                const option = document.createElement("option");
                option.value = ticketType.id;
                option.text = ticketType.name;
                ticketTypesDropdown.appendChild(option);
            });
        })
        .catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });

    var addTicketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
    addTicketModal.show();
}

function openEditModalTicket(ticketId, eventId, ticketType, price) {
    // Popula os campos do modal com os dados do ticket
    document.getElementById('priceEdit').value = price;

    // Define os atributos "data-event-id", "data-ticketType-id" e "data-ticket-id" no modal de edição
    const editModal = document.getElementById('ticketModalEdit');
    editModal.setAttribute('event-id', eventId);
    editModal.setAttribute('ticketType-id', ticketType);
    editModal.setAttribute('ticket-id', ticketId);

    // Abre o modal de edição usando o Bootstrap
    const modal = new bootstrap.Modal(editModal);
    modal.show();
}
