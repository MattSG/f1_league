declare module 'emoji-flags' {
  const emojiFlags: {
    countryCode: (iso: string) => { code: string; emoji: string; unicode: string; name: string } | undefined
  }
  export default emojiFlags
}

