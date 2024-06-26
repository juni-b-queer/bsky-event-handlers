export interface AspectRatio {
    height: number;
    width: number;
}

export interface Ref {
    $link: string;
}

export interface Subject {
    cid: string;
    uri: string;
}

export interface Image {
    $type: string;
    ref: Ref;
    mimeType: string;
    size: number;
}

export interface External {
    description: string;
    thumb: Image;
    title: string;
    uri: string;
}

export interface Feature {
    $type: string;
    uri: string;
}

export interface Index {
    byteEnd: number;
    byteStart: number;
}

export interface Facet {
    features: Feature[];
    index: Index;
}

export interface ImageEmbed {
    alt: string;
    aspectRatio: AspectRatio;
    image: Image;
}

export interface Reply {
    parent: Subject;
    root: Subject;
}

export interface Record {
    $type: CollectionType;
    createdAt: string;
    subject?: Subject | string;
}

export interface CreateSkeetRecord extends Record {
    embed?: { $type: string; images?: ImageEmbed[]; external?: External };
    facets?: Facet[];
    langs?: string[];
    text?: string;
    reply?: Reply;
}

export type CollectionType =
    | 'app.bsky.feed.post'
    | 'app.bsky.feed.like'
    | 'app.bsky.feed.repost'
    | 'app.bsky.graph.follow';

export type OperationType = 'c' | 'd';
export interface JetstreamMessage {
    did: string;
    seq: number;
    opType: OperationType;
    collection: CollectionType | string;
    rkey: string;
    cid: string;
}

export interface CreateMessage extends JetstreamMessage {
    record: Record;
}

export interface DeleteMessage extends JetstreamMessage {}

export interface CreateSkeetMessage extends JetstreamMessage {
    record: CreateSkeetRecord;
}
