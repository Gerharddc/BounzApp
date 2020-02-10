/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import system from 'system-exports';

const baseImgUrl =  'https://' + system.public_images_domain + '/court-pics/';
export function calculateCourtPicUrl(court: { courtId: string, imageRev: number }) {
    return baseImgUrl + court.courtId + '-' + court.imageRev + '.jpg';
}
