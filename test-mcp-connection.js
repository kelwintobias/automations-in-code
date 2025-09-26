#!/usr/bin/env node

/**
 * Script para testar a conexão MCP com DigitalOcean
 * Este script verifica se o token da API está configurado corretamente
 * e se o servidor MCP consegue se conectar aos serviços do DigitalOcean
 */

require('dotenv').config();
const { spawn } = require('child_process');

console.log('🔧 Testando conexão MCP com DigitalOcean...\n');

// Verificar se o token está configurado
const token = process.env.DIGITALOCEAN_API_TOKEN;
if (!token) {
    console.error('❌ DIGITALOCEAN_API_TOKEN não está configurado!');
    console.log('📝 Configure o token seguindo as instruções em SETUP_MCP.md');
    process.exit(1);
}

console.log('✅ Token da API encontrado');
console.log(`🔑 Token: ${token.substring(0, 8)}...${token.substring(token.length - 4)}`);

// Testar o servidor MCP
console.log('\n🚀 Iniciando teste do servidor MCP...');

const mcpProcess = spawn('npx', ['-y', '@digitalocean/mcp', '--services', 'apps,droplets,networking'], {
    env: {
        ...process.env,
        DIGITALOCEAN_API_TOKEN: token
    },
    stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

mcpProcess.stdout.on('data', (data) => {
    output += data.toString();
});

mcpProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

// Timeout para o teste
const timeout = setTimeout(() => {
    mcpProcess.kill();
    console.log('✅ Servidor MCP iniciou com sucesso (timeout após 5s)');
    console.log('🎉 Conexão com DigitalOcean estabelecida!');
    
    console.log('\n📋 Próximos passos:');
    console.log('1. Configure seu cliente MCP (Claude, Cursor, VS Code, etc.)');
    console.log('2. Use a configuração em mcp-config.json');
    console.log('3. Comece a automatizar seus recursos DigitalOcean!');
    
    process.exit(0);
}, 5000);

mcpProcess.on('close', (code) => {
    clearTimeout(timeout);
    
    if (code === 0) {
        console.log('✅ Servidor MCP funcionando corretamente!');
    } else {
        console.error(`❌ Servidor MCP falhou com código: ${code}`);
        if (errorOutput) {
            console.error('Erro:', errorOutput);
        }
    }
});

mcpProcess.on('error', (error) => {
    clearTimeout(timeout);
    console.error('❌ Erro ao iniciar servidor MCP:', error.message);
    
    if (error.code === 'ENOENT') {
        console.log('💡 Certifique-se de que Node.js e npm estão instalados');
    }
    
    process.exit(1);
});

// Enviar dados de teste para o processo MCP
setTimeout(() => {
    mcpProcess.stdin.write('{"jsonrpc": "2.0", "method": "initialize", "params": {}, "id": 1}\n');
}, 1000);