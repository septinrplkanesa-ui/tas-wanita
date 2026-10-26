const products = [
	{ id: 1, brand: 'Dior', name: 'Lady Dior', type: 'Top Handle', price: 68500000, image: 'img/dior 1.jpg', description: 'Siluet ikonis dengan sentuhan feminin untuk tampilan istimewa.' },
	{ id: 2, brand: 'Dior', name: 'Dior Saddle', type: 'Shoulder Bag', price: 59000000, image: 'img/dior 2.png', description: 'Bentuk lekuk khas yang memberi aksen berani pada gaya harian.' },
	{ id: 3, brand: 'Dior', name: 'Dior Book Tote', type: 'Tote Bag', price: 52000000, image: 'img/dior 3.png', description: 'Ruang luas dengan tampilan terstruktur untuk agenda yang padat.' },
	{ id: 4, brand: 'LV', name: 'Louis Vuitton Speedy', type: 'Satchel', price: 34500000, image: 'img/LV 1.jpg', description: 'Teman perjalanan klasik dengan bentuk praktis dan mudah dikenali.' },
	{ id: 5, brand: 'LV', name: 'Louis Vuitton Neverfull', type: 'Tote Bag', price: 38000000, image: 'img/LV 2.jpg', description: 'Tas serbaguna berkapasitas lapang untuk menemani aktivitas sehari-hari.' },
	{ id: 6, brand: 'LV', name: 'Louis Vuitton Alma', type: 'Top Handle', price: 41000000, image: 'img/LV 3.jpg', description: 'Desain structured yang rapi, manis, dan mudah dipadukan.' },
	{ id: 7, brand: 'Prada', name: 'Prada Galleria', type: 'Top Handle', price: 49500000, image: 'img/prada 1.png', description: 'Garis bersih dan kompartemen fungsional untuk gaya polished.' },
	{ id: 8, brand: 'Prada', name: 'Prada Re-Edition', type: 'Shoulder Bag', price: 28500000, image: 'img/prada 2.png', description: 'Siluet ringkas yang membawa nuansa modern ke penampilan kasual.' },
	{ id: 9, brand: 'Prada', name: 'Prada Cleo', type: 'Shoulder Bag', price: 44000000, image: 'img/prada 3.png', description: 'Lekuk minimalis dengan kilau elegan untuk siang hingga malam.' }
];

const catalog = document.querySelector('#katalog-produk');
const searchInput = document.querySelector('#pencarian');
const brandFilter = document.querySelector('#filter-merek');
const cartCount = document.querySelector('#jumlah-keranjang');
let cart = Number(localStorage.getItem('eleganceBagCart') || 0);

cartCount.textContent = cart;

function formatPrice(price) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(price);
}

function renderProducts() {
	const query = searchInput.value.trim().toLocaleLowerCase('id');
	const brand = brandFilter.value;
	const filteredProducts = products.filter((product) => {
		const matchesQuery = `${product.name} ${product.brand} ${product.type}`.toLocaleLowerCase('id').includes(query);
		return matchesQuery && (brand === 'Semua' || product.brand === brand);
	});

	if (filteredProducts.length === 0) {
		catalog.innerHTML = '<p class="empty-state">Tas yang kamu cari belum tersedia. Coba kata kunci lain.</p>';
		return;
	}

	catalog.innerHTML = filteredProducts.map((product) => `
		<article class="product-card" data-product-id="${product.id}">
			<button class="product-image-button" type="button" data-action="detail" aria-label="Lihat detail ${product.name}">
				<img src="${product.image}" alt="${product.name}" loading="lazy">
				<span class="product-type">${product.type}</span>
			</button>
			<div class="product-info">
				<p class="product-brand">${product.brand === 'LV' ? 'Louis Vuitton' : product.brand}</p>
				<h3>${product.name}</h3>
				<div class="product-bottom">
					<p class="product-price">${formatPrice(product.price)}</p>
					<button class="add-button" type="button" data-action="add" aria-label="Tambah ${product.name} ke keranjang">+</button>
				</div>
			</div>
		</article>
	`).join('');
}

function openProductDetail(product) {
	const modal = document.createElement('div');
	modal.className = 'product-modal';
	modal.setAttribute('role', 'dialog');
	modal.setAttribute('aria-modal', 'true');
	modal.setAttribute('aria-label', `Detail ${product.name}`);
	modal.innerHTML = `
		<div class="modal-panel">
			<button class="modal-close" type="button" aria-label="Tutup">&times;</button>
			<div class="modal-photo"><img src="${product.image}" alt="${product.name}"></div>
			<div class="modal-copy">
				<p class="product-brand">${product.brand === 'LV' ? 'Louis Vuitton' : product.brand} / ${product.type}</p>
				<h2>${product.name}</h2>
				<p class="product-price">${formatPrice(product.price)}</p>
				<p class="modal-description">${product.description}</p>
				<button class="btn modal-add" type="button">Tambah ke keranjang <span>+</span></button>
				<p class="catalog-disclaimer">Harga dan ketersediaan dapat berubah. Hubungi kami untuk informasi produk.</p>
			</div>
		</div>
	`;
	document.body.append(modal);
	document.body.classList.add('modal-open');
	const modalController = new AbortController();

	const closeModal = () => {
		modal.remove();
		document.body.classList.remove('modal-open');
		modalController.abort();
	};

	modal.addEventListener('click', (event) => {
		if (event.target === modal || event.target.closest('.modal-close')) closeModal();
		if (event.target.closest('.modal-add')) {
			addToCart();
			closeModal();
		}
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeModal();
		}
	}, { signal: modalController.signal });
}

function addToCart() {
	cart += 1;
	cartCount.textContent = cart;
	localStorage.setItem('eleganceBagCart', cart);
}

catalog.addEventListener('click', (event) => {
	const actionButton = event.target.closest('[data-action]');
	if (!actionButton) return;

	const productCard = actionButton.closest('[data-product-id]');
	const product = products.find((item) => item.id === Number(productCard.dataset.productId));
	if (actionButton.dataset.action === 'detail') openProductDetail(product);
	if (actionButton.dataset.action === 'add') addToCart();
});

searchInput.addEventListener('input', renderProducts);
brandFilter.addEventListener('change', renderProducts);
renderProducts();
