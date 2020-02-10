/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as React from 'react';

interface IProps {
    run: () => void;
}

export default class OnMount extends React.Component<IProps> {
    componentDidMount() {
        this.props.run();
    }

    render() {
        return null;
    }
}
