import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminPanel({ navigation }) {
  const [hastaNumarasi, setHastaNumarasi] = useState("");
  const [hastaVeri, setHastaVeri] = useState(null);

  const tahlilSirasi = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"];

  const hastaBilgileriniGetir = async () => {
    const hastaRef = doc(db, "hastalar", hastaNumarasi);
    const hastaDoc = await getDoc(hastaRef);

    if (hastaDoc.exists()) {
      setHastaVeri(hastaDoc.data());
    } else {
      console.log("Hasta bulunamadı!");
      setHastaVeri(null);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Text style={styles.title}>Admin Paneli</Text>
        <TextInput
          placeholder="Hasta Numarası Girin"
          value={hastaNumarasi}
          onChangeText={setHastaNumarasi}
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Hasta'yı Bul"
            onPress={hastaBilgileriniGetir}
            color="#6a1b9a"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Analiz Sayfasına Geç"
            onPress={() => navigation.navigate("AnalysisPage")}
            color="#6a1b9a"
          />
        </View>

        {hastaVeri && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Hasta Bilgileri</Text>
            <Text style={styles.text}>Ad: {hastaVeri.ad}</Text>
            <Text style={styles.text}>
              Doğum Tarihi: {new Date(hastaVeri.dogumTarihi.seconds * 1000).toLocaleDateString()}
            </Text>
            <Text style={styles.text}>Cinsiyet: {hastaVeri.cinsiyet}</Text>

            <Text style={styles.sectionTitle}>Tahlil Sonuçları</Text>
            {tahlilSirasi.map((tahlil) => {
              const tahlilVeri = hastaVeri.tahliller[tahlil];
              return (
                tahlilVeri && (
                  <View key={tahlil} style={styles.result}>
                    <Text style={styles.tahlilTitle}>{tahlil}</Text>
                    <Text style={styles.text}>Sonuç: {tahlilVeri.sonuc} g/L</Text>
                    <Text style={styles.text}>Durum: {tahlilVeri.durum || "N"}</Text>
                    {tahlilVeri.oncekiSonuclar.map((sonuc, index) => (
                      <Text key={index} style={styles.previousResult}>
                        Önceki Sonuç ({new Date(sonuc.tarih.seconds * 1000).toLocaleDateString()}): {sonuc.sonuc} g/L
                      </Text>
                    ))}
                  </View>
                )
              );
            })}
          </View>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContent: { flexGrow: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginVertical: 10, color: "#6a1b9a" },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: { marginBottom: 20, borderRadius: 5, overflow: "hidden" },
  card: { marginTop: 20, padding: 15, backgroundColor: "#fff", borderRadius: 10, elevation: 5 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginVertical: 10 },
  tahlilTitle: { fontSize: 18, fontWeight: "bold", color: "#444" },
  text: { fontSize: 16, marginVertical: 2, color: "#555" },
  result: { marginVertical: 10, padding: 10, backgroundColor: "#f4f4f4", borderRadius: 5 },
  previousResult: { fontSize: 14, color: "#777" },
});
