import Router from 'express'
import { extname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { PORT } from '../index.js'
import File from '../models/Files.model.js'

const { randomInt } = await import('crypto')

const router = Router()

router.post('/upload', async (req, res) => {
	try {
		if (req.method !== 'POST') {
			return res.status(450).json({ message: 'UNCORRECT METHOD' })
		}

		const { file } = req.files

		if (!file.mimetype.match(/^image\/(png|jpg|svg|jpeg|webp)/)) {
			return res.status(400).json({ message: 'UNCORRECT FILE EXTENSION' })
		}

		const fileName = `photo-${randomInt(1000000, 9999999)}-${randomInt(10000, 99999)}-${randomInt(10000000, 99999999)}${extname(file.name)}`

		const fileDatas = await new File({
			imageUrl: `https://${req.hostname}/${fileName}`,
			imageExt: extname(file.name)
		})


		if (!existsSync('files')) {
			mkdirSync('files')
		}

		file.mv('files/' + fileName)

		await fileDatas.save()

		return res.status(200).json(fileDatas)
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: 'SERVER ERROR' })
	}
})

export default router
