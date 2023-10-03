import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { useState, useRef, useEffect } from 'react';
import * as Location from 'expo-location';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { app, database, storage } from './firebase'
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function App() {
  const [markers, setMarkers]= useState([])
  const [region, setRegion] = useState({
    latitude:55,
    longitude:12,
    latitudeDelta:20,
    longitudeDelta:20,
  })

  const mapView = useRef(null); // ref. til map view objektet
  const locationSubscription =useRef(null) // når vi lukker appen, skal den ikke lytte mere

  useEffect(() => {
    async function startListening(){
      let { status } = await Location.requestForegroundPermissionsAsync()
      if(status !== 'granted'){
        alert("ingen adgang til lokation")
        return
      }
      locationSubscription.current = await Location.watchPositionAsync({
        distanceInterval: 100,
        accuracy: Location.Accuracy.High
      }, (lokation) => {
        const newRegion = {
          latitude:lokation.coords.latitude,
          longitude:lokation.coords.longitude,
          latitudeDelta:20,
          longitudeDelta:20,
        }
        setRegion(newRegion) //flytter kortet til den nye lokation
        if(mapView.current){
          mapView.current.animateToRegion(newRegion)
        }
      })
    }
    startListening()
    return ()=>{
      if(locationSubscription.current){
        locationSubscription.current.remove()
      }
    }
  },[])

  async function addMarker(data){
    const {latitude,longitude} = data.nativeEvent.coordinate

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
  });

    if (!result.cancelled) {
        // Upload to Firebase
        const response = await fetch(result.uri);
        const blob = await response.blob();
        const storage = getStorage();
        const ref = ref(getStorage + new Date().toISOString());
        await ref.put(blob);

        const imageUrl = await ref.getDownloadURL();

        const newMarker = {
            coordinate: { latitude, longitude },
            key: data.timeStamp,
            title: "Great Place",
            image: imageUrl  // store the Firebase image URL
        }
        setMarkers([...markers, newMarker]);
    }
  }



  function onMarkerPressed(text){
    alert("you pressed" + text)
  }
  return (
    <View style={styles.container}>
      <MapView 
      style={styles.map} 
      region={region}
      onLongPress={addMarker}
      >
      {markers.map(marker =>(
        <Marker
          coordinate={marker.coordinate}
          key={marker.key}
          title={marker.title}
          onPress={() => onMarkerPressed(marker.title)}
          >
          {marker.image && <Image source={{ uri: marker.image }} style={{ width: 50, height: 50 }} />}  // Render the image if available
      </Marker>
      ))
      
      }
      </MapView>
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
  map: {
    width:'100%',
    height:'100%',
  },
});

/*
Opgaver:
Følg video 1,2,3,4 og implementér dette i din egen app


Lav en foto-app, hvor brugeren kan knytte et billede til en bestemt map-lokation /////DONE
Appen skal vise et map                                                           /////DONE
Brugeren skal kunne tilføje en Map Marker ved at long-presse på kortet           /////DONE
Efter long-press skal man kunne vælge et billede fra Photos                      /////DONE
Når man har valgt billede, skal det uploades til Firebase Storage                /////DONE
Info om Marker (GPS) skal gemmes i Firebase Firestore                            X
Map skal vise alle Markers, som er gemt i Firebase Firestore                     X
Når man trykker på en Marker, skal det tilhørende billede vises.                 X

Udfordring:
Tillad brugeren at tilføje flere billeder til samme Marker                       X


Upload Github link til Fronter.                                                  X

*/
