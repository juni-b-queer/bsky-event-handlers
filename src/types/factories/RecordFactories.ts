import { CreateSkeetRecord, Reply, Subject } from '../JetstreamTypes';
import { AbstractTypeFactory } from './AbstractTypeFactory';

/**
 * Represents a factory class for creating a skeet record object.
 * @extends AbstractTypeFactory
 */
export class CreateSkeetRecordFactory extends AbstractTypeFactory {
    public skeetRecordObject: CreateSkeetRecord;
    /**
     * Create a new instance of the CreateSkeetRecordFactory.
     *
     * @constructor
     */
    constructor() {
        super();
        this.skeetRecordObject = {
            $type: 'app.bsky.feed.post',
            createdAt: Date.now().toString(),
            embed: undefined,
            facets: undefined,
            langs: undefined,
            reply: undefined,
            text: '',
        };
    }

    /**
     * Factory method for creating an instance of CreateSkeetRecordFactory.
     *
     * @returns {CreateSkeetRecordFactory} The new instance of CreateSkeetRecordFactory.
     */
    static factory(): CreateSkeetRecordFactory {
        return new CreateSkeetRecordFactory();
    }

    /**
     * Creates a new {CreateSkeetRecord} object from the factoru data.
     *
     * @returns {CreateSkeetRecord} The newly created {CreateSkeetRecord} object.
     */
    create(): CreateSkeetRecord {
        return this.skeetRecordObject as CreateSkeetRecord;
    }

    /**
     * Set the text for the Skeet Record object.
     *
     * @param {string} skeetText - The text to be set for the Skeet Record.
     * @return {CreateSkeetRecordFactory} - The update instance of CreateSkeetRecordFactory.
     */
    text(skeetText: string): CreateSkeetRecordFactory {
        this.skeetRecordObject.text = skeetText;
        return this;
    }

    /**
     * Sets the reply value for a SkeetRecordFactory object.
     *
     * @param {Reply} skeetReply - The reply value to be set for the SkeetRecordFactory object.
     * @return {CreateSkeetRecordFactory} - The update instance of CreateSkeetRecordFactory.
     */
    reply(skeetReply: Reply): CreateSkeetRecordFactory {
        this.skeetRecordObject.reply = skeetReply;
        return this;
    }
}

/**
 * A factory class for creating Reply objects.
 * @extends AbstractTypeFactory
 */
export class ReplyFactory extends AbstractTypeFactory {
    public reply: Reply;
    constructor() {
        super();
        this.reply = {
            root: {
                uri: '',
                cid: '',
            },
            parent: {
                uri: '',
                cid: '',
            },
        };
    }

    static factory(): ReplyFactory {
        return new ReplyFactory();
    }

    create(): Reply {
        return this.reply as Reply;
    }

    /**
     * Sets the root subject for the reply.
     *
     * @param {Subject} replyRoot - The root subject for the reply.
     * @return {ReplyFactory} - The updated instance of the ReplyFactory.
     */
    root(replyRoot: Subject): ReplyFactory {
        this.reply.root = replyRoot;
        return this;
    }

    /**
     * Sets the parent reply for the given subject.
     *
     * @param {Subject} replyParent - The parent reply to be set.
     * @return {ReplyFactory} - The updated instance of the ReplyFactory.
     */
    parent(replyParent: Subject): ReplyFactory {
        this.reply.parent = replyParent;
        return this;
    }

    // I like the `replyTo` function and think it could be good to use on the skeet actions? lets see where that goes
    /**
     * Sets the parent URI for replying to a message.
     *
     * @param {string} did - The decentralized identifier (DID) of the user.
     * @return {ReplyFactory} - The updated instance of the ReplyFactory.
     */
    replyTo(did: string): ReplyFactory {
        this.reply.parent.uri = `at://${did}/app.bsky.feed.post/rkey`;
        return this;
    }
}
