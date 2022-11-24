import { FC } from 'react'

import { SvgActionCheck, SvgActionClose } from '@/assets/icons'

import { ListItem, StyledList, TickWrapper } from './YppAuthorizationRequirementsStep.styles'

type Requirment = {
  text: string
  fulfilled: boolean
}

type YppAuthorizationRequirementsStepProps = {
  requirments: Requirment[]
}

export const YppAuthorizationRequirementsStep: FC<YppAuthorizationRequirementsStepProps> = ({ requirments }) => {
  return (
    <StyledList>
      {requirments.map((item) => (
        <ListItem key={item.text} as="li" variant="t200" color="colorText">
          <TickWrapper fulfilled={item.fulfilled}>
            {item.fulfilled ? <SvgActionCheck /> : <SvgActionClose />}
          </TickWrapper>
          {item.text}
        </ListItem>
      ))}
    </StyledList>
  )
}