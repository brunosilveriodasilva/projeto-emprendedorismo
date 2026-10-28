(function () {
  "use strict";

  const DATA = window.BEM_ADOCICADO;
  const ORDER_UTILS = window.BEM_ADOCICADO_UTILS;
  const productById = new Map(DATA.products.map((product) => [product.id, product]));
  const formatMoney = ORDER_UTILS.formatMoney;
  const allowedReceiving = new Set([
    "Retirada no ponto de venda da escola",
    "Entrega dentro da escola"
  ]);

  const ui = {
    siteShell: document.querySelector("#site-shell"),
    menuToggle: document.querySelector("#menu-toggle"),
    nav: document.querySelector("#site-nav"),
    cartOpen: document.querySelector("#cart-open"),
    cartCount: document.querySelector("#cart-count"),
    drawerCount: document.querySelector("#drawer-item-count"),
    drawer: document.querySelector("#cart-drawer"),
    backdrop: document.querySelector("#drawer-backdrop"),
    closeDrawer: document.querySelector("#cart-close"),
    drawerScroll: document.querySelector("#drawer-scroll"),
    cartView: document.querySelector("#cart-view"),
    cartList: document.querySelector("#cart-list"),
    cartEmpty: document.querySelector("#cart-empty"),
    emptyReturn: document.querySelector("#empty-return"),
    cartTotal: document.querySelector("#cart-total"),
    cartActions: document.querySelector("#cart-actions"),
    checkoutActions: document.querySelector("#checkout-actions"),
    checkoutStart: document.querySelector("#checkout-start"),
    continueShopping: document.querySelector("#continue-shopping"),
    checkoutView: document.querySelector("#checkout-view"),
    checkoutBack: document.querySelector("#checkout-back"),
    checkoutBackLink: document.querySelector("#checkout-back-link"),
    checkoutForm: document.querySelector("#checkout-form"),
    prepareOrder: document.querySelector("#prepare-order"),
    drawerKicker: document.querySelector("#drawer-kicker"),
    drawerFooterNote: document.querySelector("#drawer-footer-note"),
    formMessage: document.querySelector("#form-message"),
    toast: document.querySelector("#toast"),
    footerWhatsApp: document.querySelector("#footer-whatsapp")
  };

  const customerFields = {
    name: { input: document.querySelector("#customer-name"), error: document.querySelector("#name-error"), label: "Nome" },
    className: { input: document.querySelector("#customer-class"), error: document.querySelector("#class-error"), label: "Turma" },
    receiving: { input: document.querySelector("#receiving-method"), error: document.querySelector("#receiving-error"), label: "Forma de recebimento" },
    notes: { input: document.querySelector("#customer-notes"), error: null, label: "Observações" }
  };

  const state = {
    basket: [],
    customer: { name: "", className: "", receiving: "", notes: "" },
    checkout: false,
    returnFocus: null,
    toastTimer: null,
    drawerTimer: null
  };

  function makeElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function saveSession() {
    try {
      sessionStorage.setItem(DATA.config.sessionStorageKey, JSON.stringify({ basket: state.basket, customer: state.customer }));
    } catch (_) {
      // The order flow still works in memory if browser storage is unavailable.
    }
  }

  function restoreSession() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DATA.config.sessionStorageKey) || "null");
      if (!saved || typeof saved !== "object") return;
      if (Array.isArray(saved.basket)) {
        state.basket = saved.basket
          .filter((item) => item && productById.has(item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99)
          .map((item) => ({ id: item.id, quantity: item.quantity }));
      }
      if (saved.customer && typeof saved.customer === "object") {
        state.customer = {
          name: typeof saved.customer.name === "string" ? saved.customer.name.slice(0, 80) : "",
          className: typeof saved.customer.className === "string" ? saved.customer.className.slice(0, 40) : "",
          receiving: allowedReceiving.has(saved.customer.receiving) ? saved.customer.receiving : "",
          notes: typeof saved.customer.notes === "string" ? saved.customer.notes.slice(0, 300) : ""
        };
      }
    } catch (_) {
      state.basket = [];
      state.customer = { name: "", className: "", receiving: "", notes: "" };
    }
  }

  function renderProducts() {
    for (const category of DATA.categories) {
      const target = document.querySelector(`[data-products="${category.id}"]`);
      if (!target) continue;
      target.replaceChildren();
      const categoryProducts = DATA.products.filter((item) => item.category === category.id);
      target.classList.toggle("product-grid--two", categoryProducts.length === 2);
      for (const product of categoryProducts) {
        target.append(createProductCard(product));
      }
    }
  }

  function createProductCard(product) {
    const card = makeElement("article", "product-card");
    card.dataset.category = product.category;

    const media = makeElement("div", "product-card__media");
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.imageAlt;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      image.remove();
      media.classList.add("product-card__media--fallback");
      media.append(makeElement("span", "image-fallback-label", "Imagem provisória · substituir pela foto"));
    }, { once: true });
    media.append(image);

    if (product.provisional) media.append(makeElement("span", "product-card__tag", "Demonstração"));
    if (product.comboLabel) media.append(makeElement("span", "product-card__combo-label", product.comboLabel));

    const content = makeElement("div", "product-card__content");
    content.append(makeElement("h3", "product-card__name", product.name));
    content.append(makeElement("p", "product-card__description", product.description));

    const priceLine = makeElement("div", "product-card__price-line");
    priceLine.append(makeElement("strong", "product-card__price", formatMoney(product.priceCents)));
    priceLine.append(makeElement("span", "product-card__price-note", "preço de exemplo"));
    content.append(priceLine);

    const addButton = makeElement("button", "product-card__button", "Adicionar ao carrinho");
    addButton.type = "button";
    addButton.setAttribute("aria-label", `Adicionar ${product.name} ao carrinho`);
    addButton.addEventListener("click", () => addToBasket(product.id));
    content.append(addButton);

    card.append(media, content);
    return card;
  }

  function getBasketEntries() {
    return state.basket.map((item) => ({ product: productById.get(item.id), quantity: item.quantity }))
      .filter((entry) => entry.product && Number.isInteger(entry.quantity) && entry.quantity > 0 && entry.quantity <= 99);
  }

  function getTotals() {
    const entries = getBasketEntries();
    const totalQuantity = entries.reduce((sum, entry) => sum + entry.quantity, 0);
    const totalCents = entries.reduce((sum, entry) => sum + (entry.product.priceCents * entry.quantity), 0);
    return { entries, totalQuantity, totalCents };
  }

  function renderBasket() {
    const activeElement = document.activeElement;
    const focusedAction = ui.cartList.contains(activeElement) && activeElement.dataset.action
      ? { action: activeElement.dataset.action, id: activeElement.dataset.id }
      : null;
    const { entries, totalQuantity, totalCents } = getTotals();
    ui.cartList.replaceChildren();
    ui.cartList.hidden = entries.length === 0;
    ui.cartEmpty.hidden = entries.length !== 0;
    document.querySelector(".drawer-demo-note").hidden = entries.length === 0;
    ui.cartTotal.textContent = formatMoney(totalCents);
    ui.cartCount.textContent = String(totalQuantity);
    ui.drawerCount.textContent = `(${totalQuantity})`;
    ui.cartOpen.setAttribute("aria-label", `Abrir carrinho, ${totalQuantity} ${totalQuantity === 1 ? "item" : "itens"}`);
    ui.checkoutStart.disabled = entries.length === 0;

    for (const entry of entries) ui.cartList.append(createBasketRow(entry.product, entry.quantity));
    if (entries.length === 0) state.checkout = false;
    updateDrawerView();
    if (focusedAction && !ui.drawer.hidden) {
      const replacement = Array.from(ui.cartList.querySelectorAll("button[data-action]"))
        .find((button) => button.dataset.action === focusedAction.action && button.dataset.id === focusedAction.id)
        || ui.cartList.querySelector("button[data-action]")
        || ui.emptyReturn;
      replacement.focus();
    }
    saveSession();
  }

  function createBasketRow(product, quantity) {
    const item = makeElement("li", "cart-item");
    const imageWrap = makeElement("div", "cart-item__image");
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", () => image.remove(), { once: true });
    imageWrap.append(image);

    const main = makeElement("div", "cart-item__main");
    main.append(makeElement("h3", "cart-item__name", product.name));
    main.append(makeElement("p", "cart-item__unit", `${formatMoney(product.priceCents)} por unidade`));
    const quantityControl = makeElement("div", "quantity-control");
    quantityControl.setAttribute("aria-label", `Quantidade de ${product.name}`);

    const decrease = makeElement("button", "", "−");
    decrease.type = "button";
    decrease.dataset.action = "decrease";
    decrease.dataset.id = product.id;
    decrease.setAttribute("aria-label", `Diminuir quantidade de ${product.name}`);
    const output = makeElement("output", "", String(quantity));
    output.setAttribute("aria-label", `Quantidade: ${quantity}`);
    const increase = makeElement("button", "", "+");
    increase.type = "button";
    increase.dataset.action = "increase";
    increase.dataset.id = product.id;
    increase.setAttribute("aria-label", `Aumentar quantidade de ${product.name}`);
    quantityControl.append(decrease, output, increase);
    main.append(quantityControl);

    const end = makeElement("div", "cart-item__end");
    end.append(makeElement("strong", "cart-item__subtotal", formatMoney(product.priceCents * quantity)));
    const remove = makeElement("button", "remove-item", "Remover");
    remove.type = "button";
    remove.dataset.action = "remove";
    remove.dataset.id = product.id;
    remove.setAttribute("aria-label", `Remover ${product.name} do carrinho`);
    end.append(remove);

    item.append(imageWrap, main, end);
    return item;
  }

  function addToBasket(id) {
    if (!productById.has(id)) return;
    const item = state.basket.find((entry) => entry.id === id);
    if (item) {
      if (item.quantity >= 99) {
        showToast("O limite por produto é de 99 unidades.");
        return;
      }
      item.quantity += 1;
    } else {
      state.basket.push({ id, quantity: 1 });
    }
    renderBasket();
    showToast(`${productById.get(id).name} adicionado ao carrinho.`);
  }

  function changeBasketItem(action, id) {
    const item = state.basket.find((entry) => entry.id === id);
    if (!item) return;
    if (action === "remove" || (action === "decrease" && item.quantity === 1)) {
      state.basket = state.basket.filter((entry) => entry.id !== id);
    } else if (action === "decrease") {
      item.quantity = Math.max(1, item.quantity - 1);
    } else if (action === "increase") {
      item.quantity = Math.min(99, item.quantity + 1);
      if (item.quantity === 99) showToast("O limite por produto é de 99 unidades.");
    }
    renderBasket();
  }

  function updateDrawerView() {
    const hasItems = getTotals().entries.length > 0;
    if (!hasItems) state.checkout = false;
    ui.cartView.hidden = state.checkout;
    ui.checkoutView.hidden = !state.checkout;
    ui.cartActions.hidden = state.checkout;
    ui.checkoutActions.hidden = !state.checkout;
    ui.drawerKicker.textContent = state.checkout ? "FINALIZE SEU PEDIDO" : "SEU PEDIDO";
    ui.drawerFooterNote.textContent = state.checkout
      ? "O WhatsApp abrirá com a mensagem pronta. Você ainda precisa revisar e enviar."
      : "Nenhum pedido será enviado sem sua confirmação no WhatsApp.";
  }

  function openDrawer() {
    if (!ui.drawer.hidden) return;
    clearTimeout(state.drawerTimer);
    state.returnFocus = document.activeElement;
    ui.backdrop.hidden = false;
    ui.drawer.hidden = false;
    ui.drawer.inert = false;
    ui.drawer.setAttribute("aria-hidden", "false");
    ui.siteShell.inert = true;
    ui.siteShell.setAttribute("aria-hidden", "true");
    document.body.classList.add("drawer-open");
    requestAnimationFrame(() => {
      ui.backdrop.classList.add("is-open");
      ui.drawer.classList.add("is-open");
      ui.closeDrawer.focus();
    });
  }

  function closeDrawer() {
    if (ui.drawer.hidden) return;
    ui.drawer.classList.remove("is-open");
    ui.backdrop.classList.remove("is-open");
    ui.drawer.inert = true;
    ui.drawer.setAttribute("aria-hidden", "true");
    ui.siteShell.inert = false;
    ui.siteShell.setAttribute("aria-hidden", "false");
    document.body.classList.remove("drawer-open");
    state.drawerTimer = setTimeout(() => {
      ui.drawer.hidden = true;
      ui.backdrop.hidden = true;
    }, 310);
    if (state.returnFocus && typeof state.returnFocus.focus === "function") state.returnFocus.focus();
  }

  function setCheckoutMode(enabled) {
    if (enabled && getTotals().entries.length === 0) return;
    state.checkout = enabled;
    updateDrawerView();
    ui.drawerScroll.scrollTop = 0;
    if (enabled) {
      requestAnimationFrame(() => customerFields.name.input.focus());
    } else {
      ui.checkoutStart.focus();
    }
  }

  function setMenuOpen(open) {
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    if (!mobile) open = false;
    ui.menuToggle.setAttribute("aria-expanded", String(open));
    ui.menuToggle.setAttribute("aria-label", open ? "Fechar menu de navegação" : "Abrir menu de navegação");
    ui.nav.classList.toggle("is-open", open);
    ui.nav.setAttribute("aria-hidden", String(mobile && !open));
  }

  function showToast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add("is-visible");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => ui.toast.classList.remove("is-visible"), 2600);
  }

  function setFieldError(field, message) {
    if (!field.error) return;
    field.error.textContent = message;
    if (message) field.input.setAttribute("aria-invalid", "true");
    else field.input.removeAttribute("aria-invalid");
  }

  function validateOrder() {
    ui.formMessage.setAttribute("role", "alert");
    ui.formMessage.setAttribute("aria-live", "assertive");
    let firstInvalid = null;
    const name = customerFields.name.input.value.trim();
    const className = customerFields.className.input.value.trim();
    const receiving = customerFields.receiving.input.value;
    const errors = [
      [customerFields.name, name ? "" : "Informe seu nome."],
      [customerFields.className, className ? "" : "Informe sua turma."],
      [customerFields.receiving, allowedReceiving.has(receiving) ? "" : "Selecione uma forma de recebimento."]
    ];

    for (const [field, message] of errors) {
      setFieldError(field, message);
      if (message && !firstInvalid) firstInvalid = field.input;
    }

    const totals = getTotals();
    const validPrices = totals.entries.every(({ product, quantity }) =>
      Number.isInteger(product.priceCents) && product.priceCents >= 0 && Number.isInteger(quantity) && quantity > 0 && quantity <= 99
    );
    let formError = "";
    if (totals.entries.length === 0) formError = "Adicione pelo menos um produto antes de preparar o pedido.";
    else if (!validPrices || !Number.isInteger(totals.totalCents) || totals.totalCents < 0) formError = "Não foi possível conferir os valores do carrinho. Revise os itens e tente novamente.";

    if (formError) {
      ui.formMessage.textContent = formError;
      ui.formMessage.hidden = false;
    } else {
      ui.formMessage.textContent = "";
      ui.formMessage.hidden = true;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    if (formError) {
      ui.formMessage.focus();
      return false;
    }
    return { name, className, receiving, notes: customerFields.notes.input.value.trim(), totals };
  }

  function buildOrderMessage(order) {
    return ORDER_UTILS.buildOrderMessage({
      customer: { name: order.name, className: order.className, receiving: order.receiving, notes: order.notes },
      items: order.totals.entries.map(({ product, quantity }) => ({
        name: product.name,
        quantity,
        unitPriceCents: product.priceCents,
        provisional: product.provisional,
        priceConfirmed: product.priceConfirmed
      })),
      totalCents: order.totals.totalCents
    }, DATA.config.demoMode);
  }

  function prepareWhatsAppOrder(order) {
    const message = buildOrderMessage(order);
    const url = ORDER_UTILS.buildWhatsAppUrl(DATA.config.whatsappNumber, message);
    saveSession();

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();

    ui.formMessage.replaceChildren();
    ui.formMessage.append(document.createTextNode("A mensagem está pronta no WhatsApp. Revise os dados e envie por lá para concluir o pedido. "));
    const retryLink = makeElement("a", "", "Abrir o WhatsApp novamente");
    retryLink.href = url;
    retryLink.target = "_blank";
    retryLink.rel = "noopener noreferrer";
    ui.formMessage.append(retryLink);
    ui.formMessage.hidden = false;
    ui.formMessage.setAttribute("role", "status");
    ui.formMessage.setAttribute("aria-live", "polite");
  }

  function hydrateForm() {
    customerFields.name.input.value = state.customer.name;
    customerFields.className.input.value = state.customer.className;
    customerFields.receiving.input.value = state.customer.receiving;
    customerFields.notes.input.value = state.customer.notes;
  }

  function updateCustomerFromForm() {
    state.customer.name = customerFields.name.input.value;
    state.customer.className = customerFields.className.input.value;
    state.customer.receiving = customerFields.receiving.input.value;
    state.customer.notes = customerFields.notes.input.value;
    saveSession();
  }

  function visibleDrawerControls() {
    return Array.from(ui.drawer.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"))
      .filter((element) => !element.hidden && element.getClientRects().length > 0);
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      if (!ui.drawer.hidden) {
        event.preventDefault();
        closeDrawer();
      } else if (ui.menuToggle.getAttribute("aria-expanded") === "true") {
        event.preventDefault();
        setMenuOpen(false);
        ui.menuToggle.focus();
      }
      return;
    }
    if (event.key !== "Tab" || ui.drawer.hidden) return;
    const controls = visibleDrawerControls();
    if (!controls.length) {
      event.preventDefault();
      ui.closeDrawer.focus();
      return;
    }
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function initialize() {
    renderProducts();
    restoreSession();
    hydrateForm();
    renderBasket();
    setMenuOpen(false);
    ui.footerWhatsApp.href = `https://wa.me/${DATA.config.whatsappNumber}`;

    ui.cartOpen.addEventListener("click", openDrawer);
    document.querySelector("#order-note-cart").addEventListener("click", openDrawer);
    ui.closeDrawer.addEventListener("click", closeDrawer);
    ui.backdrop.addEventListener("click", closeDrawer);
    ui.continueShopping.addEventListener("click", closeDrawer);
    ui.emptyReturn.addEventListener("click", () => {
      closeDrawer();
      document.querySelector("#brownies").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    ui.cartList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (button) changeBasketItem(button.dataset.action, button.dataset.id);
    });
    ui.checkoutStart.addEventListener("click", () => setCheckoutMode(true));
    ui.checkoutBack.addEventListener("click", () => setCheckoutMode(false));
    ui.checkoutBackLink.addEventListener("click", () => setCheckoutMode(false));

    ui.menuToggle.addEventListener("click", () => {
      setMenuOpen(ui.menuToggle.getAttribute("aria-expanded") !== "true");
    });
    ui.nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenuOpen(false);
    });
    window.addEventListener("resize", () => setMenuOpen(false));
    document.addEventListener("keydown", handleKeydown);

    for (const field of Object.values(customerFields)) {
      const eventName = field.input.tagName === "SELECT" ? "change" : "input";
      field.input.addEventListener(eventName, () => {
        updateCustomerFromForm();
        if (field.error) setFieldError(field, "");
      });
    }

    ui.checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      updateCustomerFromForm();
      const order = validateOrder();
      if (order) prepareWhatsAppOrder(order);
    });

    window.addEventListener("pagehide", saveSession);
  }

  initialize();
})();
