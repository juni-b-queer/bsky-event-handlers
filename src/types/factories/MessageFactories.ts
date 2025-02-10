import {
    JetstreamAccount,
    JetstreamCollectionType,
    JetstreamCommit,
    JetstreamEvent,
    JetstreamIdentity,
    JetstreamRecord,
    NewSkeetRecord,
} from '../JetstreamTypes';
import { AbstractTypeFactory } from './AbstractTypeFactory';
import { NewSkeetRecordFactory } from './RecordFactories';

export class JetstreamEventFactory extends AbstractTypeFactory {
    public eventObject: JetstreamEvent;

    constructor() {
        super();
        this.eventObject = {
            did: 'did:plc:example',
            kind: 'commit',
            time_us: 0,
        };
    }

    static factory(): JetstreamEventFactory {
        return new JetstreamEventFactory();
    }

    static make(): JetstreamEvent {
        return JetstreamEventFactory.factory().create();
    }
    create(): JetstreamEvent {
        return this.eventObject as JetstreamEvent;
    }

    fromDid(did: string) {
        this.eventObject.did = did;
        return this;
    }
    commit(
        commit: JetstreamCommit | undefined = undefined
    ): JetstreamEventFactory {
        this.eventObject.kind = 'commit';
        if (commit === undefined) {
            this.eventObject.commit = JetstreamCommitFactory.make();
        } else {
            this.eventObject.commit = commit;
        }
        return this;
    }
}

export class JetstreamCommitFactory extends AbstractTypeFactory {
    public eventObject: JetstreamCommit;

    constructor() {
        super();
        this.eventObject = {
            collection: 'app.bsky.feed.post',
            operation: 'create',
            rev: 'examplerev',
            rkey: 'examplerkey',
            cid: 'examplecid',
            record: undefined,
        };
        // get keys from commit, replace values in event object
    }

    static factory(): JetstreamCommitFactory {
        return new JetstreamCommitFactory();
    }

    static make(): JetstreamCommit {
        return JetstreamCommitFactory.factory().create();
    }

    create(): JetstreamCommit {
        return this.eventObject as JetstreamCommit;
    }

    rkey(rkey: string) {
        this.eventObject.rkey = rkey;
        return this;
    }

    record(record: JetstreamRecord | NewSkeetRecord) {
        this.eventObject.record = record;
        return this;
    }

    operation(operation: 'create' | 'update' | 'delete') {
        this.eventObject.operation = operation;
        return this;
    }

    collection(collection: JetstreamCollectionType) {
        this.eventObject.collection = collection;
        return this;
    }

    text(text: string) {
        if (this.eventObject.record == undefined) {
            this.eventObject.record = NewSkeetRecordFactory.factory()
                .text(text)
                .create();
        } else {
            const tempRecord: NewSkeetRecord = this.eventObject
                .record as NewSkeetRecord;
            tempRecord.text = text;
            this.eventObject.record = tempRecord;
        }
        return this;
    }
}

export class JetstreamIdentityFactory extends AbstractTypeFactory {
    public eventObject: JetstreamIdentity;

    constructor() {
        super();
        this.eventObject = {
            did: 'did:plc:example',
            handle: 'handle.example',
            seq: 0,
            time: '',
        };
    }

    static factory(): JetstreamIdentityFactory {
        return new JetstreamIdentityFactory();
    }

    static make(): JetstreamIdentity {
        return JetstreamIdentityFactory.factory().create();
    }

    create(): JetstreamIdentity {
        return this.eventObject as JetstreamIdentity;
    }

    handle(handle: string): JetstreamIdentityFactory {
        this.eventObject.handle = handle;
        return this;
    }

    sequence(seq: number): JetstreamIdentityFactory {
        this.eventObject.seq = seq;
        return this;
    }
}

export class JetstreamAccountFactory extends AbstractTypeFactory {
    public eventObject: JetstreamAccount;

    constructor() {
        super();
        this.eventObject = {
            active: true,
            did: 'did:plc:example',
            seq: 0,
            time: Date.now().toString(),
        };
    }

    static factory(): JetstreamAccountFactory {
        return new JetstreamAccountFactory();
    }

    static make(): JetstreamAccount {
        return JetstreamAccountFactory.factory().create();
    }

    create(): JetstreamAccount {
        return this.eventObject as JetstreamAccount;
    }

    deactivate(): JetstreamAccountFactory {
        this.eventObject.active = false;
        return this;
    }

    sequence(seq: number): JetstreamAccountFactory {
        this.eventObject.seq = seq;
        return this;
    }
}
