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
    