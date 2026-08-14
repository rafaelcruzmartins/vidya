import { Sequelize } from "sequelize";
import { DB_PATH } from "./path.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_PATH,

  // SQLite aceita um único escritor por vez. Com o pool padrão o Sequelize
  // abre várias conexões para o mesmo arquivo e elas disputam a escrita entre
  // si — é o que produz SQLITE_BUSY quando a varredura grava aulas enquanto o
  // player registra progresso. Uma conexão só serializa essas gravações.
  //
  // O idle alto mantém essa conexão viva: busy_timeout e synchronous valem por
  // conexão e se perderiam se o pool a reciclasse.
  pool: {
    max: 1,
    min: 1,
    idle: 3600000,
    acquire: 60000,
  },

  retry: {
    match: [/SQLITE_BUSY/],
    max: 5,
    backoffBase: 200,
  },
  logging: false,
});

// Precisa rodar antes de qualquer escrita. O hook afterConnect do Sequelize
// não é chamado no dialeto SQLite, então os PRAGMAs vão por consulta direta.
export const applySqlitePragmas = async () => {
  // Gravado no próprio arquivo do banco, vale para todas as conexões futuras:
  // permite ler enquanto uma escrita acontece, em vez de travar o arquivo.
  await sequelize.query("PRAGMA journal_mode = WAL;");
  // Faz a conexão esperar a trava sair. Sem isso o SQLite desiste na hora.
  await sequelize.query("PRAGMA busy_timeout = 10000;");
  await sequelize.query("PRAGMA synchronous = NORMAL;");
};

// sequelize.sync() cria tabelas novas, mas não adiciona colunas às que já
// existem. Bancos criados antes da identidade por inode precisam ganhar a
// coluna sem perder nada do que está gravado.
export const ensureSchemaColumns = async () => {
  const novasColunas = {
    Courses: { sourceId: "VARCHAR(255)" },
    Sections: {
      sourceId: "VARCHAR(255)",
      groupName: "VARCHAR(255)",
      groupOrder: "FLOAT",
    },
    Lectures: { sourceId: "VARCHAR(255)" },
  };

  for (const [tabela, colunas] of Object.entries(novasColunas)) {
    const [info] = await sequelize.query(`PRAGMA table_info(\`${tabela}\`);`);
    if (!info.length) continue;

    const existentes = new Set(info.map((c) => c.name));
    for (const [coluna, tipo] of Object.entries(colunas)) {
      if (existentes.has(coluna)) continue;
      await sequelize.query(
        `ALTER TABLE \`${tabela}\` ADD COLUMN \`${coluna}\` ${tipo};`,
      );
      console.log(`Migration: added ${tabela}.${coluna}`);
    }
  }
};

export default sequelize;
