## Rodando o projeto

### Para rodar o banco local

Instale o Docker [aqui](https://www.docker.com) caso ainda não tenha.

```bash
docker --version
```

Com o docker funcionando e rodando, crie um arquivo .env e declare as seguintes variáveis.

```env
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
```

Após a declaração basta rodar `docker compose up -d`.  
Assim ele irá baixar a imagem do mongo, criar e rodar um container com o mongo.
Agora você pode acessar o mongo em:

```
"mongodb://{{MONGO_INITDB_ROOT_USERNAME}}:{{MONGO_INITDB_ROOT_PASSWORD}}@localhost:27017/?authSource=admin"
```

E com essa url de acesso defina a env `MONGO_URL`.

### Para rodar o backend

Com as envs definidas, basta executar:

```bashrc
npm i && npm run dev
```
