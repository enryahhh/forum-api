const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        const auth = { id:'user-123' };
        const useCasePayload = {
            title: 'title',
            body: 'ini body',
          };


          const expectedThread = new NewThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
          },{
            id:auth.id
          });

          /** creating dependency of use case */
            const mockThreadRepository = new ThreadRepository();
            mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedThread));

            /** creating use case instance */
            const getAddThreadUseCase = new AddThreadUseCase({
                threadRepository: mockThreadRepository,
            });
            console.log({useCasePayload,auth});
            const actualAddThread = await getAddThreadUseCase.execute({useCasePayload,auth});

            expect(actualAddThread).toEqual(expectedThread);
            expect(mockThreadRepository.addThread)
            .toBeCalledWith(new NewThread({
                title: useCasePayload.title,
                body: useCasePayload.body,
              },{
                id:auth.id
              }));

    });
});