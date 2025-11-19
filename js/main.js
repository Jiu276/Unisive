// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const blogGrid = document.getElementById('blogGrid');
const articleData = window.articleData || [];

if (articleData.length) {
    localStorage.setItem('articleData', JSON.stringify(articleData));
}

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const articles = document.querySelectorAll('.blog-card');
    
    articles.forEach(article => {
        const title = article.querySelector('h3').textContent.toLowerCase();
        const content = article.querySelector('p').textContent.toLowerCase();
        const category = article.dataset.category;
        
        if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
            article.style.display = 'block';
            article.style.animation = 'fadeIn 0.5s ease';
        } else {
            article.style.display = 'none';
        }
    });
}

searchBtn?.addEventListener('click', performSearch);
searchInput?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Category Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const blogCards = document.querySelectorAll('.blog-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        
        blogCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Dropdown Category Links
const categoryLinks = document.querySelectorAll('.dropdown-menu a[data-category]');
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        
        // Find and click the corresponding filter button
        const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        if (filterBtn) {
            filterBtn.click();
            // Scroll to blog section
            document.querySelector('.blog-section').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Pagination
const pageButtons = document.querySelectorAll('.page-btn');
let currentPage = 1;
const articlesPerPage = 9;

function updatePagination() {
    const allArticles = Array.from(document.querySelectorAll('.blog-card:not([style*="display: none"])'));
    const totalPages = Math.ceil(allArticles.length / articlesPerPage);
    
    // Hide all articles
    allArticles.forEach(article => article.style.display = 'none');
    
    // Show articles for current page
    const start = (currentPage - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const currentArticles = allArticles.slice(start, end);
    
    currentArticles.forEach(article => {
        article.style.display = 'block';
        article.style.animation = 'fadeIn 0.5s ease';
    });
    
    // Update page buttons
    pageButtons.forEach((btn, index) => {
        if (btn.querySelector('i')) return; // Skip arrow buttons
        
        btn.classList.toggle('active', parseInt(btn.textContent) === currentPage);
    });
}

pageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.disabled) return;
        
        if (btn.querySelector('.fa-chevron-left')) {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        } else if (btn.querySelector('.fa-chevron-right')) {
            currentPage++;
            updatePagination();
        } else {
            currentPage = parseInt(btn.textContent);
            updatePagination();
        }
    });
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate subscription
    alert(`Thank you for subscribing with email: ${email}`);
    e.target.reset();
});

// Smooth Scroll for Hero Button
const heroButton = document.querySelector('.hero .btn-primary');
heroButton?.addEventListener('click', () => {
    document.querySelector('.blog-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Social Widget Toggle
const widgetToggle = document.querySelector('.widget-toggle');
const widgetLinks = document.querySelector('.widget-links');

widgetToggle?.addEventListener('click', () => {
    widgetLinks.style.opacity = widgetLinks.style.opacity === '1' ? '0' : '1';
    widgetLinks.style.visibility = widgetLinks.style.visibility === 'visible' ? 'hidden' : 'visible';
});

// Remove lazy loading to prevent images from disappearing
// All images will load normally

// Sort articles by date (newest to oldest)
function sortArticlesByDate() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    const articles = Array.from(blogGrid.querySelectorAll('.blog-card'));
    
    // Define month order for sorting (full and abbreviated)
    const monthOrder = {
        'January': 1, 'Jan': 1,
        'February': 2, 'Feb': 2,
        'March': 3, 'Mar': 3,
        'April': 4, 'Apr': 4,
        'May': 5,
        'June': 6, 'Jun': 6,
        'July': 7, 'Jul': 7,
        'August': 8, 'Aug': 8,
        'September': 9, 'Sep': 9,
        'October': 10, 'Oct': 10,
        'November': 11, 'Nov': 11,
        'December': 12, 'Dec': 12
    };
    
    // Add data-date attribute to each article based on articleData
    articles.forEach((article, index) => {
        const articleId = parseInt(article.querySelector('a').href.split('id=')[1]);
        const articleInfo = articleData.find(a => a.id === articleId);
        if (articleInfo) {
            // Parse date string like "August 15, 2025"
            const dateParts = articleInfo.date.split(' ');
            const month = monthOrder[dateParts[0]];
            const day = parseInt(dateParts[1].replace(',', ''));
            const year = parseInt(dateParts[2]);
            // Create sortable date value (YYYYMMDD)
            const sortableDate = year * 10000 + month * 100 + day;
            article.setAttribute('data-sort-date', sortableDate);
        }
    });
    
    // Sort articles by data-sort-date
    articles.sort((a, b) => {
        const dateA = parseInt(a.getAttribute('data-sort-date') || 0);
        const dateB = parseInt(b.getAttribute('data-sort-date') || 0);
        return dateB - dateA; // Newest first
    });
    
    // Clear and re-append sorted articles
    articles.forEach(article => {
        blogGrid.appendChild(article);
    });
}

// Initialize sorting when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(sortArticlesByDate, 100); // Small delay to ensure DOM is ready
    
    // Create animated particles
    createParticles();
});

// Create floating particles effect
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random color from gradient colors - bright palette
        const colors = ['rgba(255, 107, 157, 0.4)', 'rgba(254, 196, 100, 0.4)', 'rgba(102, 217, 239, 0.4)', 'rgba(250, 139, 255, 0.4)'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
    }
}

// Add smooth scroll effect
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hash = this.getAttribute('href');
        if (!hash || hash === '#') {
            return;
        }

        const target = document.querySelector(hash);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});