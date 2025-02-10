import {
    JetstreamEvent,
    JetstreamEventFactory,
    JetstreamCommit,
    JetstreamCommitFactory,
    JetstreamIdentity,
    JetstreamIdentityFactory,
    JetstreamAccount,
    JetstreamAccountFactory,
    NewSkeetRecordFactory,
    NewSkeetRecord,
} from '../../../src';

describe('JetstreamEventFactory', () => {
    let factory: JetstreamEventFactory;
    let defaultEvent: JetstreamEvent;

    beforeEach(() => {
        factory = JetstreamEventFactory.factory();
        defaultEvent = JetstreamEventFactory.factory().commit().create();
    });

    it('creates a new JetstreamEvent with factory, and a default event with create', () => {
        const event = factory.commit().create();
        expect(event).toEqual(defaultEvent);
    });

    it('updates the JetstreamEvent DID', () => {
        const did = 'did:plc:custom';
        const event = factory.fromDid(did).commit().create();
        defaultEvent.did = did;
        expect(event).toEqual(defaultEvent);
    });

    it('attaches a commit to the JetstreamEvent', () => {
        const commit = JetstreamCommitFactory.make();
        const event = factory.commit(commit).create();
        defaultEvent.commit = commit;
        expect(event).toEqual(defaultEvent);
    });
});

describe('JetstreamCommitFactory', () => {
    let factory: JetstreamCommitFactory;
    let defaultCommit: JetstreamCommit;

    beforeEach(() => {
        factory = JetstreamCommitFactory.factory();
        defaultCommit = {
            collection: 'app.bsky.feed.post',
            operation: 'create',
            rkey: 'examplerkey',
            cid: 'examplecid',
            rev: 'examplerev',
            record: undefined,
        };
    });

    it('creates a new JetstreamCommit with factory, and a default commit with create', () => {
        const commit = factory.create();
        expect(commit).toEqual(defaultCommit);
    });

    it('updates the JetstreamCommit operation', () => {
        const operation = 'update';
        const commit = factory.operation(operation).create();
        defaultCommit.operation = operation;
        expect(commit).toEqual(defaultCommit);
    });

    it('updates the JetstreamCommit collection', () => {
        const collection = 'app.bsky.feed.like';
        const commit = factory.collection(collection).create();
        defaultCommit.collection = collection;
        expect(commit).toEqual(defaultCommit);
    });

    it('updates the JetstreamCommit rkey', () => {
        const rkey = 'newrkey';
        const commit = factory.rkey(rkey).create();
        defaultCommit.rkey = rkey;
        expect(commit).toEqual(defaultCommit);
    });

    it('attaches a record to the JetstreamCommit', () => {
        const record = NewSkeetRecordFactory.factory()
            .text('sample message')
            .create();
        const commit = factory.record(record).create();
        defaultCommit.record = record;
        expect(commit).toEqual(defaultCommit);
    });
});

describe('JetstreamIdentityFactory', () => {
    let factory: JetstreamIdentityFactory;
    let defaultIdentity: JetstreamIdentity;

    beforeEach(() => {
        factory = JetstreamIdentityFactory.factory();
        defaultIdentity = {
            did: 'did:plc:example',
            handle: 'handle.example',
            seq: 0,
            time: '',
        };
    });

    it('creates a new JetstreamIdentity with factory, and a default identity with create', () => {
        const identity = factory.create();
        expect(identity).toEqual(defaultIdentity);
    });

    it('updates the JetstreamIdentity handle', () => {
        const handle = 'custom.handle';
        const identity = factory.handle(handle).create();
        defaultIdentity.handle = handle;
        expect(identity).toEqual(defaultIdentity);
    });
});

describe('JetstreamAccountFactory', () => {
    let factory: JetstreamAccountFactory;
    let defaultAccount: JetstreamAccount;

    beforeEach(() => {
        factory = JetstreamAccountFactory.factory();
        defaultAccount = JetstreamAccountFactory.make();
    });

    it('creates a new JetstreamAccount with factory, and a default account with create', () => {
        const account = factory.create();
        defaultAccount.time = account.time;
        expect(account).toEqual(defaultAccount);
    });

    it('deactivates a JetstreamAccount', () => {
        const account = factory.deactivate().create();
        defaultAccount.active = false;
        expect(account).toEqual(defaultAccount);
    });

    it('updates the JetstreamAccount sequence', () => {
        const seq = 42;
        const account = factory.sequence(seq).create();
        defaultAccount.seq = seq;
        expect(account).toEqual(defaultAccount);
    });

    it('updates the JetstreamAccount sequence', () => {
        const account = JetstreamAccountFactory.make();

        account.time = defaultAccount.time;
        expect(account).toEqual(defaultAccount);
    });
});

describe('Additional Tests for Jetstream Factories', () => {
    describe('JetstreamCommitFactory', () => {
        it('should update text in the commit record correctly', () => {
            const factory = JetstreamCommitFactory.factory();
            const text = 'new text';
            const commit = factory.text(text).create();
            if (commit.record !== undefined) {
                if ('text' in commit.record) {
                    expect(commit.record?.text).toEqual(text);
                }
            }
        });

        it('should create a commit with a custom record', () => {
            const factory = JetstreamCommitFactory.factory();
            const customRecord = { text: 'custom message' } as NewSkeetRecord; // assuming simple structure
            const commit = factory.record(customRecord).create();
            expect(commit.record).toEqual(customRecord);
        });

        it('should create a commit with a custom record', () => {
            const factory = JetstreamCommitFactory.factory();
            const customRecord = { text: 'custom message' } as NewSkeetRecord; // assuming simple structure
            const commit = factory.record(customRecord).create();
            expect(commit.record).toEqual(customRecord);

            customRecord.text = 'new message';
            factory.text('new message');
            expect(commit.record).toEqual(customRecord);
        });
    });

    describe('JetstreamEventFactory', () => {
        it('should create a commit if none provided', () => {
            const factory = JetstreamEventFactory.factory();
            factory.commit(); // This should invoke JetstreamCommitFactory.make()
            const event = factory.create();
            expect(event.commit).toBeDefined();
        });

        it('should be default for make', () => {
            const event = JetstreamEventFactory.make();
            expect(event).toEqual({
                did: 'did:plc:example',
                kind: 'commit',
                time_us: 0,
            });
        });
    });

    describe('JetstreamIdentityFactory', () => {
        it('should create identity with a custom sequence', () => {
            const factory = JetstreamIdentityFactory.factory();
            const seq = 99;
            const identity = factory.sequence(seq).create(); // If this method exists
            expect(identity.seq).toEqual(seq);
        });

        it('should create identity with a custom sequence', () => {
            const identity = JetstreamIdentityFactory.make();
            expect(identity).toEqual({
                did: 'did:plc:example',
                handle: 'handle.example',
                seq: 0,
                time: '',
            });
        });
    });
});
