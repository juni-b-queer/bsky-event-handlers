export interface JetstreamAspectRatio {
    height: number;
    width: number;
}

export interface JetstreamRef {
    $link: string;
}

export interface JetstreamSubject {
    cid: string;
    uri: string;
}

export interface JetstreamImage {
    $type: string;
    ref: JetstreamRef;
    mimeType: string;
    size: number;
}

export interface JetstreamExternal {
    description: string;
    thumb: JetstreamImage;
    title: string;
    uri: string;
}

export interface JetstreamFeature {
    $type: string;
    uri: string;
}

export interface JetstreamIndex {
    byteEnd: number;
    byteStart: number;
}

export interface JetstreamFacet {
    features: JetstreamFeature[];
    index: JetstreamIndex;
}

export interface JetstreamImageEmbed {
    alt: string;
    aspectRatio: JetstreamAspectRatio;
    image: JetstreamImage;
}

export interface JetstreamReply {
    parent: JetstreamSubject;
    root: JetstreamSubject;
}

export interface JetstreamRecord {
    $type: JetstreamCollectionType;
    createdAt: string;
    subject?: JetstreamSubject | string;
    reply?: JetstreamReply;
}

export type JetstreamCollectionType =
    | 'app.bsky.feed.post'
    | 'app.bsky.feed.like'
    | 'app.bsky.feed.repost'
    | 'app.bsky.graph.follow';

export interface JetstreamEvent {
    did: string;
    time_us: number;
    kind: 'commit' | 'account' | 'identity';
    commit?: JetstreamCommit;
    identity?: JetstreamIdentity;
    account?: JetstreamAccount;
}

export interface JetstreamCommit {
    rev: string;
    operation: 'create' | 'delete' | 'update';
    collection: JetstreamCollectionType;
    rkey: string;
    record?: JetstreamRecord;
}

export interface JetstreamEventCommit extends JetstreamEvent {
    commit: JetstreamCommit;
}

export interface JetstreamIdentity {
    did: string;
    handle: string;
    seq: number;
    time: string;
}

export interface JetstreamEventIdentity extends JetstreamEvent {
    identity: JetstreamIdentity;
}

export interface JetstreamAccount {
    active: boolean;
    did: string;
    seq: number;
    time: string;
}

export interface JetstreamEventAccount extends JetstreamEvent {
    account: JetstreamAccount;
}

// Deprecated

export type OperationType = 'c' | 'd';
export interface JetstreamMessage {
    did: string;
    seq: number;
    opType: OperationType;
    collection: JetstreamCollectionType | string;
    rkey: string;
    cid: string;
}

export interface CreateMessage extends JetstreamMessage {
    record: JetstreamRecord;
}

export interface DeleteMessage extends JetstreamMessage {}

export interface CreateSkeetMessage extends JetstreamMessage {
    record: CreateSkeetRecord;
}

export interface CreateSkeetRecord extends JetstreamRecord {
    embed?: {
        $type: string;
        images?: JetstreamImageEmbed[];
        external?: JetstreamExternal;
    };
    facets?: JetstreamFacet[];
    langs?: string[];
    text?: string;
    reply?: JetstreamReply;
}

export interface NewSkeetRecord {
    embed?: {
        $type: string;
        images?: JetstreamImageEmbed[];
        external?: JetstreamExternal;
    };
    facets?: JetstreamFacet[];
    langs?: string[];
    text?: string;
    reply?: JetstreamReply;
}
