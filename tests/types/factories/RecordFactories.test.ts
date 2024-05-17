import {
    CreateSkeetRecord,
    CreateSkeetRecordFactory,
    Reply,
    ReplyFactory,
    Subject,
} from '../../../src';

describe('CreateSkeetRecordFactory', () => {
    let factory: CreateSkeetRecordFactory;

    let defaultCreateSkeetRecord: CreateSkeetRecord;
    beforeEach(() => {
        factory = CreateSkeetRecordFactory.factory();
        defaultCreateSkeetRecord = {
            $type: 'app.bsky.feed.post',
            createdAt: Date.now().toString(),
            embed: undefined,
            facets: undefined,
            langs: undefined,
            reply: undefined,
            text: '',
        };
    });

    it('creates a new CreateSkeetRecordFactory with Factory, and a default CreateSkeetRecord with create', () => {
        const record = factory.create();
        defaultCreateSkeetRecord.createdAt = record.createdAt;
        expect(record).toEqual(defaultCreateSkeetRecord);
    });

    it('updates the CreateSkeetRecord text with a given text', () => {
        const text = 'Test Text';
        defaultCreateSkeetRecord.text = text;
        const record = factory.text(text).create();
        defaultCreateSkeetRecord.createdAt = record.createdAt;
        expect(record).toEqual(defaultCreateSkeetRecord);
    });

    it('updates the CreateSkeetRecord reply with a given Reply', () => {
        const reply = ReplyFactory.factory().create();
        defaultCreateSkeetRecord.reply = reply;
        const record = factory.reply(reply).create();
        defaultCreateSkeetRecord.createdAt = record.createdAt;
        expect(record).toEqual(defaultCreateSkeetRecord);
    });
});

describe('ReplyFactory', () => {
    let factory: ReplyFactory;
    let defaultReply: Reply;

    beforeEach(() => {
        factory = ReplyFactory.factory();
        defaultReply = {
            root: {
                uri: '',
                cid: '',
            },
            parent: {
                uri: '',
                cid: '',
            },
        };
    });

    it('creates a new ReplyFactory with factory, and a default Reply with create', () => {
        const message = factory.create();
        expect(message).toEqual(defaultReply);
    });

    it('updates the Reply Root with a given root Subject', () => {
        const root: Subject = {
            cid: 'uri',
            uri: 'uri',
        };
        defaultReply.root = root;
        factory.root(root);
        expect(factory.create()).toEqual(defaultReply);
    });

    it('updates the Reply parent with a given parent Subject', () => {
        const parent: Subject = {
            cid: 'uri',
            uri: 'uri',
        };
        defaultReply.parent = parent;
        factory.parent(parent);
        expect(factory.create()).toEqual(defaultReply);
    });

    it('updates the Reply parent uri to be replying to the given did', () => {
        const did: string = 'did:plc:example';
        defaultReply.parent.uri = `at://${did}/app.bsky.feed.post/rkey`;
        factory.replyTo(did);
        expect(factory.create()).toEqual(defaultReply);
    });
});
