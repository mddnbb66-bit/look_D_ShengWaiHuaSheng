import { useState } from 'react'
import {login} from './api/login'

function App() {
	//loading代表登录状态 loading===true 代表登录提交
	// loading 表示登录请求是否正在处理中
    const [loading, setLoading] = useState(false)
	const [email, setEmail] = useState('')
	const [password ,setPassword] = useState('')
	//method
	async function handleSubmit(event){
		event.preventDefault()
		// console.log(email,password);
		setLoading(true)
		try{
        const res = await login(email,password)
		console.log(res);
		}finally{
			setLoading(false)
		}
	}
  return (
    <>
	<form  onSubmit={handleSubmit}>
	<h1>邮箱输入框</h1>
	<input type="email"  placeholder='请输入邮箱' value={email}  onChange={(event)=>setEmail(event.target.value)} required/>
	<h1>密码输入框</h1>
	<input type="password" placeholder='请输入密码' value={password} onChange={(event)=>setPassword(event.target.value)} required/>
	<button type='submit' disabled={loading}>{loading===true?'提交中':'提交'}</button>
	</form>
    </>
  )
}

export default App
