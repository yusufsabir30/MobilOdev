import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { fetchGuidelines } from "../utils/firebase";
import { evaluateValuesByGuidelines } from "../utils/evaluation";

export default function AnalysisPage() {
  const [birthDate, setBirthDate] = useState("");
  const [values, setValues] = useState({
    IgA: "",
    IgM: "",
    IgG: "",
    IgG1: "",
    IgG2: "",
    IgG3: "",
    IgG4: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ageMonths, setAgeMonths] = useState(null);

  const calculateAgeInMonths = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    return (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  };

  const handleEvaluate = async () => {
    if (!birthDate) {
      alert("Lütfen doğum tarihini girin!");
      return;
    }

    setLoading(true);
    const guidelines = await fetchGuidelines();
    const calculatedAgeMonths = calculateAgeInMonths(birthDate);
    setAgeMonths(calculatedAgeMonths);

    const parsedValues = {};
    for (const [key, value] of Object.entries(values)) {
      parsedValues[key] = value ? parseFloat(value) : null;
    }

    const evaluationResults = evaluateValuesByGuidelines(calculatedAgeMonths, parsedValues, guidelines);
    setResults(evaluationResults);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analiz Sayfası</Text>
      <TextInput
        placeholder="Doğum Tarihi (YYYY-MM-DD)"
        value={birthDate}
        onChangeText={setBirthDate}
        style={styles.input}
      />
      {Object.keys(values).map((key) => (
        <TextInput
          key={key}
          placeholder={`${key} (g/L)`}
          value={values[key]}
          onChangeText={(text) => setValues({ ...values, [key]: text })}
          keyboardType="numeric"
          style={styles.input}
        />
      ))}
      <Button title="Değerlendir" onPress={handleEvaluate} disabled={loading} />
      <View style={styles.results}>
  {ageMonths !== null && (
    <Text style={styles.ageText}>{ageMonths} aylık:</Text>
  )}
  {Object.entries(results).map(([key, guidelineResults]) => (
    <View key={key} style={styles.card}>
      <Text style={styles.cardTitle}>{key} Sonuçları</Text>
      {Object.entries(guidelineResults).map(([guideline, result]) => (
        <View key={guideline} style={styles.resultRow}>
          <Text style={styles.resultGuideline}>{guideline} kılavuzuna göre:</Text>
          <Text
            style={[
              styles.resultStatus,
              result.status === "Normal"
                ? styles.normal
                : result.status === "Düşük"
                ? styles.low
                : result.status === "Yüksek"
                ? styles.high
                : styles.kilavuz,
            ]}
          >
            {result.status}
          </Text>
          <Text style={styles.resultDetails}>
            Referans Aralığı: {result.range} | Geometric Min: {result.geometricMin} - Geometric Max: {result.geometricMax}
          </Text>
          <Text style={styles.resultDetails}>
            Min Mean: {result.minMean} - Max Mean: {result.maxMean} | %95 CI: {result.confidenceInterval}
          </Text>
        </View>
      ))}
    </View>
  ))}
</View>
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    input: { marginBottom: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10 },
    results: { marginTop: 20 },
    ageText: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    card: {
      marginBottom: 15,
      padding: 15,
      backgroundColor: "#fff",
      borderRadius: 10,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      paddingBottom: 5,
    },
    resultRow: { marginBottom: 30 },
    resultGuideline: { fontSize: 19 , fontWeight: "bold", color:"blue"},
    resultStatus: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    resultDetails: { fontSize: 14, color: "black", fontWeight:"bold" },
    normal: { color: "green" },
    low: { color: "red" },
    high: { color: "orange" },
    kilavuz: {color: "purple"}
  });
