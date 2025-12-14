import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const OCRCameraScreen = ({navigation}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedText, setScannedText] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // OCR.space API - FREE API Key (bisa ganti dengan punya sendiri)
  const OCR_API_KEY = 'K87899142388957';
  const OCR_API_URL = 'https://api.ocr.space/parse/image';

  const processOCR = async (imageBase64) => {
    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append('base64Image', `data:image/jpeg;base64,${imageBase64}`);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2');

      const response = await fetch(OCR_API_URL, {
        method: 'POST',
        headers: {
          apikey: OCR_API_KEY,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.IsErroredOnProcessing) {
        throw new Error(result.ErrorMessage?.[0] || 'OCR failed');
      }

      const text = result.ParsedResults?.[0]?.ParsedText || '';
      setScannedText(text);

      // Extract numbers from text
      const numbers = text.match(/\d+\.?\d*/g);

      if (numbers && numbers.length >= 2) {
        const temperature = parseFloat(numbers[0]);
        const weight = parseFloat(numbers[1]);

        Alert.alert(
          'Data Terdeteksi',
          `Suhu: ${temperature}°C\nBerat: ${weight} kg\n\nApakah data ini benar?`,
          [
            {
              text: 'Batal',
              style: 'cancel',
            },
            {
              text: 'Ya, Gunakan',
              onPress: () => {
                navigation.navigate('AddOperation', {
                  ocrData: {
                    temperature: temperature.toString(),
                    weight: weight.toString(),
                  },
                });
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Text Terdeteksi',
          `${text}\n\nTidak dapat mendeteksi data suhu dan berat secara otomatis.`,
        );
      }
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Error', 'Gagal melakukan OCR: ' + error.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleTakePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
        saveToPhotos: false,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setImageUri(asset.uri);
          processOCR(asset.base64);
        }
      },
    );
  };

  const handlePickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setImageUri(asset.uri);
          processOCR(asset.base64);
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>OCR Scanner</Text>
        <Text style={styles.subtitle}>
          Ambil foto atau pilih gambar untuk scan text
        </Text>
      </View>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{uri: imageUri}} style={styles.previewImage} />
        </View>
      )}

      {scannedText ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Text Terdeteksi:</Text>
          <Text style={styles.resultText}>{scannedText}</Text>
        </View>
      ) : null}

      {isScanning && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Memproses OCR...</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          onPress={handleTakePhoto}
          disabled={isScanning}>
          <Text style={styles.buttonText}>📷 Ambil Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.galleryButton]}
          onPress={handlePickImage}
          disabled={isScanning}>
          <Text style={styles.buttonText}>🖼️ Pilih dari Galeri</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Batal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#0d9488',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  previewImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  resultContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6b7280',
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#059669',
  },
  galleryButton: {
    backgroundColor: '#0d9488',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#d1d5db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OCRCameraScreen;
