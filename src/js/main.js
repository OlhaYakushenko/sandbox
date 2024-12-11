//menu
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const menuLinks = document.querySelectorAll('.menu__link');

  // Тоггл для открытия/закрытия меню
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('menu--open');
      menuToggle.classList.toggle('menu-toggle--active');
    });
  }

  // Плавный скролл к разделам
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1); // Убираем "#" из href
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault(); // Предотвращаем стандартное поведение ссылки
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Закрыть меню после клика (актуально для мобильных меню)
        if (menu.classList.contains('menu--open')) {
          menu.classList.remove('menu--open');
          menuToggle.classList.remove('menu-toggle--active');
        }

        // Установить активное состояние для ссылки
        menuLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
});




//accordion


const accordions = document.querySelectorAll('.accordion'); 

accordions.forEach(accordion => {
  const headers = accordion.querySelectorAll('.accordion-header'); 

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const accordionItem = header.parentElement;
      const accordionContent = accordionItem.querySelector('.accordion-content');
      const isActive = accordionItem.classList.contains('accordion-item_active');

      // Close all accordion elements within the current accordion
      accordion.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('accordion-item_active');
        const content = item.querySelector('.accordion-content');
        if (content) {
          content.style.maxHeight = null; // reset max-height
          content.style.opacity = 0; // hidden content
        }
      });

      // Open only the selected accordion element
      if (!isActive) {
        accordionItem.classList.add('accordion-item_active');
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px"; // Setting the height
        accordionContent.style.opacity = 1; // Making the content visible
      }
    });
  });
});


//carousel
//carousel
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentIndex = 0;
let slideWidth;
let gap = 30; // Расстояние между слайдами
let visibleSlides;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let isDragging = false;

// Функция для обновления параметров карусели на основе ширины экрана
function updateCarouselParameters() {
  const screenWidth = window.innerWidth;

  if (screenWidth > 1199) {
    slideWidth = 630; // Для больших экранов
    visibleSlides = 2.5;
    gap = 30; // Отступ между слайдами
  } else if (screenWidth > 767) {
    slideWidth = (slidesContainer.offsetWidth - gap) / 2; // Два слайда видимы
    visibleSlides = 2;
    gap = 20; // Уменьшенный отступ
  } else {
    slideWidth = slidesContainer.offsetWidth; // На 767px и ниже слайд занимает 100% ширины контейнера
    visibleSlides = 1; // Отображается только один слайд
    gap = 0; // Убираем отступы между слайдами
  }

  slides.forEach((slide) => {
    slide.style.width = `${slideWidth}px`;
  });

  updateCarouselPosition();
}

// Рассчитываем максимальный индекс
function calculateMaxIndex() {
  const totalSlides = slides.length;
  const hiddenSlides = totalSlides - visibleSlides;
  return Math.max(0, Math.ceil(hiddenSlides));
}

// Обновляем позицию слайдов
function updateCarouselPosition() {
  const offset = currentIndex * (slideWidth + gap);
  slidesContainer.style.transform = `translateX(-${offset}px)`;
}

// Обработчик кнопки "Вперед"
nextButton.addEventListener('click', () => {
  const maxIndex = calculateMaxIndex();
  if (currentIndex < maxIndex) {
    currentIndex++;
    updateCarouselPosition();
  }
});

// Обработчик кнопки "Назад"
prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarouselPosition();
  }
});

// Добавляем обработчики для touch событий
slidesContainer.addEventListener('touchstart', handleTouchStart);
slidesContainer.addEventListener('touchmove', handleTouchMove);
slidesContainer.addEventListener('touchend', handleTouchEnd);

function handleTouchStart(event) {
  startX = event.touches[0].clientX;
  isDragging = true;
  prevTranslate = currentTranslate;
}

function handleTouchMove(event) {
  if (!isDragging) return;

  const currentX = event.touches[0].clientX;
  const diff = currentX - startX;
  currentTranslate = prevTranslate + diff;
  slidesContainer.style.transform = `translateX(${currentTranslate}px)`;
}

function handleTouchEnd() {
  isDragging = false;

  const movedBy = currentTranslate - prevTranslate;
  const threshold = slideWidth / 4;

  if (movedBy > threshold && currentIndex > 0) {
    currentIndex--;
  } else if (movedBy < -threshold && currentIndex < calculateMaxIndex()) {
    currentIndex++;
  }

  updateCarouselPosition();
  currentTranslate = 0;
}

// Обновляем параметры при загрузке и изменении размера окна
window.addEventListener('resize', updateCarouselParameters);
window.addEventListener('load', updateCarouselParameters);


//subscribe
const form = document.getElementById('subscribeForm');
const emailInput = document.getElementById('email');
const successMessage = document.querySelector('.success-message');
const errorMessage = document.querySelector('.error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const email = emailInput.value;

    try {
        
        const response = await fetch('https://your-server-endpoint.com/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            emailInput.value = '';
        } else {
            throw new Error('Ошибка при подписке');
        }
    } catch (error) {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'block';
    }
});


//scrollToTop

document.addEventListener('DOMContentLoaded', () => {
  const scrollToTopButton = document.getElementById('scrollToTop');

  // Показать кнопку при прокрутке вниз
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) { // Порог, после которого показывается кнопка
      scrollToTopButton.classList.add('show');
    } else {
      scrollToTopButton.classList.remove('show');
    }
  });

  // Прокрутка страницы вверх при нажатии на кнопку
  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Плавная прокрутка
    });
  });
});




// Получаем элементы счетчиков
const counters = document.querySelectorAll('.facts__ratings-counter');
const ratingsSection = document.querySelector('.facts__ratings');
let hasAnimated = false;

// Функция для анимации чисел
function animateCounters() {
  counters.forEach((counter, index) => {
    // Для второго счетчика (индекс 1) анимируем до 50,000 и показываем 50K+
    if (index === 1) {
      let count = 0;
      const target = 50000; // Целевое значение для второго счетчика
      const updateCounter = () => {
        const increment = Math.ceil(target / 100); // Шаг увеличения
        count += increment;

        if (count < target) {
          // Форматируем число как сокращенное
          const formattedCount = Math.floor(count / 1000) + "K";
          counter.innerText = `${formattedCount}+`; // Отображаем сокращенное число
          setTimeout(updateCounter, 20); // Задержка между итерациями
        } else {
          // В конце показываем 50K+
          counter.innerText = `50K+`;
        }
      };

      updateCounter();
      return; // Завершаем цикл для второго счетчика
    }

    // Для остальных счетчиков анимируем числа как обычно
    const target = +counter.innerText.replace(/\D/g, ''); // Получаем число из текста
    let count = 0;

    const updateCounter = () => {
      const increment = Math.ceil(target / 100); // Шаг увеличения
      count += increment;

      if (count < target) {
        counter.innerText = `${count}+`; // Анимируем до целевого числа
        setTimeout(updateCounter, 20); // Задержка между итерациями
      } else {
        counter.innerText = `${target}+`; // Устанавливаем финальное значение
      }
    };

    updateCounter();
  });
}

// Используем Intersection Observer для отслеживания видимости
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !hasAnimated) {
      hasAnimated = true;
      animateCounters();
    }
  });
}, {
  threshold: 0.5 // Срабатывает, когда 50% блока в зоне видимости
});

// Наблюдаем за секцией с рейтингами
observer.observe(ratingsSection);

