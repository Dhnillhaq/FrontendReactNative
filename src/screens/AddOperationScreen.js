import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import {
  getGroups,
  getShifts,
  getProductionLines,
  createOperation,
} from '../config/api';

const AddOperationScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [productionLines, setProductionLines] = useState([]);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [shiftId, setShiftId] = useState('');
  const [productionLineId, setProductionLineId] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [quality, setQuality] = useState('OK');
  const [inputMethod, setInputMethod] = useState('MANUAL');

  useEffect(() => {
    loadMasterData();
    
    // Check if coming from OCR with extracted data
    if (route.params?.ocrData) {
      const {temperature: ocrTemp, weight: ocrWeight} = route.params.ocrData;
      if (ocrTemp) setTemperature(ocrTemp);
      if (ocrWeight) setWeight(ocrWeight);
      setInputMethod('OCR');
    }
  }, [route.params]);

  const loadMasterData = async () => {
    try {
      const [groupsData, shiftsData, linesData] = await Promise.all([
        getGroups(),
        getShifts(),
        getProductionLines(),
      ]);
      setGroups(groupsData);
      setShifts(shiftsData);
      setProductionLines(linesData);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data master');
    }
  };

  const handleSubmit = async () => {
    if (
      !groupId ||
      !shiftId ||
      !productionLineId ||
      !temperature ||
      !weight
    ) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    setLoading(true);
    try {
      await createOperation({
        operation_date: date.toISOString().split('T')[0],
        group_id: parseInt(groupId),
        shift_id: parseInt(shiftId),
        production_line_id: parseInt(productionLineId),
        temperature: parseFloat(temperature),
        weight: parseFloat(weight),
        quality,
        input_method: inputMethod,
      });

      Alert.alert('Sukses', 'Operasi berhasil ditambahkan', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Gagal menambahkan operasi',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Date */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tanggal Operasi</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString('id-ID')}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            mode="date"
            open={showDatePicker}
            date={date}
            onConfirm={selectedDate => {
              setShowDatePicker(false);
              setDate(selectedDate);
            }}
            onCancel={() => setShowDatePicker(false)}
          />
        </View>

        {/* Group */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Group</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={groupId}
              onValueChange={value => setGroupId(value)}
              style={styles.picker}>
              <Picker.Item label="Pilih Group" value="" />
              {groups.map(group => (
                <Picker.Item
                  key={group.id}
                  label={group.name}
                  value={group.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Shift */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Shift</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={shiftId}
              onValueChange={value => setShiftId(value)}
              style={styles.picker}>
              <Picker.Item label="Pilih Shift" value="" />
              {shifts.map(shift => (
                <Picker.Item
                  key={shift.id}
                  label={`Shift ${shift.shiftNumber}`}
                  value={shift.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Production Line */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Production Line</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={productionLineId}
              onValueChange={value => setProductionLineId(value)}
              style={styles.picker}>
              <Picker.Item label="Pilih Line" value="" />
              {productionLines.map(line => (
                <Picker.Item
                  key={line.id}
                  label={line.lineCode}
                  value={line.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Temperature */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Suhu (°C)</Text>
          <TextInput
            style={styles.input}
            value={temperature}
            onChangeText={setTemperature}
            keyboardType="numeric"
            placeholder="Masukkan suhu"
          />
        </View>

        {/* Weight */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Berat (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="Masukkan berat"
          />
        </View>

        {/* Quality */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Kualitas</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={quality}
              onValueChange={value => setQuality(value)}
              style={styles.picker}>
              <Picker.Item label="OK" value="OK" />
              <Picker.Item label="NOT OK" value="NOT_OK" />
            </Picker>
          </View>
        </View>

        {/* Input Method */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Metode Input</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={inputMethod}
              onValueChange={value => setInputMethod(value)}
              style={styles.picker}>
              <Picker.Item label="MANUAL" value="MANUAL" />
              <Picker.Item label="OCR" value="OCR" />
            </Picker>
          </View>
        </View>

        {/* OCR Button */}
        <TouchableOpacity
          style={styles.ocrButton}
          onPress={() => navigation.navigate('OCRCamera')}>
          <Text style={styles.ocrButtonText}>📷 Scan dengan OCR</Text>
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Simpan</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  ocrButton: {
    backgroundColor: '#a855f7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  ocrButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 10,
  },
  submitButton: {
    backgroundColor: '#059669',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddOperationScreen;
