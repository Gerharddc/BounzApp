/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import system from 'system-exports';

const baseImgUrl = 'https://' + system.public_images_domain + '/posts/';
export function ImageUrlForPost(post: { creatorId: string, postedDate: string }) {
    return baseImgUrl + post.creatorId + '/' + post.postedDate + '.jpg';
}
