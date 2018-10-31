import { createInitialBlocks } from '@/utils/article'

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
