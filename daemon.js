/**
 * MONITOR DE OFERTAS EM SEGUNDO PLANO (MODO COMPUTADOR LIGADO)
 * Executa o robô garimpador continuamente a cada intervalo configurado.
 */

const { exec } = require("child_process");

// Intervalo em minutos (padrão: a cada 60 minutos)
const INTERVAL_MINUTES = 60;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

function executarGarimpo() {
  const agora = new Date().toLocaleTimeString("pt-BR");
  console.log(`\n⏰ [${agora}] Iniciando ciclo automático de garimpo...`);

  exec("node crawler.js", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erro ao rodar garimpador:", error.message);
      return;
    }
    console.log(stdout);
    console.log(`💤 Próxima varredura automática em ${INTERVAL_MINUTES} minutos.`);
    console.log("Pressione Ctrl + C a qualquer momento para pausar o monitor.");
  });
}

console.log("==========================================================");
console.log("⛏️  GARIMPO DE OFERTAS - MONITOR ATIVO NO SEU COMPUTADOR");
console.log(`🔄 Ciclos automáticos programados para cada: ${INTERVAL_MINUTES} minutos`);
console.log("==========================================================");

// Executa a primeira vez imediatamente
executarGarimpo();

// Agenda para continuar rodando no intervalo definido
setInterval(executarGarimpo, INTERVAL_MS);
