import { isV2, createInitialBlocks } from '@/utils/article'

describe('isV2', () => {
  describe('when it has body equivalent to Array and version is 2xx', () => {
    it('returns true', () => {
      const article = {
        version: 200,
        body: '[]'
      }
      expect(isV2(article)).toBeTruthy()
    })
  })
  describe('when version is missing', () => {
    it('returns false', () => {
      const article = {
        body: '[]'
      }
      expect(isV2(article)).toBeFalsy()
    })
  })
  describe('when body is missing', () => {
    it('throws TypeError', () => {
      const article = {}
      expect(() => { isV2(article) }).toThrow()
    })
  })
})

describe('createInitialBlocks', () => {
  describe('when call return value', () => {
    const blocks = createInitialBlocks()
    test('have paragraph', () => {
      expect(blocks.find((block) => block.type === 'Paragraph')).toBeTruthy()
    })
    test('length is one', () => {
      expect(blocks).toHaveLength(1)
    })
  })
})
