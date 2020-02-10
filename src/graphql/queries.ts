// tslint:disable
// this is an auto generated file. This will be overwritten

export const getBlockedUser = `query GetBlockedUser($blockeeId: String!, $blockerId: String!) {
  getBlockedUser(blockeeId: $blockeeId, blockerId: $blockerId) {
    blocked
    blockeeId
    blockerId
  }
}
`;
export const getBounz = `query GetBounz($bounzerId: String!, $postId: String!) {
  getBounz(bounzerId: $bounzerId, postId: $postId) {
    bounzedDate
    bounzerId
    postId
  }
}
`;
export const getCourtInfo = `query GetCourtInfo($courtId: String!) {
  getCourtInfo(courtId: $courtId) {
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
export const getCourtMember = `query GetCourtMember($courtId: String!, $memberId: String!) {
  getCourtMember(courtId: $courtId, memberId: $memberId) {
    courtId
    memberId
  }
}
`;
export const getCourtMembershipRequest = `query GetCourtMembershipRequest($courtId: String!, $memberId: String!) {
  getCourtMembershipRequest(courtId: $courtId, memberId: $memberId) {
    courtId
    memberId
    ownerId
  }
}
`;
export const getEventInfo = `query GetEventInfo($eventId: String!) {
  getEventInfo(eventId: $eventId) {
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
export const getInviteResponseInfo = `query GetInviteResponseInfo($responseId: String!) {
  getInviteResponseInfo(responseId: $responseId) {
    responseId
    inviteId
    responseType
    attendanceCount
    comment
  }
}
`;
export const getFollower = `query GetFollower($followeeId: String!, $followerId: String!) {
  getFollower(followeeId: $followeeId, followerId: $followerId) {
    followeeId
    followerId
  }
}
`;
export const getInviteInfo = `query GetInviteInfo($inviteId: String!) {
  getInviteInfo(inviteId: $inviteId) {
    event {
      eventId
      title
      type
      description
      location
      ownerId
      date
      rsvpDate
    }
    invite {
      inviteId
      eventId
      inviteeId
      inviteeName
      inviteeSurname
      attendanceLimit
    }
  }
}
`;
export const getSentPost = `query GetSentPost($creatorId: String!, $postedDate: String!) {
  getSentPost(creatorId: $creatorId, postedDate: $postedDate) {
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
export const getUserInfo = `query GetUserInfo($userId: String!) {
  getUserInfo(userId: $userId) {
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
export const getComment = `query GetComment($postId: String!, $commentDate: String!) {
  getComment(postId: $postId, commentDate: $commentDate) {
    comment
    commentDate
    commentorId
    postId
  }
}
`;
export const getMessage = `query GetMessage($threadId: String!, $messageDate: String!) {
  getMessage(threadId: $threadId, messageDate: $messageDate) {
    message
    messageDate
    messengerId
    threadId
  }
}
`;
export const getUserId = `query GetUserId($username: String!) {
  getUserId(username: $username) {
    userId
    username
    name
    profilePicRev
  }
}
`;
export const getUserBounty = `query GetUserBounty($userId: String!) {
  getUserBounty(userId: $userId) {
    bounty
    userId
  }
}
`;
export const getIgnoredCourt = `query GetIgnoredCourt($ignorerId: String!, $courtId: String!) {
  getIgnoredCourt(ignorerId: $ignorerId, courtId: $courtId) {
    ignorerId
    courtId
  }
}
`;
export const getUserRealName = `query GetUserRealName($userId: String!) {
  getUserRealName(userId: $userId)
}
`;
export const getUserRealName2 = `query GetUserRealName2($userId: String!) {
  getUserRealName2(userId: $userId) {
    name
    surname
  }
}
`;
export const listCourtInfos = `query ListCourtInfos($limit: Int, $nextToken: String) {
  listCourtInfos(limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const listCourtMembers = `query ListCourtMembers($courtId: String!, $limit: Int, $nextToken: String) {
  listCourtMembers(courtId: $courtId, limit: $limit, nextToken: $nextToken) {
    items {
      courtId
      memberId
    }
    nextToken
  }
}
`;
export const listCourtMembershipRequests = `query ListCourtMembershipRequests($ownerId: String!) {
  listCourtMembershipRequests(ownerId: $ownerId) {
    items {
      courtId
      memberId
    }
    nextToken
  }
}
`;
export const listCourtPosts = `query ListCourtPosts($courtId: String!, $limit: Int, $nextToken: String) {
  listCourtPosts(courtId: $courtId, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const listEventResponses = `query ListEventResponses($eventId: String!, $limit: Int, $nextToken: String) {
  listEventResponses(eventId: $eventId, limit: $limit, nextToken: $nextToken) {
    items {
      response {
        responseId
        inviteId
        responseType
        attendanceCount
        comment
      }
      invite {
        inviteId
        eventId
        inviteeId
        inviteeName
        inviteeSurname
        attendanceLimit
      }
    }
    nextToken
  }
}
`;
export const listFollowers = `query ListFollowers($followeeId: String!, $limit: Int, $nextToken: String) {
  listFollowers(followeeId: $followeeId, limit: $limit, nextToken: $nextToken) {
    items {
      followeeId
      followerId
    }
    nextToken
  }
}
`;
export const listFollowing = `query ListFollowing($followerId: String!, $limit: Int, $nextToken: String) {
  listFollowing(followerId: $followerId, limit: $limit, nextToken: $nextToken) {
    items {
      followeeId
      followerId
    }
    nextToken
  }
}
`;
export const listMemberCourts = `query ListMemberCourts($limit: Int, $memberId: String!, $nextToken: String) {
  listMemberCourts(limit: $limit, memberId: $memberId, nextToken: $nextToken) {
    items {
      courtId
      memberId
    }
    nextToken
  }
}
`;
export const listOwnerCourts = `query ListOwnerCourts($limit: Int, $nextToken: String, $ownerId: String!) {
  listOwnerCourts(limit: $limit, nextToken: $nextToken, ownerId: $ownerId) {
    items {
      courtId
      ownerId
    }
    nextToken
  }
}
`;
export const listPostComments = `query ListPostComments($limit: Int, $nextToken: String, $postId: String!) {
  listPostComments(limit: $limit, nextToken: $nextToken, postId: $postId) {
    items {
      comment
      commentDate
      commentorId
      postId
    }
    nextToken
  }
}
`;
export const listThreadMessages = `query ListThreadMessages($limit: Int, $nextToken: String, $threadId: String!) {
  listThreadMessages(
    limit: $limit
    nextToken: $nextToken
    threadId: $threadId
  ) {
    items {
      message
      messageDate
      messengerId
      threadId
    }
    nextToken
  }
}
`;
export const listPostBounzes = `query ListPostBounzes($limit: Int, $nextToken: String, $postId: String!) {
  listPostBounzes(limit: $limit, nextToken: $nextToken, postId: $postId) {
    items {
      bounzedDate
      bounzerId
      postId
    }
    nextToken
  }
}
`;
export const listUserBounzes = `query ListUserBounzes($bounzerId: String!, $limit: Int, $nextToken: String) {
  listUserBounzes(bounzerId: $bounzerId, limit: $limit, nextToken: $nextToken) {
    items {
      bounzedDate
      bounzerId
      postId
    }
    nextToken
  }
}
`;
export const listUserEvents = `query ListUserEvents($ownerId: String!, $limit: Int, $nextToken: String) {
  listUserEvents(ownerId: $ownerId, limit: $limit, nextToken: $nextToken) {
    items {
      eventId
      title
      type
      description
      location
      ownerId
      date
      rsvpDate
    }
    nextToken
  }
}
`;
export const listUserInvitedEvents = `query ListUserInvitedEvents(
  $inviteeId: String!
  $limit: Int
  $nextToken: String
) {
  listUserInvitedEvents(
    inviteeId: $inviteeId
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      response {
        responseId
        inviteId
        responseType
        attendanceCount
        comment
      }
      event {
        eventId
        title
        type
        description
        location
        ownerId
        date
        rsvpDate
      }
      invite {
        inviteId
        eventId
        inviteeId
        inviteeName
        inviteeSurname
        attendanceLimit
      }
    }
    nextToken
  }
}
`;
export const listUserReceivedPosts = `query ListUserReceivedPosts(
  $receiverId: String!
  $limit: Int
  $nextToken: String
) {
  listUserReceivedPosts(
    receiverId: $receiverId
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      receiverId
      postId
      receivedDate
    }
    nextToken
  }
}
`;
export const listUserSentPosts = `query ListUserSentPosts($creatorId: String!, $limit: Int, $nextToken: String) {
  listUserSentPosts(
    creatorId: $creatorId
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
`;
export const listUserThreads = `query ListUserThreads($userId: String!, $limit: Int, $nextToken: String) {
  listUserThreads(userId: $userId, limit: $limit, nextToken: $nextToken) {
    items {
      threadId
      userId
      latestMessageDate
    }
    nextToken
  }
}
`;
export const searchUsers = `query SearchUsers($searchTerm: String!) {
  searchUsers(searchTerm: $searchTerm) {
    userId
    username
    name
    profilePicRev
  }
}
`;
export const searchCourts = `query SearchCourts($searchTerm: String!) {
  searchCourts(searchTerm: $searchTerm) {
    courtId
    name
  }
}
`;
export const listContentReports = `query ListContentReports($limit: Int, $nextToken: String) {
  listContentReports(limit: $limit, nextToken: $nextToken) {
    items {
      contentId
      contentType
      description
      reportedDate
      reporterId
      title
    }
    nextToken
  }
}
`;
