/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import { NavigationActions, StackActions } from 'react-navigation';

export const startAtFlowTab = () => StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Main' })],
    key: null,
});

export const gotoLogin = () => StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })],
    key: null,
});

export const gotoSignup = () => NavigationActions.navigate({ routeName: 'Signup' });
export const gotoForgotPassword = () => NavigationActions.navigate({ routeName: 'ForgotPassword' });
export const goBack = () => NavigationActions.back();
export const gotoFlowTab = () => NavigationActions.navigate({ routeName: 'Flow' });
export const gotoPerspectiveTab = () => NavigationActions.navigate({ routeName: 'Perspective' });
export const gotoMenu = () => NavigationActions.navigate({ routeName: 'Menu' });
export const gotoFindUser = () => NavigationActions.navigate({ routeName: 'FindUser' });
export const gotoAbout = () => NavigationActions.navigate({ routeName: 'About' });
export const gotoAccount = () => NavigationActions.navigate({ routeName: 'Account' });
export const gotoLegal = () => NavigationActions.navigate({ routeName: 'Legal' });
export const gotoLicenses = () => NavigationActions.navigate({ routeName: 'Licenses' });
export const gotoUsage = () => NavigationActions.navigate({ routeName: 'Usage' });
export const gotoCourtsToJoin = () => NavigationActions.navigate({ routeName: 'CourtsToJoin' });
export const gotoUsersToFollow = () => NavigationActions.navigate({ routeName: 'UsersToFollow' });
export const gotoOutdated = () => StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'SystemStatus', params: { status: 'outdated' } })],
    key: null,
});
export const gotoMaintenance = () => StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'SystemStatus', params: { status: 'maintenance' } })],
    key: null,
});
export const gotoNoNetwork = () => StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'SystemStatus', params: { status: 'noNetwork' } })],
    key: null,
});
export const gotoEULA = () => StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'EULA' })],
    key: null,
});
export const gotoPrivacyPolicy = () => NavigationActions.navigate({ routeName: 'PrivacyPolicy' });
export const gotoLeaderboards = () => NavigationActions.navigate({ routeName: 'Leaderboards' });
export const gotoTerms = () => NavigationActions.navigate({ routeName: 'Terms' });
export const gotoCourtsJoined = (userId: string) =>
    NavigationActions.navigate({ routeName: 'CourtsJoined', params: { userId }, key: 'courtsJoined:' + userId });
export const gotoCourtsOwned = (userId: string) =>
    NavigationActions.navigate({ routeName: 'CourtsOwned', params: { userId }, key: 'courtsOwned:' + userId });
export const gotoCreateCourt = () => NavigationActions.navigate({ routeName: 'CreateCourt' });
export const switchToCourt = (courtId: string) =>
    StackActions.replace({ routeName: 'Court', params: { courtId }, newKey: 'court:' + courtId });
export const gotoCourt = (courtId: string) =>
    NavigationActions.navigate({ routeName: 'Court', params: { courtId }, key: 'court:' + courtId });
export const gotoAllCourts = () => NavigationActions.navigate({ routeName: 'AllCourts' });
export const gotoCourtMembers = (courtId: string) =>
    NavigationActions.navigate({ routeName: 'CourtMembers', params: { courtId } });
export const gotoDeleteAccount = (userId: string) =>
    NavigationActions.navigate({ routeName: 'DeleteAccount', params: { userId } });
export const gotoCourtPosts = (courtId: string) =>
    NavigationActions.navigate({ routeName: 'CourtPosts', params: { courtId } });
export const gotoPickCourt = () => NavigationActions.navigate({ routeName: 'PickCourt' });
export const gotoEditCourt = (courtId: string) =>
    NavigationActions.navigate({ routeName: 'EditCourt', params: { courtId } });
export const gotoBounty = () => NavigationActions.navigate({ routeName: 'Bounty' });
export const gotoPurchaseBounty = () => NavigationActions.navigate({ routeName: 'PurchaseBounty' });
export const gotoMessages = (userId: string) =>
    NavigationActions.navigate({ routeName: 'MessageThreads', params: { userId } });
export const gotoOtherUser = (userId: string) =>
    NavigationActions.navigate({ routeName: 'OtherUser', params: { userId }, key: 'user:' + userId });
export const gotoOthersPosts = (userId: string) =>
    NavigationActions.navigate({ routeName: 'OthersPosts', params: { userId }, key: 'posts:' + userId });
export const gotoFollowing = (userId: string) =>
    NavigationActions.navigate({ routeName: 'Following', params: { userId }, key: 'following:' + userId });
export const gotoFollowers = (userId: string) =>
    NavigationActions.navigate({ routeName: 'Followers', params: { userId }, key: 'followers:' + userId });
export const gotoBounzedPosts = (userId: string) =>
    NavigationActions.navigate({ routeName: 'BounzedPosts', params: { userId }, key: 'bounzed:' + userId });
export const gotoPostComments = (postId: string) =>
    NavigationActions.navigate({ routeName: 'Comments', params: { postId }, key: 'comments:' + postId });
export const gotoPost = (postId: string) =>
    NavigationActions.navigate({ routeName: 'Post', params: { postId }, key: 'post:' + postId });
export const gotoPostBounzers = (postId: string) =>
    NavigationActions.navigate({ routeName: 'Bounzers', params: { postId }, key: 'bounzers:' + postId });

export const gotoReport = (contentType: string, contentId: string) =>
    NavigationActions.navigate({ routeName: 'Report', params: { contentType, contentId } });

export const gotoMessageThread = (threadId: string) =>
    NavigationActions.navigate({ routeName: 'Messages', params: { threadId }, key: 'messages:' + threadId });

export const gotoInviteResponse = (inviteId: string, eventId: string) =>
    NavigationActions.navigate({
        routeName: 'Invite',
        params: { inviteId, eventId },
        key: 'inviteResponse:' + inviteId,
    });
export const gotoEventResponses = (eventId: string) =>
    NavigationActions.navigate({
        routeName: 'EventResponses', params: { eventId },
        key: 'eventResponses:' + eventId,
    });
export const gotoUserEvents = () =>
    NavigationActions.navigate({ routeName: 'UserEvents' });
export const gotoUserInvitedEvents = () =>
    NavigationActions.navigate({ routeName: 'UserInvitedEvents' });
export const gotoEvent = (eventId: string, responseId: string, inviteId: string) =>
    NavigationActions.navigate({
        routeName: 'Event',
        params: { eventId, responseId, inviteId },
        key: 'event:' + eventId,
    });
export const gotoSendInvite = (eventId: string) =>
    NavigationActions.navigate({ routeName: 'SendInvite', params: { eventId }, key: 'sendInvite:' + eventId });
export const gotoCreateEvent = () => NavigationActions.navigate({ routeName: 'CreateEvent' });
