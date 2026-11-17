# Configuração e execução local

[← Voltar ao README](../README.md)

Este guia foi pensado para quem acabou de clonar o repositório e quer:

1. **Testar o aplicativo rapidamente no Modo Demonstração** (sem backend, sem `.env` e sem credenciais Google/Calendly); ou
2. **Configurar o ambiente completo** com backend BFF, Google Sign-In e Calendly reais.

---

## 1. Início rápido — Modo demonstração

O modo demonstração funciona **offline**, sem precisar iniciar o servidor `server/`, sem criar arquivos `.env` e sem configurar credenciais do Google ou do Calendly. Todos os dados (orientador fictício, tipos de evento, horários futuros, agendamentos e cancelamentos) são simulados localmente em memória (`src/services/demoData.ts`).

> **Importante sobre Expo Go:** o projeto importa o módulo nativo `@react-native-google-signin/google-signin` na inicialização (`App.tsx` e `Login`). Por isso, **o Expo Go não é compatível** — mesmo para usar apenas o modo demonstração, é necessário gerar ou instalar um **Development Build** Android.

### Passos (Android)

1. Clone o repositório e instale as dependências do aplicativo:

   ```bash
   git clone https://github.com/Carlos-bub/oriently2025.git
   cd oriently2025
   npm ci
   ```

2. Conecte um aparelho Android com **Depuração USB** ativada (ou inicie um emulador Android) e gere/execute o Development Build:

   ```bash
   npx expo run:android
   ```

   *(Se o build nativo já estiver instalado no aparelho, basta iniciar o Metro bundler com `npx expo start --dev-client`.)*

3. Na tela de **Login**, toque em **"Explorar modo demo"** para navegar por **Início**, **Agendar**, **Agenda** e **Detalhes da Orientação** com dados fictícios.

---

## 2. Pré-requisitos e versões validadas

- **Node.js:**
  - **Node.js 20 LTS** (versão validada no workflow de CI em `.github/workflows/ci.yml` e recomendada para Expo SDK 52 / React Native 0.76).
  - *Validado também localmente com Node.js `v26.13.1` nos scripts de `typecheck` e `test`.*
- **Android (para build nativo local):**
  - Android Studio, Android SDK (Platform Tools / `adb`) e JDK 17 configurados nas variáveis de ambiente (`ANDROID_HOME` e `JAVA_HOME`).
  - Aparelho físico Android com Google Play Services ou emulador Android com imagem Google APIs / Play Store.
- **Para o modo real (opcional no modo demo):**
  - Conta no Google Cloud Console com OAuth 2.0 configurado.
  - Conta no Calendly com Personal Access Token e ao menos um Event Type ativo.

---

## 3. Orientações para Windows PowerShell

Ao executar comandos no Windows PowerShell:

- Se o PowerShell bloquear `npm` ou `npx` com erro de `ExecutionPolicy` (`npm.ps1 cannot be loaded`), utilize **`npm.cmd`** e **`npx.cmd`** (ex.: `npm.cmd ci`, `npx.cmd expo run:android`).
- Em PowerShell 5.1, encadeie comandos com `;` (ou em linhas separadas) em vez de `&&`.
- Para copiar arquivos de exemplo, use `Copy-Item .env.example .env`.
- Caso `adb` não esteja no `PATH`, utilize o executável padrão do Android SDK:

  ```powershell
  & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
  ```

- Ao testar com celular conectado via USB, o redirecionamento de portas evita depender de firewall/IP da rede:

  ```powershell
  & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:8081 tcp:8081
  & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:3333 tcp:3333
  ```

---

## 4. Modo real — Configuração de Google OAuth, SHA-1 e Calendly

### 4.1. Google Cloud OAuth e SHA-1 Android

1. Acesse o **Google Cloud Console**, crie ou selecione um projeto e configure a **Tela de permissão OAuth** (*OAuth consent screen*).
2. Em **Credenciais → Criar credenciais → ID do cliente OAuth**:
   - **Aplicativo da Web (Web Client ID):** copie o ID gerado (`*.apps.googleusercontent.com`). Ele será usado em:
     - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (no `.env` do app);
     - `GOOGLE_CLIENT_IDS` (no `server/.env` do backend BFF).
   - **Android:** informe o nome do pacote configurado em `app.json` (**`com.oriently.app`**) e o **certificado SHA-1** do keystore utilizado no build.
3. Para obter o **SHA-1** do keystore de debug local após gerar a pasta `android/` (`npx expo prebuild --platform android` ou `npx expo run:android`):

   ```powershell
   cd android
   .\gradlew signingReport
   cd ..
   ```

   *(Ou via `keytool` diretamente no `debug.keystore` padrão em `android/app/debug.keystore` com senha `android`.)*

### 4.2. Token e Event Types do Calendly

1. No painel do **Calendly**, gere um **Personal Access Token** com permissões para consultar usuário, tipos de evento, disponibilidade, eventos agendados e criação/cancelamento de convites (`scheduled_events:write`).
2. Confirme que existe pelo menos um **Event Type ativo** com horários de disponibilidade configurados.
3. Obtenha a URI completa do Event Type (ex.: `https://api.calendly.com/event_types/<UUID>`) para preencher `ALLOWED_EVENT_TYPE_URIS` no backend.

---

## 5. Configurar e executar o Backend BFF (`server/`)

1. Instale as dependências do servidor e crie o arquivo de ambiente:

   ```bash
   cd server
   npm ci
   cp .env.example .env
   ```

2. Preencha `server/.env`:

   | Variável | Finalidade |
   | --- | --- |
   | `PORT` | Porta HTTP do BFF (padrão `3333`). |
   | `CALENDLY_API_BASE_URL` | Base da API (`https://api.calendly.com`). |
   | `CALENDLY_API_TOKEN` | **Token privado** do Calendly (exclusivo do servidor). |
   | `CALENDLY_TIMEOUT_MS` | Timeout das requisições ao Calendly (ex.: `10000`). |
   | `ALLOWED_EVENT_TYPE_URIS` | URIs dos Event Types permitidos, separadas por vírgula; obrigatório em `NODE_ENV=production`. |
   | `GOOGLE_CLIENT_IDS` | Web Client ID(s) do Google aceitos na verificação do ID Token. |
   | `CORS_ALLOWED_ORIGINS` | Origens permitidas para clientes web (ex.: `http://localhost:8081`). |

   > **Segurança:** nunca compartilhe tokens reais nem adicione `CALENDLY_API_TOKEN` no código ou `.env` do aplicativo mobile.

3. Compile e inicie o servidor:

   ```bash
   npm run build
   npm start
   ```

4. Confirme que o healthcheck responde (`http://localhost:3333/health`):

   ```json
   {"ok":true,"service":"oriently-bff"}
   ```

---

## 6. Configurar e executar o App Mobile (Modo Real)

1. Na raiz do projeto, crie o `.env`:

   ```bash
   cp .env.example .env
   ```

2. Preencha as variáveis:

   | Variável | Finalidade |
   | --- | --- |
   | `EXPO_PUBLIC_BACKEND_URL` | Endereço do BFF acessível pelo aparelho (`http://SEU_IP_LOCAL:3333` via Wi-Fi ou `http://localhost:3333` usando `adb reverse tcp:3333 tcp:3333`). |
   | `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Mesmo **Web Client ID** configurado no Google Cloud e em `GOOGLE_CLIENT_IDS`. |

3. Inicie o aplicativo no Development Build:

   ```bash
   npx expo start --dev-client
   ```

   *(Ou execute `npx expo run:android` caso ainda não tenha compilado o build nativo no aparelho.)*

---

## 7. Testes automatizados e limites de verificação

### Comandos

**Mobile (na raiz):**

```bash
npm run typecheck
npm test
```

**Backend (em `server/`):**

```bash
cd server
npm run typecheck
npm test
```

### Etapas não verificadas automaticamente

Os testes automatizados cobrem a lógica de cliente (`apiClient`, `bookingService`, `demoData`, `meetingLinks`) e rotas/middlewares do BFF com **mocks**. As etapas abaixo dependem de ambiente externo e exigem validação manual no aparelho:

- Fluxo interativo completo do **Google Sign-In** com OAuth real e SHA-1 registrado no Google Cloud Console.
- Consultas, reservas e cancelamentos reais contra a API externa do **Calendly** com token de produção.
- Compatibilidade do **Expo Go** (não suportado devido ao módulo nativo `@react-native-google-signin/google-signin`).

---

## 8. Captura de telas para documentação

Com um aparelho Android conectado via ADB, execute na raiz:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\capture-screenshots.ps1
```

Ou capture uma tela específica (`login`, `home`, `agendar`, `agenda` ou `detalhes`):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\capture-screenshots.ps1 -Screen home
```
