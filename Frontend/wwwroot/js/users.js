function getUsers() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // URL do endpoint
    const url = 'http://localhost:5052/api/Users';

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

                // Cria as células para cada campo
                const nameCell = newRow.insertCell();
                const usernameCell = newRow.insertCell();
                const emailCell = newRow.insertCell();
                const userTypeCell = newRow.insertCell();
                const actionsCell = newRow.insertCell();

                // Define o conteúdo das células
                nameCell.textContent = item.name;
                usernameCell.textContent = item.username;
                emailCell.textContent = item.email;
                userTypeCell.textContent = item.userType;
                actionsCell.innerHTML = `<button class="btn btn-primary" onclick="openEditModalUser('${item.id}', '${item.name}', '${item.username}', '${item.email}', '${item.userType}')">Editar</button><button class="btn btn-danger" onclick="deleteUser('${item.id}')">Excluir</button>`;
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

async function createUser() {
    const userName = document.getElementById('userNameInput').value;
    const userUsername = document.getElementById('userUsernameInput').value;
    const userPassword = document.getElementById('userPasswordInput').value;
    const userEmail = document.getElementById('userEmailInput').value;
    //UserType
    const inputValue = document.getElementById('userTypeInput').value;
    const updatedUserType = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await axios.post('http://localhost:5052/api/Users', {
            name: userName,
            username: userUsername,
            password: userPassword,
            email: userEmail,
            userType: updatedUserType
        }, { headers });

        console.log('Usuário criado com sucesso:', response.data);

        // Atualizar a tabela de usuários
        getUsers();

        // Fechar o modal
        const modal = document.getElementById('exampleModal');
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

async function deleteUser(userId) {
    try {
        const confirmation = confirm('Tem certeza que deseja apagar este usuário?');

        if (!confirmation) {
            return;
        }

        // Obtenha o token do cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

        // Configuração do cabeçalho para incluir o token
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/Users/${userId}`;

        const response = await axios.delete(url, { headers });

        console.log('Usuário excluído com sucesso:', response.data);

        // Atualizar a tabela de usuários
        getUsers();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
}

async function updateUser() {
    // Obtenha o ID do usuário e os valores atualizados dos campos na modal
    const userId = document.getElementById('editUserModal').getAttribute('data-user-id');
    const updatedName = document.getElementById('editUserNameInput').value;
    const updatedUsername = document.getElementById('editUserUsernameInput').value;
    const updatedEmail = document.getElementById('editUserEmailInput').value;
    //UserType
    const inputValue = document.getElementById('editUserTypeInput').value;
    const updatedUserType = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        // Crie os dados da requisição
        const data = {
            id: userId,
            name: updatedName,
            username: updatedUsername,
            email: updatedEmail,
            userType: updatedUserType
        };

        // Faça a requisição PUT para atualizar o usuário
        const response = await axios.put(`http://localhost:5052/api/Users/${userId}`, data, { headers });

        alert('Usuário atualizado com sucesso!');

        // Feche a modal de edição
        const editModal = document.getElementById('editUserModal');
        const modalInstance = bootstrap.Modal.getInstance(editModal);
        modalInstance.hide();

        // Atualize a tabela de usuários
        getUsers();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
}

function openEditModalUser(userId, userName, userUsername, userEmail, userUserType) {
    // Defina o valor dos campos na modal de edição
    const editUserNameInput = document.getElementById('editUserNameInput');
    const editUserUsernameInput = document.getElementById('editUserUsernameInput');
    const editUserEmailInput = document.getElementById('editUserEmailInput');
    const editUserTypeInput = document.getElementById('editUserTypeInput');

    editUserNameInput.value = userName;
    editUserUsernameInput.value = userUsername;
    editUserEmailInput.value = userEmail;
    editUserTypeInput.value = userUserType;

    // Defina o atributo "data-user-id" na modal de edição com o ID do usuário
    const editModal = document.getElementById('editUserModal');
    editModal.setAttribute('data-user-id', userId);

    // Abra a modal de edição usando o Bootstrap
    const modal = new bootstrap.Modal(editModal);
    modal.show();
}
