fetch('pensum.json')
  .then(response => response.json())
  .then(data => {
    const malla = document.getElementById('malla');
    const aprobadas = new Set(JSON.parse(localStorage.getItem('aprobadas')) || []);

    const renderMalla = () => {
      malla.innerHTML = '';

      for (const [cuatrimestre, materias] of Object.entries(data)) {
        const column = document.createElement('div');
        column.className = 'cuatrimestre';

        const title = document.createElement('h2');
        title.textContent = cuatrimestre;
        column.appendChild(title);

        materias.forEach(materia => {
          const div = document.createElement('div');
          div.className = 'materia';

          const prereq = materia.prerrequisitos.split(',').map(p => p.trim()).filter(p => p !== 'N/A');
          const cumplePrerrequisitos = prereq.every(p => aprobadas.has(p));

          if (cumplePrerrequisitos) {
            div.classList.add('habilitada');
          }

          if (aprobadas.has(materia.id)) {
            div.classList.add('aprobada');
          }

          div.innerHTML = `
            <strong>${materia.nombre}</strong>
            <span><strong>ID:</strong> ${materia.id}</span><br>
            <span><strong>Créditos:</strong> ${materia.creditos}</span>
          `;

          div.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = materia.nombre;
            document.getElementById('modal-id').textContent = materia.id;
            document.getElementById('modal-creditos').textContent = materia.creditos;
            document.getElementById('modal-prereq').textContent = materia.prerrequisitos;
            document.getElementById('modal-coreq').textContent = materia.correquisitos;

            const modal = document.getElementById('modal');
            modal.classList.remove('hidden');

            const aprobarBtn = document.getElementById('aprobar-btn');
            aprobarBtn.textContent = aprobadas.has(materia.id)
              ? 'Desmarcar como Aprobada'
              : 'Marcar como Aprobada';

            aprobarBtn.onclick = () => {
              if (aprobadas.has(materia.id)) {
                aprobadas.delete(materia.id);
              } else {
                aprobadas.add(materia.id);
              }
              localStorage.setItem('aprobadas', JSON.stringify([...aprobadas]));
              modal.classList.add('hidden');
              renderMalla();
            };
          });

          column.appendChild(div);
        });

        malla.appendChild(column);
      }
    };

    renderMalla();

    document.querySelector('.close-btn').addEventListener('click', () => {
      document.getElementById('modal').classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
      const modal = document.getElementById('modal');
      if (event.target === modal) {
        modal.classList.add('hidden');
      }
    });
  })
  .catch(error => console.error('Error cargando el pensum:', error));
