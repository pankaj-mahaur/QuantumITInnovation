// Product data with Picsum images
const allProducts = [
    { id: 1, title: "Wireless Headphones", description: "Noise cancelling", category: "electronics", price: 199.99, image: "https://picsum.photos/id/1080/300/200" },
    { id: 2, title: "Smart Watch", description: "Fitness tracking", category: "electronics", price: 249.99, image: "https://picsum.photos/id/119/300/200" },
    { id: 3, title: "Bluetooth Speaker", description: "Portable", category: "electronics", price: 89.99, image: "https://picsum.photos/id/1056/300/200" },
    { id: 4, title: "Denim Jacket", description: "Classic style", category: "clothing", price: 59.99, image: "https://picsum.photos/id/1025/300/200" },
    { id: 5, title: "Running Shoes", description: "Lightweight", category: "clothing", price: 79.99, image: "https://picsum.photos/id/103/300/200" },
    { id: 6, title: "Desk Lamp", description: "Adjustable", category: "home", price: 39.99, image: "https://picsum.photos/id/119/300/200" },
    { id: 7, title: "Coffee Maker", description: "Programmable", category: "home", price: 129.99, image: "https://picsum.photos/id/225/300/200" },
    { id: 8, title: "Yoga Mat", description: "Non-slip", category: "home", price: 29.99, image: "https://picsum.photos/id/96/300/200" }
];

// DOM elements
const el = {
    grid: document.getElementById('productGrid'),
    search: document.getElementById('searchInput'),
    category: document.getElementById('categoryFilter'),
    price: document.getElementById('priceFilter'),
    loadMore: document.getElementById('loadMore'),
    upload: document.getElementById('imageUpload'),
    loading: document.getElementById('loading')
};

// State
let visibleCount = 4;
let filteredProducts = [...allProducts];

// Initial display
showProducts();
el.loading.style.display = 'none';

// Event listeners
document.getElementById('searchBtn').addEventListener('click', filterProducts);
el.search.addEventListener('keyup', e => e.key === 'Enter' && filterProducts());
el.category.addEventListener('change', filterProducts);
el.price.addEventListener('change', filterProducts);
el.loadMore.addEventListener('click', loadMoreProducts);
document.getElementById('addProductBtn').addEventListener('click', uploadImages);

// Form for manual product addition
const manualForm = document.createElement('div');
manualForm.innerHTML = `
    <div class="manual-add" style="margin: 20px auto; max-width: 500px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1)">
        <h3>Add Product Manually</h3>
        <input type="text" id="manualTitle" placeholder="Product Title" style="width: 100%; margin-bottom: 10px; padding: 8px;">
        <input type="text" id="manualDesc" placeholder="Description" style="width: 100%; margin-bottom: 10px; padding: 8px;">
        <select id="manualCategory" style="width: 100%; margin-bottom: 10px; padding: 8px;">
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home</option>
        </select>
        <input type="number" id="manualPrice" placeholder="Price" style="width: 100%; margin-bottom: 10px; padding: 8px;">
        <input type="file" id="manualImage" accept="image/*" style="width: 100%; margin-bottom: 10px;">
        <button id="manualAddBtn" style="width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Product</button>
    </div>
`;
document.querySelector('main').insertBefore(manualForm, document.getElementById('productGrid'));

document.getElementById('manualAddBtn').addEventListener('click', addManualProduct);

function addManualProduct() {
    const title = document.getElementById('manualTitle').value;
    const description = document.getElementById('manualDesc').value;
    const category = document.getElementById('manualCategory').value;
    const price = parseFloat(document.getElementById('manualPrice').value);
    const imageFile = document.getElementById('manualImage').files[0];
    
    if (!title || !description || !price || !imageFile) {
        alert('Please fill all fields and select an image');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newProduct = {
            id: allProducts.length + 1,
            title: title,
            description: description,
            category: category,
            price: price,
            image: e.target.result
        };
        
        allProducts.unshift(newProduct);
        document.getElementById('manualTitle').value = '';
        document.getElementById('manualDesc').value = '';
        document.getElementById('manualPrice').value = '';
        document.getElementById('manualImage').value = '';
        
        filterProducts();
        alert('Product added successfully!');
    };
    reader.readAsDataURL(imageFile);
}

function filterProducts() {
    const searchTerm = el.search.value.toLowerCase();
    const category = el.category.value;
    const priceRange = el.price.value;
    
    filteredProducts = allProducts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm) || 
                            p.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || p.category === category;
        let matchesPrice = true;
        
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            matchesPrice = p.price >= min && p.price <= max;
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    visibleCount = 4;
    showProducts();
}

function loadMoreProducts() {
    visibleCount += 4;
    showProducts();
}

function showProducts() {
    const productsToShow = filteredProducts.slice(0, visibleCount);
    el.grid.innerHTML = productsToShow.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.title}">
            <div class="product-info">
                <h3>${p.title}</h3>
                <span class="category">${p.category}</span>
                <div class="price">$${p.price.toFixed(2)}</div>
                <p>${p.description}</p>
            </div>
        </div>
    `).join('');
    
    el.loadMore.style.display = visibleCount < filteredProducts.length ? 'block' : 'none';
}

function uploadImages() {
    Array.from(el.upload.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            allProducts.unshift({
                id: allProducts.length + 1,
                title: `Uploaded Product ${allProducts.length + 1}`,
                description: "Custom uploaded product",
                category: "home",
                price: 49.99,
                image: e.target.result
            });
            filterProducts();
        };
        reader.readAsDataURL(file);
    });
    el.upload.value = '';
}