import { CreateMessage, JetstreamMessage, Record } from "./JetstreamTypes";

abstract class AbstractTypeFactory {

  constructor() {
  }

  static factory() {
    throw new Error("Method Not Implemented! Use constructor.");
  }

  create() {
    throw new Error("Method Not Implemented! Use constructor.");
  }


}

class JetstreamMessageFactory extends AbstractTypeFactory {
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

class CreateMessageFactory extends JetstreamMessageFactory {
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
}