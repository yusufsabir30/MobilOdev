import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { fetchGuidelines } from "../utils/firebase";
import { evaluateValuesByGuidelines } from "../utils/evaluation";

export default function AnalysisPage() {
    const [ageMonths, setAgeMonths] = useState("");
    const [values, setValues] = useState({
        IgA: "",
        IgM: "",
        IgG: "",
        IgG1: "",
        IgG2: "",
        IgG3: "",
        IgG4: "",
    });
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);

    const handleEvaluate = async () => {
        setLoading(true);
        const guidelines = await fetchGuidelines();
        const parsedAge = parseInt(ageMonths, 10);
        const parsedValues = {};

        for (const [key, value] of Object.entries(values)) {
            parsedValues[key] = value ? parseFloat(value) : null;
        }

        const evaluationResults = evaluateValuesByGuidelines(parsedAge, parsedValues, guidelines);
        setResults(evaluationResults);
        setLoading(false);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Analiz Sayfası</Text>
            <TextInput
                placeholder="Yaş (ay cinsinden)"
                value={ageMonths}
                onChangeText={setAgeMonths}
                keyboardType="numeric"
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
                {Object.keys(results).map((key) => (
                    <View key={key} style={styles.resultGroup}>
                        <Text style={styles.resultTitle}>{key} Sonuçları:</Text>
                        {Object.entries(results[key]).map(([guidelineName, status]) => (
                            <Text key={guidelineName} style={styles.resultText}>
                                {key}, {guidelineName} kılavuzuna göre = {status}
                            </Text>
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
    resultGroup: { marginBottom: 20 },
    resultTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    resultText: { fontSize: 16 },
});
