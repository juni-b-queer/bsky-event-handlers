# Types

[//]: # (TODO UPDATE these for the changed types)

## Jetstream Interfaces

### JetstreamEvent

A standard message format that's used as the base for other message types. Received from the jetstream firehose

| Property  | Type              | Description                     |
|-----------|-------------------|---------------------------------|
| did       | string            | DID that took the action        |
| time_us   | number            | When bluesky received the event |
| kind      | string            | 'commit', 'account', 'identity' |
| commit?   | JetstreamCommit   | Commit data                     |
| identity? | JetstreamIdentity | Identity data                   |
| account?  | JetstreamAccount  | Account data                    |

### JetstreamEventCommit extends JetstreamEvent

An event with the commit property, kind = 'commit'

| Property | Type            | Description                    |
|----------|-----------------|--------------------------------|
| commit   | JetstreamCommit | The commit data from the event |

### JetstreamCommit

The commit data in a jetstream event

| Property   | Type                            | Description                                |
|------------|---------------------------------|--------------------------------------------|
| rev        | string                          | rev                                        |
| operation  | string                          | 'create', 'delete', 'update'               |
| collection | JetstreamCollectionType         | Collection that the commit is operating on |
| reky       | string                          | rkey of the commit item                    |
| cid        | string                          | Cid of the commit item                     |
| record?    | JetstreamRecord, NewSkeetRecord | Record Data                                |

### JetstreamEventIdentity extends JetstreamEvent

An event with the identity property, kind = 'identity'

| Property | Type              | Description                      |
|----------|-------------------|----------------------------------|
| identity | JetstreamIdentity | The identity data from the event |

### JetstreamIdentity

The identity data in a jetstream event

| Property | Type   | Description            |
|----------|--------|------------------------|
| did      | string | did of the identity    |
| handle   | string | handle of the identity |
| seq      | number | sequence number        |
| time     | string | time of event          |

### JetstreamEventAccount extends JetstreamEvent

An event with the account property, kind = 'account'

| Property | Type             | Description                     |
|----------|------------------|---------------------------------|
| account  | JetstreamAccount | The account data from the event |

### JetstreamAccount

The account data in a jetstream event

| Property | Type    | Description                          |
|----------|---------|--------------------------------------|
| did      | string  | did of the identity                  |
| active   | boolean | whether the account is active or not |
| seq      | number  | sequence number                      |
| time     | string  | time of event                        |

### JetstreamAspectRatio

Defines the ratio of width to height for an element in numeric terms

| Property | Type   | Description            |
|----------|--------|------------------------|
| width    | number | Width of the element.  |
| height   | number | Height of the element. |

### JetstreamRef

A reference object that points to a certain link.

| Property | Type   | Description             |
|----------|--------|-------------------------|
| $link    | string | The URL reference link. |

### JetstreamSubject

Represents a unique subject entity in the system.

| Property | Type   | Description                           |
|----------|--------|---------------------------------------|
| cid      | string | The unique identifier of the subject. |
| uri      | string | The URI of the subject.               |

### JetstreamImage

Represents an image resource.

| Property | Type         | Description                               |
|----------|--------------|-------------------------------------------|
| $type    | string       | Specifies the type of the object.         |
| ref      | JetstreamRef | A reference to where the image is stored. |
| mimeType | string       | The MIME type of the image.               |
| size     | number       | The size of the image file.               |

### JetstreamExternal

Describes an external resource with an optional thumbnail image.

| Property    | Type           | Description                                |
|-------------|----------------|--------------------------------------------|
| description | string         | Description of the external resource.      |
| thumb       | JetstreamImage | Thumbnail image for the external resource. |
| title       | string         | The title of the external resource.        |
| uri         | string         | The external resource URI.                 |

### JetstreamFeature

A certain feature, parameters are left generic for flexibility.

| Property | Type   | Description                               |
|----------|--------|-------------------------------------------|
| $type    | string | Specifies the type of the feature.        |
| uri      | string | JetstreamFeature reference or source URI. |

### JetstreamIndex

Represents a byte range.

| Property  | Type   | Description              |
|-----------|--------|--------------------------|
| byteStart | number | Start of the byte range. |
| byteEnd   | number | End of the byte range.   |

### JetstreamFacet

Contains information on features and their indexes.

| Property | Type               | Description                                      |
|----------|--------------------|--------------------------------------------------|
| features | JetstreamFeature[] | Array of features.                               |
| index    | JetstreamIndex     | JetstreamIndex object representing a byte range. |

### JetstreamImageEmbed

Represents embedded image data.

| Property    | Type                 | Description                   |
|-------------|----------------------|-------------------------------|
| alt         | string               | Alternate text for the image. |
| aspectRatio | JetstreamAspectRatio | Aspect ratio of the image.    |
| image       | JetstreamImage       | The image object.             |

### JetstreamReply

Defines a reply with references to its parent and root subjects.

| Property | Type             | Description                           |
|----------|------------------|---------------------------------------|
| parent   | JetstreamSubject | Reference to the parent of the reply. |
| root     | JetstreamSubject | Reference to the root of the reply.   |

### JetstreamRecord

A generic record with timestamps and associated subject.

| Property  | Type                      | Description                                              |
|-----------|---------------------------|----------------------------------------------------------|
| $type     | string                    | The type of the record.                                  |
| createdAt | string                    | The creation timestamp of the record.                    |
| subject?  | JetstreamSubject / string | The associated subject of the record. Or DID as a string |
| reply?    | JetstreamReply / string   | The associated reply of the record                       |

### NewSkeetRecord

The Record object in an event commit when a skeet is created

| Property  | Type                      | Description         |
|-----------|---------------------------|---------------------|
| $type     | JetstreamCollectionType   | collection type     |
| createdAt | string                    | time of creation    |
| text      | string                    | sequence number     |
| embed?    | object                    | embeded image data  |
| facets?   | JetstreamFacet[]          | array of facet data |
| langs?    | string[]                  | array of langs      |
| subject?  | JetstreamSubject / string | Subject of commit   |
| reply?    | JetstreamReply            | reply of commit     |

