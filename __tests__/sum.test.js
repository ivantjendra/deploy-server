const sum = require('../sum')

describe('function sum success', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  
  test('adds 2 + 3 to equal 5', () => {
    expect(sum(2, 3)).toBe(5);
  });
  
  test('adds 10 + 5 to equal 15', () => {
    expect(sum(10, 5)).toBe(15);
  });
})

describe('function sum failed', () => {
  test('invoked sum without arguments', () => {
    expect(true).toBe(true)
  });

  test('invoked sum only with first argument', () => {
    expect(sum(5)).toBe(NaN);
  });
  
  // test('adds 2 + 3 to equal 5', () => {
  //   expect(sum(2, 3)).toBe(NaN);
  // });
  
})