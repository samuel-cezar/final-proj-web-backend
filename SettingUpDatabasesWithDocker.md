Match exato com o que está definido em `config/sequelize.js` e `config/mongoose.js`.

# Criar storages

```bash
docker volume create pg_data
docker volume create mongo_data
```

# Executar (PowerShell: use uma linha só ou crases ` para multilinhas)

```powershell
docker run -d --name postgres -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=postgres -v pg_data:/var/lib/postgresql/data postgres:16

docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -v mongo_data:/data/db mongo:7
```

# Verificar se foi mesmo

```bash
docker exec -it postgres psql -U postgres -d postgres -c "\l"
docker exec -it mongodb mongosh -u admin -p password --authenticationDatabase admin --eval "db.runCommand({ ping: 1 })"
```

# Limpar tudo

```bash
docker stop postgres mongodb
docker rm postgres mongodb
```

### Notes
- Your `config/sequelize.js` is already aligned with the Postgres container (host `localhost`, db `postgres`, user `postgres`, pass `1234`, port `5432`).
- For Mongo, your URI is `mongodb://admin:password@localhost:27017`. If auth complains, add `?authSource=admin` to the URI: `mongodb://admin:password@localhost:27017/?authSource=admin`.

TL;DR: Spin up Postgres (user `postgres`, pass `1234`, db `postgres`) and Mongo (admin/password), both on localhost default ports; if Mongo yells about auth, slap `?authSource=admin` on the URI and call it a day.

---

# Usando Docker Compose

```bash
docker compose up -d
docker compose logs -f app
docker compose down
```

O `docker-compose.yml` levanta Postgres, Mongo e o app Node 22-alpine. A app lê as variáveis de ambiente para banco (PG_HOST, PG_PORT, etc.) e `MONGO_URI`. Em dev, os volumes montam o projeto no container e rodam `node index.js`.