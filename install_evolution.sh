#!/bin/bash

# Script para instalar Docker e Evolution API em um droplet Ubuntu

echo "🚀 Iniciando a instalação da Evolution API..."

# --- PASSO 1: ATUALIZAR O SISTEMA ---
echo "🔄 Atualizando pacotes do sistema..."
apt-get update -y
echo "✅ Pacotes atualizados."

# --- PASSO 2: INSTALAR DEPENDÊNCIAS DO DOCKER ---
echo "🔧 Instalando dependências para o Docker..."
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
echo "✅ Dependências instaladas."

# --- PASSO 3: ADICIONAR REPOSITÓRIO DOCKER ---
echo "🔑 Adicionando chave GPG do Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

echo "📦 Adicionando repositório do Docker..."
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" -y
echo "✅ Repositório adicionado."

# --- PASSO 4: INSTALAR DOCKER ---
echo "🐳 Instalando o Docker..."
apt-get update -y
apt-get install -y docker-ce
echo "✅ Docker instalado com sucesso!"

# --- PASSO 5: INSTALAR EVOLUTION API ---
echo "🤖 Baixando e iniciando a Evolution API..."
docker run -d \
    --name evolution_api \
    -p 8080:8080 \
    -e AUTHENTICATION_API_KEY='SUA_CHAVE_SECRETA_AQUI' \
    --restart=always \
    atendai/evolution-api:latest

echo "🎉 Instalação concluída!"
echo "--------------------------------------------------"
echo "✅ A Evolution API está rodando!"
echo "🔑 Sua chave de autenticação é: 'SUA_CHAVE_SECRETA_AQUI' (lembre-se de trocar!)"
echo "🌐 Acesse a API em: http://SEU_IP_DO_DROPLET:8080"
echo "--------------------------------------------------"