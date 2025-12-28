# Configuración de Base de Datos

## Conexión a Supabase PostgreSQL

Para conectarte a Supabase, usa la URL completa de conexión en tu archivo `.env`:

```env
DATABASE_URL=postgresql://postgres.ebniussvnrwwtuocvckp:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres
DB_SSL=true
```

**Importante**: Reemplaza `[YOUR-PASSWORD]` con tu contraseña real de Supabase.

## Configuración Alternativa

Si prefieres usar variables individuales:

```env
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USERNAME=postgres.ebniussvnrwwtuocvckp
DB_PASSWORD=tu-contraseña-aquí
DB_NAME=postgres
DB_SSL=true
DB_LOGGING=false
```

## Verificar Conexión

Al iniciar el servidor, verás un mensaje indicando si la conexión fue exitosa:

```
✅ Conexión a la base de datos establecida correctamente.
```

También puedes verificar el estado en el endpoint de health check:

```bash
GET http://localhost:3000/health
```

La respuesta incluirá el estado de la base de datos:

```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "connected"
}
```

## Notas Importantes

- **SSL**: Supabase requiere SSL, por lo que `DB_SSL=true` es necesario
- **Pooler**: La URL proporcionada usa el pooler de Supabase (puerto 6543)
- **Seguridad**: Nunca commitees tu archivo `.env` con credenciales reales

