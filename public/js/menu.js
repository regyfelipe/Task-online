
    function changeFill(element, iconId) {
        // Resetar a cor de todos os ícones para cinza
        document.querySelectorAll('.menu-item svg').forEach(svg => {
            svg.setAttribute('fill', '#ccc');
        });
        
        // Mudar a cor apenas do ícone selecionado para preto
        const svgIcon = element.querySelector('svg, img');
        svgIcon.setAttribute('fill', 'black');

        // Verificar se o ícone 2 foi selecionado e redirecionar para task.html
        if (iconId === 'icon2') {
            window.location.href = 'task.html';
        }
        if (iconId === 'icon1') {
            window.location.href = 'home.html';
        }
        if (iconId === 'icon3') {
            window.location.href = 'add.html';
        }
    }

