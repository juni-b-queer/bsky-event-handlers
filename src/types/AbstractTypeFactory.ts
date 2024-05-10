import {
  CreateMessage,
  CreateSkeetMessage,
  CreateSkeetRecord,
  JetstreamMessage,
  Record,
  Reply, Subject
} from "./JetstreamTypes";

export abstract class AbstractTypeFactory {

  constructor() {
  }

  static factory() {
    throw new Error("Method Not Implemented! Use constructor.");
  }

  create() {
    throw new Error("Method Not Implemented! Use constructor.");
  }


}

export class JetstreamMessageFactory extends AbstractTypeFactory {
  public messageObject: JetstreamMessage;

  constructor() {
    super();
    this.messageObject = { cid: "", collection: "app.bsky.feed.post", did: "", opType: "c", rkey: "", seq: 0 };
  }

  static factory() {
    return new JetstreamMessageFactory();
  }

  create() {
    return this.messageObject as JetstreamMessage;
  }

  collection(messageType: "app.bsky.feed.post" | "app.bsky.feed.like" | "app.bsky.feed.repost" | "app.bsky.graph.follow") {
    this.messageObject.collection = messageType;
    return this;
  }

  opType(opType: "c" | "d") {
    this.messageObject.opType = opType;
    return this;
  }

  isCreation() {
    this.messageObject.opType = "c";
    return this;
  }

  isDeletion() {
    this.messageObject.opType = "d";
    return this;
  }

  fromDid(did: string) {
    this.messageObject.did = did;
    return this;
  }

  rkey(rkey: string) {
    this.messageObject.rkey = rkey;
    return this;
  }

  cid(cid: string) {
    this.messageObject.cid = cid;
    return this;
  }

  seq(seq: number) {
    this.messageObject.seq = seq;
    return this;
  }
}

export class CreateMessageFactory extends JetstreamMessageFactory {
  public messageObject: CreateMessage;

  constructor() {
    super();
    this.messageObject = {
      cid: "",
      collection: "app.bsky.feed.post",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      record: {
        $type: "",
        createdAt: ""
      }
    };
  }

  static factory() {
    return new CreateMessageFactory();
  }

  record(record: Record) {
    this.messageObject.record = record;
    return this;
  }

  create() {
    return this.messageObject as JetstreamMessage;
  }
}


export class CreateSkeetRecordFactory extends AbstractTypeFactory {
  public skeetRecordObject: CreateSkeetRecord
  constructor() {
    super();
    this.skeetRecordObject = {
      $type: "app.bsky.feed.post",
      createdAt: Date.now().toString(),
      embed: undefined,
      facets: undefined,
      langs: undefined,
      reply: undefined,
      text: ""
    }
  }

  static factory(): CreateSkeetRecordFactory{
    return new CreateSkeetRecordFactory();
  }

  create(): CreateSkeetRecord {
    return this.skeetRecordObject as CreateSkeetRecord;
  }

  text(skeetText: string){
    this.skeetRecordObject.text = skeetText;
    return this;
  }

  reply(skeetReply: Reply){
    this.skeetRecordObject.reply = skeetReply;
    return this;
  }
}

export class ReplyFactory extends AbstractTypeFactory {
  public reply: Reply
  constructor() {
    super();
    this.reply = {
      root: {
        uri: "",
        cid: ""
      },
      parent: {
        uri: "",
        cid: ""
      }
    }
  }

  static factory(): ReplyFactory{
    return new ReplyFactory();
  }

  create(): Reply {
    return this.reply as Reply;
  }

  root(replyRoot: Subject){
    this.reply.root = replyRoot;
    return this;
  }


  parent(replyParent: Subject){
    this.reply.parent = replyParent;
    return this;
  }

  replyTo(did: string){
    let replyParentUri = `at://${did}/app.bsky.feed.post/rkey`
    this.reply.parent.uri = replyParentUri;
    return this;
  }

}
export class CreateSkeetMessageFactory extends CreateMessageFactory {
  public messageObject: CreateSkeetMessage;

  constructor() {
    super();
    this.messageObject = {
      cid: "",
      collection: "app.bsky.feed.post",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      record: CreateSkeetRecordFactory.factory().create(),
    };
  }

  static factory() {
    return new CreateMessageFactory();
  }

  record(record: Record) {
    this.messageObject.record = record;
    return this;
  }

  create(): CreateSkeetMessage {
    return this.messageObject as CreateSkeetMessage;
  }
}
