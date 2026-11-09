import './DraftPage.css'
import { type ChangeEvent, type FC, type FormEvent, useEffect, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { ROUTES } from '../Routes'
import { DEFAULT_IMAGE, DEFAULT_VIDEO, parseNumber } from '../modules/beamsApi'
import type { AppDispatch, RootState } from '../store'
import { createDraft, getDraft, publishDraft } from '../slices/draftSlice'
import { Loader } from '../components/Loader'

const DraftPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)
  const { draft, loading, error } = useSelector((state: RootState) => state.draft)

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
    if (isAuthenticated) {
      dispatch(getDraft())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(draft?.image_url || DEFAULT_IMAGE)
      return
    }
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile, draft])

  useEffect(() => {
    if (!videoFile) {
      setVideoPreview(draft?.video_url || DEFAULT_VIDEO)
      return
    }
    const url = URL.createObjectURL(videoFile)
    setVideoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [videoFile, draft])

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => setImageFile(event.target.files?.[0] ?? null)
  const handleVideo = (event: ChangeEvent<HTMLInputElement>) => setVideoFile(event.target.files?.[0] ?? null)

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !imageFile || !videoFile) {
      return
    }
    const action = await dispatch(createDraft({ name: name.trim(), image: imageFile, video: videoFile }))
    if (createDraft.fulfilled.match(action)) {
      setImageFile(null)
      setVideoFile(null)
    }
  }

  const handlePublish = async (event: FormEvent) => {
    event.preventDefault()
    const loadValue = parseNumber(load)
    const deflectionValue = parseNumber(deflection)
    if (!description.trim() || loadValue === undefined || deflectionValue === undefined) {
      return
    }
    const action = await dispatch(
      publishDraft({ description: description.trim(), load: loadValue, deflection: deflectionValue }),
    )
    if (publishDraft.fulfilled.match(action)) {
      navigate(`${ROUTES.FEED}/${action.payload.id}`)
    }
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Добавление</h1>
        <span className="lm-badge lm-badge--accent">{draft ? 'черновик' : 'новая'}</span>
      </header>

      {error && <Alert variant="danger" className="draft__error">{error}</Alert>}

      <Form className="draft" onSubmit={draft ? handlePublish : handleCreate}>
        <div className="draft__row">
          <Form.Group className="draft__field" controlId="draftImage">
            <Form.Label className="draft__label">Изображение</Form.Label>
            <label className="draft__media" htmlFor="draftImage">
              <img className="draft__preview" src={imagePreview} alt="Фото балки" />
            </label>
            <Form.Control hidden type="file" accept="image/*" disabled={!!draft} onChange={handleImage} />
          </Form.Group>
          <Form.Group className="draft__field" controlId="draftVideo">
            <Form.Label className="draft__label">Видео</Form.Label>
            <label className="draft__media" htmlFor="draftVideo">
              <video key={videoPreview} className="draft__preview" src={videoPreview} autoPlay muted loop playsInline />
            </label>
            <Form.Control hidden type="file" accept="video/*" disabled={!!draft} onChange={handleVideo} />
          </Form.Group>
        </div>

        <Form.Group className="draft__field" controlId="draftName">
          <Form.Label className="draft__label">Название</Form.Label>
          <Form.Control
            className="draft__input"
            value={draft ? draft.name : name}
            readOnly={!!draft}
            placeholder="Например, Двутавр 20Б1"
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Group>

        {draft ? (
          <>
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

            <Button className="lm-button" type="submit" disabled={loading}>
              Опубликовать
            </Button>
          </>
        ) : (
          <Button className="lm-button" type="submit" disabled={loading || !name.trim() || !imageFile || !videoFile}>
            Далее
          </Button>
        )}
      </Form>

      {loading && <Loader />}
    </>
  )
}

export default DraftPage
