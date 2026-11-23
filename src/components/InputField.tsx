import './InputField.css'
import type { FC } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { applySearchValue, getBeamsList, setSearchValue } from '../slices/beamsSlice'

interface Props {
  value: string
  loading?: boolean
}

export const InputField: FC<Props> = ({ value, loading }) => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Form
      className="inputField"
      onSubmit={(event) => {
        event.preventDefault()
        dispatch(applySearchValue())
        dispatch(getBeamsList())
      }}
    >
      <Form.Control
        className="inputField__input"
        inputMode="decimal"
        value={value}
        placeholder="Прогиб до, мм"
        onChange={(event) => dispatch(setSearchValue(event.target.value))}
      />
      <Button className="lm-button inputField__button" type="submit" disabled={loading}>
        Найти
      </Button>
    </Form>
  )
}

export default InputField
