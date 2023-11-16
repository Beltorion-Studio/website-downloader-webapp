import express from 'express'
import { downloadedData } from '../controllers/getWebsite.js'

const router = express.Router()

router.post('/')

router.get('/:fileName', (req, res) => {
 const { fileName } = req.params
 if (!downloadedData) {
  res.status(400).json({ message: 'No file available for download' })
  return
 }

 res.setHeader('Content-Disposition', `attachment; filename=${fileName}.zip`)
 res.setHeader('Content-Type', 'application/zip')

 downloadedData.on('error', (err) => {
  res.status(500).json({ message: 'An error occurred while downloading the file' })
 })

 downloadedData.pipe(res)
})

export default router
