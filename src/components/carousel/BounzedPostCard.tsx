/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import PostCard, { PostCardProps } from './PostCard';

interface IProps {
    bounzedDate: string;
    bounzerId: string;
    postId: string;
}

class BounzedPostCard extends PostCard<IProps & PostCardProps> {
    get bounzable() {
        return true;
    }

    get postId() {
        const parts = this.props.postId.split(';');
        const creatorId = parts[0];
        const postedDate = parts[1];

        return { creatorId, postedDate };
    }

    get relevantISODate() {
        return this.props.bounzedDate;
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(BounzedPostCard);
