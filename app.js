class BankingApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.loadUser();
        if (this.currentUser) {
            this.renderApp();
        } else {
            this.renderLogin();
        }
    }

    loadUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    saveUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    renderLogin() {
        document.getElementById('app').innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <div class="login-header">
                        <div class="login-logo">🏦</div>
                        <h1>MY Banking</h1>
                        <p>Welcome back! Please login to your account</p>
                    </div>
                    <div class="error-message" id="loginError"></div>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" id="username" placeholder="Enter your username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" placeholder="Enter your password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'vargees' && password === '12345') {
            this.currentUser = this.initializeUserData(username);
            this.saveUser();
            this.renderApp();
        } else {
            const errorEl = document.getElementById('loginError');
            errorEl.textContent = 'Invalid username or password. Please try again.';
            errorEl.classList.add('show');
            setTimeout(() => {
                errorEl.classList.remove('show');
            }, 3000);
        }
    }

    initializeUserData(username) {
        const storedData = localStorage.getItem(`user_${username}`);
        if (storedData) {
            return JSON.parse(storedData);
        }

        return {
            username: username,
            name: 'Vargees Kumar',
            email: 'vargees@mybanking.com',
            accountNo: 'ACC' + Math.random().toString().slice(2, 12),
            balance: 50000,
            transactions: [
                {
                    id: 1,
                    date: new Date().toISOString(),
                    description: 'Initial Deposit',
                    type: 'credit',
                    amount: 50000,
                    balance: 50000
                }
            ],
            fixedDeposits: [],
            notifications: [
                {
                    id: 1,
                    type: 'credit',
                    message: 'Initial deposit of ₹50,000',
                    date: new Date().toISOString()
                }
            ]
        };
    }

    renderApp() {
        document.getElementById('app').innerHTML = `
            <div class="overlay" id="overlay"></div>
            ${this.renderNavbar()}
            <div class="main-content">
                <div id="pageContent"></div>
            </div>
        `;

        this.renderPage(this.currentPage);
        this.attachNavbarListeners();
    }

    renderNavbar() {
        return `
            <nav class="navbar">
                <div class="navbar-container">
                    <div class="navbar-brand">
                        <div class="navbar-logo">🏦</div>
                        <span>MY Banking</span>
                    </div>
                    <div class="navbar-menu">
                        <a href="#" data-page="home" class="active">Home</a>
                        <a href="#" data-page="fixed-deposit">Fixed Deposit</a>
                        <a href="#" data-page="statement">Statement</a>
                        <a href="#" data-page="about">About</a>
                        <a href="#" data-page="contact">Contact</a>
                    </div>
                    <div class="navbar-actions">
                        <button class="icon-btn" id="notificationBtn">
                            🔔
                            ${this.currentUser.notifications.length > 0 ? `<span class="notification-badge">${this.currentUser.notifications.length}</span>` : ''}
                        </button>
                        <button class="icon-btn" id="profileBtn">👤</button>
                    </div>
                </div>
            </nav>
            <div class="popover" id="profilePopover">
                <div class="popover-header">Profile Information</div>
                <div class="profile-info">
                    <div class="profile-item">
                        <label>Name</label>
                        <span>${this.currentUser.name}</span>
                    </div>
                    <div class="profile-item">
                        <label>Email</label>
                        <span>${this.currentUser.email}</span>
                    </div>
                    <div class="profile-item">
                        <label>Account Number</label>
                        <span>${this.currentUser.accountNo}</span>
                    </div>
                    <div class="profile-item">
                        <label>Username</label>
                        <span>${this.currentUser.username}</span>
                    </div>
                </div>
                <button class="btn btn-secondary" id="logoutBtn" style="margin-top: 16px;">Logout</button>
            </div>
            <div class="popover" id="notificationPopover" style="max-width: 360px;">
                <div class="popover-header">Notifications</div>
                <div class="notification-list">
                    ${this.renderNotifications()}
                </div>
            </div>
        `;
    }

    renderNotifications() {
        if (this.currentUser.notifications.length === 0) {
            return '<div class="empty-state"><p>No notifications</p></div>';
        }

        return this.currentUser.notifications
            .slice()
            .reverse()
            .map(notif => `
                <div class="notification-item">
                    <div class="notification-icon ${notif.type}">
                        ${notif.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div class="notification-content">
                        <p>${notif.message}</p>
                        <span>${this.formatDate(notif.date)}</span>
                    </div>
                </div>
            `).join('');
    }

    attachNavbarListeners() {
        document.querySelectorAll('.navbar-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigateTo(page);
            });
        });

        const profileBtn = document.getElementById('profileBtn');
        const profilePopover = document.getElementById('profilePopover');
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationPopover = document.getElementById('notificationPopover');
        const overlay = document.getElementById('overlay');

        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePopover(profilePopover, profileBtn);
        });

        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePopover(notificationPopover, notificationBtn);
        });

        document.addEventListener('click', (e) => {
            if (!profilePopover.contains(e.target) && !profileBtn.contains(e.target)) {
                profilePopover.classList.remove('show');
                overlay.classList.remove('show');
            }
            if (!notificationPopover.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationPopover.classList.remove('show');
                overlay.classList.remove('show');
            }
        });

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    togglePopover(popover, button) {
        const overlay = document.getElementById('overlay');
        const isVisible = popover.classList.contains('show');

        document.querySelectorAll('.popover').forEach(p => p.classList.remove('show'));
        overlay.classList.remove('show');

        if (!isVisible) {
            const rect = button.getBoundingClientRect();
            popover.style.top = `${rect.bottom + 8}px`;
            popover.style.right = `${window.innerWidth - rect.right}px`;
            popover.classList.add('show');
            overlay.classList.add('show');
        }
    }

    navigateTo(page) {
        this.currentPage = page;
        document.querySelectorAll('.navbar-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
        this.renderPage(page);
    }

    renderPage(page) {
        const contentEl = document.getElementById('pageContent');

        switch(page) {
            case 'home':
                contentEl.innerHTML = this.renderHomePage();
                this.attachHomeListeners();
                break;
            case 'fixed-deposit':
                contentEl.innerHTML = this.renderFixedDepositPage();
                this.attachFDListeners();
                break;
            case 'statement':
                contentEl.innerHTML = this.renderStatementPage();
                break;
            case 'about':
                contentEl.innerHTML = this.renderAboutPage();
                break;
            case 'contact':
                contentEl.innerHTML = this.renderContactPage();
                this.attachContactListeners();
                break;
        }
    }

    renderHomePage() {
        const monthlyAvg = this.calculateMonthlyAverage();
        const recentTransactions = this.currentUser.transactions.slice(-5).reverse();

        return `
            <div class="page-header">
                <h1>Welcome back, ${this.currentUser.name.split(' ')[0]}! 👋</h1>
                <p>Here's an overview of your banking activity</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <h3>Current Balance</h3>
                        <div class="stat-icon primary">💰</div>
                    </div>
                    <div class="stat-value">₹${this.formatCurrency(this.currentUser.balance)}</div>
                    <div class="stat-change">Account balance</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <h3>Monthly Average</h3>
                        <div class="stat-icon success">📊</div>
                    </div>
                    <div class="stat-value">₹${this.formatCurrency(monthlyAvg)}</div>
                    <div class="stat-change">Average balance this month</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <h3>Total Transactions</h3>
                        <div class="stat-icon warning">📝</div>
                    </div>
                    <div class="stat-value">${this.currentUser.transactions.length}</div>
                    <div class="stat-change">All time transactions</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">Quick Transaction</div>
                <div class="transaction-actions">
                    <div class="action-group">
                        <label>Credit Amount</label>
                        <input type="number" id="creditAmount" placeholder="Enter amount to credit" min="1">
                        <input type="text" id="creditDescription" placeholder="Description (optional)">
                        <div class="action-buttons">
                            <button class="btn btn-success" id="creditBtn">Credit Money</button>
                        </div>
                    </div>

                    <div class="action-group">
                        <label>Debit Amount</label>
                        <input type="number" id="debitAmount" placeholder="Enter amount to debit" min="1">
                        <input type="text" id="debitDescription" placeholder="Description (optional)">
                        <div class="action-buttons">
                            <button class="btn btn-danger" id="debitBtn">Debit Money</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">Recent Transactions</div>
                <div class="transaction-list">
                    ${recentTransactions.length > 0 ? recentTransactions.map(t => this.renderTransaction(t)).join('') : '<div class="empty-state"><div class="empty-state-icon">📭</div><h3>No transactions yet</h3><p>Your recent transactions will appear here</p></div>'}
                </div>
            </div>
        `;
    }

    renderTransaction(transaction) {
        return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-type ${transaction.type}">
                        ${transaction.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.description}</h4>
                        <p>${this.formatDate(transaction.date)}</p>
                    </div>
                </div>
                <div class="transaction-amount">
                    <div class="amount ${transaction.type}">
                        ${transaction.type === 'credit' ? '+' : '-'}₹${this.formatCurrency(transaction.amount)}
                    </div>
                    <div class="balance">Balance: ₹${this.formatCurrency(transaction.balance)}</div>
                </div>
            </div>
        `;
    }

    attachHomeListeners() {
        document.getElementById('creditBtn').addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('creditAmount').value);
            const description = document.getElementById('creditDescription').value || 'Money credited';

            if (amount && amount > 0) {
                this.addTransaction('credit', amount, description);
                document.getElementById('creditAmount').value = '';
                document.getElementById('creditDescription').value = '';
                this.renderPage('home');
            } else {
                alert('Please enter a valid amount');
            }
        });

        document.getElementById('debitBtn').addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('debitAmount').value);
            const description = document.getElementById('debitDescription').value || 'Money debited';

            if (amount && amount > 0) {
                if (amount > this.currentUser.balance) {
                    alert('Insufficient balance');
                    return;
                }
                this.addTransaction('debit', amount, description);
                document.getElementById('debitAmount').value = '';
                document.getElementById('debitDescription').value = '';
                this.renderPage('home');
            } else {
                alert('Please enter a valid amount');
            }
        });
    }

    addTransaction(type, amount, description) {
        const newBalance = type === 'credit'
            ? this.currentUser.balance + amount
            : this.currentUser.balance - amount;

        const transaction = {
            id: this.currentUser.transactions.length + 1,
            date: new Date().toISOString(),
            description: description,
            type: type,
            amount: amount,
            balance: newBalance
        };

        this.currentUser.balance = newBalance;
        this.currentUser.transactions.push(transaction);

        const notification = {
            id: this.currentUser.notifications.length + 1,
            type: type,
            message: `${type === 'credit' ? 'Credited' : 'Debited'} ₹${this.formatCurrency(amount)} - ${description}`,
            date: new Date().toISOString()
        };
        this.currentUser.notifications.push(notification);

        this.saveUserData();
    }

    renderFixedDepositPage() {
        return `
            <div class="page-header">
                <h1>Fixed Deposits 📈</h1>
                <p>Create and manage your fixed deposits</p>
            </div>

            <div class="card">
                <div class="card-header">Create New Fixed Deposit</div>
                <form id="fdForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Amount (₹)</label>
                            <input type="number" id="fdAmount" placeholder="Enter amount" min="1000" required>
                        </div>
                        <div class="form-group">
                            <label>Duration (months)</label>
                            <input type="number" id="fdDuration" placeholder="Enter duration" min="6" max="120" required>
                        </div>
                        <div class="form-group">
                            <label>Interest Rate (%)</label>
                            <input type="number" id="fdRate" value="7.5" step="0.1" min="1" max="15" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Create Fixed Deposit</button>
                </form>
            </div>

            <div class="card">
                <div class="card-header">Active Fixed Deposits</div>
                <div class="fd-list">
                    ${this.currentUser.fixedDeposits.length > 0
                        ? this.currentUser.fixedDeposits.map(fd => this.renderFDCard(fd)).join('')
                        : '<div class="empty-state"><div class="empty-state-icon">💼</div><h3>No fixed deposits</h3><p>Create your first fixed deposit to start earning interest</p></div>'}
                </div>
            </div>
        `;
    }

    renderFDCard(fd) {
        const maturityAmount = fd.amount + (fd.amount * fd.rate * fd.duration / 1200);
        const startDate = new Date(fd.startDate);
        const maturityDate = new Date(startDate);
        maturityDate.setMonth(maturityDate.getMonth() + fd.duration);

        return `
            <div class="fd-card">
                <h3>FD #${fd.id}</h3>
                <div class="fd-amount">₹${this.formatCurrency(fd.amount)}</div>
                <div class="fd-details">
                    <div>
                        <div>Rate: ${fd.rate}%</div>
                        <div>Duration: ${fd.duration} months</div>
                    </div>
                    <div style="text-align: right;">
                        <div>Maturity: ₹${this.formatCurrency(maturityAmount)}</div>
                        <div>On: ${maturityDate.toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        `;
    }

    attachFDListeners() {
        document.getElementById('fdForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const amount = parseFloat(document.getElementById('fdAmount').value);
            const duration = parseInt(document.getElementById('fdDuration').value);
            const rate = parseFloat(document.getElementById('fdRate').value);

            if (amount > this.currentUser.balance) {
                alert('Insufficient balance for this fixed deposit');
                return;
            }

            const fd = {
                id: this.currentUser.fixedDeposits.length + 1,
                amount: amount,
                duration: duration,
                rate: rate,
                startDate: new Date().toISOString()
            };

            this.currentUser.fixedDeposits.push(fd);
            this.addTransaction('debit', amount, `Fixed Deposit #${fd.id} created`);

            this.saveUserData();
            this.renderPage('fixed-deposit');
        });
    }

    renderStatementPage() {
        return `
            <div class="page-header">
                <h1>Account Statement 📋</h1>
                <p>View all your transaction history</p>
            </div>

            <div class="card">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.currentUser.transactions.slice().reverse().map(t => `
                                <tr>
                                    <td>${this.formatDate(t.date)}</td>
                                    <td>${t.description}</td>
                                    <td><span class="badge ${t.type}">${t.type === 'credit' ? 'Credit' : 'Debit'}</span></td>
                                    <td style="color: ${t.type === 'credit' ? 'var(--secondary-color)' : 'var(--danger-color)'}; font-weight: 600;">
                                        ${t.type === 'credit' ? '+' : '-'}₹${this.formatCurrency(t.amount)}
                                    </td>
                                    <td>₹${this.formatCurrency(t.balance)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderAboutPage() {
        return `
            <div class="about-section">
                <div class="page-header">
                    <h1>About MY Banking 🏦</h1>
                    <p>Your trusted partner in financial excellence</p>
                </div>

                <div class="card">
                    <h2 style="margin-bottom: 16px; font-size: 24px;">Our Mission</h2>
                    <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 24px;">
                        At MY Banking, we are committed to providing exceptional banking services that empower our customers
                        to achieve their financial goals. We combine cutting-edge technology with personalized service to
                        deliver a banking experience that is secure, convenient, and tailored to your needs.
                    </p>

                    <h2 style="margin-bottom: 16px; font-size: 24px;">Our Vision</h2>
                    <p style="color: var(--text-secondary); line-height: 1.8;">
                        To be the most trusted and innovative banking partner, transforming the way people manage their
                        finances through digital excellence and customer-centric solutions.
                    </p>
                </div>

                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🔒</div>
                        <h3>Secure Banking</h3>
                        <p>Bank-grade security with multi-layer encryption to protect your financial data</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">⚡</div>
                        <h3>Instant Transfers</h3>
                        <p>Lightning-fast transactions with real-time balance updates</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📱</div>
                        <h3>24/7 Access</h3>
                        <p>Access your account anytime, anywhere with our digital platform</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">💎</div>
                        <h3>Premium Services</h3>
                        <p>Exclusive benefits and personalized wealth management solutions</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🎯</div>
                        <h3>Investment Options</h3>
                        <p>Grow your wealth with our fixed deposits and investment products</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">💬</div>
                        <h3>Expert Support</h3>
                        <p>Dedicated customer support team ready to assist you</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderContactPage() {
        return `
            <div class="contact-section">
                <div class="page-header">
                    <h1>Contact Us 📞</h1>
                    <p>We're here to help! Reach out to us anytime</p>
                </div>

                <div class="contact-info">
                    <div class="contact-item">
                        <div class="contact-item-icon">📍</div>
                        <h3>Address</h3>
                        <p>123 Financial District<br>Mumbai, Maharashtra<br>India - 400001</p>
                    </div>
                    <div class="contact-item">
                        <div class="contact-item-icon">📞</div>
                        <h3>Phone</h3>
                        <p>+91 1800 123 4567<br>+91 22 1234 5678</p>
                    </div>
                    <div class="contact-item">
                        <div class="contact-item-icon">📧</div>
                        <h3>Email</h3>
                        <p>support@mybanking.com<br>info@mybanking.com</p>
                    </div>
                    <div class="contact-item">
                        <div class="contact-item-icon">🕐</div>
                        <h3>Support Hours</h3>
                        <p>Mon - Fri: 9:00 AM - 6:00 PM<br>Sat: 10:00 AM - 4:00 PM<br>Sun: Closed</p>
                    </div>
                </div>

                <div class="contact-form">
                    <h2 style="margin-bottom: 24px; font-size: 24px;">Send us a Message</h2>
                    <div class="success-message" id="contactSuccess">Your message has been sent successfully!</div>
                    <form id="contactForm">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="contactName" placeholder="Enter your name" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="contactEmail" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label>Subject</label>
                            <input type="text" id="contactSubject" placeholder="Enter subject" required>
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea id="contactMessage" placeholder="Enter your message" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        `;
    }

    attachContactListeners() {
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const successMsg = document.getElementById('contactSuccess');
            successMsg.classList.add('show');

            document.getElementById('contactForm').reset();

            setTimeout(() => {
                successMsg.classList.remove('show');
            }, 5000);
        });
    }

    calculateMonthlyAverage() {
        if (this.currentUser.transactions.length === 0) return 0;

        const total = this.currentUser.transactions.reduce((sum, t) => sum + t.balance, 0);
        return total / this.currentUser.transactions.length;
    }

    formatCurrency(amount) {
        return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    saveUserData() {
        localStorage.setItem(`user_${this.currentUser.username}`, JSON.stringify(this.currentUser));
        this.saveUser();
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.renderLogin();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BankingApp();
});
