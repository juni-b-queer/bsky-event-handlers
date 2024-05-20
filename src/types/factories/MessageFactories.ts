import {
    CollectionType,
    CreateMessage,
    CreateSkeetMessage,
    CreateSkeetRecord,
    JetstreamMessage,
    Record, Reply
} from "../JetstreamTypes";
import { AbstractTypeFactory } from './AbstractTypeFactory';
import { CreateSkeetRecordFactory, ReplyFactory } from "./RecordFactories";

/**
 * JetstreamMessageFactory
 *
 * A factory class for creating Jetstream messages.
 */
export class JetstreamMessageFactory extends AbstractTypeFactory {
    public messageObject: JetstreamMessage;

    /**
     * Creates a new instance of the constructor.
     *
     * @constructor
     */
    constructor() {
        super();
        this.messageObject = {
            cid: '',
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
        };
    }

    /**
     * Returns an instance of JetstreamMessageFactory.
     *
     * @returns {JetstreamMessageFactory} An instance of JetstreamMessageFactory
     */
    static factory(): JetstreamMessageFactory {
        return new JetstreamMessageFactory();
    }

    static make(): JetstreamMessage {
        return JetstreamMessageFactory.factory().create();
    }

    /**
     * Returns the message object as a JetstreamMessage.
     *
     * @return {JetstreamMessage} The message object as a JetstreamMessage.
     */
    create(): JetstreamMessage {
        return this.messageObject;
    }

    /**
     * Sets the collection type for the message object.
     *
     * @param {string} messageType - The type of collection to set. Valid values are "app.bsky.feed.post", "app.bsky.feed.like", "app.bsky.feed.repost", and "app.bsky.graph.follow".
     *
     * @return {JetstreamMessageFactory} - The modified collection object.
     */
    collection(messageType: CollectionType) {
        this.messageObject.collection = messageType;
        return this;
    }

    /**
     * Sets the operation type for the message object.
     *
     * @param {string} opType - The operation type. Must be either "c" or "d".
     * @return {JetstreamMessageFactory} - Returns the updated instance of the class.
     */
    opType(opType: 'c' | 'd') {
        this.messageObject.opType = opType;
        return this;
    }

    /**
     * Sets the operation type to "c" (creation) for the message object.
     *
     * @return {JetstreamMessageFactory} - Returns the updated instance of the class.
     */
    isCreation() {
        this.messageObject.opType = 'c';
        return this;
    }

    /**
     * Sets the operation type to "d" (deletion) for the message object.
     *
     * @return {JetstreamMessageFactory} - Returns the updated instance of the class.
     */
    isDeletion() {
        this.messageObject.opType = 'd';
        return this;
    }

    /**
     * Sets the 'did' property of the message object.
     *
     * @param {string} did - The value to set as the 'did' property.
     * @return {JetstreamMessageFactory} - Returns the updated instance of the class.
     */
    fromDid(did: string) {
        this.messageObject.did = did;
        return this;
    }

    /**
     * Set the value of the rkey property in the message object.
     *
     * @param {string} rkey - The rkey value to set.
     * @return {JetstreamMessageFactory} - Returns the updated instance of the class.
     */
    rkey(rkey: string) {
        this.messageObject.rkey = rkey;
        return this;
    }

    /**
     * Sets the CID for the message object.
     *
     * @param {string} cid - The custom identifier for the message.
     * @return {JetstreamMessageFactory} - Returns the updated instance of the class.
     */
    cid(cid: string) {
        this.messageObject.cid = cid;
        return this;
    }

    /**
     * Set the seq property of the message object.
     *
     * @param {number} seq - The value to set as the seq property.
     * @return {JetstreamMessageFactory} - Returns the updated instance of the class.
     */
    seq(seq: number) {
        this.messageObject.seq = seq;
        return this;
    }
}

/**
 * Represents a factory for creating create message objects.
 */
export class CreateMessageFactory extends JetstreamMessageFactory {
    public messageObject: CreateMessage;

    /**
     * Constructor for creating a new instance of the class.
     * Initializes a message object with default values for its properties.
     *
     * @constructor
     */
    constructor() {
        super();
        this.messageObject = {
            cid: '',
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            record: {
                $type: 'app.bsky.feed.post',
                createdAt: '',
            },
        } as CreateMessage;
    }

    /**
     * Creates a new instance of CreateMessageFactory.
     *
     * @return {CreateMessageFactory} The newly created instance of CreateMessageFactory.
     */
    static factory(): CreateMessageFactory {
        return new CreateMessageFactory();
    }

    static make(): CreateMessage {
        return CreateMessageFactory.factory().create();
    }

    /**
     * Creates a Jetstream message object.
     *
     * @returns {CreateMessage} The created CreateMessage object.
     */
    create(): CreateMessage {
        return this.messageObject as CreateMessage;
    }

    /**
     * Sets the record for the message.
     *
     * @param {Record} record - The record to set for the message.
     * @return {CreateMessageFactory} - The updated Factory with the new record.
     */
    record(record: Record): CreateMessageFactory {
        this.messageObject.record = record;
        return this;
    }
}

// TODO what was I going to add here? Probably functions for setting text
//  and adding embeds and stuff
export class CreateSkeetMessageFactory extends CreateMessageFactory {
    public messageObject: CreateSkeetMessage;

    constructor() {
        super();
        this.messageObject = {
            cid: '',
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            record: CreateSkeetRecordFactory.factory().create(),
        } as CreateSkeetMessage;
    }

    static factory(): CreateSkeetMessageFactory {
        return new CreateSkeetMessageFactory();
    }

    static make(): CreateSkeetMessage {
        return CreateSkeetMessageFactory.factory().create();
    }
    create(): CreateSkeetMessage {
        return this.messageObject as CreateSkeetMessage;
    }

    record(record: CreateSkeetRecord): CreateSkeetMessageFactory {
        this.messageObject.record = record;
        return this;
    }

    withReply(reply: Reply|undefined = undefined){
        if(reply === undefined){
            this.messageObject.record.reply = ReplyFactory.make()
        }else{
            this.messageObject.record.reply = reply
        }
        return this;
    }

    withText(text: string){
        this.messageObject.record.text = text
        return this;
    }
}
