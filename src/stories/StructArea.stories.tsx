import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import StructArea from '../components/StructArea'

export default {
  title: 'StructArea',
  component: StructArea,
} as ComponentMeta<typeof StructArea>

export const Default: ComponentStory<typeof StructArea> = () => {
  const [content, setContent] = useState('')
  const handle = (e) => {
    setContent(e.target.value)
  }
  return (
    <StructArea
      minWidth={300}
      value={content}
      onChange={handle}
      struct={{
        foo: 'a',
        bar: 1,
        baz: false,
        burp: ['one'],
        beep: [{ fizz: 'buzz' }],
      }}
    />
  )
}
