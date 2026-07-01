// Get article ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('id') || 1;

// Get article data from localStorage, fallback to bundled data
const ARTICLE_DATA_VERSION = '2';
const storedVersion = localStorage.getItem('articleDataVersion');
const storedArticleData = localStorage.getItem('articleData');
const articleData = storedArticleData && storedVersion === ARTICLE_DATA_VERSION
    ? JSON.parse(storedArticleData)
    : (window.articleData || []);

if (articleData.length && (!storedArticleData || storedVersion !== ARTICLE_DATA_VERSION)) {
    localStorage.setItem('articleData', JSON.stringify(articleData));
    localStorage.setItem('articleDataVersion', ARTICLE_DATA_VERSION);
}

/**
 * @param {number} count
 * @returns {string}
 */
function formatClickCount(count) {
    return count.toLocaleString('en-US');
}

// Load article content
function loadArticle() {
    const article = articleData.find(a => a.id == articleId);
    
    if (article) {
        document.documentElement.lang = article.lang || 'en';

        // Update page title
        document.title = `${article.title} - Unisive`;
        
        // Update article header
        document.getElementById('articleTitle').textContent = article.title;
        document.getElementById('articleCategory').textContent = article.category;
        document.getElementById('articleAuthor').textContent = article.author;
        const dateEl = document.getElementById('articleDate');
        if (article.date) {
            dateEl.textContent = article.date;
            dateEl.style.display = '';
        } else {
            dateEl.textContent = '';
            dateEl.style.display = 'none';
        }
        document.getElementById('articleImage').src = article.image;
        document.getElementById('articleImage').alt = article.title;
        
        // Calculate reading time (strip HTML for word count)
        const plain = article.content.replace(/<[^>]*>/g, ' ');
        const wordCount = plain.trim().split(/\s+/).filter(Boolean).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        const isIt = article.lang === 'it';
        document.getElementById('readingTime').textContent = isIt
            ? `${readingTime} min di lettura`
            : `${readingTime} min read`;

        const clicksEl = document.getElementById('articleClicks');
        if (article.clicks) {
            clicksEl.innerHTML = `<i class="far fa-eye"></i> ${formatClickCount(article.clicks)} clicks`;
            clicksEl.hidden = false;
        } else {
            clicksEl.innerHTML = '';
            clicksEl.hidden = true;
        }
        
        // Update article content
        document.getElementById('articleContent').innerHTML = article.content;
        
        // Update author bio
        document.getElementById('bioAuthor').textContent = isIt
            ? `Su ${article.author}`
            : `About ${article.author}`;
        
        // Update tags based on category
        updateTags(article.category);
        
        // Load related articles
        loadRelatedArticles(article.category, article.id);
    } else {
        document.documentElement.lang = 'en';
        // Article not found
        document.getElementById('articleContent').innerHTML = '<p>Article not found.</p>';
    }
}

// Update tags based on category
function updateTags(category) {
    const tagsContainer = document.querySelector('.tags');
    const categoryTags = {
        'Technology': ['#technology', '#innovation', '#future', '#digital'],
        'Lifestyle': ['#lifestyle', '#wellness', '#mindfulness', '#living'],
        'Business': ['#business', '#entrepreneurship', '#marketing', '#strategy'],
        'Travel': ['#travel', '#adventure', '#explore', '#wanderlust'],
        'Viaggi': ['#viaggi', '#mare', '#borse', '#mc2'],
        'Health': ['#health', '#fitness', '#nutrition', '#wellness']
    };
    
    const tags = categoryTags[category] || ['#blog', '#article'];
    tagsContainer.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
}

// Load related articles
function loadRelatedArticles(category, currentId) {
    const relatedContainer = document.getElementById('relatedArticles');
    const relatedArticles = articleData
        .filter(a => a.category === category && a.id != currentId)
        .slice(0, 3);
    
    if (relatedArticles.length === 0) {
        // If no articles in same category, show random articles
        relatedArticles.push(...articleData
            .filter(a => a.id != currentId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
        );
    }
    
    relatedContainer.innerHTML = relatedArticles.map(article => `
        <div class="related-card">
            <img src="${article.image}" alt="${article.title}">
            <div class="related-card-content">
                <span class="category-tag">${article.category}</span>
                <h3><a href="article.html?id=${article.id}">${article.title}</a></h3>
                <p>${article.content.substring(3, 150)}...</p>
            </div>
        </div>
    `).join('');
}

// Share functionality
document.querySelectorAll('.share-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const url = window.location.href;
        const title = document.getElementById('articleTitle').textContent;
        
        switch(index) {
            case 0: // Facebook
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                break;
            case 1: // Twitter
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
                break;
            case 2: // LinkedIn
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                break;
            case 3: // Copy Link
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
                break;
        }
    });
});

// Comment form submission
const commentForm = document.querySelector('.comment-form');
commentForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const textarea = e.target.querySelector('textarea');
    const nameInput = e.target.querySelector('input[type="text"]');
    const emailInput = e.target.querySelector('input[type="email"]');
    
    if (textarea.value && nameInput.value && emailInput.value) {
        // Create new comment element
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${nameInput.value}&background=2ecc71&color=fff" alt="${nameInput.value}">
            <div class="comment-content">
                <div class="comment-header">
                    <strong>${nameInput.value}</strong>
                    <span>Just now</span>
                </div>
                <p>${textarea.value}</p>
            </div>
        `;
        
        // Add to comments list
        document.querySelector('.comments-list').prepend(newComment);
        
        // Reset form
        e.target.reset();
        
        // Show success message
        alert('Comment posted successfully!');
    }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Back to top button
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

// Search functionality
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

searchBtn?.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
    }
});

searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadArticle();
    
    // Add smooth scroll behavior
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
                behavior: 'smooth'
            });
        }
    });
});
});