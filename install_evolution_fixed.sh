#!/bin/bash

# Script para instalar Docker e Evolution API em Ubuntu 24.10 (Plucky)
# Corrige o problema da chave GPG do Docker

echo "🚀 Iniciando a instalação da Evolution API no Ubuntu 24.10..."

# --- PASSO 1: ATUALIZAR O SISTEMA ---
echo "🔄 Atualizando pacotes do sistema..."
apt-get update -y
echo "✅ Pacotes atualizados."

# --- PASSO 2: INSTALAR DEPENDÊNCIAS ---
echo "🔧 Instalando dependências..."
apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release
echo "✅ Dependências instaladas."

# --- PASSO 3: REMOVER REPOSITÓRIOS ANTIGOS DO DOCKER (se existirem) ---
echo "🧹 Limpando repositórios antigos do Docker..."
apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# --- PASSO 4: ADICIONAR CHAVE GPG CORRETA DO DOCKER ---
echo "🔑 Adicionando chave GPG oficial do Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# --- PASSO 5: ADICIONAR REPOSITÓRIO DOCKER PARA UBUNTU 24.04 (compatível) ---
echo "📦 Adicionando repositório do Docker..."
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu noble stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# --- PASSO 6: ATUALIZAR E INSTALAR DOCKER ---
echo "🐳 Instalando o Docker..."
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
echo "✅ Docker instalado com sucesso!"

# --- PASSO 7: INICIAR E HABILITAR DOCKER ---
echo "🔄 Iniciando serviço do Docker..."
systemctl start docker
systemctl enable docker
echo "✅ Docker iniciado e habilitado!"

# --- PASSO 8: VERIFICAR INSTALAÇÃO DO DOCKER ---
echo "🔍 Verificando instalação do Docker..."
docker --version
echo "✅ Docker verificado!"

# --- PASSO 9: INSTALAR EVOLUTION API ---
echo "🤖 Baixando e iniciando a Evolution API..."
docker run -d \
    --name evolution_api \
    -p 8080:8080 \
    -e AUTHENTICATION_API_KEY='EvolutionAPI2024!' \
    --restart=always \
    atendai/evolution-api:latest

# --- PASSO 10: VERIFICAR SE O CONTAINER ESTÁ RODANDO ---
echo "🔍 Verificando se o container está rodando..."
sleep 5
docker ps | grep evolution_api

echo ""
echo "🎉 Instalação concluída!"
echo "--------------------------------------------------"
echo "✅ A Evolution API está rodando!"
echo "🔑 Sua chave de autenticação é: 'EvolutionAPI2024!'"
echo "🌐 Acesse a API em: http://104.236.214.147:8080"
echo "📚 Documentação: http://104.236.214.147:8080/docs"
echo "🎛️  Manager: http://104.236.214.147:8080/manager"
echo "--------------------------------------------------"
echo ""
echo "💡 Para verificar os logs da API:"
echo "   docker logs evolution_api"
echo ""
echo "💡 Para parar a API:"
echo "   docker stop evolution_api"
echo ""
echo "💡 Para reiniciar a API:"
echo "   docker restart evolution_api"
echo "--------------------------------------------------"