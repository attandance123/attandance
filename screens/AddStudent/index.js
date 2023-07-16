import { StyleSheet, Text, TouchableOpacity,Button,Image, View, TextInput, Alert, ScrollView, Linking } from 'react-native';
import { useEffect ,useState} from 'react';
import Camera from '../components/Camera';
import {fxn,db,storageRef} from '../../firebaseConfig'
import { collection,addDoc,setDoc,doc,getDoc} from 'firebase/firestore';
import { uploadBytes,getDownloadURL } from 'firebase/storage';
import { getDefaultEmulatorHostnameAndPort } from '@firebase/util';
import { Link } from '@react-navigation/native';

//const id = "pfqDEgH16D3F2aaLEVSx"
const AddStudent=()=>{
    const [showCamera,setShowSamera] = useState(false)
    const [photo,setPhoto] = useState()
    const [imageUrl,setImgUrl] = useState('')
    const [loading,setLoading] = useState()
    const [name,setName] = useState('')
    const [attn,setAttn] = useState()
    const [studentId,setStudentId] = useState('')
    const [islogedIn,setLogin]= useState(false)
    const [adminId,setadminId] = useState('')
    const [attnDetails,setDetails] = useState([])
    const [adminpass,setadminpass] = useState('')
    useEffect(()=>{
        if(photo){
            setShowSamera(!showCamera)
        }
    },[photo])
    const uploadImage = async ()=>{
        setLoading(true)
        if(photo){
        const response = await fetch(photo?.uri)
        const blob = await response.blob()
        var filename = photo?.uri.replace(/^.*[\\\/]/, '')
        //console.log(file)
        uploadBytes(storageRef(filename), blob).then((snapshot) => {
            console.log('Uploaded a blob or file!',snapshot);
            Alert.alert("Uploaded File")
            // getDownloadURL(storageRef(filename)).then((url)=>{
            //     console.log(url)
            //     setImgUrl(url)
            // })
            }).catch((err)=>{
                console.log('Failed a blob or file!',err);
            })
        }else{
            Alert.alert('please Click a picture')
        }
        return
    }
    const addSample=async ()=>{
        if(name){
        await uploadImage()

         try {
            const docRef = doc(db, "users", name );
             await setDoc(docRef, {
            Name: name,
            ImageName: photo?.uri.replace(/^.*[\\\/]/, ''),
            Attandance:0,
            array:[],
            isLoggedIn:false,
          }).then((data)=>{
           // Alert.alert('Your Student Id',data)
            console.log("datakartik",data)
          })
         // A
          //console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
    }else{
        Alert.alert('please Enter Name')
    }
    setLoading(false)
    }
    const GetStudentDetails=async()=>{
        if(studentId){
            const docRef = doc(db, "users", studentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
            console.log("Document data:", docSnap.data().Attandance);
                setAttn(docSnap.data().Attandance)
                console.log(docSnap.data().array)
                setDetails(docSnap.data().array)
            } else {
            // docSnap.data() will be undefined in this case
            Alert.alert("No such document!");
            }
        }else{
            Alert.alert("please Enter Student Id")
        }

    }
    const Login=async()=>{
        setLoading(true)
        if(adminId && adminpass){
            const docRef = doc(db, "Admin", "login");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data().Attandance);
                    if(docSnap.data().id == adminId && docSnap.data().password == adminpass){ 
                        setLogin(true)
                    }else{
                        Alert.alert("Wrong Credentials");
                    }
                } else {
                // docSnap.data() will be undefined in this case
                Alert.alert("No such document!");
                }
        }else{
            Alert.alert("Enter details")
        }
        setLoading(false)
    }
    const maps=(latitude,longitude)=>{
        console.log(latitude,longitude)
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        Linking.openURL(url)
          .catch(err => console.error('An error occurred', err));
    }
    return(
        !islogedIn?
        <View style={{flex:1,backgroundColor:'#fff',alignItems:'center'}}>
            <TextInput
                placeholder='Enter Admin id'
                style={styles.Input}
                value={adminId}
                onChangeText={(txt)=>setadminId(txt)}
            />
             <TextInput
                placeholder='Enter Admin pass'
                style={styles.Input}
                value={adminpass}
                onChangeText={(txt)=>setadminpass(txt)}
            />
             <TouchableOpacity style={[styles.Button,loading&&{backgroundColor:"#707070"}]} disabled={loading}  onPress={()=>Login()}>
                <Text style={[ {color:"#fff"},]}>Login</Text>
            </TouchableOpacity>
        </View>
        :
        <View style={[styles.Parent,!showCamera&&{  alignItems:'center',backgroundColor:"#FFF"}]}>
            {!showCamera?
            <>
             <TextInput
                placeholder='Enter Student Name'
                style={styles.Input}
                value={name}
                onChangeText={(txt)=>setName(txt)}
            />
            <TouchableOpacity style={styles.Button} onPress={()=>setShowSamera(true)}>
                <Text style={{color:"#fff"}}>Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.Button,loading&&{backgroundColor:"#707070"}]} disabled={loading} onPress={()=>addSample()}>
                <Text style={[ {color:"#fff"},]}>Add Student</Text>
            </TouchableOpacity>
            <View style={{width:'100%',borderWidth:1,margin:30}}/>
            <TextInput
                placeholder='Enter Student Id'
                style={styles.Input}
                onChangeText={(txt)=>setStudentId(txt)}
                value={studentId}
            />
            <TouchableOpacity style={[styles.Button,{width:200}]} onPress={()=>GetStudentDetails()}>
                <Text style={{color:"#fff"}}>Check Attandance</Text>
            </TouchableOpacity>
            <Text>Attandance- {attn}</Text>
            <ScrollView style={{flex:1,width:'100%'}} contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
                
                {attnDetails?.map((item,index)=>{
                   return <View key={index} style={{marginVertical:10}}>      
                    <Text>Date: {item.Date}</Text>
                    <Text style={{color:"blue"}} onPress={()=>maps(item.location.coords?.latitude,item.location.coords?.longitude)}>Location</Text>
                    </View>

                })}
            </ScrollView>
            </>:<Camera setPhoto={setPhoto}/>}
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
        paddingLeft:10,
        marginTop:50
    }
})
export default AddStudent