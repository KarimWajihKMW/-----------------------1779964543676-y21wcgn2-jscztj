console.log('Akwadra Super Builder Initialized');

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 45, 420)}ms`;
        revealObserver.observe(element);
    });

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.65 });

    document.querySelectorAll('[data-counter]').forEach((counter) => counterObserver.observe(counter));

    function animateCounter(element) {
        const target = Number(element.dataset.counter || 0);
        const duration = 1500;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            element.textContent = target > 999 ? value.toLocaleString('ar-EG') : value.toString();
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    if (!prefersReducedMotion) {
        const depthLayers = document.querySelectorAll('[data-depth]');
        const sections = document.querySelectorAll('[data-depth-section]');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            depthLayers.forEach((layer) => {
                const depth = Number(layer.dataset.depth || 0);
                const movement = (scrollY * depth) / 1800;
                layer.style.setProperty('--scroll-depth', `${movement}px`);
                layer.style.translate = `0 ${movement}px`;
            });

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const clamped = Math.max(0, Math.min(1, progress));
                section.style.transform = `rotateX(${(clamped - 0.5) * 2.2}deg) translateZ(${clamped * 8}px)`;
            });
        }, { passive: true });

        document.querySelectorAll('[data-tilt-card]').forEach((card) => {
            card.addEventListener('pointermove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-4px)`;
            });

            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
            });
        });
    }

    const signupForm = document.querySelector('#signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(signupForm);
            const name = formData.get('name') || 'صديقنا';
            showToast(`شكراً ${name}، تم استلام طلبك وسنرسل خطة التحويل قريباً.`);
            signupForm.reset();
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        });
    });

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 450);
        }, 4200);
    }

    const legacyCard = document.querySelector('.card');
    if (legacyCard) {
        legacyCard.addEventListener('click', () => {
            console.log('تم النقر على البطاقة!');
            alert('أهلاً بك في عالم البناء بدون كود!');
        });
    }
});
