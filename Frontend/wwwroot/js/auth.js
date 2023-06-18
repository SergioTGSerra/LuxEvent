async function Login(event) {
    event.preventDefault();
    try {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value

        const response = await axios.post('http://localhost:5052/api/Auth/token', {
            username: username,
            password: password
        });

        // Se a resposta do servidor for bem-sucedida, você pode acessar o token de autenticação da seguinte forma:
        const token = response.data.token;
        console.log('Token de autenticação:', token);

        // Armazene o token em um cookie
        document.cookie = `token=${token}; path=/`;

        // Redirecione para a dashboard
        window.location.href = '/'; // Substitua '/dashboard' pela URL da sua página de dashboard.

    } catch (error) {
        console.error('Erro ao autenticar:', error);
        alert("Username ou password errados!")
        // Lide com o erro de autenticação aqui.
    }

}

function RegisterUser(){
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio do formulário

        // Obtém os valores dos campos do formulário
        const username = document.getElementById('username').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Cria um objeto com os dados do formulário
        const formData = {
            username: username,
            name: name,
            email: email,
            password: password,
            userType: "user"
        };

        // Envia a solicitação usando o Axios
        axios.post('http://localhost:5052/api/Users', formData)
            .then(function (response) {
                alert("Utilizador registado com sucesso.")
                window.location.href = '/Login';
            })
            .catch(function (error) {
                alert("Erro ao registar utilizador.")
            });
    });
}

function Logout() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/Login';
}

function getRole(){
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const [, payloadBase64] = token.split('.');

    const payloadJSON = atob(payloadBase64);
    const payload = JSON.parse(payloadJSON);

    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role;
}

function getUID(){
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const [, payloadBase64] = token.split('.');

    const payloadJSON = atob(payloadBase64);
    const payload = JSON.parse(payloadJSON);

    const role = payload['UserId'];
    return role;
}

function getUsername(){
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const [, payloadBase64] = token.split('.');

    const payloadJSON = atob(payloadBase64);
    const payload = JSON.parse(payloadJSON);

    const role = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    return role;
}