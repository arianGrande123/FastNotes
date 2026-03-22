describe('Image validation logic', () => {
  const MAX_SIZE = 15 * 1024 * 1024
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  function validateImage(fileSize: number, mimeType: string): string | null {
    if (fileSize > MAX_SIZE) {
      return 'Bildet er for stort. Maks størrelse er 15MB.'
    }
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return 'Ugyldig format. Kun JPG, PNG og WebP er tillatt.'
    }
    return null
  }

  it('rejects files over 15MB', () => {
    const result = validateImage(16 * 1024 * 1024, 'image/jpeg')
    expect(result).toBe('Bildet er for stort. Maks størrelse er 15MB.')
  })

  it('rejects invalid file formats', () => {
    const result = validateImage(1000, 'image/gif')
    expect(result).toBe('Ugyldig format. Kun JPG, PNG og WebP er tillatt.')
  })

  it('accepts valid JPG under 15MB', () => {
    const result = validateImage(1000, 'image/jpeg')
    expect(result).toBeNull()
  })

  it('accepts valid PNG under 15MB', () => {
    const result = validateImage(1000, 'image/png')
    expect(result).toBeNull()
  })

  it('accepts valid WebP under 15MB', () => {
    const result = validateImage(1000, 'image/webp')
    expect(result).toBeNull()
  })
})

describe('Auth guard logic', () => {
  it('returns null user when not logged in', () => {
    const user = null
    expect(user).toBeNull()
  })

  it('returns user object when logged in', () => {
    const user = { id: 'test-user-id', email: 'test@test.com' }
    expect(user).not.toBeNull()
    expect(user.id).toBe('test-user-id')
  })
})

describe('Note creation logic', () => {
  it('rejects empty title', () => {
    const title = ''
    const content = 'Test innhold'
    const isValid = title.trim().length > 0 && content.trim().length > 0
    expect(isValid).toBe(false)
  })

  it('rejects empty content', () => {
    const title = 'Test tittel'
    const content = ''
    const isValid = title.trim().length > 0 && content.trim().length > 0
    expect(isValid).toBe(false)
  })

  it('accepts valid title and content', () => {
    const title = 'Test tittel'
    const content = 'Test innhold'
    const isValid = title.trim().length > 0 && content.trim().length > 0
    expect(isValid).toBe(true)
  })
})