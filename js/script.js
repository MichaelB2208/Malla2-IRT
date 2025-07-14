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
          <span><strong>Créditos:</strong> ${materia.creditos}</span><br>
          <span><strong>Prerrequisitos:</strong> ${materia.prerrequisitos}</span><br>
          <span><strong>Correquisitos:</strong> ${materia.correquisitos}</span>
        `;
        column.appendChild(div);
      });

      malla.appendChild(column);
    }
  })
  .catch(error => {
    console.error('Error cargando el pensum:', error);
  });

