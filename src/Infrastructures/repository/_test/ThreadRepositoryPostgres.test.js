const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread to database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!

      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const newThread = new NewThread({title:'ini title', body:'ini body'},{id:userId});

      // Action
      const result = await threadRepository.addThread(newThread);

      // Assert
      const addedThread = result;
      expect(addedThread).toStrictEqual({
        id: 'thread-123',
        title: 'ini title',
        owner: userId
      });
    });
  });

});
