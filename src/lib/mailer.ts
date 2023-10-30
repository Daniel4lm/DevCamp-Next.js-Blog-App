const MAIL_API_KEY = process.env.MAILGUN_API_KEY
const MAIL_DOMAIN = process.env.MAILGUN_DOMAIN_NAME || ''

import formData from 'form-data'
import Mailgun, { MailgunMessageData } from 'mailgun.js'

const mailgun = new Mailgun(formData)

const client = mailgun.client({ username: 'api', key: MAIL_API_KEY })

function sendEmail(messageData: MailgunMessageData) {

    return new Promise((resolve, rej) => {
        client.messages.create(MAIL_DOMAIN, messageData)
            .then((res) => {
                console.info('mailgun res ... ', res)
                resolve(res)
            })
            .catch((err) => {
                console.error('mailgun reject ...', err)
                rej(err)
            })
    })
}

export function sendConfirmationEmail(userEmail: string, username: string, token: string) {
    const messageData = {
        from: `InstaCamp Support <instacamp@${MAIL_DOMAIN}>`,
        to: userEmail,
        subject: 'InstaCamp - password reset instructions',
        html:
            `
            <p>
                Hi <b>${username}</b>. Someone(hopefully you) requested a password reset for your account. If this was not you,
                please disregard this email.
            </p>
            <p>You can reset your password by visiting the url below:</p>
            <a style="background-color: #348eda;
                        border-color: #348eda;
                        color: #fff;
                        border-radius: 55px;
                        display: inline-block;
                        font-size: 14px;
                        font-weight: bold;
                        margin: 0;
                        padding: 12px 25px;
                        text-decoration: none;
                        text-transform: capitalize;"
                href="${process.env.NEXT_PUBLIC_SITE_URL}/settings/reset-password/${username}?email=${userEmail}&token=${token}" 
                target="_blank"
            >
                Reset your Intacamp password
            </a>
            <br>
            <br>
            <p style="margin-top:15px;">For security reasons, this link is only valid for four hours.</p>

            <p><b>Thanks, InstaCamp Team</b></p>
            `
        ,
        'recipient-variables': JSON.stringify({
            'me': {
                link: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/${userEmail}/${token}`,
            },
        })
    }

    return sendEmail(messageData)
}

