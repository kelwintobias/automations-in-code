#!/usr/bin/env node

/**
 * Teste direto da API DigitalOcean
 * Verifica se o token está funcionando fazendo chamadas HTTP diretas
 */

require('dotenv').config();
const https = require('https');

const API_BASE = 'api.digitalocean.com';
const token = process.env.DIGITALOCEAN_API_TOKEN;

console.log('🔧 Testando API DigitalOcean diretamente...\n');

if (!token) {
    console.error('❌ Token não encontrado!');
    process.exit(1);
}

console.log('✅ Token encontrado');
console.log(`🔑 Token: ${token.substring(0, 12)}...${token.substring(token.length - 4)}\n`);

// Função para fazer requisições à API
function makeAPIRequest(path, description) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: API_BASE,
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        console.log(`🔄 ${description}...`);
        
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    if (res.statusCode === 200) {
                        console.log(`✅ ${description} - Sucesso!`);
                        resolve(jsonData);
                    } else {
                        console.log(`❌ ${description} - Erro ${res.statusCode}`);
                        console.log('Resposta:', jsonData);
                        reject(new Error(`HTTP ${res.statusCode}`));
                    }
                } catch (error) {
                    console.log(`❌ ${description} - Erro ao parsear JSON`);
                    console.log('Resposta bruta:', data);
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ ${description} - Erro de conexão:`, error.message);
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            console.log(`⏰ ${description} - Timeout`);
            req.destroy();
            reject(new Error('Timeout'));
        });
        
        req.end();
    });
}

// Testes sequenciais
async function runTests() {
    try {
        // 1. Testar informações da conta
        console.log('📋 Teste 1: Informações da conta');
        const account = await makeAPIRequest('/v2/account', 'Obtendo informações da conta');
        console.log(`   👤 Email: ${account.account.email}`);
        console.log(`   💰 Status: ${account.account.status}`);
        console.log(`   🆔 UUID: ${account.account.uuid}\n`);

        // 2. Listar droplets
        console.log('📋 Teste 2: Listando droplets');
        const droplets = await makeAPIRequest('/v2/droplets', 'Listando droplets');
        console.log(`   💧 Total de droplets: ${droplets.droplets.length}`);
        
        if (droplets.droplets.length > 0) {
            droplets.droplets.forEach((droplet, index) => {
                console.log(`   ${index + 1}. ${droplet.name} (${droplet.status}) - ${droplet.networks.v4[0]?.ip_address || 'Sem IP'}`);
            });
        } else {
            console.log('   📝 Nenhum droplet encontrado');
        }
        console.log('');

        // 3. Listar imagens disponíveis (limitado)
        console.log('📋 Teste 3: Imagens disponíveis');
        const images = await makeAPIRequest('/v2/images?type=distribution&per_page=5', 'Listando imagens do sistema');
        console.log(`   🖼️ Primeiras 5 imagens disponíveis:`);
        images.images.forEach((image, index) => {
            console.log(`   ${index + 1}. ${image.name} (${image.distribution})`);
        });
        console.log('');

        // 4. Listar regiões
        console.log('📋 Teste 4: Regiões disponíveis');
        const regions = await makeAPIRequest('/v2/regions', 'Listando regiões');
        const availableRegions = regions.regions.filter(r => r.available);
        console.log(`   🌍 Regiões disponíveis: ${availableRegions.length}`);
        availableRegions.slice(0, 5).forEach((region, index) => {
            console.log(`   ${index + 1}. ${region.name} (${region.slug})`);
        });
        console.log('');

        console.log('🎉 Todos os testes passaram! Sua API está funcionando perfeitamente.');
        console.log('✨ Agora você pode usar o MCP para automações avançadas!');

    } catch (error) {
        console.error('❌ Erro durante os testes:', error.message);
        
        if (error.message.includes('401')) {
            console.log('💡 Dica: Verifique se seu token está correto e não expirou');
        } else if (error.message.includes('403')) {
            console.log('💡 Dica: Verifique as permissões do seu token');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('💡 Dica: Verifique sua conexão com a internet');
        }
    }
}

// Executar testes
runTests();