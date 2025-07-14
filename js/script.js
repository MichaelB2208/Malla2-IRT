fetch('pensum.json')
  .then(response => response.json())
  .then(data => {
    const malla = document.getElementById('malla');

    for (const [cuatrimestre, materias] of Object.entries(data)) {
      const column = document.createElement('div');
      column.className = 'cuatrimestre';

      const title = document.createElement('h2');
      title.textContent = cuatrimestre;
      column.appendChild(title);

      materias.forEach(materia => {
        const div = document.createElement('div');
        div.className = 'materia';
        div.innerHTML = `
          <strong>${materia.nombre}</strong>
          <span><strong>ID:</strong> ${materia.id}</span><br>
          <span><strong>Créditos:</strong> ${materia.creditos}</span>
        `;

        // Evento para abrir modal
        div.addEventListener('click', () => {
          document.getElementById('modal-title').textContent = materia.nombre;
          document.getElementById('modal-id').textContent = materia.id;
          document.getElementById('modal-creditos').textContent = materia.creditos;
          document.getElementById('modal-prereq').textContent = materia.prerrequisitos;
          document.getElementById('modal-coreq').textContent = materia.correquisitos;
          document.getElementById('modal').classList.remove('hidden');
        });

        column.appendChild(div);
      });

      malla.appendChild(column);
    }

    // Cerrar modal
    document.querySelector('.close-btn').addEventListener('click', () => {
      document.getElementById('modal').classList.add('hidden');
    });

    // Cerrar si se hace clic fuera del contenido
    window.addEventListener('click', (event) => {
      const modal = document.getElementById('modal');
      if (event.target === modal) {
        modal.classList.add('hidden');
      }
    });
  })
  .catch(error => {
    console.error('Error cargando el pensum:', error);
  });
