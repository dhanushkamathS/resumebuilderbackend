
const {personalDetailCreator,educationCreator,projectsSection,experienceCreator,achievementCreator,skillsCreator,createTexFile,createPdfAsync,isFileExistsAsync} = require('../util/util')
const {latexHeader} = require('../util/constant')
const path = require('path');

const createPdf = async(req,res) =>{

    let {data} = req.body
  
    // let data = {"personalDetail":{"firstName":"dhanush","lastName":"kamath","email":"dhanushkamath01@gmail.com","phoneNo":"+91919535434458","github":"https://github.com/dhanushkamathS","linkedin":"https://www.linkedin.com/in/dhanushkamaths/"},"experience":[{"company":"verzeo","role":"backend","location":"bafgssk","date":"2018 - 292","points":["hddhhd dhdhh dhdhhd","dhdhhd hdhdhhddh hhddhhd dh hdh h","dddhdhhd dhhdhdhhd dhdh dhdhh h"]},{"company":"aaaaaaaaaaa","role":"aaaaaaaaaaaaa","location":"saadsdsd","date":"1233","points":["dddddddddddddddddddddddd"]}],"education":[{"cllgName":"jain","course":"B.tech","location":"indis","year":"2003"},{"cllgName":"jai hinf","course":"jaina","location":"banfahah","year":"219 -202"}],"projects":[{"projectName":"ddddd","tech":"ddddd","link":"https://optimhire.com/client/dp/1340618","points":["ddddddd","dddddddd","ddddddd"]},{"projectName":"ddddddddddd","tech":"ddddddd","link":"https://optimhire.com/client/dp/1340618","points":["dasdfeferfefe","feferfregergerg","rgeregregwefg gergergregr"]}],"achievements":[{"name":"ddddddddddddddd","points":["dddddddddddddd","dddddddddd","ddddddddd"]},{"name":"dddddddddd","points":["dddddddddd","ddddddddddddddddf","fhjefgvrvfrefgher"]}],"skills":[{"skillName":"dkajdjhfbgv gfv","skillValue":"c+,jaia,dokcke"},{"skillName":"ffbffb","skillValue":"aknfbhvf fhvghf"}]}
    let personalDetail = personalDetailCreator(data['personalDetail'])
    let education = educationCreator(data['education'])
    let experience = experienceCreator(data['experience'])
    let project = projectsSection(data['projects'])
    let achievement = achievementCreator(data['achievements'])
    let skills = skillsCreator(data['skills'])

     let template = 
    `
    ${latexHeader}
    \\begin{document}
    ${personalDetail}
    ${education}
    ${experience}
    ${project}
    ${achievement}
    ${skills}
    \\end{document}
    `

    try {
        const response = await createTexFile(template)
        const status = await createPdfAsync(response?.id)
        if(status.success){
            console.log(`file-id : ${response.id}`)
            return res.json({status:'success',id:response.id})
        }

    } catch (error) {
        console.log(error)
        return res.send({msg:"something went wrong, try again later",status:'failure'})
    }
}

const getFile = async (req, res) => {
  
  try {
    const {id} = req.query
  if(id == null || id == undefined){
       return res.json({status:'failure',msg:'id missing or invalid'})
  }
  const filePath = path.resolve(__dirname,'..','pdfFiles',`${id}.pdf`);
  const isFileExist = await isFileExistsAsync(filePath)

  if(isFileExist){
    //   // Set the appropriate headers for the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=your-file.pdf');
        res.sendFile(filePath)
  }
  else{
    res.send({msg:"something went wrong, try again later",status:'failure'});
  }

  // Send the PDF file
  } catch (error) {
    res.send({msg:"something went wrong, try again later",status:'failure'})
    console.log('ddd')
  }
}

const setEmail = async (req,res) =>{
    try {
      const {pdfId,email,data} = req.body
      const options = {
      method: 'POST',
      body: JSON.stringify({pdfId,email,data}),
      headers: { 'Content-Type': 'application/json' }
      }
      const response = await fetch("https://skjetlpadbmluieqcnlm.supabase.co/functions/v1/getemail",options)
      const value = await response.json()
      return res.send(value)
    } catch (error) {
        res.send({msg:"something went wrong, try again later",status:'failure'})
        console.log('ddd')
    }
}


module.exports = {
    createPdf,
    getFile,
    setEmail
};