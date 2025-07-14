fetch('pensum.json')
  .then(response => response.json())
  .then(data => {
    const malla = document.getElementById('malla');
    const creditosSpan = document.getElementById('creditos-aprobados');
    const resetBtn = document.getElementById('reset-btn');

    let aprobadas = new Set(JSON.parse(localStorage.getItem('aprobadas')) || []);

    const calcularCreditos = () => {
      let total = 0;
      for (const materias of Object.values(data)) {
        materias.forEach(materia => {
          if (aprobadas.has(materia.id)) {
            total += parseInt(materia.creditos);
          }
        });
      }
      creditosSpan.textContent = total;
    };

    const exportarPDF = () => {
      const aprobadasArray = [...aprobadas];
      let contenido = "Materias Aprobadas:\n\n";

      for (const cuatri in data) {
        for (const materia of data[cuatri]) {
          if (aprobadas.has(materia.id)) {
            contenido += `• ${materia.nombre} (${materia.id}) - ${materia.creditos} créditos\n`;
          }
        }
      }

      const blob = new Blob([contenido], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "malla_aprobadas.pdf";
      link.click();
    };

    const exportarCSV = () => {
      let contenido = "Cuatrimestre,Materia,ID,Créditos,Aprobada\n";
      for (const [cuatri, materias] of Object.entries(data)) {
        for (const materia of materias) {
          const aprobada = aprobadas.has(materia.id) ? "Sí" : "No";
          contenido += `${cuatri},"${materia.nombre}",${materia.id},${materia.creditos},${aprobada}\n`;
        }
      }

      const blob = new Blob([contenido], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "malla_completa.csv";
      link.click();
    };

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
              calcularCreditos();
            };
          });

          column.appendChild(div);
        });

        malla.appendChild(column);
      }
    };

    resetBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas reiniciar la malla?')) {
        aprobadas.clear();
        localStorage.removeItem('aprobadas');
        renderMalla();
        calcularCreditos();
      }
    });

    document.getElementById("exportar-pdf").addEventListener("click", exportarPDF);
    document.getElementById("exportar-csv").addEventListener("click", exportarCSV);

    document.querySelector('.close-btn').addEventListener('click', () => {
      document.getElementById('modal').classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
      const modal = document.getElementById('modal');
      if (event.target === modal) {
        modal.classList.add('hidden');
      }
    });

    renderMalla();
    calcularCreditos();
  })
  .catch(error => console.error('Error cargando el pensum:', error));
