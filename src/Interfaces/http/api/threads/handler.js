const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
    constructor(container) {
      this._container = container;
  
      this.postThreadHandler = this.postThreadHandler.bind(this);
      this.postCommentThreadHandler = this.postCommentThreadHandler.bind(this);
      this.deleteCommentThreadHandler = this.deleteCommentThreadHandler.bind(this);
      this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
      this.deleteCommentThreadHandler = this.deleteCommentThreadHandler.bind(this);
    }
  
    async postThreadHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const auth = request.auth.credentials;
        const useCasePayload = request.payload;
        const addedThread = await addThreadUseCase.execute({useCasePayload,auth});
        const response = h.response({
          status: 'success',
          data: {
            addedThread
          },
        });
        response.code(201);
        return response;

    }

    async postCommentThreadHandler(request, h) {
      const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
      const { id } = request.auth.credentials;
      const { threadId } = request.params;
      const useCasePayload = request.payload;
      useCasePayload.threadId = threadId;
      useCasePayload.userId = id;
      const addedComment = await addCommentUseCase.execute(useCasePayload);
      const response = h.response({
        status: 'success',
        data: {
          addedComment
        },
      });
      response.code(201);
      return response;

  }

  async getDetailThreadHandler(request, h) {
    const getThreadDetailUseCase = this._container.getInstance(GetThreadUseCase.name);
    const { threadId } = request.params;
    const thread = await getThreadDetailUseCase.execute(threadId);
    const response = h.response({
      status: 'success',
      data: thread
    });
    response.code(200);
    return response;
  }

  async deleteCommentThreadHandler(request, h){
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
      const { id } = request.auth.credentials;
      const { threadId, commentId } = request.params;
      const params = { };
      params.commentId = commentId;
      params.threadId = threadId;
      params.userId = id;
      await deleteCommentUseCase.execute(params);
      const response = h.response({
        status: 'success',
        message: 'berhasil menghapus komentar'
      });
      response.code(200);
      return response;
  }
}
  
  module.exports = ThreadsHandler;