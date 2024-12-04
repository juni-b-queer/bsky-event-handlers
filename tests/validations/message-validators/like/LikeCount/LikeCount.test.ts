import dotenv from 'dotenv';
import fs from 'fs';
import {
    HandlerAgent,
    JetstreamEventCommit,
    PostLikesValidator,
} from '../../../../../src';

dotenv.config();

describe('Post Likes Validator', () => {
    const mockHandlerAgent: HandlerAgent = {
        getDid: 'did:plc:bot',
        getDIDFromUri: jest.fn().mockReturnValue('did:plc:bot'),
    } as unknown as HandlerAgent;

    const createMessage = (): JetstreamEventCommit => {
        return {
            // mock JetstreamEventCommit data
        } as JetstreamEventCommit;
    };

    it('should return true for equal comparison if the likes match', async () => {
        const postUri = 'exampleUri'; // Using length for simulated likes
        const validator = PostLikesValidator.make(
            postUri,
            'equal',
            postUri.length
        );
        const message = createMessage();

        expect(await validator.handle(mockHandlerAgent, message)).toBe(true);
    });

    it('should return false for equal comparison if the likes do not match', async () => {
        const validator = PostLikesValidator.make('exampleUri', 'equal', 999);
        const message = createMessage();

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });

    it('should return true for greaterThan comparison if likes are greater', async () => {
        const postUri = 'exampleUri';
        const validator = PostLikesValidator.make(postUri, 'greaterThan', 3);
        const message = createMessage();

        expect(await validator.handle(mockHandlerAgent, message)).toBe(true);
    });

    it('should return false for greaterThan comparison if likes are not greater', async () => {
        const validator = PostLikesValidator.make(
            'exampleUri',
            'greaterThan',
            999
        );
        const message = createMessage();

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });

    it('should return true for lessThan comparison if likes are less', async () => {
        const validator = PostLikesValidator.make('exampleUri', 'lessThan', 50);
        const message = createMessage();

        expect(await validator.handle(mockHandlerAgent, message)).toBe(true);
    });

    it('should return false for lessThan comparison if likes are not less', async () => {
        const postUri = 'exampleUri';
        const validator = PostLikesValidator.make(postUri, 'lessThan', 3);
        const message = createMessage();

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });

    it('should return true for between comparison if likes are within range', async () => {
        const postUri = 'exampleUri';
        const validator = PostLikesValidator.make(
            postUri,
            'between',
            undefined,
            3,
            50
        );
        const message = createMessage();

        expect(await validator.handle(mockHandlerAgent, message)).toBe(true);
    });

    it('should return false for between comparison if likes are not within the range', async () => {
        const validator = PostLikesValidator.make(
            'exampleUri',
            'between',
            undefined,
            50,
            100
        );
        const message = createMessage();

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });

    it('should throw an error if likeCount is required but not provided for non-between comparison', () => {
        expect(() => PostLikesValidator.make('exampleUri', 'equal')).toThrow(
            'likeCount is required for non-between comparisons'
        );
    });

    it('should throw an error if likeCountMin and likeCountMax are not provided for between comparison', () => {
        expect(() =>
            PostLikesValidator.make('exampleUri', 'between', undefined)
        ).toThrow(
            'likeCountMin and likeCountMax are required for between comparisons'
        );
    });
});
