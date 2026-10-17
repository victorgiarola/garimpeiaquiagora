/**
 * MONITOR DE OFERTAS AUTOMÁTICO (A CADA 3 HORAS COM AUTO-PUBLICAÇÃO NO GITHUB)
 * Executa o robô garimpador e atualiza o site ao vivo a cada 3 horas.
 */

const { exec } = require("child_process");

// Intervalo solicitado: a cada 3 horas (180 minutos)
const INTERVAL_MINUTES = 180;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

function executarGarimpo() {
  const agora = new Date().toLocaleString("pt-BR");
  console.log(`\n⏰ [${agora}] Iniciando ciclo automático de garimpo...`);

  exec("node crawler.js", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erro ao rodar garimpador:", error.message);
      return;
    }
    console.log(stdout);

    // Auto-commit e push para o site no GitHub Pages atualizar sozinho
    console.log("🚀 Publicando novas ofertas automaticamente no GitHub Pages...");
    exec('git add products.js products-auto.json && git commit -m "🤖 [Automação 3h] Ofertas atualizadas" && git push origin main', (gitErr, gitOut) => {
      if (gitErr) {
        console.log("ℹ️ Catálogo local atualizado (sem alterações remotas pendentes).");
      } else {
        console.log("✅ Site online atualizado no GitHub Pages com sucesso!");
      }
      console.log(`💤 Próximo ciclo automático em ${INTERVAL_MINUTES} minutos (3 horas).`);
      console.log("Pressione Ctrl + C para pausar o monitor a qualquer momento.");
    });
  });
}

console.log("==========================================================");
console.log("⛏️  GARIMPEI AQUI AGORA - MONITOR AUTOMÁTICO 3 HORAS");
console.log(`🔄 Ciclos programados para rodar a cada: ${INTERVAL_MINUTES} minutos (3 horas)`);
console.log("🌐 Auto-Deploy: Cada ciclo envia os novos produtos direto pro site!");
console.log("==========================================================");

// Executa o primeiro ciclo imediatamente
executarGarimpo();

// Mantém rodando a cada 3 horas
setInterval(executarGarimpo, INTERVAL_MS);
