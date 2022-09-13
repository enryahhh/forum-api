const NewThread = require('../entities/NewThread');

describe('NewThread entities', () => {
    it('should throw error when add thread with no authentication', () => {
    // Arrange
    const auth = {};
    const payload = {
      title: 'title',
      body: 'ini body'
    };

    // Action & Assert
    expect(() => new NewThread(payload,auth)).toThrowError('NEW_THREAD.NOT_DOING_AUTHENTICATION');
  });
  it('should throw error when payload not contain needed property', () => {
    const auth = {id:'user-123'};
    // Arrange
    const payload = {
      title: 'title'
    };

    // Action & Assert
    expect(() => new NewThread(payload,auth)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const auth = {id:'user-123'};
    const payload = {
        title: 'title',
        body: 123,
      };

    // Action & Assert
    expect(() => new NewThread(payload,auth)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const auth = {id:'user-123'};
    const payload = {
        title: 'title',
        body: 'ini body',
      };

    // Action
    const newThread = new NewThread(payload,auth);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.userId).toEqual(auth.id);
  });
});
