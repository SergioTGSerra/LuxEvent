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
            console.error(error);
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
            console.error('Error fetching events:', error);
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
                        console.error('Error fetching event count:', error);
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}