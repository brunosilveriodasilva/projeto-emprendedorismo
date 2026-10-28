# Bem Adocicado

Site estático de uma página para apresentar o catálogo da equipe e preparar pedidos para revisão no WhatsApp. Usa HTML, CSS e JavaScript sem dependências, servidor próprio ou banco de dados.

## Abrir localmente

Abra `index.html` em um navegador. Como os arquivos são locais e não há etapa de compilação, não é necessário instalar ferramentas.

## Trocar os dados provisórios

Todos os produtos e as configurações editáveis ficam em `assets/js/catalog.js`:

- Edite `name`, `description`, `priceCents`, `category` e `image` em cada produto.
- O preço é informado em centavos: `700` corresponde a `R$ 7,00`.
- Troque `provisional` para `false` e `priceConfirmed` para `true` somente depois de validar os dados.
- `config.whatsappNumber` contém o destino no formato internacional, apenas com números: código do país, DDD e telefone. O valor inicial corresponde ao número fornecido pela equipe.
- `config.demoMode` mantém um aviso no pedido enquanto o catálogo estiver em demonstração. Depois de confirmar todos os dados, pode ser alterado para `false`.

`assets/js/order-utils.js` concentra a formatação de reais, a montagem da mensagem e a codificação do link do WhatsApp.

As categorias são configuradas no mesmo arquivo. Mantenha exatamente as quatro seções já previstas: `brownies`, `docinhos`, `bombons` e `combos`.

## Substituir imagens e logotipo

- O logotipo fornecido está em `assets/images/brand/logo-bem-adocicado.jpg`. Substitua esse arquivo mantendo o mesmo nome para preservar a referência; mantenha as proporções do original.
- As artes provisórias do banner ficam em `assets/images/banners/banner-desktop.svg` e `assets/images/banners/banner-mobile.svg`. Substitua os arquivos mantendo esses nomes ou atualize as duas referências no `<picture>` em `index.html`.
- As imagens dos produtos ficam em `assets/images/products/`. Cada caminho é informado no campo `image` do produto em `assets/js/catalog.js`. `produto-placeholder.svg` é apenas uma ilustração provisória, não uma foto final.

## Carrinho, formulário e privacidade

O carrinho usa centavos nos cálculos e mantém os itens e os campos preenchidos em `sessionStorage` durante a sessão desta aba, inclusive quando o visitante volta do WhatsApp. Os dados não são enviados a um servidor. O armazenamento da aba pode ser removido ao fechá-la ou limpar os dados do navegador.

O link do WhatsApp é aberto com a mensagem preenchida. A pessoa ainda precisa revisar e enviar a mensagem no próprio WhatsApp; abrir o link não confirma o pedido. Enquanto `demoMode` estiver ligado ou houver itens/preços provisórios, a mensagem inclui um aviso para confirmar o catálogo.

## Antes de divulgar

Confirme nomes, descrições, preços, disponibilidade, imagens e número de contato com a equipe. Depois, marque cada produto como não provisório, confirme os preços e desligue `demoMode`. Não use os preços de demonstração como valores de venda.
