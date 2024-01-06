import { jest } from '@jest/globals'
import { BaseTest, runTests } from '@pbvision/jest-unit-test'

import { AsyncEmitter } from '../src/async-emitter.js'

class EmitterTest extends BaseTest {
  async testHandleOnce () {
    const mock = jest.fn()
    const emitter = new AsyncEmitter()
    emitter.once('abc', mock)
    await emitter.emit('aaa')
    expect(mock).toHaveBeenCalledTimes(0)

    await emitter.emit('abc')
    expect(mock).toHaveBeenCalledTimes(1)

    await emitter.emit('abc')
    expect(mock).toHaveBeenCalledTimes(1)
  }

  async testRemovingHandler () {
    const emitter = new AsyncEmitter()
    emitter.removeHandler('abc', 'aaa')

    const name = emitter.once('abc', () => {})
    emitter.removeHandler('abc', name)
    expect(emitter.handlers.abc).not.toHaveProperty(name)
  }

  async testRepeatedHandler () {
    const mock = jest.fn()
    const emitter = new AsyncEmitter()
    emitter.on('abc', mock)

    await emitter.emit('aaa')
    expect(mock).toHaveBeenCalledTimes(0)

    await emitter.emit('abc')
    expect(mock).toHaveBeenCalledTimes(1)

    await emitter.emit('abc')
    expect(mock).toHaveBeenCalledTimes(2)
  }

  async testNamedHandler () {
    const mock = jest.fn()
    const emitter = new AsyncEmitter()
    const name = emitter.once('abc', mock, 'h1')
    expect(name).toBe('h1')

    expect(() => {
      emitter.once('abc', mock, 'h1')
    }).toThrow('Handler with the same name h1 already exists')

    emitter.removeHandler('abc', 'h1')
    await emitter.emit('abc')
    expect(mock).toHaveBeenCalledTimes(0)

    const name2 = emitter.on('abc', mock, 'h2')
    expect(name2).toBe('h2')
    expect(() => {
      emitter.once('abc', mock, 'h2')
    }).toThrow('Handler with the same name h2 already exists')
  }

  testDefaultHandlerName () {
    const mock = jest.fn()
    const emitter = new AsyncEmitter()
    const name = emitter.once('abc', mock)
    expect(name).toBeDefined()

    const name2 = emitter.on('abc', mock)
    expect(name2).toBeDefined()
  }

  async testArgPassing () {
    const mock = jest.fn()
    const emitter = new AsyncEmitter()
    emitter.once('a', mock)
    await emitter.emit('a', 1, 2, 3)
    expect(mock).toHaveBeenLastCalledWith(1, 2, 3)

    emitter.once('b', mock)
    await emitter.emit('b', 3, 2, 1)
    expect(mock).toHaveBeenLastCalledWith(3, 2, 1)
  }
}

runTests(EmitterTest)
