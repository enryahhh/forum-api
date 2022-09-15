const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 401 when no authentication', async () => {
        // Arrange
        const requestPayload = {
          title:'ini title',
          body:'ini body'
        };
        // eslint-disable-next-line no-undef
        const server = await createServer(container);
  
        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: requestPayload,
        });
  
        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(401);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('Missing authentication');
      });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title:'ini title',
        body:'ini body'
      };

      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      // add user
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const tesAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });

      const token = tesAuth.result.data.accessToken;
      // eslint-disable-next-line no-undef

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers:{
          'Authorization' : 'Bearer '+token
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'Ini title'
      };
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const tesAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });

      const token = tesAuth.result.data.accessToken;
      // eslint-disable-next-line no-undef

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers:{
          'Authorization' : 'Bearer '+token
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'Ini title',
        body: true
      };
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const tesAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });

      const token = tesAuth.result.data.accessToken;
      // eslint-disable-next-line no-undef

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers:{
          'Authorization' : 'Bearer '+token
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    let token = '';
    let threadId = '';
    beforeEach(async ()=>{
      // await UsersTableTestHelper.addUser({id:'user-123'});
      const requestPayload = {
        title:'ini title',
        body:'ini body'
      };

      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      // add user
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const tesAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });

      token = tesAuth.result.data.accessToken;
      // eslint-disable-next-line no-undef

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers:{
          'Authorization' : 'Bearer '+token
        }
      });
      const responseJson = JSON.parse(response.payload);
      threadId = responseJson.data.addedThread.id;
    })

    it('should response 401 when no authentication', async () => {
      // Arrange
      const requestPayload = {
        content:'ini komentar',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content:'ini komentar',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: requestPayload,
        headers:{
          'Authorization' : 'Bearer '+token
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 400 when payload invalid', async () => {
      // Arrange
      const requestPayload = {};
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers:{
          'Authorization' : 'Bearer '+token
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat melakukan komentar karena properti yang dibutuhkan tidak ada');
    });

    it('should response 201 when added comment', async () => {
      // Arrange
      const requestPayload = {
        content:'ini komentar',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers:{
          'Authorization' : 'Bearer '+token
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 when get thread',async () => {
      //arrange
      await UsersTableTestHelper.addUser({id:'user-123'});
      await ThreadsTableTestHelper.addThread({id:'thread-123'});
      await CommentsTableTestHelper.addComment({id:'comment-123'});
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      //action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/thread-123`
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });
  });
});
