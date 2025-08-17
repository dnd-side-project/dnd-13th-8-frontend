import { motion } from 'framer-motion'
import styled from 'styled-components'

const TOGGLE_CONSTANTS = {
  WIDTH: 40,
  HEIGHT: 24,
  PADDING: 3,
  BUTTON_SIZE: 18,
} as const

interface ToggleSwitchProps {
  isOn: boolean
  setIsOn: (isOn: boolean | ((prev: boolean) => boolean)) => void
}

const ToggleSwitch = ({ isOn, setIsOn }: ToggleSwitchProps) => {
  return (
    <ToggleWrapper
      $isOn={isOn}
      role="switch"
      aria-checked={isOn}
      tabIndex={0}
      onClick={() => setIsOn((prev) => !prev)}
      onKeyDown={(e) => {
        if (['Enter', ' '].includes(e.key)) {
          setIsOn((prev) => !prev)
        }
      }}
    >
      <ToggleButton
        $isOn={isOn}
        variants={{
          off: { x: 0 },
          on: {
            x: TOGGLE_CONSTANTS.WIDTH - TOGGLE_CONSTANTS.BUTTON_SIZE - TOGGLE_CONSTANTS.PADDING * 2,
          },
        }}
        animate={isOn ? 'on' : 'off'}
        transition={{
          type: 'spring' as const,
          stiffness: 500,
          damping: 30,
        }}
      />
    </ToggleWrapper>
  )
}

export default ToggleSwitch

const ToggleWrapper = styled.div<{ $isOn: boolean }>`
  width: ${TOGGLE_CONSTANTS.WIDTH}px;
  height: ${TOGGLE_CONSTANTS.HEIGHT}px;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  border-radius: ${TOGGLE_CONSTANTS.HEIGHT / 2}px;
  padding: ${TOGGLE_CONSTANTS.PADDING}px;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const ToggleButton = styled(motion.div)<{ $isOn: boolean }>`
  width: ${TOGGLE_CONSTANTS.BUTTON_SIZE}px;
  height: ${TOGGLE_CONSTANTS.BUTTON_SIZE}px;
  background-color: ${({ theme, $isOn }) =>
    $isOn ? theme.COLOR['primary-normal'] : theme.COLOR['gray-400']};
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`
