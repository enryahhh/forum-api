class NewThread {
    constructor(payload, auth) {
      this._verifyAuth(auth);
      this._verifyPayload(payload);
  
      this.title = payload.title;
      this.body = payload.body;
      this.userId = auth.id;
    }

    _verifyAuth(auth) {
        const { id } = auth;

        if(!id) {
            throw new Error('NEW_THREAD.NOT_DOING_AUTHENTICATION');
        }
    }
  
    _verifyPayload(payload) {
      const { title, body } = payload;
  
      if (!title || !body) {
        throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof title !== 'string' || typeof body !== 'string') {
        throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
  
  module.exports = NewThread;