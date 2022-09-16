const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'ini title',
      body: 'ini body',
    };

    const expectedThread = new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new NewThread({
        title: 'ini title',
        body: 'ini body',
      })));

    /** creating use case instance */
    const getAddThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    const actualAddThread = await getAddThreadUseCase.execute({ useCasePayload });

    expect(actualAddThread).toEqual(expectedThread);
    expect(mockThreadRepository.addThread)
      .toBeCalledWith(new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }));
  });
});
