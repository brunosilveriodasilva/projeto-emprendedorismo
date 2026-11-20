# Bem Adocicado

Site estático de catálogo e preparação de pedidos. Não usa backend, banco de dados, pagamento ou bibliotecas externas.

## Abrir localmente

Abra `index.html` em um navegador moderno ou sirva esta pasta com um servidor local de arquivos estáticos.

## Catálogo

Os itens e preços ficam em `CATEGORIES`, no início de `app.js`. Mantenha ali somente produtos e valores confirmados pela equipe. Cada item usa `id`, `name`, `priceCents` e, opcionalmente, `image` com o caminho de uma foto local.

As categorias e a navegação são definidas em `CATEGORIES`. A seção sem itens mostra apenas o título da categoria; sem um caminho de imagem, o cartão não reserva uma área vazia para foto.

## Marca e imagens

- Logotipo: `assets/images/branding/logo-principal.jpg`.
- Fotos dos produtos: `assets/images/products/`.

O logotipo fornecido pela equipe é usado no cabeçalho, no destaque principal e no rodapé. As fotos dos cartões são carregadas dos caminhos informados em `image`.

## Pedidos

O número do WhatsApp fica em `CONFIG.whatsappNumber`, no início de `app.js`, no formato internacional sem pontuação. O carrinho e os campos do formulário usam `sessionStorage` enquanto a aba e a sessão do navegador estiverem disponíveis. Ao abrir o WhatsApp, a pessoa ainda precisa revisar e enviar a mensagem; o pagamento é combinado com a equipe.
