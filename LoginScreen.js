import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    console.log("Giriş Yap butonuna basıldı!"); // Bu satır tetikleniyor mu kontrol edin
    if (!email || !password) {
      setError("E-posta ve şifre alanları boş bırakılamaz.");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Giriş başarılı:", user.email);
      setError(""); // Hata mesajını temizleyin
      navigation.navigate("Dashboard");
      console.log("Navigation çalıştı.");
    } catch (err) {
      console.error("Hata Kodu:", err.code, "Hata Mesajı:", err.message);
      if (err.code === "auth/user-not-found") {
        setError("Kullanıcı bulunamadı. Lütfen bilgilerinizi kontrol edin.");
      } else if (err.code === "auth/wrong-password") {
        setError("Yanlış şifre girdiniz.");
      } else if (err.code === "auth/invalid-email") {
        setError("Geçersiz e-posta formatı.");
      } else {
        setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }
      console.error("Giriş hatası:", err.message);
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
      <Button mode="contained" onPress={() => alert("Buton çalışıyor!")} style={styles.button}>
        Giriş Yap
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 10 }}
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
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});
