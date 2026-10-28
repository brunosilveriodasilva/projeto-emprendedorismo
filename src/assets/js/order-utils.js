(function (root, factory) {
  "use strict";
  const utilities = factory();
  if (typeof module === "object" && module.exports) module.exports = utilities;
  if (root) root.BEM_ADOCICADO_UTILS = utilities;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  function formatMoney(cents) {
    return money.format(cents / 100);
  }

  function buildOrderMessage(order, demoMode) {
    const productLines = order.items.map((item) => {
      const subtotalCents = item.unitPriceCents * item.quantity;
      return `${item.quantity}x ${item.name} — ${formatMoney(item.unitPriceCents)} cada\nSubtotal: ${formatMoney(subtotalCents)}`;
    });
    const lines = [
      "Olá! Gostaria de fazer um pedido na Bem Adocicado.",
      "",
      "*Dados do cliente*",
      `Nome: ${order.customer.name}`,
      `Turma: ${order.customer.className}`,
      `Recebimento: ${order.customer.receiving}`,
      "",
      "*Produtos*",
      ...productLines,
      "",
      `*Total do pedido:* ${formatMoney(order.totalCents)}`
    ];
    if (order.customer.notes) lines.push("", `*Observações:* ${order.customer.notes}`);
    if (demoMode || order.items.some((item) => item.provisional || !item.priceConfirmed)) {
      lines.push("", "*ATENÇÃO: catálogo de demonstração; produtos e valores são provisórios e precisam ser confirmados pela equipe.*");
    }
    lines.push("", "Por favor, vamos combinar os detalhes do recebimento e do pagamento.");
    return lines.join("\n");
  }

  function buildWhatsAppUrl(number, message) {
    const normalizedNumber = String(number).replace(/\D/g, "");
    return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
  }

  return Object.freeze({ formatMoney, buildOrderMessage, buildWhatsAppUrl });
});
