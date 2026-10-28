/* Dados de demonstração. Confirme nomes, descrições, preços e imagens antes de divulgar. */
window.BEM_ADOCICADO = {
  config: {
    whatsappNumber: "554891771605",
    demoMode: true,
    sessionStorageKey: "bem-adocicado-order-v1"
  },
  categories: [
    { id: "brownies", title: "Brownies" },
    { id: "docinhos", title: "Docinhos" },
    { id: "bombons", title: "Bombons" },
    { id: "combos", title: "Combos promocionais" }
  ],
  products: [
    { id: "brownie-classico", name: "Brownie clássico", description: "Massa úmida de chocolate com casquinha delicada.", priceCents: 700, category: "brownies", image: "assets/images/products/produto-placeholder.svg", imageAlt: "Ilustração provisória de doce para substituir pela foto do brownie clássico.", provisional: true, priceConfirmed: false },
    { id: "brownie-doce-leite", name: "Brownie com doce de leite", description: "Brownie de chocolate com um toque cremoso de doce de leite.", priceCents: 850, category: "brownies", image: "assets/images/products/produto-placeholder.svg", imageAlt: "Ilustração provisória de doce para substituir pela foto do brownie com doce de leite.", provisional: true, priceConfirmed: false },
    { id: "brigadeiro", name: "Brigadeiro", description: "Um docinho de chocolate para acompanhar a pausa.", priceCents: 350, category: "docinhos", image: "assets/images/products/produto-placeholder.svg", imageAlt: "Ilustração provisória de doce para substituir pela foto do brigadeiro.", provisional: true, priceConfirmed: false },
    { id: "beijinho", name: "Beijinho", description: "Docinho de coco em uma versão delicada.", priceCents: 350, category: "docinhos", image: "assets/images/products/produto-placeholder.svg", imageAlt: "Ilustração provisória de doce para substituir pela foto do beijinho.", provisional: true, priceConfirmed: false },
    { id: "bombom-crocante", name: "Bombom crocante", description: "Cobertura de chocolate com interior crocante.", priceCents: 500, category: "bombons", image: "assets/images/products/produto-placeholder.svg", imageAlt: "Ilustração provisória de doce para substituir pela foto do bombom crocante.", provisional: true, priceConfirmed: false },
    { id: "bombom-coco", name: "Bombom de coco", description: "Chocolate com recheio macio de coco.", priceCents: 500, category: "bombons", image: "assets/images/products/produto-placeholder.svg", imageAlt: "Ilustração provisória de doce para substituir pela foto do bombom de coco.", provisional: true, priceConfirmed: false },
    { id: "combo-pausa", name: "Combo pausa doce", description: "Uma combinação de brownie e docinhos para dividir.", priceCents: 1800, category: "combos", image: "assets/images/products/produto-placeholder.svg", imageAlt: "Ilustração provisória de doces para substituir pela foto do combo pausa doce.", provisional: true, priceConfirmed: false, comboLabel: "Combo especial" },
    { id: "combo-favoritos", name: "Combo favoritos", description: "Uma seleção de bombons e docinhos em um só combo.", priceCents: 2200, category: "combos", image: "assets/images/products/produto-placeholder.svg", imageAlt: "Ilustração provisória de doces para substituir pela foto do combo favoritos.", provisional: true, priceConfirmed: false, comboLabel: "Combo especial" }
  ]
};
