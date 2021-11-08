import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

/** 
 * Send a mail to one or more adresses
 * @async
 * @function
 * @param {Object} config the configuration object
 * @param {string | Array.<string>} to the mail's adressee or an array of adressees
 * @param {string} subject the text sent into mail's subject field
 * @param {string} text mail's content
 * @return {Promise} resolves to the response object of nodemailer
 */
export default async function mailer(config) {
    const { to, subject, text } = config

    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    )
    
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

    try {
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'my.drugs.driven@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'MyDrugs <my.drugs.driven@gmail.com>',
            to,
            subject,
            text,
        }

        const result = await transport.sendMail(mailOptions)
        return result
    } catch(e) {
        return e
    }
}