import React, { useEffect, useMemo, useState } from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native'
import { signIn, signOut, getToken } from './auth'
import api from './api'
import { themes, Theme } from './theme'
import { CARD_BASE, CONFIG_BASE } from './config'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function Brand({theme}:{theme:Theme}){
  return <Text style={{fontWeight:'800', fontSize:22, color: theme.primary}}>Athena</Text>
}

function ScreenShell({children, theme, onLogout}:{children:React.ReactNode, theme:Theme, onLogout:()=>void}){
  return <SafeAreaView style={{flex:1, backgroundColor: theme.bg}}>
    <View style={{padding:16, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
      <Brand theme={theme}/>
      <TouchableOpacity onPress={onLogout}><Text style={{color: theme.muted}}>Sair</Text></TouchableOpacity>
    </View>
    <View style={{flex:1, padding:16}}>{children}</View>
  </SafeAreaView>
}

function Home({theme}:{theme:Theme}){
  return <View style={{gap:12}}>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16}}>
      <Text style={{color: theme.muted}}>Saldo conta</Text>
      <Text style={{fontSize:28, fontWeight:'800', color: theme.text}}>R$ 12.430,22</Text>
    </View>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16}}>
      <Text style={{color: theme.muted}}>Limite crédito</Text>
      <Text style={{fontSize:28, fontWeight:'800', color: theme.text}}>R$ 7.500,00</Text>
    </View>
  </View>
}

function Accounts({theme}:{theme:Theme}){
  const [acc,setAcc]=useState('acc-mobile-001')
  const [bal,setBal]=useState<any>(null)
  const [tx,setTx]=useState<any[]>([])
  const [to,setTo]=useState('acc-002')
  const [amt,setAmt]=useState('100')
  const load=async()=>{
    const b=await api.get(`/balances/${acc}`); setBal(b.data)
    const s=await api.get(`/statement/${acc}`); setTx(s.data)
  }
  const transfer=async()=>{ await api.post('/transfer',{from_account:acc,to_account:to,amount:parseFloat(amt),currency:'BRL',description:'RN Transfer'}); await load() }
  useEffect(()=>{ load() },[])
  return <ScrollView contentContainerStyle={{gap:12}}>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16}}>
      <Text style={{color: theme.muted}}>Conta</Text>
      <TextInput value={acc} onChangeText={setAcc} style={{borderWidth:1, borderColor:'#ddd', borderRadius:12, padding:10, color: theme.text}}/>
      <TouchableOpacity onPress={load} style={{marginTop:10, backgroundColor: theme.primary, borderRadius:999, padding:12}}>
        <Text style={{textAlign:'center', color:'#0B0F14', fontWeight:'800'}}>Atualizar</Text>
      </TouchableOpacity>
    </View>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16}}>
      <Text style={{color: theme.muted}}>Saldo</Text>
      <Text style={{fontSize:28, fontWeight:'800', color: theme.text}}>{bal?`R$ ${bal.available}`:'—'}</Text>
    </View>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16, gap:8}}>
      <Text style={{fontWeight:'700', color: theme.text}}>Transferir</Text>
      <TextInput placeholder='Para (conta)' placeholderTextColor={theme.muted} value={to} onChangeText={setTo} style={{borderWidth:1,borderColor:'#ddd',borderRadius:12,padding:10,color:theme.text}}/>
      <TextInput placeholder='Valor' placeholderTextColor={theme.muted} value={amt} onChangeText={setAmt} keyboardType='decimal-pad' style={{borderWidth:1,borderColor:'#ddd',borderRadius:12,padding:10,color:theme.text}}/>
      <TouchableOpacity onPress={transfer} style={{backgroundColor: theme.accent, borderRadius:999, padding:12}}>
        <Text style={{textAlign:'center', color:'#0B0F14', fontWeight:'800'}}>Enviar</Text>
      </TouchableOpacity>
    </View>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16}}>
      <Text style={{fontWeight:'700', color: theme.text}}>Extrato</Text>
      {tx.map(t=><Text key={t.id} style={{color: theme.text}}>{t.type} • R$ {t.amount} • {t.description}</Text>)}
    </View>
  </ScrollView>
}

function Cards({theme}:{theme:Theme}){
  const [cid,setCid]=useState('cust-mobile-001')
  const [cards,setCards]=useState<any[]>([])
  const refresh=async()=>{ const r=await fetch(`${CARD_BASE}/cards/${cid}`); setCards(await r.json()) }
  const request=async()=>{ await fetch(`${CARD_BASE}/cards`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customer_id:cid,product:'Gold',brand:'Visa',limit_total:5000})}); await refresh() }
  const virt=async(id:string)=>{ await fetch(`${CARD_BASE}/cards/virtual`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customer_id:cid,linked_card_id:id})}); await refresh() }
  useEffect(()=>{ refresh() },[])
  return <ScrollView contentContainerStyle={{gap:12}}>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16, gap:8}}>
      <Text style={{color: theme.muted}}>Cliente</Text>
      <TextInput value={cid} onChangeText={setCid} style={{borderWidth:1, borderColor:'#ddd', borderRadius:12, padding:10, color: theme.text}}/>
      <View style={{flexDirection:'row', gap:8}}>
        <TouchableOpacity onPress={request} style={{backgroundColor: theme.primary, borderRadius:999, padding:12, flex:1}}><Text style={{textAlign:'center', fontWeight:'800'}}>Solicitar Gold</Text></TouchableOpacity>
        <TouchableOpacity onPress={refresh} style={{backgroundColor: theme.accent, borderRadius:999, padding:12, flex:1}}><Text style={{textAlign:'center', fontWeight:'800'}}>Atualizar</Text></TouchableOpacity>
      </View>
    </View>
    {cards.map(c=>(<View key={c.id} style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16, gap:6}}>
      <Text style={{fontWeight:'700', color: theme.text}}>{c.product} • {c.brand}</Text>
      <Text style={{color: theme.muted}}>Final {c.last4}</Text>
      <Text style={{color: theme.text}}>Limite: R$ {c.limit_total}</Text>
      <TouchableOpacity onPress={()=>virt(c.id)} style={{marginTop:6, backgroundColor: theme.accent, borderRadius:999, padding:10}}>
        <Text style={{textAlign:'center', fontWeight:'800'}}>Criar virtual</Text>
      </TouchableOpacity>
    </View>))}
  </ScrollView>
}

function Payments({theme}:{theme:Theme}){
  return <View style={{gap:12}}>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16}}><Text style={{fontWeight:'700', color: theme.text}}>Pix</Text><Text style={{color: theme.muted}}>Gere QR (integração real no gateway).</Text></View>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16}}><Text style={{fontWeight:'700', color: theme.text}}>Boleto</Text><Text style={{color: theme.muted}}>Emissão de boleto (stub UI).</Text></View>
  </View>
}

function Settings({theme,setTheme,accountId,setAccountId}:{theme:Theme,setTheme:(t:Theme)=>void,accountId:string,setAccountId:(s:string)=>void}){
  const saveTheme = async (key: string)=>{
    setTheme(themes[key])
    // sync with config-service
    try {
      // create theme if not exists and assign account theme
      await fetch(`${CONFIG_BASE}/account-theme`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ account_id: accountId, theme_id: key }) })
    } catch(e){}
  }
  return <View style={{gap:12}}>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16, gap:8}}>
      <Text style={{fontWeight:'700', color: theme.text}}>Conta</Text>
      <TextInput value={accountId} onChangeText={setAccountId} style={{borderWidth:1, borderColor:'#ddd', borderRadius:12, padding:10, color: theme.text}}/>
    </View>
    <View style={{backgroundColor: theme.surface, borderRadius: theme.cardRadius, padding:16, gap:12}}>
      <Text style={{fontWeight:'700', color: theme.text}}>Tema</Text>
      {Object.entries(themes).map(([k,v])=>(
        <TouchableOpacity key={k} onPress={()=>saveTheme(k)} style={{padding:12, borderRadius:12, borderWidth:1, borderColor:'#eee', backgroundColor: v.bg}}>
          <Text style={{fontWeight:'700', color: v.text}}>{v.name}</Text>
          <Text style={{color: v.text}}>primary {v.primary} • accent {v.accent}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
}

function Tabs({theme,setTheme}:{theme:Theme,setTheme:(t:Theme)=>void}){
  const [accountId,setAccountId] = useState('acc-mobile-001')
  return <Tab.Navigator screenOptions={{ headerShown:false }}>
    <Tab.Screen name="Início">{()=> <ScreenShell theme={theme} onLogout={async()=>{ await signOut() }}><Home theme={theme}/></ScreenShell>}</Tab.Screen>
    <Tab.Screen name="Contas">{()=> <ScreenShell theme={theme} onLogout={async()=>{ await signOut() }}><Accounts theme={theme}/></ScreenShell>}</Tab.Screen>
    <Tab.Screen name="Pagamentos">{()=> <ScreenShell theme={theme} onLogout={async()=>{ await signOut() }}><Payments theme={theme}/></ScreenShell>}</Tab.Screen>
    <Tab.Screen name="Cartões">{()=> <ScreenShell theme={theme} onLogout={async()=>{ await signOut() }}><Cards theme={theme}/></ScreenShell>}</Tab.Screen>
    <Tab.Screen name="Ajustes">{()=> <ScreenShell theme={theme} onLogout={async()=>{ await signOut() }}><Settings theme={theme} setTheme={setTheme} accountId={accountId} setAccountId={setAccountId}/></ScreenShell>}</Tab.Screen>
  </Tab.Navigator>
}

function LoginScreen({onLogged}:{onLogged:()=>void}){
  const [busy,setBusy]=useState(false)
  const login=async()=>{ setBusy(true); try{ const t=await signIn(); if(t) onLogged() } finally{ setBusy(false) } }
  return <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#FFF7EC'}}>
    <Text style={{fontSize:32, fontWeight:'800'}}>Athena</Text>
    <Text style={{marginTop:8, color:'#516078'}}>Banco digital seguro</Text>
    <TouchableOpacity disabled={busy} onPress={login} style={{marginTop:24, backgroundColor:'#F5D25A', borderRadius:999, paddingVertical:14, paddingHorizontal:24}}>
      <Text style={{fontWeight:'800'}}>Entrar com Keycloak</Text>
    </TouchableOpacity>
  </SafeAreaView>
}

export default function App(){
  const [token,setToken]=useState<string|null>(null)
  const [theme,setTheme] = useState(themes.neoGold)
  useEffect(()=>{ (async()=>{ setToken(await getToken()) })() },[])
  const navTheme = useMemo(()=>({ ...DefaultTheme, colors:{ ...DefaultTheme.colors, background: theme.bg, text: theme.text } }),[theme])
  if(!token){
    return <LoginScreen onLogged={async()=> setToken(await getToken()) }/>
  }
  return <NavigationContainer theme={navTheme}><Tabs theme={theme} setTheme={setTheme}/></NavigationContainer>
}
