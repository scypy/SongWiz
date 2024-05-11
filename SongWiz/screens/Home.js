import React, { useState, useEffect, Component, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import TouchableScale from "react-native-touchable-scale";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchBar, List, ListItem, Avatar } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import color from "color";

export default function Home({ navigation }) {
  const [filteredData, setfilteredData] = useState([]);
  const [masterData, setmasterData] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    searchQuery();
    return () => {};
  }, []);

  const viewSong = (song) => {
    navigation.navigate("SongScreen", { data: song }); ///pass masterdata to SongScreen
  };

  const searchQuery = async () => {
    console.log("Running search");
    const raw = {
      userID: await AsyncStorage.getItem("userID"),
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const request = new Request("http://172.16.14.217:5000/search", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
    });

    fetch(request)
      .then((response) => {
        response.json().then((songs) => {
          setfilteredData(songs);
          setmasterData(songs);
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const ItemView = ({ item }) => {
    return (
      <View style={styles.itemStyle}>
        <ListItem
          onPress={() => {
            viewSong(item);
          }}
          containerStyle={{ backgroundColor: "black" }}
          Component={TouchableScale}
          friction={90}
          tension={100}
          activeScale={0.95}
        >
          <Avatar rounded source={require("../assets/Avatar.png")} />
          <ListItem.Content>
            <ListItem.Title style={styles.itemText}>
              {item.track_name} - {item.artist}
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: "white" }}>
              {item.genre}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
    );
  };

  const searchFilter = (text) => {
    if (text) {
      const newData = masterData.filter((item) => {
        const itemData = item.track_name
          ? item.track_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setfilteredData(newData);
      setSearch(text);
    } else {
      setSearch(text);
    }
  };

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 100,
      offset: 100 * index,
      index,
    }),
    []
  );
  const ItemSeparatorView = () => {
    return (
      <View
        style={{ height: 0.5, width: "100%", backgroundColor: "white" }}
      ></View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.container}>
        <SearchBar
          round="true"
          containerStyle={{
            backgroundColor: "black",
            borderWidth: 1,
            borderRadius: 5,
          }}
          placeholder="Search Song Name"
          value={search}
          onChangeText={(text) => searchFilter(text)}
        ></SearchBar>

        <FlatList
          data={filteredData}
          getItemLayout={getItemLayout}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
          initialNumToRender={10}
          windowSize={10}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={30}
          removeClippedSubviews={false}
          onEndReachedThreshold={0.1}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000000",
    // width: "100%",
  },
  inputText: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 5,
  },
  inputView: {
    marginTop: 0,
    justifyContent: "center",
  },
  searchContainer: {
    marginTop: 50,
    padding: 10,
  },
  itemStyle: {
    backgroundColor: "black",
  },
  itemText: {
    fontWeight: "bold",
    color: "white",
  },
  subItemStyle: {
    color: "white",
    backgroundColor: "black",
  },
});
