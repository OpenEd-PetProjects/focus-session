const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createTimer } = require('./timer');

test('настройка, запуск, пауза и завершение таймера', () => {
  let now = 0;
  const timer = createTimer(() => now);
  assert.equal(timer.seconds(), 1500);
  assert.equal(timer.setMinutes(2), true);
  timer.start(); now += 30000;
  assert.equal(timer.seconds(), 90);
  timer.pause(); now += 60000;
  assert.equal(timer.seconds(), 90);
  timer.start(); now += 90001;
  assert.equal(timer.seconds(), 0);
  timer.pause();
  assert.equal(timer.running(), false);
});

test('некорректная длительность не меняет таймер', () => {
  const timer = createTimer();
  for (const value of [0, -1, 301, 1.5, NaN]) assert.equal(timer.setMinutes(value), false);
  assert.equal(timer.seconds(), 1500);
});
