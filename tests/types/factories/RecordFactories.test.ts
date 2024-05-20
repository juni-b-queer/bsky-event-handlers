import {
    CreateSkeetRecord,
    CreateSkeetRecordFactory, Record, RecordFactory,
    Reply,
    ReplyFactory,
    Subject, SubjectFactory
} from "../../../src";
import { factory } from "ts-jest/dist/transformers/hoist-jest";

describe('RecordFactory', () => {
    let factory: RecordFactory;
    let defaultRecord: Record;

    beforeEach(() => {
        factory = RecordFactory.factory();
        defaultRecord = {
            $type: 'app.bsky.feed.like',
            createdAt: '',
            subject: undefined
        };
    })

    it("Type", () => {
        const record = factory.type('app.bsky.feed.like').create();
        expect(record).toEqual(defaultRecord);
    })

    it("subject", () => {
        const subject: Subject = SubjectFactory.make()
        const record = factory.subject(subject).create();
        defaultRecord.subject = subject
        expect(record).toEqual(defaultRecord);
    })

    it("Is Like", () => {
        const record = factory.isLike().create();
        expect(record).toEqual(defaultRecord);
    })

    it("Is repost", () => {
        const record = factory.isRepost().create();
        defaultRecord.$type = "app.bsky.feed.repost"
        expect(record).toEqual(defaultRecord);
    })

    it("Is follow with no did", () => {
        const record = factory.isFollow().create();
        defaultRecord.$type = "app.bsky.graph.follow"
        expect(record).toEqual(defaultRecord);
    })

    it("Is follow with did", () => {
        const did = "did:plc:test";
        const record = factory.isFollow(did).create();
        defaultRecord.$type = "app.bsky.graph.follow"
        defaultRecord.subject = did
        expect(record).toEqual(defaultRecord);
    })
})
describe('CreateSkeetRecordFactory', () => {
    let factory: CreateSkeetRecordFactory;

    let defaultCreateSkeetRecord: CreateSkeetRecord;
    beforeEach(() => {
        factory = CreateSkeetRecordFactory.factory();
        defaultCreateSkeetRecord = CreateSkeetRecordFactory.make()
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

describe('SubjectFactory', () => {
    let factory: SubjectFactory;
    let defaultSubject: Subject;

    beforeEach(() => {
        factory = SubjectFactory.factory();
        defaultSubject = SubjectFactory.make()
    });

    it('creates a new Subject with factory, and a default subject with create', () => {
        const message = factory.create();
        expect(message).toEqual(defaultSubject);
    });

    it('CID', () => {
        const cid = "testCid";
        const message = factory.cid(cid).create();
        defaultSubject.cid = cid
        expect(message).toEqual(defaultSubject);
    });

    it('URI', () => {
        const uri = "testuri";
        const message = factory.uri(uri).create();
        defaultSubject.uri = uri;
        expect(message).toEqual(defaultSubject);
    });
});
describe('ReplyFactory', () => {
    let factory: ReplyFactory;
    let defaultReply: Reply;

    beforeEach(() => {
        factory = ReplyFactory.factory();
        defaultReply = ReplyFactory.make()
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
