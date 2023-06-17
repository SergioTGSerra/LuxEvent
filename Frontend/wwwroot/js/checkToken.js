function checkToken() {
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
    const currentPage = window.location.pathname; // Obtém o caminho da URL atual
    
    if(currentPage === '/Register' || currentPage === '/register'){
        return null
    }

    if (!token) {
        // Não há um token e a página atual não é a página de registro, redirecione para a página de login ou execute outras ações apropriadas
        window.location.href = '/Login'; // Substitua '/login' pela URL da sua página de login.
    }
}