# Types

## Jetstream Interfaces

### JetstreamMessage

A standard message format that's used as the base for other message types.

| Property   | Type   | Description                                       |
| ---------- | ------ | ------------------------------------------------- |
| did        | string | Identifier for the Distributed IDentifiers (DIDs) |
| seq        | number | Sequence number of the message                    |
| opType     | string | Operation type of the message (c or d)            |
| collection | string | Specific collection that the message belongs to   |
| rkey       | string | Routing key for the message                       |

### CreateMessage extends JetstreamMessage

A message with attached record content aimed at creating a new record.

| Property | Type   | Description                           |
| -------- | ------ | ------------------------------------- |
| record   | Record | The record information to be created. |

### DeleteMessage extends JetstreamMessage

A message intended to delete a certain record.

### CreateSkeetMessage extends CreateMessage

A special type of message used for record creation with the Skeet type.

| Property | Type              | Description                          |
| -------- | ----------------- | ------------------------------------ |
| record   | CreateSkeetRecord | The Skeet record data to be created. |

### AspectRatio

Defines the ratio of width to height for an element in numeric terms

| Property | Type   | Description            |
| -------- | ------ | ---------------------- |
| width    | number | Width of the element.  |
| height   | number | Height of the element. |

### Ref

A reference object that points to a certain link.

| Property | Type   | Description             |
| -------- | ------ | ----------------------- |
| $link    | string | The URL reference link. |

### Subject

Represents a unique subject entity in the system.

| Property | Type   | Description                           |
| -------- | ------ | ------------------------------------- |
| cid      | string | The unique identifier of the subject. |
| uri      | string | The URI of the subject.               |

### Image

Represents an image resource.

| Property | Type   | Description                               |
| -------- | ------ | ----------------------------------------- |
| $type    | string | Specifies the type of the object.         |
| ref      | Ref    | A reference to where the image is stored. |
| mimeType | string | The MIME type of the image.               |
| size     | number | The size of the image file.               |

### External

Describes an external resource with an optional thumbnail image.

| Property    | Type   | Description                                |
| ----------- | ------ | ------------------------------------------ |
| description | string | Description of the external resource.      |
| thumb       | Image  | Thumbnail image for the external resource. |
| title       | string | The title of the external resource.        |
| uri         | string | The external resource URI.                 |

### Feature

A certain feature, parameters are left generic for flexibility.

| Property | Type   | Description                        |
| -------- | ------ | ---------------------------------- |
| $type    | string | Specifies the type of the feature. |
| uri      | string | Feature reference or source URI.   |

### Index

Represents a byte range.

| Property  | Type   | Description              |
| --------- | ------ | ------------------------ |
| byteStart | number | Start of the byte range. |
| byteEnd   | number | End of the byte range.   |

### Facet

Contains information on features and their indexes.

| Property | Type      | Description                             |
| -------- | --------- | --------------------------------------- |
| features | Feature[] | Array of features.                      |
| index    | Index     | Index object representing a byte range. |

### ImageEmbed

Represents embedded image data.

| Property    | Type        | Description                   |
| ----------- | ----------- | ----------------------------- |
| alt         | string      | Alternate text for the image. |
| aspectRatio | AspectRatio | Aspect ratio of the image.    |
| image       | Image       | The image object.             |

### Reply

Defines a reply with references to its parent and root subjects.

| Property | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| parent   | Subject | Reference to the parent of the reply. |
| root     | Subject | Reference to the root of the reply.   |

### Record

A generic record with timestamps and associated subject.

| Property  | Type    | Description                           |
| --------- | ------- | ------------------------------------- |
| $type     | string  | The type of the record.               |
| createdAt | string  | The creation timestamp of the record. |
| subject   | Subject | The associated subject of the record. |

### CreateSkeetRecord extends Record

A specific type of record intended to be created in the system.

| Property | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| embed    | object   | Optional embedded object data. |
| facets   | Facet[]  | Optional array of facets.      |
| langs    | string[] | Optional array of languages.   |
| text     | string   | Optional text data.            |
| reply    | Reply    | Optional reply data.           |
