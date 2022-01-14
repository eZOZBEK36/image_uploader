import express from 'express'
import mongoose from 'mongoose'
import fileUpload from 'express-fileupload'
import filesRouter from './routes/files.route.js'

const app = express()
const PORT = process.env.PORT ?? 5000

app.use(async (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
	res.header('Access-Control-Allow-Headers', 'Content-Type')
	next()
})

app.use(fileUpload({}))
app.use('/api', filesRouter)
app.use(express.static('files'))

const start = async () => {
	try {
		app.listen(PORT, () => console.log('Listening on port: ' + PORT))

		await mongoose.connect(
			'mongodb+srv://ezozbek:vNwGb5SJ3KKug3m@loaded-images.nbyuv.mongodb.net/datas?retryWrites=true&w=majority',
			err => {
				if (err) new Error(err)

				console.log('Connected to DB')
			})
	} catch (e) { console.log(e) }
}

start()

export { PORT }