import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase.js';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// currency helper
const currency = v => `R$ ${Number(v||0).toFixed(2).replace('.',',')}`;

export default function App(){
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    // products from Firestore (if exists)
    const q = query(collection(db, 'products'), orderBy('title'));
    const unsub = onSnapshot(q, snap => setProducts(snap.docs.map(d=> ({ id:d.id, ...d.data()})) ));
    return ()=>unsub();
  },[]);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u=> setUser(u));
    return ()=>unsub();
  },[]);

  useEffect(()=>{
    if(!user){ setOrders([]); return; }
    const q = query(collection(db,'orders'), orderBy('createdAt','desc'));
    const unsub = onSnapshot(q, snap => setOrders(snap.docs.map(d=> ({ id:d.id, ...d.data()})) ));
    return ()=>unsub();
  },[user]);

  const addToCart = (p,qty=1)=> setCart(prev=>{ const c={...prev}; if(!c[p.id]) c[p.id]={...p, qty:0}; c[p.id].qty+=qty; return c; });
  const updateQty = (id,qty)=> setCart(prev=>{ const c={...prev}; if(!c[id]) return c; c[id].qty = qty; if(c[id].qty<=0) delete c[id]; return c; });

  const subtotal = ()=> Object.values(cart).reduce((s,i)=> s + i.price * i.qty, 0);

  const checkout = async (customer)=>{
    if(!customer || !customer.name) return alert('Informe o nome do cliente');
    const order = { customer, items: Object.values(cart).map(i=>({id:i.id,title:i.title,qty:i.qty,price:i.price})), total: subtotal(), createdAt: new Date() };
    try {
      await addDoc(collection(db,'orders'), order);
      setCart({});
      alert('Pedido criado');
    } catch(e){
      console.error(e);
      alert('Erro ao criar pedido');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Freitas logo" />
          <div>
            <h1 style={{margin:0, color:'var(--brand-teal)'}}>FREITAS</h1>
            <div style={{color:'var(--brand-gold)', fontSize:14}}>Produtos Personalizados</div>
          </div>
        </div>
        <nav>
          {user ? (
            <>
              <span style={{marginRight:8}} className="admin-badge">ADMIN</span>
              <button className="btn" onClick={()=> signOut(auth)}>Sair</button>
            </>
          ) : (
            <AuthForm />
          )}
        </nav>
      </header>

      <main>
        <section>
          <h2 style={{color:'var(--brand-teal)'}}>Catálogo</h2>
          <p>Adicione produtos no Firestore (coleção <code>products</code>) ou use a pasta <code>src/data</code> para conteúdo local.</p>

          <div className="products">
            {products.length === 0 ? (
              <>
                <div className="card">Nenhum produto no Firestore. Use <code>src/data/products.example.json</code> ou a console do Firebase.</div>
                <div className="card">Produto exemplo</div>
                <div className="card">Produto exemplo</div>
              </>
            ) : products.map(p=>(
              <div key={p.id} className="card">
                <div style={{height:120, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:6}}>
                  {p.imageUrl ? <img src={p.imageUrl} style={{maxHeight:110}} /> : <img src="/logo.png" style={{maxHeight:110}} />}
                </div>
                <div style={{fontWeight:600}}>{p.title}</div>
                <div style={{fontSize:12,color:'#667085'}}>{p.material}</div>
                <div style={{marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{fontWeight:700}}>{currency(p.price)}</div>
                  <button className="btn" onClick={()=> addToCart(p)}>Adicionar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Freitas - Produtos Personalizados</p>
      </footer>
    </div>
  );
}

// simple auth form
function AuthForm(){
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const doLogin = async ()=> {
    try{
      await signInWithEmailAndPassword(auth, email, pass);
    }catch(e){
      alert('Erro ao entrar: ' + (e.message || e));
    }
  };
  return (
    <div style={{display:'flex', gap:8}}>
      <input placeholder="admin@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:8,borderRadius:6,border:'1px solid #e5e7eb'}} />
      <input placeholder="senha" type="password" value={pass} onChange={e=>setPass(e.target.value)} style={{padding:8,borderRadius:6,border:'1px solid #e5e7eb'}} />
      <button className="btn" onClick={doLogin}>Entrar</button>
    </div>
  );
}
