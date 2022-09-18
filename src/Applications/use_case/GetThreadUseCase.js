class GetThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(params) {
    const threadId = params;
    await this._threadRepository.verifyThreadAvailability(threadId);
    const threadresult = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.findCommentByThread(threadId);
    const thread = {
      ...threadresult,
      comments,
    };
    const data = { thread };
    return data;
  }
}

module.exports = GetThreadUseCase;
