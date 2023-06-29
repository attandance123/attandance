import { StyleSheet,Alert, Text, TouchableOpacity,Button,Image, View, TextInput, Linking } from 'react-native';
import { useEffect ,useState} from 'react';
import Camera from '../components/Camera';
import { useNavigation } from '@react-navigation/native';
import {fxn,db,storageRef} from '../../firebaseConfig'
import { collection,addDoc ,doc,getDoc,updateDoc, arrayUnion,serverTimestamp,increment} from 'firebase/firestore';
import { uploadBytes,getDownloadURL } from 'firebase/storage';
import { MatchFace } from '../../endpoints';
import * as Location from 'expo-location';
const id = "pfqDEgH16D3F2aaLEVSx"
const Home=()=>{
    const [showCamera,setShowSamera] = useState(false)
    const [photo,setPhoto] = useState()
    const navigation=useNavigation()
    const [studentId,setStudentId] = useState('')
    const [imageUrl,setImgUrl] = useState('')
    const [attandance ,setAttandace] = useState(0)
    const [loading,setLoading] = useState()
    const [imageUrl2,setImgUrl2] = useState('')
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    useEffect(() => {
        GetLocation()
      }, []);
    const GetLocation= async ()=>{
 
        let { status ,canAskAgain} = await Location.requestForegroundPermissionsAsync();
        Location.enableNetworkProviderAsync()
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Linking.openSettings()
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({
            accuracy:Location.Accuracy.Highest
        });
        setLocation(location);
      
    }  
    const date = new Date();
    const getDownloadurl=async(filename)=>{
        console.log(filename)
        await getDownloadURL(storageRef(filename)).then((url)=>{
            // console.log(url)
            setImgUrl2(url)
            if(photo){
              uploadImage(url)
            }else{
                Alert.alert("Please Click Image")
            }
        }).catch((err)=>{
            setLoading(false)
            console.error(err)
        })
    }
    const GetStudentDetails=async()=>{
        const docRef = doc(db, "users", studentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().ImageName);
            setAttandace(docSnap.data().Attandance)
            await getDownloadurl(docSnap.data().ImageName)

        } else {
            setLoading(false)
        // docSnap.data() will be undefined in this case
        Alert.alert("No such document!");
        }

    }
    const uploadImage = async (imgurl2)=>{
      
        if(photo){
        const response = await fetch(photo?.uri)
        const blob = await response.blob()
        var filename = photo?.uri.replace(/^.*[\\\/]/, '')
        //console.log(file)
        uploadBytes(storageRef(filename), blob).then(async (snapshot) => {
            console.log('Uploaded a blob or file!',snapshot);
            Alert.alert("Uploaded File")
            await getDownloadURL(storageRef(filename)).then(async (url)=>{
                console.log(url)
                setImgUrl(url)
                console.log("BeforeCall\n",url+"\n"+imgurl2+"yyoyo")
             if(await MatchFace(url,imgurl2)){
                Alert.alert("Face Matched")
                const Ref = doc(db, "users", studentId);
                await updateDoc(Ref, {
                    Attandance: increment(1),
                    array:arrayUnion({Date:date.toLocaleString("en-US", {timeZone: 'Asia/Kolkata'}),time:Date.now(),location:location}),
                    

                  });
                  setLoading(false)
             }else{
                Alert.alert("Face Not Matched")
                setLoading(false)
             }
            })
            }).catch((err)=>{
                console.log('Failed a blob or file!',err);
                setLoading(false)
            })
            setPhoto('')
            setLoading(false)
        }else{
            Alert.alert('please Click a picture')
            setLoading(false)
        }
        
    }
    useEffect(()=>{
        if(photo){
            setShowSamera(!showCamera)
           // uploadImage()
        }
    },[photo])
    const AddAttandance=async()=>{
        if(location)
        {
            if(studentId){
                setLoading(true)
                await GetStudentDetails()
                
            }else{
                Alert.alert("Please Enter Id")
            }
        }else{
           // Alert.alert(errorMsg)
            GetLocation()
        }
    }
    return(
       
        <View style={[styles.Parent,!showCamera&&{  alignItems:'center',
        backgroundColor:"#FFF"}]}>
             {!showCamera?
             <>
            <TouchableOpacity style={styles.Button} onPress={()=>navigation.navigate("AddStudent")}>
                <Text style={{color:"#fff"}}>Add student</Text>
            </TouchableOpacity>
            <View style={{marginTop:60}}/>
            <TextInput
                placeholder='Enter Student Id'
                style={styles.Input}
                value={studentId}
                onChangeText={(txt)=>setStudentId(txt)}
            />
            <TouchableOpacity style={styles.Button} onPress={()=>setShowSamera(true)}>
                <Text style={{color:"#fff"}}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.Button,loading&&{backgroundColor:"#707070"}]} disabled={loading} onPress={()=>AddAttandance()}>
                <Text style={{color:"#fff"}}>Add Attandance</Text>
            </TouchableOpacity>
            </>
           : <Camera setPhoto={setPhoto}/>}
        </View>
    )
}
const styles=StyleSheet.create({
    Parent:{
        flex:1,
      
    },
    Button:{
        width:100,
        height:40,
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
        marginTop:20
    },
    Input:{
        backgroundColor:'#f5f5f5',
        width:'70%',
        height:50,
        borderRadius:10,
        paddingLeft:10
    }
})
export default Home