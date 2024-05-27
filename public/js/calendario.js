document.addEventListener("DOMContentLoaded", function() {
    const daysContainer = document.querySelector('.days');
  
    // Adicionando dias ao calendário
    for (let i = 1; i <= 31; i++) {
      const day = document.createElement('div');
      day.classList.add('day');
      day.textContent = i;
      daysContainer.appendChild(day);
  
      // Adicionando o dia da semana abaixo de cada número
      const weekday = document.createElement('div');
      weekday.classList.add('weekday');
      weekday.textContent = getWeekday(i);
      day.appendChild(weekday);
    }
  
    // Função para obter o dia da semana
    function getWeekday(dayNumber) {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const date = new Date();
      date.setDate(dayNumber);
      return weekdays[date.getDay()];
    }
  });