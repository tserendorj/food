// Email

// notifactions

// otp
export const GenerateOtp = () => {
    // const otp = Math.floor(100000 + Math.random() * 900000 )
    const otp = 123456
    let expiry = new Date()
    expiry.setTime( new Date().getTime() + (30 * 60 * 1000))

    return {otp, expiry}
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
    const accountsId = 'AC337ca364f1027b9b6b5af9874f9b0937'
    const authToken = '0502dcbdb51a3d4a926c05f9186e0abc';
    const client = require('twilio')(accountsId, authToken);

    const response = await client.messages.create({
        body: `таны нэг удаагийн нэвтрэх код бол ${otp}`,
        from: '+976 9499 6636',
        // to: `+976${toPhoneNumber}`,
        to: toPhoneNumber
    })

    return response

}

// payment notification or emails