const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should return comment data correctly after add', async () => {
      // Arrange
      //tambah user
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      const fakeIdGenerator = () => '123'; // stub!

      // tambah thread
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const userId = await userRepositoryPostgres.getIdByUsername('dicoding');
      const newThread = new NewThread({title:'ini title', body:'ini body'},{id:userId});
      const thread = await threadRepository.addThread(newThread);
      const threadId = thread.id;
      // arrange komentar
      const newComment = new NewComment({content:'ini komentar'});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool,fakeIdGenerator);
      
      // Action
      const comment = await commentRepositoryPostgres.addComment({...newComment,threadId,userId})
      
      // Assert
      await expect(comment).toStrictEqual({
        id: 'comment-123',
        content: 'ini komentar',
        owner: userId,
      });
    }); 
  });

  describe('findCommentByThread function', () => {
    it('should return comment data by thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id:'thread-123' });
      await CommentsTableTestHelper.addComment({ id:'comment-123' });
      await CommentsTableTestHelper.addComment({ id:'comment-124'});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool,{});
      
      // Action
      const comments = await commentRepositoryPostgres.findCommentByThread('thread-123');
      // Assert
      expect(comments).toHaveLength(2);
    }); 
  });

  describe('delete comment function', () => {
    it('should return not found when comment invalid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({id:'user-123'});
      await ThreadsTableTestHelper.addThread({id:'thread-123'});
      await CommentsTableTestHelper.addComment({id:'comment-123'});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool,{});
      const params = {id : 'comment-1234', threadId : 'thread-123'};

      // Action & Assert
      return expect(commentRepositoryPostgres.deleteComment(params))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return unauthorized when user is not owner comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({id:'user-123'});
      await ThreadsTableTestHelper.addThread({id:'thread-123'});
      await CommentsTableTestHelper.addComment({id:'comment-123'});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool,{});
      const params = {id : 'comment-123', owner : 'user-1234'};

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyOwner(params))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should doing soft delete correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({id:'user-123'});
      await ThreadsTableTestHelper.addThread({id:'thread-123'});
      await CommentsTableTestHelper.addComment({id:'comment-123'});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool,{});
      const params = {id : 'comment-123', threadId : 'thread-123'};

      // Action
      const commentId = await commentRepositoryPostgres.deleteComment(params);

      //Assert
      expect(commentId).toEqual('comment-123');
    });
  });
});
