import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Dashboard() {
  const [hastaNumarasi, setHastaNumarasi] = useState("");
  const [hastaVeri, setHastaVeri] = useState(null);

  const belirleDurumRenk = (durum) => {
    switch (durum) {
      case "D":
        return styles.dusukDurum;
      case "Y":
        return styles.yuksekDurum;
      default:
        return styles.normalDurum;
    }
  };

  const belirleDurum = (sonuc, referans) => {
    // Sadece sayısal kısmı al, g/L'yi çıkar
    const referansDegerleri = referans.split(" - ").map((val) => parseFloat(val));
    
    const min = referansDegerleri[0];
    const max = referansDegerleri[1];
  
    if (sonuc < min) return "D"; // Düşük
    if (sonuc > max) return "Y"; // Yüksek
    return "N"; // Normal
  };

  const hastaNumarasiniGetir = async () => {
    const hastaRef = doc(db, "hastalar", hastaNumarasi);
    const hastaDoc = await getDoc(hastaRef);

    if (hastaDoc.exists()) {
      const veri = hastaDoc.data();
      Object.keys(veri.tahliller).forEach((tahlil) => {
        const sonuc = veri.tahliller[tahlil].sonuc;
        const referans = veri.tahliller[tahlil].referansAraligi;
        veri.tahliller[tahlil].durum = belirleDurum(sonuc, referans);
      });
      setHastaVeri(veri);
    } else {
      console.log("Hasta bulunamadı!");
      setHastaVeri(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hasta Tahlil Sonuçları</Text>
      <TextInput
        label="Hasta Numarası"
        value={hastaNumarasi}
        onChangeText={setHastaNumarasi}
        style={styles.input}
      />
      <Button mode="contained" onPress={hastaNumarasiniGetir} style={styles.button}>
        Sorgula
      </Button>

      {hastaVeri && (
        <Card style={styles.card}>
          <Card.Title
            title={`Hasta Adı: ${hastaVeri.ad}`}
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            {["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"].map((tahlil) => {
              if (!hastaVeri.tahliller[tahlil]) return null;
              return (
                <View key={tahlil} style={styles.tahlilContainer}>
                  <Text style={styles.tahlilTitle}>{tahlil}</Text>
                  <Text style={belirleDurumRenk(hastaVeri.tahliller[tahlil].durum)}>
                    Mevcut Sonuç: {hastaVeri.tahliller[tahlil].sonuc} g/L (
                    {hastaVeri.tahliller[tahlil].durum})
                  </Text>
                  {hastaVeri.tahliller[tahlil].oncekiSonuclar &&
                    hastaVeri.tahliller[tahlil].oncekiSonuclar.map((onceki, index) => (
                      <Text key={index} style={styles.oncekiSonuc}>
                        Önceki Sonuç:{" "}
                        {new Date(onceki.tarih.seconds * 1000).toLocaleDateString()} -{" "}
                        {onceki.sonuc} g/L
                      </Text>
                    ))}
                </View>
              );
            })}
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8ff", // Hafif gri arkaplan
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4a148c", // Mor renk
  },
  input: {
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6A1B9A", // Mor renk
    marginBottom: 20,
  },
  card: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "#fff", // Beyaz kart arkaplanı
    padding: 10,
    elevation: 4, // Hafif gölge
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tahlilContainer: {
    marginBottom: 15,
  },
  tahlilTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dusukDurum: {
    fontSize: 16,
    color: "red",
  },
  normalDurum: {
    fontSize: 16,
    color: "green",
  },
  yuksekDurum: {
    fontSize: 16,
    color: "orange",
  },
  oncekiSonuc: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
  },
});
