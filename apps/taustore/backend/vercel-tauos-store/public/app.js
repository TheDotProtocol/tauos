// TauStore Frontend JavaScript
// Complete app marketplace functionality

// Initialize Lucide icons
lucide.createIcons();

// API Configuration
const API_BASE_URL = 'https://tauos-store-backend.vercel.app/api';

// State management
let currentUser = null;
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
let categories = [];
let apps = [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const profileBtn = document.getElementById('profileBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
const wishlistCount = document.getElementById('wishlistCount');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadFeaturedApps();
    loadTopFreeApps();
    loadTopPaidApps();
    updateWishlistCount();
    setupEventListeners();
    loadUser();
});

// Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchBtn.addEventListener('click', handleSearch);
    
    // Profile
    profileBtn.addEventListener('click', () => {
        if (currentUser) {
            showProfile();
        } else {
            showLoginModal();
        }
    });
    
    // Wishlist
    wishlistBtn.addEventListener('click', showWishlist);
}

// API Functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(currentUser?.token && { 'Authorization': `Bearer ${currentUser.token}` }),
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Load Categories
async function loadCategories() {
    try {
        const data = await apiCall('/categories');
        categories = data.categories;
        renderCategories();
    } catch (error) {
        console.error('Failed to load categories:', error);
        // Fallback categories
        categories = [
            { name: 'Productivity', slug: 'productivity', icon: 'Briefcase', color: '#3B82F6', app_count: 50 },
            { name: 'Games', slug: 'games', icon: 'Gamepad2', color: '#EF4444', app_count: 30 },
            { name: 'Social', slug: 'social', icon: 'Users', color: '#8B5CF6', app_count: 25 },
            { name: 'Business', slug: 'business', icon: 'Building2', color: '#10B981', app_count: 20 },
            { name: 'Finance', slug: 'finance', icon: 'CreditCard', color: '#F59E0B', app_count: 15 }
        ];
        renderCategories();
    }
}

// Load Featured Apps
async function loadFeaturedApps() {
    try {
        const data = await apiCall('/featured');
        renderApps(data.apps, 'featuredApps');
    } catch (error) {
        console.error('Failed to load featured apps:', error);
        // Fallback apps
        const fallbackApps = [
            {
                id: '1',
                name: 'TauMail',
                developer: 'TauOS Team',
                description: 'Secure email client for TauOS',
                price: 0,
                rating: 4.8,
                download_count: 50000,
                icon_url: '/icons/taumail.png'
            },
            {
                id: '2',
                name: 'TauCloud',
                developer: 'TauOS Team',
                description: 'Secure cloud storage',
                price: 0,
                rating: 4.7,
                download_count: 45000,
                icon_url: '/icons/taucloud.png'
            }
        ];
        renderApps(fallbackApps, 'featuredApps');
    }
}

// Load Top Free Apps
async function loadTopFreeApps() {
    try {
        const data = await apiCall('/top-free');
        renderApps(data.apps, 'topFreeApps');
    } catch (error) {
        console.error('Failed to load top free apps:', error);
    }
}

// Load Top Paid Apps
async function loadTopPaidApps() {
    try {
        const data = await apiCall('/top-paid');
        renderApps(data.apps, 'topPaidApps');
    } catch (error) {
        console.error('Failed to load top paid apps:', error);
    }
}

// Render Categories
function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    container.innerHTML = categories.map(category => `
        <div class="glass-effect rounded-2xl p-6 text-center card-hover cursor-pointer" onclick="filterByCategory('${category.slug}')">
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i data-lucide="${category.icon}" class="w-8 h-8 text-black"></i>
            </div>
            <h3 class="font-semibold mb-2">${category.name}</h3>
            <p class="text-sm text-gray-400">${category.app_count || 0} apps</p>
        </div>
    `).join('');
    
    // Re-initialize icons
    lucide.createIcons();
}

// Render Apps
function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = apps.map(app => `
        <div class="glass-effect rounded-2xl p-6 card-hover cursor-pointer" onclick="showAppDetail('${app.id}')">
            <div class="flex items-start space-x-4 mb-4">
                <img src="${app.icon_url || '/icons/default-app.png'}" alt="${app.name}" class="w-16 h-16 rounded-xl">
                <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-lg truncate">${app.name}</h3>
                    <p class="text-sm text-gray-400 truncate">${app.developer}</p>
                    <div class="flex items-center space-x-2 mt-1">
                        <div class="flex items-center space-x-1">
                            <i data-lucide="star" class="w-4 h-4 text-yellow-400 fill-current"></i>
                            <span class="text-sm">${app.rating}</span>
                        </div>
                        <span class="text-sm text-gray-400">${formatNumber(app.download_count)}</span>
                    </div>
                </div>
            </div>
            
            <p class="text-gray-300 text-sm mb-4 line-clamp-2">${app.description}</p>
            
            <div class="flex items-center justify-between">
                <div class="text-2xl font-bold text-yellow-400">
                    ${app.price === 0 ? 'Free' : `$${app.price}`}
                </div>
                <button onclick="event.stopPropagation(); toggleWishlist('${app.id}')" class="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                    <i data-lucide="heart" class="w-5 h-5 ${wishlist.includes(app.id) ? 'fill-current text-yellow-400' : ''}"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Re-initialize icons
    lucide.createIcons();
}

// Show App Detail
async function showAppDetail(appId) {
    try {
        const data = await apiCall(`/apps/${appId}`);
        const app = data.app;
        
        // Create modal HTML
        const modalHTML = `
            <div id="appDetailModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="glass-effect rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-start mb-6">
                        <div class="flex items-center space-x-4">
                            <img src="${app.icon_url || '/icons/default-app.png'}" alt="${app.name}" class="w-20 h-20 rounded-2xl">
                            <div>
                                <h2 class="text-3xl font-bold">${app.name}</h2>
                                <p class="text-gray-400">${app.developer}</p>
                                <div class="flex items-center space-x-4 mt-2">
                                    <div class="flex items-center space-x-1">
                                        <i data-lucide="star" class="w-4 h-4 text-yellow-400 fill-current"></i>
                                        <span class="text-sm">${app.rating}</span>
                                    </div>
                                    <span class="text-sm text-gray-400">${formatNumber(app.download_count)} downloads</span>
                                </div>
                            </div>
                        </div>
                        <button onclick="closeAppDetail()" class="text-gray-400 hover:text-white transition-colors">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-xl font-bold mb-4">Description</h3>
                            <p class="text-gray-300 mb-6">${app.long_description || app.description}</p>
                            
                            <h3 class="text-xl font-bold mb-4">Reviews</h3>
                            <div class="space-y-4">
                                ${data.reviews && data.reviews.length > 0 ? 
                                    data.reviews.map(review => `
                                        <div class="border-b border-gray-700 pb-4">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <div class="flex items-center space-x-1">
                                                    ${Array.from({length: 5}, (_, i) => `
                                                        <i data-lucide="star" class="w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}"></i>
                                                    `).join('')}
                                                </div>
                                                <span class="text-sm text-gray-400">${review.reviewer_name || 'Anonymous'}</span>
                                            </div>
                                            <p class="text-sm text-gray-300">${review.comment || 'No comment'}</p>
                                        </div>
                                    `).join('') : 
                                    '<p class="text-gray-400 text-center">No reviews yet</p>'
                                }
                            </div>
                        </div>
                        
                        <div>
                            <div class="glass-effect rounded-2xl p-6 mb-6">
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-yellow-400 mb-4">
                                        ${app.price === 0 ? 'Free' : `$${app.price}`}
                                    </div>
                                    <button onclick="downloadApp('${app.id}')" class="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors mb-4">
                                        Download
                                    </button>
                                    <button onclick="toggleWishlist('${app.id}')" class="w-full border border-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                                        ${wishlist.includes(app.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    </button>
                                </div>
                            </div>
                            
                            <div class="glass-effect rounded-2xl p-6">
                                <h3 class="text-xl font-bold mb-4">App Information</h3>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Version</span>
                                        <span>${app.version || '1.0.0'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Size</span>
                                        <span>${app.file_size_mb ? `${app.file_size_mb} MB` : 'Unknown'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Category</span>
                                        <span>${app.category_name || 'Unknown'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Developer</span>
                                        <span>${app.developer}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Re-initialize icons
        lucide.createIcons();
    } catch (error) {
        console.error('Failed to load app details:', error);
        alert('Failed to load app details. Please try again.');
    }
}

// Close App Detail
function closeAppDetail() {
    const modal = document.getElementById('appDetailModal');
    if (modal) {
        modal.remove();
    }
}

// Download App
async function downloadApp(appId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    try {
        await apiCall(`/apps/${appId}/download`, { method: 'POST' });
        alert('App downloaded successfully! You earned 10 points.');
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
    }
}

// Toggle Wishlist
function toggleWishlist(appId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    if (wishlist.includes(appId)) {
        wishlist = wishlist.filter(id => id !== appId);
    } else {
        wishlist.push(appId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    
    // Update UI
    const heartIcons = document.querySelectorAll(`[onclick*="${appId}"] i[data-lucide="heart"]`);
    heartIcons.forEach(icon => {
        if (wishlist.includes(appId)) {
            icon.classList.add('fill-current', 'text-yellow-400');
        } else {
            icon.classList.remove('fill-current', 'text-yellow-400');
        }
    });
}

// Update Wishlist Count
function updateWishlistCount() {
    const count = wishlist.length;
    if (count > 0) {
        wishlistCount.textContent = count;
        wishlistCount.classList.remove('hidden');
    } else {
        wishlistCount.classList.add('hidden');
    }
}

// Show Login Modal
function showLoginModal() {
    const modalHTML = `
        <div id="loginModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="glass-effect rounded-2xl p-8 w-full max-w-md">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p class="text-gray-400">Sign in to your TauStore account</p>
                </div>
                
                <form id="loginForm" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input type="email" id="loginEmail" required class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Password</label>
                        <input type="password" id="loginPassword" required class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                    </div>
                    
                    <button type="submit" class="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors">
                        Sign In
                    </button>
                </form>
                
                <div class="text-center mt-6">
                    <p class="text-gray-400">Don't have an account? <button onclick="showRegisterModal()" class="text-yellow-400 hover:text-yellow-300 transition-colors">Sign up</button></p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add form handler
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Show Register Modal
function showRegisterModal() {
    // Close login modal
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.remove();
    
    const modalHTML = `
        <div id="registerModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="glass-effect rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold mb-2">Join TauStore</h2>
                    <p class="text-gray-400">Create your account and start exploring</p>
                </div>
                
                <form id="registerForm" class="space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">First Name</label>
                            <input type="text" id="firstName" required class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Last Name</label>
                            <input type="text" id="lastName" required class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Username</label>
                        <input type="text" id="username" required class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input type="email" id="registerEmail" required class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Password</label>
                        <input type="password" id="registerPassword" required class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Country</label>
                        <select id="country" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="JP">Japan</option>
                            <option value="IN">India</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors">
                        Create Account
                    </button>
                </form>
                
                <div class="text-center mt-6">
                    <p class="text-gray-400">Already have an account? <button onclick="showLoginModal()" class="text-yellow-400 hover:text-yellow-300 transition-colors">Sign in</button></p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add form handler
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        currentUser = data.user;
        currentUser.token = data.token;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        document.getElementById('loginModal').remove();
        alert('Login successful!');
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        fullName: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
        country: document.getElementById('country').value
    };
    
    try {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        currentUser = data.user;
        currentUser.token = data.token;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        document.getElementById('registerModal').remove();
        alert('Registration successful! Welcome to TauStore!');
    } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
    }
}

// Show Profile
function showProfile() {
    // Implement profile view
    console.log('Show profile for:', currentUser);
}

// Show Wishlist
function showWishlist() {
    // Implement wishlist view
    console.log('Show wishlist:', wishlist);
}

// Handle Search
function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        // Implement search functionality
        console.log('Searching for:', query);
    }
}

// Filter by Category
function filterByCategory(categorySlug) {
    // Implement category filtering
    console.log('Filtering by category:', categorySlug);
}

// Load User
function loadUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
