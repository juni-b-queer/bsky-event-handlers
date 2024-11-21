# Handler Agent

This is the class/object that our Bluesky agent will be created and acted upon from.
It contains numerous functions to interact with Bluesky, along with helper functions for interacting with Jetstream Messages.

### Class Properties
- `agentName`: The name of the agent.
- `handle`: The handle used for authentication.
- `password`: The password used for authentication.
- `did`: (private) Decentralized Identifier for the agent, assigned after authentication.
- `session`: (private) The current session data.
- `agent`: (private) Instance of `BskyAgent`.

### Class Constructor
Initializes the `HandlerAgent` class, setting up the `BskyAgent` and session details.

```typescript
const myBotHandlerAgent = new HandlerAgent(
    'my-bot',
    'Handle.bsky.social',
    'AppPassword'
);
```

### Methods for Initialization and Authentication
- `initializeBskyAgent()`: Initializes the `BskyAgent` with the required service URL and session persistence.
- `authenticate()`: Authenticates the agent using the provided handle and password.

### Methods for Follower Interactions
- `getProfile(did: string)`: Retrieves the profile of the user with the specified DID.
- `getFollows(userDID: string | undefined, cursor: string | undefined, limit: number)`: Retrieves the list of users followed by the specified user.
- `getFollowers(userDID: string | undefined, cursor: string | undefined, limit: number)`: Retrieves the list of followers of the specified user.
- `isFollowing(userDID: string)`: Checks if the current agent is following the specified user.
- `isFollowedBy(userDID: string)`: Checks if the current agent is followed by the specified user.
- `followUser(userDID: string)`: Follows the specified user.
- `unfollowUser(userDID: string)`: Unfollows the specified user.

### Methods for Posting Interactions
- `post(details: Partial<AppBskyFeedPost.Record>)`: Creates a post with the given details.
- `createSkeet(newPostDetails: string, skeetReply: Reply | undefined)`: Creates a skeet (post) with the specified details and optional reply.
- `deleteSkeet(skeetURI: string)`: Deletes the skeet with the given URI.
- `likeSkeet(skeetURI: string, skeetCID: string)`: Likes the skeet with the given URI and CID.
- `unlikeSkeet(skeetURI: string)`: Unlikes the skeet with the given URI.
- `reskeetSkeet(skeetURI: string, skeetCID: string)`: Reskeets (reposts) the skeet with the given URI.
- `unreskeetSkeet(skeetURI: string)`: Unreskeets (deletes repost) for the skeet with the given URI.

### Helper Functions
- `findLikeRecord(skeetURI: string, cursor: string | undefined, attempt: number)`: Finds a record similar to the specified skeet URI.
- `findRepostRecord(skeetURI: string, cursor: string | undefined, attempt: number)`: Finds a repost record for the specified skeet URI.
- `findSpecificRecord(collectionType: string, errorName: string, skeetURI: string, cursor: string | undefined, attempt: number)`: Finds a specific record in the specified collection for the given skeet URI.
- `getDIDFromUri(uri: string)`: Extracts the DID from a URI.
- `postedByAgent(message: JetstreamMessage)`: Checks if a message was posted by the agent.
- `generateURIFromCreateMessage(message: CreateSkeetMessage)`: Generates a URI from a `CreateSkeetMessage`.
- `generateReplyFromMessage(message: CreateSkeetMessage)`: Generates a reply from a `CreateSkeetMessage`.
- `hasPostReply(message: CreateSkeetMessage)`: Checks if a message has a reply.
- `getPostReply(message: CreateSkeetMessage)`: Retrieves the reply from a message.

### Getters and Setters
- `setAgent`: Sets the agent.
- `getAgent`: Retrieves the agent.
- `setAgentName`: Sets the agent name.
- `getAgentName`: Retrieves the agent name.
- `setHandle`: Sets the handle.
- `getHandle`: Retrieves the handle.
- `setPassword`: Sets the password.
- `getPassword`: Retrieves the password.
- `setDid`: Sets the DID.
- `getDid`: Retrieves the DID.
- `setSession`: Sets the session.
- `getSession`: Retrieves the session.