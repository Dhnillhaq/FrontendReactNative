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
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {groupAPI, shiftAPI, productionLineAPI, operationAPI} from '../config/api';
// import OCRCamera from '../components/OCRCamera';

const OperationFormScreen = ({navigation}) => {
  // Form state
  const [formData, setFormData] = useState({
    operationDate: new Date(),
    groupId: '',
    shiftId: '',
    productionLineId: '',
    temperature: '',
    weight: '',
    quality: 'OK',
  });

  // Master data state
  const [groups, setGroups] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [productionLines, setProductionLines] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingMaster, setLoadingMaster] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showOCRCamera, setShowOCRCamera] = useState(false);

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      setLoadingMaster(true);
      const [groupsRes, shiftsRes, linesRes] = await Promise.all([
        groupAPI.getActive(),
        shiftAPI.getActive(),
        productionLineAPI.getActive(),
      ]);

      setGroups(groupsRes.data);
      setShifts(shiftsRes.data);
      setProductionLines(linesRes.data);
    } catch (error) {
      console.error('Error loading master data:', error);
      Alert.alert('Error', 'Failed to load master data');
    } finally {
      setLoadingMaster(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleWeightFromOCR = (weight) => {
    setFormData(prev => ({...prev, weight: weight.toString()}));
    setShowOCRCamera(false);
    Alert.alert('Success', `Weight ${weight} kg has been set`);
  };

  const validateForm = () => {
    if (!formData.groupId) {
      Alert.alert('Validation Error', 'Please select a group');
      return false;
    }
    if (!formData.shiftId) {
      Alert.alert('Validation Error', 'Please select a shift');
      return false;
    }
    if (!formData.productionLineId) {
      Alert.alert('Validation Error', 'Please select a production line');
      return false;
    }
    if (!formData.temperature || isNaN(parseFloat(formData.temperature))) {
      Alert.alert('Validation Error', 'Please enter a valid temperature');
      return false;
    }
    if (!formData.weight || isNaN(parseFloat(formData.weight))) {
      Alert.alert('Validation Error', 'Please enter a valid weight');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const payload = {
        operationDate: formData.operationDate.toISOString().split('T')[0],
        groupId: parseInt(formData.groupId),
        shiftId: parseInt(formData.shiftId),
        productionLineId: parseInt(formData.productionLineId),
        temperature: parseFloat(formData.temperature),
        weight: parseFloat(formData.weight),
        quality: formData.quality,
        inputMethod: 'OCR', // Since this is mobile app
      };

      await operationAPI.create(payload);
      
      Alert.alert('Success', 'Operation data saved successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFormData({
              operationDate: new Date(),
              groupId: '',
              shiftId: '',
              productionLineId: '',
              temperature: '',
              weight: '',
              quality: 'OK',
            });
            navigation.navigate('Dashboard');
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving operation:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save operation data');
    } finally {
      setLoading(false);
    }
  };

  if (loadingMaster) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Operation Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar-outline" size={20} color="#007AFF" />
            <Text style={styles.dateText}>
              {formData.operationDate.toLocaleDateString('id-ID')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Group</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.groupId}
              onValueChange={value => handleInputChange('groupId', value)}
              style={styles.picker}>
              <Picker.Item label="Select Group" value="" />
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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Shift</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.shiftId}
              onValueChange={value => handleInputChange('shiftId', value)}
              style={styles.picker}>
              <Picker.Item label="Select Shift" value="" />
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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Production Line</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.productionLineId}
              onValueChange={value =>
                handleInputChange('productionLineId', value)
              }
              style={styles.picker}>
              <Picker.Item label="Select Production Line" value="" />
              {productionLines.map(line => (
                <Picker.Item
                  key={line.id}
                  label={`Line ${line.lineCode}`}
                  value={line.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Temperature (°C)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter temperature"
            keyboardType="numeric"
            value={formData.temperature}
            onChangeText={value => handleInputChange('temperature', value)}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.weightHeader}>
            <Text style={styles.sectionTitle}>Weight (kg)</Text>
            {/* <TouchableOpacity
              style={styles.ocrButton}
              onPress={() => setShowOCRCamera(true)}>
              <Icon name="camera" size={20} color="#FFF" />
              <Text style={styles.ocrButtonText}>Scan with OCR</Text>
            </TouchableOpacity> */}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter weight or scan"
            keyboardType="decimal-pad"
            value={formData.weight}
            onChangeText={value => handleInputChange('weight', value)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quality</Text>
          <View style={styles.qualityButtons}>
            <TouchableOpacity
              style={[
                styles.qualityButton,
                formData.quality === 'OK' && styles.qualityButtonActive,
              ]}
              onPress={() => handleInputChange('quality', 'OK')}>
              <Icon
                name="checkmark-circle"
                size={24}
                color={formData.quality === 'OK' ? '#FFF' : '#4CAF50'}
              />
              <Text
                style={[
                  styles.qualityButtonText,
                  formData.quality === 'OK' && styles.qualityButtonTextActive,
                ]}>
                OK
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.qualityButton,
                formData.quality === 'NOT OK' && styles.qualityButtonActiveRed,
              ]}
              onPress={() => handleInputChange('quality', 'NOT OK')}>
              <Icon
                name="close-circle"
                size={24}
                color={formData.quality === 'NOT OK' ? '#FFF' : '#F44336'}
              />
              <Text
                style={[
                  styles.qualityButtonText,
                  formData.quality === 'NOT OK' &&
                    styles.qualityButtonTextActive,
                ]}>
                NOT OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Icon name="save-outline" size={24} color="#FFF" />
              <Text style={styles.submitButtonText}>Save Operation</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      <DatePicker
        modal
        open={showDatePicker}
        date={formData.operationDate}
        mode="date"
        onConfirm={date => {
          setShowDatePicker(false);
          handleInputChange('operationDate', date);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      {/* OCR Camera Modal */}
      {/* <Modal
        visible={showOCRCamera}
        animationType="slide"
        onRequestClose={() => setShowOCRCamera(false)}>
        <OCRCamera
          onWeightDetected={handleWeightFromOCR}
          onClose={() => setShowOCRCamera(false)}
        />
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ocrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ocrButtonText: {
    color: '#FFF',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  qualityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 8,
  },
  qualityButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  qualityButtonActiveRed: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  qualityButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  qualityButtonTextActive: {
    color: '#FFF',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default OperationFormScreen;