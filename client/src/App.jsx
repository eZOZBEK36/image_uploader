import axios from 'axios'
import { useState } from 'react'
import IMG from './assets/image.svg'

const API_URL = 'https://img-uploader.herokuapp.com/api'
const api = axios.create({ baseURL: API_URL })

const App = () => {
	const [ loading, setLoading ] = useState(false)
	const [ loadinProgress, setLoadingProgress ] = useState(0)
	const [ imageLoaded, setImageLoaded ] = useState(false)
	const [ imageDatas, setImageDatas ] = useState({})
	const dragHandler = e => {
		e.preventDefault()
		e.stopPropagation()
	}

	const defaultDatas = () => {
		setImageLoaded(false)
		setImageDatas({})
	}

	const dropHandler = e => {
		e.preventDefault()
		e.stopPropagation()

		if (e.target.closest('.drag-area')) {
			fileUploadHandler(...e.dataTransfer.files)
		}
	}
	const fileUploadHandler = async (file) => {
		if (navigator.onLine) {
			try {
				setLoading(true)
				const formData = new FormData()

				formData.append('file', file)

				const response = await api.post('/upload', formData, {
					onUploadProgress: progressEvent => {
						const totalLength = progressEvent.lengthComputable
							? progressEvent.total
							: progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length')

						setLoadingProgress(Math.round((progressEvent.loaded * 100) / totalLength))
					}
				})

				if (response.status === 200) {
					setImageLoaded(true)
					setImageDatas(response.data)
				}
			} catch (error) {
				console.log(error)
				setImageLoaded(false)
			} finally {
				setLoading(false)
			}
		} else alert('Check your Internet connection')
	}

	return (
		<>
			<section onDrop={ e => dropHandler(e) }
				onDragEnter={ e => dragHandler(e) }
				onDragLeave={ e => dragHandler(e) }
				onDragOver={ e => dragHandler(e) }
				className='uploader'>
				<div className="uploader__wrapper">
					{ !loading ? imageLoaded ?
						<div onDoubleClick={ defaultDatas } className='uploader__result result-uploader'>
							<div className="result-uploader__icon">
								<svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000">
									<path d="M0 0h24v24H0z" fill="none" />
									<path fill='#219653' d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
								</svg>
							</div>
							<div className="result-uploader__text">Uploaded Successfully!</div>
							<div className="result-uploader__image">
								<img src={ imageDatas.imageUrl } alt="Image" />
							</div>
							<div className="result-uploader__copy">
								<div className="result-uploader__copy-text">{ imageDatas.imageUrl }</div>
								<div onClick={ () => navigator.clipboard.writeText(imageDatas.imageUrl) } className="result-uploader__copy-button">Copy Link</div>
							</div>
						</div>
						:
						<div className="uploader__upload">
							<h2 className="uploader__title">Upload your image</h2>
							<div className="uploader__info">File should be Jpeg, Png,...</div>
							<div onDragLeave={ e => {
								e.preventDefault()
								e.stopPropagation()
								console.log(e)
							} } className="uploader__drag-area drag-area">
								<div className="drag-area__img">
									<img src={ IMG } alt="IMAGE" />
								</div>
								<div className="drag-area__text">
									Drag & Drop your image here
								</div>
							</div>
							<div className="uploader__or">Or</div>
							<div className="uploader__form">
								<label htmlFor="uploader-input" className='uploader__label'>Choose a file</label>
								<input multiple={ false } onChange={ e => {
									e.preventDefault()
									fileUploadHandler(...e.target.files)
								} } accept='image/*' type="file" name='files' id='uploader-input' />
							</div>
						</div>
						:
						<div className="uploader__loader loader">
							<div className="loader__text">Uploading...</div>
							<div className="loader__progress">
								<div style={ loadinProgress ? { width: `${loadinProgress}px` } : { width: '27%' } }></div>
							</div>
						</div>
					}
				</div>
			</section >
			<div className="c">
				created by <span>eZOZBEK36</span> - devChallenges.io
			</div>
		</>
	)
}

export default App