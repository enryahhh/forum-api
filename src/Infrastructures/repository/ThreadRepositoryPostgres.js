const InvariantError = require('../../Commons/exceptions/InvariantError');
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
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id,title,user_id',
            values: [id, title, body, userId, createdAt ],
          };
          const result = await this._pool.query(query);
          // console.log(result);

          return result.rows[0];
      }
}

module.exports = ThreadRepositoryPostgres;

