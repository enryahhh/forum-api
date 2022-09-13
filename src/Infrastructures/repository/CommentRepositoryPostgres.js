const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require("../../Domains/comments/CommentRepository");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
      }

      async addComment(thread){
        const id = `comment-${this._idGenerator()}`;
        const { title, body, userId } = comment;
        const createdAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5) RETURNING id,title,user_id AS owner',
            values: [id, title, body, userId, createdAt ],
          };
          const result = await this._pool.query(query);

          return result.rows[0];
      }

}

module.exports = CommentRepositoryPostgres;

