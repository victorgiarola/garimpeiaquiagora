// Configurações Oficiais de Afiliado - Garimpei Aqui Agora
// Insira aqui os seus códigos e credenciais de afiliado de cada plataforma.
// O robô de automação e o site usarão essas credenciais para comissionar todas as vendas!

const AFFILIATE_CONFIG = {
  amazon: {
    // Sua Tag de Associado da Amazon Brasil (ex: "garimpeiaqui-20" ou "seunome-20")
    // Obtida em: Associados Amazon -> Ferramentas -> Tag de Rastreamento
    tag: "garimpeiaqui-20",
    enabled: true
  },
  mercadolivre: {
    // O Mercado Livre exige DUAS métricas oficiais para registrar a comissão:
    // 1. toolId (matt_tool): Código numérico da ferramenta gerado no portal de afiliados
    // 2. affiliateWord (matt_word): Palavra-chave ou identificador de campanha/canal
    toolId: "", // Exemplo: "64738291"
    affiliateWord: "", // Exemplo: "garimpeiaquiagora"
    enabled: true
  },
  shopee: {
    // Seu ID de Afiliado ou Universal Link da Shopee (ex: "182390192")
    // Suporta links encurtados automáticos (s.shopee.com.br / shope.ee) ou Universal ID
    affiliateId: "",
    enabled: true
  },
  magalu: {
    // Nome da sua loja no Magazine Você (ex: "magazinemaisofertas")
    // Converte os produtos automaticamente para: magazinevoce.com.br/SEUNOME/p/...
    storeName: "magazinemaisofertas",
    enabled: true
  },
  aliexpress: {
    // Seu Tracking ID do AliExpress Portals (ex: "garimpeiaqui_ali")
    trackingId: "",
    enabled: true
  }
};

// Exporta para uso em Node.js e no Navegador
if (typeof module !== "undefined" && module.exports) {
  module.exports = AFFILIATE_CONFIG;
}
