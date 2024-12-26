import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function GuideCreationPage() {
  const [guideName, setGuideName] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [minVal, setMinVal] = useState("");
  const [maxVal, setMaxVal] = useState("");
  const [geoMeanMin, setGeoMeanMin] = useState("");
  const [geoMeanMax, setGeoMeanMax] = useState("");
  const [meanMin, setMeanMin] = useState("");
  const [meanMax, setMeanMax] = useState("");
  const [confidenceMin, setConfidenceMin] = useState("");
  const [confidenceMax, setConfidenceMax] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateGuideName = (name) => {
    const regex = /^(IgA|IgM|IgG|IgG1|IgG2|IgG3|IgG4)_[a-zA-Z0-9]+_\d+$/;
    return regex.test(name);
  };

  const onSubmit = async () => {
    if (!validateGuideName(guideName)) {
      setErrorMessage("Kılavuz ismi formatı hatalı! Örn: IgA_deneme_0");
      return;
    }

    try {
      await setDoc(doc(db, "kilavuzlar", guideName), {
        min_age_months: parseInt(minAge, 10),
        max_age_months: parseInt(maxAge, 10),
        min_val: parseFloat(minVal),
        max_val: parseFloat(maxVal),
        geometric_mean_min: parseFloat(geoMeanMin),
        geometric_mean_max: parseFloat(geoMeanMax),
        mean_min: parseFloat(meanMin),
        mean_max: parseFloat(meanMax),
        confidence_interval_min: parseFloat(confidenceMin),
        confidence_interval_max: parseFloat(confidenceMax),
      });

      setSuccessMessage("Kılavuz başarıyla kaydedildi!");
      setErrorMessage("");
      // Tüm alanları sıfırla
      setGuideName("");
      setMinAge("");
      setMaxAge("");
      setMinVal("");
      setMaxVal("");
      setGeoMeanMin("");
      setGeoMeanMax("");
      setMeanMin("");
      setMeanMax("");
      setConfidenceMin("");
      setConfidenceMax("");
    } catch (error) {
      setErrorMessage("Kılavuz kaydedilirken bir hata oluştu.");
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Kılavuz Oluşturma</Text>

      <TextInput
        placeholder="Kılavuz İsmi (örn: IgA_deneme_0)"
        value={guideName}
        onChangeText={(text) => {
          setGuideName(text);
          setErrorMessage(
            !validateGuideName(text)
              ? "Geçerli bir kılavuz ismi giriniz!"
              : ""
          );
        }}
        style={styles.input}
      />
      <TextInput
        placeholder="Min Yaş (ay)"
        value={minAge}
        onChangeText={setMinAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Max Yaş (ay)"
        value={maxAge}
        onChangeText={setMaxAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Min Değer"
        value={minVal}
        onChangeText={setMinVal}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Max Değer"
        value={maxVal}
        onChangeText={setMaxVal}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Geometric Mean Min"
        value={geoMeanMin}
        onChangeText={setGeoMeanMin}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Geometric Mean Max"
        value={geoMeanMax}
        onChangeText={setGeoMeanMax}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Mean Min"
        value={meanMin}
        onChangeText={setMeanMin}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Mean Max"
        value={meanMax}
        onChangeText={setMeanMax}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Confidence Interval Min"
        value={confidenceMin}
        onChangeText={setConfidenceMin}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Confidence Interval Max"
        value={confidenceMax}
        onChangeText={setConfidenceMax}
        keyboardType="numeric"
        style={styles.input}
      />

      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}
      {successMessage ? (
        <Text style={styles.success}>{successMessage}</Text>
      ) : null}

      <Button title="Kılavuzu Kaydet" onPress={onSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: { marginBottom: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10 },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  success: { color: "green", marginBottom: 10, textAlign: "center" },
});
