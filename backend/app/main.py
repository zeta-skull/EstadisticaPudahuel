from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import Dict, Any

# Importación de rutas
from app.api.v1 import auth, dashboard, reports, data

app = FastAPI(
    title="Sistema de Estadísticas - Corporación Municipal de Desarrollo Social de Pudahuel",
    description="API para el sistema de gestión y visualización de estadísticas",
    version="1.0.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Manejo de errores de validación
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Error de validación en los datos enviados",
            "errors": exc.errors()
        }
    )

# Rutas de la API
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticación"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reportes"])
app.include_router(data.router, prefix="/api/v1/data", tags=["Datos"])

@app.get("/")
async def root() -> Dict[str, Any]:
    return {
        "message": "Bienvenido al Sistema de Estadísticas",
        "version": "1.0.0",
        "status": "activo"
    }

@app.get("/health")
async def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "version": "1.0.0"
    } 