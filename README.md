# meeting-scheduler

## Projeto da matéria de Programação Orientada a Objetos 

Projeto prático em grupo para aplicar conceitos de POO no desenvolvimento de uma API REST real.

## O que é isso?

Um clone brasileiro do When2Meet para coordenar horários de reunião sem a dificuldade de ficar perguntando "tu pode em tal horário?".

Basicamente cria um evento, todo mundo marca quando tá livre, e a aplicação mostra quando mais gente está disponível.

## Features (planejadas)

- [ ] Criar evento com range de datas
- [ ] Participantes marcam disponibilidade
- [ ] Heatmap mostrando quando mais gente tá livre
- [ ] Senha simples pra editar sua disponibilidade
- [ ] Frontend (se der tempo)
- [ ] URL compartilhável tipo `app.com/evento/abc123`

## Rodando local
```bash
# Clone o repo
git clone https://github.com/RodrigoLMarques/meeting-scheduler.git
cd meeting-scheduler

# Configure as variáveis de ambiente
cp .env.example .env

# Inicia os containers
docker compose up -d

# Roda as migrations
docker compose exec backend npm run migrate:dev

# Acesse: http://localhost:3000
```

## Status

🚧 Em construção

