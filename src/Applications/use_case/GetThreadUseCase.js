class GetThreadUseCase {
    constructor({commentRepository, threadRepository}) {
      this._commentRepository = commentRepository;
      this._threadRepository = threadRepository;
    }
  
    async execute(params) {
        console.log(params);
      const threadId = params;
      const thread = await this._threadRepository.findThreadById(threadId);
      const comments = await this._commentRepository.findCommentByThread(threadId);
      const data = {
        thread,
        comments
      };
      console.log(data);
      return data;
    }
  
  }
  
  module.exports = GetThreadUseCase;
  