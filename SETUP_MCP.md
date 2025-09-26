# Configuração MCP DigitalOcean

## Pré-requisitos

Para usar o servidor MCP do DigitalOcean você precisa de:

- Node.js v18 ou superior
- npm v8 ou superior
- Um cliente MCP (Claude, Cursor, VS Code, ou Windsurf)
- Um token de API do DigitalOcean

## Passo 1: Obter Token da API DigitalOcean

1. Acesse o painel do DigitalOcean
2. Vá para API → Tokens/Keys
3. Gere um novo Personal Access Token
4. Copie o token (você só verá ele uma vez)

## Passo 2: Configurar Variável de Ambiente

### Windows (PowerShell)
```powershell
$env:DIGITALOCEAN_API_TOKEN="seu_token_aqui"
```

### Para tornar permanente no Windows:
```powershell
[Environment]::SetEnvironmentVariable("DIGITALOCEAN_API_TOKEN", "seu_token_aqui", "User")
```

## Passo 3: Configuração MCP

O servidor MCP do DigitalOcean roda localmente usando npx e não requer instalação adicional.

### Configuração JSON para MCP:
```json
{
  "mcpServers": {
    "digitalocean": {
      "command": "npx",
      "args": ["-y", "@digitalocean/mcp", "--services", "apps"],
      "env": {
        "DIGITALOCEAN_API_TOKEN": "<your_api_token>"
      }
    }
  }
}
```

## Passo 4: Adicionar ao Cliente MCP

### Claude Code:
```bash
claude mcp add digitalocean \
  --env DIGITALOCEAN_API_TOKEN=${DIGITALOCEAN_API_TOKEN} \
  -- npx -y "@digitalocean/mcp"
```

### Verificar se foi adicionado:
```bash
claude mcp list
```

## Segurança

⚠️ **IMPORTANTE**: Não commite tokens de acesso no Git. Adicione arquivos de configuração ao .gitignore se necessário.

## Próximos Passos

Após configurar o MCP, você poderá:
- Gerenciar recursos do DigitalOcean via AI
- Automatizar deployments
- Monitorar aplicações
- Gerenciar droplets e serviços