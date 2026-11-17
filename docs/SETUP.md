# Configuração e execução local

[← Voltar ao README](../README.md)

Este guia descreve a configuração **com base na branch `feature/calendly-native-booking`**. Consulte os arquivos `.env.example` do repositório se as opções mudarem.

## 1. Pré-requisitos

- Node.js e npm compatíveis com as dependências declaradas em `package.json` e `server/package.json`.
- Ambiente de desenvolvimento React Native/Expo preparado para a plataforma escolhida.
- Android Studio e Android SDK, se for executar `npm run android` localmente.
- Projeto OAuth configurado no Google Cloud com os identificadores de cliente necessários ao Google Sign-In.
- Conta Calendly com token de API e permissões necessárias às operações usadas no app, inclusive criação e cancelamento quando aplicável.
- Um tipo de evento Calendly habilitado para agendamento e configurado com disponibilidade.

> Como o projeto inclui `@react-native-google-signin/google-signin`, utilize um **development build** com o módulo nativo. O Expo Go não substitui esse build para o login Google.

## 2. Clonar e instalar

```bash
git clone https://github.com/Carlos-bub/oriently2025.git
cd oriently2025
```

> Enquanto as alterações não forem integradas à `master`, faça checkout da branch com a arquitetura documentada:
>
> ```bash
> git checkout feature/calendly-native-booking
> ```

Instale separadamente as dependências do servidor e do aplicativo:

```bash
npm ci
cd server
npm ci
cd ..
```

## 3. Configurar o backend

A partir da raiz:

```bash
cd server
cp .env.example .env
```

No Windows PowerShell, substitua `cp` por `Copy-Item` se preferir.

Configure `server/.env`:

| Variável | Finalidade |
| --- | --- |
| `PORT` | Porta HTTP do BFF, padrão `3333`. |
| `CALENDLY_API_BASE_URL` | URL base da API, geralmente `https://api.calendly.com`. |
| `CALENDLY_API_TOKEN` | **Token privado** do Calendly; nunca adicionar ao app. |
| `CALENDLY_TIMEOUT_MS` | Tempo limite das chamadas ao Calendly. |
| `ALLOWED_EVENT_TYPE_URIS` | URIs dos tipos de evento permitidos, separadas por vírgula; obrigatórias em `NODE_ENV=production`. |
| `GOOGLE_CLIENT_IDS` | IDs OAuth do Google aceitos na verificação do ID Token, separados por vírgula. |
| `CORS_ALLOWED_ORIGINS` | Origens autorizadas para requisições de navegadores. |

**Importante:** preencha os valores reais apenas no arquivo `.env` local e nos segredos do seu provedor de hospedagem. Não publique o arquivo nem compartilhe tokens em capturas, logs ou issues.

Execute o servidor:

```bash
npm run build
npm start
```

Em outro terminal, confirme que o healthcheck responde:

```bash
curl http://localhost:3333/health
```

Resposta esperada:

```json
{"ok":true,"service":"oriently-bff"}
```

O healthcheck verifica se o processo HTTP está ativo; não confirma, por si só, que o token Calendly ou o Google Sign-In estejam corretamente configurados.

## 4. Configurar o aplicativo

Na raiz do projeto:

```bash
cp .env.example .env
```

Variáveis usadas pelo aplicativo:

| Variável | Finalidade |
| --- | --- |
| `EXPO_PUBLIC_BACKEND_URL` | Endereço HTTP(S) do seu BFF acessível pelo dispositivo. |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google Web Client ID utilizado na configuração do Google Sign-In. |

Exemplo ilustrativo para desenvolvimento **na mesma rede local** (ou via `adb reverse tcp:3333 tcp:3333`):

```dotenv
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3333
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=SEU_WEB_CLIENT_ID.apps.googleusercontent.com
```

**Nunca configure** `EXPO_PUBLIC_API_TOKEN` ou `CALENDLY_API_TOKEN` no aplicativo. Variáveis prefixadas com `EXPO_PUBLIC_` não são segredos.

### Rede e dispositivo

- Em um aparelho físico via USB, é possível usar `adb reverse tcp:3333 tcp:3333` e `adb reverse tcp:8081 tcp:8081`.
- Via Wi-Fi na mesma rede local, o IP usado em `EXPO_PUBLIC_BACKEND_URL` deve ser alcançável pelo celular (`localhost` no celular aponta para o próprio dispositivo).
- Confirme firewall, Wi-Fi e permissões de comunicação em rede.

## 5. Executar o app

Com o backend em execução, na raiz:

```bash
npx expo start --dev-client
```

Para criar/executar um build nativo Android local com o ambiente configurado:

```bash
npm run android
```

O Google Sign-In requer configuração correta do projeto OAuth para o pacote Android (`com.oriently.app`) e as credenciais/assinaturas utilizadas no build.

## 6. Validar a integração

Faça a verificação nesta ordem:

1. Inicie o BFF e confirme `/health`.
2. Entre com Google no aplicativo.
3. Abra o agendamento e confira os tipos de evento e horários disponíveis.
4. Faça uma reserva de teste com dados que você controla.
5. Confirme o evento na Home, Agenda e Detalhes.
6. Abra o link da videoconferência **somente quando o Calendly fornecer um link válido**.
7. Teste o cancelamento de uma reunião de teste e confira o resultado no Calendly.
8. Verifique os comportamentos de falha de rede e sessão expirada.

Não utilize eventos de terceiros para testes de cancelamento.

## 7. Testes automatizados

### Aplicativo

```bash
npm run typecheck
npm test
```

O script `npm test` compila os testes via `tsconfig.test.json` e executa o Node.js Test Runner em `.test-dist/services/__tests__/`.

### Servidor

```bash
cd server
npm run typecheck
npm test
```

O script de testes do servidor compila TypeScript e executa os testes de `dist/__tests__/`.

## 8. Captura de telas para documentação

Com um aparelho Android conectado via ADB, execute o script interativo na raiz do repositório para gerar as imagens em `docs/images/`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\capture-screenshots.ps1
```

Também é possível capturar apenas uma tela específica (`login`, `home`, `agendar`, `agenda` ou `detalhes`):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\capture-screenshots.ps1 -Screen home
```

## 9. Problemas frequentes

| Sintoma | O que verificar |
| --- | --- |
| O app não alcança o backend | IP, porta, firewall, `adb reverse` e `EXPO_PUBLIC_BACKEND_URL`. |
| Login Google falha | Web Client ID, configuração OAuth, pacote Android e assinatura do build. |
| Erro de autenticação no BFF | Se o ID Token está sendo enviado e se o client ID consta em `GOOGLE_CLIENT_IDS`. |
| Nenhum horário aparece | Disponibilidade Calendly, tipo de evento e `ALLOWED_EVENT_TYPE_URIS`. |
| Erro ao criar reunião | Permissões do token Calendly e disponibilidade real do horário. |
| O link de sala não aparece | Verifique se o evento tem `location.join_url` válido; o link de evento Calendly não substitui o de reunião. |
| Tentativa de reserva com resultado incerto | Confira primeiro sua agenda antes de tentar novamente, para reduzir risco de duplicidade. |

## 10. Segurança antes de publicar

- Verifique se nenhum `.env` ou token está versionado, inclusive em commits antigos.
- Se uma credencial real já foi exposta no histórico, **revogue/rotacione** essa credencial.
- Mantenha `ALLOWED_EVENT_TYPE_URIS` preenchida em produção.
- Não use credenciais privadas nem uma conta real compartilhada para o modo demo.

## 11. Modo demonstração

O modo demonstração (**"Explorar modo demo"**) funciona offline com dados fictícios em memória (`src/services/demoData.ts`), permitindo navegar por Home, Agendamento, Agenda e Detalhes sem chamar o BFF nem alterar dados reais no Calendly. Utilize o login Google para validar a integração real com Calendly.
