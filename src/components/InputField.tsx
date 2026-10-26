import './InputField.css'
import type { FC } from 'react'
import { Button, Form } from 'react-bootstrap'

interface Props {
  value: string
  setValue: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  buttonTitle?: string
}

export const InputField: FC<Props> = ({ value, setValue, onSubmit, placeholder, buttonTitle = 'Найти' }) => (
  <Form
    className="inputField"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit()
    }}
  >
    <Form.Control
      className="inputField__input"
      inputMode="decimal"
      value={value}
      placeholder={placeholder}
      onChange={(event) => setValue(event.target.value)}
    />
    <Button className="lm-button inputField__button" type="submit">
      {buttonTitle}
    </Button>
  </Form>
)

export default InputField
