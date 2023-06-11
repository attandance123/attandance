import axios from "axios"

export const endpoints={
    baseUrl:"",
    registerFace:"https://apivalidface2.p.rapidapi.com/regis/",
    validateFace:"https://apivalidface2.p.rapidapi.com/valid/",
    deleteFace:"https://apivalidface2.p.rapidapi.com/delete/",
    faceMatch:"https://face-verification2.p.rapidapi.com/faceverification"
}
export const data=(url,base64,name)=>{

    return  {
    method: 'GET',
    url: url,
    params: {
        regis: base64,
        save: name
    },
    headers: {
        'X-RapidAPI-Key': '3d7add3944mshe7b7dc6b544f6ecp14e15ajsn2ad5e2b0217c',
        'X-RapidAPI-Host': 'face-verification2.p.rapidapi.com'
    }
    }
}
export const MatchFace=async (url1='',url2='')=>{
            console.log(url1,url2)
            // const encodedParams = new URLSearchParams();
            // encodedParams.set('linkFile1', 'https://i.ds.at/PKrIXQ/rs:fill:750:0/plain/2022/11/08/Jordan-StraussInvisionAP.jpg');
            // encodedParams.set('linkFile2', 'https://pyxis.nymag.com/v1/imgs/e0a/79c/5671d6e6089515f706e9b2288d41d9e824-you-people.1x.rsquare.w1400.jpg');
            const encodedParams= {
                'linkFile1': url1,
                'linkFile2': url2 
            }   
    const options = {
      method: 'POST',
      url: 'https://face-verification2.p.rapidapi.com/faceverification',
      headers: {
        'content-type': 'multipart/form-data',
        'X-RapidAPI-Key': '3d7add3944mshe7b7dc6b544f6ecp14e15ajsn2ad5e2b0217c',
        'X-RapidAPI-Host': 'face-verification2.p.rapidapi.com'
      },
      data: encodedParams,
    };
    
    try {
        const response = await axios.request(options);
        console.log(response.data);
        if(response.data.data.similarPercent>0.8)
            return true
        return false
    } catch (error) {
        
        console.error(error);
        return false
    }
}