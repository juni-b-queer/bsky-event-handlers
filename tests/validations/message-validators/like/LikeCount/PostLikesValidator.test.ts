import {
    HandlerAgent,
    JetstreamEventCommit,
    PostLikesValidator,
} from '../../../../../src';

describe('PostLikesValidator', () => {
    let mockHandlerAgent: HandlerAgent;
    const postUri = 'example:uri';

    beforeEach(() => {
        mockHandlerAgent = {
            getPostLikeCount: jest.fn().mockResolvedValue(5),
        } as unknown as HandlerAgent;
    });

    it('should return true for equal comparison when likes match', async () => {
        const validator = PostLikesValidator.make(postUri, 'equal', 5);
        expect(
            await validator.handle(mockHandlerAgent, {} as JetstreamEventCommit)
        ).toBe(true);
    });

    it('should return false for equal comparison when likes do not match', async () => {
        const validator = PostLikesValidator.make(postUri, 'equal', 10);
        expect(
            await validator.handle(mockHandlerAgent, {} as JetstreamEventCommit)
        ).toBe(false);
    });

    it('should return true for greaterThan comparison when likes are greater', async () => {
        const validator = PostLikesValidator.make(postUri, 'greaterThan', 3);
        expect(
            await validator.handle(mockHandlerAgent, {} as JetstreamEventCommit)
        ).toBe(true);
    });

    it('should return false for greaterThan comparison when likes are not greater', async () => {
        const validator = PostLikesValidator.make(postUri, 'greaterThan', 5);
        expect(
            await validator.handle(mockHandlerAgent, {} as JetstreamEventCommit)
        ).toBe(false);
    });

    it('should return true for lessThan comparison when likes are less', async () => {
        const validator = PostLikesValidator.make(postUri, 'lessThan', 10);
        expect(
            await validator.handle(mockHandlerAgent, {} as JetstreamEventCommit)
        ).toBe(true);
    });

    it('should return false for lessThan comparison when likes are not less', async () => {
        const validator = PostLikesValidator.make(postUri, 'lessThan', 5);
        expect(
            await validator.handle(mockHandlerAgent, {} as JetstreamEventCommit)
        ).toBe(false);
    });

    it('should return true for between comparison when likes are within range', async () => {
        const validator = PostLikesValidator.make(
            postUri,
            'between',
            undefined,
            3,
            7
        );
        expect(
            await validator.handle(mockHandlerAgent, {} as JetstreamEventCommit)
        ).toBe(true);
    });

    it('should return false for between comparison when likes are not within range', async () => {
        const validator = PostLikesValidator.make(
            postUri,
            'between',
            undefined,
            6,
            10
        );
        expect(
            await validator.handle(mockHandlerAgent, {} as JetstreamEventCommit)
        ).toBe(false);
    });

    it('should throw an error if likeCount is missing for non-between comparison', () => {
        expect(() => {
            PostLikesValidator.make(postUri, 'equal');
        }).toThrow('likeCount is required for non-between comparisons');
    });

    it('should throw an error if likeCountMin or likeCountMax is missing for between comparison', () => {
        expect(() => {
            PostLikesValidator.make(postUri, 'between', undefined, 5);
        }).toThrow(
            'likeCountMin and likeCountMax are required for between comparisons'
        );
    });
});
