import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {getOperations} from '../config/api';

const DashboardScreen = () => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await getOperations();
      setOperations(data);
      
      // Filter operasi hari ini
      const today = new Date().toISOString().split('T')[0];
      const todayOps = data.filter(op => {
        const opDate = new Date(op.operationDate).toISOString().split('T')[0];
        return opDate === today;
      });
      
      setOperations(todayOps);
    } catch (error) {
      console.error('Error loading operations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const totalToday = operations.length;
  const qualityOK = operations.filter(op => op.quality === 'OK').length;
  const qualityRate =
    totalToday > 0 ? ((qualityOK / totalToday) * 100).toFixed(1) : 0;

  const avgTemp =
    totalToday > 0
      ? (
          operations.reduce((sum, op) => sum + op.temperature, 0) / totalToday
        ).toFixed(1)
      : 0;

  const avgWeight =
    totalToday > 0
      ? (operations.reduce((sum, op) => sum + op.weight, 0) / totalToday).toFixed(
          2,
        )
      : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#059669']}
        />
      }>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard Produksi</Text>
        <Text style={styles.subtitle}>Data operasi hari ini</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* Total Produksi */}
        <View style={[styles.card, styles.cardPrimary]}>
          <Text style={styles.cardLabel}>Total Produksi</Text>
          <Text style={styles.cardValue}>{totalToday}</Text>
          <Text style={styles.cardSubtext}>operasi tercatat</Text>
        </View>

        {/* Quality Rate */}
        <View style={[styles.card, styles.cardSecondary]}>
          <Text style={styles.cardLabel}>Quality Rate</Text>
          <Text style={styles.cardValue}>{qualityRate}%</Text>
          <Text style={styles.cardSubtext}>
            {qualityOK} OK dari {totalToday} total
          </Text>
        </View>

        {/* Rata-rata Suhu */}
        <View style={[styles.card, styles.cardTertiary]}>
          <Text style={styles.cardLabel}>Rata-rata Suhu</Text>
          <Text style={styles.cardValue}>{avgTemp}°C</Text>
          <Text style={styles.cardSubtext}>temperatur produksi</Text>
        </View>

        {/* Rata-rata Berat */}
        <View style={[styles.card, styles.cardQuaternary]}>
          <Text style={styles.cardLabel}>Rata-rata Berat</Text>
          <Text style={styles.cardValue}>{avgWeight}</Text>
          <Text style={styles.cardSubtext}>kg per operasi</Text>
        </View>
      </View>

      {/* Recent Operations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operasi Terbaru</Text>
        {operations.length === 0 ? (
          <Text style={styles.noData}>Belum ada operasi hari ini</Text>
        ) : (
          operations.slice(0, 5).map(op => (
            <View key={op.id} style={styles.operationCard}>
              <View style={styles.operationHeader}>
                <Text style={styles.operationGroup}>
                  {op.group?.name || '-'}
                </Text>
                <View
                  style={[
                    styles.qualityBadge,
                    op.quality === 'OK' ? styles.badgeOK : styles.badgeNotOK,
                  ]}>
                  <Text style={styles.badgeText}>{op.quality}</Text>
                </View>
              </View>
              <View style={styles.operationDetails}>
                <Text style={styles.operationText}>
                  Shift {op.shift?.shiftNumber || '-'} • Line{' '}
                  {op.productionLine?.lineCode || '-'}
                </Text>
                <Text style={styles.operationText}>
                  {op.temperature}°C • {op.weight} kg
                </Text>
              </View>
              <View
                style={[
                  styles.inputMethodBadge,
                  op.inputMethod === 'MANUAL'
                    ? styles.badgeManual
                    : styles.badgeOCR,
                ]}>
                <Text style={styles.badgeText}>{op.inputMethod}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#059669',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 5,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardPrimary: {
    backgroundColor: '#10b981',
  },
  cardSecondary: {
    backgroundColor: '#34d399',
  },
  cardTertiary: {
    backgroundColor: '#6ee7b7',
  },
  cardQuaternary: {
    backgroundColor: '#047857',
  },
  cardLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
  },
  cardSubtext: {
    fontSize: 11,
    color: 'white',
    opacity: 0.8,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#111',
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  operationCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  operationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  operationGroup: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  operationDetails: {
    marginBottom: 8,
  },
  operationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeOK: {
    backgroundColor: '#10b981',
  },
  badgeNotOK: {
    backgroundColor: '#ef4444',
  },
  inputMethodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeManual: {
    backgroundColor: '#3b82f6',
  },
  badgeOCR: {
    backgroundColor: '#a855f7',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default DashboardScreen;
