// Lucky Draw Application
class LuckyDrawApp {
    constructor() {
        this.users = [];
        this.winners = [];
        this.editingUserId = null;
        
        // DOM Elements
        this.userInput = document.getElementById('userInput');
        this.addUserBtn = document.getElementById('addUserBtn');
        this.userList = document.getElementById('userList');
        this.userCount = document.getElementById('userCount');
        this.drawCount = document.getElementById('drawCount');
        this.drawBtn = document.getElementById('drawBtn');
        this.resetDrawBtn = document.getElementById('resetDrawBtn');
        this.winnerDisplay = document.getElementById('winnerDisplay');
        this.winnersList = document.getElementById('winnersList');
        
        // Modal Elements
        this.editModal = document.getElementById('editModal');
        this.editUserInput = document.getElementById('editUserInput');
        this.saveEditBtn = document.getElementById('saveEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');
        
        // Initialize
        this.init();
    }
    
    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.renderUserList();
        this.updateCounts();
        this.renderWinnersList();
    }
    
    setupEventListeners() {
        // Add user
        this.addUserBtn.addEventListener('click', () => this.addUser());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addUser();
        });
        
        // Draw functionality
        this.drawBtn.addEventListener('click', () => this.executeDraw());
        this.resetDrawBtn.addEventListener('click', () => this.resetDraw());
        
        // Modal functionality
        this.saveEditBtn.addEventListener('click', () => this.saveEdit());
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        
        // Close modal when clicking outside
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.closeEditModal();
            }
        });
    }
    
    // User Management
    addUser() {
        const userName = this.userInput.value.trim();
        
        if (!userName) {
            this.showNotification('Please enter a user name', 'error');
            return;
        }
        
        if (this.users.some(user => user.name.toLowerCase() === userName.toLowerCase())) {
            this.showNotification('User already exists', 'error');
            return;
        }
        
        const user = {
            id: Date.now().toString(),
            name: userName,
            addedAt: new Date().toISOString()
        };
        
        this.users.push(user);
        this.userInput.value = '';
        this.renderUserList();
        this.updateCounts();
        this.saveToLocalStorage();
        this.showNotification('User added successfully', 'success');
    }
    
    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        this.editingUserId = userId;
        this.editUserInput.value = user.name;
        this.editModal.style.display = 'flex';
        this.editUserInput.focus();
    }
    
    saveEdit() {
        const newName = this.editUserInput.value.trim();
        
        if (!newName) {
            this.showNotification('Please enter a user name', 'error');
            return;
        }
        
        if (this.users.some(user => 
            user.id !== this.editingUserId && 
            user.name.toLowerCase() === newName.toLowerCase()
        )) {
            this.showNotification('User already exists', 'error');
            return;
        }
        
        const userIndex = this.users.findIndex(u => u.id === this.editingUserId);
        if (userIndex !== -1) {
            this.users[userIndex].name = newName;
            this.renderUserList();
            this.updateCounts();
            this.saveToLocalStorage();
            this.showNotification('User updated successfully', 'success');
        }
        
        this.closeEditModal();
    }
    
    closeEditModal() {
        this.editModal.style.display = 'none';
        this.editingUserId = null;
        this.editUserInput.value = '';
    }
    
    deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }
        
        this.users = this.users.filter(user => user.id !== userId);
        this.renderUserList();
        this.updateCounts();
        this.saveToLocalStorage();
        this.showNotification('User deleted successfully', 'success');
    }
    
    renderUserList() {
        if (this.users.length === 0) {
            this.userList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-plus"></i>
                    <p>No users added yet. Add some users to start!</p>
                </div>
            `;
            return;
        }
        
        this.userList.innerHTML = this.users.map(user => `
            <div class="user-item" data-user-id="${user.id}">
                <span class="user-name">${this.escapeHtml(user.name)}</span>
                <div class="user-actions">
                    <button class="action-btn edit-btn" onclick="app.editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="app.deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Draw Functionality
    executeDraw() {
        if (this.users.length === 0) {
            this.showNotification('No users to draw from', 'error');
            return;
        }
        
        // Disable draw button during animation
        this.drawBtn.disabled = true;
        
        // Animation effect
        this.animateDrawSelection().then(winnerIndex => {
            const winner = this.users[winnerIndex];
            this.displayWinner(winner);
            this.addToWinners(winner);
            this.drawBtn.disabled = false;
        });
    }
    
    animateDrawSelection() {
        return new Promise(resolve => {
            const duration = 2000; // 2 seconds
            const interval = 50; // Update every 50ms
            const steps = duration / interval;
            let currentStep = 0;
            
            // Create temporary display for animation
            const tempDisplay = document.createElement('div');
            tempDisplay.className = 'winner-card';
            tempDisplay.innerHTML = `
                <h3>Selecting Winner...</h3>
                <div class="winner-name" id="tempWinnerName">${this.users[0].name}</div>
                <div class="winner-time">${new Date().toLocaleTimeString()}</div>
            `;
            
            this.winnerDisplay.innerHTML = '';
            this.winnerDisplay.appendChild(tempDisplay);
            
            const tempWinnerName = document.getElementById('tempWinnerName');
            
            const animationInterval = setInterval(() => {
                // Randomly select a user for this step
                const randomIndex = Math.floor(Math.random() * this.users.length);
                tempWinnerName.textContent = this.users[randomIndex].name;
                
                // Slow down towards the end
                currentStep++;
                if (currentStep >= steps) {
                    clearInterval(animationInterval);
                    
                    // Final selection
                    const finalIndex = Math.floor(Math.random() * this.users.length);
                    resolve(finalIndex);
                }
            }, interval);
        });
    }
    
    displayWinner(winner) {
        const now = new Date();
        const formattedTime = now.toLocaleString();
        
        this.winnerDisplay.innerHTML = `
            <div class="winner-card">
                <h3>🎉 Congratulations! 🎉</h3>
                <div class="winner-name">${this.escapeHtml(winner.name)}</div>
                <div class="winner-time">Selected at ${formattedTime}</div>
            </div>
        `;
    }
    
    addToWinners(winner) {
        const winnerRecord = {
            ...winner,
            wonAt: new Date().toISOString()
        };
        
        this.winners.unshift(winnerRecord); // Add to beginning
        this.renderWinnersList();
        this.saveToLocalStorage();
    }
    
    resetDraw() {
        this.winnerDisplay.innerHTML = `
            <div class="winner-placeholder">
                <i class="fas fa-trophy"></i>
                <p>Winner will appear here</p>
            </div>
        `;
        this.showNotification('Draw reset', 'info');
    }
    
    renderWinnersList() {
        if (this.winners.length === 0) {
            this.winnersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>No winners yet</p>
                </div>
            `;
            return;
        }
        
        this.winnersList.innerHTML = this.winners.map(winner => `
            <div class="winner-history-item">
                <span class="winner-history-name">${this.escapeHtml(winner.name)}</span>
                <span class="winner-history-time">
                    ${new Date(winner.wonAt).toLocaleDateString()} 
                    ${new Date(winner.wonAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
            </div>
        `).join('');
    }
    
    // Utility Methods
    updateCounts() {
        this.userCount.textContent = this.users.length;
        this.drawCount.textContent = this.users.length;
        this.drawBtn.disabled = this.users.length === 0;
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 10px;
                    color: white;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
                    animation-fill-mode: forwards;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    max-width: 400px;
                }
                .notification-success { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); }
                .notification-error { background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%); }
                .notification-info { background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Local Storage
    saveToLocalStorage() {
        localStorage.setItem('luckyDrawUsers', JSON.stringify(this.users));
        localStorage.setItem('luckyDrawWinners', JSON.stringify(this.winners));
        localStorage.setItem('luckyDrawHasDefault', 'true');
    }
    
    loadFromLocalStorage() {
        const savedUsers = localStorage.getItem('luckyDrawUsers');
        const savedWinners = localStorage.getItem('luckyDrawWinners');
        const hasDefault = localStorage.getItem('luckyDrawHasDefault');
        
        // If no saved data and no default flag, load default users
        if (!savedUsers && !hasDefault) {
            this.loadDefaultUsers();
        } else if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        }
        
        if (savedWinners) {
            this.winners = JSON.parse(savedWinners);
        }
    }
    
    async loadDefaultUsers() {
        try {
            // Use relative path to work with any base URL
            const basePath = window.location.pathname.includes('/luckydraw') ? '/luckydraw' : '';
            const response = await fetch(`${basePath}/data/default-users.json`);
            if (!response.ok) throw new Error('Failed to load default users');
            
            const data = await response.json();
            if (data.users && Array.isArray(data.users)) {
                this.users = data.users;
                this.saveToLocalStorage();
                this.showNotification('Loaded default user list', 'success');
            }
        } catch (error) {
            console.warn('Could not load default users:', error);
            // Create a simple default list if file not found
            this.users = [
                { id: '1', name: '姚镇', addedAt: new Date().toISOString() },
                { id: '2', name: '钱聪', addedAt: new Date().toISOString() },
                { id: '3', name: '还向华', addedAt: new Date().toISOString() },
                { id: '4', name: '饶艳', addedAt: new Date().toISOString() },
                { id: '5', name: '余蓉', addedAt: new Date().toISOString() },
                { id: '6', name: '朱晓倩', addedAt: new Date().toISOString() },
                { id: '7', name: '李嘉', addedAt: new Date().toISOString() },
                { id: '8', name: '郑杭', addedAt: new Date().toISOString() },
                { id: '9', name: '马江龙', addedAt: new Date().toISOString() },
                { id: '10', name: '吴秋韵', addedAt: new Date().toISOString() },
                { id: '11', name: '蔡金磊', addedAt: new Date().toISOString() },
                { id: '12', name: '江朝朝', addedAt: new Date().toISOString() },
                { id: '13', name: '刘青', addedAt: new Date().toISOString() },
                { id: '14', name: '许慧娟', addedAt: new Date().toISOString() },
                { id: '15', name: '苑超', addedAt: new Date().toISOString() },
                { id: '16', name: '刘亦韬', addedAt: new Date().toISOString() },
                { id: '17', name: '潘晓璋', addedAt: new Date().toISOString() },
                { id: '18', name: '吴玉媛', addedAt: new Date().toISOString() },
                { id: '19', name: '聂宇琦', addedAt: new Date().toISOString() },
                { id: '20', name: '张涛', addedAt: new Date().toISOString() }
            ];
            this.saveToLocalStorage();
        }
    }
    
    // Export/Import (Bonus feature)
    exportData() {
        const data = {
            users: this.users,
            winners: this.winners,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lucky-draw-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully', 'success');
    }
    
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.users && Array.isArray(data.users)) {
                    // Clear current data and load imported data
                    this.users = data.users;
                    this.winners = data.winners || [];
                    this.renderUserList();
                    this.updateCounts();
                    this.renderWinnersList();
                    this.saveToLocalStorage();
                    
                    // Clear the file input
                    event.target.value = '';
                    
                    this.showNotification('Data imported successfully', 'success');
                } else {
                    this.showNotification('Invalid data format', 'error');
                }
            } catch (error) {
                this.showNotification('Error importing data', 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    }
    
    // Load default users on demand
    loadDefaultUsersAction() {
        if (this.users.length > 0 && !confirm('This will replace current users with default list. Continue?')) {
            return;
        }
        
        this.loadDefaultUsers().then(() => {
            this.renderUserList();
            this.updateCounts();
            this.renderWinnersList();
        });
    }
    
    // Clear all users
    clearAllUsers() {
        if (this.users.length === 0) {
            this.showNotification('No users to clear', 'info');
            return;
        }
        
        if (!confirm(`Are you sure you want to remove all ${this.users.length} users? This cannot be undone.`)) {
            return;
        }
        
        this.users = [];
        this.renderUserList();
        this.updateCounts();
        this.saveToLocalStorage();
        this.showNotification('All users cleared', 'success');
    }
    
    // Clear all winners
    clearAllWinners() {
        if (this.winners.length === 0) {
            this.showNotification('No winners to clear', 'info');
            return;
        }
        
        if (!confirm(`Are you sure you want to remove all ${this.winners.length} winner records? This cannot be undone.`)) {
            return;
        }
        
        this.winners = [];
        this.renderWinnersList();
        this.saveToLocalStorage();
        this.showNotification('All winners cleared', 'success');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LuckyDrawApp();
    
    // Add export/import buttons to footer
    const footer = document.querySelector('footer');
    const exportImportDiv = document.createElement('div');
    exportImportDiv.className = 'export-import';
    exportImportDiv.innerHTML = `
        <button onclick="app.exportData()" class="btn btn-secondary" style="margin: 5px;">
            <i class="fas fa-download"></i> Export Data
        </button>
        <label for="importFile" class="btn btn-secondary" style="margin: 5px;">
            <i class="fas fa-upload"></i> Import Data
            <input type="file" id="importFile" accept=".json" style="display: none;" 
                   onchange="app.importData(event)">
        </label>
        <button onclick="app.loadDefaultUsersAction()" class="btn btn-secondary" style="margin: 5px;">
            <i class="fas fa-users"></i> Load Default Users
        </button>


    `;
    footer.insertBefore(exportImportDiv, footer.firstChild);
    
    // Add styles for export/import
    const exportImportStyles = document.createElement('style');
    exportImportStyles.textContent = `
        .export-import {
            margin-bottom: 15px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        .export-import label {
            cursor: pointer;
        }
    `;
    document.head.appendChild(exportImportStyles);
});