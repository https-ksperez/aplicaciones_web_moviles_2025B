# 🚀 Guía Rápida - Componentes Reutilizables

## 📝 Cómo Usar los Nuevos Componentes

### 1. Campos de Formulario

#### AmountField
```jsx
import { AmountField } from '../../components/forms/fields';

<AmountField
  value={monto}
  onChangeText={setMonto}
  error={errors.monto}
  label="Monto *"           // Opcional
  currency="$"              // Opcional
/>
```

#### DescriptionField
```jsx
import { DescriptionField } from '../../components/forms/fields';

<DescriptionField
  value={descripcion}
  onChangeText={setDescripcion}
  error={errors.descripcion}
  placeholder="Ingrese descripción"
  maxLength={100}
/>
```

#### CategorySelector
```jsx
import { CategorySelector } from '../../components/forms/fields';

const categorias = ['Alimentos', 'Transporte', 'Salud'];

<CategorySelector
  value={categoria}
  onChange={setCategoria}
  categories={categorias}
  label="Categoría"
/>
```

#### FrequencySelector
```jsx
import { FrequencySelector } from '../../components/forms/fields';

<FrequencySelector
  value={frecuencia}
  onChange={setFrecuencia}
  // Usa frecuencias por defecto o puedes pasar custom
/>
```

#### WeekDaySelector
```jsx
import { WeekDaySelector } from '../../components/forms/fields';

<WeekDaySelector
  selectedDays={[1, 3, 5]} // Lun, Mie, Vie
  onToggle={handleToggleDay}
  error={errors.dias}
/>
```

#### MonthDaySelector
```jsx
import { MonthDaySelector } from '../../components/forms/fields';

<MonthDaySelector
  selectedDay={15}
  onChange={setDia}
/>
```

#### DateField
```jsx
import { DateField } from '../../components/forms/fields';

<DateField
  value={fecha}
  onChangeText={setFecha}
  label="Fecha"
  helperText="Formato: YYYY-MM-DD"
/>
```

#### NotificationSwitch
```jsx
import { NotificationSwitch } from '../../components/forms/fields';

<NotificationSwitch
  value={notificaciones}
  onValueChange={setNotificaciones}
  label="🔔 Notificaciones"
  subLabel="Recibir alertas"
/>
```

#### ClassificationSelector
```jsx
import { ClassificationSelector } from '../../components/forms/fields';

<ClassificationSelector
  value={clasificacion}
  onChange={setClasificacion}
  label="Clasificación"
/>
```

---

### 2. Componentes de Dashboard

#### BalanceCard
```jsx
import { BalanceCard } from '../../components/dashboard';

<BalanceCard
  balance={1500.50}
  ingresos={3000}
  egresos={1450}
/>
```

#### QuickActionsGrid
```jsx
import { QuickActionsGrid } from '../../components/dashboard';

const acciones = [
  {
    icon: '💵',
    label: 'Ingreso',
    color: '#10b981',
    onPress: () => navigate('NuevoIngreso')
  },
  {
    icon: '💸',
    label: 'Egreso',
    color: '#ef4444',
    onPress: () => navigate('NuevoEgreso')
  }
];

<QuickActionsGrid actions={acciones} />
```

#### RecentTransactionsList
```jsx
import { RecentTransactionsList } from '../../components/dashboard';

const transacciones = [
  {
    id: 1,
    tipo: 'ingreso',
    descripcion: 'Salario',
    monto: 1500,
    categoria: 'Salario',
    fechaEjecucion: '2026-01-15'
  }
];

<RecentTransactionsList
  transactions={transacciones}
  onViewAll={() => navigate('Historial')}
/>
```

---

## 💡 Ejemplos de Uso Completo

### Crear un Formulario Nuevo

```jsx
import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  AmountField,
  DescriptionField,
  CategorySelector,
  FrequencySelector
} from '../components/forms/fields';
import { Card, Button } from '../components/ui';

export default function MiFormulario() {
  const [formData, setFormData] = useState({
    monto: '',
    descripcion: '',
    categoria: 'Otros',
    frecuencia: 'ocasional'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = () => {
    // Validar y enviar
  };

  return (
    <ScrollView>
      <Card>
        <AmountField
          value={formData.monto}
          onChangeText={(v) => handleChange('monto', v)}
          error={errors.monto}
        />
      </Card>

      <Card>
        <DescriptionField
          value={formData.descripcion}
          onChangeText={(v) => handleChange('descripcion', v)}
          error={errors.descripcion}
        />
      </Card>

      <Card>
        <CategorySelector
          value={formData.categoria}
          onChange={(v) => handleChange('categoria', v)}
          categories={['Alimentos', 'Transporte', 'Otros']}
        />
      </Card>

      <Card>
        <FrequencySelector
          value={formData.frecuencia}
          onChange={(v) => handleChange('frecuencia', v)}
        />
      </Card>

      <Button onPress={handleSubmit}>
        Guardar
      </Button>
    </ScrollView>
  );
}
```

### Crear un Dashboard Personalizado

```jsx
import { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import {
  BalanceCard,
  QuickActionsGrid,
  RecentTransactionsList
} from '../components/dashboard';

export default function MiDashboard({ navigation }) {
  const [datos, setDatos] = useState({
    balance: 0,
    ingresos: 0,
    egresos: 0,
    transacciones: []
  });

  const acciones = [
    {
      icon: '➕',
      label: 'Agregar',
      color: '#10b981',
      onPress: () => navigation.navigate('Agregar')
    },
    {
      icon: '📊',
      label: 'Reportes',
      color: '#6366f1',
      onPress: () => navigation.navigate('Reportes')
    }
  ];

  return (
    <ScrollView>
      <BalanceCard
        balance={datos.balance}
        ingresos={datos.ingresos}
        egresos={datos.egresos}
      />

      <QuickActionsGrid actions={acciones} />

      <RecentTransactionsList
        transactions={datos.transacciones}
        onViewAll={() => navigation.navigate('TodosLosMovimientos')}
      />
    </ScrollView>
  );
}
```

---

## 🎨 Personalización

### Estilos Personalizados

Todos los componentes aceptan props de estilo:

```jsx
<AmountField
  value={monto}
  onChangeText={setMonto}
  style={{ marginBottom: 20 }}
/>
```

### Props Opcionales

La mayoría de componentes tienen valores por defecto:

```jsx
// Mínimo necesario
<AmountField value={monto} onChangeText={setMonto} />

// Con todas las opciones
<AmountField
  value={monto}
  onChangeText={setMonto}
  error="Monto inválido"
  label="Monto personalizado"
  currency="€"
/>
```

---

## 🔍 Testing

### Ejemplo de Test para un Componente

```javascript
import { render, fireEvent } from '@testing-library/react-native';
import AmountField from './AmountField';

describe('AmountField', () => {
  it('debe renderizar correctamente', () => {
    const { getByPlaceholderText } = render(
      <AmountField value="" onChangeText={jest.fn()} />
    );
    
    expect(getByPlaceholderText('0.00')).toBeTruthy();
  });

  it('debe mostrar error cuando se proporciona', () => {
    const { getByText } = render(
      <AmountField 
        value="" 
        onChangeText={jest.fn()} 
        error="Campo requerido"
      />
    );
    
    expect(getByText('Campo requerido')).toBeTruthy();
  });

  it('debe llamar onChangeText cuando cambia el texto', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <AmountField value="" onChangeText={mockOnChange} />
    );
    
    fireEvent.changeText(getByPlaceholderText('0.00'), '100');
    expect(mockOnChange).toHaveBeenCalledWith('100');
  });
});
```

---

## 📚 Recursos Adicionales

- **REFACTORING_SUMMARY.md** - Documentación completa de la refactorización
- **src/components/** - Código fuente de todos los componentes
- **React Native Docs** - https://reactnative.dev/docs/getting-started

---

## 🆘 Problemas Comunes

### Import Error
```
Error: Cannot find module './fields'
```
**Solución:** Verifica que el archivo `index.js` exista en la carpeta `fields/`

### Props No Funcionan
```
Warning: Failed prop type
```
**Solución:** Revisa la documentación JSDoc en el componente para ver los tipos correctos

### Estilos No Se Aplican
**Solución:** Los componentes tienen estilos internos. Usa `style` prop para sobrescribir

---

*Última actualización: 4 de febrero de 2026*
