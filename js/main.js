/* Nav scroll + Floating WA + Sticky CTA */
    const nav = document.getElementById('nav');
    const floatWa = document.getElementById('float-wa');
    const stickyCta = document.getElementById('sticky-cta');
    const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 40);
      floatWa.classList.toggle('visible', y > 600);
      // Sticky CTA solo en mobile, después del hero (~700px)
      if (isMobile()) {
        const showSticky = y > 700;
        stickyCta.classList.toggle('visible', showSticky);
        document.body.classList.toggle('has-sticky-cta', showSticky);
      }
    }, { passive: true });

    /* Scroll reveal */
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
    reveals.forEach(el => observer.observe(el));

    /* FAQ accordion */
    document.querySelectorAll('.faq__item').forEach(item => {
      const btn = item.querySelector('.faq__q');
      btn.addEventListener('click', () => {
        const open = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    /* FAQ "ver más" toggle */
    const faqMore = document.getElementById('faq-more');
    const faqToggle = document.getElementById('faq-toggle');
    const faqToggleText = document.getElementById('faq-toggle-text');
    if (faqToggle && faqMore) {
      faqToggle.addEventListener('click', () => {
        const open = faqMore.classList.toggle('open');
        faqToggle.classList.toggle('open');
        faqToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        faqToggleText.textContent = open ? 'Ver menos preguntas' : 'Ver más preguntas';
      });
    }

    /* Form: validación inline + envío con WhatsApp como fallback */
    const form = document.getElementById('cotizar-form');
    const success = document.getElementById('form-success');
    const submitBtn = document.getElementById('form-submit');

    form.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form__field').classList.remove('error');
      });
      input.addEventListener('blur', () => {
        if (input.required && !input.value.trim()) {
          input.closest('.form__field').classList.add('error');
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const fields = form.querySelectorAll('input, select');

      fields.forEach(input => {
        const field = input.closest('.form__field');
        if (input.required && !input.value.trim()) {
          field.classList.add('error');
          valid = false;
        } else {
          field.classList.remove('error');
        }
      });

      const phone = document.getElementById('f-phone');
      if (phone.value && phone.value.replace(/\D/g, '').length < 10) {
        phone.closest('.form__field').classList.add('error');
        phone.closest('.form__field').querySelector('.form__error').textContent = 'WhatsApp de 10 dígitos';
        valid = false;
      }

      if (!valid) {
        const firstError = form.querySelector('.form__field.error input, .form__field.error select');
        if (firstError) firstError.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Enviando...';

      // Construir mensaje de WhatsApp con los datos
      const data = new FormData(form);
      const eventLabels = {
        boda: 'Boda',
        xv: 'XV años',
        corporativo: 'Corporativo',
        cumpleanos: 'Cumpleaños',
        otro: 'Otro'
      };
      const msg = `Hola Icōnica, quiero cotizar mi evento.%0A%0A` +
        `*Nombre:* ${data.get('name')}%0A` +
        `*WhatsApp:* ${data.get('phone')}%0A` +
        `*Tipo:* ${eventLabels[data.get('event')] || data.get('event')}%0A` +
        `*Fecha:* ${data.get('date')}`;

      // Mostrar éxito y redirigir a WhatsApp con datos pre-cargados
      setTimeout(() => {
        form.style.display = 'none';
        success.classList.add('visible');
        // Abrir WhatsApp en nueva pestaña con el mensaje pre-llenado
        window.open(`https://wa.me/5212213510901?text=${msg}`, '_blank');
      }, 600);
    });