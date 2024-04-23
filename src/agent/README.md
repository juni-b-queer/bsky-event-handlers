# Handler Agent

This is the class/object that our bluesky agent will be created and acted upon from. 
It contains a ton of functions to interact with bluesky, and a number of helper functions for interacting with Jetstream Messages

- Class Properties: private variables like did, session, agent, agentName, handle, and password.
- Class Constructor: Initializes the HandlerAgent class. It set ups the BskyAgent and session details.
- Methods for Initialization and Authentication: `initializeBskyAgent` and `authenticate` set up and authenticate the agent respectively.
- Methods for Follower Interactions: `getFollows`, `getFollowers`, `isFollowing`, `isFollowedBy`, `followUser`, and `unfollowUser` help in managing follower relationships.
- Methods for Posting Interactions: `post`, `createSkeet`, `deleteSkeet`, `likeSkeet`, `unlikeSkeet`, `reskeetSkeet`, `unreskeetSkeet` are used for creating, deleting, liking and reposting skeets.
- Helper Functions: Functions like `getDIDFromUri`, `generateReplyFromMessage`, `extractDIDsFromProfiles`, `getRecordForDid`, as well as others related to post helpers and getters and setters to fetch or manipulate properties of objects.
- Getters and Setters: Getter and setter methods for manipulating the private variables.

## Usage
To initialize the Handler agent, pass in a name, the handle, and the App password you'll use to authenticate with the Bsky service
```typescript
const myBotHandlerAgent = new HandlerAgent('my-bot', 'Handle.bsky.social', 'AppPassword');
```