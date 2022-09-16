const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'ini komentar',
    };

    const expectedComment = new NewComment({
      content: useCasePayload.content,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve('thread-123'));

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve({ content: 'ini komentar' }));

    /** creating use case instance */
    const getAddCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    const actualAddComment = await getAddCommentUseCase.execute(useCasePayload);

    expect(actualAddComment).toEqual(expectedComment);
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(new NewComment({
        content: useCasePayload.content,
      }));
  });
});
