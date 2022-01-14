import mongoose from 'mongoose'

const { model, Schema, Types } = mongoose

const fileSchema = new Schema({
	imageUrl: {
		type: String,
		required: true
	},
	imageExt: {
		type: String,
		required: true
	},
	dateOfUpload: {
		type: Date,
		default: new Date()
	},
})

export default model('files', fileSchema)