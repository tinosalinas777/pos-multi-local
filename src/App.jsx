import React, { useMemo, useState } from "react";
import {
  BarChart3, Boxes, Building2, Calculator, ChevronDown, CircleDollarSign,
  ClipboardList, FileText, LayoutDashboard, LogOut, Menu, Package,
  RefreshCw, Search, Settings, ShoppingCart, Truck, Users, X, Plus,
  Minus, Trash2, ArrowRightLeft, AlertTriangle, Printer, ShieldCheck,
  WalletCards, Activity, Store, CheckCircle2
} from "lucide-react";
import {
  demoUsers, locations, categories, initialProducts, initialSales,
  initialMovements, formatMoney, getLocationName
} from "./data";

const menu = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["pos", "Punto de venta", ShoppingCart],
  ["products", "Productos", Package],
  ["stock", "Stock", Boxes],
  ["purchases", "Compras", Truck],
  ["transfers", "Transferencias", ArrowRightLeft],
  ["sales", "Ventas", FileText],
  ["cash", "Caja", WalletCards],
  ["users", "Usuarios", Users],
  ["reports", "Reportes", BarChart3],
  ["audit", "Auditoría", ShieldCheck]
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState(initialProducts);
  const [sales, setSales] = useState(initialSales);
  const [movements, setMovements] = useState(initialMovements);
  const [login, setLogin] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  if (!currentUser) {
    return (
      <Login
        login={login}
        setLogin={setLogin}
        error={loginError}
        onSubmit={() => {
          const user = demoUsers.find(u => u.username === login.username && u.password === login.password && u.active);
          if (!user) return setLoginError("Usuario o contraseña incorrectos.");
          setCurrentUser(user);
          setLoginError("");
          setPage(user.role === "Vendedor" ? "pos" : "dashboard");
        }}
      />
    );
  }

  const isAdmin = currentUser.role === "Administrador";
  const visibleMenu = menu.filter(([key]) => isAdmin || ["pos", "stock", "sales", "cash"].includes(key));

  const updateProducts = updater => setProducts(prev => typeof updater === "function" ? updater(prev) : updater);

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} user={currentUser} menu={visibleMenu} onLogout={() => setCurrentUser(null)} />
      <main className="main">
        <Header page={page} user={currentUser} />
        <div className="content">
          {page === "dashboard" && <Dashboard products={products} sales={sales} movements={movements} />}
          {page === "pos" && <POS user={currentUser} products={products} setProducts={updateProducts} setSales={setSales} setMovements={setMovements} />}
          {page === "products" && <Products products={products} setProducts={updateProducts} />}
          {page === "stock" && <Stock products={products} />}
          {page === "purchases" && <Purchases products={products} setProducts={updateProducts} setMovements={setMovements} />}
          {page === "transfers" && <Transfers products={products} setProducts={updateProducts} setMovements={setMovements} />}
          {page === "sales" && <Sales sales={sales} />}
          {page === "cash" && <Cash sales={sales} />}
          {page === "users" && <UsersPage />}
          {page === "reports" && <Reports products={products} sales={sales} />}
          {page === "audit" && <Audit movements={movements} />}
        </div>
      </main>
    </div>
  );
}

function Login({ login, setLogin, error, onSubmit }) {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-mark"><Store size={25} /></div>
        <h1>POS Central</h1>
        <p className="muted">Demo V1 · Gestión multi-local</p>
        <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
          <label>Usuario</label>
          <input value={login.username} onChange={e => setLogin({ ...login, username: e.target.value })} placeholder="admin" />
          <label>Contraseña</label>
          <input type="password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} placeholder="demo" />
          {error && <div className="error-box">{error}</div>}
          <button className="primary full">Ingresar</button>
        </form>
        <div className="demo-hint">
          <b>Demo:</b> admin / demo<br />
          <b>Vendedor:</b> vendedor1 / demo
        </div>
      </div>
    </div>
  );
}

function Sidebar({ page, setPage, user, menu, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark small"><Store size={19} /></div>
        <div><b>POS Central</b><span>Demo V1</span></div>
      </div>
      <div className="location-badge"><Building2 size={15} /> {user.locationId ? getLocationName(user.locationId) : "Administración"}</div>
      <nav>
        {menu.map(([key, label, Icon]) => (
          <button key={key} className={page === key ? "nav-item active" : "nav-item"} onClick={() => setPage(key)}>
            <Icon size={18} /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="user-mini"><div className="avatar">{user.name[0]}</div><div><b>{user.name}</b><span>{user.role}</span></div></div>
        <button className="logout" onClick={onLogout}><LogOut size={17} /> Cerrar sesión</button>
      </div>
    </aside>
  );
}

function Header({ page, user }) {
  const labels = Object.fromEntries(menu.map(([k, v]) => [k, v]));
  return (
    <header className="topbar">
      <div>
        <div className="breadcrumb">POS Central / {labels[page] || page}</div>
        <h2>{labels[page] || page}</h2>
      </div>
      <div className="top-actions">
        <div className="status"><span className="status-dot" /> Sistema operativo</div>
        <div className="date">14 Ago 2026 · 14:00</div>
        <div className="avatar">{user.name[0]}</div>
      </div>
    </header>
  );
}

function Dashboard({ products, sales, movements }) {
  const totalToday = sales.filter(s => s.date.startsWith("2026-08-14")).reduce((a, b) => a + b.total, 0);
  const low = products.flatMap(p => locations.map(l => ({ ...p, location: l, qty: p.stock[l.id] }))).filter(x => x.qty <= x.minStock);
  return (
    <>
      <div className="page-intro"><div><h3>Resumen general</h3><p>Vista consolidada de los 3 locales.</p></div><button className="secondary"><RefreshCw size={16}/> Actualizar</button></div>
      <div className="stats-grid">
        <Stat title="Ventas de hoy" value={formatMoney(totalToday)} icon={CircleDollarSign} trend="+12,4%" />
        <Stat title="Productos activos" value={products.filter(p => p.active).length} icon={Package} trend="Catálogo" />
        <Stat title="Alertas de stock" value={low.length} icon={AlertTriangle} trend="Revisar" danger />
        <Stat title="Locales activos" value="3" icon={Building2} trend="Operativos" />
      </div>
      <div className="dashboard-grid">
        <Panel title="Ventas por local" action="Hoy">
          {locations.map(l => {
            const total = sales.filter(s => s.locationId === l.id && s.date.startsWith("2026-08-14")).reduce((a,b)=>a+b.total,0);
            const max = Math.max(...locations.map(x => sales.filter(s => s.locationId === x.id && s.date.startsWith("2026-08-14")).reduce((a,b)=>a+b.total,0)), 1);
            return <div className="bar-row" key={l.id}><span>{l.name}</span><div className="bar-track"><div className="bar" style={{width:`${Math.max(8,total/max*100)}%`}} /></div><b>{formatMoney(total)}</b></div>
          })}
        </Panel>
        <Panel title="Alertas de stock" action="Ver stock">
          {low.slice(0,6).map((x,i)=><div className="alert-row" key={i}><div className="alert-icon"><AlertTriangle size={16}/></div><div><b>{x.name}</b><span>{x.location.name} · mínimo {x.minStock}</span></div><strong>{x.qty}</strong></div>)}
          {!low.length && <Empty text="No hay alertas." />}
        </Panel>
      </div>
      <Panel title="Últimos movimientos" action="Auditoría">
        <Table headers={["Fecha","Tipo","Producto","Local","Cantidad","Usuario"]}>
          {movements.map(m=><tr key={m.id}><td>{m.date}</td><td><Badge text={m.type}/></td><td>{m.product}</td><td>{m.location}</td><td className={m.quantity<0?"negative":"positive"}>{m.quantity>0?"+":""}{m.quantity}</td><td>{m.user}</td></tr>)}
        </Table>
      </Panel>
    </>
  );
}

function Stat({ title, value, icon: Icon, trend, danger }) {
  return <div className="stat-card"><div className={"stat-icon "+(danger?"danger":"")}><Icon size={20}/></div><div><span>{title}</span><strong>{value}</strong><small>{trend}</small></div></div>
}

function Panel({ title, action, children }) {
  return <section className="panel"><div className="panel-head"><h3>{title}</h3>{action && <button className="link-button">{action} <ChevronDown size={14}/></button>}</div>{children}</section>
}

function Products({ products, setProducts }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const filtered = products.filter(p => (p.name+" "+p.barcode).toLowerCase().includes(search.toLowerCase()));
  return <>
    <div className="page-intro"><div><h3>Catálogo de productos</h3><p>Precios, costos y parámetros de reposición.</p></div><button className="primary" onClick={()=>setModal(true)}><Plus size={17}/> Nuevo producto</button></div>
    <div className="toolbar"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre o código..." /></div><select><option>Todas las categorías</option>{categories.map(c=><option key={c}>{c}</option>)}</select></div>
    <Panel title={`${filtered.length} productos`}>
      <Table headers={["Código","Producto","Categoría","Costo","Precio","Stock total","Estado",""]}>
        {filtered.map(p=><tr key={p.id}><td className="mono">{p.barcode}</td><td><b>{p.name}</b></td><td>{p.category}</td><td>{formatMoney(p.cost)}</td><td><b>{formatMoney(p.price)}</b></td><td>{Object.values(p.stock).reduce((a,b)=>a+b,0)}</td><td><Badge text={p.active?"Activo":"Inactivo"} /></td><td><button className="icon-button" title="Editar" onClick={()=>setModal(true)}><Settings size={16}/></button></td></tr>)}
      </Table>
    </Panel>
    {modal && <ProductModal onClose={()=>setModal(false)} onSave={data=>{setProducts(prev=>[...prev,{...data,id:Date.now(),stock:{1:0,2:0,3:0}}]);setModal(false)}} />}
  </>;
}

function ProductModal({ onClose, onSave }) {
  const [data,setData]=useState({name:"",barcode:"",category:"Bebidas",cost:0,price:0,minStock:5,active:true});
  return <Modal title="Nuevo producto" onClose={onClose}><div className="form-grid"><Field label="Nombre" value={data.name} onChange={v=>setData({...data,name:v})}/><Field label="Código de barras" value={data.barcode} onChange={v=>setData({...data,barcode:v})}/><Field label="Costo" type="number" value={data.cost} onChange={v=>setData({...data,cost:Number(v)})}/><Field label="Precio de venta" type="number" value={data.price} onChange={v=>setData({...data,price:Number(v)})}/><label>Categoría<select value={data.category} onChange={e=>setData({...data,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><Field label="Stock mínimo" type="number" value={data.minStock} onChange={v=>setData({...data,minStock:Number(v)})}/></div><div className="modal-actions"><button className="secondary" onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(data)}>Guardar producto</button></div></Modal>
}

function Stock({ products }) {
  const [location, setLocation] = useState("all");
  return <>
    <div className="page-intro"><div><h3>Stock por local</h3><p>Control consolidado y alertas de reposición.</p></div><select value={location} onChange={e=>setLocation(e.target.value)}><option value="all">Todos los locales</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
    <Panel title="Inventario actual">
      <Table headers={["Producto","Mínimo","Local 1","Local 2","Local 3","Total","Estado"]}>
        {products.map(p=>{const total=Object.values(p.stock).reduce((a,b)=>a+b,0);const shown=location==="all"?true:Number(location); return <tr key={p.id}><td><b>{p.name}</b><span className="sub">{p.barcode}</span></td><td>{p.minStock}</td>{locations.map(l=><td key={l.id} className={p.stock[l.id]<=p.minStock?"stock-low":"stock-ok"}>{shown===true||shown===l.id?p.stock[l.id]:"—"}</td>)}<td><b>{total}</b></td><td>{locations.some(l=>p.stock[l.id]<=p.minStock)?<Badge text="Reponer" danger/>:<Badge text="OK"/>}</td></tr>})}
      </Table>
    </Panel>
  </>;
}

function POS({ user, products, setProducts, setSales, setMovements }) {
  const locationId = user.locationId || 1;
  const [search,setSearch]=useState("");
  const [cart,setCart]=useState([]);
  const [payment,setPayment]=useState("Efectivo");
  const [notice,setNotice]=useState("");
  const available=products.filter(p=>p.active && p.stock[locationId]>0 && (p.name+" "+p.barcode).toLowerCase().includes(search.toLowerCase()));
  const total=cart.reduce((a,i)=>a+i.price*i.qty,0);

  const add=p=>setCart(prev=>{const existing=prev.find(i=>i.id===p.id); if(existing) return prev.map(i=>i.id===p.id?{...i,qty:Math.min(i.qty+1,p.stock[locationId])}:i); return [...prev,{...p,qty:1}];});
  const change=(id,delta)=>setCart(prev=>prev.map(i=>i.id===id?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0));
  const checkout=()=>{
    if(!cart.length)return;
    setProducts(prev=>prev.map(p=>{const item=cart.find(i=>i.id===p.id);return item?{...p,stock:{...p.stock,[locationId]:p.stock[locationId]-item.qty}}:p}));
    const number=String(1000+Date.now()%9000).padStart(6,"0");
    const sale={id:Date.now(),number,date:"2026-08-14 14:00",locationId,seller:user.name,total,payment,items:cart.reduce((a,b)=>a+b.qty,0)};
    setSales(prev=>[sale,...prev]);
    setMovements(prev=>[{id:Date.now(),date:"14/08/2026 14:00",type:"Venta",product:cart.map(x=>x.name).join(", "),location:getLocationName(locationId),quantity:-cart.reduce((a,b)=>a+b.qty,0),user:user.name},...prev]);
    setCart([]);setNotice(`Venta #${number} registrada correctamente.`);setTimeout(()=>setNotice(""),3000);
  };
  return <>
    <div className="pos-layout">
      <section className="pos-products panel">
        <div className="panel-head"><h3>Productos</h3><span className="pos-local"><Building2 size={15}/> {getLocationName(locationId)}</span></div>
        <div className="search big"><Search size={18}/><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Escanear código o buscar producto..." /></div>
        <div className="product-grid">{available.map(p=><button className="product-card" key={p.id} onClick={()=>add(p)}><div className="product-category">{p.category}</div><b>{p.name}</b><span>{formatMoney(p.price)}</span><small>Stock: {p.stock[locationId]}</small></button>)}</div>
      </section>
      <section className="cart panel">
        <div className="panel-head"><h3>Venta actual</h3><button className="icon-button" onClick={()=>setCart([])}><Trash2 size={17}/></button></div>
        {cart.length===0?<div className="empty-cart"><ShoppingCart size={38}/><b>Carrito vacío</b><span>Seleccioná productos para comenzar.</span></div>:<div className="cart-items">{cart.map(i=><div className="cart-item" key={i.id}><div><b>{i.name}</b><span>{formatMoney(i.price)}</span></div><div className="qty"><button onClick={()=>change(i.id,-1)}><Minus size={13}/></button><b>{i.qty}</b><button onClick={()=>change(i.id,1)}><Plus size={13}/></button></div><strong>{formatMoney(i.price*i.qty)}</strong></div>)}</div>}
        <div className="cart-bottom"><div className="total-line"><span>Total</span><strong>{formatMoney(total)}</strong></div><label>Medio de pago<select value={payment} onChange={e=>setPayment(e.target.value)}><option>Efectivo</option><option>Débito</option><option>Crédito</option><option>Transferencia</option><option>Mercado Pago</option></select></label><button className="primary checkout" disabled={!cart.length} onClick={checkout}><CheckCircle2 size={18}/> Cobrar {formatMoney(total)}</button>{notice&&<div className="success-box">{notice} <button onClick={()=>window.print()}><Printer size={14}/> Imprimir</button></div>}</div>
      </section>
    </div>
  </>;
}

function Purchases({ products, setProducts, setMovements }) {
  const [productId,setProductId]=useState(products[0].id),[qty,setQty]=useState(10),[localId,setLocalId]=useState(1),[saved,setSaved]=useState(false);
  const save=()=>{const p=products.find(x=>x.id===Number(productId));setProducts(prev=>prev.map(x=>x.id===p.id?{...x,stock:{...x.stock,[localId]:x.stock[localId]+Number(qty)}}:x));setMovements(prev=>[{id:Date.now(),date:"14/08/2026 14:00",type:"Compra",product:p.name,location:getLocationName(localId),quantity:Number(qty),user:"María Administradora"},...prev]);setSaved(true);setTimeout(()=>setSaved(false),2500)};
  return <><div className="page-intro"><div><h3>Compras</h3><p>Ingreso de mercadería y reposición de locales.</p></div><button className="primary" onClick={save}><Plus size={17}/> Registrar compra</button></div><Panel title="Nueva compra"><div className="form-grid"><label>Proveedor<select><option>Distribuidora Central</option><option>Mayorista Norte</option><option>Proveedor General</option></select></label><label>Producto<select value={productId} onChange={e=>setProductId(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><Field label="Cantidad" type="number" value={qty} onChange={v=>setQty(v)}/><label>Destino<select value={localId} onChange={e=>setLocalId(Number(e.target.value))}>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label></div>{saved&&<div className="success-box">Compra registrada y stock actualizado.</div>}</Panel><Panel title="Flujo recomendado"><div className="steps"><Step n="1" title="Registrar compra" text="Cargar proveedor, productos y cantidades."/><Step n="2" title="Distribuir" text="Asignar mercadería a cada local."/><Step n="3" title="Controlar" text="Verificar stock y alertas de reposición."/></div></Panel></>;
}

function Transfers({ products, setProducts, setMovements }) {
  const [productId,setProductId]=useState(products[0].id),[qty,setQty]=useState(5),[from,setFrom]=useState(1),[to,setTo]=useState(2),[msg,setMsg]=useState("");
  const transfer=()=>{if(from===to)return setMsg("El origen y destino deben ser diferentes.");const p=products.find(x=>x.id===Number(productId));if(p.stock[from]<qty)return setMsg("No hay stock suficiente en el local de origen.");setProducts(prev=>prev.map(x=>x.id===p.id?{...x,stock:{...x.stock,[from]:x.stock[from]-Number(qty),[to]:x.stock[to]+Number(qty)}}:x));setMovements(prev=>[{id:Date.now(),date:"14/08/2026 14:00",type:"Transferencia",product:p.name,location:`${getLocationName(from)} → ${getLocationName(to)}`,quantity:Number(qty),user:"María Administradora"},...prev]);setMsg("Transferencia registrada correctamente.")};
  return <><div className="page-intro"><div><h3>Transferencias</h3><p>Movimientos de mercadería entre locales.</p></div></div><Panel title="Nueva transferencia"><div className="transfer-flow"><div className="flow-box"><span>Origen</span><select value={from} onChange={e=>setFrom(Number(e.target.value))}>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></div><ArrowRightLeft className="transfer-arrow"/><div className="flow-box"><span>Destino</span><select value={to} onChange={e=>setTo(Number(e.target.value))}>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></div></div><div className="form-grid"><label>Producto<select value={productId} onChange={e=>setProductId(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.name} · stock {p.stock[from]}</option>)}</select></label><Field label="Cantidad" type="number" value={qty} onChange={v=>setQty(v)}/></div><button className="primary" onClick={transfer}>Confirmar transferencia</button>{msg&&<div className={msg.includes("correctamente")?"success-box":"error-box"}>{msg}</div>}</Panel></>;
}

function Sales({ sales }) {
  return <><div className="page-intro"><div><h3>Ventas</h3><p>Historial de operaciones realizadas.</p></div><button className="secondary"><Printer size={16}/> Exportar</button></div><Panel title="Historial de ventas"><Table headers={["Comprobante","Fecha","Local","Vendedor","Ítems","Medio de pago","Total"]}>{sales.map(s=><tr key={s.id}><td className="mono">X-{s.number}</td><td>{s.date}</td><td>{getLocationName(s.locationId)}</td><td>{s.seller}</td><td>{s.items}</td><td><Badge text={s.payment}/></td><td><b>{formatMoney(s.total)}</b></td></tr>)}</Table></Panel></>;
}

function Cash({ sales }) {
  const total=sales.filter(s=>s.date.startsWith("2026-08-14")).reduce((a,b)=>a+b.total,0);
  return <><div className="page-intro"><div><h3>Caja</h3><p>Apertura, movimientos y cierre por local.</p></div><button className="primary">Abrir caja</button></div><div className="stats-grid"><Stat title="Fondo inicial" value={formatMoney(50000)} icon={WalletCards} trend="Apertura"/><Stat title="Ventas del día" value={formatMoney(total)} icon={CircleDollarSign} trend="Todas las cajas"/><Stat title="Efectivo esperado" value={formatMoney(50000+total)} icon={Calculator} trend="Demo"/></div><Panel title="Estado de cajas"><Table headers={["Local","Estado","Apertura","Ventas","Último cierre"]}>{locations.map(l=><tr key={l.id}><td><b>{l.name}</b></td><td><Badge text="Abierta"/></td><td>$50.000</td><td>{formatMoney(sales.filter(s=>s.locationId===l.id).reduce((a,b)=>a+b.total,0))}</td><td>—</td></tr>)}</Table></Panel></>;
}

function UsersPage() {
  return <><div className="page-intro"><div><h3>Usuarios y permisos</h3><p>Control de acceso al sistema.</p></div><button className="primary"><Plus size={17}/> Nuevo usuario</button></div><Panel title="Usuarios"><Table headers={["Usuario","Rol","Local","Estado","Permisos"]}>{demoUsers.map(u=><tr key={u.id}><td><b>{u.name}</b><span className="sub">@{u.username}</span></td><td><Badge text={u.role}/></td><td>{u.locationId?getLocationName(u.locationId):"Todos"}</td><td><Badge text="Activo"/></td><td><button className="link-button">Ver permisos</button></td></tr>)}</Table></Panel><Panel title="Matriz de permisos"><div className="permission-grid">{[["Administrador","Acceso total"],["Encargado","Ventas · Stock · Caja · Reportes"],["Vendedor","Ventas · Stock de su local · Caja"]].map(x=><div className="permission-card" key={x[0]}><ShieldCheck size={18}/><b>{x[0]}</b><span>{x[1]}</span></div>)}</div></Panel></>;
}

function Reports({ products, sales }) {
  const byProduct=products.map(p=>({name:p.name, stock:Object.values(p.stock).reduce((a,b)=>a+b,0), margin:p.price-p.cost})).sort((a,b)=>b.stock-a.stock);
  return <><div className="page-intro"><div><h3>Reportes</h3><p>Indicadores básicos para la administración.</p></div><select><option>Agosto 2026</option><option>Julio 2026</option></select></div><div className="stats-grid"><Stat title="Ventas acumuladas demo" value={formatMoney(sales.reduce((a,b)=>a+b.total,0))} icon={CircleDollarSign} trend="Período"/><Stat title="Ticket promedio" value={formatMoney(sales.reduce((a,b)=>a+b.total,0)/sales.length)} icon={Calculator} trend="Por venta"/><Stat title="Margen unitario promedio" value={formatMoney(products.reduce((a,b)=>a+(b.price-b.cost),0)/products.length)} icon={BarChart3} trend="Productos"/></div><Panel title="Stock total por producto"><Table headers={["Producto","Stock total","Margen unitario","Valor potencial"]}>{byProduct.map(p=><tr key={p.name}><td><b>{p.name}</b></td><td>{p.stock}</td><td>{formatMoney(p.margin)}</td><td>{formatMoney(p.stock*p.margin)}</td></tr>)}</Table></Panel></>;
}

function Audit({ movements }) {
  return <><div className="page-intro"><div><h3>Auditoría</h3><p>Registro de movimientos sensibles y operaciones.</p></div><button className="secondary"><Activity size={16}/> Actualizar</button></div><Panel title="Registro de actividad"><Table headers={["Fecha","Acción","Producto","Local","Cantidad","Usuario"]}>{movements.map(m=><tr key={m.id}><td>{m.date}</td><td><Badge text={m.type}/></td><td>{m.product}</td><td>{m.location}</td><td>{m.quantity>0?"+":""}{m.quantity}</td><td><b>{m.user}</b></td></tr>)}</Table></Panel></>;
}

function Step({n,title,text}) { return <div className="step"><div className="step-number">{n}</div><div><b>{title}</b><span>{text}</span></div></div>; }
function Empty({text}) { return <div className="empty">{text}</div>; }
function Badge({text,danger}) { return <span className={"badge "+(danger?"badge-danger":"")}>{text}</span>; }
function Table({headers,children}) { return <div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>; }
function Field({label,value,onChange,type="text"}) { return <label>{label}<input type={type} value={value} onChange={e=>onChange(e.target.value)}/></label>; }
function Modal({title,onClose,children}) { return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><h3>{title}</h3><button className="icon-button" onClick={onClose}><X size={18}/></button></div>{children}</div></div>; }

export default App;
