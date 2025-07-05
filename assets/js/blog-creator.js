/**
 * Enhanced Blog Creation System for KBN Admin Dashboard
 * This file contains functions to create professional blog posts with full HTML generation
 */

// Enhanced Blog Post Creation Functions
function enhancedSaveBlogPost() {
    const title = document.getElementById('postTitle').value;
    const subtitle = document.getElementById('postSubtitle').value;
    const category = document.getElementById('postCategory').value;
    const status = document.getElementById('postStatus').value;
    const author = document.getElementById('postAuthor').value;
    const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim());
    const leadParagraph = document.getElementById('postLead').value;
    const content = document.getElementById('postContent').value;
    const image = document.getElementById('postImage').value;
    const ctaTitle = document.getElementById('postCTATitle').value;
    const ctaDesc = document.getElementById('postCTADesc').value;

    if (!title || !content) {
        alert('Please fill in the title and content fields');
        return;
    }

    // Generate filename from title
    const filename = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50) + '.html';

    // Convert markdown-style content to HTML
    const htmlContent = convertMarkdownToHTML(content);
    
    // Get current date
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Use default image if none provided
    const featuredImage = image || 'blog-kingdom-business.svg';

    // Generate full HTML blog post
    const blogPostHTML = generateBlogPostHTML({
        title,
        subtitle,
        category,
        author,
        date: currentDate,
        tags,
        leadParagraph,
        htmlContent,
        featuredImage,
        ctaTitle: ctaTitle || 'Ready to Start Your Journey?',
        ctaDesc: ctaDesc || 'Join KBN today and transform your business with Kingdom principles.',
        filename
    });

    // Create new post entry for the dashboard
    const newPost = {
        id: `POST${String(mockBlogPosts.length + 1).padStart(3, '0')}`,
        title,
        content: htmlContent,
        status,
        author,
        date: currentDate,
        category,
        tags,
        image: featuredImage,
        filename
    };

    mockBlogPosts.push(newPost);
    
    // Show download link for the blog post
    showBlogPostDownload(filename, blogPostHTML, status);
    closeModal();
    
    // Refresh content section if visible
    if (document.getElementById('content').classList.contains('active')) {
        updateContentSection();
    }
}

// Convert markdown-style formatting to HTML
function convertMarkdownToHTML(markdown) {
    let html = markdown;
    
    // Convert headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="article-section-title">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="article-section-title">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="article-section-title">$1</h1>');
    
    // Convert bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="article-quote">$1</blockquote>');
    
    // Convert lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$1</li>');
    
    // Wrap consecutive list items in ul/ol tags
    html = html.replace(/(<li>.*<\/li>)/gs, function(match) {
        if (match.includes('<li>1</li>')) {
            return '<ol class="article-list">' + match + '</ol>';
        } else {
            return '<ul class="article-list">' + match + '</ul>';
        }
    });
    
    // Convert paragraphs
    html = html.replace(/\n\n/g, '</p><p class="article-paragraph">');
    html = '<p class="article-paragraph">' + html + '</p>';
    
    // Clean up empty paragraphs and fix formatting
    html = html.replace(/<p class="article-paragraph"><\/p>/g, '');
    html = html.replace(/<p class="article-paragraph">(\s*<h[1-6])/g, '$1');
    html = html.replace(/(<\/h[1-6]>\s*)<\/p>/g, '$1');
    html = html.replace(/<p class="article-paragraph">(\s*<blockquote)/g, '$1');
    html = html.replace(/(<\/blockquote>\s*)<\/p>/g, '$1');
    html = html.replace(/<p class="article-paragraph">(\s*<[uo]l)/g, '$1');
    html = html.replace(/(<\/[uo]l>\s*)<\/p>/g, '$1');
    
    return html;
}

// Generate complete HTML blog post file
function generateBlogPostHTML(data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${data.subtitle || data.title}">
    <meta name="keywords" content="${data.tags.join(', ')}">
    <meta name="author" content="${data.author}">
    <title>${data.title} - KBN Financial Boutique</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
    
    <!-- CSS -->
    <link rel="stylesheet" href="../assets/css/base.css">
    <link rel="stylesheet" href="../assets/css/layout.css">
    <link rel="stylesheet" href="../assets/css/components.css">
    <link rel="stylesheet" href="../assets/css/utils.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav__container">
                <div class="nav__logo">
                    <img src="../assets/img/kbn-logo.png" alt="KBN Financial Boutique Logo" class="nav__logo-img">
                </div>
                <ul class="nav__menu" id="nav-menu">
                    <li class="nav__item">
                        <a href="../index.html" class="nav__link">Home</a>
                    </li>
                    <li class="nav__item">
                        <a href="../who-we-are.html" class="nav__link">Who We Are</a>
                    </li>
                    <li class="nav__item">
                        <a href="../loan.html" class="nav__link">Apply</a>
                    </li>
                    <li class="nav__item">
                        <a href="index.html" class="nav__link nav__link--active">Blog</a>
                    </li>
                    <li class="nav__item">
                        <a href="../contact.html" class="nav__link">Contact</a>
                    </li>
                    <li class="nav__item">
                        <a href="../login.html" class="nav__link nav__link--login">Login</a>
                    </li>
                </ul>
                <div class="nav__toggle" id="nav-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    </header>

    <main class="main">
        <!-- Article Header -->
        <section class="article-header">
            <div class="container">
                <div class="article-header__content">
                    <div class="article-meta">
                        <span class="article-meta__date">${data.date}</span>
                        <span class="article-meta__author">By ${data.author}</span>
                        <span class="article-meta__category">${data.category}</span>
                    </div>
                    <h1 class="article-title">${data.title}</h1>
                    ${data.subtitle ? `<p class="article-subtitle">${data.subtitle}</p>` : ''}
                </div>
                <div class="article-header__image">
                    <img src="../assets/img/${data.featuredImage}" alt="${data.title}" class="article-image">
                </div>
            </div>
        </section>

        <!-- Article Content -->
        <section class="article-content">
            <div class="container">
                <div class="article-body">
                    <div class="article-text">
                        ${data.leadParagraph ? `<p class="lead">${data.leadParagraph}</p>` : ''}
                        
                        ${data.htmlContent}

                        <div class="call-to-action">
                            <h3>${data.ctaTitle}</h3>
                            <p>${data.ctaDesc}</p>
                            <div class="cta-buttons">
                                <a href="../loan.html" class="btn btn--primary">Apply for Funding</a>
                                <a href="../contact.html" class="btn btn--outline">Get Mentorship</a>
                            </div>
                        </div>
                    </div>

                    <!-- Article Sidebar -->
                    <aside class="article-sidebar">
                        <div class="sidebar-widget">
                            <h3 class="widget-title">Related Articles</h3>
                            <div class="related-articles">
                                <article class="related-article">
                                    <div class="related-article__image">
                                        <img src="../assets/img/blog-stewardship.svg" alt="Financial Stewardship">
                                    </div>
                                    <div class="related-article__content">
                                        <h4><a href="financial-stewardship.html">Financial Stewardship in Ministry</a></h4>
                                        <p>Learn how churches can manage finances biblically and effectively.</p>
                                    </div>
                                </article>
                                
                                <article class="related-article">
                                    <div class="related-article__image">
                                        <img src="../assets/img/blog-microfinance.svg" alt="Microfinance Impact">
                                    </div>
                                    <div class="related-article__content">
                                        <h4><a href="microfinance-impact.html">The Impact of Microfinance in Rural Rwanda</a></h4>
                                        <p>Discover how small loans are transforming rural communities.</p>
                                    </div>
                                </article>
                            </div>
                        </div>

                        <div class="sidebar-widget">
                            <h3 class="widget-title">Kingdom Business Resources</h3>
                            <ul class="resource-list">
                                <li><a href="../resources/business-plan-template.pdf">Kingdom Business Plan Template</a></li>
                                <li><a href="../resources/biblical-principles-guide.pdf">Biblical Principles in Business</a></li>
                                <li><a href="../resources/impact-measurement-tools.pdf">Impact Measurement Tools</a></li>
                                <li><a href="../resources/networking-guide.pdf">Kingdom Entrepreneurs Network</a></li>
                            </ul>
                        </div>

                        <div class="sidebar-widget">
                            <h3 class="widget-title">Newsletter</h3>
                            <p>Get Kingdom business insights and updates delivered to your inbox.</p>
                            <form class="newsletter-form">
                                <input type="email" class="newsletter-input" placeholder="Your email address">
                                <button type="submit" class="newsletter-btn">Subscribe</button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        <!-- Comments Section -->
        <section class="comments-section">
            <div class="container">
                <h2>Comments</h2>
                <div class="comments-list">
                    <div class="comment">
                        <div class="comment__avatar">
                            <img src="../assets/img/avatar-1.svg" alt="John Muhire" class="comment__avatar-img">
                        </div>
                        <div class="comment__content">
                            <div class="comment__header">
                                <h4 class="comment__author">John Muhire</h4>
                                <span class="comment__date">March 15, 2024</span>
                            </div>
                            <p class="comment__text">This is exactly what our community needs. The combination of biblical principles with practical business advice is so valuable. Thank you for this insight!</p>
                        </div>
                    </div>
                    
                    <div class="comment">
                        <div class="comment__avatar">
                            <img src="../assets/img/avatar-2.svg" alt="Grace Uwimana" class="comment__avatar-img">
                        </div>
                        <div class="comment__content">
                            <div class="comment__header">
                                <h4 class="comment__author">Grace Uwimana</h4>
                                <span class="comment__date">March 14, 2024</span>
                            </div>
                            <p class="comment__text">I've been looking for guidance on how to integrate my faith with my business practices. This article provides clear, actionable steps. Bless you!</p>
                        </div>
                    </div>
                </div>
                
                <div class="comment-form">
                    <h3>Leave a Comment</h3>
                    <form>
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Comment</label>
                            <textarea class="form-textarea" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn--primary">Post Comment</button>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer__content">
                <div class="footer__section">
                    <h3>KBN Financial Boutique</h3>
                    <p>We are Intentional, International and Generational</p>
                    <div class="footer__social">
                        <a href="#" class="footer__social-link">Facebook</a>
                        <a href="#" class="footer__social-link">Twitter</a>
                        <a href="#" class="footer__social-link">LinkedIn</a>
                    </div>
                </div>
                <div class="footer__section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="../who-we-are.html">Who We Are</a></li>
                        <li><a href="../loan.html">Apply</a></li>
                        <li><a href="index.html">Blog</a></li>
                    </ul>
                </div>
                <div class="footer__section">
                    <h4>Contact</h4>
                    <p>KG 176 Str, Gasabo, Remera<br>Kigali, Rwanda</p>
                    <p>+250 795 308 627</p>
                    <p>info@kbn.com</p>
                </div>
            </div>
            <div class="footer__bottom">
                <p>&copy; 2025 KBN Financial Boutique. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../assets/js/main.js"></script>
</body>
</html>`;
}

// Show blog post download modal
function showBlogPostDownload(filename, htmlContent, status) {
    const modal = createModal('Blog Post Created Successfully!', `
        <div style="text-align: center; padding: 20px 0;">
            <div style="background: rgba(52, 168, 83, 0.1); color: var(--admin-accent); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                <i data-feather="check-circle" style="width: 48px; height: 48px; margin-bottom: 16px;"></i>
                <h3 style="margin: 0 0 8px; color: var(--admin-accent);">Blog Post ${status === 'published' ? 'Published' : 'Created'}</h3>
                <p style="margin: 0; color: var(--admin-text);">Your blog post has been generated with professional styling</p>
            </div>
            
            <div style="background: var(--admin-secondary); padding: 20px; border-radius: 12px; margin-bottom: 24px; text-align: left;">
                <h4 style="margin: 0 0 12px; color: var(--admin-dark);">Generated File Details:</h4>
                <div style="font-family: monospace; background: white; padding: 12px; border-radius: 8px; font-size: 14px;">
                    <strong>Filename:</strong> ${filename}<br>
                    <strong>Size:</strong> ${(htmlContent.length / 1024).toFixed(1)} KB<br>
                    <strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}<br>
                    <strong>Location:</strong> /blog/${filename}
                </div>
            </div>
            
            <div style="margin-bottom: 24px;">
                <p style="color: var(--admin-text-secondary); margin-bottom: 12px;">
                    The blog post includes all professional styling, sidebar widgets, comments section, and is ready to upload to your blog directory.
                </p>
            </div>
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="downloadBlogPost('${filename}', \`${htmlContent.replace(/`/g, '\\`')}\`)">
                <i data-feather="download"></i>
                Download HTML File
            </button>
            <button class="btn btn-secondary" onclick="previewBlogPost()">
                <i data-feather="eye"></i>
                Preview Post
            </button>
            <button class="btn btn-secondary" onclick="showFormattingHelp()">
                <i data-feather="help-circle"></i>
                Formatting Guide
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                <i data-feather="x"></i>
                Close
            </button>
        </div>
    `, 'large');
    feather.replace();
}

// Download blog post file
function downloadBlogPost(filename, htmlContent) {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showSuccessMessage(`Blog post "${filename}" downloaded successfully!`);
}

// Show formatting help modal
function showFormattingHelp() {
    const modal = createModal('Formatting Help & Guidelines', `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div>
                    <h3 style="color: var(--admin-primary); margin-bottom: 16px;">Headers & Structure</h3>
                    <div style="background: var(--admin-secondary); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                        <code style="display: block; margin-bottom: 8px;"># Main Title</code>
                        <code style="display: block; margin-bottom: 8px;">## Section Title</code>
                        <code style="display: block; margin-bottom: 8px;">### Subsection</code>
                        <small style="color: var(--admin-text-secondary);">Use ## for main sections, ### for subsections</small>
                    </div>
                    
                    <h3 style="color: var(--admin-primary); margin-bottom: 16px;">Text Formatting</h3>
                    <div style="background: var(--admin-secondary); padding: 16px; border-radius: 8px;">
                        <code style="display: block; margin-bottom: 8px;">**Bold text**</code>
                        <code style="display: block; margin-bottom: 8px;">*Italic text*</code>
                        <code style="display: block; margin-bottom: 8px;">~~Strikethrough~~</code>
                        <small style="color: var(--admin-text-secondary);">Use **bold** for emphasis, *italic* for subtle emphasis</small>
                    </div>
                </div>
                
                <div>
                    <h3 style="color: var(--admin-primary); margin-bottom: 16px;">Lists & Quotes</h3>
                    <div style="background: var(--admin-secondary); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                        <code style="display: block; margin-bottom: 8px;">- Bullet point</code>
                        <code style="display: block; margin-bottom: 8px;">- Another point</code>
                        <code style="display: block; margin-bottom: 8px;">1. Numbered list</code>
                        <code style="display: block; margin-bottom: 8px;">2. Second item</code>
                        <small style="color: var(--admin-text-secondary);">Lists are automatically styled with proper spacing</small>
                    </div>
                    
                    <h3 style="color: var(--admin-primary); margin-bottom: 16px;">Quotes</h3>
                    <div style="background: var(--admin-secondary); padding: 16px; border-radius: 8px;">
                        <code style="display: block; margin-bottom: 8px;">> This is a quote</code>
                        <code style="display: block; margin-bottom: 8px;">> Multi-line quote</code>
                        <small style="color: var(--admin-text-secondary);">Quotes will appear with special styling and icons</small>
                    </div>
                </div>
            </div>
            
            <div style="background: rgba(52, 168, 83, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3 style="color: var(--admin-accent); margin-bottom: 12px;">Professional Features Included</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                        <p style="margin: 4px 0;">✓ Professional article header with meta info</p>
                        <p style="margin: 4px 0;">✓ Two-column layout with sidebar</p>
                        <p style="margin: 4px 0;">✓ Related articles section</p>
                        <p style="margin: 4px 0;">✓ Kingdom Business resources</p>
                    </div>
                    <div>
                        <p style="margin: 4px 0;">✓ Newsletter signup widget</p>
                        <p style="margin: 4px 0;">✓ Comments section with avatars</p>
                        <p style="margin: 4px 0;">✓ Call-to-action buttons</p>
                        <p style="margin: 4px 0;">✓ Mobile-responsive design</p>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button class="btn btn-primary" onclick="closeModal()">
                    <i data-feather="check"></i>
                    Got it, thanks!
                </button>
            </div>
        </div>
    `, 'large');
    feather.replace();
} 