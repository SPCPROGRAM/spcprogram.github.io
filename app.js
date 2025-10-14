document.addEventListener('DOMContentLoaded', () => {

    // --- BASE DE DATOS SIMULADA Y LÓGICA DE DATOS ---
    
    function initDatabase() {
        if (!localStorage.getItem('tutores')) {
            const defaultTutores = [
                {
                    email: 'sprietoc@mail.uniatlantico.edu.co',
                    nombre: 'Sebastian Prieto',
                    foto_url: 'img/sebas.jpeg',
                    universidad: 'Universidad del atlantico',
                    carrera: 'Lic. en lenguas extranjeras',
                    biografia: 'Me encanta el enseñar ingles y ayudar a los demas a mejorar su pronunciacion y gramatica',
                    materias: ['ingles'], 
                    tarifa_hora: 40000,
                    calificacion_promedio: 4.0,
                    reviews: [
                        { nombre: 'Familia Mendoza', rating: 5, comentario: 'Muy bueno, ayudo a mi hijo a mejorar su gramatica.'},
                    ]
                },
                {
                    email: 'c.mendoza@unicartagena.edu.co',
                    nombre: 'Jose Fontalvo',
                    foto_url: 'https://i.pravatar.cc/150?u=carlos',
                    universidad: 'Universidad de Cartagena',
                    carrera: 'Medicina',
                    biografia: 'Futuro médico de Cartagena. Tengo una gran paciencia y me especializo en biología y química, las bases de mi carrera. Te ayudaré a entender la ciencia de la vida.',
                    materias: ['Biología', 'Química'],
                    tarifa_hora: 45000,
                    calificacion_promedio: 5.0,
                    reviews: [
                        { nombre: 'Andrea P.', rating: 5, comentario: 'Carlos explica increíblemente bien. 100% recomendado.'}
                    ]
                },
                {
                    email: 'd.sierra@utb.edu.co',
                    nombre: 'Daniela Sierra',
                    foto_url: 'https://i.pravatar.cc/150?u=daniela',
                    universidad: 'Universidad Tecnológica de Bolívar',
                    carrera: 'Comunicación Social',
                    biografia: 'Amante de las letras y la historia. Ayudo a estudiantes a mejorar su redacción, comprensión lectora y a prepararse para el ICFES en el área de sociales.',
                    materias: ['Sociales', 'Inglés'],
                    tarifa_hora: 40000,
                    calificacion_promedio: 4.8,
                    reviews: []
                },
                 {
                    email: 'j.valdes@uniatlantico.edu.co',
                    nombre: 'Javier Valdés',
                    foto_url: 'https://i.pravatar.cc/150?u=javier',
                    universidad: 'Universidad del Atlántico',
                    carrera: 'Licenciatura en Inglés',
                    biografia: 'Bilingüe y con experiencia en pedagogía. Mis clases son dinámicas y conversacionales, enfocadas en que pierdas el miedo a hablar en inglés.',
                    materias: ['Inglés'],
                    tarifa_hora: 55000,
                    calificacion_promedio: 4.9,
                    reviews: [
                         { nombre: 'Familia Diaz', rating: 5, comentario: 'Gracias a Javier, mi hija mejoró muchísimo su pronunciación.'}
                    ]
                }
            ];
            localStorage.setItem('tutores', JSON.stringify(defaultTutores));
        }
        if (!localStorage.getItem('tutorias')) {
            localStorage.setItem('tutorias', JSON.stringify([]));
        }
    }

    const getTutores = () => JSON.parse(localStorage.getItem('tutores'));
    const getTutorByEmail = (email) => getTutores().find(t => t.email === email);
    const saveTutoria = (tutoria) => {
        const tutorias = JSON.parse(localStorage.getItem('tutorias'));
        tutorias.push(tutoria);
        localStorage.setItem('tutorias', JSON.stringify(tutorias));
    };

    // --- INICIALIZACIÓN DE LA APP ---
    initDatabase();
    const pageId = document.body.id;

    // --- LÓGICA PARA PÁGINA DE INICIO (INDEX) ---
    if (pageId === 'landing-page') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if(navToggle) {
            navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        }
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => { if(navMenu) navMenu.classList.remove('active') });
        });
        document.querySelectorAll('.faq__item .faq__question').forEach(question => {
            question.addEventListener('click', (e) => {
                const item = e.currentTarget.parentElement;
                const openItem = document.querySelector('.faq__item.active');
                if(openItem && openItem !== item) openItem.classList.remove('active');
                item.classList.toggle('active');
            });
        });
    }

    // --- LÓGICA PARA PÁGINA DEL DASHBOARD ---
    if (pageId === 'dashboard-page') {
        const tutorGrid = document.getElementById('tutor-grid');
        const searchInput = document.getElementById('search-name');
        const materiaFilter = document.getElementById('filter-materia');
        const universidadFilter = document.getElementById('filter-universidad');
        const noResultsMessage = document.getElementById('no-results');

        function renderTutorCard(tutor) {
            const stars = '★'.repeat(Math.round(tutor.calificacion_promedio)) + '☆'.repeat(5 - Math.round(tutor.calificacion_promedio));
            return `
                <div class="tutor-card" data-nombre="${tutor.nombre}" data-materias="${tutor.materias.join(',')}" data-universidad="${tutor.universidad}">
                    <div class="tutor-card__header">
                        <img src="${tutor.foto_url}" alt="Tutor ${tutor.nombre}" class="tutor-card__img">
                        <div class="tutor-card__info">
                            <h3 class="tutor-card__name">${tutor.nombre}</h3>
                            <div class="tutor-card__rating">
                                <span class="stars">${stars}</span> <span class="rating-text">${tutor.calificacion_promedio} (${tutor.reviews.length} reseñas)</span>
                            </div>
                        </div>
                    </div>
                    <div class="tutor-card__body">
                        <p class="tutor-card__university">${tutor.carrera} - ${tutor.universidad}</p>
                        <div class="tutor-card__tags">${tutor.materias.map(m => `<span>${m}</span>`).join('')}</div>
                    </div>
                    <div class="tutor-card__footer">
                        <span class="tutor-card__price">${(tutor.tarifa_hora).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}/hora</span>
                        <a href="perfil_tutor.html?email=${tutor.email}" class="button button--primary">Ver Perfil</a>
                    </div>
                </div>`;
        }
        
        function displayTutores() {
            const tutores = getTutores();
            if (tutorGrid) tutorGrid.innerHTML = tutores.map(renderTutorCard).join('');
        }

        function filterTutors() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedMateria = materiaFilter.value;
            const selectedUniversidad = universidadFilter.value;
            let visibleCards = 0;
            document.querySelectorAll('.tutor-card').forEach(card => {
                const matchesSearch = card.dataset.nombre.toLowerCase().includes(searchTerm);
                const matchesMateria = selectedMateria === "" || card.dataset.materias.includes(selectedMateria);
                const matchesUniversidad = selectedUniversidad === "" || card.dataset.universidad.includes(selectedUniversidad);
                
                if (matchesSearch && matchesMateria && matchesUniversidad) {
                    card.style.display = 'flex';
                    visibleCards++;
                } else {
                    card.style.display = 'none';
                }
            });
            if(noResultsMessage) noResultsMessage.style.display = visibleCards === 0 ? 'block' : 'none';
        }
        
        displayTutores();
        searchInput.addEventListener('input', filterTutors);
        materiaFilter.addEventListener('change', filterTutors);
        universidadFilter.addEventListener('change', filterTutors);
    }
    
    // --- LÓGICA PARA PÁGINA DE PERFIL DE TUTOR ---
    if (pageId === 'perfil-page') {
        const urlParams = new URLSearchParams(window.location.search);
        const tutorEmail = urlParams.get('email');
        const tutor = getTutorByEmail(tutorEmail);
        
        if (tutor) {
            document.title = `Perfil de ${tutor.nombre} - EduConecta`;
            document.getElementById('tutor-name').textContent = tutor.nombre;
            document.getElementById('tutor-img').src = tutor.foto_url;
            document.getElementById('tutor-subtitle').textContent = `${tutor.carrera} - ${tutor.universidad}`;
            document.getElementById('tutor-rating').innerHTML = `<span class="stars">${'★'.repeat(Math.round(tutor.calificacion_promedio))+'☆'.repeat(5-Math.round(tutor.calificacion_promedio))}</span> <span>${tutor.calificacion_promedio} (${tutor.reviews.length} reseñas)</span>`;
            document.getElementById('tutor-bio').textContent = tutor.biografia;
            document.getElementById('tutor-tags').innerHTML = tutor.materias.map(m => `<span>${m}</span>`).join('');
            document.getElementById('tutor-price').innerHTML = `${(tutor.tarifa_hora).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })} <span class="booking-widget__price-period">/ hora</span>`;
            
            const reviewsContainer = document.getElementById('reviews-container');
            if(tutor.reviews.length > 0){
                 reviewsContainer.innerHTML = tutor.reviews.map(r => `<div class="review-card"><div class="review-card__header"><span class="review-card__name">${r.nombre}</span><span class="review-card__rating"><span class="stars">${'★'.repeat(r.rating)}</span></span></div><p class="review-card__text">"${r.comentario}"</p></div>`).join('');
            } else {
                reviewsContainer.innerHTML = '<p>Este tutor aún no tiene opiniones.</p>';
            }

            // LÓGICA DEL CALENDARIO Y RESERVA
            let currentDate = new Date();
            let selectedDate = null;
            let selectedTime = null;
            const serviceFee = 3000;
            const availableDates = ["2025-10-15", "2025-10-16", "2025-10-17", "2025-10-20", "2025-10-21", "2025-10-22", "2025-11-04", "2025-11-05"];
            const availabilityByDate = { "2025-10-15": ["14:00", "15:00", "17:00"], "2025-10-16": ["10:00", "11:00", "16:00"], "2025-10-17": ["09:00", "14:00"], "2025-10-20": ["18:00", "19:00"], "2025-10-21": ["15:00", "16:00", "17:00"], "2025-10-22": ["11:00"], "2025-11-04": ["14:00", "15:00"], "2025-11-05": ["10:00", "11:00", "16:00", "17:00"] };

            const monthYearEl = document.getElementById('month-year');
            const calendarDaysEl = document.getElementById('calendar-days');
            const timeSlotsContainer = document.getElementById('time-slots-container');
            const timeSlotsEl = document.getElementById('time-slots');
            const durationContainer = document.getElementById('duration-container');
            const durationSelect = document.getElementById('duration');
            const summaryContainer = document.getElementById('booking-summary');
            const bookButton = document.getElementById('book-button');

            function renderCalendar() {
                const today = new Date(); today.setHours(0,0,0,0);
                const month = currentDate.getMonth();
                const year = currentDate.getFullYear();
                monthYearEl.textContent = `${currentDate.toLocaleString('es-CO', { month: 'long' })} ${year}`;
                const firstDayOfMonth = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                calendarDaysEl.innerHTML = '';
                const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
                for (let i = 0; i < startDay; i++) calendarDaysEl.innerHTML += '<div></div>';
                for (let i = 1; i <= daysInMonth; i++) {
                    const dayEl = document.createElement('div'); dayEl.textContent = i;
                    const dayDate = new Date(year, month, i); const dateString = dayDate.toISOString().split('T')[0];
                    if (dayDate < today) dayEl.classList.add('day--other-month');
                    else if (availableDates.includes(dateString)) { dayEl.classList.add('day--available'); dayEl.dataset.date = dateString; }
                    if (dayDate.getTime() === today.getTime()) dayEl.classList.add('day--today');
                    calendarDaysEl.appendChild(dayEl);
                }
            }

            function renderTimeSlots(dateString) {
                timeSlotsContainer.style.display = 'block';
                timeSlotsEl.innerHTML = '';
                const times = availabilityByDate[dateString];
                if (times && times.length > 0) {
                    times.forEach(time => {
                        const timeSlotEl = document.createElement('div');
                        timeSlotEl.classList.add('time-slot'); timeSlotEl.textContent = time; timeSlotEl.dataset.time = time;
                        timeSlotsEl.appendChild(timeSlotEl);
                    });
                }
            }

            function updateSummary() {
                if (!selectedDate || !selectedTime) return;
                summaryContainer.style.display = 'block';
                const duration = parseFloat(durationSelect.value);
                const subtotal = tutor.tarifa_hora * duration;
                const total = subtotal + serviceFee;
                document.getElementById('summary-subtotal').textContent = subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
                document.getElementById('summary-fee').textContent = serviceFee.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
                document.getElementById('summary-total').textContent = total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
                bookButton.disabled = false;
            }

            document.getElementById('prev-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
            document.getElementById('next-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
            
            calendarDaysEl.addEventListener('click', (e) => {
                if (e.target.classList.contains('day--available')) {
                    const prevSelected = calendarDaysEl.querySelector('.day--selected');
                    if (prevSelected) prevSelected.classList.remove('day--selected');
                    e.target.classList.add('day--selected');
                    selectedDate = e.target.dataset.date;
                    selectedTime = null;
                    renderTimeSlots(selectedDate);
                    durationContainer.style.display = 'none';
                    summaryContainer.style.display = 'none';
                    bookButton.disabled = true;
                }
            });

            timeSlotsEl.addEventListener('click', (e) => {
                if (e.target.classList.contains('time-slot')) {
                    const prevSelected = timeSlotsEl.querySelector('.selected');
                    if (prevSelected) prevSelected.classList.remove('selected');
                    e.target.classList.add('selected');
                    selectedTime = e.target.dataset.time;
                    durationContainer.style.display = 'block';
                    updateSummary();
                }
            });

            durationSelect.addEventListener('change', updateSummary);
            bookButton.addEventListener('click', () => {
                alert(`¡Reserva confirmada con ${tutor.nombre}!\nFecha: ${selectedDate}\nHora: ${selectedTime}\nTotal: ${document.getElementById('summary-total').textContent}\n\nGracias por usar EduConecta.`);
                const newTutoria = { tutorEmail, tutorNombre: tutor.nombre, clienteEmail: 'demo@user.com', fecha: selectedDate, hora: selectedTime };
                saveTutoria(newTutoria);
            });
            
            renderCalendar();
        } else {
            document.querySelector('main').innerHTML = '<h1 style="text-align:center; padding: 50px;">Tutor no encontrado</h1>';
        }
    }
});