import { Meta, Story } from '@storybook/react'

import { tokenNumberToHapiBn } from '@/joystream-lib/utils'

import { NumberFormat, NumberFormatProps } from './NumberFormat'

export default {
  title: 'other/NumberFormat',
  component: NumberFormat,
  args: {
    value: 102930,
    format: 'dollar',
    variant: 't100-strong',
  },
  argTypes: {
    format: {
      control: { type: 'radio', options: ['dollar', 'full', 'short'] },
    },
    withToken: {
      control: { type: 'boolean' },
    },
  },
} as Meta<NumberFormatProps>

const Template: Story<Omit<NumberFormatProps, 'ref'>> = (args) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', padding: '200px' }}>
    <NumberFormat {...args} value={tokenNumberToHapiBn(args.value as number)} withToken />
    <NumberFormat {...args} value={args.value as number} withToken={false} />
  </div>
)

export const Regular = Template.bind({})
