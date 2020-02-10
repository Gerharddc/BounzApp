// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateBounz = `subscription OnCreateBounz($bounzerId: String!) {
  onCreateBounz(bounzerId: $bounzerId) {
    bounzedDate
    bounzerId
    postId
  }
}
`;
export const onCreateComment = `subscription OnCreateComment($postId: String!) {
  onCreateComment(postId: $postId) {
    comment
    commentDate
    commentorId
    postId
  }
}
`;
export const onCreateMessage = `subscription OnCreateMessage($threadId: String!) {
  onCreateMessage(threadId: $threadId) {
    message
    messageDate
    messengerId
    threadId
  }
}
`;
export const onCreateReceivedPost = `subscription OnCreateReceivedPost($receiverId: String!) {
  onCreateReceivedPost(receiverId: $receiverId) {
    receiverId
    postId
    receivedDate
  }
}
`;
export const onCreateSentPost = `subscription OnCreateSentPost($creatorId: String!) {
  onCreateSentPost(creatorId: $creatorId) {
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
export const onDeleteBounz = `subscription OnDeleteBounz($bounzerId: String!) {
  onDeleteBounz(bounzerId: $bounzerId) {
    bounzedDate
    bounzerId
    postId
  }
}
`;
export const onCreateCourtMembershipRequest = `subscription OnCreateCourtMembershipRequest($ownerId: String!) {
  onCreateCourtMembershipRequest(ownerId: $ownerId) {
    courtId
    memberId
  }
}
`;
export const onDeleteComment = `subscription OnDeleteComment($postId: String!) {
  onDeleteComment(postId: $postId) {
    comment
    commentDate
    commentorId
    postId
  }
}
`;
export const onDeleteMessage = `subscription OnDeleteMessage($threadId: String!) {
  onDeleteMessage(threadId: $threadId) {
    message
    messageDate
    messengerId
    threadId
  }
}
`;
export const onDeleteReceivedPost = `subscription OnDeleteReceivedPost($receiverId: String!) {
  onDeleteReceivedPost(receiverId: $receiverId) {
    receiverId
    postId
    receivedDate
  }
}
`;
export const onDeleteSentPost = `subscription OnDeleteSentPost($creatorId: String!) {
  onDeleteSentPost(creatorId: $creatorId) {
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
export const onDeleteUserInfo = `subscription OnDeleteUserInfo($userId: String!) {
  onDeleteUserInfo(userId: $userId) {
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
export const onUpdateBlockedUser = `subscription OnUpdateBlockedUser($blockeeId: String!, $blockerId: String!) {
  onUpdateBlockedUser(blockeeId: $blockeeId, blockerId: $blockerId) {
    blocked
    blockeeId
    blockerId
  }
}
`;
export const onUpdateSentPost = `subscription OnUpdateSentPost($creatorId: String!, $postedDate: String!) {
  onUpdateSentPost(creatorId: $creatorId, postedDate: $postedDate) {
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
export const onUpdateUserInfo = `subscription OnUpdateUserInfo($userId: String!) {
  onUpdateUserInfo(userId: $userId) {
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
export const onUpdateCourtInfo = `subscription OnUpdateCourtInfo($courtId: String!) {
  onUpdateCourtInfo(courtId: $courtId) {
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
