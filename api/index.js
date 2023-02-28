const express = require('express')
const nodemailer = require('nodemailer')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'contact.coreego@gmail.com',
    pass: 'Hyun@kim85',
  },
})

app.post('/send-email', (req, res, next) => {
  const mailOptions = {
    from: req.body.email,
    to: 'contact.coreego@gmail.com',
    subject: 'Message de votre site web',
    text: req.body.message,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      res.status(400)
      res.json(error)
      next()
    } else {
      console.log('success email', info)
      res.json(info)
      next()
    }
  })
})


export default {
  path: '/api',
  handler: app,
}
