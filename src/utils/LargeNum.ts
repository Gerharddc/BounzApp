/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

const k = 1000;
const m = 1000000;
const b = 1000000000;
const t = 1000000000000;

function trim(i: number) {
    const num = i.toFixed(1);

    const parts = num.split('.');
    const front = parts[0];
    const back = parts[1];

    if (front.length > 1 || back === '0') {
        return front;
    } else {
        return num;
    }
}

export default function LargeNum(i: number) {
    if (i < k) {
        return i.toString();
    } else if (i < 0.1 * m) {
        return trim(i / k) + 'K';
    } else if (i < 0.1 * b) {
        return trim(i / m) + 'M';
    } else if (i < 0.1 * t) {
        return trim(i / b) + 'B';
    } else {
        return trim(i / t) + 'T';
    }
}
