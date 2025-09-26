# Automations in Code - DigitalOcean MCP Integration

🚀 Projeto de automações usando Model Context Protocol (MCP) com DigitalOcean para gerenciar recursos VPS de forma inteligente.

## 📋 Sobre o Projeto

Este projeto utiliza o protocolo MCP (Model Context Protocol) para conectar ferramentas de IA (como Claude, Cursor, VS Code) diretamente com a API do DigitalOcean, permitindo automações inteligentes de infraestrutura.

## 🛠️ Pré-requisitos

- Node.js v18+ 
- npm v8+
- Token de API do DigitalOcean
- Cliente MCP (Claude, Cursor, VS Code, ou Windsurf)

## ⚡ Configuração Rápida

1. **Clone e instale dependências:**
```bash
git clone <seu-repo>
cd automations-in-code
npm install
```

2. **Configure o token da API:**
```bash
# Copie o arquivo de exemplo
copy .env.example .env

# Edite .env e adicione seu token DigitalOcean
DIGITALOCEAN_API_TOKEN=seu_token_aqui
```

3. **Teste a conexão:**
```bash
node test-mcp-connection.js
```

## 🔧 Configuração MCP

O arquivo `mcp-config.json` contém a configuração para conectar seu cliente MCP ao DigitalOcean:

```json
{
  "mcpServers": {
    "digitalocean": {
      "command": "npx",
      "args": ["-y", "@digitalocean/mcp", "--services", "apps,droplets,networking"],
      "env": {
        "DIGITALOCEAN_API_TOKEN": "${DIGITALOCEAN_API_TOKEN}"
      }
    }
  }
}
```

## 📚 Documentação

- [`SETUP_MCP.md`](./SETUP_MCP.md) - Guia completo de configuração MCP
- [Documentação DigitalOcean MCP](https://docs.digitalocean.com/products/app-platform/how-to/use-mcp/)

## 🚀 Uso

```bash
# Iniciar o projeto
npm start

# Modo desenvolvimento
npm run dev

# Testar servidor MCP
npm run mcp-test
```

## 🔐 Segurança

- ⚠️ **NUNCA** commite tokens de API no Git
- Use variáveis de ambiente para credenciais
- Arquivo `.env` está no `.gitignore`

## 🎯 Funcionalidades Planejadas

- ✅ Configuração MCP com DigitalOcean
- 🔄 Automação de deploy de aplicações
- 📊 Monitoramento de recursos
- 🔧 Gerenciamento de droplets
- 🌐 Configuração de networking

## 📄 Licença

MIT