const latex = require('node-latex')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');

const writeFilePromise = promisify(fs.writeFile);

//personal detail
const personalDetailCreator = (data) =>{


    if(data ==null){
        return ''
    }

    let template = 
    `
    \\begin{center}
    \\textbf{\\Huge \\scshape ${formatter(data?.firstName)} ${formatter(data?.lastName)}} \\\\ \\vspace{1pt}
    \\small ${formatter(data?.phoneNo)} $|$ \\href{mailto:x@x.com}{\\underline{${formatter(data?.email)}}} $|$ 
    \\href{${formatter(data?.linkedin)}}{\\underline{linkedin.com}} $|$
    \\href{${formatter(data?.github)}}{\\underline{github.com}}
    \\end{center}
    `

    return template
}


// {cllgName:'',course:'',location:'',year:''}
const educationCreator = (data) =>{
    if(data ==null || data.length == 0){
        return ''
    }

    let info = ``
    data.map((val)=>{
        info += `\\resumeSubheading {${formatter(val?.cllgName)}}{${formatter(val?.location)}} {${formatter(val?.course)}}{${formatter(val?.year)}}` + `\n`
    })

    let template = 
      `
   \\section{Education}
  \\resumeSubHeadingListStart
    ${info}
  \\resumeSubHeadingListEnd
    `

    return template

}

[{projectName:'',tech:'',link:'',points:['']}]

const projectsSection = (data) =>{
    if(data ==null|| data.length == 0){
        return ''
    }
    let projects = ``

    for(let i =0;i < data.length;i++){
        let point = ``

         data[i]['points'].map((val)=>{
            if(val.trim().length >0){
                point += `\\resumeItem{${formatter(val)}}` + `\n` 
            }
        })

        let project = `
        \\resumeProjectHeading {\\textbf{${formatter(data[i]?.projectName)}} $|$ \\emph{${formatter(data[i]?.tech)}}}{\\href{${formatter(data[i]?.link)}}{\\underline{link}}}
          ${
            point.trim().length > 0?
            `
            \\resumeItemListStart
                ${point}
            \\resumeItemListEnd
            `
            :
            ``
          }
       
        `

        projects += project + `\n`


    }


    let template = 
    `
    \\section{Projects}
    \\resumeSubHeadingListStart
        ${projects}
    \\resumeSubHeadingListEnd
    `

    return template

}
// {company:'',role:'',location:'',date:'',points:['']}
const experienceCreator = (data) =>{
     if(data ==null || data.length == 0){
        return ''
    }
     let experiences = ``

    for(let i =0;i < data.length;i++){
        let point = ``
        

         data[i]['points'].map((val)=>{
            if(val.trim().length >0){
                point += `\\resumeItem{${formatter(val)}}` + `\n` 
            }
        })

        let experience = `
        \\resumeSubheading {${formatter(data[i]?.company)} | ${formatter(data[i]?.role)}}{${formatter(data[i]?.date)}}{${formatter(data[i]?.location)}}{}
        ${
            point.trim().length > 0?
            `
            \\resumeItemListStart
                ${point}
            \\resumeItemListEnd
            `
            :
            ``
          }
        `

        experiences += experience + `\n`


    }


    let template = 
    `
    \\section{Experiences}
    \\resumeSubHeadingListStart
        ${experiences}
    \\resumeSubHeadingListEnd
    `

    return template
    
}


// {name:'',points:['']}
const achievementCreator = (data) =>{
     if(data ==null || data.length == 0){
        return ''
    }
     let achievements = ``

    for(let i =0;i < data.length;i++){
        let point = ``

         data[i]['points'].map((val)=>{
            if(val.trim().length >0){
                point += `\\resumeItem{${formatter(val)}}` + `\n` 
            }
        })

        let achievement = `
        \\resumeProjectHeading {\\textbf{${formatter(data[i]?.name)}}}{}
        ${
            point.trim().length > 0?
            `
            \\resumeItemListStart
                ${point}
            \\resumeItemListEnd
            `
            :
            ``
          }
        `

        achievements += achievement + `\n`


    }


    let template = 
    `
    \\section{Achievement}
    \\resumeSubHeadingListStart
        ${achievements}
    \\resumeSubHeadingListEnd
    `

    return template

}

// {skillName:'',skillValue:''}
const skillsCreator = (data) =>{

     if(data ==null|| data.length == 0){
        return ''
    }
     let skills = ``

    data.map((val)=>{
        skills += `\\textbf{${formatter(val?.skillName)}}{: ${formatter(val?.skillValue)}} \\\\` + `\n`
    })


    let template = 
    `
        \\section{Technical Skills}
    \\begin{itemize}[leftmargin=0.15in, label={}]
        \\small{\\item{
            ${skills}
        }}
    \\end{itemize}
    `

    return template

}

// function createTexFile(data, callback) {

//   const uuid = uuidv4();

//   fs.writeFile(`./temp/${uuid}.tex`, data, (err) => {
//     if (err) {
//       console.error('Error creating/writing to file:', err);
//       callback(err, null); // Pass the error to the callback
//     } else {
//       console.log('File created and data written successfully.');
//       callback(null, {status:'success',id:uuid}); // Pass the success value to the callback
//     }
//   });

// }

async function createTexFile(data) {
    try {
        const uuid = uuidv4();
        await writeFilePromise(`./temp/${uuid}.tex`, data);
        console.log('File created and data written successfully.');
        return {status:'Success',id:uuid};

    } catch (err) {
         console.error('Error creating/writing to file:', err);
         throw err;
    }
}



function createPdfPromise(id) {
  return new Promise((resolve, reject) => {
     const input = fs.createReadStream(`./temp/${id}.tex`)
     const output = fs.createWriteStream(`./pdfFiles/${id}.pdf`)
     const pdf = latex(input)

    pdf.pipe(output)
    pdf.on('error', err => {console.error(err);reject(err)})
    pdf.on('finish', () => {console.log('PDF generated!');resolve('success')})
  });
}

async function createPdfAsync(id) {
  try {
    await createPdfPromise(id);
    console.log('File created and data written successfully.');
    return {success:true};
  } catch (err) {
    console.error('Error creating/writing to file:', err);
    throw err;
  }
}


function isFileExists(path){
    return new Promise((resolve,reject)=>{
        fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File does not exist.');
            resolve(false)
        } else {
            console.log('File exists.');
            resolve(true)
        }
    });
    })
}

async function isFileExistsAsync(path){
    try {
        const val = await isFileExists(path)
        return val 
    } catch (error) {
        throw error
    }
}



const formatter = (val) =>{

      if(val == undefined || val == null){
        return ''
    }

    let updatedStr = val.replace(/[^\x00-\x7F]/g, "");;
    let targetChars = ['/\\/','%','$','#','&','^']

  // Iterate over each target character
  for (let i = 0; i < targetChars.length; i++) {
    const targetChar = targetChars[i];
    const replacementChar = `\\${targetChar}`

    // Check if the target character is present in the string
    if (updatedStr.includes(targetChar)) {
      // Replace all occurrences of the target character with the replacement character
      updatedStr = updatedStr.replace(new RegExp(targetChar, 'g'), replacementChar);
    }
  }

  return updatedStr;

}

module.exports ={
    personalDetailCreator,
    educationCreator,
    projectsSection,
    experienceCreator,
    achievementCreator,
    skillsCreator,
    createTexFile,
    createPdfAsync,
    isFileExistsAsync
}
