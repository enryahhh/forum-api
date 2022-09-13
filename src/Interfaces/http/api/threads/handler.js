const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
    constructor(container) {
      this._container = container;
  
      this.postThreadHandler = this.postThreadHandler.bind(this);
    }
  
    async postThreadHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const auth = request.auth.credentials;
        const useCasePayload = request.payload;
        const addedThread = await addThreadUseCase.execute({useCasePayload,auth});
        console.log('ini addedThread');
        console.log(addedThread);
        const response = h.response({
          status: 'success',
          data: {
            addedThread
          },
        });
        response.code(201);
        return response;

    }
  }
  
  module.exports = ThreadsHandler;