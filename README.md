# ⛏️ Garimpei Aqui Agora - Plataforma com Automação de Afiliados

O **Garimpei Aqui Agora** conta com um **Robô de Automação & Mapeador de Afiliados** que busca as melhores ofertas da internet e anexa **automaticamente as suas tags e códigos de afiliado** em todos os produtos!

---

## 🤖 Como Funciona a Automação

### 1. Mapeador Inteligente de Links (`auto-mapper.js`)
O sistema detecta automaticamente de qual loja é o produto e aplica as suas credenciais:
- **Amazon**: Converte qualquer URL comum no formato comissionado com a sua tag (`?tag=suatag-20`).
- **Shopee**: Gera o link de afiliado rastreado pela sua conta Shopee.
- **Mercado Livre**: Injeta o parâmetro oficial de rastreamento do Mercado Livre Afiliados.
- **Magazine Luiza (Magalu)**: Converte para a sua vitrine personalizada do Magazine Você (`magazinevoce.com.br/magazineSEUNOME/p/...`).
- **AliExpress**: Injeta o seu Tracking ID do AliExpress Portals.

---

### 2. Configurar Suas Tags Diretamente pelo Site
Você não precisa mexer em arquivos de código para configurar suas tags:
1. Abra o site no navegador.
2. Clique no botão **"⚙️ Minhas Tags"** no canto superior direito.
3. Digite suas tags da **Amazon**, **Shopee**, **Magalu**, **Mercado Livre** ou **AliExpress**.
4. Clique em **"Salvar e Mapear Links"**.
5. Na mesma hora, **todas as ofertas da página são atualizadas** para os seus links de afiliado!

---

### 3. Rodar o Robô Garimpador Localmente
Sempre que quiser atualizar o catálogo com novos produtos com descontos de até 70%:
```bash
npm run garimpar
```
Ou:
```bash
node crawler.js
```
O robô processará os produtos, anexará suas tags e atualizará o arquivo [`products.js`](file:///c:/Users/Joao%20Felipe/site/products.js) sozinho!

---

### 4. Automação 24/7 Gratuita na Nuvem (GitHub Actions)
O projeto já inclui o fluxo [`.github/workflows/atualizar-ofertas.yml`](file:///c:/Users/Joao%20Felipe/site/.github/workflows/atualizar-ofertas.yml).
Quando você enviar esse projeto para o seu GitHub:
- O GitHub executará o robô **automaticamente a cada 6 horas**.
- Ele garimpa novos produtos, aplica seus links e publica as ofertas no site **sem você precisar deixar o computador ligado**!

---

## 📁 Estrutura do Sistema

- [`index.html`](file:///c:/Users/Joao%20Felipe/site/index.html) - Interface web moderna com painel de tags e modal de ofertas.
- [`style.css`](file:///c:/Users/Joao%20Felipe/site/style.css) - Design moderno com modo escuro/claro e cards de alta conversão.
- [`auto-mapper.js`](file:///c:/Users/Joao%20Felipe/site/auto-mapper.js) - Motor de conversão universal de links de afiliados.
- [`affiliate-config.js`](file:///c:/Users/Joao%20Felipe/site/affiliate-config.js) - Arquivo central onde suas credenciais ficam salvas.
- [`crawler.js`](file:///c:/Users/Joao%20Felipe/site/crawler.js) - Robô de automação que minera ofertas e formata os dados.
- [`products.js`](file:///c:/Users/Joao%20Felipe/site/products.js) - Catálogo ativo exibido para os visitantes do site.
- [`app.js`](file:///c:/Users/Joao%20Felipe/site/app.js) - Lógica de busca, filtros de lojas/categorias e sincronização.
