const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
      }

      async addThread(thread){
        const id = `thread-${this._idGenerator()}`;
        const { title, body, userId } = thread;
        const createdAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id,title,user_id AS owner',
            values: [id, title, body, userId, createdAt ],
          };
          const result = await this._pool.query(query);

          return result.rows[0];
      }

      async findThreadById(id){
        const query = {
          text: 'SELECT id FROM threads WHERE id = $1',
          values: [id],
        };
    
        const result = await pool.query(query);
        if (!result.rowCount) {
          throw new NotFoundError('thread tidak ditemukan');
        }
        const { id } = result.rows[0];
        return id;
      }
}

module.exports = ThreadRepositoryPostgres;

