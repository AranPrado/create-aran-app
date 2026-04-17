# 🚀 Create Aran App

Uma CLI moderna para criar projetos React rapidamente, já com estrutura profissional, libs essenciais e configuração pronta para desenvolvimento.

---

## ✨ Features

* ⚡ Criação de projetos com Vite + React
* 📦 Instalação automática de bibliotecas essenciais
* 🧠 Setup inteligente baseado em escolhas
* 🗂 Estrutura de pastas organizada
* 🔄 Modo interativo ou automático (`--yes`)
* 📁 Suporte a caminho customizado (`--path`)
* 🎨 CLI com feedback visual (spinners, cores)
* 🔧 Configuração opcional de Git

---

## 🚀 Uso

> ⚠️ Este projeto ainda não está publicado no npm.
> Utilize via `npm link` ou rodando localmente.

---

### 🔹 Rodando em modo desenvolvimento

```bash
npm run dev
```

---

### 🔹 Usando como CLI (local)

```bash
npm link
create-aran my-app
```

---

### 🔹 Modo automático

```bash
create-aran my-app --yes
```

---

### 🔹 Com caminho personalizado

```bash
create-aran my-app --path "C:/Users/seu-usuario/Projetos" --yes
```

---

### 🔹 Alternativa direta

```bash
npx tsx src/index.ts my-app --yes
```

---

## ⚙️ Opções disponíveis

| Flag     | Descrição                                     |
| -------- | --------------------------------------------- |
| `--yes`  | Executa sem perguntas (modo automático)       |
| `--path` | Define o diretório onde o projeto será criado |

---

## 📁 Estrutura gerada

```bash
src/
├── assets/
├── components/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── styles/
├── types/
├── utils/
├── libs/
```

---

## 📦 Bibliotecas suportadas

Você pode escolher instalar automaticamente:

* axios
* react-router-dom
* @tanstack/react-query
* antd
* zod
* dayjs
* zustand
* react-hook-form
* @uidotdev/usehooks

---

## 🧠 Exemplo

```bash
create-aran meu-app --path ./Projetos --yes
```

---

## 🔧 Tecnologias

* Node.js
* TypeScript
* Vite
* React
* Chalk
* Ora
* Prompts

---

## 📌 Roadmap

* [ ] Suporte a presets (basic, full, custom)
* [ ] Flags individuais (`--router`, `--zustand`)
* [ ] Setup automático de ESLint + Prettier
* [ ] Integração com GitHub
* [ ] Templates personalizados

---

## 🤝 Contribuição

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças
4. Push
5. Abra um Pull Request

---

## 📄 Licença

MIT

---

## 👨‍💻 Autor

Feito por Aran Prado 🚀

* GitHub: https://github.com/aran-prado
* Portfólio: https://portifolio-aran.vercel.app/

---

## ⭐ Se curtiu

Deixa uma estrela no projeto!
