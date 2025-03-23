# Sistema de Estadísticas - Frontend

Este es el frontend del Sistema de Estadísticas, una aplicación web para gestionar y visualizar estadísticas.

## Tecnologías Utilizadas

- React 18
- TypeScript
- Redux Toolkit
- Material-UI
- React Router
- Chart.js
- Formik & Yup
- MSW (Mock Service Worker)

## Requisitos

- Node.js 16 o superior
- npm 7 o superior

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/sistema-estadisticas.git
cd sistema-estadisticas/frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto:
```bash
VITE_API_URL=http://localhost:8000/api/v1
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la aplicación construida
- `npm run test`: Ejecuta las pruebas unitarias
- `npm run lint`: Ejecuta el linter
- `npm run format`: Formatea el código con Prettier

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas de la aplicación
├── store/         # Estado global con Redux
├── services/      # Servicios y APIs
├── hooks/         # Hooks personalizados
├── utils/         # Utilidades y helpers
├── types/         # Tipos de TypeScript
├── theme/         # Configuración del tema
├── mocks/         # Datos de prueba
└── routes/        # Configuración de rutas
```

## Características

- Autenticación de usuarios
- Dashboard personalizable
- Gestión de estadísticas
- Generación de reportes
- Visualización de datos con gráficos
- Diseño responsivo
- Temas personalizables

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. 