export class Conversation {

  constructor(
    public messages: Array<{}>,
    public otherUser: {
      userId?: string,
      username: string,
      profilePicture: {
        name: string,
        uploaded: boolean,
        userId: string
      }},
    public user1: string,
    public user2: string,
    public _id: string,
    public newMessages?: {
      receiver: string,
      count: number
    },
    public lastMsgCount?: number
  ) {}

}
