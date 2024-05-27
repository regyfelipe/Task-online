 // Função para buscar o nome do usuário do servidor
 async function fetchUserName() {
    try {
        // Faz uma solicitação ao servidor para buscar o nome do usuário
        const response = await fetch('/getUserName');
        if (!response.ok) {
            throw new Error('Erro ao buscar o nome do usuário');
        }
        const data = await response.json();

        document.getElementById('user-name').textContent = data.nomeUsuario ;
    } catch (error) {
        console.error(error);
    }
}

window.addEventListener('load', fetchUserName);