import './DraftPage.css'
import { type ChangeEvent, type FC, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../modules/beamsApi'

const DraftPage: FC = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [load, setLoad] = useState('')
  const [deflection, setDeflection] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE)
  const [videoPreview, setVideoPreview] = useState(DEFAULT_VIDEO)

  useEffect(() => {
    document.title = 'Добавление балки'
  }, [])

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(DEFAULT_IMAGE)
      return
    }
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  useEffect(() => {
    if (!videoFile) {
      setVideoPreview(DEFAULT_VIDEO)
      return
    }
    const url = URL.createObjectURL(videoFile)
    setVideoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [videoFile])

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => setImageFile(event.target.files?.[0] ?? null)
  const handleVideo = (event: ChangeEvent<HTMLInputElement>) => setVideoFile(event.target.files?.[0] ?? null)

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Добавление</h1>
        <span className="lm-badge lm-badge--accent">черновик</span>
      </header>

      <Form className="draft" onSubmit={(event) => event.preventDefault()}>
        <div className="draft__row">
          <Form.Group className="draft__field" controlId="draftImage">
            <Form.Label className="draft__label">Изображение</Form.Label>
            <label className="draft__media" htmlFor="draftImage">
              <img className="draft__preview" src={imagePreview} alt="Фото балки" />
            </label>
            <Form.Control className="draft__file" type="file" accept="image/*" onChange={handleImage} />
          </Form.Group>
          <Form.Group className="draft__field" controlId="draftVideo">
            <Form.Label className="draft__label">Видео</Form.Label>
            <label className="draft__media" htmlFor="draftVideo">
              <video key={videoPreview} className="draft__preview" src={videoPreview} autoPlay muted loop playsInline />
            </label>
            <Form.Control className="draft__file" type="file" accept="video/*" onChange={handleVideo} />
          </Form.Group>
        </div>

        <Form.Group className="draft__field" controlId="draftName">
          <Form.Label className="draft__label">Название</Form.Label>
          <Form.Control
            className="draft__input"
            value={name}
            placeholder="Например, Двутавр 20Б1"
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="draft__field" controlId="draftDescription">
          <Form.Label className="draft__label">Описание</Form.Label>
          <Form.Control
            as="textarea"
            className="draft__input draft__input--area"
            value={description}
            placeholder="Например, как балка ведёт себя под нагрузкой"
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Group>

        <div className="draft__row">
          <Form.Group className="draft__field" controlId="draftLoad">
            <Form.Label className="draft__label">Нагрузка, кН/м</Form.Label>
            <Form.Control
              className="draft__input"
              inputMode="decimal"
              value={load}
              onChange={(event) => setLoad(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="draft__field" controlId="draftDeflection">
            <Form.Label className="draft__label">Прогиб, мм</Form.Label>
            <Form.Control
              className="draft__input"
              inputMode="decimal"
              value={deflection}
              onChange={(event) => setDeflection(event.target.value)}
            />
          </Form.Group>
        </div>

        <Button className="lm-button" type="submit" disabled>
          Опубликовать
        </Button>
      </Form>
    </>
  )
}

export default DraftPage
