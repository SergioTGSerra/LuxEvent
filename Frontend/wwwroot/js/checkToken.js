

// Função auxiliar para obter o valor de um cookie pelo nome
const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
};

const token = getCookie('token'); // Função auxiliar para obter o valor do cookie 'token'

if (!token) {
    // Não há um token, redirecione para a página de login ou execute outras ações apropriadas
    window.location.href = '/Login'; // Substitua '/login' pela URL da sua página de login.
}