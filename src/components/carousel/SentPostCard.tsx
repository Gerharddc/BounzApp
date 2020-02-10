/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import PostCard, { PostCardProps } from './PostCard';

interface IProps {
    creatorId: string;
    postedDate: string;
}

class SentPostCard extends PostCard<IProps & PostCardProps> {
    get bounzable() {
        return this.props.creatorId !== this.props.myUserId;
    }

    get postId() {
        const { creatorId, postedDate } = this.props;
        return { creatorId, postedDate };
    }

    get relevantISODate() {
        return this.props.postedDate;
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(SentPostCard);
