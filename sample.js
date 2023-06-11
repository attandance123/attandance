import { StatusBar } from 'expo-status-bar';
import { useEffect ,useState} from 'react';
import * as firebase from "firebase/app"
import { StyleSheet, Text, TouchableOpacity,Button,Image, View } from 'react-native';
import {fxn,db,storageRef} from './firebaseConfig'
import { collection,addDoc } from 'firebase/firestore';
import { uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import {data,endpoints, MatchFace} from './endpoints'
import * as ImageManipulator from 'expo-image-manipulator';
export default function App() {
  const [image, setImage] = useState(null);
  const [resizedImage,setResizedImage] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
     
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri)
    }
  };
  const uploadImage = async (image) => {
  //  setUploading(true)
  //  const response = await fetch(image)
    // console.log(image)
  //  const blob2 = await response.blob()
    var re = /(?:\.([^.]+))?$/;
    console.log(image)
    const extension = image.split('.').pop()=='jpg'?'jpeg':image.split('.').pop()
    console.log(extension)
   // let data64=""
    ImageManipulator.manipulateAsync(image,[{ resize: { width: 300,height:300 } }],{ compress: 0.3, format: extension,base64:true },).then((data)=>{
      setResizedImage(data.uri)
      //data64 = data.base64
      //console.log(data)
      recognze(data.base64,image)
     // console.log(JSON.stringify(data))
      
    }).catch((err)=>{
      console.log(err)
    })
  
    // uploadBytes(storageRef(filename), blob).then((snapshot) => {
    //   console.log('Uploaded a blob or file!',snapshot);
    // });
    
    // var ref = firebase.storage().ref().child(filename).put(blob)
    // try {
    //     await ref;
    // } catch (e){
    //     console.log(e)
    // }
   // setUploading(false)
   // setImage(null);
} 
 const recognze=async(data64,image)=>{
  await MatchFace()

 }
  const call=async()=>{
    await MatchFace()
  
    // try {
    //   const docRef = await addDoc(collection(db, "users"), {
    //     first: "Ada",
    //     last: "Lovelace",
    //     born: 1815
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }
    
  }
   return (//<FaceDetection/>
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {resizedImage && <Image source={{ uri: resizedImage }} style={{ width: 200, height: 200 }} />}
      </View>
      <TouchableOpacity onPress={()=>  call()}>
      <Text >Ok Bro</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
