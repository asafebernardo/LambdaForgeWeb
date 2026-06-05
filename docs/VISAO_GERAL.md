# Lambda Forge — Visão Geral do Projeto

## Objetivo

Criar uma plataforma moderna de gerenciamento, distribuição e instalação de mods para jogos, começando por comunidades menores e expandindo gradualmente até se tornar uma alternativa relevante às grandes plataformas de modding.

O projeto deve focar em experiência do usuário, facilidade de instalação e ferramentas para criadores de conteúdo.

---

## Arquitetura do Projeto

O projeto será dividido em três partes principais.

### 1. Plataforma Web

Responsável por:

- Cadastro de usuários
- Login
- Perfis de autores
- Upload de mods
- Gerenciamento de versões
- Comentários
- Avaliações
- Pesquisa
- Categorias
- Tags
- Estatísticas
- Descoberta de conteúdo

A plataforma web é a **prioridade inicial**.

Ela deve funcionar mesmo sem a existência do launcher.

### 2. API Central

Responsável por:

- Autenticação
- Mods
- Usuários
- Comentários
- Avaliações
- Downloads
- Estatísticas
- Atualizações

Toda informação utilizada pelo site e pelo launcher deve vir da API.

**Nenhum componente deve acessar diretamente o banco de dados.**

### 3. Launcher Desktop

O launcher será desenvolvido após a validação da plataforma web.

Seu objetivo é simplificar a instalação e atualização de mods.

Funções principais:

- Login
- Biblioteca de jogos
- Biblioteca de mods
- Instalação automática
- Atualização automática
- Gerenciamento de dependências
- Backup de arquivos
- Desinstalação segura
- Perfis de configuração

---

## Estratégia de Mercado

Não tentar competir imediatamente com grandes plataformas.

Começar focando em:

- Jogos Source Engine
- Jogos independentes
- Comunidades pequenas
- Jogos sem suporte oficial de modding centralizado

**Objetivo inicial:** ser a melhor plataforma para uma comunidade específica antes de expandir.

---

## Público Inicial

Comunidades de:

- Half-Life
- Portal
- Garry's Mod
- Sven Co-op
- Outros jogos baseados em Source Engine

**Expansão futura para:**

- Jogos independentes
- Jogos clássicos
- Fan games
- Comunidades brasileiras de modding

---

## Funcionalidades da Plataforma Web

### Sistema de Mods

Cada mod deve possuir:

- Nome
- Descrição
- Autor
- Versão
- Categoria
- Tags
- Dependências
- Screenshots
- Vídeos
- Arquivos para download
- Histórico de versões
- Data de atualização

### Página do Mod

Exibir:

- Banner
- Informações do autor
- Estatísticas
- Downloads
- Avaliações
- Comentários
- Dependências
- Changelog
- Arquivos disponíveis

### Perfil do Autor

Exibir:

- Avatar
- Banner
- Biografia
- Redes sociais
- Projetos publicados
- Estatísticas
- Seguidores

### Pesquisa

Permitir busca por:

- Nome
- Autor
- Categoria
- Tags
- Jogo
- Popularidade
- Data de atualização

---

## Diferencial Principal

### Instalação com Um Clique

O foco principal do projeto é eliminar processos manuais.

**Fluxo ideal:**

1. Usuário encontra um mod
2. Clica em **Instalar**
3. Launcher detecta o jogo
4. Dependências são verificadas
5. Arquivos são baixados
6. Backup é criado
7. Instalação é realizada automaticamente

**Sem necessidade de:**

- Extrair ZIP
- Copiar arquivos
- Procurar pastas
- Configurar manualmente

---

## Experiência do Usuário

A plataforma deve ser pensada para usuários iniciantes.

**Princípios:**

- Poucos cliques
- Interface limpa
- Linguagem simples
- Feedback visual claro
- Ações reversíveis
- Instalação guiada

Sempre priorizar facilidade de uso acima de recursos complexos.

---

## Design

Inspirar-se em:

- Steam
- Discord
- GitHub

**Características:**

- Tema dark
- Responsividade
- Alto desempenho
- Visual moderno
- Navegação intuitiva

---

## Roadmap

### Fase 1

**Implementar:**

- Cadastro
- Login
- Upload de mods
- Página de mod
- Perfil de autor
- Comentários
- Downloads
- Pesquisa
- Categorias
- Tags

**Objetivo:** validar a plataforma e atrair autores.

### Fase 2

**Implementar:**

- API pública
- Sistema de seguidores
- Notificações
- Estatísticas avançadas

**Objetivo:** ampliar engajamento da comunidade e preparar integração com o launcher.

### Fase 3

**Implementar:**

- Launcher desktop
- Instalação com um clique
- Atualização automática de mods
- Gerenciamento de dependências
- Backup e desinstalação segura
- Perfis de configuração

**Objetivo:** entregar o diferencial principal do projeto — instalação simplificada de mods.
