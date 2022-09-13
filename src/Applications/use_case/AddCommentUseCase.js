const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
    constructor({commentRepository}) {
      this._commentRepository = commentRepository;
    }
  
    async execute(useCasePayload) {
      console.log(useCasePayload);
      const newComment = new NewComment(useCasePayload);
      const result = await this._commentRepository.addComment(newComment);
      return result;
    }
  
  }
  
  module.exports = AddCommentUseCase;
  