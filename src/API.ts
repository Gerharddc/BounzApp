/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CourtMembershipRequestInput = {
  courtId: string,
  memberId: string,
  ownerId: string,
};

export type BounzInput = {
  bounzerId: string,
  postId: string,
};

export type CreateCommentInput = {
  comment: string,
  commentorId: string,
  postId: string,
};

export type CreateMessageInput = {
  message: string,
  messengerId: string,
  threadId: string,
};

export type CreateContentReportInput = {
  contentId: string,
  contentType: string,
  description: string,
  title: string,
};

export type CreateCourtInfoInput = {
  color: string,
  description: string,
  image: S3ObjectInput,
  name: string,
  ownerId: string,
  restricted: string,
};

export type S3ObjectInput = {
  bucket: string,
  key: string,
  region: string,
};

export type FollowerInput = {
  followeeId: string,
  followerId: string,
};

export type CreatePostInput = {
  caption: string,
  courtId?: string | null,
  creatorId: string,
  image: S3ObjectInput,
};

export type CreateReceivedPostInput = {
  receiverId: string,
  postId: string,
  receivedDate: string,
};

export type CreateUserInfoInput = {
  userId: string,
  username: string,
};

export type CreateInviteInput = {
  eventId: string,
  inviteeId?: string | null,
  inviteeName: string,
  inviteeSurname: string,
  attendanceLimit: number,
};

export type CreateInviteResponseInput = {
  inviteId: string,
  responseType: string,
  attendanceCount: number,
  comment: string,
};

export type CreateEventInput = {
  title: string,
  type: string,
  description: string,
  location: string,
  ownerId: string,
  date: string,
  rsvpDate: string,
};

export type DeleteCommentInput = {
  commentDate: string,
  postId: string,
  commentorId?: string | null,
};

export type DeleteMessageInput = {
  messageDate: string,
  threadId: string,
  messengerId?: string | null,
};

export type DeleteReceivedPostInput = {
  receiverId: string,
  receivedDate: string,
};

export type DeleteSentPostInput = {
  creatorId: string,
  postedDate: string,
};

export type DeleteUserInfoInput = {
  userId: string,
};

export type IncrementCourtPropInput = {
  count: number,
  courtId: string,
};

export type IncrementSentPostPropInput = {
  count: number,
  creatorId: string,
  postedDate: string,
};

export type IncrementUserPropInput = {
  count: number,
  userId: string,
};

export type CourtMemberInput = {
  courtId: string,
  memberId: string,
};

export type UpdateCourtInfoInput = {
  courtId: string,
  description?: string | null,
  color?: string | null,
  name?: string | null,
  restricted?: boolean | null,
};

export type UpdateProfilePicInput = {
  userId: string,
  image: S3ObjectInput,
};

export type UpdateUserInfoInput = {
  bio?: string | null,
  userId: string,
  location?: string | null,
};

export type UpdateCourtPicInput = {
  ownerId: string,
  courtId: string,
  image: S3ObjectInput,
};

export type UpdateUsernameInput = {
  userId: string,
  username: string,
};

export type UpdateUserRealNameInput = {
  userId: string,
  name: string,
  family_name: string,
};

export type AttachBountyToPostInput = {
  creatorId: string,
  postedDate: string,
  bounty: number,
};

export type DeleteContentReportInput = {
  contentId: string,
  reporterId: string,
};

export type GetBlockedUserQueryVariables = {
  blockeeId: string,
  blockerId: string,
};

export type GetBlockedUserQuery = {
  getBlockedUser:  {
    blocked: boolean,
    blockeeId: string,
    blockerId: string,
  } | null,
};

export type GetBounzQueryVariables = {
  bounzerId: string,
  postId: string,
};

export type GetBounzQuery = {
  getBounz:  {
    bounzedDate: string,
    bounzerId: string,
    postId: string,
  } | null,
};

export type GetCourtInfoQueryVariables = {
  courtId: string,
};

export type GetCourtInfoQuery = {
  getCourtInfo:  {
    color: string,
    courtId: string,
    description: string,
    imageRev: number,
    memberCount: number,
    name: string,
    ownerId: string,
    postCount: number,
    restricted: boolean,
    verified: boolean,
  } | null,
};

export type GetCourtMemberQueryVariables = {
  courtId: string,
  memberId: string,
};

export type GetCourtMemberQuery = {
  getCourtMember:  {
    courtId: string,
    memberId: string,
  } | null,
};

export type GetCourtMembershipRequestQueryVariables = {
  courtId: string,
  memberId: string,
};

export type GetCourtMembershipRequestQuery = {
  getCourtMembershipRequest:  {
    courtId: string,
    memberId: string,
    ownerId: string,
  } | null,
};

export type GetEventInfoQueryVariables = {
  eventId: string,
};

export type GetEventInfoQuery = {
  getEventInfo:  {
    eventId: string,
    title: string,
    type: string,
    description: string,
    location: string,
    ownerId: string,
    date: string,
    rsvpDate: string,
  } | null,
};

export type GetInviteResponseInfoQueryVariables = {
  responseId: string,
};

export type GetInviteResponseInfoQuery = {
  getInviteResponseInfo:  {
    responseId: string,
    inviteId: string,
    responseType: string,
    attendanceCount: number,
    comment: string,
  } | null,
};

export type GetFollowerQueryVariables = {
  followeeId: string,
  followerId: string,
};

export type GetFollowerQuery = {
  getFollower:  {
    followeeId: string,
    followerId: string,
  } | null,
};

export type GetInviteInfoQueryVariables = {
  inviteId: string,
};

export type GetInviteInfoQuery = {
  getInviteInfo:  {
    event:  {
      eventId: string,
      title: string,
      type: string,
      description: string,
      location: string,
      ownerId: string,
      date: string,
      rsvpDate: string,
    },
    invite:  {
      inviteId: string,
      eventId: string,
      inviteeId: string | null,
      inviteeName: string,
      inviteeSurname: string,
      attendanceLimit: number,
    },
  } | null,
};

export type GetSentPostQueryVariables = {
  creatorId: string,
  postedDate: string,
};

export type GetSentPostQuery = {
  getSentPost:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type GetUserInfoQueryVariables = {
  userId: string,
};

export type GetUserInfoQuery = {
  getUserInfo:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type GetCommentQueryVariables = {
  postId: string,
  commentDate: string,
};

export type GetCommentQuery = {
  getComment:  {
    comment: string,
    commentDate: string,
    commentorId: string,
    postId: string,
  } | null,
};

export type GetMessageQueryVariables = {
  threadId: string,
  messageDate: string,
};

export type GetMessageQuery = {
  getMessage:  {
    message: string,
    messageDate: string,
    messengerId: string,
    threadId: string,
  } | null,
};

export type GetUserIdQueryVariables = {
  username: string,
};

export type GetUserIdQuery = {
  getUserId:  {
    userId: string,
    username: string,
    name: string | null,
    profilePicRev: number | null,
  } | null,
};

export type GetUserBountyQueryVariables = {
  userId: string,
};

export type GetUserBountyQuery = {
  getUserBounty:  {
    bounty: number | null,
    userId: string,
  } | null,
};

export type GetIgnoredCourtQueryVariables = {
  ignorerId: string,
  courtId: string,
};

export type GetIgnoredCourtQuery = {
  getIgnoredCourt:  {
    ignorerId: string,
    courtId: string,
  } | null,
};

export type GetUserRealNameQueryVariables = {
  userId: string,
};

export type GetUserRealNameQuery = {
  getUserRealName: string | null,
};

export type GetUserRealName2QueryVariables = {
  userId: string,
};

export type GetUserRealName2Query = {
  getUserRealName2:  {
    name: string | null,
    surname: string | null,
  } | null,
};

export type ListCourtInfosQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCourtInfosQuery = {
  listCourtInfos:  {
    items:  Array< {
      color: string,
      courtId: string,
      description: string,
      imageRev: number,
      memberCount: number,
      name: string,
      ownerId: string,
      postCount: number,
      restricted: boolean,
      verified: boolean,
    } > | null,
    nextToken: string | null,
  } | null,
};

export type ListCourtMembersQueryVariables = {
  courtId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCourtMembersQuery = {
  listCourtMembers:  {
    items:  Array< {
      courtId: string,
      memberId: string,
    } > | null,
    nextToken: string | null,
  } | null,
};

export type ListCourtMembershipRequestsQueryVariables = {
  ownerId: string,
};

export type ListCourtMembershipRequestsQuery = {
  listCourtMembershipRequests:  {
    items:  Array< {
      courtId: string,
      memberId: string,
    } > | null,
    nextToken: string | null,
  } | null,
};

export type ListCourtPostsQueryVariables = {
  courtId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCourtPostsQuery = {
  listCourtPosts:  {
    items:  Array< {
      aspectRatio: number,
      bounzes: number | null,
      caption: string,
      courtId: string | null,
      creatorId: string,
      postedDate: string,
      receipts: number | null,
      vibrantColor: string,
      bounty: number | null,
    } >,
    nextToken: string | null,
  } | null,
};

export type ListEventResponsesQueryVariables = {
  eventId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEventResponsesQuery = {
  listEventResponses:  {
    items:  Array< {
      response:  {
        responseId: string,
        inviteId: string,
        responseType: string,
        attendanceCount: number,
        comment: string,
      } | null,
      invite:  {
        inviteId: string,
        eventId: string,
        inviteeId: string | null,
        inviteeName: string,
        inviteeSurname: string,
        attendanceLimit: number,
      },
    } >,
    nextToken: string | null,
  } | null,
};

export type ListFollowersQueryVariables = {
  followeeId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFollowersQuery = {
  listFollowers:  {
    items:  Array< {
      followeeId: string,
      followerId: string,
    } >,
    nextToken: string | null,
  } | null,
};

export type ListFollowingQueryVariables = {
  followerId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFollowingQuery = {
  listFollowing:  {
    items:  Array< {
      followeeId: string,
      followerId: string,
    } >,
    nextToken: string | null,
  } | null,
};

export type ListMemberCourtsQueryVariables = {
  limit?: number | null,
  memberId: string,
  nextToken?: string | null,
};

export type ListMemberCourtsQuery = {
  listMemberCourts:  {
    items:  Array< {
      courtId: string,
      memberId: string,
    } > | null,
    nextToken: string | null,
  } | null,
};

export type ListOwnerCourtsQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
  ownerId: string,
};

export type ListOwnerCourtsQuery = {
  listOwnerCourts:  {
    items:  Array< {
      courtId: string,
      ownerId: string,
    } > | null,
    nextToken: string | null,
  } | null,
};

export type ListPostCommentsQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
  postId: string,
};

export type ListPostCommentsQuery = {
  listPostComments:  {
    items:  Array< {
      comment: string,
      commentDate: string,
      commentorId: string,
      postId: string,
    } >,
    nextToken: string | null,
  } | null,
};

export type ListThreadMessagesQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
  threadId: string,
};

export type ListThreadMessagesQuery = {
  listThreadMessages:  {
    items:  Array< {
      message: string,
      messageDate: string,
      messengerId: string,
      threadId: string,
    } >,
    nextToken: string | null,
  } | null,
};

export type ListPostBounzesQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
  postId: string,
};

export type ListPostBounzesQuery = {
  listPostBounzes:  {
    items:  Array< {
      bounzedDate: string,
      bounzerId: string,
      postId: string,
    } >,
    nextToken: string | null,
  } | null,
};

export type ListUserBounzesQueryVariables = {
  bounzerId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserBounzesQuery = {
  listUserBounzes:  {
    items:  Array< {
      bounzedDate: string,
      bounzerId: string,
      postId: string,
    } >,
    nextToken: string | null,
  } | null,
};

export type ListUserEventsQueryVariables = {
  ownerId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserEventsQuery = {
  listUserEvents:  {
    items:  Array< {
      eventId: string,
      title: string,
      type: string,
      description: string,
      location: string,
      ownerId: string,
      date: string,
      rsvpDate: string,
    } >,
    nextToken: string | null,
  } | null,
};

export type ListUserInvitedEventsQueryVariables = {
  inviteeId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserInvitedEventsQuery = {
  listUserInvitedEvents:  {
    items:  Array< {
      response:  {
        responseId: string,
        inviteId: string,
        responseType: string,
        attendanceCount: number,
        comment: string,
      } | null,
      event:  {
        eventId: string,
        title: string,
        type: string,
        description: string,
        location: string,
        ownerId: string,
        date: string,
        rsvpDate: string,
      },
      invite:  {
        inviteId: string,
        eventId: string,
        inviteeId: string | null,
        inviteeName: string,
        inviteeSurname: string,
        attendanceLimit: number,
      },
    } >,
    nextToken: string | null,
  } | null,
};

export type ListUserReceivedPostsQueryVariables = {
  receiverId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserReceivedPostsQuery = {
  listUserReceivedPosts:  {
    items:  Array< {
      receiverId: string,
      postId: string,
      receivedDate: string,
    } >,
    nextToken: string | null,
  } | null,
};

export type ListUserSentPostsQueryVariables = {
  creatorId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserSentPostsQuery = {
  listUserSentPosts:  {
    items:  Array< {
      aspectRatio: number,
      bounzes: number | null,
      caption: string,
      courtId: string | null,
      creatorId: string,
      postedDate: string,
      receipts: number | null,
      vibrantColor: string,
      bounty: number | null,
    } >,
    nextToken: string | null,
  } | null,
};

export type ListUserThreadsQueryVariables = {
  userId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserThreadsQuery = {
  listUserThreads:  {
    items:  Array< {
      threadId: string,
      userId: string,
      latestMessageDate: string,
    } > | null,
    nextToken: string | null,
  } | null,
};

export type SearchUsersQueryVariables = {
  searchTerm: string,
};

export type SearchUsersQuery = {
  searchUsers:  Array< {
    userId: string,
    username: string,
    name: string | null,
    profilePicRev: number | null,
  } > | null,
};

export type SearchCourtsQueryVariables = {
  searchTerm: string,
};

export type SearchCourtsQuery = {
  searchCourts:  Array< {
    courtId: string,
    name: string,
  } > | null,
};

export type ListContentReportsQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
};

export type ListContentReportsQuery = {
  listContentReports:  {
    items:  Array< {
      contentId: string,
      contentType: string,
      description: string,
      reportedDate: string,
      reporterId: string,
      title: string,
    } > | null,
    nextToken: string | null,
  } | null,
};

export type AcceptCourtMembershipRequestMutationVariables = {
  input: CourtMembershipRequestInput,
};

export type AcceptCourtMembershipRequestMutation = {
  acceptCourtMembershipRequest:  {
    courtId: string,
    memberId: string,
  } | null,
};

export type BlockUserMutationVariables = {
  blockeeId: string,
  blockerId: string,
};

export type BlockUserMutation = {
  blockUser:  {
    blocked: boolean,
    blockeeId: string,
    blockerId: string,
  } | null,
};

export type CreateBounzMutationVariables = {
  input: BounzInput,
};

export type CreateBounzMutation = {
  createBounz:  {
    bounzedDate: string,
    bounzerId: string,
    postId: string,
  } | null,
};

export type CreateCommentMutationVariables = {
  input: CreateCommentInput,
};

export type CreateCommentMutation = {
  createComment:  {
    comment: string,
    commentDate: string,
    commentorId: string,
    postId: string,
  } | null,
};

export type CreateMessageMutationVariables = {
  input: CreateMessageInput,
};

export type CreateMessageMutation = {
  createMessage:  {
    message: string,
    messageDate: string,
    messengerId: string,
    threadId: string,
  } | null,
};

export type CreateContentReportMutationVariables = {
  input: CreateContentReportInput,
};

export type CreateContentReportMutation = {
  createContentReport:  {
    contentId: string,
    contentType: string,
    description: string,
    reportedDate: string,
    reporterId: string,
    title: string,
  } | null,
};

export type CreateCourtMutationVariables = {
  input: CreateCourtInfoInput,
};

export type CreateCourtMutation = {
  createCourt:  {
    color: string,
    courtId: string,
    description: string,
    imageRev: number,
    memberCount: number,
    name: string,
    ownerId: string,
    postCount: number,
    restricted: boolean,
    verified: boolean,
  } | null,
};

export type CreateFollowerMutationVariables = {
  input: FollowerInput,
};

export type CreateFollowerMutation = {
  createFollower:  {
    followeeId: string,
    followerId: string,
  } | null,
};

export type CreatePostMutationVariables = {
  input: CreatePostInput,
};

export type CreatePostMutation = {
  createPost:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type CreateReceivedPostMutationVariables = {
  input: CreateReceivedPostInput,
};

export type CreateReceivedPostMutation = {
  createReceivedPost:  {
    receiverId: string,
    postId: string,
    receivedDate: string,
  } | null,
};

export type CreateUserInfoMutationVariables = {
  input: CreateUserInfoInput,
};

export type CreateUserInfoMutation = {
  createUserInfo:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type CreateInviteMutationVariables = {
  input: CreateInviteInput,
};

export type CreateInviteMutation = {
  createInvite:  {
    inviteId: string,
    eventId: string,
    inviteeId: string | null,
    inviteeName: string,
    inviteeSurname: string,
    attendanceLimit: number,
  } | null,
};

export type CreateInviteResponseMutationVariables = {
  input: CreateInviteResponseInput,
};

export type CreateInviteResponseMutation = {
  createInviteResponse:  {
    responseId: string,
    inviteId: string,
    responseType: string,
    attendanceCount: number,
    comment: string,
  } | null,
};

export type CreateEventMutationVariables = {
  input: CreateEventInput,
};

export type CreateEventMutation = {
  createEvent:  {
    eventId: string,
    title: string,
    type: string,
    description: string,
    location: string,
    ownerId: string,
    date: string,
    rsvpDate: string,
  } | null,
};

export type DeclineCourtMembershipRequestMutationVariables = {
  input: CourtMembershipRequestInput,
};

export type DeclineCourtMembershipRequestMutation = {
  declineCourtMembershipRequest:  {
    courtId: string,
    memberId: string,
    ownerId: string,
  } | null,
};

export type DeleteBounzMutationVariables = {
  input: BounzInput,
};

export type DeleteBounzMutation = {
  deleteBounz:  {
    bounzedDate: string,
    bounzerId: string,
    postId: string,
  } | null,
};

export type DeleteCommentMutationVariables = {
  input: DeleteCommentInput,
};

export type DeleteCommentMutation = {
  deleteComment:  {
    comment: string,
    commentDate: string,
    commentorId: string,
    postId: string,
  } | null,
};

export type DeleteMessageMutationVariables = {
  input: DeleteMessageInput,
};

export type DeleteMessageMutation = {
  deleteMessage:  {
    message: string,
    messageDate: string,
    messengerId: string,
    threadId: string,
  } | null,
};

export type DeleteCourtMutationVariables = {
  courtId: string,
};

export type DeleteCourtMutation = {
  deleteCourt:  {
    color: string,
    courtId: string,
    description: string,
    imageRev: number,
    memberCount: number,
    name: string,
    ownerId: string,
    postCount: number,
    restricted: boolean,
    verified: boolean,
  } | null,
};

export type DeleteEventMutationVariables = {
  eventId: string,
};

export type DeleteEventMutation = {
  deleteEvent:  {
    eventId: string,
    title: string,
    type: string,
    description: string,
    location: string,
    ownerId: string,
    date: string,
    rsvpDate: string,
  } | null,
};

export type DeleteFollowerMutationVariables = {
  input: FollowerInput,
};

export type DeleteFollowerMutation = {
  deleteFollower:  {
    followeeId: string,
    followerId: string,
  } | null,
};

export type DeleteInviteMutationVariables = {
  inviteId: string,
};

export type DeleteInviteMutation = {
  deleteInvite:  {
    inviteId: string,
    eventId: string,
    inviteeId: string | null,
    inviteeName: string,
    inviteeSurname: string,
    attendanceLimit: number,
  } | null,
};

export type DeleteReceivedPostMutationVariables = {
  input: DeleteReceivedPostInput,
};

export type DeleteReceivedPostMutation = {
  deleteReceivedPost:  {
    receiverId: string,
    postId: string,
    receivedDate: string,
  } | null,
};

export type DeleteSentPostMutationVariables = {
  input: DeleteSentPostInput,
};

export type DeleteSentPostMutation = {
  deleteSentPost:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type DeleteUserInfoMutationVariables = {
  input: DeleteUserInfoInput,
};

export type DeleteUserInfoMutation = {
  deleteUserInfo:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type IncrementCourtMembersMutationVariables = {
  input: IncrementCourtPropInput,
};

export type IncrementCourtMembersMutation = {
  incrementCourtMembers:  {
    color: string,
    courtId: string,
    description: string,
    imageRev: number,
    memberCount: number,
    name: string,
    ownerId: string,
    postCount: number,
    restricted: boolean,
    verified: boolean,
  } | null,
};

export type IncrementCourtPostCountMutationVariables = {
  input: IncrementCourtPropInput,
};

export type IncrementCourtPostCountMutation = {
  incrementCourtPostCount:  {
    color: string,
    courtId: string,
    description: string,
    imageRev: number,
    memberCount: number,
    name: string,
    ownerId: string,
    postCount: number,
    restricted: boolean,
    verified: boolean,
  } | null,
};

export type IncrementSentPostBounzesMutationVariables = {
  input: IncrementSentPostPropInput,
};

export type IncrementSentPostBounzesMutation = {
  incrementSentPostBounzes:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type IncrementSentPostReceiptsMutationVariables = {
  input: IncrementSentPostPropInput,
};

export type IncrementSentPostReceiptsMutation = {
  incrementSentPostReceipts:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type IncrementSentPostBountyMutationVariables = {
  input: IncrementSentPostPropInput,
};

export type IncrementSentPostBountyMutation = {
  incrementSentPostBounty:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type IncrementUserBounzesMadeMutationVariables = {
  input: IncrementUserPropInput,
};

export type IncrementUserBounzesMadeMutation = {
  incrementUserBounzesMade:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type IncrementUserBounzesReceivedMutationVariables = {
  input: IncrementUserPropInput,
};

export type IncrementUserBounzesReceivedMutation = {
  incrementUserBounzesReceived:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type IncrementUserFollowersCountMutationVariables = {
  input: IncrementUserPropInput,
};

export type IncrementUserFollowersCountMutation = {
  incrementUserFollowersCount:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type IncrementUserFollowingCountMutationVariables = {
  input: IncrementUserPropInput,
};

export type IncrementUserFollowingCountMutation = {
  incrementUserFollowingCount:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type IncrementUserPostCountMutationVariables = {
  input: IncrementUserPropInput,
};

export type IncrementUserPostCountMutation = {
  incrementUserPostCount:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type IncrementCourtsJoinedMutationVariables = {
  input: IncrementUserPropInput,
};

export type IncrementCourtsJoinedMutation = {
  incrementCourtsJoined:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type IncrementCourtsOwnedMutationVariables = {
  input: IncrementUserPropInput,
};

export type IncrementCourtsOwnedMutation = {
  incrementCourtsOwned:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type IncrementUserReceiptsMutationVariables = {
  input: IncrementUserPropInput,
};

export type IncrementUserReceiptsMutation = {
  incrementUserReceipts:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type IncrementUserBountyMutationVariables = {
  input: IncrementUserPropInput,
};

export type IncrementUserBountyMutation = {
  incrementUserBounty:  {
    bounty: number | null,
    userId: string,
  } | null,
};

export type JoinCourtMutationVariables = {
  input: CourtMemberInput,
};

export type JoinCourtMutation = {
  joinCourt:  {
    courtId: string,
    memberId: string,
  } | null,
};

export type LeaveCourtMutationVariables = {
  input: CourtMemberInput,
};

export type LeaveCourtMutation = {
  leaveCourt:  {
    courtId: string,
    memberId: string,
  } | null,
};

export type RequestToJoinCourtMutationVariables = {
  input: CourtMemberInput,
};

export type RequestToJoinCourtMutation = {
  requestToJoinCourt:  {
    courtId: string,
    memberId: string,
    ownerId: string,
  } | null,
};

export type UnblockUserMutationVariables = {
  blockeeId: string,
  blockerId: string,
};

export type UnblockUserMutation = {
  unblockUser:  {
    blocked: boolean,
    blockeeId: string,
    blockerId: string,
  } | null,
};

export type UpdateCourtInfoMutationVariables = {
  input: UpdateCourtInfoInput,
};

export type UpdateCourtInfoMutation = {
  updateCourtInfo:  {
    color: string,
    courtId: string,
    description: string,
    imageRev: number,
    memberCount: number,
    name: string,
    ownerId: string,
    postCount: number,
    restricted: boolean,
    verified: boolean,
  } | null,
};

export type UpdateInviteeIdMutationVariables = {
  inviteId: string,
  inviteeId: string,
};

export type UpdateInviteeIdMutation = {
  updateInviteeId:  {
    inviteId: string,
    eventId: string,
    inviteeId: string | null,
    inviteeName: string,
    inviteeSurname: string,
    attendanceLimit: number,
  } | null,
};

export type UpdateProfilePicMutationVariables = {
  input: UpdateProfilePicInput,
};

export type UpdateProfilePicMutation = {
  updateProfilePic:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type UpdateUserInfoMutationVariables = {
  input: UpdateUserInfoInput,
};

export type UpdateUserInfoMutation = {
  updateUserInfo:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type UpdateCourtPicMutationVariables = {
  input: UpdateCourtPicInput,
};

export type UpdateCourtPicMutation = {
  updateCourtPic:  {
    color: string,
    courtId: string,
    description: string,
    imageRev: number,
    memberCount: number,
    name: string,
    ownerId: string,
    postCount: number,
    restricted: boolean,
    verified: boolean,
  } | null,
};

export type UpdateUsernameMutationVariables = {
  input: UpdateUsernameInput,
};

export type UpdateUsernameMutation = {
  updateUsername:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type UpdateUserRealNameMutationVariables = {
  input: UpdateUserRealNameInput,
};

export type UpdateUserRealNameMutation = {
  updateUserRealName: string | null,
};

export type IgnoreCourtMutationVariables = {
  ignorerId: string,
  courtId: string,
};

export type IgnoreCourtMutation = {
  ignoreCourt:  {
    ignorerId: string,
    courtId: string,
  } | null,
};

export type UnignoreCourtMutationVariables = {
  ignorerId: string,
  courtId: string,
};

export type UnignoreCourtMutation = {
  unignoreCourt:  {
    ignorerId: string,
    courtId: string,
  } | null,
};

export type AttachBountyToPostMutationVariables = {
  input?: AttachBountyToPostInput | null,
};

export type AttachBountyToPostMutation = {
  attachBountyToPost:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type AdminDeleteContentReportMutationVariables = {
  input: DeleteContentReportInput,
};

export type AdminDeleteContentReportMutation = {
  adminDeleteContentReport:  {
    contentId: string,
    contentType: string,
    description: string,
    reportedDate: string,
    reporterId: string,
    title: string,
  } | null,
};

export type AdminDeleteSentPostMutationVariables = {
  input: DeleteSentPostInput,
};

export type AdminDeleteSentPostMutation = {
  adminDeleteSentPost:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type AdminDeleteCommentMutationVariables = {
  input: DeleteCommentInput,
};

export type AdminDeleteCommentMutation = {
  adminDeleteComment:  {
    comment: string,
    commentDate: string,
    commentorId: string,
    postId: string,
  } | null,
};

export type AdminDeleteUserMutationVariables = {
  userId: string,
};

export type AdminDeleteUserMutation = {
  adminDeleteUser:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type AdminDeleteCourtMutationVariables = {
  courtId: string,
};

export type AdminDeleteCourtMutation = {
  adminDeleteCourt:  {
    color: string,
    courtId: string,
    description: string,
    imageRev: number,
    memberCount: number,
    name: string,
    ownerId: string,
    postCount: number,
    restricted: boolean,
    verified: boolean,
  } | null,
};

export type AdminDeleteMessageMutationVariables = {
  input: DeleteMessageInput,
};

export type AdminDeleteMessageMutation = {
  adminDeleteMessage:  {
    message: string,
    messageDate: string,
    messengerId: string,
    threadId: string,
  } | null,
};

export type OnCreateBounzSubscriptionVariables = {
  bounzerId: string,
};

export type OnCreateBounzSubscription = {
  onCreateBounz:  {
    bounzedDate: string,
    bounzerId: string,
    postId: string,
  } | null,
};

export type OnCreateCommentSubscriptionVariables = {
  postId: string,
};

export type OnCreateCommentSubscription = {
  onCreateComment:  {
    comment: string,
    commentDate: string,
    commentorId: string,
    postId: string,
  } | null,
};

export type OnCreateMessageSubscriptionVariables = {
  threadId: string,
};

export type OnCreateMessageSubscription = {
  onCreateMessage:  {
    message: string,
    messageDate: string,
    messengerId: string,
    threadId: string,
  } | null,
};

export type OnCreateReceivedPostSubscriptionVariables = {
  receiverId: string,
};

export type OnCreateReceivedPostSubscription = {
  onCreateReceivedPost:  {
    receiverId: string,
    postId: string,
    receivedDate: string,
  } | null,
};

export type OnCreateSentPostSubscriptionVariables = {
  creatorId: string,
};

export type OnCreateSentPostSubscription = {
  onCreateSentPost:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type OnDeleteBounzSubscriptionVariables = {
  bounzerId: string,
};

export type OnDeleteBounzSubscription = {
  onDeleteBounz:  {
    bounzedDate: string,
    bounzerId: string,
    postId: string,
  } | null,
};

export type OnCreateCourtMembershipRequestSubscriptionVariables = {
  ownerId: string,
};

export type OnCreateCourtMembershipRequestSubscription = {
  onCreateCourtMembershipRequest:  {
    courtId: string,
    memberId: string,
    ownerId: string,
  } | null,
};

export type OnDeleteCommentSubscriptionVariables = {
  postId: string,
};

export type OnDeleteCommentSubscription = {
  onDeleteComment:  {
    comment: string,
    commentDate: string,
    commentorId: string,
    postId: string,
  } | null,
};

export type OnDeleteMessageSubscriptionVariables = {
  threadId: string,
};

export type OnDeleteMessageSubscription = {
  onDeleteMessage:  {
    message: string,
    messageDate: string,
    messengerId: string,
    threadId: string,
  } | null,
};

export type OnDeleteReceivedPostSubscriptionVariables = {
  receiverId: string,
};

export type OnDeleteReceivedPostSubscription = {
  onDeleteReceivedPost:  {
    receiverId: string,
    postId: string,
    receivedDate: string,
  } | null,
};

export type OnDeleteSentPostSubscriptionVariables = {
  creatorId: string,
};

export type OnDeleteSentPostSubscription = {
  onDeleteSentPost:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type OnDeleteUserInfoSubscriptionVariables = {
  userId: string,
};

export type OnDeleteUserInfoSubscription = {
  onDeleteUserInfo:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type OnUpdateBlockedUserSubscriptionVariables = {
  blockeeId: string,
  blockerId: string,
};

export type OnUpdateBlockedUserSubscription = {
  onUpdateBlockedUser:  {
    blocked: boolean,
    blockeeId: string,
    blockerId: string,
  } | null,
};

export type OnUpdateSentPostSubscriptionVariables = {
  creatorId: string,
  postedDate: string,
};

export type OnUpdateSentPostSubscription = {
  onUpdateSentPost:  {
    aspectRatio: number,
    bounzes: number | null,
    caption: string,
    courtId: string | null,
    creatorId: string,
    postedDate: string,
    receipts: number | null,
    vibrantColor: string,
    bounty: number | null,
  } | null,
};

export type OnUpdateUserInfoSubscriptionVariables = {
  userId: string,
};

export type OnUpdateUserInfoSubscription = {
  onUpdateUserInfo:  {
    bio: string,
    bounzesMade: number,
    bounzesReceived: number,
    followersCount: number,
    followingCount: number,
    userId: string,
    location: string,
    postCount: number,
    profilePicRev: number,
    receipts: number,
    username: string,
    courtsJoined: number,
    courtsOwned: number,
  } | null,
};

export type OnUpdateCourtInfoSubscriptionVariables = {
  courtId: string,
};

export type OnUpdateCourtInfoSubscription = {
  onUpdateCourtInfo:  {
    color: string,
    courtId: string,
    description: string,
    imageRev: number,
    memberCount: number,
    name: string,
    ownerId: string,
    postCount: number,
    restricted: boolean,
    verified: boolean,
  } | null,
};
