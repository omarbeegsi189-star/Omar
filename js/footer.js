// Footer injection script
document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const footerCSS = `
            <style>
                .site-footer {
                    background: var(--card-bg);
                    backdrop-filter: blur(10px);
                    border-top: 1px solid var(--border-color);
                    color: var(--text-color);
                    padding: 40px 0 20px;
                    margin-top: auto;
                    transition: var(--transition);
                }
                .footer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                .footer-content {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 30px;
                    margin-bottom: 30px;
                }
                .footer-section h3 {
                    font-family: "Cormorant Garamond", serif;
                    font-size: 24px;
                    margin-bottom: 10px;
                    color: var(--text-color);
                }
                .footer-section h4 {
                    font-size: 18px;
                    margin-bottom: 15px;
                    color: var(--text-color);
                }
                .footer-section p {
                    color: var(--muted-text);
                    line-height: 1.6;
                }
                .footer-section ul {
                    list-style: none;
                    padding: 0;
                }
                .footer-section ul li {
                    margin-bottom: 8px;
                }
                .footer-section ul li a {
                    color: var(--link-color);
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                .footer-section ul li a:hover {
                    color: #E94560;
                }
                .social-icons {
                    display: flex;
                    gap: 15px;
                }
                .social-icons a {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    background-color: #E94560;
                    color: white;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 40px;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }
                .social-icons a:hover {
                    background-color: #d43d53;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(233, 69, 96, 0.3);
                }
                .footer-bottom {
                    text-align: center;
                    border-top: 1px solid var(--border-color);
                    padding-top: 20px;
                }
                .footer-bottom p {
                    color: var(--muted-text);
                    font-size: 14px;
                }
                @media (max-width: 768px) {
                    .footer-content {
                        flex-direction: column;
                        text-align: center;
                    }
                    .social-icons {
                        justify-content: center;
                    }
                }
            </style>
        `;
        const footerHTML = `
            <footer class="site-footer">
                <div class="footer-container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h3>Healthy Bites</h3>
                            <p>Delicious, healthy meals delivered to your doorstep.</p>
                        </div>
                        <div class="footer-section">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h4>Follow Us</h4>
                            <div class="social-icons">
                                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2023 Healthy Bites. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
        footerPlaceholder.innerHTML = footerCSS + footerHTML;
    }
});
