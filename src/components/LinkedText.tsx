/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as React from 'react';
import { Linking, StyleProp, Text, TextStyle } from 'react-native';
import Parser from 'react-native-dom-parser';
import shortid from 'shortid';
import { navigate } from 'utils/NavigationService';

interface IProps {
    text: string;
    style?: StyleProp<TextStyle>;
}

const tagRegex = /(<.[^(><.)]+>)/g;
const urlRegex = /((\w+:\/\/\S+)|(\w+[\.:]\w+\S+))[^\s,\.]/ig;

export default class LinkedText extends React.Component<IProps> {
    renderPart(part: { text?: string; tag?: any, url?: string }) {
        if (part.tag) {
            return (
                <Text
                    style={{ fontStyle: 'italic' }}
                    onPress={() => navigate(NavActions.gotoOtherUser(part.tag.id))}
                    key={part.tag.id}
                >
                    {part.tag.display}
                </Text>
            );
        } else if (part.url && part.url !== '') {
            return (
                <Text
                    style={{ fontStyle: 'italic' }}
                    onPress={() => {
                        if (!part.url!.startsWith('http')) {
                            Linking.openURL('http://' + part.url!);
                        } else {
                            Linking.openURL(part.url!);
                        }
                    }}
                    key={part.url}
                >
                    {part.url}
                </Text>
            );
        } else {
            if (part.text === '') {
                return null;
            }

            return (
                <Text key={part.text}>
                    {part.text}
                </Text>
            );
        }
    }

    render() {
        const tagMap = new Map();
        const tags = this.props.text.match(tagRegex) || [];

        let newString = this.props.text;

        for (const tag of tags) {
            const dom = Parser(tag);

            if (dom.tagName !== 'Mention') {
                continue;
            }

            const ats = dom.attributes;

            if (ats.type === 'user') {
                const id = shortid.generate();
                tagMap.set(id, ats);
                newString = newString.replace(tag, id);
            }
        }

        const parts = [];

        for (const key of tagMap.keys()) {
            const segments = newString.split(key);
            parts.push({ text: segments[0] });
            parts.push({ tag: tagMap.get(key) });
            newString = segments[1];
        }

        parts.push({ text: newString });

        const newParts = [];

        for (const part of parts) {
            if (!part.text) {
                newParts.push(part);
                continue;
            }

            const urls = part.text.match(urlRegex) || [];

            if (!urls || urls.length < 1) {
                newParts.push(part);
                continue;
            }

            let newText = part.text;

            for (const url of urls) {
                const segments = newText.split(url);

                if (segments[0] !== '') {
                    newParts.push({ text: segments[0] });
                }

                newParts.push({ url });
                newText = segments[1];
            }

            if (newText !== '') {
                newParts.push({ text: newText });
            }
        }

        return (
            <Text style={this.props.style}>
                {newParts.map((p) => this.renderPart(p))}
            </Text>
        );
    }
}
