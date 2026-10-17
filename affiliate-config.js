// Configurações Oficiais de Afiliado - Garimpei Aqui Agora
// Lojas ativas no momento: Mercado Livre, Shopee e Magazine Luiza

const AFFILIATE_CONFIG = {
  mercadolivre: {
    // 1. toolId (matt_tool): Código numérico da ferramenta no portal do Mercado Livre Afiliados
    // 2. affiliateWord (matt_word): Sua palavra-chave ou sub-id de rastreamento de canal
    toolId: "", // Exemplo: "64738291"
    affiliateWord: "", // Exemplo: "garimpeiaquiagora"
    enabled: true
  },
  shopee: {
    // ID da sua conta de afiliado Shopee ou Universal Link
    affiliateId: "", // Exemplo: "182390192"
    enabled: true
  },
  magalu: {
    // Nome da sua loja no Magazine Você (ex: "magazinemaisofertas")
    // Converte os produtos automaticamente para: magazinevoce.com.br/SEUNOME/p/...
    storeName: "magazinemaisofertas",
    enabled: true
  },
  // Pausados temporariamente até aprovação de afiliado:
  amazon: {
    tag: "",
    enabled: false
  },
  aliexpress: {
    trackingId: "",
    enabled: false
  }
};

// Exporta para uso em Node.js e no Navegador
if (typeof module !== "undefined" && module.exports) {
  module.exports = AFFILIATE_CONFIG;
}
