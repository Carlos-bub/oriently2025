# 📅 Oriently - Aplicativo para Agendamento de TCC

## 📌 Descrição
**Oriently** é um aplicativo móvel desenvolvido em **React Native** como projeto para a disciplina de **Desenvolvimento de Ambientes Móveis**. Ele se integra com a **API do Calendly** para permitir que alunos agendem horários de orientação de **TCC (Trabalho de Conclusão de Curso)** de forma simples, rápida e eficiente.

---

## 🚀 Funcionalidades Principais

- 🔐 **Autenticação de Usuários**: Login via Google para acesso seguro  
- 📆 **Agendamento de Orientações**: Interface amigável para marcação de horários com orientadores  
- 📋 **Visualização de Compromissos**: Listagem organizada por agendamentos ativos, realizados e cancelados  
- ❌ **Cancelamento de Orientações**: Cancelamento fácil de compromissos agendados  
- 🔗 **Integração com Calendly**: Gerenciamento de agendas com a API oficial  

---

## 🛠️ Tecnologias Utilizadas

- **React Native** – Desenvolvimento mobile cross-platform  
- **TypeScript** – Tipagem estática para maior robustez  
- **Expo** – Plataforma para desenvolvimento ágil com React Native  
- **Axios** – Cliente HTTP para chamadas à API do Calendly  
- **Styled Components** – Estilização com CSS-in-JS  
- **React Navigation** – Navegação entre telas  
- **Google Sign-In** – Autenticação com conta Google  
- **Context API** – Gerenciamento global de estados  

---

## 📁 Estrutura do Projeto
```bash
src/ 
├── components/ # Componentes reutilizáveis 
├── contexts/ # Contextos globais (ex: autenticação) 
├── global/ # Estilos e temas globais 
├── routes/ # Rotas e navegação 
├── screens/ # Telas do aplicativo 
│ ├── Home/ # Tela inicial 
│ ├── Login/ # Tela de autenticação 
│ ├── Profile/ # Perfil e agendamentos 
│ └── Schedule/ # Agendamento de horários 
├── services/ # Integrações e serviços externos 
│ ├── calendlyService.ts # Integração com Calendly 
│ └── types.ts # Tipagens dos dados da API 
└── utils/ # Funções utilitárias
```


---

## 🔄 Fluxo de Funcionamento

1. **Login**: Autenticação via Google  
2. **Navegação**: Acesso às funcionalidades via barra de navegação  
3. **Agendamento**:
   - Seleção de data no calendário  
   - Escolha de horário disponível  
   - Confirmação via link do Calendly  
4. **Gerenciamento**:
   - Visualização de agendamentos (ativos, passados, cancelados)  
   - Cancelamento de sessões futuras  

---

## 🔗 Integração com Calendly

O aplicativo utiliza a **API oficial do Calendly** para:  

- Obter dados do orientador  
- Buscar tipos de eventos disponíveis (sessões de orientação)  
- Verificar horários livres  
- Gerar links de agendamento  
- Cancelar eventos  
- Obter histórico de sessões agendadas  

---

## ⚙️ Configuração e Execução

### Pré-requisitos

- Node.js (v14 ou superior)  
- NPM ou Yarn  
- Expo CLI  
- Conta no Calendly com acesso à API  

### Passos

# Clonar o repositório
```bash
git clone [https://github.com/Carlos-bub/oriently2025]
```
# Instalar dependências
```bash
npm install
# ou
yarn install
```
# Configurar variáveis de ambiente (.env)
```bash
EXPO_PUBLIC_API_BASE_URL=https://api.calendly.com
EXPO_PUBLIC_API_TOKEN=seu_token_calendly
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=seu_client_id_google
```
# Iniciar o app
```bash
npx expo start
```

💡 Considerações de Implementação
Tratamento de erros para falhas de conexão

Cache para otimizar chamadas frequentes

Controle de taxa de requisições para evitar bloqueios

Feedback visual em operações assíncronas

👨‍💻 Desenvolvedor
Carlo Henrique Lima do Nascimento
Projeto desenvolvido como parte da disciplina de Desenvolvimento de Ambientes Móveis – 2025

