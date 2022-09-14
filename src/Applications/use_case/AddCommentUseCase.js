const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
    constructor({commentRepository, threadRepository}) {
      this._commentRepository = commentRepository;
      this._threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      const { content, threadId, userId } = useCasePayload;
      const newComment = new NewComment({content});
      useCasePayload.content = newComment.content;
      await this._threadRepository.findThreadById(threadId);
      const result = await this._commentRepository.addComment(useCasePayload);
      return result;
    }
  
  }
  
  module.exports = AddCommentUseCase;
  