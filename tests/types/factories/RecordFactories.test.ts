import {
    CreateSkeetRecord,
    CreateSkeetRecordFactory,
    JetstreamRecord,
    JetstreamRecordFactory,
    JetstreamReply,
    JetstreamSubject,
    JetstreamSubjectFactory,
    ReplyFactory,
} from '../../../src';

describe('RecordFactory', () => {
    let factory: JetstreamRecordFactory;
    let defaultRecord: JetstreamRecord;

    beforeEach(() => {
        factory = JetstreamRecordFactory.factory();
        defaultRecord = {
            $type: 'app.bsky.feed.like',
            createdAt: '',
            subject: undefined,
        };
    });

    it('default', () => {
        const record = JetstreamRecordFactory.make();
        expect(record).toEqual(JetstreamRecordFactory.factory().create());
    });

    it('Type', () => {
        const record = factory.type('app.bsky.feed.like').create();
        expect(record).toEqual(defaultRecord);
    });

    it('subject', () => {
        const subject: JetstreamSubject = JetstreamSubjectFactory.make();
        const record = factory.subject(subject).create();
        defaultRecord.subject = subject;
        expect(record).toEqual(defaultRecord);
    });

    it('Is Like', () => {
        const record = factory.isLike().create();
        expect(record).toEqual(defaultRecord);
    });

    it('Is repost', () => {
        const record = factory.isRepost().create();
        defaultRecord.$type = 'app.bsky.feed.repost';
        expect(record).toEqual(defaultRecord);
    });

    it('Is follow with no did', () => {
        const record = factory.isFollow().create();
        defaultRecord.$type = 'app.bsky.graph.follow';
        expect(record).toEqual(defaultRecord);
    });

    it('Is follow with did', () => {
        const did = 'did:plc:test';
        const record = factory.isFollow(did).create();
        defaultRecord.$type = 'app.bsky.graph.follow';
        defaultRecord.subject = did;
        expect(record).toEqual(defaultRecord);
    });
});
describe('CreateSkeetRecordFactory', () => {
    let factory: CreateSkeetRecordFactory;

    let defaultCreateSkeetRecord: CreateSkeetRecord;
    beforeEach(() => {
        factory = CreateSkeetRecordFactory.factory();
        defaultCreateSkeetRecord = CreateSkeetRecordFactory.make();
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

    it('updates the CreateSkeetRecord reply with a given JetstreamReply', () => {
        const reply = ReplyFactory.factory().create();
        defaultCreateSkeetRecord.reply = reply;
        const record = factory.reply(reply).create();
        defaultCreateSkeetRecord.createdAt = record.createdAt;
        expect(record).toEqual(defaultCreateSkeetRecord);
    });
});

describe('SubjectFactory', () => {
    let factory: JetstreamSubjectFactory;
    let defaultSubject: JetstreamSubject;

    beforeEach(() => {
        factory = JetstreamSubjectFactory.factory();
        defaultSubject = JetstreamSubjectFactory.make();
    });

    it('creates a new JetstreamSubject with factory, and a default subject with create', () => {
        const message = factory.create();
        expect(message).toEqual(defaultSubject);
    });

    it('CID', () => {
        const cid = 'testCid';
        const message = factory.cid(cid).create();
        defaultSubject.cid = cid;
        expect(message).toEqual(defaultSubject);
    });

    it('URI', () => {
        const uri = 'testuri';
        const message = factory.uri(uri).create();
        defaultSubject.uri = uri;
        expect(message).toEqual(defaultSubject);
    });
});
describe('ReplyFactory', () => {
    let factory: ReplyFactory;
    let defaultReply: JetstreamReply;

    beforeEach(() => {
        factory = ReplyFactory.factory();
        defaultReply = ReplyFactory.make();
    });

    it('creates a new ReplyFactory with factory, and a default JetstreamReply with create', () => {
        const message = factory.create();
        expect(message).toEqual(defaultReply);
    });

    it('updates the JetstreamReply Root with a given root JetstreamSubject', () => {
        const root: JetstreamSubject = {
            cid: 'uri',
            uri: 'uri',
        };
        defaultReply.root = root;
        factory.root(root);
        expect(factory.create()).toEqual(defaultReply);
    });

    it('updates the JetstreamReply parent with a given parent JetstreamSubject', () => {
        const parent: JetstreamSubject = {
            cid: 'uri',
            uri: 'uri',
        };
        defaultReply.parent = parent;
        factory.parent(parent);
        expect(factory.create()).toEqual(defaultReply);
    });

    it('updates the JetstreamReply parent uri to be replying to the given did', () => {
        const did: string = 'did:plc:example';
        defaultReply.parent.uri = `at://${did}/app.bsky.feed.post/rkey`;
        factory.replyTo(did);
        expect(factory.create()).toEqual(defaultReply);
    });
});
