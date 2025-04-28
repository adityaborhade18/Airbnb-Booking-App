
  const form = document.getElementById('myForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const inputs = document.querySelectorAll('.inputs'); 
    for (let input of inputs) {
      const errorMessage = input.nextElementSibling; 

      if (!input.checkValidity()) {
        isValid = false;
        input.classList.remove('border-green-300');
        input.classList.add('border-red-300');
        errorMessage.classList.remove('hidden');
      } else {
        input.classList.remove('border-red-300');
        input.classList.add('border-green-300');
        errorMessage.classList.add('hidden');
      }
    }

    if (isValid) {
      form.submit();
    }
  });

