// tslint:disable
// this is an auto generated file. This will be overwritten

export const acceptCourtMembershipRequest = `mutation AcceptCourtMembershipRequest($input: CourtMembershipRequestInput!) {
  acceptCourtMembershipRequest(input: $input) {
    courtId
    memberId
  }
}
`;
export const blockUser = `mutation BlockUser($blockeeId: String!, $blockerId: String!) {
  blockUser(blockeeId: $blockeeId, blockerId: $blockerId) {
    blocked
    blockeeId
    blockerId
  }
}
`;
export const createBounz = `mutation CreateBounz($input: BounzInput!) {
  createBounz(input: $input) {
    bounzedDate
    bounzerId
    postId
  }
}
`;
export const createComment = `mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    comment
    commentDate
    commentorId
    postId
  }
}
`;
export const createMessage = `mutation CreateMessage($input: CreateMessageInput!) {
  createMessage(input: $input) {
    message
    messageDate
    messengerId
    threadId
  }
}
`;
export const createContentReport = `mutation CreateContentReport($input: CreateContentReportInput!) {
  createContentReport(input: $input) {
    contentId
    contentType
    description
    reportedDate
    reporterId
    title
  }
}
`;
export const createCourt = `mutation CreateCourt($input: CreateCourtInfoInput!) {
  createCourt(input: $input) {
    color
    courtId
    description
    imageRev
    memberCount
    name
    ownerId
    postCount
    restricted
    verified
  }
}
`;
export const createFollower = `mutation CreateFollower($input: FollowerInput!) {
  createFollower(input: $input) {
    followeeId
    followerId
  }
}
`;
export const createPost = `mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    aspectRatio
    bounzes
    caption
    courtId
    creatorId
    postedDate
    receipts
    vibrantColor
    bounty
  }
}
`;
export const createReceivedPost = `mutation CreateReceivedPost($input: CreateReceivedPostInput!) {
  createReceivedPost(input: $input) {
    receiverId
    postId
    receivedDate
  }
}
`;
export const createUserInfo = `mutation CreateUserInfo($input: CreateUserInfoInput!) {
  createUserInfo(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const createInvite = `mutation CreateInvite($input: CreateInviteInput!) {
  createInvite(input: $input) {
    inviteId
    eventId
    inviteeId
    inviteeName
    inviteeSurname
    attendanceLimit
  }
}
`;
export const createInviteResponse = `mutation CreateInviteResponse($input: CreateInviteResponseInput!) {
  createInviteResponse(input: $input) {
    responseId
    inviteId
    responseType
    attendanceCount
    comment
  }
}
`;
export const createEvent = `mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    eventId
    title
    type
    description
    location
    ownerId
    date
    rsvpDate
  }
}
`;
export const declineCourtMembershipRequest = `mutation DeclineCourtMembershipRequest($input: CourtMembershipRequestInput!) {
  declineCourtMembershipRequest(input: $input) {
    courtId
    memberId
    ownerId
  }
}
`;
export const deleteBounz = `mutation DeleteBounz($input: BounzInput!) {
  deleteBounz(input: $input) {
    bounzedDate
    bounzerId
    postId
  }
}
`;
export const deleteComment = `mutation DeleteComment($input: DeleteCommentInput!) {
  deleteComment(input: $input) {
    comment
    commentDate
    commentorId
    postId
  }
}
`;
export const deleteMessage = `mutation DeleteMessage($input: DeleteMessageInput!) {
  deleteMessage(input: $input) {
    message
    messageDate
    messengerId
    threadId
  }
}
`;
export const deleteCourt = `mutation DeleteCourt($courtId: String!) {
  deleteCourt(courtId: $courtId) {
    color
    courtId
    description
    imageRev
    memberCount
    name
    ownerId
    postCount
    restricted
    verified
  }
}
`;
export const deleteEvent = `mutation DeleteEvent($eventId: String!) {
  deleteEvent(eventId: $eventId) {
    eventId
    title
    type
    description
    location
    ownerId
    date
    rsvpDate
  }
}
`;
export const deleteFollower = `mutation DeleteFollower($input: FollowerInput!) {
  deleteFollower(input: $input) {
    followeeId
    followerId
  }
}
`;
export const deleteInvite = `mutation DeleteInvite($inviteId: String!) {
  deleteInvite(inviteId: $inviteId) {
    inviteId
    eventId
    inviteeId
    inviteeName
    inviteeSurname
    attendanceLimit
  }
}
`;
export const deleteReceivedPost = `mutation DeleteReceivedPost($input: DeleteReceivedPostInput!) {
  deleteReceivedPost(input: $input) {
    receiverId
    postId
    receivedDate
  }
}
`;
export const deleteSentPost = `mutation DeleteSentPost($input: DeleteSentPostInput!) {
  deleteSentPost(input: $input) {
    aspectRatio
    bounzes
    caption
    courtId
    creatorId
    postedDate
    receipts
    vibrantColor
    bounty
  }
}
`;
export const deleteUserInfo = `mutation DeleteUserInfo($input: DeleteUserInfoInput!) {
  deleteUserInfo(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const incrementCourtMembers = `mutation IncrementCourtMembers($input: IncrementCourtPropInput!) {
  incrementCourtMembers(input: $input) {
    color
    courtId
    description
    imageRev
    memberCount
    name
    ownerId
    postCount
    restricted
    verified
  }
}
`;
export const incrementCourtPostCount = `mutation IncrementCourtPostCount($input: IncrementCourtPropInput!) {
  incrementCourtPostCount(input: $input) {
    color
    courtId
    description
    imageRev
    memberCount
    name
    ownerId
    postCount
    restricted
    verified
  }
}
`;
export const incrementSentPostBounzes = `mutation IncrementSentPostBounzes($input: IncrementSentPostPropInput!) {
  incrementSentPostBounzes(input: $input) {
    aspectRatio
    bounzes
    caption
    courtId
    creatorId
    postedDate
    receipts
    vibrantColor
    bounty
  }
}
`;
export const incrementSentPostReceipts = `mutation IncrementSentPostReceipts($input: IncrementSentPostPropInput!) {
  incrementSentPostReceipts(input: $input) {
    aspectRatio
    bounzes
    caption
    courtId
    creatorId
    postedDate
    receipts
    vibrantColor
    bounty
  }
}
`;
export const incrementSentPostBounty = `mutation IncrementSentPostBounty($input: IncrementSentPostPropInput!) {
  incrementSentPostBounty(input: $input) {
    aspectRatio
    bounzes
    caption
    courtId
    creatorId
    postedDate
    receipts
    vibrantColor
    bounty
  }
}
`;
export const incrementUserBounzesMade = `mutation IncrementUserBounzesMade($input: IncrementUserPropInput!) {
  incrementUserBounzesMade(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const incrementUserBounzesReceived = `mutation IncrementUserBounzesReceived($input: IncrementUserPropInput!) {
  incrementUserBounzesReceived(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const incrementUserFollowersCount = `mutation IncrementUserFollowersCount($input: IncrementUserPropInput!) {
  incrementUserFollowersCount(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const incrementUserFollowingCount = `mutation IncrementUserFollowingCount($input: IncrementUserPropInput!) {
  incrementUserFollowingCount(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const incrementUserPostCount = `mutation IncrementUserPostCount($input: IncrementUserPropInput!) {
  incrementUserPostCount(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const incrementCourtsJoined = `mutation IncrementCourtsJoined($input: IncrementUserPropInput!) {
  incrementCourtsJoined(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const incrementCourtsOwned = `mutation IncrementCourtsOwned($input: IncrementUserPropInput!) {
  incrementCourtsOwned(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const incrementUserReceipts = `mutation IncrementUserReceipts($input: IncrementUserPropInput!) {
  incrementUserReceipts(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const incrementUserBounty = `mutation IncrementUserBounty($input: IncrementUserPropInput!) {
  incrementUserBounty(input: $input) {
    bounty
    userId
  }
}
`;
export const joinCourt = `mutation JoinCourt($input: CourtMemberInput!) {
  joinCourt(input: $input) {
    courtId
    memberId
  }
}
`;
export const leaveCourt = `mutation LeaveCourt($input: CourtMemberInput!) {
  leaveCourt(input: $input) {
    courtId
    memberId
  }
}
`;
export const requestToJoinCourt = `mutation RequestToJoinCourt($input: CourtMemberInput!) {
  requestToJoinCourt(input: $input) {
    courtId
    memberId
    ownerId
  }
}
`;
export const unblockUser = `mutation UnblockUser($blockeeId: String!, $blockerId: String!) {
  unblockUser(blockeeId: $blockeeId, blockerId: $blockerId) {
    blocked
    blockeeId
    blockerId
  }
}
`;
export const updateCourtInfo = `mutation UpdateCourtInfo($input: UpdateCourtInfoInput!) {
  updateCourtInfo(input: $input) {
    color
    courtId
    description
    imageRev
    memberCount
    name
    ownerId
    postCount
    restricted
    verified
  }
}
`;
export const updateInviteeId = `mutation UpdateInviteeId($inviteId: String!, $inviteeId: String!) {
  updateInviteeId(inviteId: $inviteId, inviteeId: $inviteeId) {
    inviteId
    eventId
    inviteeId
    inviteeName
    inviteeSurname
    attendanceLimit
  }
}
`;
export const updateProfilePic = `mutation UpdateProfilePic($input: UpdateProfilePicInput!) {
  updateProfilePic(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const updateUserInfo = `mutation UpdateUserInfo($input: UpdateUserInfoInput!) {
  updateUserInfo(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const updateCourtPic = `mutation UpdateCourtPic($input: UpdateCourtPicInput!) {
  updateCourtPic(input: $input) {
    color
    courtId
    description
    imageRev
    memberCount
    name
    ownerId
    postCount
    restricted
    verified
  }
}
`;
export const updateUsername = `mutation UpdateUsername($input: UpdateUsernameInput!) {
  updateUsername(input: $input) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const updateUserRealName = `mutation UpdateUserRealName($input: UpdateUserRealNameInput!) {
  updateUserRealName(input: $input)
}
`;
export const ignoreCourt = `mutation IgnoreCourt($ignorerId: String!, $courtId: String!) {
  ignoreCourt(ignorerId: $ignorerId, courtId: $courtId) {
    ignorerId
    courtId
  }
}
`;
export const unignoreCourt = `mutation UnignoreCourt($ignorerId: String!, $courtId: String!) {
  unignoreCourt(ignorerId: $ignorerId, courtId: $courtId) {
    ignorerId
    courtId
  }
}
`;
export const attachBountyToPost = `mutation AttachBountyToPost($input: AttachBountyToPostInput) {
  attachBountyToPost(input: $input) {
    aspectRatio
    bounzes
    caption
    courtId
    creatorId
    postedDate
    receipts
    vibrantColor
    bounty
  }
}
`;
export const adminDeleteContentReport = `mutation AdminDeleteContentReport($input: DeleteContentReportInput!) {
  adminDeleteContentReport(input: $input) {
    contentId
    contentType
    description
    reportedDate
    reporterId
    title
  }
}
`;
export const adminDeleteSentPost = `mutation AdminDeleteSentPost($input: DeleteSentPostInput!) {
  adminDeleteSentPost(input: $input) {
    aspectRatio
    bounzes
    caption
    courtId
    creatorId
    postedDate
    receipts
    vibrantColor
    bounty
  }
}
`;
export const adminDeleteComment = `mutation AdminDeleteComment($input: DeleteCommentInput!) {
  adminDeleteComment(input: $input) {
    comment
    commentDate
    commentorId
    postId
  }
}
`;
export const adminDeleteUser = `mutation AdminDeleteUser($userId: String!) {
  adminDeleteUser(userId: $userId) {
    bio
    bounzesMade
    bounzesReceived
    followersCount
    followingCount
    userId
    location
    postCount
    profilePicRev
    receipts
    username
    courtsJoined
    courtsOwned
  }
}
`;
export const adminDeleteCourt = `mutation AdminDeleteCourt($courtId: String!) {
  adminDeleteCourt(courtId: $courtId) {
    color
    courtId
    description
    imageRev
    memberCount
    name
    ownerId
    postCount
    restricted
    verified
  }
}
`;
export const adminDeleteMessage = `mutation AdminDeleteMessage($input: DeleteMessageInput!) {
  adminDeleteMessage(input: $input) {
    message
    messageDate
    messengerId
    threadId
  }
}
`;
