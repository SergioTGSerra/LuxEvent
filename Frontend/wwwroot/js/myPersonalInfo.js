function getMyInfo() {
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    var userId = getUID();

    // URL do endpoint
    const url = `http://localhost:5052/api/Users/${userId}`;

    // Fazendo a solicitação GET usando Axios
    axios.get(url, { headers })
        .then(response => {
            const user = response.data;

            // Preenche o formulário com as informações do usuário
            document.getElementById('name').value = user.name;
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
            document.getElementById('userType').value = user.userType;
        })
        .catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
}

function updateMyInfo() {
    var userId = getUID();
    // Obtenha o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Configuração do cabeçalho para incluir o token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // Obtenha os valores atualizados dos campos do formulário
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const userType = document.getElementById('userType').value;

    // URL do endpoint para atualização
    const url = `http://localhost:5052/api/Users/${userId}`;

    // Dados a serem enviados no corpo da solicitação PUT
    const updatedData = {
        id: userId,
        name: name,
        username: username,
        email: email,
        userType: userType
    };

    // Fazendo a solicitação PUT usando Axios e incluindo o token no cabeçalho
    axios.put(url, updatedData, { headers })
        .then(response => {
            alert('Utilizador atualizado com sucesso.');
        })
        .catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
}
