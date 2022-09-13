const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
    constructor({threadRepository}) {
      this._threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      // const { title, body } = useCasePayload;
      const newThread = new NewThread(useCasePayload.useCasePayload,useCasePayload.auth);
      const result = await this._threadRepository.addThread(newThread);
      return result;
      // return await this._threadRepository.addThread(newThread);
    }
  
  }
  
  module.exports = AddThreadUseCase;
  