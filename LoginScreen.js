import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userRole = userDoc.data().role;

        if (userRole === "admin") {
          Alert.alert("Bilgi", "Admin paneline yönlendiriliyorsunuz.");
          navigation.reset({
            index: 0,
            routes: [{ name: "AdminPanel" }],
          });
        } else {
          Alert.alert("Bilgi", "Dashboard'a yönlendiriliyorsunuz.");
          navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          });
        }
      } else {
        setError("Kullanıcı rolü bulunamadı.");
      }
    } catch (err) {
      console.error("Giriş hatası:", err.message);
      setError("Giriş başarısız: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        label="E-posta"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        autoComplete="password"
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Giriş Yap
      </Button>
      <Button
         mode="outlined"
         onPress={() => navigation.navigate("Register")}
         style={styles.registerButton}
      >
        Kayıt Ol
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#6A1B9A", // Giriş Yap butonunun rengi
    borderRadius: 5, // Kenar yuvarlaklığı
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: "#f5f5f5", // Giriş Yap butonunun rengi
    borderRadius: 5, // Kenar yuvarlaklığı
  }
});

