/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import LargeNum from './LargeNum';

test('1', () => {
    const num = LargeNum(1);
    expect(num).toBe('1');
});

test('55', () => {
	const num = LargeNum(55);
	expect(num).toBe('55');
});

test('999', () => {
	const num = LargeNum(999);
	expect(num).toBe('999');
});

test('1000', () => {
	const num = LargeNum(1000);
	expect(num).toBe('1K');
});

test('1040', () => {
	const num = LargeNum(1040);
	expect(num).toBe('1K');
});

test('1100', () => {
	const num = LargeNum(1100);
	expect(num).toBe('1.1K');
});

test('10000', () => {
	const num = LargeNum(10000);
	expect(num).toBe('10K');
});

test('10100', () => {
	const num = LargeNum(10100);
	expect(num).toBe('10K');
});

test('100000', () => {
	const num = LargeNum(100000);
	expect(num).toBe('0.1M');
});

test('150000', () => {
	const num = LargeNum(150000);
	expect(num).toBe('0.1M');
});

test('1000000', () => {
	const num = LargeNum(1000000);
	expect(num).toBe('1M');1000000000
});

test('2200000', () => {
	const num = LargeNum(2200000);
	expect(num).toBe('2.2M');
});

test('100000000', () => {
	const num = LargeNum(100000000);
	expect(num).toBe('0.1B');
});

test('1000000000', () => {
	const num = LargeNum(1000000000);
	expect(num).toBe('1B');
});

test('100000000000', () => {
	const num = LargeNum(100000000000);
	expect(num).toBe('0.1T');
});

test('1000000000000', () => {
	const num = LargeNum(1000000000000);
	expect(num).toBe('1T');
});