#!/usr/bin/env node

/**
 * Gerenciador de Droplets DigitalOcean
 * Script para interagir com o droplet "projeto-nutri"
 */

require('dotenv').config();
const https = require('https');

const API_BASE = 'api.digitalocean.com';
const token = process.env.DIGITALOCEAN_API_TOKEN;

console.log('🚀 Gerenciador de Droplets DigitalOcean');
console.log('=' .repeat(40));

class DropletManager {
    constructor() {
        this.token = token;
        this.dropletId = null;
        this.dropletInfo = null;
    }

    // Fazer requisição à API
    async makeRequest(path, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: API_BASE,
                port: 443,
                path: path,
                method: method,
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let responseData = '';
                
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(responseData);
                        
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(jsonData);
                        } else {
                            reject(new Error(`HTTP ${res.statusCode}: ${jsonData.message || 'Erro desconhecido'}`));
                        }
                    } catch (error) {
                        reject(new Error('Erro ao parsear resposta JSON'));
                    }
                });
            });
            
            req.on('error', (error) => {
                reject(error);
            });
            
            if (data) {
                req.write(JSON.stringify(data));
            }
            
            req.end();
        });
    }

    // Encontrar droplet por nome
    async findDroplet(name = 'projeto-nutri') {
        console.log(`🔍 Procurando droplet: ${name}`);
        
        try {
            const response = await this.makeRequest('/v2/droplets');
            const droplet = response.droplets.find(d => d.name === name);
            
            if (droplet) {
                this.dropletId = droplet.id;
                this.dropletInfo = droplet;
                console.log(`✅ Droplet encontrado!`);
                this.displayDropletInfo();
                return droplet;
            } else {
                console.log(`❌ Droplet "${name}" não encontrado`);
                return null;
            }
        } catch (error) {
            console.error('❌ Erro ao buscar droplets:', error.message);
            return null;
        }
    }

    // Exibir informações do droplet
    displayDropletInfo() {
        if (!this.dropletInfo) return;

        const d = this.dropletInfo;
        console.log('\n📊 Informações do Droplet:');
        console.log(`   🏷️  Nome: ${d.name}`);
        console.log(`   🆔 ID: ${d.id}`);
        console.log(`   📍 Status: ${d.status}`);
        console.log(`   🌍 Região: ${d.region.name} (${d.region.slug})`);
        console.log(`   💾 Tamanho: ${d.size.slug} (${d.size.vcpus} vCPUs, ${d.size.memory}MB RAM, ${d.size.disk}GB SSD)`);
        console.log(`   🖥️  Imagem: ${d.image.name} (${d.image.distribution})`);
        console.log(`   🌐 IP Público: ${d.networks.v4.find(n => n.type === 'public')?.ip_address || 'N/A'}`);
        console.log(`   🔒 IP Privado: ${d.networks.v4.find(n => n.type === 'private')?.ip_address || 'N/A'}`);
        console.log(`   📅 Criado em: ${new Date(d.created_at).toLocaleString('pt-BR')}`);
        console.log(`   💰 Preço/hora: $${d.size.price_hourly} | Preço/mês: $${d.size.price_monthly}`);
    }

    // Obter métricas do droplet
    async getMetrics() {
        if (!this.dropletId) {
            console.log('❌ Droplet não selecionado');
            return;
        }

        console.log('\n📈 Obtendo métricas...');
        
        try {
            // Infelizmente, a API v2 não tem endpoint direto para métricas detalhadas
            // Mas podemos mostrar informações básicas
            const response = await this.makeRequest(`/v2/droplets/${this.dropletId}`);
            const droplet = response.droplet;
            
            console.log('📊 Status atual:');
            console.log(`   ⚡ Status: ${droplet.status}`);
            console.log(`   🔄 Locked: ${droplet.locked ? 'Sim' : 'Não'}`);
            console.log(`   🛡️  Backup IDs: ${droplet.backup_ids.length > 0 ? droplet.backup_ids.join(', ') : 'Nenhum backup'}`);
            console.log(`   📸 Snapshot IDs: ${droplet.snapshot_ids.length > 0 ? droplet.snapshot_ids.join(', ') : 'Nenhum snapshot'}`);
            
        } catch (error) {
            console.error('❌ Erro ao obter métricas:', error.message);
        }
    }

    // Listar ações recentes
    async getRecentActions() {
        if (!this.dropletId) {
            console.log('❌ Droplet não selecionado');
            return;
        }

        console.log('\n📋 Ações recentes...');
        
        try {
            const response = await this.makeRequest(`/v2/droplets/${this.dropletId}/actions`);
            const actions = response.actions.slice(0, 5); // Últimas 5 ações
            
            if (actions.length === 0) {
                console.log('   📝 Nenhuma ação recente encontrada');
                return;
            }

            actions.forEach((action, index) => {
                const date = new Date(action.started_at).toLocaleString('pt-BR');
                console.log(`   ${index + 1}. ${action.type} - ${action.status} (${date})`);
            });
            
        } catch (error) {
            console.error('❌ Erro ao obter ações:', error.message);
        }
    }

    // Criar snapshot
    async createSnapshot(name) {
        if (!this.dropletId) {
            console.log('❌ Droplet não selecionado');
            return;
        }

        const snapshotName = name || `snapshot-${this.dropletInfo.name}-${Date.now()}`;
        console.log(`\n📸 Criando snapshot: ${snapshotName}`);
        
        try {
            const response = await this.makeRequest(`/v2/droplets/${this.dropletId}/actions`, 'POST', {
                type: 'snapshot',
                name: snapshotName
            });
            
            console.log('✅ Snapshot iniciado!');
            console.log(`   🆔 Action ID: ${response.action.id}`);
            console.log(`   📊 Status: ${response.action.status}`);
            console.log('   ⏳ O snapshot pode levar alguns minutos para completar...');
            
        } catch (error) {
            console.error('❌ Erro ao criar snapshot:', error.message);
        }
    }

    // Menu interativo
    async showMenu() {
        console.log('\n🎯 Opções disponíveis:');
        console.log('1. 📊 Ver informações detalhadas');
        console.log('2. 📈 Ver métricas atuais');
        console.log('3. 📋 Ver ações recentes');
        console.log('4. 📸 Criar snapshot');
        console.log('5. 🔄 Atualizar informações');
        console.log('\n💡 Este é um exemplo das automações possíveis!');
        console.log('🚀 Com MCP, você pode integrar isso diretamente no seu IDE!');
    }
}

// Função principal
async function main() {
    const manager = new DropletManager();
    
    // Encontrar o droplet
    const droplet = await manager.findDroplet('projeto-nutri');
    
    if (droplet) {
        await manager.getMetrics();
        await manager.getRecentActions();
        await manager.showMenu();
        
        console.log('\n🎉 Teste concluído com sucesso!');
        console.log('💡 Próximos passos: Configure o MCP no seu IDE para automações avançadas!');
    }
}

// Executar se for o arquivo principal
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { DropletManager };