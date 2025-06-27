// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthentication();

    // Initialize dashboard components
    initializeSidebar();
    initializeCharts();
    initializeNotifications();
    initializeUserMenu();
    initializeQuickActions();

    // Dashboard data (in real app, this would come from API)
    const dashboardData = {
        portfolio: {
            totalValue: 125430.50,
            totalReturns: 15230.75,
            availableBalance: 8500.00,
            activeInvestments: 7
        },
        investments: [
            {
                id: 1,
                name: 'Growth Fund A',
                type: 'short-term',
                amount: 25000,
                return: 12.5,
                status: 'active',
                maturity: '2025-03-15',
                icon: 'fa-rocket'
            },
            {
                id: 2,
                name: 'Wealth Builder Pro',
                type: 'long-term',
                amount: 50000,
                return: 18.3,
                status: 'active',
                maturity: '2027-12-20',
                icon: 'fa-tree'
            },
            {
                id: 3,
                name: 'Secure Income',
                type: 'short-term',
                amount: 15000,
                return: 8.7,
                status: 'matured',
                maturity: '2025-01-10',
                icon: 'fa-shield-alt'
            }
        ],
        chartData: {
            portfolio: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [95000, 98000, 102000, 108000, 115000, 125430]
            },
            allocation: {
                labels: ['Short-term', 'Long-term', 'Cash'],
                data: [45, 35, 20],
                colors: ['#4F46E5', '#10B981', '#F59E0B']
            }
        }
    };

    // Update dashboard with data
    updateDashboardStats(dashboardData.portfolio);
    updateInvestmentsTable(dashboardData.investments);

    function checkAuthentication() {
        const userSession = localStorage.getItem('userSession');
        if (!userSession) {
            window.location.href = 'login.html';
            return;
        }

        const session = JSON.parse(userSession);
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);

        // Check if session is expired (24 hours)
        if (hoursSinceLogin > 24 && !session.remember) {
            localStorage.removeItem('userSession');
            window.location.href = 'login.html';
            return;
        }

        // Update user info in header
        updateUserInfo(session);
    }

    function updateUserInfo(session) {
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');

        if (userName && session.firstName) {
            userName.textContent = `${session.firstName} ${session.lastName || ''}`.trim();
        }

        if (userRole) {
            userRole.textContent = session.verified ? 'Verified Investor' : 'Premium Investor';
        }
    }

    function initializeSidebar() {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
                mainContent.classList.toggle('sidebar-open');
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    mainContent.classList.remove('sidebar-open');
                }
            }
        });

        // Handle sidebar navigation
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                
                // Add active class to clicked link
                this.parentElement.classList.add('active');
                
                // Handle navigation (in real app, this would route to different views)
                const section = this.getAttribute('href').substring(1);
                handleNavigation(section);
            });
        });
    }

    function handleNavigation(section) {
        console.log(`Navigating to: ${section}`);
        
        // In a real application, you would show/hide different sections
        // or use a router to load different components
        switch(section) {
            case 'overview':
                showNotification('Overview section is already active', 'info');
                break;
            case 'portfolio':
                showNotification('Portfolio view coming soon', 'info');
                break;
            case 'investments':
                showNotification('Investments view coming soon', 'info');
                break;
            case 'transactions':
                showNotification('Transactions view coming soon', 'info');
                break;
            case 'certificates':
                window.location.href = 'certificate.html';
                break;
            case 'settings':
                showNotification('Settings view coming soon', 'info');
                break;
        }
    }

    function initializeCharts() {
        // Portfolio Performance Chart
        const portfolioCtx = document.getElementById('portfolioChart');
        if (portfolioCtx) {
            new Chart(portfolioCtx, {
                type: 'line',
                data: {
                    labels: dashboardData.chartData.portfolio.labels,
                    datasets: [{
                        label: 'Portfolio Value',
                        data: dashboardData.chartData.portfolio.data,
                        borderColor: '#4F46E5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#4F46E5',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            border: {
                                display: false
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            border: {
                                display: false
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + (value / 1000) + 'K';
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
        }

        // Asset Allocation Chart
        const allocationCtx = document.getElementById('allocationChart');
        if (allocationCtx) {
            new Chart(allocationCtx, {
                type: 'doughnut',
                data: {
                    labels: dashboardData.chartData.allocation.labels,
                    datasets: [{
                        data: dashboardData.chartData.allocation.data,
                        backgroundColor: dashboardData.chartData.allocation.colors,
                        borderWidth: 0,
                        cutout: '70%'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Chart controls
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                chartBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update chart data based on selected period
                const period = this.textContent;
                updateChartData(period);
            });
        });
    }

    function updateChartData(period) {
        console.log(`Updating chart data for period: ${period}`);
        // In a real application, you would fetch new data based on the selected period
        showNotification(`Chart updated for ${period} period`, 'success');
    }

    function updateDashboardStats(portfolio) {
        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card');
        
        if (statCards[0]) {
            const totalValue = statCards[0].querySelector('h3');
            const totalChange = statCards[0].querySelector('.stat-change');
            if (totalValue) totalValue.textContent = `$${portfolio.totalValue.toLocaleString()}`;
            if (totalChange) totalChange.textContent = '+12.5%';
        }

        if (statCards[1]) {
            const totalReturns = statCards[1].querySelector('h3');
            const returnsChange = statCards[1].querySelector('.stat-change');
            if (totalReturns) totalReturns.textContent = `$${portfolio.totalReturns.toLocaleString()}`;
            if (returnsChange) returnsChange.textContent = '+8.3%';
        }

        if (statCards[2]) {
            const availableBalance = statCards[2].querySelector('h3');
            if (availableBalance) availableBalance.textContent = `$${portfolio.availableBalance.toLocaleString()}`;
        }

        if (statCards[3]) {
            const activeInvestments = statCards[3].querySelector('h3');
            if (activeInvestments) activeInvestments.textContent = portfolio.activeInvestments.toString();
        }
    }

    function updateInvestmentsTable(investments) {
        const tableBody = document.querySelector('.investments-table tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        investments.forEach(investment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="investment-info">
                        <i class="fas ${investment.icon}"></i>
                        <span>${investment.name}</span>
                    </div>
                </td>
                <td><span class="badge ${investment.type}">${investment.type.replace('-', ' ')}</span></td>
                <td>$${investment.amount.toLocaleString()}</td>
                <td class="positive">+${investment.return}%</td>
                <td><span class="status ${investment.status}">${investment.status}</span></td>
                <td>${formatDate(investment.maturity)}</td>
                <td>
                    <button class="action-btn" onclick="viewInvestment(${investment.id})">
                        <i class="fas ${investment.status === 'matured' ? 'fa-download' : 'fa-eye'}"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function initializeNotifications() {
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', function() {
                showNotificationPanel();
            });
        }
    }

    function showNotificationPanel() {
        // Create notification panel
        const panel = document.createElement('div');
        panel.className = 'notification-panel';
        panel.innerHTML = `
            <div class="notification-panel-header">
                <h3>Notifications</h3>
                <button class="close-panel">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-panel-content">
                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="notification-content">
                        <h4>Investment Matured</h4>
                        <p>Your Secure Income investment has matured. Returns are now available.</p>
                        <span class="notification-time">2 hours ago</span>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fas fa-bell"></i>
                    </div>
                    <div class="notification-content">
                        <h4>New Investment Opportunity</h4>
                        <p>A new high-yield investment opportunity is now available.</p>
                        <span class="notification-time">1 day ago</span>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="notification-content">
                        <h4>Portfolio Update</h4>
                        <p>Your portfolio has gained 2.3% this week.</p>
                        <span class="notification-time">3 days ago</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Show panel
        setTimeout(() => {
            panel.classList.add('show');
        }, 100);

        // Close panel functionality
        const closeBtn = panel.querySelector('.close-panel');
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(panel);
            }, 300);
        });

        // Close when clicking outside
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                closeBtn.click();
            }
        });
    }

    function initializeUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', function() {
                showUserDropdown();
            });
        }
    }

    function showUserDropdown() {
        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown-menu';
        dropdown.innerHTML = `
            <div class="dropdown-item">
                <i class="fas fa-user"></i>
                <span>Profile</span>
            </div>
            <div class="dropdown-item">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
            </div>
            <div class="dropdown-item">
                <i class="fas fa-question-circle"></i>
                <span>Help & Support</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </div>
        `;

        // Position dropdown
        const userMenu = document.querySelector('.user-menu');
        const rect = userMenu.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${rect.bottom + 10}px`;
        dropdown.style.right = '20px';

        document.body.appendChild(dropdown);

        // Show dropdown
        setTimeout(() => {
            dropdown.classList.add('show');
        }, 100);

        // Handle dropdown clicks
        const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const text = this.querySelector('span').textContent;
                
                if (text === 'Logout') {
                    handleLogout();
                } else {
                    showNotification(`${text} feature coming soon`, 'info');
                }
                
                // Close dropdown
                dropdown.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(dropdown);
                }, 300);
            });
        });

        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && !userMenu.contains(e.target)) {
                    dropdown.classList.remove('show');
                    setTimeout(() => {
                        if (document.body.contains(dropdown)) {
                            document.body.removeChild(dropdown);
                        }
                    }, 300);
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }

    function handleLogout() {
        // Clear user session
        localStorage.removeItem('userSession');
        
        // Show logout message
        showNotification('Logged out successfully', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }

    function initializeQuickActions() {
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', function() {
                const actionText = this.querySelector('span').textContent;
                handleQuickAction(actionText);
            });
        });

        // New Investment button
        const newInvestmentBtn = document.querySelector('.section-header .btn-primary');
        if (newInvestmentBtn) {
            newInvestmentBtn.addEventListener('click', function() {
                handleQuickAction('New Investment');
            });
        }
    }

    function handleQuickAction(action) {
        switch(action) {
            case 'New Investment':
                showNotification('Investment wizard coming soon', 'info');
                break;
            case 'Withdraw Funds':
                showNotification('Withdrawal process coming soon', 'info');
                break;
            case 'Download Report':
                showNotification('Generating report...', 'info');
                setTimeout(() => {
                    showNotification('Report downloaded successfully', 'success');
                }, 2000);
                break;
            case 'Contact Support':
                showNotification('Support chat coming soon', 'info');
                break;
            default:
                showNotification(`${action} feature coming soon`, 'info');
        }
    }

    // Global function for investment actions
    window.viewInvestment = function(investmentId) {
        const investment = dashboardData.investments.find(inv => inv.id === investmentId);
        if (investment) {
            if (investment.status === 'matured') {
                showNotification('Downloading investment certificate...', 'info');
                setTimeout(() => {
                    window.location.href = 'certificate.html';
                }, 1000);
            } else {
                showNotification(`Viewing details for ${investment.name}`, 'info');
            }
        }
    };

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
    }

    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Add dynamic styles for notifications and dropdowns
    const dynamicStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border-left: 4px solid var(--primary-color);
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 10000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: var(--secondary-color);
        }
        
        .notification-error {
            border-left-color: #EF4444;
        }
        
        .notification-info {
            border-left-color: #3B82F6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
        }
        
        .notification-content i {
            color: var(--primary-color);
        }
        
        .notification-success .notification-content i {
            color: var(--secondary-color);
        }
        
        .notification-error .notification-content i {
            color: #EF4444;
        }
        
        .notification-info .notification-content i {
            color: #3B82F6;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: all 0.3s ease;
        }
        
        .notification-close:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        .notification-panel {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: white;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
            transition: right 0.3s ease;
            z-index: 10000;
            overflow-y: auto;
        }
        
        .notification-panel.show {
            right: 0;
        }
        
        .notification-panel-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .notification-panel-header h3 {
            margin: 0;
            color: var(--text-primary);
        }
        
        .close-panel {
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.25rem;
            transition: all 0.3s ease;
        }
        
        .close-panel:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        .notification-panel-content {
            padding: 1rem;
        }
        
        .notification-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            transition: background 0.3s ease;
        }
        
        .notification-item:hover {
            background: var(--bg-secondary);
        }
        
        .notification-item .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            flex-shrink: 0;
        }
        
        .notification-item .notification-content h4 {
            margin: 0 0 0.25rem 0;
            color: var(--text-primary);
            font-size: 0.875rem;
        }
        
        .notification-item .notification-content p {
            margin: 0 0 0.5rem 0;
            color: var(--text-secondary);
            font-size: 0.75rem;
            line-height: 1.4;
        }
        
        .notification-time {
            font-size: 0.625rem;
            color: var(--text-light);
        }
        
        .user-dropdown-menu {
            position: fixed;
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border: 1px solid var(--border-color);
            min-width: 200px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 10000;
        }
        
        .user-dropdown-menu.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            cursor: pointer;
            transition: background 0.3s ease;
            color: var(--text-primary);
            font-size: 0.875rem;
        }
        
        .dropdown-item:hover {
            background: var(--bg-secondary);
        }
        
        .dropdown-item.logout {
            color: #EF4444;
        }
        
        .dropdown-item.logout:hover {
            background: rgba(239, 68, 68, 0.1);
        }
        
        .dropdown-divider {
            height: 1px;
            background: var(--border-color);
            margin: 0.5rem 0;
        }
        
        @media (max-width: 768px) {
            .notification-panel {
                width: 100%;
                right: -100%;
            }
            
            .notification {
                left: 20px;
                right: 20px;
                max-width: none;
                transform: translateY(-100%);
            }
            
            .notification.show {
                transform: translateY(0);
            }
        }
    `;

    // Inject dynamic styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);

    // Auto-refresh dashboard data every 30 seconds
    setInterval(() => {
        // In a real application, you would fetch fresh data from the API
        console.log('Refreshing dashboard data...');
    }, 30000);
});