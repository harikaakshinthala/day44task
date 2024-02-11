import nodemailer from 'nodemailer'


const mail = (url,Useremail,content,subject) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port:"465",
        auth: {
            user:"dhanushms4021@gmail.com",
            pass:"jqcszxqobfjtcmyd"
        },
        tls:{
            rejectUnauthorized:true
        }
    
    })
    
    const messagesubject = subject
    const mailtext = `${content} - ${url}`
    
    const info = {
    from:"dhanushms4021@gmail.com",
    to:Useremail,
    subject:messagesubject,
    text:mailtext
    }
    
    transporter.sendMail(info,(err)=>{
    if(err){
        console.log("mail error ",err)
    }else{
        console.log("Email has been sent")
    }
    })
}

export default mail;
