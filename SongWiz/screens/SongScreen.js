import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import React, { useState, useEffect, Component, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  VirtualizedList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import { List, ListItem } from "react-native-elements";
export default function SongScreen(props) {
  const { data } = props.route.params;
  const [songDetails, setSongDetails] = useState([]);
  const [recommendedSongs, setRecommendations] = useState([]);
  const [recID, setRecID] = useState([]);

  useEffect(() => {
    getSongDetails();
    getRecommendations();
    return () => {};
  }, []);
  AsyncStorage.setItem("songID", data.id.toString());
  const getSongDetails = async () => {
    console.log("Running search");
    const raw = {
      songID: await AsyncStorage.getItem("songID"),
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const request = new Request("http://172.16.14.217:5000/song", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
    });

    fetch(request).then((response) => {
      response.json().then((songdata) => {
        setSongDetails(songdata);
      });
    });
  };

  const displayJoy = (item) => {
    if (item.joy) {
      return (
        <View>
          <Text style={[styles.toneBody, { color: "yellow" }]}>
            Joy: {(Math.round(item.joy * 100 * 100) / 100).toFixed(2)}
            {"%"} {"   "}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const displayAnger = (item) => {
    if (item.anger) {
      return (
        <View>
          <Text style={[styles.toneBody, { color: "red" }]}>
            Anger: {(Math.round(item.anger * 100 * 100) / 100).toFixed(2)}
            {"%"} {"   "}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const displayConfident = (item) => {
    if (item.confident) {
      return (
        <View>
          <Text style={[styles.toneBody, { color: "cyan" }]}>
            Confident:{" "}
            {(Math.round(item.confident * 100 * 100) / 100).toFixed(2)}
            {"%"} {"   "}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const displayAnalytic = (item) => {
    if (item.analytical) {
      return (
        <View>
          <Text style={[styles.toneBody, { color: "darkgoldenrod" }]}>
            Analytical:{" "}
            {(Math.round(item.analytical * 100 * 100) / 100).toFixed(2)}
            {"%"} {"   "}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const displayFear = (item) => {
    if (item.fear) {
      return (
        <View>
          <Text style={[styles.toneBody, { color: "seashell" }]}>
            Fear: {(Math.round(item.fear * 100 * 100) / 100).toFixed(2)}
            {"%"} {"   "}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const displaySadness = (item) => {
    if (item.sadness) {
      return (
        <View>
          <Text style={[styles.toneBody, { color: "blue" }]}>
            Sadness: {(Math.round(item.sadness * 100 * 100) / 100).toFixed(2)}
            {"%"} {"   "}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const displayTentative = (item) => {
    if (item.tentative) {
      return (
        <View>
          <Text style={[styles.toneBody, { color: "pink" }]}>
            Tentative:
            {(Math.round(item.tentative * 100 * 100) / 100).toFixed(2)}
            {"%"} {"   "}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const getRecommendations = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = {
      search: data.track_name,
    };

    const request = new Request("http://172.16.14.217:5000/recommend", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
    });

    fetch(request).then((response) => {
      response.json().then((recommendations) => {
        setRecommendations(recommendations);
      });
    });
  };
  const likeSong = async () => {
    console.log("LIKE");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = {
      userID: await AsyncStorage.getItem("userID"),
      songID: await AsyncStorage.getItem("songID"),
      rating: 1,
      timestamp: Date.parse(new Date().toString()),
    };

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    fetch("http://172.16.14.217:5000/rating", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  const dislikeSong = async () => {
    console.log("DISLIKE");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = {
      userID: await AsyncStorage.getItem("userID"),
      songID: await AsyncStorage.getItem("songID"),
      rating: -1,
      timestamp: Date.parse(new Date().toString()),
    };

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    fetch("http://172.16.14.217:5000/rating", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };
  const Item = ({ item }) => (
    <View style={styles.detailView}>
      <Text style={styles.pageHeader}>Lyrics:</Text>
      <Text style={styles.pageBody}>{item.lyrics}</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {displayJoy(item)}
        {displayAnger(item)}
        {displayConfident(item)}
        {displayFear(item)}
        {displayTentative(item)}
        {displayAnalytic(item)}
        {displaySadness(item)}
      </View>
      <Text style={{ color: "white", fontSize: 12 }}>Rate:</Text>
      <View style={styles.ratingsBtn}>
        <Button title="Like" color="green" onPress={() => likeSong()}></Button>
        <Button
          title="Dislike"
          color="red"
          onPress={() => dislikeSong()}
        ></Button>
      </View>
      <View>
        <Text style={styles.pageHeader}>Recommended: </Text>
        <View style={{ flexDirection: "column" }}>
          <Text
            style={[
              styles.pageBody,
              {
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 5,
                marginBottom: 5,
              },
            ]}
          >
            {JSON.stringify(recommendedSongs[3]["Name"])}
          </Text>

          <Text
            style={[
              styles.pageBody,
              {
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 5,
                marginBottom: 5,
              },
            ]}
          >
            {JSON.stringify(recommendedSongs[1]["Name"])}
          </Text>
          <Text
            style={[
              styles.pageBody,
              {
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 5,
                marginBottom: 5,
              },
            ]}
          >
            {JSON.stringify(recommendedSongs[2]["Name"])}
          </Text>
        </View>
      </View>
    </View>
  );
  const ItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "white",
          borderBottomColor: "white",
          borderBottomWidth: 1,
        }}
      ></View>
    );
  };
  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("../assets/song-gradient.png")}
          style={styles.backgroundImage}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            locations={[0.1, 1.1]}
            style={styles.gradient}
          />
          <View
            style={{
              flexDirection: "column",
              alignSelf: "flex-end",
              paddingLeft: 15,
            }}
          >
            <Text style={{ color: "white", opacity: 0.5 }}>Song</Text>
            <Text style={styles.headerStyle}>{data.track_name}</Text>
            <Text style={{ color: "white", opacity: 0.5 }}>Artist</Text>
            <Text style={styles.artist}>{data.artist}</Text>
            <Text style={{ color: "white", opacity: 0.5 }}>Genre</Text>
            <Text style={styles.genre}>{data.genre}</Text>
            {/* render from useState */}
          </View>
        </ImageBackground>
        {/* <VirtualizedList> */}
        <FlatList
          data={songDetails}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={Item}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  headerStyle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    paddingBottom: 1,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  pageHeader: {
    fontWeight: "bold",
    color: "white",
    fontSize: 24,
    marginBottom: 2,
  },
  pageBody: {
    color: "white",
    fontSize: 12,
    marginBottom: 5,
  },
  toneBody: {
    fontSize: 12,
    marginTop: 5,
  },
  artist: {
    fontWeight: "bold",
    color: "white",
    paddingBottom: 3,
  },
  genre: {
    fontWeight: "bold",
    color: "white",
    paddingBottom: 15,
  },
  backgroundImage: {
    flex: 1,
    minHeight: 280,
    flexDirection: "row",
  },
  ratingsBtn: {
    marginLeft: 50,
    marginRight: 50,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gradient: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  detailView: {
    flex: 1,
    margin: 15,
  },
});
