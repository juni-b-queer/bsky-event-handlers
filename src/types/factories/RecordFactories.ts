import {
    JetstreamCollectionType,
    CreateSkeetRecord,
    JetstreamRecord,
    JetstreamReply,
    JetstreamSubject,
    NewSkeetRecord,
    JetstreamImageEmbed,
    JetstreamExternal,
    JetstreamFacet,
} from '../JetstreamTypes';
import { AbstractTypeFactory } from './AbstractTypeFactory';

export class RecordFactory extends AbstractTypeFactory {
    public record: JetstreamRecord;
    constructor() {
        super();
        this.record = {
            $type: 'app.bsky.feed.like',
            createdAt: '',
            subject: undefined,
        };
    }

    static factory(): RecordFactory {
        return new RecordFactory();
    }

    static make(): JetstreamRecord {
        return RecordFactory.factory().create();
    }

    create(): JetstreamRecord {
        return this.record as JetstreamRecord;
    }

    type(inputType: JetstreamCollectionType) {
        this.record.$type = inputType;
        return this;
    }

    isLike() {
        this.record.$type = 'app.bsky.feed.like';
        return this;
    }

    isRepost() {
        this.record.$type = 'app.bsky.feed.repost';
        return this;
    }

    isFollow(followedDid: string | undefined = undefined) {
        this.record.$type = 'app.bsky.graph.follow';
        if (followedDid !== undefined) {
            this.record.subject = followedDid;
        }
        return this;
    }

    subject(inputSubject: JetstreamSubject | string) {
        this.record.subject = inputSubject;
        return this;
    }
}

export class NewSkeetRecordFactory extends AbstractTypeFactory {
    public record: NewSkeetRecord;
    constructor() {
        super();
        this.record = {
            $type: 'app.bsky.feed.post',
            embed: undefined,
            facets: undefined,
            langs: undefined,
            text: 'example text',
            reply: undefined,
        };
    }

    static factory(): NewSkeetRecordFactory {
        return new NewSkeetRecordFactory();
    }

    static make(): NewSkeetRecord {
        return NewSkeetRecordFactory.factory().create();
    }

    create(): NewSkeetRecord {
        return this.record as NewSkeetRecord;
    }
}

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

    static make(): CreateSkeetRecord {
        return CreateSkeetRecordFactory.factory().create();
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
     * Set the text for the Skeet JetstreamRecord object.
     *
     * @param {string} skeetText - The text to be set for the Skeet JetstreamRecord.
     * @return {CreateSkeetRecordFactory} - The update instance of CreateSkeetRecordFactory.
     */
    text(skeetText: string): CreateSkeetRecordFactory {
        this.skeetRecordObject.text = skeetText;
        return this;
    }

    /**
     * Sets the reply value for a SkeetRecordFactory object.
     *
     * @param {JetstreamReply} skeetReply - The reply value to be set for the SkeetRecordFactory object.
     * @return {CreateSkeetRecordFactory} - The update instance of CreateSkeetRecordFactory.
     */
    reply(skeetReply: JetstreamReply): CreateSkeetRecordFactory {
        this.skeetRecordObject.reply = skeetReply;
        return this;
    }
}

export class JetstreamSubjectFactory extends AbstractTypeFactory {
    public subject: JetstreamSubject;
    constructor() {
        super();
        this.subject = {
            cid: '',
            uri: '',
        };
    }

    static factory(): JetstreamSubjectFactory {
        return new JetstreamSubjectFactory();
    }

    static make(): JetstreamSubject {
        return JetstreamSubjectFactory.factory().create();
    }

    create(): JetstreamSubject {
        return this.subject as JetstreamSubject;
    }

    cid(inputCid: string) {
        this.subject.cid = inputCid;
        return this;
    }

    uri(inputUri: string) {
        this.subject.uri = inputUri;
        return this;
    }
}

/**
 * A factory class for creating JetstreamReply objects.
 * @extends AbstractTypeFactory
 */
export class ReplyFactory extends AbstractTypeFactory {
    public reply: JetstreamReply;
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

    static make(): JetstreamReply {
        return ReplyFactory.factory().create();
    }

    create(): JetstreamReply {
        return this.reply as JetstreamReply;
    }

    /**
     * Sets the root subject for the reply.
     *
     * @param {JetstreamSubject} replyRoot - The root subject for the reply.
     * @return {ReplyFactory} - The updated instance of the ReplyFactory.
     */
    root(replyRoot: JetstreamSubject): ReplyFactory {
        this.reply.root = replyRoot;
        return this;
    }

    /**
     * Sets the parent reply for the given subject.
     *
     * @param {JetstreamSubject} replyParent - The parent reply to be set.
     * @return {ReplyFactory} - The updated instance of the ReplyFactory.
     */
    parent(replyParent: JetstreamSubject): ReplyFactory {
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
