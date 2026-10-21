/**
 * MONITOR DE OFERTAS AUTOMÁTICO (SINCRONIZAÇÃO EM TEMPO REAL COM AUTO-PUBLICAÇÃO NO GITHUB)
 * Executa o robô garimpador e atualiza o site ao vivo periodicamente.
 */

const { exec } = require("child_process");

// Intervalo padrão: a cada 3 horas (180 minutos)
const INTERVAL_MINUTES = 180;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

function executarGarimpo() {
  const agora = new Date().toLocaleString("pt-BR");
  console.log(`\n⏰ [${agora}] Iniciando ciclo automático de garimpo em tempo real...`);

  exec("node crawler.js", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erro ao rodar garimpador:", error.message);
      return;
    }
    console.log(stdout);

    console.log("🚀 Verificando alterações no catálogo para publicação no GitHub Pages...");
    exec("git add products.js products-auto.json", (addErr) => {
      if (addErr) {
        console.error("❌ Erro no git add:", addErr.message);
        return;
      }

      exec("git diff --staged --name-only", (diffErr, diffOut) => {
        if (!diffOut || diffOut.trim().length === 0) {
          console.log("ℹ️ Nenhuma alteração pendente (catálogo já está 100% sincronizado com o GitHub).");
          console.log(`💤 Próximo ciclo automático em ${INTERVAL_MINUTES} minutos.`);
          return;
        }

        const commitMsg = `🤖 [Automação em Tempo Real] Ofertas atualizadas - ${new Date().toLocaleDateString("pt-BR")}`;
        exec(`git commit -m "${commitMsg}" && git push origin main`, (pushErr, pushOut) => {
          if (pushErr) {
            console.error("⚠️ Aviso ao subir para o GitHub:", pushErr.message);
          } else {
            console.log("✅ Site online atualizado no GitHub Pages com sucesso!");
          }
          console.log(`💤 Próximo ciclo automático em ${INTERVAL_MINUTES} minutos.`);
          console.log("Pressione Ctrl + C para pausar o monitor a qualquer momento.");
        });
      });
    });
  });
}

console.log("==========================================================");
console.log("⛏️  GARIMPEI AQUI AGORA - MONITOR DE OFERTAS EM TEMPO REAL");
console.log(`🔄 Ciclos automáticos a cada: ${INTERVAL_MINUTES} minutos (3 horas)`);
console.log("🌐 Auto-Deploy: Cada ciclo envia os novos produtos direto pro site!");
console.log("==========================================================");

// Executa o primeiro ciclo imediatamente
executarGarimpo();

// Mantém rodando a cada 3 horas
setInterval(executarGarimpo, INTERVAL_MS);

