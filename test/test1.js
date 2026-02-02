import assert from 'node:assert/strict';
import test from 'node:test';

test('synchronous passing test 1', (t) => {
  // This test passes because it does not throw an exception.
  assert.strictEqual(1, 1);
});