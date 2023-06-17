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