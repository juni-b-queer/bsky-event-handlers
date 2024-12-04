import { JetstreamEventCommit } from '../../../types/JetstreamTypes';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { AbstractMessageValidator } from '../AbstractMessageValidator';

type ComparisonType = 'equal' | 'greaterThan' | 'lessThan' | 'between';

export class PostLikesValidator extends AbstractMessageValidator {
    constructor(
        private postUri: string,
        private comparisonType: ComparisonType,
        private likeCount?: number, // Optional for 'between'
        private likeCountMin?: number, // Required for 'between'
        private likeCountMax?: number // Required for 'between'
    ) {
        super();
        if (this.comparisonType !== 'between' && this.likeCount === undefined) {
            throw new Error(
                'likeCount is required for non-between comparisons'
            );
        }

        if (
            this.comparisonType === 'between' &&
            (this.likeCountMin === undefined || this.likeCountMax === undefined)
        ) {
            throw new Error(
                'likeCountMin and likeCountMax are required for between comparisons'
            );
        }
    }

    static make(
        postUri: string,
        comparisonType: ComparisonType,
        likeCount?: number,
        likeCountMin?: number,
        likeCountMax?: number
    ): PostLikesValidator {
        return new PostLikesValidator(
            postUri,
            comparisonType,
            likeCount,
            likeCountMin,
            likeCountMax
        );
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        const likes = await handlerAgent.getPostLikeCount(this.postUri);

        switch (this.comparisonType) {
            case 'equal':
                return likes === this.likeCount;
            case 'greaterThan':
                // @ts-ignore
                return likes > this.likeCount;
            case 'lessThan':
                // @ts-ignore
                return likes < this.likeCount;
            case 'between':
                return (
                    // @ts-ignore
                    likes >= this.likeCountMin &&
                    // @ts-ignore
                    likes <= this.likeCountMax
                );
        }
    }
}
