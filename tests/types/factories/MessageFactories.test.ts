import {
    CollectionType,
    CreateMessage,
    CreateMessageFactory,
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    CreateSkeetRecordFactory,
    JetstreamMessage,
    JetstreamMessageFactory,
    OperationType,
    Record,
    RecordFactory,
} from '../../../src';
describe('JetstreamMessageFactory', () => {
    let factory: JetstreamMessageFactory;

    let defaultJetstreamMessage: JetstreamMessage;
    beforeEach(() => {
        factory = JetstreamMessageFactory.factory();
        defaultJetstreamMessage = {
            cid: '',
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
        };
    });

    it('creates a new JetstreamMessageFactory with Factory, and a default JetstreamMessage with create', () => {
        const message = factory.create();
        expect(message).toEqual(defaultJetstreamMessage);
    });
    //collection
    it('Updates the JetstreamMessage.collection with a given collection', () => {
        const collection: CollectionType = 'app.bsky.feed.like';
        factory.collection(collection);
        defaultJetstreamMessage.collection = collection;
        expect(factory.create()).toEqual(defaultJetstreamMessage);
    });
    // optType
    it('Updates the JetstreamMessage.opType with a given opType', () => {
        const opType: OperationType = 'c';
        factory.opType(opType);
        defaultJetstreamMessage.opType = opType;
        expect(factory.create()).toEqual(defaultJetstreamMessage);
    });
    // isCreation
    it("Updates the JetstreamMessage.opType with a 'c' using isCreation", () => {
        factory.isCreation();
        defaultJetstreamMessage.opType = 'c';
        expect(factory.create()).toEqual(defaultJetstreamMessage);
    });
    // isDeletion
    it("Updates the JetstreamMessage.opType with a 'd' using isDeletion", () => {
        factory.isDeletion();
        defaultJetstreamMessage.opType = 'd';
        expect(factory.create()).toEqual(defaultJetstreamMessage);
    });
    // fromDid
    it('Updates the JetstreamMessage.did with a given did', () => {
        const did = 'did:plc:test';
        factory.fromDid(did);
        defaultJetstreamMessage.did = did;
        expect(factory.create()).toEqual(defaultJetstreamMessage);
    });
    //rkey
    it('Updates the JetstreamMessage.rkey with a given rkey', () => {
        const rkey = 'testrkey';
        factory.rkey(rkey);
        defaultJetstreamMessage.rkey = rkey;
        expect(factory.create()).toEqual(defaultJetstreamMessage);
    });
    // cid
    it('Updates the JetstreamMessage.cid with a given cid', () => {
        const cid = 'testcid';
        factory.cid(cid);
        defaultJetstreamMessage.cid = cid;
        expect(factory.create()).toEqual(defaultJetstreamMessage);
    });
    // seq
    it('Updates the JetstreamMessage.seq with a given seq', () => {
        const seq = 100;
        factory.seq(seq);
        defaultJetstreamMessage.seq = seq;
        expect(factory.create()).toEqual(defaultJetstreamMessage);
    });
});

describe('CreateMessageFactory', () => {
    const factory: CreateMessageFactory = CreateMessageFactory.factory();
    let defaultCreateMessage: CreateMessage;

    beforeEach(() => {
        defaultCreateMessage = {
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
        };
    });

    it('creates a new CreateMessageFactory with factory, and a default CreateMessage with create', () => {
        const message = factory.create();
        expect(message).toEqual(defaultCreateMessage);
    });
    //record
    it('Updates the createMessage with a given record', () => {
        const record: Record = RecordFactory.make();
        factory.record(record);
        defaultCreateMessage.record = record;
        expect(factory.create()).toEqual(defaultCreateMessage);
    });
});

describe('CreateSkeetMessageFactory', () => {
    let factory: CreateSkeetMessageFactory;
    let defaultCreateSkeetMessage: CreateSkeetMessage;

    beforeEach(() => {
        factory = CreateSkeetMessageFactory.factory();
        defaultCreateSkeetMessage = {
            cid: '',
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            record: CreateSkeetRecordFactory.factory().create(),
        };
    });

    it('creates a new CreateSkeetMessageFactory with factory, and a default CreateMessage with create', () => {
        const message = factory.create();
        defaultCreateSkeetMessage.record.createdAt = message.record.createdAt;
        expect(message).toEqual(defaultCreateSkeetMessage);
    });
    //record
    it('Updates the CreateSkeetMessageRecord with a given record', () => {
        const record = CreateSkeetRecordFactory.factory().create();
        factory.record(record);
        defaultCreateSkeetMessage.record = record;
        expect(factory.create()).toEqual(defaultCreateSkeetMessage);
    });
});
