/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Auth from '@aws-amplify/auth';
import PushNotification from '@aws-amplify/pushnotification';
import { gotoUsage } from 'actions/nav';
import { setMyUserId } from 'actions/users';
import BounzCancelTimer from 'components/BounzCancelTimer';
import DialogModal from 'components/modals/DialogModal';
import PasswordModal from 'components/modals/PasswordModal';
import PickUsernameModal from 'components/modals/PickUsernameModal';
import AboutScreen from 'components/screens/AboutScreen';
import AccountScreen from 'components/screens/AccountScreen';
import AllCourtsScreen from 'components/screens/AllCourtsScreen';
import BountyScreen from 'components/screens/BountyScreen';
import BounzedPostsScreen from 'components/screens/BounzedPostsScreen';
import BounzersScreen from 'components/screens/BounzersScreen';
import CommentsScreen from 'components/screens/CommentsScreen';
import CourtMembersScreen from 'components/screens/CourtMembersScreen';
import CourtPostsScreen from 'components/screens/CourtPostsScreen';
import CourtScreen from 'components/screens/CourtScreen';
import CourtsJoinedScreen from 'components/screens/CourtsJoinedScreen';
import CourtsOwnedScreen from 'components/screens/CourtsOwnedScreen';
import CourtsToJoinScreen from 'components/screens/CourtsToJoinScreen';
import CreateCourtScreen from 'components/screens/CreateCourtScreen';
import CreateEventScreen from 'components/screens/CreateEventScreen';
import DeleteAccountScreen from 'components/screens/DeleteAccountScreen';
import EditCourtScreen from 'components/screens/EditCourtScreen';
import EULAScreen from 'components/screens/EULAScreen';
import EventResponsesScreen from 'components/screens/EventResponsesScreen';
import EventScreen from 'components/screens/EventScreen';
import FindUserScreen from 'components/screens/FindUserScreen';
import FollowersScreen from 'components/screens/FollowersScreen';
import FollowingScreen from 'components/screens/FollowingScreen';
import InviteResponseScreen from 'components/screens/InviteResponseScreen';
import LeaderboardsScreen from 'components/screens/LeaderboardsScreen';
import LegalScreen from 'components/screens/LegalScreen';
import LicensesScreen from 'components/screens/LicensesScreen';
import MenuScreen from 'components/screens/MenuScreen';
import MessagesScreen from 'components/screens/MessagesScreen';
import MessageThreadsScreen from 'components/screens/MessageThreadsScreen';
import PickCourtScreen from 'components/screens/PickCourtScreen';
import PostScreen from 'components/screens/PostScreen';
import PrivacyPolicyScreen from 'components/screens/PrivacyPolicyScreen';
import PurchaseBountyScreen from 'components/screens/PurchaseBountyScreen';
import ReportScreen from 'components/screens/ReportScreen';
import SendInviteScreen from 'components/screens/SendInviteScreen';
import StatusScreen from 'components/screens/StatusScreen';
import TermsScreen from 'components/screens/TermsScreen';
import UsageScreen from 'components/screens/UsageScreen';
import UserEventsScreen from 'components/screens/UserEventsScreen';
import UserInvitedEventsScreen from 'components/screens/UserInvitedEventsScreen';
import UsersToFollowScreen from 'components/screens/UsersToFollowScreen';
import FlowTab from 'components/tabs/FlowTab';
import UserTab from 'components/tabs/UserTab';
import { EnsureUser } from 'logic/Login';
import { EnsureValidSystem } from 'logic/System';
import { ConfigureEndpoint } from 'logic/UserInfo';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import {
    AppState, AsyncStorage, Linking, Platform,
    PushNotificationIOS, StatusBar, View,
} from 'react-native';
import { withInAppNotification } from 'react-native-in-app-notification';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { navigate, setTopLevelNavigator } from 'utils/NavigationService';
import MainTabNavigator from './MainTabNavigator';

let startDeeplink: string | undefined;
export function SetStartDeeplink(link: string) {
    startDeeplink = link;
}

export const navigationOptions = {
    headerStyle: {
        backgroundColor: platform.brandPrimary,
    },
    headerTitleStyle: {
        fontFamily: platform.brandFontFamily,
        color: 'black',
    },
    headerTintColor: platform.brandBackground,
};

export const Navigator = createAppContainer(createStackNavigator({
    SystemStatus: {
        screen: StatusScreen,
    },
    Main: {
        screen: MainTabNavigator,
        navigationOptions,
        path: '',
    },
    Menu: {
        screen: MenuScreen,
        navigationOptions,
    },
    Following: {
        screen: FollowingScreen,
        navigationOptions,
    },
    Followers: {
        screen: FollowersScreen,
        navigationOptions,
    },
    FindUser: {
        screen: FindUserScreen,
        navigationOptions,
    },
    UserEvents: {
        screen: UserEventsScreen,
        navigationOptions,
    },
    UserInvitedEvents: {
        screen: UserInvitedEventsScreen,
        navigationOptions,
    },
    CourtMembers: {
        screen: CourtMembersScreen,
        navigationOptions,
    },
    MessageThreads: {
        screen: MessageThreadsScreen,
        navigationOptions,
    },
    CourtPosts: {
        screen: CourtPostsScreen,
        navigationOptions,
    },
    BounzedPosts: {
        screen: BounzedPostsScreen,
        navigationOptions,
    },
    About: {
        screen: AboutScreen,
        navigationOptions,
    },
    DeleteAccount: {
        screen: DeleteAccountScreen,
        navigationOptions,
    },
    Account: {
        screen: AccountScreen,
        navigationOptions,
    },
    Licenses: {
        screen: LicensesScreen,
        navigationOptions,
    },
    PrivacyPolicy: {
        screen: PrivacyPolicyScreen,
        navigationOptions,
    },
    Leaderboards: {
        screen: LeaderboardsScreen,
        navigationOptions,
    },
    Terms: {
        screen: TermsScreen,
        navigationOptions,
    },
    OtherUser: {
        screen: UserTab,
        path: 'user/:userId',
    },
    OthersPosts: {
        screen: FlowTab,
    },
    Usage: {
        screen: UsageScreen,
        navigationOptions,
    },
    Legal: {
        screen: LegalScreen,
        navigationOptions,
    },
    Report: {
        screen: ReportScreen,
        navigationOptions,
    },
    EULA: {
        screen: EULAScreen,
        navigationOptions,
    },
    Comments: {
        screen: CommentsScreen,
        navigationOptions,
    },
    Messages: {
        screen: MessagesScreen,
        navigationOptions,
        path: 'messages/:threadId',
    },
    Post: {
        screen: PostScreen,
        path: 'post/:postId',
    },
    CreateCourt: {
        screen: CreateCourtScreen,
        navigationOptions,
    },
    Court: {
        screen: CourtScreen,
        path: 'court/:courtId',
    },
    AllCourts: {
        screen: AllCourtsScreen,
        navigationOptions,
    },
    CourtsJoined: {
        screen: CourtsJoinedScreen,
        navigationOptions,
    },
    CourtsOwned: {
        screen: CourtsOwnedScreen,
        navigationOptions,
    },
    Bounzers: {
        screen: BounzersScreen,
        navigationOptions,
    },
    CourtsToJoin: {
        screen: CourtsToJoinScreen,
        navigationOptions,
    },
    Event: {
        screen: EventScreen,
        navigationOptions,
    },
    SendInvite: {
        screen: SendInviteScreen,
        navigationOptions,
    },
    UsersToFollow: {
        screen: UsersToFollowScreen,
        navigationOptions,
    },
    PickCourt: {
        screen: PickCourtScreen,
        navigationOptions,
    },
    EditCourt: {
        screen: EditCourtScreen,
        navigationOptions,
    },
    Bounty: {
        screen: BountyScreen,
        navigationOptions,
        path: 'bounty',
    },
    PurchaseBounty: {
        screen: PurchaseBountyScreen,
        navigationOptions,
    },
    Invite: {
        screen: InviteResponseScreen,
        navigationOptions,
        path: 'invite/:inviteId',
    },
    EventResponses: {
        screen: EventResponsesScreen,
        navigationOptions,
    },
    CreateEvent: {
        screen: CreateEventScreen,
        navigationOptions,
    },
}, { initialRouteName: 'Main' }));

interface IProps {
    dispatch: any;
    showNotification: any;
}

class MainNavigator extends React.Component<IProps> {
    async storeUser() {
        const user = await Auth.currentUserPoolUser();
        this.props.dispatch(setMyUserId(user.username));
    }

    async checkDeepLink() {
        if (startDeeplink) {
            await Linking.openURL(startDeeplink);
            startDeeplink = undefined;
        }
    }

    async ensureIntro() {
        const saw = await AsyncStorage.getItem('@Bounz:sawIntro');
        if (saw !== 'true') {
            navigate(gotoUsage());
        }
    }

    componentDidMount() {
        this.storeUser();
        EnsureUser();
        ConfigureEndpoint();
        this.checkDeepLink();

        PushNotification.onNotification(async (notification: any) => {
            // console.log('notification', notification);

            if (Platform.OS === 'ios') {
                const deeplink = notification._data.data.pinpoint.deeplink;

                if (AppState.currentState === 'active') {
                    this.props.showNotification({
                        title: notification._alert.title,
                        message: notification._alert.body,
                        onPress: () => Linking.openURL(deeplink),
                    });
                } else {
                    try {
                        if (deeplink) {
                            await Linking.openURL(deeplink);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }

                notification.finish(PushNotificationIOS.FetchResult.NoData);
            } else if (notification.foreground) {
                const deeplink = notification.data['pinpoint.deeplink'];

                this.props.showNotification({
                    title: notification.title,
                    message: notification.body,
                    onPress: () => Linking.openURL(deeplink),
                });
            }
        });

        EnsureValidSystem();
        this.ensureIntro();
    }

    async componentWillUnmount() {
        startDeeplink = undefined;
    }

    render() {
        const uriPrefix = /https:\/\/www.bounz.io\/links\/|bounz:\/\//;

        return (
            <View style={{ flex: 1 }}>
                <DialogModal />
                <PickUsernameModal />
                <PasswordModal />
                <StatusBar backgroundColor={platform.brandPrimaryDarker} />
                <Navigator ref={(ref: any) => setTopLevelNavigator(ref)} uriPrefix={uriPrefix} />
                <BounzCancelTimer />
            </View>
        );
    }
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

const connected = connect(undefined, mapDispatchToProps)(MainNavigator);
export default withInAppNotification(connected);
