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
                actionsCell.innerHTML = '<button>Editar</button><button>Excluir</button>';
            });
        })
        .catch(error => {
            // Em caso de erro, você pode lidar com o erro retornado
            console.error(error);
        });
}

// Obtenha o token do cookie
const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

// Configuração do cabeçalho para incluir o token
const headers = {
    Authorization: `Bearer ${token}`
};