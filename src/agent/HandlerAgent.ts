export class HandlerAgent {

    private did: string;
    private session;

    /**
     *
     */
    constructor(private agentName:string, private handle: string, private password: string) {}

    /**
     *
     */
    initialize(){
        //TODO
    }

    /**
     *
     */
    authenticate(){
        //TODO

    }

    //region Follower Interactions
    /**
     *
     */
    isFollowing(){
        //TODO

    }

    /**
     *
     */
    isFollowedBy(){
        //TODO

    }

    /**
     *
     */
    getFollowers(){
        //TODO

    }

    /**
     *
     */
    getFollowing(){
        //TODO

    }

    /**
     *
     */
    followUser(did){

    }

    /**
     *
     */
    unfollowUser(did){

    }
    //endregion

    //region Post interactions
    /**
     *
     */
    createSkeet(){

    }

    /**
     *
     */
    deleteSkeet(skeet){

    }

    /**
     *
     */
    likeSkeet(skeet){

    }

    /**
     *
     */
    unlikeSkeet(skeet){

    }

    /**
     *
     */
    reskeetSkeet(skeet){

    }

    /**
     *
     */
    unreskeetSkeet(skeet){

    }
    //endregion

    // region class prop getters and setters
    /**
     * Setter for agentName.
     * @param {string} value - The new value for agentName.
     */
    public setAgentName(value: string) {
        this.agentName = value;
    }

    /**
     * Getter for agentName.
     * @return {string} The current value of agentName.
     */
    public getAgentName(): string {
        return this.agentName;
    }

    /**
     * Setter for handle.
     * @param {string} value - The new value for handle.
     */
    public setHandle(value: string) {
        this.handle = value;
    }

    /**
     * Getter for handle.
     * @return {string} The current value of handle.
     */
    public getHandle(): string {
        return this.handle;
    }

    /**
     * Setter for password.
     * @param {string} value - The new value for password.
     */
    public setPassword(value: string) {
        this.password = value;
    }

    /**
     * Getter for password.
     * @return {string} The current value of password.
     */
    public getPassword(): string {
        return this.password;
    }

    /**
     * Setter for did.
     * @param {string} value - The new value for did.
     */
    public setDid(value: string) {
        this.did = value;
    }

    /**
     * Getter for did.
     * @return {string} The current value of did.
     */
    public getDid(): string {
        return this.did;
    }

    /**
     * Setter for session.
     * @param {any} value - The new value for session.
     */
    public setSession(value: any) {
        this.session = value;
    }

    /**
     * Getter for session.
     * @return {any} The current value of session.
     */
    public getSession(): any {
        return this.session;
    }
    //endregion
}