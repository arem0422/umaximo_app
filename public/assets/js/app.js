function generateActivity() {
  fetch('/generate', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      renderActivity(data);
    });
}

const container = document.getElementById('activity-container');

Sortable.create(container, {
  animation: 150,
  ghostClass: 'dragging',
  handle: '.card', // opcional: hace draggable toda la tarjeta
  onEnd: () => {
    Swal.fire({
      title: '¡Actividad reordenada!',    
      icon: 'success',
    })
    const basura = document.querySelectorAll('.ghost, .sortable-ghost, .ui-sortable-placeholder');
    basura.forEach(el => el.remove());
  }
});

let activityCount = 0;

/**
 * Renderiza una actividad en el contenedor con id "activity-container".
 *
 * - Incrementa el contador de actividades y crea un elemento <div> con clase "card"
 *   y un título que indica el número de actividad.
 * - Crea un formulario con las opciones de la actividad y un botón de validar.
 * - Agrega un evento al botón de validar que envía una solicitud POST a /validate
 *   con los datos de la actividad y la respuesta seleccionada.
 * - Agrega un elemento <div> debajo del botón para mostrar el resultado de la
 *   validación.
 *
 * @param {Object} activity objeto con las propiedades:
 *   - question: string, texto de la pregunta de la actividad
 *   - options: array de strings, opciones de la actividad
 *   - answer: string, respuesta correcta oculta
 */
function renderActivity(activity) {
  activityCount++;

  const container = document.getElementById('activity-container');

  // 🧱 Crear columna Bootstrap
  const col = document.createElement('div');
  col.className = 'col-md-6 mb-4';

  const card = document.createElement('div');
  card.className = 'card h-100';

  const body = document.createElement('div');
  body.className = 'card-body d-flex flex-column';

  const title = document.createElement('h5');
  title.className = 'card-title';
  title.innerText = `Actividad #${activityCount}`;

  const question = document.createElement('p');
  question.className = 'card-text';
  question.innerText = activity.question;

  const form = document.createElement('form');
  form.className = 'mb-3';

  activity.options.forEach((opt, index) => {
    const div = document.createElement('div');
    div.className = 'form-check';

    const input = document.createElement('input');
    input.className = 'form-check-input';
    input.type = 'radio';
    input.name = `respuesta-${activityCount}`;
    input.id = `option-${activityCount}-${index}`;
    input.value = opt;

    const label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = input.id;
    label.innerText = opt;

    div.appendChild(input);
    div.appendChild(label);
    form.appendChild(div);
  });

  const validateBtn = document.createElement('button');
  validateBtn.type = 'button';
  validateBtn.className = 'btn btn-primary mt-2';
  validateBtn.innerText = 'Validar respuesta';

  const resultMsg = document.createElement('div');
  resultMsg.className = 'mt-3';

  validateBtn.addEventListener('click', () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    const selected = form.querySelector('input[type="radio"]:checked');
    if (!selected) {
      Toast.fire({
        icon: 'warning',
        title: 'Selecciona una opción antes de responder.'
      });
      return;
    }

    const payload = {
      question: activity.question,
      options: activity.options,
      answer: selected.value,
      correct: activity.answer
    };

    fetch('/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      resultMsg.innerHTML = '';
      if (data.valid) {
        Toast.fire({
          icon: 'success',
          title: '¡Respuesta correcta!'
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Respuesta incorrecta. Intenta otra vez.'
        });
      }
    });
  });

  body.appendChild(title);
  body.appendChild(question);
  body.appendChild(form);
  body.appendChild(validateBtn);
  body.appendChild(resultMsg);
  card.appendChild(body);
  col.appendChild(card);
  container.appendChild(col);
}

/**
 * Adds an event listener to the edit button that allows editing of existing activity cards.
 * If there are no activity cards, an alert is shown. For each card, the question and options
 * are replaced with input fields for editing. A save button is added to save changes and
 * re-render the card with updated values.
 */
document.querySelector('#editBtn').addEventListener('click', () => {
  const cards = document.querySelectorAll('#activity-container .card');

  if (cards.length === 0) {
    Swal.fire({
      title: 'Error!',
      text: 'Do you want to continue',
      icon: 'error',
      confirmButtonText: 'Cool'
    });
    return;
  }

  cards.forEach(card => {
    const questionEl = card.querySelector('.card-text');
    const optionsForm = card.querySelector('form');

    if (!questionEl || !optionsForm) return;

    const originalQuestion = questionEl.innerText;
    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.className = 'form-control mb-3';
    questionInput.value = originalQuestion;
    questionEl.replaceWith(questionInput);

    // Editar opciones
    const inputs = [];
    const newForm = document.createElement('form');
    newForm.className = 'mb-3';

    const radios = optionsForm.querySelectorAll('input[type="radio"]');

    radios.forEach((radio, i) => {
      const label = optionsForm.querySelector(`label[for="${radio.id}"]`);
      const optionInput = document.createElement('input');
      optionInput.type = 'text';
      optionInput.className = 'form-control mb-2';
      optionInput.value = label.innerText;

      const div = document.createElement('div');
      div.className = 'form-group';
      div.appendChild(optionInput);
      newForm.appendChild(div);
      inputs.push(optionInput);
    });

    optionsForm.replaceWith(newForm);

    // Botón para guardar los cambios
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-success';
    saveBtn.innerText = 'Guardar actividad';

    saveBtn.addEventListener('click', () => {
      const newQuestion = questionInput.value;
      const newOptions = inputs.map(input => input.value);

      // Re-renderizar la tarjeta con nuevos valores
      card.innerHTML = '';
      renderActivity({
        question: newQuestion,
        options: newOptions,
        answer: newOptions[0] // por defecto la primera como correcta
      });
    });

    card.appendChild(saveBtn);
  });
});




