/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import PostCard, { PostCardProps } from './PostCard';

interface IProps {
    receivedDate: string;
    bounzerId: string;
    postId: string;
}

class ReceivedPostCard extends PostCard<IProps & PostCardProps> {
    get bounzable() {
        return this.postId.creatorId !== this.props.myUserId;
    }

    get postId() {
        const parts = this.props.postId.split(';');
        const creatorId = parts[0];
        const postedDate = parts[1];

        return { creatorId, postedDate };
    }

    get relevantISODate() {
        return this.props.receivedDate;
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(ReceivedPostCard);
