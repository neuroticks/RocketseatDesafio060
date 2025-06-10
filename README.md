# 🚀 Task Manager API  

### **Descrição**  
API para um sistema de gerenciamento de tarefas, onde usuários podem:  
✔ Criar contas e autenticar-se.  
✔ Gerenciar tarefas (criar, editar, excluir).  
✔ Atribuir tarefas a membros do time.  
✔ Categorizar por **status** (ex: "Em andamento", "Concluído") e **prioridade** (Alta/Média/Baixa).  
✔ Acompanhar progresso e prazos.  

---

### **🛠 Tecnologias e Recursos**  

| Categoria          | Tecnologias/Ferramentas                                                      |
|--------------------|------------------------------------------------------------------------------|
| **Backend**        | Node.js, Express.js, TypeScript                                              |
| **Banco de Dados** | PostgreSQL                                                                   |
| **Autenticação**   | JWT (JSON Web Tokens), Bcrypt para hash de senhas                            |
| **Testes**         | Jest, Supertest                                                              |
| **Deploy**         | Render, Heroku ou AWS                                                        |
| **Documentação**   | Swagger/OpenAPI                                                              |
| **Controle**       | Git, GitHub Actions (CI/CD)                                                  |

---

### **🔧 Funcionalidades Principais**  
#### **Usuários**  
- Cadastro e login (com validação de e-mail).  
- Perfil com roles (admin, usuário comum).  

#### **Tarefas**  
- CRUD completo de tarefas.  
- Filtros por status, prioridade, prazo e responsável.  
- Notificações por e-mail (ex: tarefa atribuída).  

#### **Time**  
- Convite de membros via e-mail.  
- Dashboard de progresso coletivo.  

---

### **📌 Pré-requisitos**  
- Node.js v18+  
- PostgreSQL  

---

### **🚀 Como Executar**  
```bash
# Clone o repositório
git clone https://github.com/neuroticks/RocketseatDesafio060.git

# Instale as dependências
npm install

# Configure o arquivo .env (copie .env.example)
cp .env.example .env

# Inicie o servidor
npm run dev
