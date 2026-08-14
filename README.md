# POS Central — Demo V1

Demo funcional de un sistema POS multi-local desarrollado con React + Vite, preparado para conectarse a Supabase.

## Funcionalidades incluidas

- Dashboard general.
- Punto de venta con carrito.
- Búsqueda por nombre/código de barras.
- Descuento de stock al confirmar una venta (modo demo/local).
- Gestión de productos.
- Stock separado por 3 locales.
- Alertas de stock bajo.
- Compras y distribución de mercadería.
- Transferencias entre locales.
- Ventas.
- Caja.
- Usuarios y roles.
- Auditoría.
- Reportes básicos.
- Impresión de comprobante tipo Factura X.
- Diseño responsive.
- Datos demo persistidos en localStorage para poder probar el flujo sin Supabase.

## Credenciales demo

Administrador:
- usuario: admin
- contraseña: demo

Vendedor:
- usuario: vendedor1
- contraseña: demo
- local: Local 1

## Ejecutar

```bash
npm install
npm run dev
```

Luego abrir la URL indicada por Vite.

## Supabase

La demo funciona sin Supabase. El proyecto ya incluye `@supabase/supabase-js` y `.env.example` para conectar la aplicación cuando armemos la V2.

Importante: para producción, los permisos no deben depender solamente del frontend. La versión con Supabase deberá implementar autenticación y Row Level Security (RLS).

## Próximo paso

Después de que el cliente pruebe esta Demo V1, conviene documentar los cambios solicitados y pasar a:

1. Esquema PostgreSQL definitivo.
2. Auth de Supabase.
3. RLS por rol/local.
4. Persistencia real.
5. Caja y stock transaccionales.
6. Auditoría.
7. Deploy de producción.
"# pos-multi-local" 
