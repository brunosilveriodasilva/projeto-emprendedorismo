const CONFIG = {
  whatsappNumber: '554891771605', // Maria Luiza — +55 48 9177-1605
  cartKey: 'bem-adocicado-cart-v1',
  checkoutKey: 'bem-adocicado-checkout-v1',
};

const HERO_AUTOPLAY_DELAY = 10000;

// Fotos ilustrativas provisórias. Substitua as URLs quando as imagens oficiais estiverem disponíveis.
const CATALOG_IMAGES = {
  brownie: 'assets/images/products/brownie_chocolate.jpg',
  brownieRecheado: 'assets/images/products/brownie_chocolate_recheado.jpg',
  brigadeiro: 'assets/images/products/brigadeiro_chocolate.png',
  leiteNinho: 'assets/images/products/brigadeiro_branco.jpg',
  ouroBranco: 'assets/images/products/bombom_ouro_branco.jpg',
  namorados: 'assets/images/products/supremo_chocolate.jpg',
  trio: 'assets/images/products/entre_amigos.jpg',
  duo: 'assets/images/products/combo_duo.jpg',
  loucos: 'assets/images/products/supremo_chocolate.jpg',
  galera: 'assets/images/products/galera.jpg',
  pausa: 'assets/images/products/pequena_pausa.jpg',
  degustacao: 'assets/images/products/degustacao_vip.jpg',
};

const HERO_BANNERS = [
  { id: 'banner-01', image: 'assets/images/banners/banner1_desktop.jpg', mobileImage: 'assets/images/banners/banner1_mobile.jpg', alt: 'Banner da Bem Adocicado: na compra de um combo de doces, ganhe uma foto', content: null },
  { id: 'banner-02', image: 'assets/images/banners/banner2_desktop.jpg', mobileImage: 'assets/images/banners/banner2_mobile.jpg', alt: 'Banner da Bem Adocicado com brownies e aviso de pagamento via Pix', content: null },
  { id: 'banner-03', image: 'assets/images/banners/banner3_desktop.jpg', mobileImage: 'assets/images/banners/banner3_mobile.jpg', alt: 'Banner da Black Friday Bem Adocicado com ofertas de brigadeiro e brownie', content: null },
];

const CATEGORIES = [
  {
    id: 'brownies', title: 'Brownies', index: '01', products: [
      { id: 'brownie-tradicional', name: 'Brownie Tradicional', description: '1 Brownie Tradicional', priceCents: 500, image: CATALOG_IMAGES.brownie },
      { id: 'brownie-recheado', name: 'Brownie Recheado', description: '1 Brownie Recheado', priceCents: 700, image: CATALOG_IMAGES.brownieRecheado },
    ],
  },
  {
    id: 'docinhos', title: 'Docinhos', index: '02', products: [
      { id: 'brigadeiro-tradicional', name: 'Brigadeiro Tradicional', description: '1 Brigadeiro Tradicional', priceCents: 200, image: CATALOG_IMAGES.brigadeiro },
      { id: 'brigadeiro-leite-ninho', name: 'Brigadeiro de Leite Ninho', description: '1 Brigadeiro de Leite Ninho', priceCents: 200, image: CATALOG_IMAGES.leiteNinho },
    ],
  },
  {
    id: 'bombons', title: 'Bombons', index: '03', products: [
      { id: 'bombom-ouro-branco', name: 'Bombom Ouro Branco', description: '1 Bombom Ouro Branco', priceCents: 350, image: CATALOG_IMAGES.ouroBranco },
    ],
  },
  {
    id: 'combos', title: 'Combos promocionais', index: '04', products: [
      { id: 'combo-namorados-romantico', name: 'Combo Namorados', description: '2 Brownies Tradicionais + 2 Brigadeiros', priceCents: 800, originalPriceCents: 1400, image: CATALOG_IMAGES.namorados },
      { id: 'combo-trio-de-amigos', name: 'Combo Trio', description: '3 Brownies Tradicionais + 3 Brigadeiros', priceCents: 1800, originalPriceCents: 2100, image: CATALOG_IMAGES.trio },
      { id: 'combo-duo-dupla', name: 'Combo Duo', description: '1 Brownie Tradicional + 1 Brigadeiro', priceCents: 620, originalPriceCents: 700, image: CATALOG_IMAGES.duo },
      { id: 'combo-loucos-por-chocolate', name: 'Combo Loucos por Chocolate', description: '1 Brownie Tradicional + 2 Brigadeiros + 1 Ouro Branco', priceCents: 1100, originalPriceCents: 1250, image: CATALOG_IMAGES.loucos },
      { id: 'combo-galera-grupo', name: 'Combo Grupo', description: '4 Brigadeiros + 2 Ouro Branco', priceCents: 1300, originalPriceCents: 1500, image: CATALOG_IMAGES.galera },
      { id: 'combo-pequena-pausa-lanchinho', name: 'Combo Pequena Pausa', description: '1 Brigadeiro + 1 Ouro Branco', priceCents: 500, originalPriceCents: 550, image: CATALOG_IMAGES.pausa },
      { id: 'combo-degustacao-total', name: 'Combo Degustação Total', description: '1 Brownie Tradicional + 1 Brigadeiro Recheado + 1 Brigadeiro de Leite Ninho + 1 Ouro Branco', priceCents: 1600, originalPriceCents: 1950, image: CATALOG_IMAGES.degustacao },
    ],
  },
];

const allProducts = CATEGORIES.flatMap((category) => category.products.map((product) => ({ ...product, categoryId: category.id })));
const productById = new Map(allProducts.map((product) => [product.id, product]));
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const $ = (selector, root = document) => root.querySelector(selector);
const catalogRoot = $('#catalog-sections');
const heroCarousel = $('.hero-carousel');
const cartItemsRoot = $('#cart-items');
const drawer = $('#cart-drawer');
const backdrop = $('.drawer-backdrop');
const cartTrigger = $('.cart-trigger');
const cartCount = $('#cart-count');
const announcer = $('#announcer');
const form = $('#checkout-form');
const checkout = $('#checkout');
const notesField = $('#customer-notes');
const notesError = $('#notes-error');
const notesOptionalLabel = $('#notes-optional');
const notesRequiredLabel = $('#notes-required');
const checkoutButton = $('#checkout-button');
const backToCartButton = $('#back-to-cart');
const teamContactLink = $('.whatsapp-contact-button');
teamContactLink.href = `https://wa.me/${CONFIG.whatsappNumber}`;
let cart = loadCart();
let checkoutData = loadCheckoutData();
let checkoutVisible = false;
let whatsappRedirectPending = false;
let heroSlides = [];
let heroIndicators = [];
let activeHeroBanner = 0;
let heroAutoplayTimer = null;
let heroAutoplayDeadline = null;
let heroAutoplayRemaining = HERO_AUTOPLAY_DELAY;
let heroAutoplayPausedByHover = false;
let heroPointerStart = null;
let returnFocusTo = null;
let backdropTimer = 0;
let drawerOpenFrame = 0;
let drawerFocusFrame = 0;
let drawerTransitionToken = 0;
let checkoutTransitionTimer = 0;
let checkoutTransitionToken = 0;

function formatPrice(cents) {
  return money.format((Number.isInteger(cents) && cents >= 0 ? cents : 0) / 100);
}

function discountPercentage(originalPriceCents, promotionalPriceCents) {
  if (!Number.isInteger(originalPriceCents) || originalPriceCents <= promotionalPriceCents || promotionalPriceCents < 0) return 0;
  return Math.round(((originalPriceCents - promotionalPriceCents) / originalPriceCents) * 100);
}

function safeRead(key, fallback) {
  try { return JSON.parse(sessionStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function loadCart() {
  const saved = safeRead(CONFIG.cartKey, []);
  if (!Array.isArray(saved)) return [];
  return saved.filter((line) => productById.has(line.id) && Number.isSafeInteger(line.quantity) && line.quantity > 0 && line.quantity <= 99);
}

function loadCheckoutData() {
  const saved = safeRead(CONFIG.checkoutKey, {});
  return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
}

function persistCart() {
  try { sessionStorage.setItem(CONFIG.cartKey, JSON.stringify(cart)); } catch { /* O site continua utilizável sem armazenamento de sessão. */ }
}

function persistCheckout() {
  checkoutData = {
    name: $('#customer-name').value,
    class: $('#customer-class').value,
    pickup: form.elements.pickup.value,
    notes: $('#customer-notes').value,
  };
  try { sessionStorage.setItem(CONFIG.checkoutKey, JSON.stringify(checkoutData)); } catch { /* Os campos continuam na página durante a sessão atual. */ }
}

function restoreCheckout() {
  $('#customer-name').value = typeof checkoutData.name === 'string' ? checkoutData.name : '';
  $('#customer-class').value = typeof checkoutData.class === 'string' ? checkoutData.class : '';
  notesField.value = typeof checkoutData.notes === 'string' ? checkoutData.notes : '';
  if (typeof checkoutData.pickup === 'string') {
    const radio = [...form.elements.pickup].find((input) => input.value === checkoutData.pickup);
    if (radio) radio.checked = true;
  }
  updateNotesRequirement();
  resizeNotesField();
}

function updateNotesRequirement() {
  const isRequired = form.elements.pickup.value === 'Entrega dentro da escola';
  notesField.required = isRequired;
  notesField.setAttribute('aria-required', String(isRequired));
  notesOptionalLabel.hidden = isRequired;
  notesRequiredLabel.hidden = !isRequired;
  if (!isRequired || notesField.value.trim()) {
    notesError.textContent = '';
    notesField.removeAttribute('aria-invalid');
    notesField.removeAttribute('aria-describedby');
  }
  return isRequired;
}

function resizeNotesField() {
  notesField.style.height = 'auto';
  const fieldStyle = getComputedStyle(notesField);
  const borderHeight = Number.parseFloat(fieldStyle.borderTopWidth) + Number.parseFloat(fieldStyle.borderBottomWidth);
  notesField.style.height = `${notesField.scrollHeight + borderHeight}px`;
}

function makeElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function setHeroBanner(index, direction = 1) {
  if (!heroSlides.length) return;
  const nextIndex = (index + heroSlides.length) % heroSlides.length;
  if (nextIndex === activeHeroBanner) return;

  const previousSlide = heroSlides[activeHeroBanner];
  const nextSlide = heroSlides[nextIndex];
  nextSlide.style.setProperty('--carousel-offset', `${direction < 0 ? -18 : 18}px`);
  nextSlide.classList.add('is-entering');
  void nextSlide.offsetWidth;
  previousSlide.classList.remove('is-active');
  previousSlide.setAttribute('aria-hidden', 'true');
  nextSlide.classList.add('is-active');
  nextSlide.classList.remove('is-entering');
  nextSlide.setAttribute('aria-hidden', 'false');
  heroIndicators.forEach((indicator, indicatorIndex) => {
    if (indicatorIndex === nextIndex) indicator.setAttribute('aria-current', 'true');
    else indicator.removeAttribute('aria-current');
  });
  activeHeroBanner = nextIndex;
}

function stopHeroAutoplay() {
  if (heroAutoplayTimer === null) return;
  window.clearTimeout(heroAutoplayTimer);
  heroAutoplayTimer = null;
  if (heroAutoplayDeadline !== null) {
    heroAutoplayRemaining = Math.max(0, heroAutoplayDeadline - Date.now());
    heroAutoplayDeadline = null;
  }
}

function scheduleHeroAutoplay(resetCountdown = false) {
  stopHeroAutoplay();
  if (resetCountdown) heroAutoplayRemaining = HERO_AUTOPLAY_DELAY;
  if (!heroCarousel || !heroSlides.length || heroAutoplayPausedByHover || heroPointerStart) return;

  const delay = heroAutoplayRemaining > 0 ? heroAutoplayRemaining : HERO_AUTOPLAY_DELAY;
  heroAutoplayRemaining = delay;
  heroAutoplayDeadline = Date.now() + delay;
  heroAutoplayTimer = window.setTimeout(() => {
    heroAutoplayTimer = null;
    heroAutoplayDeadline = null;
    heroAutoplayRemaining = HERO_AUTOPLAY_DELAY;
    setHeroBanner(activeHeroBanner + 1, 1);
    scheduleHeroAutoplay();
  }, delay);
}

function loadHeroBannerImage(banner, slide, placeholder) {
  const picture = document.createElement('picture');
  picture.className = 'hero-banner-picture';
  const mobileSource = document.createElement('source');
  mobileSource.media = '(max-width: 760px)';
  mobileSource.srcset = banner.mobileImage;
  const image = new Image();
  image.className = 'hero-banner-image';
  image.alt = banner.alt;
  image.draggable = false;
  image.decoding = 'async';
  image.onload = () => {
    slide.insertBefore(picture, placeholder);
    placeholder.hidden = true;
  };
  image.onerror = () => picture.remove();
  picture.append(mobileSource, image);
  image.src = banner.image;
}

function initializeHeroCarousel() {
  if (!heroCarousel) return;
  const slidesRoot = $('[data-carousel-slides]', heroCarousel);
  const indicatorsRoot = $('[data-carousel-indicators]', heroCarousel);
  heroSlides = [];
  heroIndicators = [];
  activeHeroBanner = 0;

  HERO_BANNERS.forEach((banner, index) => {
    const slide = makeElement('div', `hero-carousel-slide${index === 0 ? ' is-active' : ''}`);
    slide.setAttribute('data-banner-id', banner.id);
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Banner ${index + 1} de ${HERO_BANNERS.length}`);
    slide.setAttribute('aria-hidden', String(index !== 0));

    const placeholder = makeElement('div', 'hero-banner-placeholder');
    placeholder.setAttribute('aria-hidden', 'true');
    slide.append(placeholder);
    slidesRoot.append(slide);
    heroSlides.push(slide);
    loadHeroBannerImage(banner, slide, placeholder);

    const indicator = makeElement('button', 'hero-carousel-dot');
    indicator.type = 'button';
    indicator.setAttribute('aria-label', `Mostrar banner ${index + 1}`);
    if (index === 0) indicator.setAttribute('aria-current', 'true');
    indicator.addEventListener('click', () => {
      setHeroBanner(index, index < activeHeroBanner ? -1 : 1);
      scheduleHeroAutoplay(true);
    });
    indicatorsRoot.append(indicator);
    heroIndicators.push(indicator);
  });

  $('.hero-carousel-control--previous', heroCarousel).addEventListener('click', () => {
    setHeroBanner(activeHeroBanner - 1, -1);
    scheduleHeroAutoplay(true);
  });
  $('.hero-carousel-control--next', heroCarousel).addEventListener('click', () => {
    setHeroBanner(activeHeroBanner + 1, 1);
    scheduleHeroAutoplay(true);
  });
  heroCarousel.addEventListener('mouseenter', () => {
    heroAutoplayPausedByHover = true;
    stopHeroAutoplay();
  });
  heroCarousel.addEventListener('mouseleave', () => {
    heroAutoplayPausedByHover = false;
    scheduleHeroAutoplay();
  });
  heroCarousel.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setHeroBanner(activeHeroBanner - 1, -1);
      scheduleHeroAutoplay(true);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setHeroBanner(activeHeroBanner + 1, 1);
      scheduleHeroAutoplay(true);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setHeroBanner(0, -1);
      scheduleHeroAutoplay(true);
    } else if (event.key === 'End') {
      event.preventDefault();
      setHeroBanner(heroSlides.length - 1, 1);
      scheduleHeroAutoplay(true);
    }
  });

  heroCarousel.addEventListener('pointerdown', (event) => {
    stopHeroAutoplay();
    if (event.button !== 0 || event.target.closest('button')) return;
    heroPointerStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    heroCarousel.classList.add('is-dragging');
    stopHeroAutoplay();
    heroCarousel.setPointerCapture(event.pointerId);
  });
  heroCarousel.addEventListener('pointerup', (event) => {
    if (!heroPointerStart) {
      scheduleHeroAutoplay();
      return;
    }
    if (heroPointerStart.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - heroPointerStart.x;
    const deltaY = event.clientY - heroPointerStart.y;
    const threshold = Math.max(48, heroCarousel.clientWidth * 0.12);
    heroPointerStart = null;
    heroCarousel.classList.remove('is-dragging');
    if (heroCarousel.hasPointerCapture(event.pointerId)) heroCarousel.releasePointerCapture(event.pointerId);
    const changedBySwipe = Math.abs(deltaX) >= threshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
    if (changedBySwipe) {
      setHeroBanner(activeHeroBanner + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 1 : -1);
    }
    scheduleHeroAutoplay(changedBySwipe);
  });
  heroCarousel.addEventListener('pointercancel', () => {
    heroPointerStart = null;
    heroCarousel.classList.remove('is-dragging');
    scheduleHeroAutoplay();
  });

  scheduleHeroAutoplay();
}

function renderCatalog() {
  CATEGORIES.forEach((category) => {
    const section = makeElement('section', 'category-section');
    section.id = category.id;
    section.setAttribute('aria-labelledby', `${category.id}-title`);
    const heading = makeElement('div', 'category-heading');
    const headingCopy = makeElement('div', 'category-heading-copy');
    headingCopy.append(makeElement('span', 'category-index', category.index));
    const title = makeElement('h3');
    title.id = `${category.id}-title`;
    title.textContent = category.title;
    headingCopy.append(title);
    heading.append(headingCopy);
    const grid = makeElement('div', 'product-grid');
    category.products.forEach((product) => grid.append(makeProductCard(product)));
    section.append(heading);
    if (grid.childElementCount) section.append(grid);
    else section.classList.add('category-section--empty');
    catalogRoot.append(section);
  });
}

function makeProductCard(product) {
  const article = makeElement('article', 'product-card');
  let image = null;
  if (product.image) {
    image = makeElement('div', 'product-image');
    const photo = makeElement('img', 'product-photo');
    photo.src = product.image;
    photo.alt = product.name;
    photo.loading = 'lazy';
    image.append(photo);
  }
  const info = makeElement('div', 'product-info');
  const meta = makeElement('div', 'product-meta');
  meta.append(makeElement('h4', '', product.name));
  if (product.originalPriceCents > product.priceCents) {
    const priceGroup = makeElement('div', 'product-price-group');
    const promotionalRow = makeElement('div', 'product-price-promo-row');
    promotionalRow.append(
      makeElement('span', 'product-price product-price--promo', formatPrice(product.priceCents)),
      makeElement('span', 'discount-badge', `${discountPercentage(product.originalPriceCents, product.priceCents)}% OFF`),
    );
    priceGroup.append(promotionalRow, makeElement('s', 'product-price-original', formatPrice(product.originalPriceCents)));
    meta.append(priceGroup);
  } else {
    meta.append(makeElement('span', 'product-price', formatPrice(product.priceCents)));
  }
  const description = makeElement('p', 'product-description', product.description);
  const addButton = makeElement('button', 'product-add');
  addButton.type = 'button';
  addButton.setAttribute('aria-label', `Adicionar ${product.name}, ${formatPrice(product.priceCents)}, ao carrinho`);
  addButton.append(makeElement('span', '', 'Adicionar ao carrinho'), makeElement('span', '', '+'));
  addButton.addEventListener('click', () => addProduct(product.id));
  info.append(meta, description, addButton);
  if (image) article.append(image);
  article.append(info);
  return article;
}

function cartTotal() {
  return cart.reduce((total, line) => {
    const product = productById.get(line.id);
    return product && Number.isInteger(product.priceCents) ? total + product.priceCents * line.quantity : total;
  }, 0);
}

function totalUnits() {
  return cart.reduce((total, line) => total + line.quantity, 0);
}

function addProduct(id) {
  const product = productById.get(id);
  if (!product) return;
  const existing = cart.find((line) => line.id === id);
  if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
  else cart.push({ id, quantity: 1 });
  persistCart();
  renderCart();
  announcer.textContent = `${product.name} adicionado à sacola. ${totalUnits()} ${totalUnits() === 1 ? 'unidade' : 'unidades'} no total.`;
  $('#drawer-status').textContent = `${product.name} adicionado à sacola.`;
}

function makeCartLine(product, quantity) {
  const row = makeElement('article', 'cart-line');
  const imageFrame = makeElement('div', 'cart-line-image-frame');
  const image = makeElement('img', 'cart-line-image');
  image.src = product.image;
  image.alt = '';
  image.setAttribute('aria-hidden', 'true');
  image.loading = 'lazy';
  image.decoding = 'async';
  imageFrame.append(image);
  const main = makeElement('div', 'cart-line-main');
  main.append(
    makeElement('h3', '', product.name),
    makeElement('p', 'cart-line-description', product.description),
    makeElement('p', 'cart-line-unit-price', `${formatPrice(product.priceCents)} cada`),
  );
  const price = makeElement('span', 'cart-line-price', formatPrice(product.priceCents * quantity));
  price.setAttribute('aria-label', `Subtotal: ${formatPrice(product.priceCents * quantity)}`);
  const details = makeElement('div', 'cart-line-details');
  details.append(main, price);
  const controls = makeElement('div', 'cart-line-controls');
  const quantityControl = makeElement('div', 'quantity-control');
  quantityControl.setAttribute('aria-label', `Quantidade de ${product.name}`);
  const decrease = makeElement('button', '', '−');
  decrease.type = 'button';
  decrease.setAttribute('aria-label', `Diminuir quantidade de ${product.name}`);
  decrease.addEventListener('click', () => changeQuantity(product.id, -1));
  const output = makeElement('output', '', String(quantity));
  output.setAttribute('aria-label', `Quantidade: ${quantity}`);
  const increase = makeElement('button', '', '+');
  increase.type = 'button';
  increase.setAttribute('aria-label', `Aumentar quantidade de ${product.name}`);
  increase.addEventListener('click', () => changeQuantity(product.id, 1));
  quantityControl.append(decrease, output, increase);
  const remove = makeElement('button', 'remove-item', 'Remover');
  remove.type = 'button';
  remove.setAttribute('aria-label', `Remover ${product.name} da sacola`);
  remove.addEventListener('click', () => removeProduct(product.id));
  controls.append(quantityControl, remove);
  row.append(imageFrame, details, controls);
  return row;
}

function renderCart() {
  cart = cart.filter((line) => productById.has(line.id) && Number.isSafeInteger(line.quantity) && line.quantity > 0 && line.quantity <= 99);
  persistCart();
  cartItemsRoot.replaceChildren();
  if (!cart.length) {
    setCheckoutVisible(false);
    const empty = makeElement('div', 'empty-cart');
    const mark = makeElement('div', 'empty-cart-mark');
    const logo = makeElement('img', 'empty-cart-logo');
    logo.src = 'assets/images/branding/logo_crying.png';
    logo.alt = 'Mascote da Bem Adocicado';
    mark.append(logo);
    empty.append(mark, makeElement('h3', '', 'Sua sacola está vazia'), makeElement('p', '', 'Escolha alguns doces para começar.'));
    cartItemsRoot.append(empty);
    checkoutButton.replaceChildren(document.createTextNode('Escolher meus doces'));
  } else {
    cart.forEach((line) => {
      const product = productById.get(line.id);
      if (product) cartItemsRoot.append(makeCartLine(product, line.quantity));
    });
    checkoutButton.replaceChildren(document.createTextNode(checkoutVisible ? 'Fale com a equipe' : 'Continuar para o pedido'));
  }
  const units = totalUnits();
  cartCount.textContent = String(units);
  cartCount.hidden = units === 0;
  cartTrigger.setAttribute('aria-label', `Abrir sacola, ${units} ${units === 1 ? 'item' : 'itens'}`);
  $('#cart-total').textContent = formatPrice(cartTotal());
  checkoutButton.disabled = false;
  checkoutButton.removeAttribute('aria-disabled');
  if (checkoutVisible && cart.length) checkout.hidden = false;
}

function changeQuantity(id, delta) {
  const line = cart.find((entry) => entry.id === id);
  if (!line) return;
  line.quantity += delta;
  if (line.quantity <= 0) cart = cart.filter((entry) => entry.id !== id);
  else if (line.quantity > 99) line.quantity = 99;
  persistCart();
  renderCart();
  announcer.textContent = cart.find((entry) => entry.id === id) ? `Quantidade atualizada para ${line.quantity}.` : 'Produto removido da sacola.';
}

function removeProduct(id) {
  const product = productById.get(id);
  cart = cart.filter((line) => line.id !== id);
  persistCart();
  renderCart();
  announcer.textContent = product ? `${product.name} removido da sacola.` : 'Produto removido da sacola.';
}

function openDrawer(opener = cartTrigger) {
  closeMenu();
  returnFocusTo = opener;
  const transitionToken = ++drawerTransitionToken;
  window.clearTimeout(backdropTimer);
  backdropTimer = 0;
  window.cancelAnimationFrame(drawerOpenFrame);
  window.cancelAnimationFrame(drawerFocusFrame);
  drawerOpenFrame = 0;
  drawerFocusFrame = 0;
  drawer.hidden = false;
  backdrop.hidden = false;
  document.body.classList.add('drawer-open');
  const showDrawer = () => {
    if (transitionToken !== drawerTransitionToken || drawer.hidden) return;
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
  };
  drawerOpenFrame = requestAnimationFrame(() => {
    drawerOpenFrame = requestAnimationFrame(() => {
      drawerOpenFrame = 0;
      showDrawer();
    });
  });
  drawerFocusFrame = requestAnimationFrame(() => {
    drawerFocusFrame = 0;
    if (transitionToken === drawerTransitionToken && !drawer.hidden) $('.drawer-close').focus();
  });
}

function closeDrawer() {
  if (drawer.hidden) return;
  const transitionToken = ++drawerTransitionToken;
  window.clearTimeout(backdropTimer);
  backdropTimer = 0;
  window.cancelAnimationFrame(drawerOpenFrame);
  window.cancelAnimationFrame(drawerFocusFrame);
  drawerOpenFrame = 0;
  drawerFocusFrame = 0;
  drawer.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  document.body.classList.remove('drawer-open');
  backdropTimer = window.setTimeout(() => {
    if (transitionToken !== drawerTransitionToken || drawer.classList.contains('is-open')) return;
    drawer.hidden = true;
    backdrop.hidden = true;
    backdropTimer = 0;
  }, 340);
  if (returnFocusTo instanceof HTMLElement) returnFocusTo.focus();
}

function checkoutTransitionDurationMs() {
  const duration = getComputedStyle(checkout).getPropertyValue('--checkout-transition-duration').trim();
  const value = Number.parseFloat(duration);
  if (!Number.isFinite(value)) return 280;
  return duration.endsWith('ms') ? value : value * 1000;
}

function finishCheckoutTransition(transitionToken, visible, force = false) {
  if (transitionToken !== checkoutTransitionToken) return;
  const targetHeight = Number.parseFloat(checkout.style.height);
  const currentHeight = checkout.getBoundingClientRect().height;
  if (!force && Number.isFinite(targetHeight) && Math.abs(currentHeight - targetHeight) > 1) return;

  window.clearTimeout(checkoutTransitionTimer);
  checkoutTransitionTimer = 0;
  if (visible && checkout.classList.contains('is-visible')) {
    checkout.style.height = 'auto';
  } else if (!visible && !checkout.classList.contains('is-visible')) {
    checkout.hidden = true;
    checkout.style.height = '0px';
  }
}

checkout.addEventListener('transitionend', (event) => {
  if (event.target === checkout && event.propertyName === 'height') {
    finishCheckoutTransition(checkoutTransitionToken, checkoutVisible);
  }
});

function setCheckoutVisible(visible) {
  checkoutVisible = visible;
  const transitionToken = ++checkoutTransitionToken;
  window.clearTimeout(checkoutTransitionTimer);
  checkoutTransitionTimer = 0;
  if (visible) {
    checkout.hidden = false;
    const startHeight = checkout.getBoundingClientRect().height;
    checkout.style.height = `${startHeight}px`;
    void checkout.offsetHeight;
    checkout.classList.add('is-visible');
    checkout.style.height = 'auto';
    const targetHeight = checkout.getBoundingClientRect().height;
    checkout.style.height = `${startHeight}px`;
    void checkout.offsetHeight;
    checkout.style.height = `${targetHeight}px`;
  } else {
    if (!checkout.hidden) {
      const startHeight = checkout.getBoundingClientRect().height;
      checkout.style.height = `${startHeight}px`;
      void checkout.offsetHeight;
      checkout.classList.remove('is-visible');
      checkout.style.height = '0px';
    } else {
      checkout.classList.remove('is-visible');
      checkout.style.height = '0px';
    }
  }
  if (!checkout.hidden || visible) {
    checkoutTransitionTimer = window.setTimeout(
      () => finishCheckoutTransition(transitionToken, visible, true),
      checkoutTransitionDurationMs() + 80,
    );
  }
  backToCartButton.hidden = !visible;
  $('#drawer-status').textContent = '';
  if (visible) {
    checkoutButton.replaceChildren(document.createTextNode('Fale com a equipe'));
    restoreCheckout();
    requestAnimationFrame(() => $('#customer-name').focus());
  } else {
    checkoutButton.replaceChildren(document.createTextNode('Continuar para o pedido'));
    requestAnimationFrame(() => cartItemsRoot.querySelector('.quantity-control button')?.focus());
  }
}

function validateCheckout() {
  if (!cart.length) {
    const message = 'Adicione produtos ao carrinho antes de falar com a equipe sobre o pedido.';
    $('#drawer-status').textContent = message;
    announcer.textContent = message;
    return false;
  }
  const name = $('#customer-name');
  const customerClass = $('#customer-class');
  const notesAreRequired = updateNotesRequirement();
  const pickup = form.elements.pickup;
  const selectedPickup = [...pickup].find((input) => input.checked);
  const errors = [];
  const nameError = $('#name-error');
  const classError = $('#class-error');
  const pickupError = $('#pickup-error');
  [name, customerClass, notesField, ...pickup].forEach((field) => field.removeAttribute('aria-invalid'));
  nameError.textContent = '';
  classError.textContent = '';
  pickupError.textContent = '';
  notesError.textContent = '';
  if (!name.value.trim()) {
    nameError.textContent = 'Informe seu nome.';
    name.setAttribute('aria-invalid', 'true');
    name.setAttribute('aria-describedby', 'name-error');
    errors.push(name);
  } else name.removeAttribute('aria-describedby');
  if (!customerClass.value.trim()) {
    classError.textContent = 'Informe sua turma.';
    customerClass.setAttribute('aria-invalid', 'true');
    customerClass.setAttribute('aria-describedby', 'class-error');
    errors.push(customerClass);
  } else customerClass.removeAttribute('aria-describedby');
  if (!selectedPickup) {
    pickupError.textContent = 'Escolha uma forma de recebimento.';
    [...pickup].forEach((input) => input.setAttribute('aria-invalid', 'true'));
    [...pickup].forEach((input) => input.setAttribute('aria-describedby', 'pickup-error'));
    errors.push(pickup[0]);
  } else {
    [...pickup].forEach((input) => { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); });
  }
  if (notesAreRequired && !notesField.value.trim()) {
    notesError.textContent = 'Informe o local escolhido para a entrega nas observações.';
    notesField.setAttribute('aria-invalid', 'true');
    notesField.setAttribute('aria-describedby', 'notes-error');
    errors.push(notesField);
  } else notesField.removeAttribute('aria-describedby');
  const validCart = cart.length > 0 && cart.every((line) => {
    const product = productById.get(line.id);
    return product && Number.isSafeInteger(line.quantity) && line.quantity > 0 && Number.isInteger(product.priceCents) && product.priceCents >= 0;
  });
  if (!validCart) {
    $('#drawer-status').textContent = 'Adicione ao menos um produto válido antes de continuar.';
    errors.push(checkoutButton);
  }
  if (errors.length) {
    errors[0].focus();
    return false;
  }
  return true;
}

function buildOrderMessage() {
  const subtotalProducts = cartTotal();
  const notes = $('#customer-notes').value.trim();
  const lines = [
    'Olá! Gostaria de realizar um pedido da Bem Adocicado.',
    '',
    '*MEU PEDIDO*',
    '',
  ];
  cart.forEach((line) => {
    const product = productById.get(line.id);
    lines.push(`${line.quantity}x ${product.name}`);
    if (product.description) lines.push(`${product.categoryId === 'combos' ? 'Composição' : 'Descrição'}: ${product.description}`);
    lines.push(`Valor unitário: ${formatPrice(product.priceCents)}`, '');
  });
  lines.push(
    '*DETALHES DO PEDIDO*',
    '',
    `Nome: ${$('#customer-name').value.trim()}`,
    `Turma: ${$('#customer-class').value.trim()}`,
    `Tipo de entrega: ${form.elements.pickup.value}`,
    `Observações:${notes ? ` ${notes}` : ''}`,
    '',
    `*TOTAL DO PEDIDO: ${formatPrice(subtotalProducts)}*`,
    '',
    'Aguardo a confirmação do pedido. Obrigado!',
  );
  return lines.join('\n');
}

function prepareWhatsAppOrder() {
  if (whatsappRedirectPending || !validateCheckout()) return;
  persistCheckout();
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(buildOrderMessage())}`;
  whatsappRedirectPending = true;
  checkoutButton.disabled = true;
  checkoutButton.setAttribute('aria-disabled', 'true');
  $('#drawer-status').textContent = 'Abrindo o WhatsApp para você revisar e enviar o pedido.';
  announcer.textContent = $('#drawer-status').textContent;
  try {
    window.location.assign(url);
  } catch {
    whatsappRedirectPending = false;
    checkoutButton.disabled = false;
    checkoutButton.removeAttribute('aria-disabled');
    $('#drawer-status').textContent = 'Não foi possível abrir o WhatsApp. Tente novamente.';
    announcer.textContent = $('#drawer-status').textContent;
  }
}

function closeMenu(restoreFocus = false) {
  const menuButton = $('.menu-toggle');
  const nav = $('#site-nav');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  nav.classList.remove('is-open');
  if (restoreFocus) menuButton.focus();
}

function trapDialogFocus(event) {
  if (event.key !== 'Tab' || drawer.hidden) return;
  const candidates = [...drawer.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((node) => !node.closest('[hidden]'));
  if (!candidates.length) return;
  const first = candidates[0];
  const last = candidates[candidates.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

initializeHeroCarousel();
renderCatalog();
renderCart();
restoreCheckout();

cartTrigger.addEventListener('click', () => openDrawer(cartTrigger));
$('.drawer-close').addEventListener('click', closeDrawer);
$('#continue-shopping').addEventListener('click', closeDrawer);
backdrop.addEventListener('click', closeDrawer);
checkoutButton.addEventListener('click', () => {
  if (!cart.length) {
    closeDrawer();
    requestAnimationFrame(() => $('#brownies').scrollIntoView({ behavior: 'smooth' }));
  } else if (!checkoutVisible) setCheckoutVisible(true);
  else prepareWhatsAppOrder();
});
backToCartButton.addEventListener('click', () => setCheckoutVisible(false));
form.addEventListener('input', (event) => {
  if (event.target === notesField) {
    resizeNotesField();
    if (notesField.value.trim()) {
      notesError.textContent = '';
      notesField.removeAttribute('aria-invalid');
      notesField.removeAttribute('aria-describedby');
    }
  }
  persistCheckout();
});
form.addEventListener('change', (event) => {
  if (event.target.name === 'pickup') updateNotesRequirement();
  persistCheckout();
});
form.addEventListener('submit', (event) => { event.preventDefault(); prepareWhatsAppOrder(); });
form.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA' && checkoutVisible) {
    event.preventDefault();
    prepareWhatsAppOrder();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!$('.menu-toggle').hidden && $('.menu-toggle').getAttribute('aria-expanded') === 'true') closeMenu(true);
    else closeDrawer();
  }
  trapDialogFocus(event);
});

const menuButton = $('.menu-toggle');
const nav = $('#site-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('is-open', open);
  if (open) nav.querySelector('a')?.focus();
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('click', (event) => {
  if (menuButton.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) closeMenu();
});
