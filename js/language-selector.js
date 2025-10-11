// Language Selector for LogikBioinfo
// Manages language switching between PT, EN, and ES

const translations = {
    pt: {
        nav: {
            home: 'Início',
            services: 'Serviços',
            publications: 'Publicações',
            portfolio: 'Portfólio',
            tools: 'Ferramentas',
            blog: 'Blog',
            budget: 'Orçamento',
            about: 'Sobre',
            whoami: 'Quem Sou Eu'
        }
    },
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            publications: 'Publications',
            portfolio: 'Portfolio',
            tools: 'Tools',
            blog: 'Blog',
            budget: 'Budget',
            about: 'About',
            whoami: 'Who I Am'
        }
    },
    es: {
        nav: {
            home: 'Inicio',
            services: 'Servicios',
            publications: 'Publicaciones',
            portfolio: 'Portafolio',
            tools: 'Herramientas',
            blog: 'Blog',
            budget: 'Presupuesto',
            about: 'Acerca de',
            whoami: 'Quién Soy'
        }
    }
};

// Get current language from localStorage or default to 'pt'
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'pt';
}

// Set language
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    updateLanguageSelector();
    redirectToLanguagePage(lang);
}

// Update active language indicator
function updateLanguageSelector() {
    const currentLang = getCurrentLanguage();
    document.querySelectorAll('.lang-option').forEach(option => {
        if (option.dataset.lang === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Redirect to language-specific page
function redirectToLanguagePage(lang) {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Remove any language prefix from current page
    let basePage = currentPage.replace(/^(en\/|es\/)/, '');
    
    // Determine new path based on language
    let newPath;
    if (lang === 'pt') {
        newPath = `/${basePage}`;
    } else {
        newPath = `/${lang}/${basePage}`;
    }
    
    // Only redirect if path changes
    if (currentPath !== newPath) {
        window.location.href = newPath;
    }
}

// Initialize language selector on page load
document.addEventListener('DOMContentLoaded', function() {
    updateLanguageSelector();
    
    // Add click handlers to language options
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            setLanguage(this.dataset.lang);
        });
    });
});
