# Arquitetura e decisões técnicas

[← Voltar ao README](../README.md)

## Visão geral

O Oriently adota a divisão entre um **aplicativo mobile React Native/Expo** e um **backend BFF (Backend for Frontend)** em Node.js/Express. O BFF recebe requisições autenticadas, verifica permissões e utiliza o token privado do Calendly para conversar com a API externa.

```text
React Native / Expo
   │
   ├─ Google Sign-In → Google ID Token
   │
   └─ Axios → BFF /api/calendly/*
                │
                ├─ Validação do ID Token (Google)
                ├─ Rate limiting e validação de entrada
                ├─ Restrição de tipos de eventos
                ├─ Autorização baseada no e-mail do convidado
                ├─ Idempotência no agendamento
                │
                └─ Calendly API (token exclusivo do servidor)
```

## Organização do código

| Diretório/arquivo | Responsabilidade |
| --- | --- |
| `src/screens/` | Telas de login, início, agendamento, agenda (`Profile`) e detalhes (`MeetingDetails`). |
| `src/routes/app.routes.tsx` | Navegação em abas flutuantes (`FloatingTabBar`) e pilha para tela de detalhes. |
| `src/components/` | Componentes compartilhados (`OrientlyTopBar`, `AppDialog`, `Loading`, `AcademicFlow`). |
| `src/contexts/AuthContext.tsx` | Sessão, usuário, modo demo e renovação do Google ID Token. |
| `src/services/apiClient.ts` | Cliente Axios do BFF e tratamento da autenticação. |
| `src/services/calendlyService.ts` | Operações utilizadas pelas telas, cache de participantes e roteamento para modo demo. |
| `src/services/bookingService.ts` | Lógica cliente de agendamento e cancelamento. |
| `src/services/demoData.ts` | Dados fictícios em memória para navegação completa no modo demonstração. |
| `src/utils/meetingLinks.ts` | Validação e apresentação de links de reunião e ações Calendly. |
| `server/src/app.ts` | Configuração do Express, CORS, healthcheck e middlewares. |
| `server/src/middleware/` | Validação do Google ID Token e limitação de requisições. |
| `server/src/routes/calendlyRoutes.ts` | Rotas autenticadas e regras de autorização/agendamento. |
| `server/src/services/calendlyClient.ts` | Comunicação com a API do Calendly. |
| `server/src/services/idempotencyStore.ts` | Controle de tentativas de agendamento e persistência local. |
| `scripts/capture-screenshots.ps1` | Script PowerShell via ADB para captura das telas em `docs/images/`. |

## Fluxos principais

### 1. Autenticação

1. O usuário escolhe o login Google no aplicativo.
2. O Google Sign-In fornece um **ID Token**.
3. O aplicativo envia esse token em `Authorization: Bearer ...` nas chamadas ao BFF.
4. O backend verifica o ID Token com a biblioteca do Google e aceita apenas os Client IDs configurados em `GOOGLE_CLIENT_IDS`.
5. O acesso às rotas `/api/calendly/*` depende dessa verificação.

O ID Token do Google **não é** o token da API do Calendly. O primeiro identifica a pessoa que usa o aplicativo; o segundo autoriza o servidor a acessar os recursos Calendly configurados.

### 2. Consulta de horários e agendamento

1. O app consulta os tipos de evento disponíveis no BFF.
2. O backend restringe os tipos de evento à allowlist configurada, quando presente. Em produção, essa lista é obrigatória na configuração atual.
3. O app solicita horários disponíveis para o tipo de evento e período selecionados.
4. Na confirmação, o app envia um `POST /api/calendly/bookings` com o horário UTC, tipo de evento e dados de controle de idempotência.
5. O BFF utiliza a identidade autenticada como dados do convidado e chama a API do Calendly para criar a reserva.
6. O backend retorna um resumo do agendamento; o aplicativo atualiza a experiência de agenda.

O agendamento é **nativo no aplicativo**: não depende de abrir uma página pública de agendamento para concluir a operação normal.

### 3. Consultar agendamentos

A rota `GET /api/calendly/events` busca os eventos do calendário vinculado ao token do servidor, consulta convidados e apresenta somente os eventos associados ao e-mail do usuário autenticado.

A resposta separa:

- `activeEvents`: eventos futuros ativos;
- `pastEvents`: eventos ativos cuja data já passou;
- `missedEvents`: eventos cancelados (nome de campo herdado do serviço, **não significa automaticamente ausência do participante**).

A API pode informar `partialErrors` ou `truncated` quando a consulta não consegue abranger todos os itens. A interface respeita esses sinais, evitando tratar listas incompletas como completas.

### 4. Cancelamento

O cancelamento passa pelo BFF, que verifica se o e-mail autenticado pertence aos convidados do evento. Em situações com múltiplos participantes, o fluxo não cancela indiscriminadamente a reunião de todos: o app trata a necessidade de cancelamento individual, validando a URL de ação retornada pelo Calendly quando disponível.

A autorização é responsabilidade do **backend**, não apenas da interface.

### 5. Acesso à videochamada

`src/utils/meetingLinks.ts` trata `location.join_url` como endereço de acesso apenas quando é uma URL HTTPS válida e **não** pertence ao domínio `calendly.com`. A URI do evento no Calendly nunca é assumida como link para Google Meet, Teams ou Zoom.

O app só apresenta a ação de entrar na sala quando um endereço apropriado está disponível.

### 6. Modo demonstração isolado

Quando o usuário escolhe **"Explorar modo demo"** na tela de Login, `AuthContext` ativa `setDemoModeActive(true)` em `src/services/demoData.ts`. Todas as consultas, reservas e cancelamentos passam a operar sobre um estado local em memória (com orientador fictício, tipos de evento, horários futuros, reuniões futuras/passadas/canceladas), sem enviar requisições ao backend BFF e sem alterar dados reais do Calendly.

## Decisões de segurança

- **Segredo no servidor:** `CALENDLY_API_TOKEN` deve estar exclusivamente no ambiente do BFF. Variáveis `EXPO_PUBLIC_*` são expostas ao código do aplicativo e não devem conter segredos.
- **Autenticação real:** dados em armazenamento local não são prova de login Google; o backend exige um ID Token válido.
- **Validação de entradas:** parâmetros das rotas são avaliados antes das chamadas ao Calendly.
- **Allowlist de eventos:** impede o aplicativo de operar livremente sobre tipos de evento não autorizados.
- **Rate limiting:** limita volume de requisições, sem substituir controles de infraestrutura em escala.
- **Idempotência:** reduz risco de reservas duplicadas em repetição da mesma tentativa; respostas incertas exigem verificação da agenda antes de uma nova tentativa.
- **CORS:** restringe origens web configuradas. Aplicativos nativos não dependem de CORS como mecanismo de autenticação.

## Limitações técnicas atuais

### Persistência da idempotência

O armazenamento padrão usa `server/.data/idempotency.json`, um arquivo local ignorado pelo Git. É adequado como estratégia simples em **instância única**, mas não fornece coordenação distribuída entre réplicas ou garantia de persistência em ambientes com disco efêmero.

### Escopo dos eventos

Os eventos consultados estão vinculados à conta Calendly configurada no backend. O sistema não é uma plataforma multi-institucional genérica com cadastro próprio de orientadores e calendários.

### Status de eventos passados

Um evento com data passada não prova que a reunião efetivamente ocorreu. Para indicar presença ou realização, seria necessário um dado específico que confirme esse estado.

## Evoluções possíveis

- Pipeline de CI com typecheck e testes automáticos.
- Armazenamento compartilhado de idempotência, caso a implantação passe a usar múltiplas instâncias.
- Métricas, observabilidade e documentação de implantação para um ambiente público de demonstração.
