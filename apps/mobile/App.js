
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system'; import * as Sharing from 'expo-sharing';
const brand = { bg:'#0B0F14', text:'#E6EDF7', brand:'#E8C547', accent:'#39FFF3' }
async function tokenROPC({kcUrl, realm, clientId, username, password}){
  const form = new URLSearchParams({ grant_type:'password', client_id:clientId, username, password });
  const r = await fetch(`${kcUrl}/realms/${realm}/protocol/openid-connect/token`, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:String(form) })
  const j = await r.json(); if(!j.access_token) throw new Error(JSON.stringify(j)); return j.access_token;
}
export default function App(){
  const [kcUrl]=useState('http://localhost:8081'), [realm]=useState('athena'), [clientId]=useState('web')
  const [username,setUsername]=useState('user1'), [password,setPassword]=useState('Passw0rd!')
  const [token,setToken]=useState(null), [accountId,setAccountId]=useState('acc-mobile-001')
  const [amount,setAmount]=useState('19.90'), [txid,setTxid]=useState('')
  const login = async()=>{ try{ setToken(await tokenROPC({kcUrl,realm,clientId,username,password})); Alert.alert('Login ok') }catch(e){ Alert.alert('Erro login', String(e)) } }
  const pdf = async()=>{
    if(!token){ Alert.alert('Login!'); return }
    const url = `http://localhost:9091/accounts/${accountId}/statement.pdf`
    const fileUri = FileSystem.documentDirectory + `extrato-${accountId}.pdf`
    const r = await FileSystem.downloadAsync(url, fileUri, { headers: { Authorization: `Bearer ${token}` } })
    await Sharing.shareAsync(r.uri)
  }
  const pix = async()=>{
    const r = await fetch('http://pix-service:8080/pix/charge',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ account_id:accountId, amount: parseFloat(amount) }) })
    const j = await r.json(); setTxid(j.txid); Alert.alert('PIX criado', j.txid)
  }
  const pixSettle = async()=>{
    if(!txid) { Alert.alert('crie charge'); return }
    await fetch('http://pix-service:8080/pix/webhook',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ txid, amount: parseFloat(amount) }) })
    Alert.alert('PIX liquidado (simulado)')
  }
  return <SafeAreaView style={{flex:1, backgroundColor:brand.bg}}>
    <View style={{padding:24}}>
      <Text style={{color:brand.brand, fontSize:28, fontWeight:'800'}}>Athena</Text>
      <Text style={{color:'#9DB2CE', marginBottom:6}}>Mobile HML</Text>
      <Text style={{color:brand.text}}>Usuário</Text>
      <TextInput value={username} onChangeText={setUsername} style={{color:brand.text, backgroundColor:'#111823', padding:12, borderRadius:12, marginBottom:8}}/>
      <Text style={{color:brand.text}}>Senha</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{color:brand.text, backgroundColor:'#111823', padding:12, borderRadius:12, marginBottom:8}}/>
      <TouchableOpacity onPress={login} style={{backgroundColor:brand.brand, padding:14, borderRadius:999, alignItems:'center', marginVertical:8}}><Text style={{color:'#0B0F14', fontWeight:'800'}}>Entrar</Text></TouchableOpacity>
      <Text style={{color:brand.text}}>Account ID</Text>
      <TextInput value={accountId} onChangeText={setAccountId} style={{color:brand.text, backgroundColor:'#111823', padding:12, borderRadius:12, marginBottom:8}}/>
      <Text style={{color:brand.text}}>Valor (BRL)</Text>
      <TextInput value={amount} onChangeText={setAmount} style={{color:brand.text, backgroundColor:'#111823', padding:12, borderRadius:12, marginBottom:8}}/>
      <TouchableOpacity onPress={pdf} style={{backgroundColor:brand.accent, padding:14, borderRadius:999, alignItems:'center', marginVertical:8}}><Text style={{color:'#0B0F14', fontWeight:'800'}}>Extrato PDF</Text></TouchableOpacity>
      <TouchableOpacity onPress={pix} style={{backgroundColor:brand.accent, padding:14, borderRadius:999, alignItems:'center', marginVertical:8}}><Text style={{color:'#0B0F14', fontWeight:'800'}}>Criar PIX</Text></TouchableOpacity>
      <TouchableOpacity onPress={pixSettle} style={{backgroundColor:brand.accent, padding:14, borderRadius:999, alignItems:'center', marginVertical:8}}><Text style={{color:'#0B0F14', fontWeight:'800'}}>Liquidar PIX (simulado)</Text></TouchableOpacity>
    </View>
  </SafeAreaView>
}
