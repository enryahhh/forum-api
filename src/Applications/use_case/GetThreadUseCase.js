class GetThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(params) {
    const threadId = params;
    const threadresult = await this._threadRepository.findThreadById(threadId);
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
