
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

    document.addEventListener('DOMContentLoaded', function() {
      const container = document.getElementById('categoryContainer');
      const scrollLeft = document.getElementById('scrollLeft');
      const scrollRight = document.getElementById('scrollRight');
      const categories = document.querySelectorAll('.category-card');
      
      // Scroll functionality
      scrollLeft.addEventListener('click', () => {
        container.scrollBy({ left: -300, behavior: 'smooth' });
      });
      
      scrollRight.addEventListener('click', () => {
        container.scrollBy({ left: 300, behavior: 'smooth' });
      });
      
      // Category selection
      categories.forEach(category => {
        category.addEventListener('click', () => {
          // Remove active class from all categories
          categories.forEach(c => c.classList.remove('active-category'));
          // Remove active border from all icons
          document.querySelectorAll('.icon-container').forEach(icon => {
            icon.classList.remove('border-black');
            icon.classList.add('border-gray-200');
          });
          
          // Add active class to clicked category
          category.classList.add('active-category');
          
          // Add active border to clicked icon
          const activeIcon = category.querySelector('.icon-container');
          activeIcon.classList.remove('border-gray-200');
          activeIcon.classList.add('border-black');
        });
      });
      
      // Update button visibility based on scroll position
      container.addEventListener('scroll', () => {
        // Disable left button if at the beginning
        if (container.scrollLeft === 0) {
          scrollLeft.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
          scrollLeft.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        // Disable right button if at the end
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          scrollRight.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
          scrollRight.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      });
      
      // Initialize button states
      scrollLeft.classList.add('opacity-50', 'cursor-not-allowed');
    });

  
    